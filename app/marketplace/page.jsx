"use client";

import Footer from "../components/footer";
import { XRPLClient, Networks, Account, useTokens, useIsConnected, useGetSellOffers } from "@nice-xrpl/react-xrpl";
import { LoadWallet } from "../components/LoadWallet";
import { useEffect, useState } from "react";
import { Client, Wallet
 } from "xrpl";

function NFTInfos ({ token, updateShow, updateOfferIndex, show }) {
  const [sellOffers, setSellOffers] = useState([]);
  const getSellOffers = useGetSellOffers();
  const [loadingOffers, setLoadingOffers] = useState(false);

  const changeOfferIndex = (req) => {
    updateOfferIndex(req);
  }

  const changeShow = (req) => {
    updateShow(req);
  }
 
  return (
    <>
      <button
      className="bg-black text-white p-4 rounded-lg h-12 m-4"
      onClick={async () => {
        setLoadingOffers(true);
        try {
          console.log(token.token)
          const offers = await getSellOffers(token.id);
          setSellOffers(offers);
        } catch (error) {
          console.log(error);
        } finally {
          setLoadingOffers(false);
        }
      }}
      >
        {loadingOffers ? 'Loading...' : 'See offers'}
      </button>
      {sellOffers.length ? (
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Offers :</h1>
          <div className="flex flex-col space-y-4">
            {sellOffers.map((offer) => (
              console.log(offer),
              <div className="flex flex-row space-x-4 items-center mr-2 ml-2" key={offer.index}>
                <h1 className="text-xl font-bold">Price : {offer.amount / 1000000} XRP</h1>
                <button
                className="bg-black text-white p-4 rounded-lg h-12 m-4"
                onClick={async () => {
                  changeShow(true);
                  changeOfferIndex(offer.index);
                }}
                >
                  Accept offer
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}

function ShowSome() {
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233"));
  const tokens = useTokens();
  // const isConnected = useIsConnected();
  const [show, setShow] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [offerIndex, setOfferIndex] = useState('');
  const [userSeed, setUserSeed] = useState('');

  const updateShow = (req) => {
    setShow(req);
  }

  const updateOfferIndex = (req) => {
    setOfferIndex(req);
  }

  useEffect(() => {
    client.connect().then(() => {
      console.log('Connected to XRPL');
      console.log(process.env.NEXT_PUBLIC_BROKER_ADRESS);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">NFTs to sale ({tokens.length}) :</h1>
        <div className="flex flex-row space-y-2 space-around m-4 flex-wrap center max-w-screen-xl">
          {tokens.length ?
          tokens.map((token) => (
            <div className="items-center flex flex-col space-y-4 m-4" key={token.id}>
              <img
                src={token.uri?.split('|')[1]}
                className="w-64 h-64"
                alt="ipfs image"
              />
              <div className="flex flex-col">
                <div className="flex flex-row space-x-4 items-center mr-2 ml-2">
                  <div className="flex flex-col">
                    <h1 className="text-xl font-bold">Name : {token.uri?.split('|')[0]}</h1>
                  </div>
                </div>
                <NFTInfos token={token} key={token.id} updateShow={updateShow} show={show} updateOfferIndex={updateOfferIndex} />
              </div>
            </div>
          ))
          : <h1 className="text-2xl font-bold">No NFTs found...</h1>}
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col bg-white p-8 rounded-lg space-y-4">
            <h1 className="text-4xl font-bold">Accept Sell Offer</h1>
            <input type="text" placeholder="Seed" value={userSeed} className="w-64" onChange={(e) => setUserSeed(e.target.value)} />
            <button
            className="bg-black text-white p-4 rounded-lg"
            disabled={userSeed === ''}
            onClick={async () => {
              setAccepting(true);
              console.log('Offer Index : ', offerIndex);
              const userWallet = Wallet.fromSeed(userSeed);
              try {
                const tx = {
                  "TransactionType": "NFTokenAcceptOffer",
                  "Account": userWallet.classicAddress,
                  "NFTokenSellOffer": offerIndex,
                }
                const submitted_tx = await client.submitAndWait(tx, {
                  autofill: true,
                  wallet: userWallet,
                })
                console.log('Accept Offer : ', submitted_tx);
              } catch (error) {
                console.log(error);
              } finally {
                setAccepting(false);
                setShow(false);
                setUserSeed('');
              }
            }}
            >
              {accepting ? 'Buying...' : 'Buy The NFT !!!!'}
            </button>
            <button
            className="bg-black text-white p-4 rounded-lg"
            onClick={() => {
              setUserSeed('');
              setShow(false);
            }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );

}

export default function MarketPlace() {

  return (
    <XRPLClient network={Networks.Testnet}>
      <LoadWallet seed={process.env.NEXT_PUBLIC_BROKER_SECRET}>
        <Account>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="items-center justify-between font-mono text-sm lg:flex">
              <ShowSome />
            </div>
            <Footer />
          </main>
        </Account>
      </LoadWallet>
    </XRPLClient>
  );
}
