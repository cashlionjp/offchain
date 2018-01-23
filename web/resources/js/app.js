// const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
// var Eth = require('ethjs');
// window.Eth = Eth;

var App = (function() {
    var UIController = (function() {
        'use strict';

        var $message, $address, $message, $messageHash, $rParam, $sParam, $vParam, $copymnemonic, $signMessage, $signature;

        function attachUIListeners() {
            $address = $("#address");
            $signature = $("#signature");
            $rParam = $("#r-param");
            $sParam = $("#s-param");
            $vParam = $("#v-param");

            $message = $("#message");
            $messageHash = $("#message-hash");
            $message.on("input", function() {
                $messageHash.val(web3.sha3($message.val()));
            });

            $copymnemonic = $("#copy-mnemonic-button");
            $copymnemonic.click(function() {
                var copyText = document.getElementById("mnemonic");
                copyText.select();

                document.execCommand("Copy");
            });

            $signMessage = $("#sign-message-button");
            $signMessage.click(function() {
                sign();
            });
        }

        return {
            init: function(playFunc) {
                attachUIListeners();
                $address.val(web3.eth.accounts[0]);
            },
            clear: function() {},
            getMessage: function() {
                return $message.val();
            },
            setSignature: function(signature) {
                $signature.val(signature);
                signature = signature.substr(2);
                UIController.setR('0x' + signature.slice(0, 64));
                UIController.setS('0x' + signature.slice(64, 128));
                var v_decimal = web3.toDecimal('0x' + signature.slice(128, 130));
                v_decimal = v_decimal < 27 ? v_decimal + 27 : v_decimal;
                UIController.setV(v_decimal);
            },
            setMessageHash: function(val) {
                $messageHash.val(val);
            },
            setR: function(val) {
                $rParam.val(val);
            },
            setS: function(val) {
                $sParam.val(val);
            },
            setV: function(val) {
                $vParam.val(val);
            }
        }
    })();

    function sign() {
        const msgParams = [{
            type: 'string', // Any valid solidity type
            name: 'message', // Any string label you want
            value: 'test' // The value to sign
        }];
        // {
        //     type: 'uint32',
        //     name: 'A number',
        //     value: '1337'
        // }];
        web3.eth.getAccounts(function(err, accounts) {
            if (!accounts) return
            var from = accounts[0];
            web3.currentProvider.sendAsync({
                method: 'eth_signTypedData',
                params: [msgParams, from],
                from: from,
            }, function(err, result) {
                if (err) return console.error(err)
                if (result.error) {
                    return console.error(result.error.message)
                }
                UIController.setSignature(result.result);
                const recovered = sigUtil.recoverTypedSignature({
                    data: msgParams,
                    sig: result.result
                })
                if (recovered === from) {
                    alert('Recovered signer: ' + from)
                } else {
                    alert('Failed to verify signer, got: ' + result)
                }
            })
        });
    }

    return {
        web3Provider: null,
        contracts: {},
        address: {},
        events: {},

        init: function() {
            console.log("Initializing Web App.");
            return this.initWeb3();
        },
        initWeb3: function() {
            console.log("Connecting to Web3 Provider..");
            // Initialize web3 and set the provider
            HelperUtil.initWeb3(App);
            return this.bindEvents();
        },
        bindEvents: function() {
            UIController.init();
        }
    }
})();

$(window).on('load', function() {
    App.init();
});

var HelperUtil = (function() {
    return {
        initWeb3: function(app) {
            if (typeof web3 !== 'undefined') {
                // Use embedded web3 object if it exists
                app.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            } else {
                // set custom web3 provider
                app.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
                web3 = new Web3(App.web3Provider);
            }
            this.checkWeb3Info();
        },
        checkWeb3Info: function() {
            this.checkWeb3Node();
            this.checkWeb3Version();
        },
        checkWeb3Node: function() {
            web3.version.getNode((err, result) => {
                console.log(result);
            });
        },
        checkWeb3Version: function() {
            web3.version.getNetwork((err, netId) => {
                switch (netId) {
                    case "1":
                        console.log('This is mainnet')
                        break
                    case "2":
                        console.log('This is the deprecated Morden test network.')
                        break
                    case "3":
                        console.log('This is the ropsten test network.')
                        break
                    default:
                        console.log('This is an unknown network.')
                }
            });
        },
        dummy: function() {
            return;
        }
    }
})();
// addr = web3.eth.accounts[0];
// msg = 'test message';
// hash_msg = web3.sha3(msg);
// signature = web3.eth.sign(addr, hash_msg);

// signature = signature.substr(2);
// r = '0x' + signature.slice(0, 64);
// s = '0x' + signature.slice(64, 128);
// v = '0x' + signature.slice(128, 130);
// v_decimal = web3.toDecimal(v);
// v_decimal = v_decimal < 27 ? v_decimal + 27 : v_decimal;

// contract.verify(hashmsg, v_decimal, r, s);
0x74657374
