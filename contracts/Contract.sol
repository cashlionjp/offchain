pragma solidity ^0.4.18;

contract Contract {
    function Contract() public {
    }
    /* function recoverAddr(bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (address) {
        return ecrecover(msgHash, v, r, s);
    }

    function isSigned(address _addr, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public pure returns (bool) {
        return ecrecover(msgHash, v, r, s) == _addr;
    }

    function verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s) public pure returns(address) {
        bytes memory prefix = "\x19Ethereum Signed Message:\n32";
        bytes32 prefixedHash = keccak256(prefix, hash);
        return ecrecover(prefixedHash, v, r, s);
    } */

    function doHash(string message, uint32 num) public pure returns (bytes32) {
        return keccak256(
            keccak256('string Message', 'uint32 A number'),
            keccak256(message, num));
    }

	function checkSignature(string message, uint32 num,  bytes32 r, bytes32 s, uint8 v) public pure returns (address) {
	  var hash = doHash(message, num);
    return ecrecover(hash, v, r, s);
	}
}
