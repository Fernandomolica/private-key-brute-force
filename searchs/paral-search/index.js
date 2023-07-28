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

const curve = new elliptic.ec('secp256k1')

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


async function findMatchingSHA256(startkey, stopkey, P2PKH, options) {

    if(options){

        let newStartkeyHex = startkey
        let newStopKeyHex = stopkey
        let newJumpSizeKeyHex = 100
        let newChunkSizeHex = 50

        if(options.resumeFrom && BigInt("0x"+options.resumeFrom) >= BigInt("0x"+startkey)){
            newStartkeyHex = options.resumeFrom
        }
        
        if(options.chunkSize){
            newChunkSizeHex = options.chunkSize
        }
        
        if(options.jumpSize){
            newJumpSizeKeyHex = options.jumpSize
        }
    }

    if(options.resumeFrom){
        
        if(BigInt("0x"+options.resumeFrom) >= BigInt("0x"+startkey)){

            const portions = []

            const range = (BigInt(`0x${stopkey}`) - BigInt(`0x${startkey}`))/BigInt('10000')

            let newChunk = BigInt(`0x${startkey}`) + range

            for(let i = BigInt('0') ; i < BigInt("10000") ; i++){
                portions.push(newChunk)
                newChunk = newChunk+range
            }
            
            if(portions.indexOf(BigInt("0x"+options.resumeFrom))>=0){
            
                console.log(portions[portions.indexOf(BigInt("0x"+options.resumeFrom))].toString(16))

                let count = 5
                
                while(true){
                    
                    let startIndex = portions.indexOf(BigInt("0x"+options.resumeFrom))
    
                    for(let index = startIndex ; index < portions.length ; index = index+1){
        
                        let valueStart = BigInt(portions[index]) + BigInt(`${500*count}`)
                        
                        if(portions.indexOf(BigInt(portions[index]))) console.log(`\n\nKey:\t${valueStart.toString(16)}\nP2PKH:\t${getP2PKHcompressed(valueStart.toString(16).padStart(64, '0'))}\nLoop:\t${count}`)

                        for(let l = 0 ; l < 500 ; l++){
                            
                            if(getP2PKHcompressed(valueStart.toString(16).padStart(64, '0')) === P2PKH) {
                    
                                const solution = {
                        
                                    p2pkh: getP2PKHcompressed(valueStart.toString(16).padStart(64, '0')),
                                    privateKey: valueStart.toString().padStart(64, '0')
                                }
                                
                                console.log(solution)
                                
                                fs.writeFile(solutionPath, JSON.stringify(solution), 'utf-8', err=>{
                                    if(err){
                                        throw new Error(JSON.stringify(solution))
                                    } else {
                                                        
                                        console.log("Done! You are milionaire")
                                        console.log(valueStart.toString().padStart(64, '0'))
                                        console.log(getP2PKHcompressed(valueStart.toString().padStart(64, '0')))
    
                                        return solution
                                    }
                                })
    
                            }else{

                                /* const publicKey = getP2PKHcompressed(valueStart.toString(16).padStart(64, '0'))

                                const balance = await getAddressBalance(publicKey).then(balance => {
                                    if (balance !== null) {
                                        return balance
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error)
                                })

                                if (balance>0.0001){
                                    console.log({
                                        key: valueStart.toString(16).padStart(64, '0'),
                                        p2pkh: publicKey,
                                        balance
                                    })
                                } */
                                valueStart = valueStart + BigInt('1')
                            }
                        }
                    }
                    count++
                }
            }

        }
    } else {

        const portions = []

        const range = (BigInt(`0x${stopkey}`) - BigInt(`0x${startkey}`))/BigInt('10000')

        let newChunk = BigInt(`0x${startkey}`) + range

        for(let i = BigInt('0') ; i < BigInt("10000") ; i++){
            portions.push(newChunk)
            newChunk = newChunk+range
        }

        for(let index = 0 ; index < portions.length ; index++){
            
            let valueStart = portions[index]

            for(let l = 0 ; l < 500 ; l++){
                
                if(getP2PKHcompressed(valueStart.toString().padStart(64, '0')) === P2PKH) {
        
                    const solution = {
            
                        p2pkh: getP2PKHcompressed(valueStart.toString().padStart(64, '0')),
                        privateKey: valueStart.toString().padStart(64, '0')
                    }
            
                    fs.writeFile(solutionPath, JSON.stringify(solution), 'utf-8', err=>{
                        if(err){
                            throw new Error(JSON.stringify(solution))
                        } else {
                                            
                            console.log("Done! You are milionaire")
                            console.log(valueStart.toString().padStart(64, '0'))
                            console.log(getP2PKHcompressed(valueStart.toString().padStart(64, '0')))

                            return solution
                        }
                    })

                }else{
                    valueStart = valueStart + BigInt('1')
                }
            }
            console.log(valueStart.toString(16))
        }

    }

}

const options = {
    resumeFrom: '2000d1b71758e2196',
    chunkSize: 50,
    jumpSize: 100,
}


findMatchingSHA256("20000000000000000","3ffffffffffffffff","13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so", options)
