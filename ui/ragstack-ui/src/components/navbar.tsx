import React, { useState, useRef, useEffect } from 'react'
import { Button, Navbar, TextInput, Spinner } from 'flowbite-react'
import {HiMenuAlt1, HiSearch, HiX} from 'react-icons/hi'

const NavbarComponent: React.FC = () => {
    return (
    <Navbar fluid>
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Navbar.Brand href="/">
              <img
                alt=""
                src="/images/Horizontal_Logo_light.svg"
                className="dark:hidden mr-3 h-8"
              />
            </Navbar.Brand>
            {/* <form className="ml-16 hidden md:block">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <TextInput
                icon={HiSearch}
                id="search"
                name="search"
                placeholder="Search"
                required
                size={32}
                type="search"
              />
            </form> */}
          </div>
          <div className="flex items-center lg:gap-3">
            <div className="flex items-center">
              <button
                onClick={() => {}}
                className="cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
              >
                <span >Search</span>
                <HiSearch className="h-6 w-6" />
              </button>
            </div>
            <div className="hidden lg:block"></div>
          </div>
        </div>
      </div>
    </Navbar>
    )
}

export default NavbarComponent