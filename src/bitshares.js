import Event from "./event.js";
import Asset from "./asset.js";
import Account from "./account.js";
import Fees from "./fees.js";
import Transaction from "./transaction";
import TransactionBuilder from "./transaction/TransactionBuilder.js";
import { checkNodes, checkNode } from "./NodeManager.js";
import { WS_NODE_LIST } from "./nodes.js";
import { LZMA as lzma } from "lzma/src/lzma-d-min";
import BigNumber from "bignumber.js";
import { PrivateKey, PublicKey, Aes, key } from "btsdex-ecc";
import { setAddressPrefix } from "btsdex-ecc";
import {
  connect,
  disconnect,
  database,
  history,
  network,
  crypto,
  block,
  asset,
  orders,
  call,
  setNotifyStatusCallback
} from "btsdex-api";

// Глобально настраиваем обработчик статуса из btsdex-api,
// чтобы он транслировал события в нашу систему событий.
setNotifyStatusCallback(status => {
  Event.statusNotify(status);
});

const getExpireDate = () => {
  let d = new Date();
  d.setFullYear(d.getFullYear() + 5);

  return d.toISOString().slice(0, -5);
};

class BitShares {
  static node = "wss://public.xbts.io/ws";
  static autoreconnect = true;
  static logger = console;

  static checkNodes = checkNodes;
  static checkNode = checkNode;

  static subscribe = Event.subscribe;

  static db = database;
  static history = history;
  static network = network;
  static crypto = crypto;
  static block = block;
  static asset = asset;
  static orders = orders;
  static call = call;

  static newTx = Transaction.newTx;
  static PrivateKey = PrivateKey;
  static Aes = Aes;
  static TransactionBuilder = TransactionBuilder;

  static assets = Asset;
  static accounts = Account;
  static fees = Fees;

  static async connect(
    node = BitShares.node,
    autoreconnect = BitShares.autoreconnect
  ) {
    if (BitShares.connectPromise) return BitShares.connectPromise;

    await (BitShares.connectPromise = BitShares.reconnect(node, autoreconnect));

    Event.connectedNotify();

    return true;
  }

  static disconnect() {
    BitShares.connectPromise = undefined;
    BitShares.autoreconnect = false;
    disconnect();
  }

  static async reconnect(node, autoreconnect) {
    BitShares.chain = await connect(node, 5000, autoreconnect);
    setAddressPrefix(BitShares.chain.addressPrefix);
    BitShares.node = node;

    return BitShares.chain;
  }

  static generateKeys(accountName, password, roles, prefix) {
    if (!accountName || !password) {
      throw new Error("Account name or password required");
    }
    if (password.length < 12) {
      throw new Error("Password must have at least 12 characters");
    }

    let privKeys = {};
    let pubKeys = {};

    ([...new Set(roles)] || ["active", "owner", "memo"]).forEach(role => {
      privKeys[role] = PrivateKey.fromSeed(
        key.normalize_brainKey(`${accountName}${role}${password}`)
      );
      pubKeys[role] = privKeys[role].toPublicKey().toString(prefix);
    });

    return { privKeys, pubKeys };
  }

  static async login(
    accountName,
    password,
    feeSymbol = BitShares.chain.coreAsset
  ) {
    let acc = await BitShares.accounts[accountName],
      activeKey = PrivateKey.fromSeed(`${accountName}active${password}`),
      genPubKey = activeKey.toPublicKey().toString();

    if (genPubKey != acc.active.key_auths[0][0])
      throw new Error("The pair of login and password do not match!");

    let account = new BitShares(accountName, activeKey.toWif(), feeSymbol);

    account.setMemoKey(
      (acc.options.memo_key === genPubKey
        ? activeKey
        : PrivateKey.fromSeed(`${accountName}memo${password}`)
      ).toWif()
    );

    await account.initPromise;
    return account;
  }

  static async loginFromFile(
    buffer,
    password,
    accountName,
    feeSymbol = BitShares.chain.coreAsset
  ) {
    let backup_buffer = Aes.decrypt_with_checksum(
      PrivateKey.fromSeed(password),
      PublicKey.fromBuffer(buffer.slice(0, 33)),
      null /*nonce*/,
      buffer.slice(33)
    );

    let buffer_data = JSON.parse(lzma.decompress(backup_buffer)),
      wallet = buffer_data.wallet[0],
      password_aes = Aes.fromSeed(password),
      encryption_plainbuffer = password_aes.decryptHexToBuffer(
        wallet.encryption_key
      ),
      aes_private = Aes.fromSeed(encryption_plainbuffer);

    let acc = await BitShares.accounts[accountName];
    let accKey = buffer_data.private_keys.find(
      key => key.pubkey === acc.active.key_auths[0][0]
    );

    if (!accKey)
      throw new Error(`Not found active key for account ${accountName}`);

    let private_key_hex = aes_private.decryptHex(accKey.encrypted_key);
    let activeKey = PrivateKey.fromBuffer(new Buffer(private_key_hex, "hex"));

    let account = new BitShares(accountName, activeKey.toWif(), feeSymbol);

    let memoKey;
    if (acc.options.memo_key === acc.active.key_auths[0][0])
      memoKey = activeKey;
    else {
      accKey = buffer_data.private_keys.find(
        key => key.pubkey === acc.options.memo_key
      );

      if (!accKey) {
        private_key_hex = aes_private.decryptHex(accKey.encrypted_key);
        memoKey = PrivateKey.fromBuffer(new Buffer(private_key_hex, "hex"));
      }
    }

    memoKey && account.setMemoKey(memoKey.toWif());

    await account.initPromise;
    return account;
  }

  static ticker(baseSymbol, quoteSymbol) {
    return database.getTicker(
      baseSymbol.toUpperCase(),
      quoteSymbol.toUpperCase()
    );
  }

  static getDynamicGlobalProperties() {
    return this.db.get_dynamic_global_properties();
  }

  static getGlobalProperties() {
    return this.db.get_global_properties();
  }

  static getBlock(blockNum) {
    return this.db.get_block(blockNum);
  }

  static getOrderBook(baseId, quoteId, limit = 50) {
    return this.db.get_order_book(baseId, quoteId, limit);
  }

  static getLimitOrders(baseId, quoteId, limit = 100) {
    return this.db.get_limit_orders(baseId, quoteId, limit);
  }

  static getSettleOrders(baseId, quoteId, limit = 100) {
    return this.db.get_settle_orders(baseId, quoteId, limit);
  }

  static getMarginPositions(accountId) {
    return this.db.get_margin_positions(accountId);
  }

  static getCollateralBids(baseId, quoteId, limit = 100) {
    return this.db.get_collateral_bids(baseId, quoteId, limit);
  }

  static getWitnesses(witnessIds) {
    return this.db.get_witnesses(witnessIds);
  }
    
  static getCommitteeMembers(memberIds) {
    return this.db.get_committee_members(memberIds);
  }

  static getVestingBalances(accountId) {
    return this.db.get_vesting_balances(accountId);
  }

  static getWithdrawPermissionsByAccount(accountId) {
    return this.db.get_withdraw_permissions_by_account(accountId);
  }

  static getProposedTransactions(accountId) {
    return this.db.get_proposed_transactions(accountId);
  }

  static getShortOrders(baseId, quoteId, limit = 100) {
    return this.db.get_short_orders(baseId, quoteId, limit);
  }

  static getLiquidityPools(baseId, quoteId, limit = 100) {
    return this.db.get_liquidity_pools(baseId, quoteId, limit);
  }

  static getWorkerProposals() {
    return this.db.get_worker_proposals();
  }
    
  static getBudgetRecords() {
    return this.db.get_budget_records();
  }

  static getAccountBalances(accountId, assets = []) {
    return this.db.get_account_balances(accountId, assets);
  }

  static getFullAccounts(accounts, subscribe = true) {
    return this.db.get_full_accounts(accounts, subscribe);
  }

  static getAccounts(accountIds) {
    return this.db.get_accounts(accountIds);
  }

  static getAssets(assetIds) {
    return this.db.get_assets(assetIds);
  }

  static getObjects(objectIds) {
    return this.db.get_objects(objectIds);
  }

  // Метод для подписки на обновления конкретных объектов (например, mto_id тикеров)
  static async subscribeToObjects(objectIds) {
    // Вызываем get_objects с параметром subscribe=true, чтобы подписаться на объекты
    return this.db.get_objects(objectIds, true);
  }

  // Метод для отписки от обновлений конкретных объектов
  static async unsubscribeFromObjects(objectIds) {
    // Вызываем get_objects с параметром subscribe=false, чтобы отписаться от объектов
    return this.db.get_objects(objectIds, false);
  }

  static lookupAccounts(startChar, limit = 10) {
    return this.db.lookup_accounts(startChar, limit);
  }

  static lookupAssetSymbols(symbols) {
    return this.db.lookup_asset_symbols(symbols);
  }

  static getAccountHistory(accountId, stop = "1.11.0", limit = 100, start = "1.11.0") {
    return this.history.get_account_history(accountId, stop, limit, start);
  }

  static getNodeList() {
    return WS_NODE_LIST;
  }

  static async tradeHistory(
    quoteSymbol,
    baseSymbol,
    startDate,
    stopDate,
    bucketSeconds
  ) {
    return history.getMarketHistory(
      (await BitShares.assets[quoteSymbol]).id,
      (await BitShares.assets[baseSymbol]).id,
      bucketSeconds,
      startDate.toISOString().slice(0, -5),
      stopDate.toISOString().slice(0, -5)
    );
  }

  static async getMarketHistory(baseId, quoteId, bucketSize, start, stop) {
    return history.getMarketHistory(
      baseId,
      quoteId,
      bucketSize,
      start,
      stop
    );
  }

  static async subscribeToMarket(callback, baseId, quoteId) {
    // xbtsdex не предоставляет прямой метод подписки на конкретный рынок
    // используем общий механизм подписки на блоки и фильтруем
    console.warn("subscribeToMarket: xbtsdex не предоставляет прямой метод подписки на рынок. Используйте альтернативную реализацию.");
    // В реальной реализации это должно использовать систему событий xbtsdex
    // для подписки на обновления рынка
    return database.subscribeToMarket(callback, baseId, quoteId);
  }

  // Для получения обновлений тикеров используем общий механизм подписки
  // через set_subscribe_callback и фильтрацию обновлений в блоках

  static async unsubscribeFromMarket(callback, baseId, quoteId) {
    // xbtsdex не предоставляет прямой метод отписки от конкретного рынка
    console.warn("unsubscribeFromMarket: xbtsdex не предоставляет прямой метод отписки от рынка. Используйте альтернативную реализацию.");
    return database.unsubscribeFromMarket(callback, baseId, quoteId);
  }

  static async getTradeHistory(baseSymbol, quoteSymbol, start, stop, limit) {
    return database.getTradeHistory(
      (await BitShares.assets[baseSymbol]).id,
      (await BitShares.assets[quoteSymbol]).id,
      start,
      stop,
      limit
    );
  }

  constructor(accountName, activeKey, feeSymbol = BitShares.chain.coreAsset) {
    if (activeKey) this.activeKey = PrivateKey.fromWif(activeKey);

    this.newTx = () => {
      return Transaction.newTx([this.activeKey]);
    };

    this.initPromise = Promise.all([
      BitShares.accounts[accountName],
      BitShares.assets[feeSymbol],
    ]).then(params => {
      [this.account, this.feeAsset] = params;
    });
  }

  setFeeAsset = async feeSymbol => {
    await this.initPromise;
    this.feeAsset = await BitShares.assets[feeSymbol];
  };

  setMemoKey = memoKey => {
    this.memoKey = PrivateKey.fromWif(memoKey);
  };

  broadcast = (tx, keys = [this.activeKey]) => {
    return tx.broadcast(keys);
  };

  sendOperation = operation => {
    let tx = this.newTx();
    tx.add(operation);
    return tx.broadcast();
  };

  balances = async (...args) => {
    await this.initPromise;

    let assets = await Promise.all(
      args.map(async asset => (await BitShares.assets[asset]).id)
    );
    let balances = await database.getAccountBalances(this.account.id, assets);
    return Promise.all(
      balances.map(balance => BitShares.assets.fromParam(balance))
    );
  };

  limitOrderCreateOperation = async (
    sellSymbol,
    sellAmount,
    buySymbol,
    buyAmount,
    fill_or_kill = false,
    expiration = getExpireDate(),
    extensions = []
  ) => {
    if (buyAmount == 0 || sellAmount == 0) throw new Error("Amount equal 0!");
    await this.initPromise;

    let buyAsset = await BitShares.assets[buySymbol],
      sellAsset = await BitShares.assets[sellSymbol];

    let params = {
      fee: this.feeAsset.toParam(),
      seller: this.account.id,
      amount_to_sell: sellAsset.toParam(sellAmount),
      min_to_receive: buyAsset.toParam(buyAmount),
      fill_or_kill,
      expiration,
      extensions,
    };

    return { limit_order_create: params };
  };

  limitOrderCreate = async (...args) => {
    let tx = await this.sendOperation(
      await this.limitOrderCreateOperation(...args)
    );
    return (await database.getObjects([tx[0].trx.operation_results[0][1]]))[0];
  };

  buyOperation = async (
    buySymbol,
    baseSymbol,
    amount,
    price,
    fill_or_kill = false,
    expire = getExpireDate()
  ) => {
    await this.initPromise;

    let buyAsset = await BitShares.assets[buySymbol],
      baseAsset = await BitShares.assets[baseSymbol],
      buyAmount = Math.floor(amount * 10 ** buyAsset.precision),
      sellAmount = Math.floor(
        BigNumber(amount)
          .times(price * 10 ** baseAsset.precision)
          .toString()
      );

    if (buyAmount == 0 || sellAmount == 0) throw new Error("Amount equal 0!");

    let params = {
      fee: this.feeAsset.toParam(),
      seller: this.account.id,
      amount_to_sell: baseAsset.toParam(sellAmount),
      min_to_receive: buyAsset.toParam(buyAmount),
      expiration: expire,
      fill_or_kill: fill_or_kill,
      extensions: [],
    };

    return { limit_order_create: params };
  };

  buy = async (...args) => {
    let tx = await this.sendOperation(await this.buyOperation(...args));
    return (await database.getObjects([tx[0].trx.operation_results[0][1]]))[0];
  };

  sellOperation = async (
    sellSymbol,
    baseSymbol,
    amount,
    price,
    fill_or_kill = false,
    expire = getExpireDate()
  ) => {
    await this.initPromise;

    let sellAsset = await BitShares.assets[sellSymbol],
      baseAsset = await BitShares.assets[baseSymbol],
      sellAmount = Math.floor(amount * 10 ** sellAsset.precision),
      buyAmount = Math.floor(
        BigNumber(amount)
          .times(price * 10 ** baseAsset.precision)
          .toString()
      );

    if (buyAmount == 0 || sellAmount == 0) throw new Error("Amount equal 0!");

    let params = {
      fee: this.feeAsset.toParam(),
      seller: this.account.id,
      amount_to_sell: sellAsset.toParam(sellAmount),
      min_to_receive: baseAsset.toParam(buyAmount),
      expiration: expire,
      fill_or_kill: fill_or_kill,
      extensions: [],
    };

    return { limit_order_create: params };
  };

  sell = async (...args) => {
    let tx = await this.sendOperation(await this.sellOperation(...args));
    return (await database.getObjects([tx[0].trx.operation_results[0][1]]))[0];
  };

  orders = async () => {
    await this.initPromise;
    return (await database.getFullAccounts([this.account.id], false))[0][1]
      .limit_orders;
  };

  getOrder = async id => {
    await this.initPromise;
    return (await database.getObjects([id]))[0];
  };

  cancelOrderOperation = async id => {
    await this.initPromise;

    let params = {
      fee: this.feeAsset.toParam(),
      fee_paying_account: this.account.id,
      order: id,
      extensions: [],
    };

    return { limit_order_cancel: params };
  };

  cancelOrder = async (...args) => {
    return this.sendOperation(await this.cancelOrderOperation(...args));
  };

  memo = async (toName, message) => {
    if (!this.memoKey) throw new Error("Not set memoKey!");

    let nonce = Date.now().toString(), //TransactionHelper.unique_nonce_uint64(),
      to = (await BitShares.accounts[toName]).options.memo_key;

    return {
      from: this.memoKey.toPublicKey().toPublicKeyString(),
      to,
      nonce,
      message: Aes.encrypt_with_checksum(
        this.memoKey,
        to,
        nonce,
        new Buffer(message, "utf-8")
      ),
    };
  };

  memoDecode = memos => {
    if (!this.memoKey) throw new Error("Not set memoKey!");

    return Aes.decrypt_with_checksum(
      this.memoKey,
      memos.from,
      memos.nonce,
      memos.message
    ).toString("utf-8");
  };

  transferOperation = async (toName, assetSymbol, amount, memo) => {
    await this.initPromise;

    let asset = await BitShares.assets[assetSymbol],
      intAmount = Math.floor(amount * 10 ** asset.precision);

    if (intAmount == 0) throw new Error("Amount equal 0!");

    let params = {
      fee: this.feeAsset.toParam(),
      from: this.account.id,
      to: (await BitShares.accounts[toName]).id,
      amount: asset.toParam(intAmount),
      extensions: [],
    };

    if (memo)
      params.memo =
        typeof memo == "string" ? await this.memo(toName, memo) : memo;

    return { transfer: params };
  };

  transfer = async (...args) => {
    return this.sendOperation(await this.transferOperation(...args));
  };

  assetIssueOperation = async (toName, assetSymbol, amount, memo) => {
    await this.initPromise;

    let asset = await BitShares.assets[assetSymbol],
      intAmount = Math.floor(amount * 10 ** asset.precision);

    if (intAmount === 0) throw new Error("Amount equal 0!");

    let params = {
      fee: this.feeAsset.toParam(),
      issuer: this.account.id,
      asset_to_issue: asset.toParam(intAmount),
      issue_to_account: (await BitShares.accounts[toName]).id,
    };

    if (memo)
      params.memo =
        typeof memo === "string" ? await this.memo(toName, memo) : memo;

    return { asset_issue: params };
  };

  assetIssue = async (...args) => {
    return this.sendOperation(await this.assetIssueOperation(...args));
  };

  assetReserveOperation = async (assetSymbol, amount) => {
    await this.initPromise;

    let payer = this.account.id;

    let asset = await BitShares.assets[assetSymbol],
      intAmount = Math.floor(amount * 10 ** asset.precision);

    if (intAmount === 0) throw new Error("Amount equal 0!");

    let params = {
      fee: this.feeAsset.toParam(),
      amount_to_reserve: asset.toParam(intAmount),
      payer,
      extensions: [],
    };

    return { asset_reserve: params };
  };

  assetReserve = async (...args) => {
    return this.sendOperation(await this.assetReserveOperation(...args));
  };
}

Event.init(BitShares.connect);

export default BitShares;
