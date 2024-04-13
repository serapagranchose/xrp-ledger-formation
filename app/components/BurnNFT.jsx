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
      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full"
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
      {burning ? (<div><span className="inline-block h-4 w-4 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
        role="status" />'Burning...'</div>) : 'Burn NFT'}
    </button>
  );
}