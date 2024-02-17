import React from "react";
import EthconnectButton from "./EthconnectButton";
import Logo from "../../public/logo/logoMF.png";
import Image from "next/image";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
function Header() {
  return (
    <div className="mt-8">
      <div className="flex justify-between gap-10 items-center mx-auto">
        <Image src={Logo} alt="logo" />
        <div>
          <div className="flex gap-10 items-center">
            <div>
              <p className="text-2xl font-semibold mb-3">Chat</p>
              <p className="text-[13px] ">Welcome to MoveFlow AI</p>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Weekly Meeting..."
                className="pl-7 pr-20 py-2 bg-[#1F1E26] rounded-[20px] focus:ring-1 focus:ring-blue-500  focus:text-white focus:border-blue-500 outline-none w-[447px] h-14"
              />
              <div className="absolute inset-y-0 right-0 px-5 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <EthconnectButton />
      </div>
    </div>
  );
}

export default Header;
