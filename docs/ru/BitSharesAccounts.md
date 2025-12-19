# xbtsdex - Документация для работы с аккаунтами

## BitShares.accounts

`BitShares.accounts` - это объект, который позволяет получать информацию об аккаунтах в блокчейне BitShares. Он предоставляет удобный способ доступа к информации об аккаунтах по их именам.

### Получение информации об аккаунте

Синтаксис:
```js
let account = await BitShares.accounts[accountName];
```

Где `accountName` - это имя аккаунта в строковом формате.

### Параметры
- `accountName` - имя аккаунта (например, 'scientistnik', 'trade-bot')

### Возвращает
Объект с информацией об аккаунте, содержащий:
- `id` - ID аккаунта (например, '1.2.12345')
- `name` - имя аккаунта
- `active` - информация об активных ключах
- `owner` - информация о владельческих ключах  
- `options` - опции аккаунта, включая `memo_key` (публичный ключ для мемо)
- `balances` - балансы аккаунта (при использовании с `get_full_accounts`)
- другие поля в зависимости от запрашиваемой информации

### Примеры

#### Получение информации об одном аккаунте
```js
const BitShares = require("xbtsdex");

start()
async function start() {
  await BitShares.connect();

  // Получение информации об аккаунте
  let account = await BitShares.accounts.scientistnik;
  console.log(account);
  
  // Или с использованием строкового индекса
  let account2 = await BitShares.accounts['trade-bot'];
  console.log(account2.id); // '1.2.12345'
  console.log(account2.options.memo_key); // публичный ключ мемо
}
```

#### Получение информации о нескольких аккаунтах
```js
const BitShares = require("xbtsdex");

start()
async function start() {
  await BitShares.connect();

  // Получение информации о нескольких аккаунтах
  let accounts = await Promise.all([
    BitShares.accounts.scientistnik,
    BitShares.accounts['trade-bot'],
    BitShares.accounts['another-account']
  ]);

  console.log(accounts);
}
```

#### Использование информации об аккаунте
```js
const BitShares = require("xbtsdex");

start()
async function start() {
  await BitShares.connect();

  let account = await BitShares.accounts['trade-bot'];
  
  // Использование ID аккаунта для других операций
  console.log('ID аккаунта:', account.id);
  
  // Проверка публичного ключа мемо
  console.log('Ключ мемо:', account.options.memo_key);
  
  // Проверка активных ключей
  console.log('Активные ключи:', account.active.key_auths);
}
```

### Пример использования с экземпляром аккаунта
```js
const BitShares = require("xbtsdex");

start()
async function start() {
  await BitShares.connect();

  // Создание экземпляра аккаунта
  let bot = new BitShares('trade-bot', 'privateActiveKey');
  
  // Получение информации об аккаунте через статический метод
  let accountInfo = await BitShares.accounts['trade-bot'];
  
  // Сравнение публичного ключа из информации об аккаунте с сгенерированным из пароля
  let activeKey = BitShares.PrivateKey.fromSeed('trade-botactivepassword');
  let generatedPubKey = activeKey.toPublicKey().toString();
  
  if (generatedPubKey === accountInfo.active.key_auths[0][0]) {
    console.log('Ключи совпадают, пароли соответствуют');
  } else {
    console.log('Ключи не совпадают, неверная пара логин/пароль');
  }
}
```