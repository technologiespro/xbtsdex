# xbtsdex - Документация класса BitShares

## Содержание

* [Статические методы](#статические-методы)
  * [connect()](#connect)
  * [disconnect()](#disconnect)
  * [reconnect()](#reconnect)
  * [subscribe()](#subscribe)
  * [generateKeys()](#generatekeys)
  * [generateKeysPBKDF2()](#generatekeyspbkdf2)
  * [login()](#login)
  * [loginFromFile()](#loginfromfile)
  * [ticker()](#ticker)
  * [tradeHistory()](#tradehistory)
  * [getMarketHistory()](#getmarkethistory)
  * [getTradeHistory()](#gettradehistory)
  * [getDynamicGlobalProperties()](#getdynamicglobalproperties)
  * [getGlobalProperties()](#getglobalproperties)
  * [getBlock()](#getblock)
  * [getOrderBook()](#getorderbook)
  * [getLimitOrders()](#getlimitorders)
  * [getSettleOrders()](#getsettleorders)
  * [getMarginPositions()](#getmarginpositions)
  * [getCollateralBids()](#getcollateralbids)
  * [getWitnesses()](#getwitnesses)
  * [getCommitteeMembers()](#getcommitteemembers)
  * [getVestingBalances()](#getvestingbalances)
  * [getWithdrawPermissionsByAccount()](#getwithdrawpermissionsbyaccount)
  * [getProposedTransactions()](#getproposedtransactions)
  * [getShortOrders()](#getshortorders)
  * [getLiquidityPools()](#getliquiditypools)
  * [getWorkerProposals()](#getworkerproposals)
  * [getBudgetRecords()](#getbudgetrecords)
  * [getAccountBalances()](#getaccountbalances)
  * [getFullAccounts()](#getfullaccounts)
  * [getAccounts()](#getaccounts)
  * [getAssets()](#getassets)
  * [getObjects()](#getobjects)
  * [subscribeToObjects()](#subscribetoobjects)
  * [setSubscribeCallback()](#setsubscribecallback)
  * [unsubscribeFromObjects()](#unsubscribefromobjects)
  * [setPendingTransactionCallback()](#setpendingtransactioncallback)
  * [subscribeToMarket()](#subscribetomarket)
  * [unsubscribeFromMarket()](#unsubscribetomarket)
  * [lookupAccounts()](#lookupaccounts)
  * [lookupAssetSymbols()](#lookupassetsymbols)
  * [getAccountHistory()](#getaccounthistory)
  * [getNodeList()](#getnodelist)
* [Методы экземпляра](#методы-экземпляра)
  * [constructor()](#constructor)
  * [setFeeAsset()](#setfeeasset)
  * [setMemoKey()](#setmemokey)
  * [broadcast()](#broadcast)
  * [sendOperation()](#sendoperation)
  * [balances()](#balances)
  * [limitOrderCreateOperation()](#limitordercreateoperation)
  * [limitOrderCreate()](#limitordercreate)
  * [buyOperation()](#buyoperation)
  * [buy()](#buy)
  * [sellOperation()](#selloperation)
  * [sell()](#sell)
  * [orders()](#orders)
  * [getOrder()](#getorder)
  * [cancelOrderOperation()](#cancelorderoperation)
  * [cancelOrder()](#cancelorder)
  * [memo()](#memo)
  * [memoDecode()](#memodecode)
  * [transferOperation()](#transferoperation)
  * [transfer()](#transfer)
  * [assetIssueOperation()](#assetissueoperation)
  * [assetIssue()](#assetissue)
  * [assetReserveOperation()](#assetreserveoperation)
  * [assetReserve()](#assetreserve)

## Статические методы

### connect()
Подключается к узлу блокчейна BitShares.

Сигнатура:
```js
static async connect(node = BitShares.node, autoreconnect = BitShares.autoreconnect)
```

#### Параметры
- `node` - URL узла для подключения (по умолчанию: "wss://public.xbts.io/ws")
- `autoreconnect` - флаг автоподключения при разрыве соединения (по умолчанию: true)

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect(); // Подключение к узлу по умолчанию
  
  // Подключение к конкретному узлу
  await BitShares.connect("wss://node.example.com/ws");
  
  // Подключение с отключенным автоподключением
  await BitShares.connect("wss://node.example.com/ws", false);

  // Теперь можно выполнять операции с блокчейном...
}
```

### disconnect()
Отключает соединение с узлом блокчейна.

Сигнатура:
```js
static disconnect()
```

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();
// ... выполнение операций ...

// Отключиться от блокчейна
BitShares.disconnect();
```

### reconnect()
Переподключается к узлу блокчейна.

Сигнатура:
```js
static async reconnect(node, autoreconnect)
```

#### Параметры
- `node` - URL узла для подключения
- `autoreconnect` - флаг автоподключения при разрыве соединения

#### Пример
```js
const BitShares = require('xbtsdex');

// Переподключиться к другому узлу
await BitShares.reconnect("wss://another-node.com/ws", true);
```

### subscribe()
Подписывается на событие в системе событий.

Сигнатура:
```js
static subscribe(event, callback)
```

#### Параметры
- `event` - тип события ('connected', 'block', 'account')
- `callback` - функция обратного вызова для обработки события

#### Пример
```js
const BitShares = require("xbtsdex");

BitShares.subscribe('connected', startAfterConnected);
BitShares.subscribe('block', callEachBlock);
BitShares.subscribe('account', changeAccount, 'trade-bot');

async function startAfterConnected() {
  // вызывается один раз после подключения к блокчейну
}

async function callEachBlock(obj) {
  // вызывается при создании нового блока
}

async function changeAccount(array) {
  // вызывается при изменении аккаунта 'trade-bot'
}
```

### generateKeys()
Генерирует приватные и публичные ключи для аккаунта по логину и паролю (старый формат).

Сигнатура:
```js
static generateKeys(accountName, password, roles, prefix)
```

#### Параметры
- `accountName` - имя аккаунта
- `password` - пароль аккаунта (не менее 12 символов)
- `roles` - массив ролей ключей ['active', 'owner', 'memo'] (по умолчанию)
- `prefix` - префикс адреса (необязательно)

#### Возвращает
Объект с полями `privKeys` и `pubKeys`, содержащими приватные и публичные ключи.

#### Пример
```js
const BitShares = require("xbtsdex");

// Генерация ключей для стандартных ролей
let keys = BitShares.generateKeys('trade-bot', 'veryStrongPassword123', ['owner','active','memo']);

console.log(keys); 
// {
//   privKeys: { 
//     owner: PrivateKey, 
//     active: PrivateKey, 
//     memo: PrivateKey
//   }, 
//   pubKeys: { 
//     owner: "BTS...", 
//     active: "BTS...", 
//     memo: "BTS..."
//   }
// }

let acc = new BitShares('trade-bot', keys.privKeys.active.toWif());
```

### generateKeysPBKDF2()
Генерирует приватные и публичные ключи с использованием PBKDF2 (новый экспериментальный формат).

Сигнатура:
```js
static generateKeysPBKDF2(accountName, password, roles, prefix)
```

#### Параметры
- `accountName` - имя аккаунта
- `password` - пароль аккаунта (не менее 12 символов)
- `roles` - массив ролей ключей ['active', 'owner', 'memo'] (по умолчанию)
- `prefix` - префикс адреса (необязательно)

#### Возвращает
Объект с полями `privKeys` и `pubKeys`, содержащими приватные и публичные ключи.

#### Пример
```js
const BitShares = require("xbtsdex");

// Генерация ключей с использованием PBKDF2
let keys = BitShares.generateKeysPBKDF2('trade-bot', 'veryStrongPassword123', ['active', 'memo']);

console.log(keys); 
// {
//   privKeys: { 
//     active: PrivateKey, 
//     memo: PrivateKey
//   }, 
//   pubKeys: { 
//     active: "BTS...", 
//     memo: "BTS..."
//   }
// }
```

### login()
Выполняет вход в аккаунт по имени и паролю.

Сигнатура:
```js
static async login(accountName, password, feeSymbol = BitShares.chain.coreAsset)
```

#### Параметры
- `accountName` - имя аккаунта
- `password` - пароль аккаунта
- `feeSymbol` - символ актива для комиссии (по умолчанию: основной актив сети)

#### Возвращает
Экземпляр класса BitShares для работы с аккаунтом.

#### Пример
```js
const BitShares = require("xbtsdex");

// Вход по имени и паролю
let account = await BitShares.login('trade-bot', 'veryStrongPassword123');

// Вход с указанием актива для комиссии
let accountWithFee = await BitShares.login('trade-bot', 'veryStrongPassword123', 'BTC');
```

### loginFromFile()
Выполняет вход в аккаунт из файла резервной копии.

Сигнатура:
```js
static async loginFromFile(buffer, password, accountName, feeSymbol = BitShares.chain.coreAsset)
```

#### Параметры
- `buffer` - буфер с содержимым файла резервной копии
- `password` - пароль от файла резервной копии
- `accountName` - имя аккаунта
- `feeSymbol` - символ актива для комиссии (по умолчанию: основной актив сети)

#### Возвращает
Экземпляр класса BitShares для работы с аккаунтом.

#### Пример
```js
const BitShares = require("xbtsdex");
const fs = require('fs');

// Чтение файла резервной копии
let buffer = fs.readFileSync('backup.bin');

// Вход из файла резервной копии
let account = await BitShares.loginFromFile(buffer, 'walletPassword', 'trade-bot');
```

### ticker()
Получает тикер по базовому и котируемому символам.

Сигнатура:
```js
static ticker(baseSymbol, quoteSymbol)
```

#### Параметры
- `baseSymbol` - базовый символ
- `quoteSymbol` - котируемый символ

#### Возвращает
Объект с информацией о тикере.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();

  let ticker = await BitShares.ticker('BTS', 'USD');
  console.log(ticker); // { latest: '0.3857908', lowest_ask: ..., highest_bid: ... }
}
```

### tradeHistory()
Получает историю торговли для пары активов.

Сигнатура:
```js
static async tradeHistory(quoteSymbol, baseSymbol, startDate, stopDate, bucketSeconds)
```

#### Параметры
- `quoteSymbol` - котируемый символ
- `baseSymbol` - базовый символ
- `startDate` - дата начала
- `stopDate` - дата окончания
- `bucketSeconds` - размер интервала в секундах

#### Возвращает
Объект с историей торговли.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();

  let start = new Date();
  start.setMonth(start.getMonth() - 1); // Месяц назад
  let stop = new Date();

  let data = await BitShares.tradeHistory("USD", "BTS", start, stop, 60 * 60 * 24); // 24 часа
  console.log(data); // [{high_base:..., low_quote:...}, {...}]
}
```

### getMarketHistory()
Получает историю рынка для пары активов.

Сигнатура:
```js
static async getMarketHistory(baseId, quoteId, bucketSize, start, stop)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `bucketSize` - размер интервала в секундах
- `start` - начальная дата/время
- `stop` - конечная дата/время

#### Возвращает
Объект с историей рынка.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let data = await BitShares.getMarketHistory("1.3.0", "1.3.121", 3600, "2020-01-01T00:00:00", "2020-01-02T00:00:00");
  console.log(data);
}
```

### getTradeHistory()
Получает историю торгов для пары активов.

Сигнатура:
```js
static async getTradeHistory(baseSymbol, quoteSymbol, start, stop, limit)
```

#### Параметры
- `baseSymbol` - базовый символ
- `quoteSymbol` - котируемый символ
- `start` - начальная дата/время
- `stop` - конечная дата/время
- `limit` - максимальное количество записей

#### Возвращает
Объект с историей торгов.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();

  let trades = await BitShares.getTradeHistory("BTS", "USD", "2020-01-01T00:00:00", "2020-01-02T00:00:00", 100);
  console.log(trades);
}
```

### getDynamicGlobalProperties()
Получает динамические глобальные свойства блокчейна.

Сигнатура:
```js
static getDynamicGlobalProperties()
```

#### Возвращает
Объект с динамическими глобальными свойствами.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let props = await BitShares.getDynamicGlobalProperties();
  console.log(props);
  // { id: '2.1.0', head_block_number: ..., time: ..., ... }
}
```

### getGlobalProperties()
Получает глобальные свойства блокчейна.

Сигнатура:
```js
static getGlobalProperties()
```

#### Возвращает
Объект с глобальными свойствами.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let props = await BitShares.getGlobalProperties();
  console.log(props);
  // { id: '2.0.0', parameters: { current_fees: {...}, ... }, active_witnesses: [...] }
}
```

### getBlock()
Получает блок по его номеру.

Сигнатура:
```js
static getBlock(blockNum)
```

#### Параметры
- `blockNum` - номер блока

#### Возвращает
Объект с информацией о блоке.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let block = await BitShares.getBlock(1000000);
  console.log(block);
  // { previous: "...", timestamp: "...", witness: "...", transactions: [...] }
}
```

### getOrderBook()
Получает стакан заявок для пары активов.

Сигнатура:
```js
static getOrderBook(baseId, quoteId, limit = 50)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 50)

#### Возвращает
Объект с данными стакана заявок.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let orderBook = await BitShares.getOrderBook("1.3.0", "1.3.121", 20);
  console.log(orderBook);
  // { bids: [...], asks: [...] }
}
```

### getLimitOrders()
Получает лимитные ордера для пары активов.

Сигнатура:
```js
static getLimitOrders(baseId, quoteId, limit = 100)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 100)

#### Возвращает
Массив объектов с информацией о лимитных ордерах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let limitOrders = await BitShares.getLimitOrders("1.3.0", "1.3.121", 50);
  console.log(limitOrders.length);
}
```

### getSettleOrders()
Получает ордера по расчету для пары активов.

Сигнатура:
```js
static getSettleOrders(baseId, quoteId, limit = 100)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 100)

#### Возвращает
Массив объектов с информацией о заказах по расчету.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let settleOrders = await BitShares.getSettleOrders("1.3.0", "1.3.121");
  console.log(settleOrders);
}
```

### getMarginPositions()
Получает маржинальные позиции аккаунта.

Сигнатура:
```js
static getMarginPositions(accountId)
```

#### Параметры
- `accountId` - ID аккаунта

#### Возвращает
Массив объектов с информацией о маржинальных позициях.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let positions = await BitShares.getMarginPositions("1.2.12345");
  console.log(positions);
}
```

### getCollateralBids()
Получает ставки обеспечения для пары активов.

Сигнатура:
```js
static getCollateralBids(baseId, quoteId, limit = 100)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 100)

#### Возвращает
Массив объектов с информацией о ставках обеспечения.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let bids = await BitShares.getCollateralBids("1.3.0", "1.3.121");
  console.log(bids);
}
```

### getWitnesses()
Получает информацию о свидетелях.

Сигнатура:
```js
static getWitnesses(witnessIds)
```

#### Параметры
- `witnessIds` - массив ID свидетелей

#### Возвращает
Массив объектов с информацией о свидетелях.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let witnesses = await BitShares.getWitnesses(["1.6.1", "1.6.2"]);
  console.log(witnesses);
}
```

### getCommitteeMembers()
Получает информацию о членах комитета.

Сигнатура:
```js
static getCommitteeMembers(memberIds)
```

#### Параметры
- `memberIds` - массив ID членов комитета

#### Возвращает
Массив объектов с информацией о членах комитета.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let committee = await BitShares.getCommitteeMembers(["1.5.1", "1.5.2"]);
  console.log(committee);
}
```

### getVestingBalances()
Получает счета с вестингом для аккаунта.

Сигнатура:
```js
static getVestingBalances(accountId)
```

#### Параметры
- `accountId` - ID аккаунта

#### Возвращает
Массив объектов с информацией о счетах с вестингом.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let vestingBalances = await BitShares.getVestingBalances("1.2.12345");
  console.log(vestingBalances);
}
```

### getWithdrawPermissionsByAccount()
Получает разрешения на вывод для аккаунта.

Сигнатура:
```js
static getWithdrawPermissionsByAccount(accountId)
```

#### Параметры
- `accountId` - ID аккаунта

#### Возвращает
Массив объектов с информацией о разрешениях на вывод.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let permissions = await BitShares.getWithdrawPermissionsByAccount("1.2.12345");
  console.log(permissions);
}
```

### getProposedTransactions()
Получает предложенные транзакции для аккаунта.

Сигнатура:
```js
static getProposedTransactions(accountId)
```

#### Параметры
- `accountId` - ID аккаунта

#### Возвращает
Массив объектов с информацией о предложенных транзакциях.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let proposals = await BitShares.getProposedTransactions("1.2.12345");
  console.log(proposals);
}
```

### getShortOrders()
Получает шортовые ордера для пары активов.

Сигнатура:
```js
static getShortOrders(baseId, quoteId, limit = 100)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 100)

#### Возвращает
Массив объектов с информацией о шортовых ордерах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let shortOrders = await BitShares.getShortOrders("1.3.0", "1.3.121");
  console.log(shortOrders);
}
```

### getLiquidityPools()
Получает пулы ликвидности для пары активов.

Сигнатура:
```js
static getLiquidityPools(baseId, quoteId, limit = 100)
```

#### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей (по умолчанию: 100)

#### Возвращает
Массив объектов с информацией о пулах ликвидности.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let pools = await BitShares.getLiquidityPools("1.3.0", "1.3.121");
  console.log(pools);
}
```

### getWorkerProposals()
Получает предложения работников.

Сигнатура:
```js
static getWorkerProposals()
```

#### Возвращает
Массив объектов с информацией о предложениях работников.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let workers = await BitShares.getWorkerProposals();
  console.log(workers);
}
```

### getBudgetRecords()
Получает записи бюджета.

Сигнатура:
```js
static getBudgetRecords()
```

#### Возвращает
Массив объектов с информацией о записях бюджета.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let budget = await BitShares.getBudgetRecords();
  console.log(budget);
}
```

### getAccountBalances()
Получает балансы аккаунта для указанных активов.

Сигнатура:
```js
static getAccountBalances(accountId, assets = [])
```

#### Параметры
- `accountId` - ID аккаунта
- `assets` - массив ID активов (по умолчанию: все активы)

#### Возвращает
Массив объектов с информацией о балансах аккаунта.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let balances = await BitShares.getAccountBalances("1.2.12345", ["1.3.0", "1.3.121"]);
  console.log(balances);
}
```

### getFullAccounts()
Получает полную информацию об аккаунтах.

Сигнатура:
```js
static getFullAccounts(accounts, subscribe = true)
```

#### Параметры
- `accounts` - массив имен или ID аккаунтов
- `subscribe` - флаг подписки на изменения (по умолчанию: true)

#### Возвращает
Массив объектов с полной информацией об аккаунтах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let fullAccounts = await BitShares.getFullAccounts(["account1", "account2"]);
  console.log(fullAccounts);
}
```

### getAccounts()
Получает информацию об аккаунтах по их ID.

Сигнатура:
```js
static getAccounts(accountIds)
```

#### Параметры
- `accountIds` - массив ID аккаунтов

#### Возвращает
Массив объектов с информацией об аккаунтах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let accounts = await BitShares.getAccounts(["1.2.12345", "1.2.12346"]);
  console.log(accounts);
}
```

### getAssets()
Получает информацию об активах по их ID.

Сигнатура:
```js
static getAssets(assetIds)
```

#### Параметры
- `assetIds` - массив ID активов

#### Возвращает
Массив объектов с информацией об активах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let assets = await BitShares.getAssets(["1.3.0", "1.3.121"]);
  console.log(assets);
}
```

### getObjects()
Получает объекты по их ID.

Сигнатура:
```js
static getObjects(objectIds)
```

#### Параметры
- `objectIds` - массив ID объектов

#### Возвращает
Массив объектов.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let objects = await BitShares.getObjects(["1.3.0", "1.2.12345", "1.7.1234"]);
  console.log(objects);
}
```

### subscribeToObjects()
Подписывается на изменения объектов.

Сигнатура:
```js
static async subscribeToObjects(objectIds)
```

#### Параметры
- `objectIds` - массив ID объектов

#### Возвращает
Результат операции подписки.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  await BitShares.subscribeToObjects(["1.3.0", "1.2.12345"]);
  // Теперь будет получать обновления для этих объектов
}
```

### setSubscribeCallback()
Устанавливает callback-функцию для получения обновлений объектов.

Сигнатура:
```js
static setSubscribeCallback(callback, notifyRemoveCreate = false)
```

#### Параметры
- `callback` - функция обратного вызова для получения обновлений
- `notifyRemoveCreate` - флаг уведомления о создании/удалении объектов (по умолчанию: false)

#### Возвращает
Результат установки callback-функции.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  BitShares.setSubscribeCallback((updatedObjects) => {
    console.log('Объекты обновлены:', updatedObjects);
  });
}
```

### unsubscribeFromObjects()
Отписывается от изменений объектов.

Сигнатура:
```js
static async unsubscribeFromObjects(objectIds)
```

#### Параметры
- `objectIds` - массив ID объектов

#### Возвращает
Результат операции отписки.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  await BitShares.unsubscribeFromObjects(["1.3.0", "1.2.12345"]);
  // Больше не будет получать обновления для этих объектов
}
```

### setPendingTransactionCallback()
Устанавливает callback-функцию для получения ожидающих транзакций.

Сигнатура:
```js
static async setPendingTransactionCallback(callback)
```

#### Параметры
- `callback` - функция обратного вызова для получения ожидающих транзакций

#### Возвращает
Результат установки callback-функции.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  await BitShares.setPendingTransactionCallback((transaction) => {
    console.log('Новая транзакция:', transaction);
  });
}
```

### subscribeToMarket()
Подписывается на изменения конкретного рынка.

Сигнатура:
```js
static async subscribeToMarket(callback, baseId, quoteId)
```

#### Параметры
- `callback` - функция обратного вызова для получения обновлений рынка
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива

#### Возвращает
Результат операции подписки.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  await BitShares.subscribeToMarket((updates) => {
    console.log('Обновления рынка:', updates);
  }, "1.3.0", "1.3.121");
}
```

### unsubscribeFromMarket()
Отписывается от изменений конкретного рынка.

Сигнатура:
```js
static async unsubscribeFromMarket(callback, baseId, quoteId)
```

#### Параметры
- `callback` - функция обратного вызова для получения обновлений рынка
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива

#### Возвращает
Результат операции отписки.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  await BitShares.unsubscribeFromMarket((updates) => {
    console.log('Обновления рынка:', updates);
  }, "1.3.0", "1.3.121");
}
```

### lookupAccounts()
Поиск аккаунтов по начальным символам имени.

Сигнатура:
```js
static lookupAccounts(startChar, limit = 10)
```

#### Параметры
- `startChar` - начальные символы имени аккаунта
- `limit` - максимальное количество результатов (по умолчанию: 10)

#### Возвращает
Массив объектов с информацией об аккаунтах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let accounts = await BitShares.lookupAccounts("user", 20);
  console.log(accounts);
  // [['username1', '1.2.12345'], ['username2', '1.2.12346'], ...]
}
```

### lookupAssetSymbols()
Поиск активов по символам.

Сигнатура:
```js
static lookupAssetSymbols(symbols)
```

#### Параметры
- `symbols` - массив символов активов для поиска

#### Возвращает
Массив объектов с информацией об активах.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let assets = await BitShares.lookupAssetSymbols(["BTS", "USD"]);
  console.log(assets);
}
```

### getAccountHistory()
Получает историю аккаунта.

Сигнатура:
```js
static getAccountHistory(accountId, stop = "1.11.0", limit = 100, start = "1.11.0")
```

#### Параметры
- `accountId` - ID аккаунта
- `stop` - ID истории остановки (по умолчанию: "1.11.0")
- `limit` - максимальное количество записей (по умолчанию: 100)
- `start` - ID истории начала (по умолчанию: "1.11.0")

#### Возвращает
Массив объектов с историей аккаунта.

#### Пример
```js
const BitShares = require('xbtsdex');

start()
async function start() {
  await BitShares.connect();
  
  let history = await BitShares.getAccountHistory("1.2.12345", "1.11.0", 50);
  console.log(history);
}
```

### getNodeList()
Получает список доступных узлов.

Сигнатура:
```js
static getNodeList()
```

#### Возвращает
Массив объектов с информацией о доступных узлах.

#### Пример
```js
const BitShares = require('xbtsdex');

let nodes = BitShares.getNodeList();
console.log(nodes);
// [
//   { url: "wss://public.xbts.io/ws", region: "...", country: "...", ... },
//   { url: "wss://node.xbts.io/ws", region: "...", country: "...", ... }
// ]
```

## Методы экземпляра

### constructor()
Создает экземпляр класса BitShares для работы с аккаунтом.

Сигнатура:
```js
constructor(accountName, activeKey, feeSymbol = BitShares.chain.coreAsset)
```

#### Параметры
- `accountName` - имя аккаунта
- `activeKey` - приватный активный ключ аккаунта в формате WIF
- `feeSymbol` - символ актива для комиссии (по умолчанию: основной актив сети)

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

// Создание экземпляра с активным ключом
let account = new BitShares('trade-bot', '5JAEWA5u6DmroQ6kBd13Vf9fmtnVduwzNFib1gESBTx5GiKuDXJ');

// Создание экземпляра с указанием актива для комиссии
let accountWithFee = new BitShares('trade-bot', '5JAEWA5u6DmroQ6kBd13Vf9fmtnVduwzNFib1gESBTx5GiKuDXJ', 'BTC');
```

### setFeeAsset()
Устанавливает актив для оплаты комиссий.

Сигнатура:
```js
async setFeeAsset(feeSymbol)
```

#### Параметры
- `feeSymbol` - символ актива для комиссий

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');
await account.setFeeAsset('BTC'); // Установить BTC для комиссий
```

### setMemoKey()
Устанавливает приватный ключ для шифрования мемо.

Сигнатура:
```js
setMemoKey(memoKey)
```

#### Параметры
- `memoKey` - приватный ключ мемо в формате WIF

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');
account.setMemoKey('5JAEWA5u6DmroQ6kBd13Vf9fmtnVduwzNFib1gESBTx5GiKuDXJ'); // Установить ключ мемо
```

### broadcast()
Транслирует транзакцию в блокчейн.

Сигнатура:
```js
broadcast(tx, keys = [this.activeKey])
```

#### Параметры
- `tx` - объект транзакции
- `keys` - массив приватных ключей для подписи (по умолчанию: активный ключ аккаунта)

#### Возвращает
Результат трансляции транзакции.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

let tx = account.newTx();
let operation = await account.transferOperation('recipient', 'BTS', 10, 'memo');
tx.add(operation);

// Транслировать транзакцию
let result = await account.broadcast(tx);
```

### sendOperation()
Добавляет операцию в новую транзакцию и транслирует ее.

Сигнатура:
```js
async sendOperation(operation)
```

#### Параметры
- `operation` - объект операции

#### Возвращает
Результат трансляции операции.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

let operation = await account.transferOperation('recipient', 'BTS', 10, 'memo');
let result = await account.sendOperation(operation);
```

### balances()
Получает балансы аккаунта для указанных активов.

Сигнатура:
```js
async balances(...args)
```

#### Параметры
- `...args` - символы активов для проверки баланса

#### Возвращает
Массив объектов с информацией о балансах.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Получить балансы для BTS и USD
let balances = await account.balances('BTS', 'USD');
console.log(balances);
// [{ amount: 10000000, asset: Asset { id: "1.3.0", symbol: "BTS", ... }}, ...]
```

### limitOrderCreateOperation()
Создает операцию создания лимитного ордера.

Сигнатура:
```js
async limitOrderCreateOperation(sellSymbol, sellAmount, buySymbol, buyAmount, fill_or_kill = false, expiration = getExpireDate(), extensions = [])
```

#### Параметры
- `sellSymbol` - символ продаваемого актива
- `sellAmount` - количество продаваемого актива
- `buySymbol` - символ покупаемого актива
- `buyAmount` - количество покупаемого актива
- `fill_or_kill` - флаг "исполнить полностью или отменить" (по умолчанию: false)
- `expiration` - дата истечения ордера (по умолчанию: через 5 лет)
- `extensions` - расширения операции (по умолчанию: [])

#### Возвращает
Объект операции создания лимитного ордера.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создание операции ордера на продажу 1 BTS за 0.5 USD
let operation = await account.limitOrderCreateOperation('BTS', 1, 'USD', 0.5);
```

### limitOrderCreate()
Создает лимитный ордер в блокчейне.

Сигнатура:
```js
async limitOrderCreate(sellSymbol, sellAmount, buySymbol, buyAmount, fill_or_kill = false, expiration = getExpireDate(), extensions = [])
```

#### Параметры
- `sellSymbol` - символ продаваемого актива
- `sellAmount` - количество продаваемого актива
- `buySymbol` - символ покупаемого актива
- `buyAmount` - количество покупаемого актива
- `fill_or_kill` - флаг "исполнить полностью или отменить" (по умолчанию: false)
- `expiration` - дата истечения ордера (по умолчанию: через 5 лет)
- `extensions` - расширения операции (по умолчанию: [])

#### Возвращает
Объект созданного ордера.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создать ордер на продажу 1 BTS за 0.5 USD
let order = await account.limitOrderCreate('BTS', 1, 'USD', 0.5);
console.log(order); // Информация о созданном ордере
```

### buyOperation()
Создает операцию покупки по указанной цене.

Сигнатура:
```js
async buyOperation(buySymbol, baseSymbol, amount, price, fill_or_kill = false, expire = getExpireDate())
```

#### Параметры
- `buySymbol` - символ покупаемого актива
- `baseSymbol` - символ базового (ценового) актива
- `amount` - количество покупаемого актива
- `price` - цена покупки (в базовом активе за единицу покупаемого актива)
- `fill_or_kill` - флаг "исполнить полностью или отменить" (по умолчанию: false)
- `expire` - дата истечения ордера (по умолчанию: через 5 лет)

#### Возвращает
Объект операции покупки.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создание операции покупки 2 BTC по цене 30000 BTS за BTC
let operation = await account.buyOperation('BTC', 'BTS', 2, 30000);
```

### buy()
Создает ордер на покупку в блокчейне.

Сигнатура:
```js
async buy(...args)
```

#### Параметры
- `...args` - аргументы для buyOperation

#### Возвращает
Объект созданного ордера покупки.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Купить 2 BTC по цене 30000 BTS за BTC
let order = await account.buy('BTC', 'BTS', 2, 30000);
console.log(order);
```

### sellOperation()
Создает операцию продажи по указанной цене.

Сигнатура:
```js
async sellOperation(sellSymbol, baseSymbol, amount, price, fill_or_kill = false, expire = getExpireDate())
```

#### Параметры
- `sellSymbol` - символ продаваемого актива
- `baseSymbol` - символ базового (ценового) актива
- `amount` - количество продаваемого актива
- `price` - цена продажи (в базовом активе за единицу продаваемого актива)
- `fill_or_kill` - флаг "исполнить полностью или отменить" (по умолчанию: false)
- `expire` - дата истечения ордера (по умолчанию: через 5 лет)

#### Возвращает
Объект операции продажи.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создание операции продажи 10 BTS по цене 0.3 USD за BTS
let operation = await account.sellOperation('BTS', 'USD', 10, 0.3);
```

### sell()
Создает ордер на продажу в блокчейне.

Сигнатура:
```js
async sell(...args)
```

#### Параметры
- `...args` - аргументы для sellOperation

#### Возвращает
Объект созданного ордера продажи.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Продать 10 BTS по цене 0.3 USD за BTS
let order = await account.sell('BTS', 'USD', 10, 0.3);
console.log(order);
```

### orders()
Получает текущие лимитные ордера аккаунта.

Сигнатура:
```js
async orders()
```

#### Возвращает
Массив объектов с информацией о лимитных ордерах аккаунта.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

let orders = await account.orders();
console.log(orders); // [{ id: '1.7.49552602', seller: '1.2.12345', ... }, ...]
```

### getOrder()
Получает информацию об ордере по его ID.

Сигнатура:
```js
async getOrder(id)
```

#### Параметры
- `id` - ID ордера

#### Возвращает
Объект с информацией об ордере.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

let order = await account.getOrder('1.7.12345');
console.log(order);
```

### cancelOrderOperation()
Создает операцию отмены ордера.

Сигнатура:
```js
async cancelOrderOperation(id)
```

#### Параметры
- `id` - ID ордера для отмены

#### Возвращает
Объект операции отмены ордера.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создание операции отмены ордера
let operation = await account.cancelOrderOperation('1.7.12345');
```

### cancelOrder()
Отменяет ордер в блокчейне.

Сигнатура:
```js
async cancelOrder(id)
```

#### Параметры
- `id` - ID ордера для отмены

#### Возвращает
Результат отмены ордера.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Отменить ордер с ID '1.7.12345'
let result = await account.cancelOrder('1.7.12345');
console.log(result);
```

### memo()
Создает зашифрованное сообщение (мемо) для отправки вместе с транзакцией.

Сигнатура:
```js
async memo(toName, message)
```

#### Параметры
- `toName` - имя получателя
- `message` - текст сообщения

#### Возвращает
Объект зашифрованного мемо.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('sender', 'privateKey');
account.setMemoKey('memoPrivateKey'); // Не забудьте установить ключ мемо

let encryptedMemo = await account.memo('recipient', 'Hello, this is a secret message!');
console.log(encryptedMemo);
```

### memoDecode()
Дешифрует зашифрованное мемо.

Сигнатура:
```js
memoDecode(memos)
```

#### Параметры
- `memos` - объект зашифрованного мемо

#### Возвращает
Расшифрованный текст сообщения.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('receiver', 'privateKey');
account.setMemoKey('memoPrivateKey'); // Необходим ключ мемо для дешифровки

// Мемо, полученное из транзакции
let encryptedMemo = {
  from: 'GPH...',
  to: 'GPH...',
  nonce: '12345',
  message: new Uint8Array([...])
};

let decryptedMessage = account.memoDecode(encryptedMemo);
console.log(decryptedMessage); // "Hello, this is a secret message!"
```

### transferOperation()
Создает операцию перевода средств.

Сигнатура:
```js
async transferOperation(toName, assetSymbol, amount, memo)
```

#### Параметры
- `toName` - имя получателя
- `assetSymbol` - символ актива для перевода
- `amount` - количество актива для перевода
- `memo` - опциональное сообщение (может быть строкой или объектом мемо)

#### Возвращает
Объект операции перевода.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('sender', 'privateKey');

// Создание операции перевода
let operation = await account.transferOperation('recipient', 'BTS', 100, 'Thanks for your service!');
```

### transfer()
Выполняет перевод средств в блокчейне.

Сигнатура:
```js
async transfer(...args)
```

#### Параметры
- `...args` - аргументы для transferOperation

#### Возвращает
Результат выполнения перевода.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('sender', 'privateKey');

// Перевести 100 BTS пользователю recipient
let result = await account.transfer('recipient', 'BTS', 100, 'Payment for services');
console.log(result);

// Перевести с зашифрованным мемо (если установлен memoKey)
let encryptedMemo = await account.memo('recipient', 'Private message');
let result2 = await account.transfer('recipient', 'BTS', 10, encryptedMemo);
```

### assetIssueOperation()
Создает операцию выпуска актива.

Сигнатура:
```js
async assetIssueOperation(toName, assetSymbol, amount, memo)
```

#### Параметры
- `toName` - имя получателя
- `assetSymbol` - символ актива для выпуска
- `amount` - количество актива для выпуска
- `memo` - опциональное сообщение

#### Возвращает
Объект операции выпуска актива.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('issuer', 'privateKey');

// Создание операции выпуска
let operation = await account.assetIssueOperation('recipient', 'MYASSET', 1000, 'Issuing new tokens');
```

### assetIssue()
Выполняет выпуск актива в блокчейне.

Сигнатура:
```js
async assetIssue(...args)
```

#### Параметры
- `...args` - аргументы для assetIssueOperation

#### Возвращает
Результат выполнения выпуска актива.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('issuer', 'privateKey');

// Выпустить 1000 MYASSET пользователю recipient
let result = await account.assetIssue('recipient', 'MYASSET', 1000, 'Initial issuance');
console.log(result);
```

### assetReserveOperation()
Создает операцию сжигания (резервирования) актива.

Сигнатура:
```js
async assetReserveOperation(assetSymbol, amount)
```

#### Параметры
- `assetSymbol` - символ актива для сжигания
- `amount` - количество актива для сжигания

#### Возвращает
Объект операции резервирования актива.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('holder', 'privateKey');

// Создание операции сжигания актива
let operation = await account.assetReserveOperation('MYASSET', 100);
```

### assetReserve()
Выполняет сжигание (резервирование) актива в блокчейне.

Сигнатура:
```js
async assetReserve(...args)
```

#### Параметры
- `...args` - аргументы для assetReserveOperation

#### Возвращает
Результат выполнения сжигания актива.

#### Пример
```js
const BitShares = require('xbtsdex');

await BitShares.connect();

let account = new BitShares('holder', 'privateKey');

// Сжечь 100 MYASSET из баланса аккаунта
let result = await account.assetReserve('MYASSET', 100);
console.log(result);
```