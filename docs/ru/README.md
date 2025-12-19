# xbtsdex

Пакет для работы с BitShares DEX (децентрализованная биржа).
Основной класс в пакете - `BitShares`. Все, что вам нужно, находится в нем. Есть еще несколько вспомогательных классов, но они не предназначены для использования вне класса `BitShares`.

Класс `BitShares` состоит из статических методов, предназначенных для работы с публичным API блокчейна BitShares. Используя класс BitShares, вы можете создать объект, методы которого обеспечивают доступ к приватной части API блокчейна BitShares.

## Установка

### Если вы используете `npm`
Библиотеку можно получить через npm:
```
$ npm install xbtsdex
```
Если вы хотите использовать [режим REPL](#режим-repl):
```
$ npm install -g xbtsdex
```

### Если вы используете `браузер`
Подключите [этот файл](https://github.com/technologiespro/xbtsdex/releases) в html-файл:
```
<script src="xbtsdex.js"></script>
```
После этого в консоли будет доступен класс `BitShares`.

## Использование

Пакет __xbtsdex__ содержит класс `BitShares`:
```js
const BitShares = require('xbtsdex')
```
Для подключения к сети BitShares необходимо вызвать метод `connect`:
```js
await BitShares.connect();
```
По умолчанию `BitShares` подключается к `wss://node.xbts.io/ws`. Если вы хотите установить другой узел для подключения:
```js
await BitShares.connect("wss://node.xbts.io/ws")
```

Вы также можете подключиться к сети, используя [систему событий](#система-событий).

### Публичное API

После подключения вы можете использовать любой публичный метод из [официальной документации](http://dev.bitshares.works/en/master/api/blockchain_api.html) (если метод все еще актуален!).

#### API базы данных

Для доступа к [API базы данных](http://dev.bitshares.works/en/master/api/blockchain_api/database.html) вы можете использовать объект __BitShares.db__.

Примеры методов из API базы данных:

[__get_objects(const vector <object_id_type> & ids) const__](http://dev.bitshares.works/en/master/api/blockchain_api/database.html#_CPPv3NK8graphene3app12database_api11get_objectsERK6vectorI14object_id_typeE)

[__list_assets(const string & lower_bound_symbol, uint32_t limit) const__](http://dev.bitshares.works/en/master/api/blockchain_api/database.html#_CPPv3NK8graphene3app12database_api11list_assetsERK6string8uint32_t)

Для их использования:
```js
let obj = await BitShares.db.get_objects(["1.3.0"])
let bts = await BitShares.db.list_assets("BTS", 100)
```

#### API истории

Для доступа к [API истории аккаунтов](http://dev.bitshares.works/en/master/api/blockchain_api/history.html) вы можете использовать объект __BitShares.history__.

Пример метода из API истории аккаунтов:

[__get_account_history (account_id_type account, operation_history_id_type stop = operation_history_id_type (), unsigned limit = 100, operation_history_id_type start = operation_history_id_type ()) const__](http://dev.bitshares.works/en/master/api/blockchain_api/history.html#_CPPv3NK8graphene3app11history_api19get_account_historyEKNSt6stringE25operation_history_id_typej25operation_history_id_type)

Для его использования:
```js
let ops = await BitShares.history.get_account_history("1.2.849826", "1.11.0", 10, "1.11.0")
```

### Приватное API

Если вы хотите получить доступ к операциям аккаунта, вам нужно создать объект BitShares.

Если вы знаете `privateActiveKey`:
```js
let acc = new BitShares(<accountName>, <privateActiveKey>)
```
или если вы знаете `password`:
```js
let acc = BitShares.login(<accountName>, <password>)
```
или если у вас есть `bin`-файл:
```js
let buffer = fs.readFileSync(<путь к bin-файлу>);
let acc = BitShares.loginFromFile(buffer, <пароль кошелька>, <имя аккаунта>)
```

В то время как этот объект может выполнить много операций: покупка, продажа, перевод, отмена ордера, выпуск актива, сжигание актива и многое другое.

Сигнатуры методов:
```js
acc.buy(buySymbol, baseSymbol, amount, price, fill_or_kill = false, expire = "2020-02-02T02:02:02")
acc.sell(sellSymbol, baseSymbol, amount, price, fill_or_kill = false, expire = "2020-02-02T02:02:02")
acc.cancelOrder(id)
acc.transfer(toName, assetSymbol, amount, memo)
acc.assetIssue(toName, assetSymbol, amount, memo)
acc.assetReserve(assetSymbol, amount)
```

Примеры использования:
```js
await acc.buy("HONEST.BTC", "BTS", 0.002, 140000)
await acc.sell("BTS", "HONEST.USD", 187, 0.24)
await acc.transfer("scientistnik", "BTS", 10)
await acc.assetIssue("scientistnik", "ABC", 10)
await acc.assetReserve("ABC", 12)
```

Если вы хотите отправить токены с мемо и получить `acc` из `constructor` (используйте `new BitShares()`), то перед этим вам нужно установить приватный ключ мемо:
```js
bot.setMemoKey(<privateMemoKey>)
await bot.transfer("scientistnik", "HONEST.USD", 10, "Thank you for BTSDEX!")
```

### Расширенные операции

Библиотека поддерживает множество расширенных операций помимо базовых:

- `buyOperation()` / `buy()` - размещение ордеров на покупку
- `sellOperation()` / `sell()` - размещение ордеров на продажу
- `limitOrderCreateOperation()` / `limitOrderCreate()` - создание лимитных ордеров
- `cancelOrderOperation()` / `cancelOrder()` - отмена ордеров
- `assetIssueOperation()` / `assetIssue()` - выпуск активов
- `assetReserveOperation()` / `assetReserve()` - сжигание/резервирование активов
- `orders()` - получение открытых ордеров аккаунта
- `balances()` - получение балансов аккаунта для конкретных активов
- `getOrder()` - получение информации о конкретном ордере
- `memo()` / `memoDecode()` - шифрование/дешифрование мемо
- И многие другие методы для взаимодействия с блокчейном BitShares

### Методы генерации ключей

Библиотека предоставляет два метода для генерации ключей аккаунта:

1. `generateKeys()` - Традиционный метод с использованием нормализации мозгового ключа
2. `generateKeysPBKDF2()` - Более безопасный метод с использованием PBKDF2 с 40 000 итерациями

Пример генерации ключей:
```js
// Традиционный метод
let keys = BitShares.generateKeys('имяаккаунта', 'надежныйпароль', ['active', 'owner', 'memo']);

// Более безопасный метод PBKDF2
let secureKeys = BitShares.generateKeysPBKDF2('имяаккаунта', 'надежныйпароль', ['active', 'owner', 'memo']);
```

### Конструктор транзакций

Каждая приватная транзакция считается принятой после включения в блок. Блоки создаются каждые 3 секунды. Если нам нужно выполнить несколько операций, их последовательное выполнение может занять considerable время. К счастью, несколько операций можно включить в одну транзакцию. Для этого нужно использовать конструктор транзакций.

Для создания новой транзакции:
```js
let tx = BitShares.newTx([<privateActiveKey>,...])
```
или если у вас есть объект аккаунта `acc`:
```js
let tx = acc.newTx()
```

Для получения объектов операций:
```js
let operation1 = await acc.transferOperation("technologiesbro", "BTS", 10)
let operation2 = await acc.assetIssueOperation("technologiesbro", "ABC", 10)
...
```
Добавление операции в транзакцию:
```js
tx.add(operation1)
tx.add(operation2)
...
```
Если вы хотите узнать стоимость транзакции:
```js
let cost = await tx.cost()
console.log(cost) // { BTS: 1.234 }
```

После трансляции транзакции:
```js
await tx.broadcast()
```
или
```js
await acc.broadcast(tx)
```

Если вы знаете, из каких полей состоит нужная вам транзакция, и имя операции, вы можете использовать конструктор транзакций для выполнения транзакции.

Свойство account имеет гораздо больше доступных операций, чем экземпляр класса bitshares.

Пример использования конструктора транзакций для выполнения операции 'account_create':
```js
let BitShares = require("xbtsdex")

BitShares.subscribe("connected", start)

async function start() {
  let acc = await BitShares.login(<имя аккаунта>, <пароль>)

  let params = {
    fee: {amount: 0, asset_id: "1.3.0"},
    name: "trade-bot3",
    registrar: "1.2.21058",
    referrer: "1.2.21058",
    referrer_percent: 5000,
    owner: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[<публичный ключ владельца>, 1]],
      address_auths: []
    },
    active: {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[<публичный ключ активный>, 1]],
      address_auths: []
    },
    options: {
      memo_key: <публичный ключ мемо>,
      voting_account: "1.2.5",
      num_witness: 0,
      num_committee: 0,
      votes: []
    },
    extensions: []
  };

  let tx = acc.newTx()
  tx.account_create(params) // 'account_create' - это имя операции
  await tx.broadcast()
}
```

### Система событий
Очень часто нам приходится ожидать, когда произойдет какое-то действие в блокчейне, на которое должно отреагировать наше программное обеспечение. Идея чтения каждого блока и просмотра всех операций в нем показалась мне неэффективной. Поэтому в это обновление добавлена система событий.

#### Типы событий

На данный момент __XBTSDEX__ имеет три типа событий:
* `connected` - срабатывает один раз после подключения к блокчейну;
* `block` - срабатывает, когда создается новый блок в блокчейне;
* `account` - происходит, когда изменяется указанный аккаунт (изменение баланса).

Например:
```js
const BitShares = require("xbtsdex");

BitShares.subscribe('connected', startAfterConnected);
BitShares.subscribe('block', callEachBlock);
BitShares.subscribe('account', changeAccount, 'trade-bot');

async function startAfterConnected() {/* вызывается один раз после подключения к блокчейну */}
async function callEachBlock(obj) {/* вызывается при создании нового блока */}
async function changeAccount(array) {/* вызывается при изменении аккаунта 'trade-bot' */}
```

##### Событие `connected`

Это событие срабатывает один раз, после подключения к блокчейну. На это событие можно подписаться любое количество функций, и все они будут вызваны после подключения.

```js
BitShares.subscribe('connected', firstFunction);
BitShares.subscribe('connected', secondFunction);
```

Еще одна особенность события в том, что при первом вызове подписки метод `BitShares.connect()` вызывается автоматически, т.е. будет автоматическое подключение. Если к этому времени подключение к блокчейну уже установлено, то просто будет вызвана функция.

Теперь необязательно явно вызывать `BitShares.connect()`, достаточно подписаться на событие `connected`.

```js
const BitShares = require("xbtsdex");

BitShares.subscribe('connected', start);

async function start() {
  // что-то происходит здесь
}
```

##### Событие `block`

Событие `block` срабатывает, когда создается новый блок в блокчейне. Первая подписка на событие автоматически создает подписку на событие `connected`, и если это первая подписка, это вызовет подключение к блокчейну.

```js
const BitShares = require("xbtsdex");

BitShares.subscribe('block', newBlock);

// нужно подождать ~ 10-15 секунд
async function newBlock(obj) {
  console.log(obj); // [{id: '2.1.0', head_block_number: 17171083, time: ...}]
}
```

Как видно из примера, в подписанные функции передается объект с полями блока.

##### Событие `account`

Событие `account` срабатывает, когда происходят определенные изменения (изменения баланса). К ним относятся:
* Если аккаунт отправил кому-то один из своих активов
* Если актив был отправлен на аккаунт
* Если аккаунт создал ордер
* Если ордер аккаунта был исполнен (частично или полностью) или был отменен.

Первый подписчик на `account` вызовет подписку `block`, что в конечном итоге приведет к подключению к блокчейну.

Пример кода:
```js
const BitShares = require("xbtsdex");

BitShares.subscribe('account', changeAccount, 'technologiesbro');

async function changeAccount (array) {
  console.log(array); // [{id: '1.11.37843675', block_num: 17171423, op: ...}, {...}]
}
```
Во все подписанные функции передается массив объектов истории аккаунта, произошедших с момента последнего события.

### Режим REPL

Если вы установите пакет `xbtsdex` в глобальное хранилище, вы можете запустить исполняемый скрипт `xbtsdex`:
```js
$ btsdex
>|
```
Эта команда пытается автоматически подключиться к основной сети BitShares. Если вы хотите подключиться к тестовой сети, попробуйте это:
```js
$ btsdex --testnet
>|
```
или используйте ключ `--node`:
```js
$ btsdex --node wss://node.xbts.io/ws
>|
```

Это nodejs REPL с несколькими переменными:
- `BitShares`, основной класс пакета `BitShares`
- `login`, функция для создания объекта класса `BitShares`
- `generateKeys`, для генерации ключей из логина и пароля
- `accounts`, аналог `BitShares.accounts`
- `assets`, аналог `BitShares.assets`
- `db`, аналог `BitShares.db`
- `history`, аналог `BitShares.history`
- `network`, аналог `BitShares.network`
- `fees`, аналог `BitShares.fees`

#### Например

```js
$ btsdex
> assets["bts"].then(console.log)
```

#### Краткий запрос

Если нужно выполнить только один запрос, можно использовать ключи `--account`, `--asset`, `--block`, `--object`, `--history` или `--transfer` в командной строке:
```js
$ btsdex --account <'name' or 'id' or 'last number in id'>
{
  "id": "1.2.5992",
  "membership_expiration_date": "1970-01-01T00:00:00",
  "registrar": "1.2.37",
  "referrer": "1.2.21",
  ...
}
$ btsdex --asset <'symbol' or 'id' or 'last number in id'>
{
  "id": "1.3.0",
  "symbol": "BTS",
  "precision": 5,
  ...
}
$ btsdex --block [<number>]
block_num: 4636380
{
  "previous": "0046bedba1317d146dd6afbccff94412d76bf094",
  "timestamp": "2018-10-01T13:09:40",
  "witness": "1.6.41",
  ...
}
$ btsdex --object 1.2.3
{
  "id": "1.2.3",
  "membership_expiration_date": "1969-12-31T23:59:59",
  "registrar": "1.2.3",
  "referrer": "1.2.3",
  ...
}
$ btsdex --history <account> [<limit>] [<start>] [<stop>]
[
  {
    "id": "1.11.98179",
    "op": [
      0,
  ...
}]
$ btsdex --transfer <from> <to> <amount> <asset> [--key]
Transfered <amount> <asset> from '<from>' to '<to>' with memo '<memo>'
```

### Вспомогательные классы
Есть еще несколько вспомогательных классов, таких как __BitShares.assets__ и __BitShares.accounts__:
```js
let usd = await BitShares.assets.usd;
let btc = await BitShares.assets["XBTSX.BTC"];
let bts = await BitShares.assets["bts"];

let iam = await BitShares.accounts.scientistnik;
let tradebot = await BitShares.accounts["trade-bot"];
```
Возвращаемые объекты содержат все поля, которые блокчейн возвращает при запросе конкретного актива или имени аккаунта.

### Несколько примеров
Ниже приведенный пример можно использовать для трансляции любой транзакции в блокчейн BitShares с помощью API узла, поэтому вы можете использовать любой публичный API узла BitShares, вам нужно будет только заменить параметры под **params** и имя операции **asset_update** в приведенном ниже примере на ваши желаемые параметры транзакции и имя операции. Используйте приведенные ниже ссылки, чтобы определить желаемое имя операции и необходимые параметры вместе с их требуемым порядком. Ниже приведен пример сериализации транзакции можно найти здесь [Serialization](https://github.com/bitshares/btsdex/blob/master/packages/serializer/src/operations.js), так как вам нужно будет соблюдать порядок [Operation](https://github.com/bitshares/bitshares-core/blob/master/libraries/protocol/include/graphene/protocol/operations.hpp) параметров вместе с их подпараметрами, которые присутствуют в приведенном ниже примере **new_options**, обратите внимание, что некоторые параметры или подпараметры являются необязательными:

```js
const BitShares = require("xbtsdex");
BitShares.connect("wss://dex.iobanker.com/ws"); # замените wss://dex.iobanker.com/ws на API узел, если вы хотите использовать другой API узла BitShares
BitShares.subscribe('connected', startAfterConnected);

async function startAfterConnected() {
let acc = await new BitShares("username", "password"); # замените с вашим именем пользователя и паролем

# Ниже приведены необходимые параметры и структура для примера операции *asset_update*; каждая другая операция потребует различные параметры и структуру

# Нахождение данных, которые нужно использовать в этих параметрах, потребует понимания того, как работает блокчейн BitShares, например, *issuer* относится к ID *1.2.1787259* владельца актива, используйте группу в телеграмме [BitShares Development](https://t.me/BitSharesDEV) чтобы спросить о необходимых параметрах

let params = {
    fee: {amount: 0, asset_id: "1.3.0"},
    "issuer":"1.2.1787259",
    "asset_to_update":"1.3.5537",
    "new_options": {
     "max_supply": "1000000000000000",
     "market_fee_percent": 0,
     "max_market_fee": "0",
     "min_market_fee": 0,
     "issuer_permissions": 79,
     "flags": 6,
     "core_exchange_rate": {
      "base": {"amount": 500000, "asset_id": "1.3.0"},
      "quote": {"amount": 10000, "asset_id": "1.3.5537"}
      },
    "whitelist_authorities": [],
    "blacklist_authorities": [],
    "whitelist_markets": [],
    "blacklist_markets": [],
    "description": "{\"main\":\"Ваша информация об активе\",\"market\":\"Ваша информация о рынке\"}",
    "extensions": {"taker_fee_percent": 10}
    }
}

let tx = acc.newTx();
tx.asset_update(params); # Замените asset_update на желаемое имя операции
await tx.broadcast();
console.log(tx);
}
```

Другой пример получения информации об ордерах аккаунта:

```js
const BitShares = require('xbtsdex')
KEY = 'privateActiveKey'

BitShares.subscribe('connected', startAfterConnected)

async function startAfterConnected() {
  let bot = new BitShares('trade-bot', KEY)

  let iam = await BitShares.accounts['trade-bot'];
  let orders = await BitShares.db.get_full_accounts([iam.id], false);

  orders = orders[0][1].limit_orders;
  let order = orders[0].sell_price;
  console.log(order)
}
```

## Документация
Для получения дополнительной информации смотрите [wiki](https://scientistnik.github.io/btsdex) или в папке `docs`.

## Лицензия

Пакет доступен как открытый исходный код на условиях [лицензии MIT](http://opensource.org/licenses/MIT).