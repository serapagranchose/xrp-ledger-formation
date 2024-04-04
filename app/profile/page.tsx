"use client";

import { Account, Wallet, Networks, XRPLClient, useBalance, useTokens, useIsConnected, useBurnToken, useMintToken } from "@nice-xrpl/react-xrpl";
import Footer from "./../components/footer";
import { use, useState } from "react";
// import { RippleAPI } from "ripple-lib";

// const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net:51233/" });
const address = "rZTbKwGBRf9vDw7QMpTCoPym4mn2r6Ui3";
const secret = 'sEdTDxhkFNtcKuQsuViju4yNJgCpNBC';
const sequence = '46069813';

function BurnNFT({ id } : { id: string }) {
  const burnToken = useBurnToken();
  const [burning, setBurning] = useState<boolean>(false);

  return (
    <button
    className="bg-black text-white p-4 rounded-lg"
    onClick={async () => {
      setBurning(true);
      const result = await burnToken(id);
      console.log('UI : ', result);
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
    <div className="flex flex-col space-y-4">
      <h1 className="text-4xl font-bold">NFTs :</h1>
      {tokens.length ?
      tokens.map((token) => (
        <div className="flex flex-row space-y-2">
          <div>
            <h1 className="text-2xl font-bold">{token.issuer}</h1>
            <h1 className="text-2xl font-bold">{token.id}</h1>
            <h1 className="text-xl font-bold">{token.uri}</h1>
          </div>
          <BurnNFT id={token.id} />
        </div>
      ))
      : <h1 className="text-2xl font-bold">No NFTs found...</h1>}
    </div>
  );
}

function Profile() {
  const [nftName, setNftName] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);
  const [nftCreated, setNftCreated] = useState<boolean>(false);

  const mintToken = useMintToken();

  return (
    <Account address={address}>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-4xl font-bold">Profile</h1>
          <div className="space-y-12">
              <div>
                  <h1 className="text-4xl font-bold">Address:</h1>
                  <h1 className="text-4xl font-bold">{ address }</h1>
              </div>
              <div>
                  <h1 className="text-4xl font-bold">Balance:</h1>
                  <ShowBalance />
              </div>
          </div>
          <div className="flex flex-col space-y-8">
              <input type='text' placeholder='NFT Name' value={nftName} onChange={(e) => setNftName(e.target.value)} />
              {sending ? (<button className="bg-black text-white p-4 rounded-lg">Creating NFT...</button>)
              : (
              nftName ? (
                <button
                className="bg-black text-white p-4 rounded-lg"
                onClick={async () => {
                  setSending(true);
                  const result = await mintToken(nftName, 0);
                  console.log('UI : ', result);
                  setSending(false);
                  setNftName('');
                  setNftCreated(true);
                }}
                >Create NFT</button>
              ) :
              (<button className="bg-black text-white p-4 rounded-lg opacity-50" disabled>Enter a name...</button>)
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