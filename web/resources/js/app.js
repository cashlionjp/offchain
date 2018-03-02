const sigUtil = require('eth-sig-util');

const App = (function() {

    var UIController = (function() {
        'use strict';

        var $message, $address, $message, $messageHash, $rParam, $sParam,
            $vParam, $copymnemonic, $signMessage, $signature, $number;

        function updateHash() {
            var typedParams = msgParams($message.val(), $number.val());
            $messageHash.val(sigUtil.typedSignatureHash(typedParams));
        }

        function attachUIListeners() {
            $address = $("#address");
            $signature = $("#signature");
            $rParam = $("#r-param");
            $sParam = $("#s-param");
            $vParam = $("#v-param");

            $messageHash = $("#message-hash");

            $number = $("#number");
            $number.on("input", updateHash);
            $message = $("#message");
            $message.on("input", updateHash);

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
            getNumber: function() {
                return $number.val();
            },
            setSignature: function(signature) {
                $signature.val(signature);
                signature = signature.substr(2);
                this.setR('0x' + signature.slice(0, 64));
                this.setS('0x' + signature.slice(64, 128));
                var v_decimal = web3.toDecimal('0x' + signature.slice(128, 130));
                v_decimal = v_decimal < 27 ? v_decimal + 27 : v_decimal;
                this.setV(v_decimal);
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

    function msgParams(message, num) {
        'use strict';
        var output = [{
            type: 'string', // Any valid solidity type
            name: 'Message', // Any string label you want
            value: message // The value to sign
        }, {
            type: 'uint32',
            name: 'A number',
            value: num
        }];
        return output;
    }

    function sign() {
        web3.eth.getAccounts(function(err, accounts) {
            if (!accounts) return
            var msg = UIController.getMessage();
            var num = UIController.getNumber();
            var from = accounts[0];
            web3.currentProvider.sendAsync({
                method: 'eth_signTypedData',
                params: [msgParams(msg, num), from],
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
