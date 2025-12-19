# xbtsdex - Документация API базы данных

Для доступа к [API базы данных](http://docs.bitshares.org/api/database.html) можно использовать объект __BitShares.db__.

## get_objects()
Получает объекты по их идентификаторам.

Сигнатура:
```js
get_objects(const vector<object_id_type> &ids)
```

### Параметры
- `ids` - массив идентификаторов объектов

### Возвращает
Массив объектов, соответствующих переданным идентификаторам.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let [bts, account, order] = await BitShares.db.get_objects(['1.3.0','1.2.849826','1.7.65283036']);

console.log(bts, account, order);
```

## get_dynamic_global_properties()
Получает динамические глобальные свойства блокчейна.

Сигнатура:
```js
get_dynamic_global_properties()
```

### Возвращает
Объект с динамическими глобальными свойствами.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let props = await BitShares.db.get_dynamic_global_properties();
console.log(props);
```

## get_global_properties()
Получает глобальные свойства блокчейна.

Сигнатура:
```js
get_global_properties()
```

### Возвращает
Объект с глобальными свойствами.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let props = await BitShares.db.get_global_properties();
console.log(props);
```

## get_block()
Получает блок по его номеру.

Сигнатура:
```js
get_block(blockNum)
```

### Параметры
- `blockNum` - номер блока

### Возвращает
Объект с информацией о блоке или null, если блок не найден.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let block = await BitShares.db.get_block(1000000);
console.log(block);
```

## get_account_balances()
Получает балансы аккаунта для указанных активов.

Сигнатура:
```js
get_account_balances(accountId, assets)
```

### Параметры
- `accountId` - ID аккаунта
- `assets` - массив ID активов (если пустой - возвращает все активы аккаунта)

### Возвращает
Массив объектов с информацией о балансах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let balances = await BitShares.db.get_account_balances('1.2.849826', ['1.3.0']);
console.log(balances);
```

## get_full_accounts()
Получает полную информацию об аккаунтах.

Сигнатура:
```js
get_full_accounts(accountNames, subscribe)
```

### Параметры
- `accountNames` - массив имен аккаунтов
- `subscribe` - флаг подписки на изменения

### Возвращает
Массив объектов с полной информацией об аккаунтах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let fullAccounts = await BitShares.db.get_full_accounts(['account1', 'account2'], true);
console.log(fullAccounts);
```

## get_accounts()
Получает информацию об аккаунтах по их ID.

Сигнатура:
```js
get_accounts(accountIds)
```

### Параметры
- `accountIds` - массив ID аккаунтов

### Возвращает
Массив объектов с информацией об аккаунтах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let accounts = await BitShares.db.get_accounts(['1.2.849826', '1.2.123456']);
console.log(accounts);
```

## get_assets()
Получает информацию об активах по их ID.

Сигнатура:
```js
get_assets(assetIds)
```

### Параметры
- `assetIds` - массив ID активов

### Возвращает
Массив объектов с информацией об активах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let assets = await BitShares.db.get_assets(['1.3.0', '1.3.121']);
console.log(assets);
```

## get_ticker()
Получает тикер для пары активов.

Сигнатура:
```js
get_ticker(base, quote)
```

### Параметры
- `base` - символ базового актива
- `quote` - символ котируемого актива

### Возвращает
Объект с информацией о тикере.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let ticker = await BitShares.db.get_ticker('BTS', 'USD');
console.log(ticker);
```

## get_order_book()
Получает стакан заявок для пары активов.

Сигнатура:
```js
get_order_book(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество ордеров для отображения

### Возвращает
Объект с информацией о стакане заявок.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let orderBook = await BitShares.db.get_order_book('1.3.0', '1.3.121', 50);
console.log(orderBook);
```

## get_limit_orders()
Получает лимитные ордера для пары активов.

Сигнатура:
```js
get_limit_orders(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество ордеров

### Возвращает
Массив объектов с информацией о лимитных ордерах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let limitOrders = await BitShares.db.get_limit_orders('1.3.0', '1.3.121', 100);
console.log(limitOrders);
```

## get_settle_orders()
Получает ордера по расчету для пары активов.

Сигнатура:
```js
get_settle_orders(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество ордеров

### Возвращает
Массив объектов с информацией о расчетных ордерах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let settleOrders = await BitShares.db.get_settle_orders('1.3.0', '1.3.121', 100);
console.log(settleOrders);
```

## get_margin_positions()
Получает маржинальные позиции аккаунта.

Сигнатура:
```js
get_margin_positions(accountId)
```

### Параметры
- `accountId` - ID аккаунта

### Возвращает
Массив объектов с информацией о маржинальных позициях.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let positions = await BitShares.db.get_margin_positions('1.2.849826');
console.log(positions);
```

## get_witnesses()
Получает информацию о свидетелях по их ID.

Сигнатура:
```js
get_witnesses(witnessIds)
```

### Параметры
- `witnessIds` - массив ID свидетелей

### Возвращает
Массив объектов с информацией о свидетелях.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let witnesses = await BitShares.db.get_witnesses(['1.6.1', '1.6.2']);
console.log(witnesses);
```

## get_committee_members()
Получает информацию о членах комитета по их ID.

Сигнатура:
```js
get_committee_members(memberIds)
```

### Параметры
- `memberIds` - массив ID членов комитета

### Возвращает
Массив объектов с информацией о членах комитета.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let committee = await BitShares.db.get_committee_members(['1.5.1', '1.5.2']);
console.log(committee);
```

## get_vesting_balances()
Получает счета с вестингом для аккаунта.

Сигнатура:
```js
get_vesting_balances(accountId)
```

### Параметры
- `accountId` - ID аккаунта

### Возвращает
Массив объектов с информацией о счетах с вестингом.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let vestingBalances = await BitShares.db.get_vesting_balances('1.2.849826');
console.log(vestingBalances);
```

## get_withdraw_permissions_by_account()
Получает разрешения на вывод для аккаунта.

Сигнатура:
```js
get_withdraw_permissions_by_account(accountId)
```

### Параметры
- `accountId` - ID аккаунта

### Возвращает
Массив объектов с информацией о разрешениях на вывод.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let permissions = await BitShares.db.get_withdraw_permissions_by_account('1.2.849826');
console.log(permissions);
```

## get_proposed_transactions()
Получает предложенные транзакции для аккаунта.

Сигнатура:
```js
get_proposed_transactions(accountId)
```

### Параметры
- `accountId` - ID аккаунта

### Возвращает
Массив объектов с информацией о предложенных транзакциях.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let proposals = await BitShares.db.get_proposed_transactions('1.2.849826');
console.log(proposals);
```

## get_short_orders()
Получает шортовые ордера для пары активов.

Сигнатура:
```js
get_short_orders(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество ордеров

### Возвращает
Массив объектов с информацией о шортовых ордерах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let shortOrders = await BitShares.db.get_short_orders('1.3.0', '1.3.121', 100);
console.log(shortOrders);
```

## get_liquidity_pools()
Получает пулы ликвидности для пары активов.

Сигнатура:
```js
get_liquidity_pools(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество пулов

### Возвращает
Массив объектов с информацией о пулах ликвидности.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let pools = await BitShares.db.get_liquidity_pools('1.3.0', '1.3.121', 100);
console.log(pools);
```

## get_worker_proposals()
Получает предложения работников.

Сигнатура:
```js
get_worker_proposals()
```

### Возвращает
Массив объектов с информацией о предложениях работников.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let workers = await BitShares.db.get_worker_proposals();
console.log(workers);
```

## get_budget_records()
Получает записи бюджета.

Сигнатура:
```js
get_budget_records()
```

### Возвращает
Массив объектов с информацией о записях бюджета.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let budget = await BitShares.db.get_budget_records();
console.log(budget);
```

## lookup_accounts()
Поиск аккаунтов по начальным символам имени.

Сигнатура:
```js
lookup_accounts(startChar, limit)
```

### Параметры
- `startChar` - начальные символы имени аккаунта
- `limit` - максимальное количество результатов

### Возвращает
Массив пар [имя аккаунта, ID аккаунта].

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let accounts = await BitShares.db.lookup_accounts('user', 10);
console.log(accounts);
// [['username1', '1.2.12345'], ['username2', '1.2.12346'], ...]
```

## lookup_asset_symbols()
Поиск активов по символам.

Сигнатура:
```js
lookup_asset_symbols(symbols)
```

### Параметры
- `symbols` - массив символов активов

### Возвращает
Массив объектов с информацией об активах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let assets = await BitShares.db.lookup_asset_symbols(['BTS', 'USD']);
console.log(assets);
```

## set_subscribe_callback()
Устанавливает callback-функцию для получения обновлений объектов.

Сигнатура:
```js
set_subscribe_callback(callback, notifyRemoveCreate)
```

### Параметры
- `callback` - функция обратного вызова для получения обновлений
- `notifyRemoveCreate` - флаг уведомления о создании/удалении объектов

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

BitShares.db.set_subscribe_callback((updates) => {
  console.log('Объекты обновлены:', updates);
}, false);
```

## subscribe_to_market()
Подписывается на изменения конкретного рынка.

Сигнатура:
```js
subscribe_to_market(callback, baseId, quoteId)
```

### Параметры
- `callback` - функция обратного вызова для получения обновлений рынка
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

BitShares.db.subscribe_to_market((updates) => {
  console.log('Рынок обновлен:', updates);
}, '1.3.0', '1.3.121');
```

## unsubscribe_from_market()
Отписывается от изменений конкретного рынка.

Сигнатура:
```js
unsubscribe_from_market(callback, baseId, quoteId)
```

### Параметры
- `callback` - функция обратного вызова для получения обновлений рынка
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

BitShares.db.unsubscribe_from_market((updates) => {
  console.log('Рынок обновлен:', updates);
}, '1.3.0', '1.3.121');
```

## set_pending_transaction_callback()
Устанавливает callback-функцию для получения ожидающих транзакций.

Сигнатура:
```js
set_pending_transaction_callback(callback)
```

### Параметры
- `callback` - функция обратного вызова для получения ожидающих транзакций

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

BitShares.db.set_pending_transaction_callback((transaction) => {
  console.log('Новая транзакция:', transaction);
});
```