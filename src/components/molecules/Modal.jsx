import React from 'react'
      import { motion, AnimatePresence } from 'framer-motion'
      import Icon from '@/components/atoms/Icon'
      import Text from '@/components/atoms/Text'
      import Button from '@/components/atoms/Button'

      const Modal = ({ isOpen, onClose, title, children }) => {
        return (
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={onClose}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    &lt;Text variant="h2"&gt;{title}&lt;/Text&gt;
                    &lt;Button variant="iconOnly" onClick={onClose} icon="X" /&gt;
                  </div>
                  {children}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        )
      }

      export default Modal