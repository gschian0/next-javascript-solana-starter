import dynamic from "next/dynamic";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Head from "next/head";
import { useProgram, useMintNFT, useWallet } from "@thirdweb-dev/react/solana";
import Footer from "./components/footer";
import {web3, connection} from "@solana/web3.js";

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
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setProcessing(true);
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
    setProcessing(false);
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
      setProcessing(false);
      return;
    }
    console.log({prediction})
    setPrediction(prediction);
  }
  setProcessing(false);
};
  
  // Here's how to get the thirdweb SDK instance
  // const sdk = useSDK();
  // Here's how to get a nft collection
  // const { data: program } = useProgram(
  //   your_nft_collection_address,
  //   "nft-collection"
  // );

  return (
    <div className={styles.container}>
    <div  className="bg-indigo-500 text-center rounded-md max-w-screen-2xl min-w-75vh">
    <br></br>
    
    <WalletMultiButtonDynamic />
    <br></br>
    <br></br>
    <p >
          connect your phantom wallet</p>
    <h1 className={styles.h1}>AI <p class="inline-block">
  <span class="text-red-500">a</span>
  <span class="text-green-500">r</span>
  <span class="text-yellow-500">t</span>
</p> on da block!</h1>
    {/* <h1 className={styles.h1}> on the BLOCKCHAIN</h1> */}
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
          className={`max-w-full h-auto mx-auto ${
            processing ? "spin" : ""
          }`}
          style={{ maxWidth: "75vw", maxHeight: "75vw" }}
        />
        <br></br>
        <br></br>
        {/* MINT FUNCTION GOES HERE */}
      </div>
    )}
    <p>status: {prediction.status}</p>
  </div>
)}
        <div className={styles.iconContainer}>
        
          {/* <Image   
            src="/The_Sri_Yantra_in_diagrammatic_form.svg"
            height={222}
            width={222}
            style={{
              objectFit: "contain",
            }}
            alt="thirdweb"
          /> */}
          <Image
            width={75}
            height={75}
            src="/sol.png"
            className={styles.icon}
            alt="sol"
          />
        </div>
        
        <code> generate and mint </code><p className={styles.explain}>AI artworks on {" "}
          <b>
          <a href="https://solana.com/" target="_blank" rel="noopener noreferrer" className={styles.lightPurple}>Solana</a>
          </b>
          .
        </p>

       
        {/* <p>
        Lets get to it{" "}
        <a href="https://replicate.com/stability-ai/stable-diffusion">Make $$ Make ART</a>:
      </p> */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <input type="text" name="prompt" placeholder="Enter a prompt to display an image" />
        <button className="min-w-min" type="submit"><code>generate nft image</code></button>
        <br></br>
        <code>only .25 SOL</code>
      </form>
     
      </div>
      <br></br>
    
    
    <Footer></Footer>
    
      </div>
  );
}
export default Home;
