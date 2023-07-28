const bitcoin = require("bitcoinjs-lib")

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

/* 
    Start key = 0000000000000000000000000000000000000000000000020000000000000000
    Stop key = 000000000000000000000000000000000000000000000003ffffffffffffffff
    P2PKH(c) = 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so
*/


function createKeyPair(){
    const keyPair = ec.genKeyPair()
}

function createKeyPair2(pub){
    const private = '0000000000000000000000000000000000000000000000020000000000000000'
    
}

function getRawPublicKey(hexadecimalPub){
    return ec.keyFromPublic(hexadecimalPub, 'hex')
}

function bruteForce(slice){
    console.log(bitcoin.payments.p2pkh({
        pubkey: getRawPublicKey('048d26200250cebdae120ef31b04c80cd50d4cddc8eadbcf29fc696d32c0ade462ebed3bb4715bf437d31f6f2dc3ee36ba1d4afb4e72678b3ad8e0a8b90f26470c'),
        network: bitcoin.networks.bitcoin
    }))
    cosnole.log(bitcoin.payments.p2pkh(Buffer.from('048d26200250cebdae120ef31b04c80cd50d4cddc8eadbcf29fc696d32c0ade462ebed3bb4715bf437d31f6f2dc3ee36ba1d4afb4e72678b3ad8e0a8b90f26470c', 'hex')))
}

function completePrivate(slice){
    if(slice.length > 64){
        throw new Error('hexadecimal longer then 32 bytes')
    }else if(slice.length === 64){
        return slice
    }else if(slice.length < 64){
        const diff = 64 - slice.length
        const entire =  "0".repeat(diff) + slice
        return entire
    }
}

bruteForce('20000000000000000')