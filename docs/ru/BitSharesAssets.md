# xbtsdex - Документация вспомогательных классов

## BitShares.assets

Класс для работы с активами блокчейна BitShares.

### Получение актива
```js
let bts = await BitShares.assets.bts;
let usd = await BitShares.assets["USD"];
let btc = await BitShares.assets["XBTSX.BTC"];
```

### Примеры использования
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

// Получение информации об активе BTS
let bts = await BitShares.assets.bts;
console.log(bts.id);        // "1.3.0"
console.log(bts.symbol);    // "BTS"
console.log(bts.precision); // 5

// Получение информации об пользовательском активе
let myAsset = await BitShares.assets["MYASSET"];
console.log(myAsset);
```

## BitShares.accounts

Класс для работы с аккаунтами блокчейна BitShares.

### Получение аккаунта
```js
let iam = await BitShares.accounts.scientistnik;
let tradebot = await BitShares.accounts["trade-bot"];
```

### Примеры использования
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

// Получение информации об аккаунте
let account = await BitShares.accounts["trade-bot"];
console.log(account.id);           // "1.2.12345"
console.log(account.name);         // "trade-bot"
console.log(account.active);       // информация об активных ключах
console.log(account.options.memo_key); // публичный ключ мемо
```

## BitShares.fees

Класс для работы с комиссиями в блокчейне BitShares.

### Примеры использования
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

// Получение информации о комиссиях
let fees = BitShares.fees;
console.log(fees);

// Получение комиссии за конкретную операцию
let transferFee = await BitShares.fees.transfer();
console.log(transferFee);
```

## BitShares.TransactionBuilder

Класс для построения транзакций с несколькими операциями.

### Пример использования
```js
const BitShares = require("xbtsdex");
await BitShares.connect();

let account = new BitShares('trade-bot', 'privateKey');

// Создание новой транзакции
let tx = account.newTx();

// Получение операций
let operation1 = await account.transferOperation('recipient', 'BTS', 10, 'memo');
let operation2 = await account.assetIssueOperation('recipient', 'MYASSET', 100);

// Добавление операций в транзакцию
tx.add(operation1);
tx.add(operation2);

// Трансляция транзакции
await tx.broadcast();
```

## BitShares.PrivateKey

Класс для работы с приватными ключами.

### Примеры использования
```js
const BitShares = require("xbtsdex");
const { PrivateKey } = BitShares;

// Создание приватного ключа из WIF
let privateKey = PrivateKey.fromWif('5JAEWA5u6DmroQ6kBd13Vf9fmtnVduwzNFib1gESBTx5GiKuDXJ');

// Создание приватного ключа из сида
let keyFromSeed = PrivateKey.fromSeed('some seed phrase');

// Получение публичного ключа
let publicKey = privateKey.toPublicKey();
console.log(publicKey.toString());
```

## BitShares.Aes

Класс для шифрования/дешифрования данных с использованием AES.

### Примеры использования
```js
const BitShares = require("xbtsdex");
const { Aes } = BitShares;

// Создание AES объекта из сида
let aes = Aes.fromSeed('password');

// Шифрование
let encrypted = aes.encryptToHex('secret message');
console.log(encrypted);

// Дешифрование
let decrypted = aes.decryptHex('encrypted hex string');
console.log(decrypted);
```