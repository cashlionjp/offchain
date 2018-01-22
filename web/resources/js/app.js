const sigUtil = require('eth-sig-util')

var App = (function() {
    var UIController = (function() {
        'use strict';

        var $message, $address, $message, $messageHash, $rParam, $sParam, $vParam, $copymnemonic, $signMessage, $signature;

        function attachUIListeners() {
            $address = $("#address");
            $message = $("#message");
            $messageHash = $("#message-hash");
            $signature = $("#signature");
            $rParam = $("#r-param");
            $sParam = $("#s-param");
            $vParam = $("#v-param");
            $copymnemonic = $("#copy-mnemonic-button");
            $signMessage = $("#sign-message-button");
        }

        return {
            init: function(playFunc) {
                attachUIListeners();
                $address.val(web3.eth.accounts[0]);
                UIController.attachMnemonicButtonClickListener();
                UIController.attachSignMessageClickListener();
            },
            clear: function() {},
            attachMnemonicButtonClickListener: function() {
                $copymnemonic.click(function() {
                    var copyText = document.getElementById("mnemonic");
                    copyText.select();

                    document.execCommand("Copy");
                });
            },
            attachSignMessageClickListener: function() {
                $signMessage.click(function() {
                    sign();
                });
            },
            getMessage: function() {
                return $message.val();
            },
            setSignature: function(val) {
                $signature.val(val);
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
                name: 'Message', // Any string label you want
                value: UIController.getMessage() // The value to sign
            },
            {
                type: 'uint32',
                name: 'A number',
                value: '1337'
            }
        ]
        // signMsg(msgParams, web3.eth.accounts[0]);
        web3.eth.getAccounts(function(err, accounts) {
            if (!accounts) return
            console.log(accounts[0]);
            signMsg(msgParams, accounts[0])
        })
    }

    function signMsg(msgParams, from) {
        web3.currentProvider.sendAsync({
            method: 'eth_signTypedData',
            params: [msgParams, from],
            from: from,
        }, function(err, result) {
            if (err) return console.error(err)
            if (result.error) {
                return console.error(result.error.message);
            }
            console.log(result);
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
    }

    const CONTRACTS = ["Contract"]; // Case sensitive, omit '.json'
    var mainContract = "Contract";
    // var addr = web3.eth.accounts[0];
    // var msg, hex_msg, r, s, v, v_decimal;
    // let signature = web3.eth.sign(addr, hex_msg);
    //
    // signature = signature.substr(2);

    var debug_mode = true;

    function debug(str) {
        if (debug_mode) {
            console.log(str);
        }
    }

    return {
        web3Provider: null,
        contracts: {},
        address: {},
        events: {},

        init: function() {
            debug("Initializing Web App.");
            return App.initWeb3();
        },
        initWeb3: function() {
            debug("Connecting to Web3 Provider..");
            // Initialize web3 and set the provider
            HelperUtil.initWeb3(App);
            return App.initContract();
        },

        initContract: function() {
            debug("Retrieving Smart Contract Artifacts...");
            for (var i = 0; i < CONTRACTS.length; i++) {
                (function(i) {
                    var currentContract = CONTRACTS[i];
                    $.getJSON('contracts/' + currentContract + ".json", function(data) {
                        // Get the necessary contract artifact file and instantiate it with truffle-contract.
                        debug("Connection Established to: " + currentContract);
                        App.contracts[currentContract] = TruffleContract(data);
                        // Set the provider for our contract.
                        App.contracts[currentContract].setProvider(App.web3Provider);
                        debug(currentContract + " Artifact Saved.");
                        if (i == CONTRACTS.length - 1) {
                            return App.bindEvents();
                        }
                    });
                })(i);
            }

            return true;
        },
        callContract: function(debugmsg, funcs) {
            debug(debugmsg.M1);
            App.contracts[mainContract].deployed().then(funcs.call).then(function(result) {
                debug(debugmsg.M2);
                return result;
            }).then(funcs.callback).catch(function(err) {
                debug(err.message);
            });
        },
        play: function() {
            if (true) {
                var dbg = {
                    M1: "Calling Contract..",
                    M2: "Received Result: ",
                }
                var funcs = {
                    call: function(instance) {
                        return instance.play();
                    },
                    callback: function(result) {
                        debug(result);
                    }
                }
                App.callContract(dbg, funcs);
            }
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
                App.web3Provider = web3.currentProvider;
                web3 = new Web3(web3.currentProvider);
            } else {
                // set custom web3 provider
                App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
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
        dummy: function(){
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
