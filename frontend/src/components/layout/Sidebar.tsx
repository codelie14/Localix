import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  ShieldAlertIcon,
  BrainCircuitIcon,
  NetworkIcon,
  BellIcon,
  FileTextIcon,
  SettingsIcon,
  ChevronLeftIcon,
  ChevronRightIcon } from
'lucide-react';
const navItems = [
{
  path: '/',
  label: 'Dashboard',
  icon: LayoutDashboardIcon
},
{
  path: '/vulnerabilities',
  label: 'Vulnerabilities',
  icon: ShieldAlertIcon
},
{
  path: '/threat-intelligence',
  label: 'Threat Intelligence',
  icon: BrainCircuitIcon
},
{
  path: '/knowledge-graph',
  label: 'Knowledge Graph',
  icon: NetworkIcon
},
{
  path: '/alerts',
  label: 'Alerts',
  icon: BellIcon
},
{
  path: '/reports',
  label: 'Reports',
  icon: FileTextIcon
},
{
  path: '/settings',
  label: 'Settings',
  icon: SettingsIcon
}];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}
export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();
  return (
    <motion.aside
      initial={false}
      animate={{
        width: collapsed ? 72 : 240
      }}
      transition={{
        duration: 0.2,
        ease: 'easeInOut'
      }}
      className="h-screen bg-terminal-black border-r border-terminal-green/20 flex flex-col fixed left-0 top-0 z-40">

      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-terminal-green/20 relative">
        <motion.div
          initial={false}
          animate={{
            opacity: 1
          }}
          className="flex items-center gap-2">

          <span className="text-2xl font-bold text-terminal-green neon-green-glow tracking-wider">
            {collapsed ? 'C' : 'CKI'}
          </span>
          {!collapsed &&
          <motion.span
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            className="text-xs text-gray-500 mt-1">

              LOCALIX
            </motion.span>
          }
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded transition-all duration-200 group scanline-effect ${isActive ? 'bg-terminal-green/10 text-terminal-green' : 'text-gray-400 hover:text-terminal-green hover:bg-terminal-green/5'}`
              }>

              {isActive &&
              <motion.div
                layoutId="activeNav"
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-terminal-green neon-box-green"
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 30
                }} />

              }
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${isActive ? 'neon-green-glow' : ''}`} />

              <AnimatePresence>
                {!collapsed &&
                <motion.span
                  initial={{
                    opacity: 0,
                    x: -10
                  }}
                  animate={{
                    opacity: 1,
                    x: 0
                  }}
                  exit={{
                    opacity: 0,
                    x: -10
                  }}
                  transition={{
                    duration: 0.15
                  }}
                  className="text-sm font-medium whitespace-nowrap">

                    {item.label}
                  </motion.span>
                }
              </AnimatePresence>
              {isActive && !collapsed &&
              <span className="ml-auto text-terminal-green text-xs">●</span>
              }
            </NavLink>);

        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-2 border-t border-terminal-green/20">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-gray-400 hover:text-terminal-green hover:bg-terminal-green/5 rounded transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>

          {collapsed ?
          <ChevronRightIcon className="w-5 h-5" /> :

          <>
              <ChevronLeftIcon className="w-5 h-5" />
              <span className="text-xs">Collapse</span>
            </>
          }
        </button>
      </div>
    </motion.aside>);

}