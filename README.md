# OffTheChain

Simple DAPP testing:
* Message Signing - Completed as of v0.1.0 - 276fdfb7807880fab43b1cd57ebf4afbc2deb434
* P2P communication

BUILD INSTRUCTIONS:

Requires:
* TruffleFramework
* Ganache or some other testnet
* Browserify

To package app.js dependancies without node.js
```bash
browserify web/resources/js/app.js -o web/resources/js/bundle.js
```

To Run:
```bash
cd <Project Root DIR>
truffle compile
truffle migrate
```
Manually copy build/contracts/Contract.json to web/contracts/
or
```bash
mkdir web/contracts && cp build/contracts/Contract.json web/contracts/
```
Manually copy web/ to server path
or
```bash
cp -rT web/ /var/www/html/
```
