import { useEffect, useState } from 'react';
import { useTokens } from '@nice-xrpl/react-xrpl';
import BurnNFT from "./../components/BurnNFT";
import { Client, Wallet, convertHexToString } from 'xrpl';

export default function ShowNFTS({ tokens, getAllNFTS, userSeed }) {
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));
  const userWallet = Wallet.fromSeed(userSeed);
  const brokerWallet = Wallet.fromSeed(process.env.NEXT_PUBLIC_BROKER_SECRET)

  const [creatingSellOffer, setCreatingSellOffer] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [tokenId, setTokenId] = useState('');

  const [buyOffer, setBuyOffer] = useState();
  const [buyOfferCreated, setBuyOfferCreated] = useState(false);

  const [accepting, setAccepting] = useState(false);

  const createUserSellOffer = async () => {
    const tx = {
      "TransactionType": "NFTokenCreateOffer",
      "Account": brokerWallet.classicAddress,
      "Amount": price,
      "NFTokenID": tokenId,
      "Flags": 1,
    }
    const submitted_tx = await client.submitAndWait(tx, {
      autofill: true,
      wallet: brokerWallet,
    })
    console.log('Create Offer : ', submitted_tx);
  }

  const connectClient = async () => {
    client.connect().then(() => {
      console.log('Connected to XRPL');
    });
  }

  const getSource = (uri) => {
    return convertHexToString(uri);
  }

  useEffect(() => {
    connectClient();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold">NFTs ({tokens?.length}) :</h1>
      <div className="flex flex-row space-y-2 bg-gray-100 space-around m-4 flex-wrap center">
        {tokens?.length ?
          tokens.map((token) => (
            <div className="items-center flex flex-col space-y-4 m-4" key={token.NFTokenID}>
              <img
                src={getSource(token.URI).split('|')[1]}
                className="w-64 h-64"
                alt="ipfs image"
              />
              <div className="flex flex-row space-x-4 items-center mr-2 ml-2">
                <div className='flex flex-col'>
                  <h1 className="text-xl font-bold">Name : {getSource(token.URI).split('|')[0]}</h1>
                  <button className='bg-black text-white p-4 rounded-lg' onClick={() => {
                    navigator.clipboard.writeText(token.NFTokenID);
                  }}>
                    Copy ID
                  </button>
                </div>
                <BurnNFT getAllNFTS={getAllNFTS} client={client} userWallet={userWallet} id={token.NFTokenID} uri={getSource(token.URI).split('|')[1]?.substring(getSource(token.URI).split('|')[1].length - 46)} />
                <button
                  className="bg-black text-white p-4 rounded-lg h-12 m-4"
                  onClick={() => {
                    setIsOpen(true);
                    setTokenId(token.NFTokenID)
                  }}
                >
                  Sell NFT
                </button>
              </div>
            </div>
          ))
          : <h1 className="text-2xl font-bold">No NFTs found...</h1>}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h1 className="text-4xl font-bold">Sell NFT</h1>
            <div className="flex flex-col space-y-4">
              <input className="outline-none border-2 border-gray-300 rounded-md" type="text" placeholder="Price (drops)" value={price} onChange={(e) => { setPrice(e.currentTarget.value) }} />
              <button
                className="bg-black text-white p-4 rounded-lg"
                onClick={async () => {
                  setCreatingSellOffer(true);
                  try {
                    const tx = {
                      "TransactionType": "NFTokenCreateOffer",
                      "Account": process.env.NEXT_PUBLIC_BROKER_ADRESS,
                      "Amount": '2',
                      "NFTokenID": tokenId,
                      "Owner": userWallet.classicAddress,
                    }
                    const submitted_tx = await client.submitAndWait(tx, {
                      autofill: true,
                      wallet: brokerWallet,
                    })
                    console.log('Create Offer : ', submitted_tx);
                    setBuyOffer(submitted_tx.result.meta.offer_id);
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setBuyOfferCreated(true);
                    setCreatingSellOffer(false);
                    setIsOpen(false);
                  }
                }}
              >
                {creatingSellOffer ? (<div><span className="inline-block h-3 w-3 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status">
                </span>Creating...</div>) : 'Create Sell Offer'}
              </button>
            </div>
          </div>
          <button className="absolute top-4 right-4" onClick={() => setIsOpen(false)}>X</button>
        </div>
      )}
      {buyOfferCreated && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col bg-white p-8 rounded-lg space-y-4">
            <h1 className="text-4xl font-bold">Accept Buy Offer</h1>
            <button
              className="bg-black text-white p-4 rounded-lg"
              onClick={async () => {
                setAccepting(true);
                console.log('Buy Offer : ', buyOffer)
                try {
                  const tx = {
                    "TransactionType": "NFTokenAcceptOffer",
                    "Account": userWallet.classicAddress,
                    "NFTokenBuyOffer": buyOffer,
                  }
                  const submitted_tx = await client.submitAndWait(tx, {
                    autofill: true,
                    wallet: userWallet,
                  })
                  console.log('Accept Offer : ', submitted_tx);
                } catch (error) {
                  console.log(error);
                } finally {
                  try {
                    await createUserSellOffer();
                  } catch (error) {
                    console.log(error);
                  } finally {
                    setPrice('');
                  }
                  setAccepting(false);
                  setBuyOfferCreated(false);
                  getAllNFTS({ address: userWallet?.classicAddress });
                }
              }}
            >
              {accepting ? (<div><span className="inline-block h-3 w-3 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status">
              </span>Accepting...</div>) : 'Accept the Buy'}
            </button>
            <button
              className="bg-red-500 text-white p-4 rounded-lg"
              onClick={() => setBuyOfferCreated(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}