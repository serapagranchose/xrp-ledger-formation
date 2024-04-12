"use client"

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";

import { MetaMaskProvider } from "@metamask/sdk-react";

import MetaMaskAuthButton from "../buttons/metamask-auth";



const Navbar = ({ }) => {
  const [isNavbarToggle, setIsNavbarToggle] = useState(false)
  const host = typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host, // using the host constant defined above
    },
  };

  const toggleMobileNavbar = () => {
    setIsNavbarToggle(!isNavbarToggle)
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-black dark:border-white">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        <Link href="/" className="flex items-center">
          <Image
            src="https://flowbite.com/docs/images/logo.svg"
            className="mr-3 h-6 sm:h-9"
            width={100}
            height={24}
            alt="DApp Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">DApp</span>
        </Link>
        <div className="flex items-center lg:order-2">
          <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
            <MetaMaskAuthButton />
          </MetaMaskProvider>
          <button
            className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={toggleMobileNavbar}
          >
            <span>Open main menu</span>
            {isNavbarToggle ? 
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              :
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg>
            }
          </button>
        </div>
        <div className={`${isNavbarToggle ? 'none' : 'hidden'} justify-between items-center w-full lg:flex lg:w-auto lg:order-1`}>
          <ul className="flex flex-col mt-4 lg:flex-row lg:space-x-8 lg:mt-0">
            <li>
              <Link href="/marketplace" onClick={toggleMobileNavbar} className="block py-2 pr-4 pl-3 hover:text-gray-400 lg:dark:hover:bg-transparent">marketplace</Link>
            </li>
            <li>
              <Link href="/team" onClick={toggleMobileNavbar} className="block py-2 pr-4 pl-3 hover:text-gray-400 lg:dark:hover:bg-transparent">team</Link>
            </li>
            <li>
              <Link href="/contact" onClick={toggleMobileNavbar} className="block py-2 pr-4 pl-3 hover:text-gray-400 lg:dark:hover:bg-transparent">contact</Link>
            </li>
            <li>
              <Link href='/profile' onClick={toggleMobileNavbar} className="block py-2 pr-4 pl-3 hover:text-gray-400 lg:dark:hover:bg-transparent">profile</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar