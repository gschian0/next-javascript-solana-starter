import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Head from "next/head";
import { useProgram, useMintNFT, useWallet } from "@thirdweb-dev/react/solana";
import {Minter} from "./components/mint";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);
const Home = () => {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: e.target.prompt.value,
      }),
    });
    let prediction = await response.json();
    if (response.status !== 201) {
      setError(prediction.detail);
      return;
    }
    setPrediction(prediction);

    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed"
    ) {
      await sleep(1000);
      const response = await fetch("/api/predictions/" + prediction.id);
      prediction = await response.json();
      if (response.status !== 200) {
        setError(prediction.detail);
        return;
      }
      console.log({prediction})
      setPrediction(prediction);
    }
  };
  
  // Here's how to get the thirdweb SDK instance
  // const sdk = useSDK();
  // Here's how to get a nft collection
  // const { data: program } = useProgram(
  //   your_nft_collection_address,
  //   "nft-collection"
  // );

  return (
    <div className={styles.center}>
      <div className={styles.container}>
        <div className={styles.iconContainer}>
          <Image   
            src="/The_Sri_Yantra_in_diagrammatic_form.svg"
            height={75}
            width={150}
            style={{
              objectFit: "contain",
            }}
            alt="thirdweb"
          />
          <Image
            width={75}
            height={75}
            src="/sol.png"
            className={styles.icon}
            alt="sol"
          />
        </div>
        <h1 className={styles.h1}>AI on the BLOCKCHAIN</h1>
        <h1 className={styles.h2}>Hanging Out</h1>
        <p className={styles.explain}>
          Connect your Phantom Wallet to</p><code> generate and mint </code><p className={styles.explain}>AI&rsquo;s on {" "}
          <b>
            <a
              href="https://portal.thirdweb.com/solana"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.lightPurple}
            >
              Solana SDK
            </a>
          </b>
          .
        </p>

        <WalletMultiButtonDynamic />
        <p>
        Dream something with{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">stability-ai/stable-diffusion</a>:
      </p>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
        <button type="submit">Generate NFT Image!</button>
        <br></br>
        <code>only .25 SOL</code>
      </form>
      {error && <div>{error}</div>}     
      {prediction && (
        <div>
            {prediction.output && (
              <div className={styles.imageWrapper}>
              <Image
                    
                    src={prediction.output[prediction.output.length - 1]}
                    alt="output"
                    sizes="100%"
                    width="640"
                    height="640"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxWidth: '75vw', maxHeight: '75vw' }}
                  />
                   <Minter image={prediction.output[prediction.output.length - 1]} />
              </div>
              
            )}  
            <p>status: {prediction.status}</p>
           
        </div>
      )}
    </div>
    </div>
  );
}
export default Home;
