"use client";

import { Account, Wallet, Networks, XRPLClient, useBalance, useTokens, useCreateSellOffer, useBurnToken, useMintToken, useWalletAddress } from "@nice-xrpl/react-xrpl";
import Footer from "./../components/footer";
import { useState } from "react";
import ShowBalance from "./../components/ShowBalance";
import ShowNFTS from "./../components/ShowNFTS";

// const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net:51233/" });
const address = "rZTbKwGBRf9vDw7QMpTCoPym4mn2r6Ui3";
const secret = 'sEdTDxhkFNtcKuQsuViju4yNJgCpNBC';
const sequence = '46069813';

function Profile({ seed }) {
  const [nftName, setNftName] = useState('');
  const [sending, setSending] = useState(false);
  const [cid, setCid] = useState('');
  const [uploadingFile, setUploadingFile] = useState('Upload to IPFS', 'Uploading...', 'Uploaded !');
  const [uploadedFile, setUploadedFile] = useState(false);
  const userAddress = useWalletAddress();

  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const mintToken = useMintToken();

  const submitIPFS = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const metadata = JSON.stringify({
        name: "File name",
      });
      formData.append("pinataMetadata", metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append("pinataOptions", options);

      setUploadingFile('Uploading...');
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
          },
          body: formData,
        }
      );
      const resData = await res.json();
      setCid(resData.IpfsHash);
      console.log(resData);
      setUploadingFile('Uploaded !');
      setUploadedFile(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Account>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="space-y-12">
              <div>
                  <h1 className="text-4xl font-bold">Address :</h1>
                  <h1 className="text-4xl font-bold">{ userAddress }</h1>
              </div>
              <div>
                  <h1 className="text-4xl font-bold">Balance :</h1>
                  <ShowBalance />
              </div>
          </div>
          <div className="flex flex-col space-y-8">
              <label className="text-4xl font-bold">Choose file</label>
              <div className="flex flex-row space-y-4">
                <input type="file" disabled={uploadedFile} onChange={changeHandler} />
                <button onClick={submitIPFS} disabled={uploadedFile} className="bg-black text-white p-4 rounded-lg">
                  {uploadingFile}
                </button>
              </div>
              {uploadedFile && (
                <img
                  src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                  className="w-64 h-64"
                  alt="ipfs image"
                />
              )}
              <input type='text' placeholder='NFT Name' value={nftName} onChange={(e) => setNftName(e.target.value)} />
              {sending ? (<button className="bg-black text-white p-4 rounded-lg">Creating NFT...</button>)
              : (
              cid && nftName ? (
                <button
                className="bg-black text-white p-4 rounded-lg"
                onClick={async () => {
                  setSending(true);
                  const result = await mintToken(`${nftName}|${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`);
                  console.log('UI : ', result);
                  setSending(false);
                  setNftName('');
                  setUploadedFile(false);
                  setUploadingFile('Upload to IPFS');
                  setSelectedFile();
                  setCid('');
                }}
                >Create NFT</button>
              ) :
              (<button className="bg-black text-white p-4 rounded-lg opacity-50" disabled>Upload a file then enter a name...</button>)
              )}
              <ShowNFTS userSeed={seed} />
          </div>
          <Footer />
      </main>
    </Account>
  );
}

export default function ProfilePage() {
  const [userInput, setUserInput] = useState('');
  const [seed, setSeed] = useState('');
 
  return (
    <XRPLClient network={Networks.Testnet}>
      {seed ? (
        <Wallet seed={seed}>
          <Profile seed={seed} />
        </Wallet>
      ) : (
        <div className="flex min-h-screen flex-col items-center p-24">
          <input type="text" placeholder="Your Seed" value={userInput} onChange={(e) => setUserInput(e.target.value)} />
          <button onClick={() => setSeed(userInput)}>Load Wallet</button>
        </div>
      )}
    </XRPLClient>
  );
}