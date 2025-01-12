import React, { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS"; // Replace with your deployed contract address
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "recipient",
        "type": "address",
      },
    ],
    "name": "mintNFT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "nonpayable",
    "type": "function",
  },
  {
    "inputs": [],
    "name": "tokenCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isMinting, setIsMinting] = useState(false);

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed!");
        return;
      }
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
      console.log("Connected account:", accounts[0]);
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Mint NFT
  const mintNFT = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first!");
      return;
    }

    try {
      setIsMinting(true);

      // Connect to the contract
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      // Call the mintNFT function
      const tx = await contract.mintNFT(currentAccount);
      console.log("Transaction sent:", tx.hash);

      // Wait for the transaction to be mined
      await tx.wait();
      console.log("NFT minted successfully!");
      alert("NFT minted successfully!");
    } catch (error) {
      console.error("Error minting NFT:", error);
      alert("Failed to mint NFT. Check the console for details.");
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>HackVerse NFT Minting</h1>
      {!currentAccount ? (
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            background: "#6200ea",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Connect Wallet
        </button>
      ) : (
        <div>
          <p>Connected Wallet: {currentAccount}</p>
          <button
            onClick={mintNFT}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              background: isMinting ? "#aaa" : "#6200ea",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
            disabled={isMinting}
          >
            {isMinting ? "Minting..." : "Mint NFT"}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
