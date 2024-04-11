'use client'
import { useState } from 'react';
import { Account, Networks, XRPLClient, useBalance, Wallet } from "@nice-xrpl/react-xrpl";
import Footer from '../components/footer';

function ShowBalance() {
  const balance = useBalance();

  return (
    <div>Balance: {balance}</div>
  );
}

export default function LoginPage() {
  const [seed, setSeed] = useState('');

  const myAddress = 'rUBmjNkrbxGomZJRx44dBbX8kYRFH9nRUG';
  const mySeed = 'sEdVRJhxG6pdCEXdhs3kCtXZxTYCDV5';

  const handleForm = (event) => {
    setSeed(event.target.value);
  };

  return (
    <XRPLClient network={Networks.Testnet}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
                  Wallet
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <Wallet seed={mySeed}>
                      <Account >
                        <ShowBalance />
                      </Account>
                    </Wallet>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </XRPLClient>
    //   <Footer />
  );
}
