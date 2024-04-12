import { useBurnToken } from "@nice-xrpl/react-xrpl";
import { useState } from "react";

export default function BurnNFT({ id, uri }) {
  const burnToken = useBurnToken();
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
      const imgBurn = await burnImage(uri);
      console.log('Image Burn : ', imgBurn);
      const result = await burnToken(id);
      console.log('Token Burn : ', result);
      setBurning(false);
    }}
    >
      {burning ? 'Burning...' : 'Burn NFT'}
    </button>
  );
}