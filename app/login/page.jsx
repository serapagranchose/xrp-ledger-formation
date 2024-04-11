'use client'
import { useState } from 'react';
import { Account, Networks, XRPLClient, useBalance, Wallet, fromSeed } from "@nice-xrpl/react-xrpl";

export default function LoginPage() {
  const [seed, setSeed] = useState('');
  const [isLog, setLog] = useState('');

  const handleUserInput = (event) => {
    setSeed(event.target.value);
  };

  const handleForm = (event) => {
    event.preventDefault();
    setLog(true);
  };

  const ShowBalance = () => {
    const balance = useBalance();

    return (
      <div>Balance: {balance}</div>
    );
  }

  const WalletLog = () => {
    return (
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
          Wallet
        </h3>
        <div className="mt-2">
          <div className="text-sm text-gray-500">
            <XRPLClient network={Networks.Testnet}>
              <Wallet seed={seed}>
                <Account >
                  <ShowBalance />
                </Account>
              </Wallet>
            </XRPLClient>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow fixed inset-0 outline-none focus:outline-none">
      <div className="relative w-auto my-6 mx-auto max-w-3xl">
        <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">

          <div className="relative p-6 flex-auto">
            {isLog ? <WalletLog /> : null}

            <div className="flex justify-center">
              <h1 className="text-2xl font-medium leading-6 text-gray-900 mb-4">Connect to your wallet</h1>
            </div>
            <form onSubmit={handleForm}>
              <div>
                <label htmlFor="seed" className="text-lg text-gray-700">Seed :</label>
                <input
                  type="text"
                  id="seed"
                  title="Seed must contain at least 29 characters with only alphanumeric characters"
                  value={seed}
                  onChange={handleUserInput}
                  required
                  pattern="[a-zA-Z0-9]{29,}"
                  className="border-gray-600 border-2 rounded-md ml-2 text-gray-500"
                />
              </div>
              <div className="flex justify-center mt-4">
                <button type="submit" className="bg-gray-500 rounded-md p-2">Login</button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

{/* <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

<span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
    <div className="mt-3 text-center">

      {isLog ? <WalletLog /> : null}

      <h1 className="text-gray-500">Login</h1>
      <form onSubmit={handleForm}>
        <div>
          <label htmlFor="seed" className="text-sm text-gray-500">Seed :</label>
          <input
            type="text"
            id="seed"
            value={seed}
            onChange={handleUserInput}
            required
            className="border-gray-200 border-2 rounded-md ml-2 text-gray-500"
          />
        </div>
        <button type="submit" className="bg-gray-500 rounded-md p-2">Soumettre</button>
      </form>

    </div>
  </div>
</div>

</div> */}