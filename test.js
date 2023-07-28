async function getAddressBalance(publicKey) {
    try {
        const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${publicKey}/balance`);
        const data = await response.json();
        return data.balance / 100000000; // Convert satoshis to BTC
        } catch (error) {
        console.error('Error retrieving address balance:', error);
        return null;
    }
}

const publicKey = '13zb1hQbWVsc2S7ZTZnP2G4undNNpdh5so';
  
getAddressBalance(publicKey)
.then(balance => {
    if (balance !== null) {
        console.log(`Balance of ${publicKey}: ${balance} BTC`);
        return balance
    }
})
.catch(error => {
    console.error('Error:', error);
});