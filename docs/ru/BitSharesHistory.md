# xbtsdex - Документация API истории

Для доступа к [API истории аккаунтов](http://dev.bitshares.works/en/master/api/blockchain_api/history.html) можно использовать объект __BitShares.history__.

## get_account_history()
Получает историю операций аккаунта.

Сигнатура:
```js
get_account_history(account, stop = "1.11.0", limit = 100, start = "1.11.0")
```

### Параметры
- `account` - ID аккаунта или имя аккаунта
- `stop` - ID истории остановки (по умолчанию: "1.11.0")
- `limit` - максимальное количество операций (по умолчанию: 100, максимум: 100)
- `start` - ID истории начала (по умолчанию: "1.11.0")

### Возвращает
Массив объектов истории операций аккаунта.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let history = await BitShares.history.get_account_history("1.2.849826", "1.11.0", 50, "1.11.0");
console.log(history);
// [
//   {
//     id: "1.11.98179",
//     block_num: 17171423,
//     trx_in_block: 0,
//     op_in_trx: 0,
//     virtual_op: 0,
//     op: [0, {...}] // [operation_type, operation_data]
//   },
//   ...
// ]
```

## get_account_history_by_operations()
Получает историю операций аккаунта по конкретным типам операций.

Сигнатура:
```js
get_account_history_by_operations(account, operationTypes, start, stop, limit)
```

### Параметры
- `account` - ID аккаунта или имя аккаунта
- `operationTypes` - массив типов операций для фильтрации
- `start` - начальный ID истории
- `stop` - конечный ID истории
- `limit` - максимальное количество операций

### Возвращает
Массив объектов истории операций аккаунта, отфильтрованных по типу операции.

## get_relative_account_history()
Получает относительную историю аккаунта.

Сигнатура:
```js
get_relative_account_history(account, stop, limit, start)
```

### Параметры
- `account` - ID аккаунта или имя аккаунта
- `stop` - относительный номер остановки
- `limit` - максимальное количество операций
- `start` - относительный номер начала

### Возвращает
Массив объектов истории операций аккаунта.

## get_fill_order_history()
Получает историю исполнения ордеров для пары активов.

Сигнатура:
```js
get_fill_order_history(baseId, quoteId, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `limit` - максимальное количество записей

### Возвращает
Массив объектов с информацией об исполнении ордеров.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let fills = await BitShares.history.get_fill_order_history("1.3.0", "1.3.121", 100);
console.log(fills);
```

## get_market_history()
Получает историю рынка для пары активов.

Сигнатура:
```js
get_market_history(baseId, quoteId, bucketSize, start, stop)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `bucketSize` - размер интервала в секундах (например, 60 для 1 минуты, 3600 для 1 часа)
- `start` - начальная метка времени
- `stop` - конечная метка времени

### Возвращает
Массив объектов с историей рынка в заданных интервалах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let start = new Date();
start.setDate(start.getDate() - 1); // вчера
let stop = new Date(); // сегодня

let marketHistory = await BitShares.history.get_market_history(
  "1.3.0",    // BTS
  "1.3.121",  // USD
  3600,       // 1 час
  start.toISOString().slice(0, -5),
  stop.toISOString().slice(0, -5)
);
console.log(marketHistory);
```

## get_market_history_buckets()
Получает доступные размеры интервалов для истории рынка.

Сигнатура:
```js
get_market_history_buckets()
```

### Возвращает
Массив доступных размеров интервалов в секундах.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let buckets = await BitShares.history.get_market_history_buckets();
console.log(buckets); // [60, 300, 900, 1800, 3600, 14400, 86400]
```

## get_trade_history()
Получает историю торгов для пары активов.

Сигнатура:
```js
get_trade_history(baseId, quoteId, start, stop, limit)
```

### Параметры
- `baseId` - ID базового актива
- `quoteId` - ID котируемого актива
- `start` - начальная метка времени
- `stop` - конечная метка времени
- `limit` - максимальное количество записей

### Возвращает
Массив объектов с историей торгов.

### Пример:
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let start = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 часа назад
let stop = new Date();

let trades = await BitShares.history.get_trade_history(
  "1.3.0",    // BTS
  "1.3.121",  // USD
  start.toISOString().slice(0, -5),
  stop.toISOString().slice(0, -5),
  50
);
console.log(trades);
```