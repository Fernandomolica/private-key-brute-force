const CryptoJS = require('crypto-js')
const bs58 = require('bs58')
const elliptic = require('elliptic')

const fs = require('fs')
const solutionPath = './solution.json'

/* 
    Start key = 0000000000000000000000000000000000000000000000020000000000000000
    Stop key = 000000000000000000000000000000000000000000000003ffffffffffffffff
    P2PKH(c) = 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so
*/


function getP2PKHcompressed(privateKeyHex){
    
    const privateKey = Buffer.from(privateKeyHex.padStart(64, '0'), 'hex')
    
    const curve = new elliptic.ec('secp256k1')
    
    const keyPair = curve.keyFromPrivate(privateKey)
    
    const publicKey = keyPair.getPublic(true, 'hex')
    
    const sha256Hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(publicKey))
    
    const ripemd160Hash = CryptoJS.RIPEMD160(CryptoJS.enc.Hex.parse(sha256Hash.toString()))
    
    const versionByte = '00'
    
    const extendedHash = versionByte + ripemd160Hash.toString()
    
    const doubleSha256Hash = CryptoJS.SHA256(CryptoJS.enc.Hex.parse(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(extendedHash)).toString())).toString()
    
    const checksum = doubleSha256Hash.slice(0, 8)
    
    const extendedHashWithChecksum = extendedHash + checksum
    
    return bs58.encode(Buffer.from(extendedHashWithChecksum, 'hex'))
}


function findMatchingSHA256(startkey, stopkey, P2PKH) {

    const byteLength = startkey.length%2===0?startkey.length/2: (startkey.length+1)/2

    const decimalMin = 128
    const decimalMax = 192 - 1

    console.log(startkey.length)
    console.log(byteLength)

    console.log(`\tStart Key: ${startkey.padStart(64, '0')}\n\tStop Key: ${stopkey.padStart(64, '0')}\n\tP2PKH(c): ${P2PKH}`)
    console.log(`From "0x02${startkey.length%2===0?BigInt(`${decimalMin}`).toString(16).padStart(2, '0').repeat((startkey.length-2)/2):BigInt(`${decimalMin}`).toString(16).padStart(2, '0').repeat((startkey.length-1)/2)}" to "0x02${startkey.length%2===0?BigInt(`${decimalMax}`).toString(16).padStart(2, '0').repeat((startkey.length-2)/2):BigInt(`${decimalMax}`).toString(16).padStart(2, '0').repeat((startkey.length-1)/2)}"`)
    

    if(getP2PKHcompressed(startkey.padStart(64, '0')) === P2PKH) {

        const solution = {

            p2pkh: getP2PKHcompressed(newHexStringStart.padStart(64, '0')),
            privateKey: newHexStringStart
        }

        fs.writeFile(solutionPath, JSON.stringify(solution), 'utf-8', err=>{
            if(err){
                throw new Error(err.message)
            } else {
                                
                console.log("Done! You are milionaire")
                console.log(newByteString.padStart(64, '0'))
                console.log(getP2PKHcompressed(newByteString.padStart(64, '0')))
            }
        })

        return solution
    }else{

        while(true){

            let newByteString = ''
            
            for(let i = 0 ; i < byteLength ; i++){
    
                if(i===0){

                    newByteString = '02'
                }else{
    
                    const byte = Math.floor(Math.random()*(decimalMax))+decimalMax
                    newByteString = newByteString+byte.toString(16).padStart(2, '0')
                }
            }
    
            if(getP2PKHcompressed(newByteString.padStart(64, '0')) === P2PKH) {
    
                const solution = {
    
                    p2pkh: getP2PKHcompressed(newByteString.padStart(64, '0')),
                    privateKey: newByteString.padStart(64, '0')
                }

                console.log(solution)

                fs.writeFile(solutionPath, JSON.stringify(solution), 'utf-8', err=>{
                    if(err){
                        throw new Error(err.message)
                    } else {
                                        
                        console.log("Done! You are milionaire")
                        console.log(newByteString.padStart(64, '0'))
                        console.log(getP2PKHcompressed(newByteString.padStart(64, '0')))
                    }
                })

                return solution
            }
        }
    }
}

function testP2PKH(privateKey, compressedP2PKH){
    console.log(getP2PKHcompressed(privateKey.padStart(64, '0')))
    return getP2PKHcompressed(privateKey.padStart(64, '0')) === compressedP2PKH
}

console.log(testP2PKH('349b84b6431a6c4ef1', '19YZECXj3SxEZMoUeJ1yiPsw8xANe7M7QR'))

findMatchingSHA256("20000000000000000","3ffffffffffffffff","13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so")
