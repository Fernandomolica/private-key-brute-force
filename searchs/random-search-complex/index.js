const CryptoJS = require('crypto-js')
const bs58 = require('bs58')
const elliptic = require('elliptic')

const fs = require('fs')
const solutionPath = './solution.json'

console.clear()

/* 
    Start key = 0000000000000000000000000000000000000000000000020000000000000000
    Stop key = 000000000000000000000000000000000000000000000003ffffffffffffffff
    P2PKH(c) = 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so
*/

const curve = new elliptic.ec('secp256k1')
const newKPair = curve.genKeyPair().getPrivate('hex')

// console.log(getP2PKHcompressed('e365b592244c155080066b818ebc52e55c935cbee185e5eed4c02f09852acfca'))


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

    const bigIntStart = BigInt(`0x${startkey}`)

    const bigIntStop = BigInt(`0x${stopkey}`)

    const diff = bigIntStop - bigIntStart
    
    const innerPad = (diff/ BigInt('3') )

    const jumpSize = diff / BigInt('300')

    console.log(`${innerPad/jumpSize}`)

    const searchs = 100

    let newStart = bigIntStart + innerPad

    let count = 0

    const options = {
        bigIntStart: bigIntStart.toString(16),
        bigIntStop: bigIntStop.toString(16),
        innerPad: innerPad.toString(16),
        jumpSize: jumpSize.toString(16),
        newStart: newStart.toString(16),
        searchs: searchs,
        loop: count,
    }

    console.log(options)


    // for (let count = 0; BigInt(`${count}`) < jumpSize; count++) {}
    
    
    while( newStart < bigIntStop ){

        for (let index = searchs * count; index < searchs*(count + 1); index++) {

            if(getP2PKHcompressed(newStart.toString(16).padStart(64, '0')) === P2PKH) {
                    
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

            }
            newStart++
        }

        let oldStart = (newStart - BigInt(`${searchs}`))
        newStart = (bigIntStart + innerPad + (jumpSize * BigInt(`${count + 1}`)))

        if((searchs<1000)){
            
            if(count%100===0){
                
                console.log(`\nLoop: \t\t| ${count}\nFrom: \t\t| 0x${(oldStart).toString(16)}\nTo: \t\t| 0x${(newStart).toString(16)}\nDepth: \t\t| ${searchs * count} - ${searchs*(count + 1)}\nJump Size: \t| 0x${(BigInt(newStart) - BigInt(oldStart)).toString(16)}`)
            }
        }else{
            
            console.log(`\nLoop: \t\t| ${count}\nFrom: \t\t| 0x${(oldStart).toString(16)}\nTo: \t\t| 0x${(newStart).toString(16)}\nDepth: \t\t| ${BigInt(`${searchs}`)}\nJump Size: \t| 0x${(BigInt(newStart) - BigInt(oldStart)).toString(16)}`)
        }


        count++
    }

/* 

    for (let indexDiff = 0; indexDiff < diffDivisor; indexDiff++) {

        let start = bigIntStart


        for (let indexPiece = 0; indexPiece < pieceDivisor; indexPiece++) {

            start = bigIntStart + ( bigIntPiece * BigInt( `${ indexPiece+1 }` ) )
            
            arrPieceChunk[arrDiffChunk[indexPiece]] = start
        }
            
        console.log(start.toString(16))

        arrDiffChunk.push(arrPieceChunk)
        
    } */
}

function testP2PKH(privateKey, compressedP2PKH){
    console.log(`\n\t====  T E S T  ====`)
    console.log({
        p2pkh:getP2PKHcompressed(privateKey.padStart(64, '0')),
        privateKey: privateKey.padStart(64, '0'),
        works: getP2PKHcompressed(privateKey.padStart(64, '0')) === compressedP2PKH
    })
    console.log(`\n\t===================\n\n`)

    return getP2PKHcompressed(privateKey.padStart(64, '0')) === compressedP2PKH
}

//testP2PKH('349b84b6431a6c4ef1', '19YZECXj3SxEZMoUeJ1yiPsw8xANe7M7QR')

findMatchingSHA256("20000000000000000","3ffffffffffffffff","13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so")
