const CryptoJS = require('crypto-js')

const bs58 = require('bs58')

const elliptic = require('elliptic')


/* 
    Start key = 0000000000000000000000000000000000000000000000020000000000000000
    Stop key = 000000000000000000000000000000000000000000000003ffffffffffffffff
    P2PKH(c) = 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so
*/


function convertHexToDecimalAndIncrement(hexStringStart) {

    const decimalNumber = parseInt(hexStringStart, 16);
  
    const incrementedNumber = decimalNumber + 1;
  
    const hexResult = incrementedNumber.toString(16);
  
    return hexResult;
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

function getP2PKHcompressed(privateKeyHex){
    
    const privateKey = Buffer.from(privateKeyHex, 'hex')
    
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

function xxBitCrack(startkey, stopkey, P2PKH){
    
    const privateKey = Buffer.from("0000000000000000000000000000000000000000000000003a0000000000006c", 'hex')
    
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
    
    const walletAddress = bs58.encode(Buffer.from(extendedHashWithChecksum, 'hex'))
    
    console.log('P2PKH Compressed Wallet Address:', walletAddress)
        
    const completedStatrtkey = completePrivate(startkey)
    const completedStopkey = completePrivate(stopkey)

}

function sumBigInt(num1, num2){

    if(typeof(num1) === 'number'){

        console.log(num1)

        const numb = num1.toString()

        const first = BigInt(`${num1}`)

        if(typeof(num2) === 'number'){

            const second = BigInt(num2)

            return eval((first + second).toString().replace("n",""))
            
        }else if(typeof(num2) === 'string'){

            if(typeof(eval(num2)) === 'number'){

                const second = BigInt(num2)
                
            }else if(typeof(eval(num2)) === 'bigint'){
                
                const second = eval(num2)
    
            }else {
                throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
            }
        }else {
            throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
        }
        
    }else if(typeof(num1) === 'string'){

        if(typeof(eval(num1)) === 'number'){

            const first = BigInt(num1)
            
            if(typeof(num2) === 'number'){

                const second = BigInt(num2)

                return eval((first + second).toString().replace("n",""))
                
            }else if(typeof(num2) === 'string'){

                if(typeof(eval(num2)) === 'number'){

                    const second = BigInt(num2)

                    return eval((first + second).toString().replace("n",""))
                    
                }else if(typeof(eval(num2)) === 'bigint'){
                    
                    const second = eval(num2)

                    return eval((first + second).toString().replace("n",""))
        
                }else {
                    throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
                }
            }else {
                throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
            }
        }else if(typeof(eval(num1)) === 'bigint'){
            
            const first = eval(num1)
            
            if(typeof(num2) === 'number'){

                const second = BigInt(num2)

                return eval((first + second).toString().replace("n",""))
                
            }else if(typeof(num2) === 'string'){

                if(typeof(eval(num2)) === 'number'){

                    const second = BigInt(num2)

                    return eval((first + second).toString().replace("n",""))
                    
                }else if(typeof(eval(num2)) === 'bigint'){
                    
                    const second = eval(num2)

                    return eval((first + second).toString().replace("n",""))
        
                }else {
                    throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
                }
            }else {
                throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
            }
        }else {
            throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
        }
    }else {
        throw new Error(`This is not a Number type. Try: '12345: Number, "12345": Number<string>, "12345n": : BigInt<string>'`)
    }
}


function findMatchingSHA256(startkey, stopkey, P2PKH, isOptimized=false) {

    let decimalStart = BigInt(`0x${startkey}`)
    let decimalStop = BigInt(`0x${stopkey}`)
    
    if(decimalStart < decimalStop){

        let hexStringStart = startkey
        let hexStringStop = stopkey
        
        if(isOptimized){
            
            const diff = decimalStop - decimalStart

            const partAmount = 10000

            const partSize = (diff) / BigInt(`${partAmount}`)
            
            const loops = 1000
            
            let newHexStringStart = ((diff / BigInt('3')) + decimalStart).toString(16)

            let newHexStringStop = (((diff / BigInt('3')) * BigInt('2')) + decimalStart).toString(16)
            
            console.log(`>>>> ${newHexStringStop}`)

            let cont = 1
            
            // for(let i = partSize * BigInt(`0x${2}`) ; BigInt(`0x${newHexStringStart}`) < BigInt(`0x${newHexStringStop}`) ; i=i+partSize){
            for(let i = partSize * BigInt(`0x${cont}`) ; BigInt(`0x${newHexStringStart}`) < BigInt(`0x${newHexStringStop}`) ; i=i+partSize){

                for(let l = 0 ; l < loops ; l++){

                    if(getP2PKHcompressed(completePrivate(newHexStringStart)) === P2PKH) {

                        console.log("Done! You are milionaire")
                        console.log(completePrivate(newHexStringStart))
                        console.log(getP2PKHcompressed(completePrivate(newHexStringStart)))
    
                        return {
    
                            p2pkh: getP2PKHcompressed(completePrivate(newHexStringStart)),
                            privateKey: newHexStringStart
                        }
                    }else{
                        const decimalNumber = BigInt("0x" + newHexStringStart)
                        const incrementedNumber = decimalNumber + BigInt('1')

                        newHexStringStart = incrementedNumber.toString(16)
                    }
                }

                console.log(decimalStart < decimalStop)
            }
            cont++
        }
    }else{
        throw new Error("Start key must be lower than Stop Key")
    }
}


findMatchingSHA256("2ff0f62af28632f00","3ffffffffffffffff","13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", true)
