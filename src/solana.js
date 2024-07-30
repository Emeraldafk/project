// src/solana.js

import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl("devnet"));

const TOKEN_MINT_ADDRESS = "Ac1cfScF3oFBrwmd9B7DES2WDjNf6XXju3M7wMgVBsw1";
const RECEIVER_WALLET = "Ftf5og5zRCQxUYtCeQ3QoxYnEsYyM4gdEx8sv7fa4iT9";

export const claimAirdrop = async (wallet, paymentAmount) => {
  try {
    const payerPublicKey = new PublicKey(wallet.publicKey);

    // Create transaction to transfer SOL to the receiver wallet
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: payerPublicKey,
        toPubkey: new PublicKey(RECEIVER_WALLET),
        lamports: paymentAmount,
      })
    );

    // Send transaction
    const { signature } = await wallet.signAndSendTransaction(transaction);
    await connection.confirmTransaction(signature);

    // Airdrop token
    const mintPublicKey = new PublicKey(TOKEN_MINT_ADDRESS);
    const token = new Token(connection, mintPublicKey, TOKEN_PROGRAM_ID, wallet);
    const fromTokenAccount = await token.getOrCreateAssociatedAccountInfo(new PublicKey(RECEIVER_WALLET));
    const toTokenAccount = await token.getOrCreateAssociatedAccountInfo(payerPublicKey);

    const transferTransaction = new Transaction().add(
      Token.createTransferInstruction(
        TOKEN_PROGRAM_ID,
        fromTokenAccount.address,
        toTokenAccount.address,
        new PublicKey(RECEIVER_WALLET),
        [],
        10000
      )
    );

    await wallet.signAndSendTransaction(transferTransaction);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error };
  }
};
