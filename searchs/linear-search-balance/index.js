const CryptoJS = require('crypto-js')
const bs58 = require('bs58')
const elliptic = require('elliptic')

const fs = require('fs')
const filePath = `./searchs/linear-search-balance/solution.json`

/* 
    Start key = 0000000000000000000000000000000000000000000000020000000000000000
    Stop key = 000000000000000000000000000000000000000000000003ffffffffffffffff
    P2PKH(c) = 13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so
*/

const curve = new elliptic.ec('secp256k1')

generateKeyAndGetBalance()
async function generateKeyAndGetBalance (){
    while (true) {
    
        const newKeyPair = curve.genKeyPair()
    
        const newPrivateKey = newKeyPair.getPrivate('hex')
        
        const newPublicKey = newKeyPair.getPublic('hex')
    
        const newP2PKH = getP2PKHcompressed(newPrivateKey)
    
        try {
            const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${newP2PKH}/balance`).then(res=>res.json()).then(data=>{

                const balance = data.balance

                
                if(data.balance > 0 && data.balance !== 'undefined'){
                    
                    console.log(`${newPrivateKey} ${newP2PKH} ${balance}`)

                    const balance = data.balance
        
                    const solution = {
                        privateKey: newPrivateKey,
                        wallet: newP2PKH,
                        balance
                    }
        
                    fs.writeFile(filePath , JSON.stringify(solution), 'utf-8', err=>{
                        if(err){
                            console.log(`Solution: ${JSON.stringify(solution)}`)
                            throw new Error(JSON.stringify(solution))
                        } else {
                                            
                            console.log("Done! You are milionaire")
                            console.log(solution)
                            console.log(`\n\tDone! You are milionaire\n${JSON.stringify(solution)}`)
                        }
                    })
                }
            })

            const response2 = await fetch(`https://blockstream.info/api/address/${newP2PKH}`).then(res=>res.json()).then(data=>{

                const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum

                console.log(`${newPrivateKey} ${newP2PKH} ${balance}`)
                
                if(data.balance > 0){
                    
                    console.log(`${newPrivateKey} ${newP2PKH} ${balance}`)

                    const balance = data.balance
        
                    const solution = {
                        privateKey: newPrivateKey,
                        wallet: newP2PKH,
                        balance
                    }
        
                    fs.writeFile(filePath, JSON.stringify(solution), 'utf-8', err=>{
                        if(err){
                            console.log(`Solution: ${JSON.stringify(solution)}`)
                            throw new Error(JSON.stringify(solution))
                        } else {
                                            
                            console.log("Done! You are milionaire")
                            console.log(solution)
                            console.log(`\n\tDone! You are milionaire\n${JSON.stringify(solution)}`)
                        }
                    })
                }
            })

           
        } catch (error) {
            console.log(`Solution: ${newPrivateKey} ${newP2PKH}`)
            console.error('Error retrieving address balance:', error)
        }
    
    }
}


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