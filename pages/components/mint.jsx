import { useProgram, useMintNFT } from "@thirdweb-dev/react/solana";
import { useWallet } from "@solana/wallet-adapter-react";

export function Minter({ image, nftName, nftSymbol }) {
  const { wallet } = useWallet();
  const { program } = useProgram("6xTpesyYWUT5Xt9m4nw5AXncQLmnT2WXb2pcyrDDNaEg");
  const { mutateAsync: mintNFT, isLoading, error } = useMintNFT(program);

  const handleClick = async () => {
    if (wallet.connected) {
      try {
        const metadata = {
          name: nftName,
          symbol: nftSymbol,
          uri: image,
        };
        const mint = await mintNFT({
          metadata,
          mintTo: wallet.publicKey.toBase58(),
        });
        console.log("NFT minted", mint);
      } catch (e) {
        console.error("NFT minting failed", e);
      }
    } else {
      console.error("Wallet not connected");
    }
  };

  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? "Minting..." : "Mint NFT"}
    </button>
  );
}