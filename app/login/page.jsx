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

// function walletLog() {
//   return (
//     <div>
//       <h3 className="text-lg font-medium leading-6 text-gray-900" id="modal-title">
//         Wallet
//       </h3>
//       <div className="mt-2">
//         <div className="text-sm text-gray-500">
//           <XRPLClient network={Networks.Testnet}>
//             <Wallet seed={mySeed}>
//               <Account >
//                 <ShowBalance />
//               </Account>
//             </Wallet>
//           </XRPLClient>
//         </div>
//       </div>
//     </div>
//   );
// }

export default function LoginPage() {
  const [seed, setSeed] = useState('');
  const [isLog, setLog] = useState('');

  const mySeed = 'sEdVRJhxG6pdCEXdhs3kCtXZxTYCDV5';

  const handleUserInput = (event) => {
    setSeed(event.target.value);
  };

  const handleForm = (event) => {
    event.preventDefault();
    setLog(true);
  };

  return (
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">

            {/* {isLog ? <walletLog /> : null} */}
            {isLog ? <h3 className="text-gray-500">test</h3> : null }



              <h2 className="text-sm text-gray-500">Formulaire de saisie du nom d'utilisateur</h2>
              <form onSubmit={handleForm}>
                <div>
                  <label htmlFor="seed" className="text-sm text-gray-500">Nom d'utilisateur :</label>
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


        <Footer />

      </div>
      );
}
