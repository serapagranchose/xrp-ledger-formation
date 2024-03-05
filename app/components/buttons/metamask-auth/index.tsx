"use client"

import { useSDK } from "@metamask/sdk-react";
import { useEffect, useRef, useState } from "react";

const MetaMaskAuthButton = ({ }: {
}) => {
  const { sdk, connected, connecting, balance, account, chainId } = useSDK();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.terminate();
    }
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button className="inline-flex w-full justify-center gap-x-1.5 px-3 py-2 lg:px-5 py-2 lg:py-2.5 mr-2 border-white hover:border-black dark:border-black dark:hover:border-white"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleDropdownToggle}
      >
        <svg className={`w-6 h-6 ${isHovered ? 'text-gray-400' : 'text-current'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M18 3H2v18h18v-4h2V7h-2V3h-2zm0 14v2H4V5h14v2h-8v10h8zm2-2h-8V9h8v6zm-4-4h-2v2h2v-2z" fill="currentColor" /> </svg>
      </button>
      {isOpen && (
        <div className="absolute right-0 z-10 mt-[10px] w-56 origin-top-right divide-y divide-gray-100 border-2 bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
          {connected ?
            <>
              <div className="py-1">
                <span className="block px-4 py-2 text-sm">{account?.substring(0, 21)}...</span>
              </div>
              <div className="py-1">
                <span className="block px-4 py-2 text-sm">balance: {balance}</span>
                <span className="block px-4 py-2 text-sm">chain id: {chainId}</span>
              </div>
              <div className="py-1">
                <a href="/inventory" className="block px-4 py-2 text-sm hover:text-gray-400">inventory</a>
              </div>
              <div className="py-1">
                <button className="block px-4 py-2 text-sm hover:text-gray-400" onClick={disconnect}>
                  Log Out
                </button>
              </div>
            </>
            :
            <div className="py-1">
              <button className="block px-4 py-2 text-sm hover:text-gray-400"
                disabled={connecting}
                onClick={connect}
              >
                {connecting ? '. . .' : 'Log In'}
              </button>
            </div>
          }
        </div>
      )}
    </div >
  )
}

/*           <button
          className="text-gray-800 dark:text-white hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
          onClick={disconnect}
          >
          {account?.substring(0, 8)}...
          </button> */

export default MetaMaskAuthButton