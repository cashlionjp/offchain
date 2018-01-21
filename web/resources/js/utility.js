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
})()
