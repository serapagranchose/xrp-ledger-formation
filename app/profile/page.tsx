"use client";

import { Account, Wallet, Networks, XRPLClient, useBalance, useIsConnected, useMintToken } from "@nice-xrpl/react-xrpl";
import Footer from "./../components/footer";
import { use, useState } from "react";
// import { RippleAPI } from "ripple-lib";

// const api = new RippleAPI({ server: "wss://s.altnet.rippletest.net:51233/" });
const address = 'rQwTib8jtVgo3KVUannk2tYq6iaZ73Ky2K';
const secret = 'sEdTDxhkFNtcKuQsuViju4yNJgCpNBC';
const sequence = '46069813';

function ShowBalance() {
  const balance = useBalance();

  return (
    <h1 className="text-4xl font-bold">{ balance } XRP</h1>
  );
}

function Profile() {
  const [nftName, setNftName] = useState<string>('');
  const [sending, setSending] = useState<boolean>(false);

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
                }}
                >Create NFT</button>
              ) :
              (<button className="bg-black text-white p-4 rounded-lg opacity-50" disabled>Enter a name...</button>)
              )}
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