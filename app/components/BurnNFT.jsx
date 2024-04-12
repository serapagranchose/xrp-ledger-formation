import { useBurnToken } from "@nice-xrpl/react-xrpl";
import { useState } from "react";

export default function BurnNFT({ getAllNFTS, client, id, uri, userWallet }) {
  const [burning, setBurning] = useState(false);

  const burnImage = async (hash) => {
    try {
      const res = await fetch(
        `https://api.pinata.cloud/pinning/unpin/${hash}`,
        {
          method: "DELETE",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
        }
      );
      const resData = await res.json();
      return resData;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
    className="bg-black text-white p-4 rounded-lg h-12 m-4"
    onClick={async () => {
      setBurning(true);
      console.log('Burning NFT URI : ', uri);
      const imgBurn = await burnImage(uri);
      console.log('Image Burn : ', imgBurn);
      try {
        const tx = {
          "TransactionType": "NFTokenBurn",
          "NFTokenID": id,
          "Account": userWallet?.classicAddress,
        }
        const submitted_tx = await client.submitAndWait(tx, {
          autofill: true,
          wallet: userWallet,
        })
        console.log('Burn NFT : ', submitted_tx);
      } catch (e) {
        console.log(e);
      } finally {
        setBurning(false);
        getAllNFTS({ address: userWallet?.classicAddress });
      }
    }}
    >
      {burning ? 'Burning...' : 'Burn NFT'}
    </button>
  );
}