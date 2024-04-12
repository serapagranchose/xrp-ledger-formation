"use client";

import Footer from "../components/footer";
import { useEffect, useState } from "react";
import { Client, Wallet, convertHexToString } from "xrpl";
import { useRouter } from "next/navigation";
import axios from "axios";

function NFTInfos({ setOfferAmount, setSelectedNFT, token, updateShow, updateOfferIndex, client, show }) {
  const [sellOffers, setSellOffers] = useState([]);
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
            console.log(token.NFTokenID)
            const offers = await client.request({
              "command": "nft_sell_offers",
              "nft_id": token.NFTokenID,
            })
            console.log('Offers : ', offers);
            setSellOffers(offers.result.offers);
          } catch (error) {
            console.log(error);
          } finally {
            setLoadingOffers(false);
          }
        }}
      >
        {loadingOffers ? (
          <div>
            <span className="inline-block h-4 w-4 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
              role="status">
            </span>
            Loading...
          </div>)
          : 'See offers'}
      </button>
      {sellOffers.length ?
        (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-10 rounded-lg shadow-xl">

              <div className="flex flex-col">
                <h1 className="text-3xl font-bold text-center mb-3">Offers</h1>
                <div className="flex flex-col space-y-4">
                  {sellOffers.map((offer) => (
                    console.log(offer),
                    <div key={offer.nft_offer_index}>
                      <h1 className="text-xl font-bold">Name <span className='pl-3'>:</span> {convertHexToString(token.URI).split('|')[0]}</h1>
                      <h1 className="text-xl font-bold">Price : {offer.amount / 1000000} XRP</h1>
                      <div className="flex justify-center items-center mt-7 space-x-4">
                        <button onClick={() => { setLoadingOffers(false); setSellOffers(false) }} className="bg-red-500 text-white px-4 py-2 rounded-md">Decline</button>
                        <button
                          className="bg-black text-white rounded-md px-4 py-2 "
                          onClick={async () => {
                            console.log('ttttt ', token.NFTokenID)
                            setSelectedNFT(token.NFTokenID);
                            changeShow(true);
                            changeOfferIndex(offer.nft_offer_index);
                            setOfferAmount(offer.amount);
                            setLoadingOffers(false);
                            setSellOffers(false)
                          }}
                        >
                          Accept offer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>


            </div>
          </div>) : null}
    </>
  )
}

function ShowSome() {
  const [client] = useState(new Client("wss://s.altnet.rippletest.net:51233", { connectionTimeout: 5000 }));
  let brokerWallet;
  const [show, setShow] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [offerIndex, setOfferIndex] = useState('');
  const [offerAmount, setOfferAmount] = useState("");
  const [userSeed, setUserSeed] = useState('');
  const [ttokens, setTokens] = useState();
  const router = useRouter();
  const [selectedNFT, setSelectedNFT] = useState("");
  const [seller, setSeller] = useState("");

  const updateShow = (req) => {
    setShow(req);
  }

  const updateOfferIndex = (req) => {
    setOfferIndex(req);
  }

  const getAllNFTS = async () => {
    const req = await client.request({
      "command": "account_nfts",
      "account": brokerWallet.classicAddress,                     // changer adresse
    });
    console.log('res : ', req.result.account_nfts[0]);
    setTokens(req.result.account_nfts);
  }

  const connectClient = async () => {
    client.connect().then(() => {
      console.log('Connected to XRPL');
      console.log(process.env.NEXT_PUBLIC_BROKER_ADRESS);
      brokerWallet = Wallet.fromSeed(process.env.NEXT_PUBLIC_BROKER_SECRET);
      getAllNFTS();
    });
  }

  const sendPaiement = async (seller) => {
    const brokaWallet = Wallet.fromSeed(process.env.NEXT_PUBLIC_BROKER_SECRET);
    setOfferAmount(offerAmount / 1000000);
    console.log('A account : ', brokaWallet?.classicAddress);
    console.log('B destination : ', seller);
    console.log('C amount : ', offerAmount);
    const tx = {
      "TransactionType": "Payment",
      "Account": brokaWallet?.classicAddress,
      "Destination": seller,
      "Amount": offerAmount,
    };
    const submitted_tx = await client.submitAndWait(tx, {
      autofill: true,
      wallet: brokaWallet,
    })
    console.log('Payment : ', submitted_tx);
  }

  const sendMoneyToSeller = async (nftId) => {
    const req = await axios.post('https://docs-demo.xrp-testnet.quiknode.pro/', {
      "method": 'nft_history',
      "params": [{
        "nft_id": nftId
      }],
      "id": 1,
      "jsonrpc": "2.0",
    })
    console.log("transactions : ", req.data.result.transactions)
    return req.data.result.transactions[1].tx.Account;
  }

  const getSource = (uri) => {
    return convertHexToString(uri);
  }

  useEffect(() => {
    connectClient();
  }, []);

  return (
    <>
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold">NFTs to sale ({ttokens?.length}) :</h1>

        <div className="flex flex-row space-y-2 space-around m-4 flex-wrap center max-w-screen-xl">
          {ttokens?.length ?
            ttokens.map((token, index) => (
              <div className="bg-white rounded-lg shadow-xl mx-6 p-5 mt-2" key={index}>

                <div className="items-center flex flex-col space-y-4 " key={token.id}>
                  <img
                    // src={token.uri?.split('|')[1]}
                    src={getSource(token.URI).split('|')[1]}
                    className="w-64 h-64"
                    alt="ipfs image"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-row space-x-4 items-center mr-2 ml-2">
                      <div className="flex flex-col">
                        <h1 className="text-xl font-bold">Name : {getSource(token.URI).split('|')[0]}</h1>
                      </div>
                    </div>
                    <NFTInfos setOfferAmount={setOfferAmount} setSelectedNFT={setSelectedNFT} token={token} key={token.id} updateShow={updateShow} client={client} show={show} updateOfferIndex={updateOfferIndex} />
                  </div>
                </div>

              </div>
            ))
            :
            <h1 className="text-2xl font-bold" >
              <span className="inline-block h-4 w-4 animate-spin rounded-full mb-0.5 mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status">
              </span>
              No NFTs found...
            </h1>
          }
        </div>

      </div>

      {show && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="flex flex-col bg-white p-8 rounded-lg space-y-4">
            <h1 className="text-4xl font-bold">Accept Sell Offer</h1>
            <input type="text" placeholder="Your seed" value={userSeed} className="outline-none border-2 border-gray-300 rounded-md" onChange={(e) => setUserSeed(e.target.value)} />
            <button
              className="bg-black text-white p-4 rounded-lg"
              disabled={userSeed === ''}
              onClick={async () => {
                setAccepting(true);
                console.log('Selected NFT : ', selectedNFT);
                const seller = await sendMoneyToSeller(selectedNFT);
                console.log('Seller : ', seller)
                try {
                  await sendPaiement(seller);
                } catch (error) {
                  console.log(error);
                } finally {
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
                }
              }}
            >
              {accepting ? (
                <div>
                  <span className="inline-block h-3 w-3 animate-spin rounded-full mr-1 border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status">
                  </span>
                  Buying...
                </div>)
                :
                'Buy The NFT !!!!'}
            </button>
            <button
              className="bg-red-500 text-white p-4 rounded-lg"
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
    <main className="flex min-h-screen flex-col items-center justify-between p-14">
      <div className="items-center justify-between font-mono text-sm lg:flex">
        <ShowSome />
      </div>
      <Footer />
    </main>
  );
}
