import React, { useState } from "react";
import { claimAirdrop } from "./solana";

function App() {
  const [wallet, setWallet] = useState(null);
  const [status, setStatus] = useState("");

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const response = await window.solana.connect();
        setWallet(response.publicKey.toString());
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleClaim = async () => {
    setStatus("Processing...");
    const paymentAmount = 1000000; // $1 worth of SOL in lamports (1 SOL = 1e9 lamports)
    const result = await claimAirdrop(wallet, paymentAmount);
    if (result.success) {
      setStatus("Airdrop claimed successfully!");
    } else {
      setStatus("Airdrop claim failed.");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Token Claimer</h1>
        {!wallet ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <>
            <p>Wallet: {wallet}</p>
            <button onClick={handleClaim}>Claim Airdrop</button>
            <p>{status}</p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
