import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className="min-h-screen bg-terminal-black">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <TopNavbar sidebarCollapsed={sidebarCollapsed} />

      <motion.main
        initial={false}
        animate={{
          marginLeft: sidebarCollapsed ? 72 : 240
        }}
        transition={{
          duration: 0.2,
          ease: 'easeInOut'
        }}
        className="pt-16 min-h-screen">

        <div className="p-6">
          <Outlet />
        </div>
      </motion.main>
    </div>);

}