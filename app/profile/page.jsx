"use client";

import Footer from "./../components/footer";
import { useState, useEffect } from "react";
import ShowNFTS from "./../components/ShowNFTS";
import { Client, Wallet, convertStringToHex } from "xrpl";

function Profile({ seed }) {
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 5000 }));
  let userWallet;
  const [nftName, setNftName] = useState('');
  const [sending, setSending] = useState(false);
  const [cid, setCid] = useState('');
  const [uploadingFile, setUploadingFile] = useState('Upload to IPFS', 'Uploading...', 'Uploaded !');
  const [uploadedFile, setUploadedFile] = useState(false);
  const [tokens, setTokens] = useState();
  const [publicAdress, setPublicAdress] = useState();
  const [balance, setBalance] = useState();
  const [isModalOpen, setModalOpen] = useState();

  const [selectedFile, setSelectedFile] = useState();
  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const getAllNFTS = async ({ address }) => {
    const req = await client.request({
      "command": "account_nfts",
      "account": address,
    });
    console.log('res : ', req.result.account_nfts[0]);
    setTokens(req.result.account_nfts);
  }

  const setInfos = async () => {
    const res = await client.getXrpBalance(userWallet?.classicAddress);
    setBalance(res);
    setPublicAdress(userWallet.classicAddress);
    getAllNFTS({ address: userWallet.classicAddress });
  }

  const connectClient = async () => {
    client.connect().then(() => {
      console.log('Connected to XRPL');
      userWallet = Wallet.fromSeed(seed);
      setInfos();
    });
  }

  const getSource = (uri) => {
    return convertHexToString(uri);
  }

  useEffect(() => {
    connectClient();
  }, []);

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
    <main className="flex flex-col items-center justify-between">

      <div className="relative bg-white p-6 rounded-xl shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex flex-col items-center p-10">

            <h1 className="text-4xl font-bold">Profile</h1>
            <div className="my-5 space-y-4">
              <div>
                <h1 className="text-xl font-bold">Address :</h1>
                <h1 className="text-xl">{publicAdress}</h1>
              </div>
              <div>
                <h1 className="text-xl font-bold">Balance :</h1>
                <h1 className="text-xl">{balance}</h1>
              </div>
            </div>

            <button
              className="bg-black text-white p-4 rounded-lg"
              onClick={() => {
                setModalOpen(true);
              }}>
              Create your NFT
            </button>

            {isModalOpen ? (

              <div className="flex items-center justify-center fixed inset-0 bg-gray-800 bg-opacity-20">
                <div className="flex flex-col bg-white p-8 rounded-lg space-y-4">
                  <div className="flex flex-col space-y-8">
                    <label className="flex flex-col text-4xl font-bold items-center">Choose file</label>
                    <input title="Choose your file" className="w-30 h-8 bg-gray-200 rounded-lg file:border-0 hover:file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:text-white file:bg-black" type="file" disabled={uploadedFile} onChange={changeHandler} />
                    <button onClick={submitIPFS} disabled={uploadedFile} className="bg-black text-white p-4 rounded-lg">
                      {uploadingFile === 'Uploading...' ? (<div><span className="inline-block h-3 w-3 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                      </span>{uploadingFile}</div>) : uploadingFile}
                    </button>
                    {uploadedFile && (
                      <img
                        src={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`}
                        className="w-64 h-64"
                        alt="ipfs image"
                      />
                    )}
                    <input className="outline-none border-2 border-gray-300 rounded-md" type='text' placeholder='NFT Name' value={nftName} onChange={(e) => setNftName(e.target.value)} />
                    {sending ? (<button className="bg-black text-white p-4 rounded-lg">
                      <span className="inline-block h-3 w-3 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                        role="status">
                      </span>Creating NFT...
                    </button>)
                      : (
                        cid && nftName ? (
                          <button
                            className="bg-black text-white p-4 rounded-lg"
                            onClick={async () => {
                              setSending(true);
                              const minterWallet = Wallet.fromSeed(seed);
                              const tx = {
                                "TransactionType": "NFTokenMint",
                                "Account": minterWallet?.classicAddress,
                                "Flags": 8,
                                "URI": convertStringToHex(`${nftName}|${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${cid}`),
                                "NFTokenTaxon": 0,
                              }
                              console.log('minter : ', minterWallet);
                              const submitted_tx = await client.submitAndWait(tx, {
                                autofill: true,
                                wallet: minterWallet,
                              })
                              console.log('Create Offer : ', submitted_tx);
                              setSending(false);
                              getAllNFTS({ address: minterWallet?.classicAddress });
                              setNftName('');
                              setModalOpen(false);
                              setUploadedFile(false);
                              setUploadingFile('Upload to IPFS');
                              setSelectedFile();
                              setCid('');
                            }}
                          >Create NFT</button>
                        ) :
                          (<button className="bg-black text-white p-4 rounded-lg opacity-50" disabled>Upload a file then enter a name...</button>)
                      )}
                    <button
                      className="bg-red-500 text-white p-4 rounded-lg"
                      onClick={() => {
                        setModalOpen(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : null}

            <ShowNFTS tokens={tokens} getAllNFTS={getAllNFTS} userSeed={seed} />

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ProfilePage() {
  const [userInput, setUserInput] = useState('');
  const [seed, setSeed] = useState('');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-14">
      {seed ? (
        <Profile seed={seed} />
      ) : (
        <div className="fixed flex items-center justify-center">
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative bg-white p-6 rounded-xl shadow-xl">

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="flex flex-col items-center p-10">
                  <h1 className="text-2xl font-semibold mb-4">Connect your wallet</h1>
                  <input type="text" placeholder="Your Seed" value={userInput} onChange={(e) => setUserInput(e.target.value)} className="mt-1 mb-6 p-2 block w-full border border-gray-300 rounded-md shadow-sm outline-none" />
                  <button onClick={() => setSeed(userInput)} className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600">Load Wallet</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}