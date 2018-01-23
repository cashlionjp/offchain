# OffTheChain

Simple DAPP testing:
* Message Signing - Completed as of v0.1.0 - 276fdfb7807880fab43b1cd57ebf4afbc2deb434
* P2P communication

BUILD INSTRUCTIONS:

Requires:
* TruffleFramework
* Ganache or some other testnet
To package app.js dependancies without node.js
* Browserify
```bash
browserify web/resources/js/app.js -o web/resources/js/bundle.js
```

To Run:
```bash
# Manually navigate to project's root directory - OR
cd <Project Root DIR>
truffle compile
truffle migrate

# Manually copy build/contracts/Contract.json to web/contracts/  - OR
mkdir web/contracts && cp build/contracts/Contract.json web/contracts/

# Manually copy web/ to server path  - OR
cp -rT web/ /var/www/html/
```
