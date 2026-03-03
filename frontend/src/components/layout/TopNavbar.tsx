import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SearchIcon,
  BellIcon,
  CircleIcon,
  TerminalIcon,
  LogOutIcon,
  UserIcon,
  SettingsIcon } from
'lucide-react';
interface TopNavbarProps {
  sidebarCollapsed: boolean;
}
export function TopNavbar({ sidebarCollapsed }: TopNavbarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <motion.header
      initial={false}
      animate={{
        marginLeft: sidebarCollapsed ? 72 : 240
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
      className="h-16 bg-terminal-black border-b border-terminal-green/20 flex items-center justify-between px-6 fixed top-0 right-0 left-0 z-30">

      {/* Terminal Search */}
      <div className="flex-1 max-w-xl">
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded border transition-all duration-200 ${searchFocused ? 'border-terminal-green bg-terminal-green/5 neon-box-green' : 'border-terminal-green/30 bg-terminal-dark'}`}>

          <span className="text-terminal-green font-bold">&gt;</span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="search --query"
            className="flex-1 bg-transparent text-gray-300 placeholder-gray-600 outline-none text-sm" />

          {searchFocused &&
          <span className="text-terminal-green animate-pulse">█</span>
          }
          <SearchIcon className="w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* System Status */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-500">[SYS]</span>
            <span className="text-terminal-green">ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">[SCAN]</span>
            <span className="text-terminal-amber">ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">[THREAT]</span>
            <span className="text-terminal-red status-blink">ELEVATED</span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
            className="relative p-2 text-gray-400 hover:text-terminal-green transition-colors">

            <BellIcon className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-terminal-red rounded-full status-blink" />
          </button>

          <AnimatePresence>
            {showNotifications &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: 10
              }}
              className="absolute right-0 mt-2 w-80 bg-terminal-dark border border-terminal-green/30 rounded-lg shadow-lg neon-box-green overflow-hidden z-50">

                <div className="p-3 border-b border-terminal-green/20 bg-terminal-green/5 flex justify-between items-center">
                  <span className="text-terminal-green text-xs font-bold">
                    [NOTIFICATIONS]
                  </span>
                  <span className="text-gray-500 text-xs cursor-pointer hover:text-terminal-green">
                    Mark all read
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="p-3 border-b border-terminal-green/10 hover:bg-terminal-green/5 cursor-pointer">
                    <p className="text-terminal-red text-xs font-bold mb-1">
                      [CRITICAL] New Vulnerability
                    </p>
                    <p className="text-gray-300 text-sm">
                      CVE-2024-0001 detected on prod-server-01
                    </p>
                    <p className="text-gray-500 text-xs mt-1">2 mins ago</p>
                  </div>
                  <div className="p-3 border-b border-terminal-green/10 hover:bg-terminal-green/5 cursor-pointer">
                    <p className="text-terminal-amber text-xs font-bold mb-1">
                      [HIGH] Failed Logins
                    </p>
                    <p className="text-gray-300 text-sm">
                      Multiple failed logins for admin@company.com
                    </p>
                    <p className="text-gray-500 text-xs mt-1">15 mins ago</p>
                  </div>
                  <div className="p-3 hover:bg-terminal-green/5 cursor-pointer">
                    <p className="text-terminal-green text-xs font-bold mb-1">
                      [SYSTEM] Scan Complete
                    </p>
                    <p className="text-gray-300 text-sm">
                      Daily vulnerability scan finished successfully
                    </p>
                    <p className="text-gray-500 text-xs mt-1">1 hour ago</p>
                  </div>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>

        {/* User Avatar */}
        <div className="relative">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}>

            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-terminal-dark border-2 border-terminal-green flex items-center justify-center hover:neon-box-green transition-all">
                <TerminalIcon className="w-4 h-4 text-terminal-green" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-terminal-green rounded-full border-2 border-terminal-black" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm text-gray-300">admin</p>
              <p className="text-xs text-terminal-green">root@localix</p>
            </div>
          </div>

          <AnimatePresence>
            {showProfile &&
            <motion.div
              initial={{
                opacity: 0,
                y: 10
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: 10
              }}
              className="absolute right-0 mt-2 w-48 bg-terminal-dark border border-terminal-green/30 rounded-lg shadow-lg neon-box-green overflow-hidden z-50">

                <div className="p-3 border-b border-terminal-green/20 bg-terminal-green/5">
                  <p className="text-white text-sm font-medium">
                    Administrator
                  </p>
                  <p className="text-gray-500 text-xs">admin@localix.io</p>
                </div>
                <div className="p-1">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-terminal-green/10 hover:text-terminal-green rounded flex items-center gap-2 transition-colors">
                    <UserIcon className="w-4 h-4" /> Profile
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-terminal-green/10 hover:text-terminal-green rounded flex items-center gap-2 transition-colors">
                    <SettingsIcon className="w-4 h-4" /> Settings
                  </button>
                  <div className="h-px bg-terminal-green/20 my-1" />
                  <button className="w-full text-left px-3 py-2 text-sm text-terminal-red hover:bg-terminal-red/10 rounded flex items-center gap-2 transition-colors">
                    <LogOutIcon className="w-4 h-4" /> Disconnect
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </div>
    </motion.header>);

}