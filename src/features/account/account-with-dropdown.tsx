import { Menu, Transition } from '@headlessui/react';
import { LogoutIcon } from '@heroicons/react/outline';
import { shortenAddress } from '../../util/address';
import React, { Fragment } from 'react';
import { LoggedInAccountHeader } from './LoggedInAccountHeader';

type Props = {
  isAuthenticated: boolean;
  connectedAddress: string | null;
  ensAddress?: string | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
};

export const AccountWithDropdown = React.memo(
  ({
    isAuthenticated,
    connectedAddress,
    ensAddress,
    isLoggedIn,
    logout,
  }: Props) => {
    return isAuthenticated ? (
      <Menu as="div" className="relative flex-shrink-0 ml-5">
        <Menu.Button className="flex focus:outline-none">
          <LoggedInAccountHeader />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-40 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg cursor-pointer dark:shadow-none dark:bg-white ring-1 ring-black ring-opacity-5 dark:divide-gray-700 focus:outline-none">
            <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-pale-sky-800">
              <p className="text-sm text-gray-400 dark:text-pale-sky-300">
                {isLoggedIn ? 'Signed in as' : 'Wallet connected'}
              </p>
              <p className="text-sm font-medium text-gray-900 truncate dark:text-pale-sky-300">
                {ensAddress ?? shortenAddress(connectedAddress)}
              </p>
            </div>
            <div
              onClick={logout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 group dark:text-pale-sky-300 hover:bg-gray-50 dark:hover:bg-pale-sky-800 hover:text-gray-900 dark:hover:text-pale-sky-100"
            >
              <LogoutIcon className="w-5 h-5 mr-3" aria-hidden="true" />
              Sign out
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    ) : null;
  }
);
