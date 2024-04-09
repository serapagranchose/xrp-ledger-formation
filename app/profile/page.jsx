"use client";

import { Account, Wallet, Networks, XRPLClient, useBalance, useTokens, useIsConnected, useBurnToken, useMintToken } from "@nice-xrpl/react-xrpl";
import Footer from "./../components/footer";
import { useState } from "react";

// const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net:51233/" });
const address = "rZTbKwGBRf9vDw7QMpTCoPym4mn2r6Ui3";
const secret = 'sEdTDxhkFNtcKuQsuViju4yNJgCpNBC';
const sequence = '46069813';

function BurnNFT({ id, uri }) {
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

function ShowBalance() {
  const balance = useBalance();

  return (
    <h1 className="text-4xl font-bold">{ balance } XRP</h1>
  );
}

function ShowNFTS() {
  const tokens = useTokens();

  return (
    <>
      <h1 className="text-4xl font-bold">NFTs ({tokens.length}) :</h1>
      <div className="flex flex-row space-y-2 bg-gray-100 space-around m-4 flex-wrap center">
        {tokens.length ?
        tokens.map((token) => (
            <div className="items-center flex flex-col space-y-4 m-4" key={token.id}>
              <img
                src={token.uri.split('|')[1]}
                className="w-64 h-64"
                alt="ipfs image"
              />
              <div className="flex flex-row space-x-4 items-center mr-2 ml-2">
                <h1 className="text-xl font-bold">Name : {token.uri.split('|')[0]}</h1>
                <BurnNFT id={token.id} uri={token.uri.split('|')[1].substring(token.uri.split('|')[1].length - 46)} />
              </div>
            </div>
        ))
        : <h1 className="text-2xl font-bold">No NFTs found...</h1>}
      </div>
    </>
  );
}

function Profile() {
  const [nftName, setNftName] = useState('');
  const [sending, setSending] = useState(false);
  const [cid, setCid] = useState('');
  const [uploadingFile, setUploadingFile] = useState('Upload to IPFS', 'Uploading...', 'Uploaded !');
  const [uploadedFile, setUploadedFile] = useState(false);

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
    <Account address={address}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="space-y-12">
              <div>
                  <h1 className="text-4xl font-bold">Address :</h1>
                  <h1 className="text-4xl font-bold">{ address }</h1>
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
              <ShowNFTS />
          </div>
          <Footer />
      </main>
    </Account>
  );
}

export default function ProfilePage() {
  return (
    <XRPLClient network={Networks.Testnet}>
      <Wallet seed={'sEdSg56gZiT2RjEMj2hrzHidPWy6SQM'}>
        <Profile />
      </Wallet>
    </XRPLClient>
  );
}