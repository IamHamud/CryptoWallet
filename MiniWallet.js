// Load environment variables from a .env file
require('dotenv').config();

// Import the Web3 library
const { Web3 } = require('web3');

// Retrieve the API key and network from environment variables
const apiKey = process.env['apiKey'];
const network = 'goerli';

// Set up the Ethereum node URL with the API key and network
const node = `https://eth.getblock.io/${apiKey}/${network}/`;

// Initialize web3 instance with the node URL
const web3 = new Web3(node);

// Create a new random Ethereum account (similar to creating an account on MetaMask manually)
const accountTo = web3.eth.accounts.create();

// Retrieve the private key from environment variables and get the corresponding Ethereum account
const privatekey = process.env.privatekey; 
const accountFrom = web3.eth.accounts.privateKeyToAccount(privatekey);

// Log the 'from' account details
console.log(accountFrom);

// Create and sign an Ethereum transaction using the 'from' account
const createSignedTx = async (rawTx) => {
    // Estimate the gas required for the transaction
    rawTx.gas = await web3.eth.estimateGas(rawTx);
    
    // Sign the transaction using the 'from' account
    return await accountFrom.signTransaction(rawTx);
}

// Send the signed Ethereum transaction to the network
const sendSignedTx = async (signedTx) => {
    web3.eth.sendSignedTransaction(signedTx.rawTransaction).then(console.log);
}

// Fetch the current nonce for the 'from' account
const getNonce = async () => {
    return await web3.eth.getTransactionCount(accountFrom.address, 'pending');
};

(async () => {
    // Specify the amount to transfer in Ether
    const amountTo = "0.001"; //ether

    // Define the raw transaction details, including the sender, recipient, amount, and nonce
    const rawTx = {
        from: accountFrom.address,
        nonce: await getNonce(),
        to: accountTo.address,
        value: web3.utils.toWei(amountTo, "ether")
    }

    // Create the signed transaction and then send it
    createSignedTx(rawTx).then(sendSignedTx);
})();

//console.log(accountTo);
// this simply fetches the transfer on the acc , so this is the account that we will send some ether
//console.log(accountTo.address)

//now we will create new account from which we will send eth from, this is the one with private key provided
//const accountFrom = process.env['privatekey'];
//console.log(web3)
