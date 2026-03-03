import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-2xl'
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        exit={{
          opacity: 0
        }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
        onClick={onClose}>

          <motion.div
          initial={{
            scale: 0.95,
            opacity: 0,
            y: 20
          }}
          animate={{
            scale: 1,
            opacity: 1,
            y: 0
          }}
          exit={{
            scale: 0.95,
            opacity: 0,
            y: 20
          }}
          className={`bg-terminal-dark border border-terminal-green/30 rounded-lg w-full ${maxWidth} max-h-[90vh] flex flex-col neon-box-green relative`}
          onClick={(e) => e.stopPropagation()}>

            {/* ASCII corners */}
            <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
              ┌
            </span>
            <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
              ┐
            </span>
            <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
              └
            </span>
            <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
              ┘
            </span>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-terminal-green/20 bg-terminal-green/5">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 text-xs">[</span>
                <span className="text-terminal-green text-sm font-bold uppercase tracking-wider">
                  {title}
                </span>
                <span className="text-gray-500 text-xs">]</span>
              </div>
              <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-terminal-red hover:bg-terminal-red/10 rounded transition-colors">

                <XIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto">{children}</div>
          </motion.div>
        </motion.div>
      }
    </AnimatePresence>);

}