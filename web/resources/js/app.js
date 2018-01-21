var App = (function() {
    var UIController = (function() {
        'use strict';

        function attachUIListeners() {
            $element = $("#element");
        }

        return {
            init: function(playFunc) {
                attachUIListeners();
            },
            clear: function() {
            },
        }
    })();

    var HelperFunctions = (function(){

        return {
            toHex: function(str) {
            	var hex = '';
            	for(var i=0;i<str.length;i++) {
            		hex += ''+str.charCodeAt(i).toString(16);
            	}
            	return hex;
            },
        }
    }

    const CONTRACTS = ["Contract"];  // Case sensitive, omit '.json'
    var mainContract = "Contract";
    var addr = web3.eth.accounts[0];
    var msg = 'school bus';
    var hex_msg = '0x' + toHex(msg);
    let signature = web3.eth.sign(addr, hex_msg);

    signature = signature.substr(2);
    var r = '0x' + signature.slice(0, 64);
    var s = '0x' + signature.slice(64, 128);
    var v = '0x' + signature.slice(128, 130);
    var v_decimal = web3.toDecimal(v);

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
                (function(i){
                    var currentContract = CONTRACTS[i];
                    $.getJSON('/web/contracts/' + currentContract + ".json", function(data) {
                        // Get the necessary contract artifact file and instantiate it with truffle-contract.
                        debug("Connection Established to: " + currentContract);
                        App.contracts[currentContract] = TruffleContract(data);
                        // Set the provider for our contract.
                        App.contracts[currentContract].setProvider(App.web3Provider);
                        debug(currentContract + " Artifact Saved.");
                        if (i == CONTRACTS.length -1) {
                            return App.bindEvents();
                        }
                    });
                })(i);
            }

            return true;
        },
        callContract: function(debugmsg, funcs){
                debug(debugmsg.M1);
                App.contracts[mainContract].deployed().then(funcs.call).then(function(result){
                    debug(debugmsg.M2);
                    return result;
                }).then(funcs.callback).catch(function(err) {
                    debug(err.message);
                });
        },
        play: function() {
            if (UIController.userCanPlay()) {
                var dbg = {
                    M1: "User playing game..",
                    M2: "Received Result: ",
                }
                var funcs = {
                    call: function(instance){
                        user = UIController.getUsername();
                        choice = UIController.getUserChoice();
                        pass = web3.sha3(UIController.getPassword() + choice);
                        console.log("User: " + user + ", Choice: " + choice + ", Pass: " + pass);
                        return instance.play(pass, user, {from: web3.eth.accounts[0],value: web3.toWei(UIController.getAmount(), 'ether')});
                    },
                    callback: function(result){
                          alert("Waiting for other player.");
                          GameController.setMode(GameController.modes().WAITING);
                          // }
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



const VerifierArtifact = require('./build/contracts/Verifier')
const Verifier = contract(VerifierArtifact)
Verifier.setProvider(provider)

function toHex(str) {
	var hex = '';
	for(var i=0;i<str.length;i++) {
		hex += ''+str.charCodeAt(i).toString(16);
	}
	return hex;
}

const addr = web3.eth.accounts[0]
const msg = 'school bus'
const hex_msg = '0x' + toHex(msg)
let signature = web3.eth.sign(addr, hex_msg)

console.log(`address -----> ${addr}`)
console.log(`msg ---------> ${msg}`)
console.log(`hex(msg) ----> ${hex_msg}`)
console.log(`sig ---------> ${signature}`)

signature = signature.substr(2);
const r = '0x' + signature.slice(0, 64)
const s = '0x' + signature.slice(64, 128)
const v = '0x' + signature.slice(128, 130)
const v_decimal = web3.toDecimal(v)

console.log(`r -----------> ${r}`)
console.log(`s -----------> ${s}`)
console.log(`v -----------> ${v}`)
console.log(`vd ----------> ${v_decimal}`)

Verifier
  .deployed()
  .then(instance => {
    const fixed_msg = `\x19Ethereum Signed Message:\n${msg.length}${msg}`
    const fixed_msg_sha = web3.sha3(fixed_msg)
    return instance.recoverAddr.call(
      fixed_msg_sha,
      v_decimal,
      r,
      s
    )
  })
  .then(data => {
    console.log('-----data------')
    console.log(`input addr ==> ${addr}`)
    console.log(`output addr => ${data}`)
  })
  .catch(e => {
    console.log('i got an error')
    console.log(e)
  })
