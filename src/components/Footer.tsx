
import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full py-4 mt-8 border-t border-gray-200"
    >
      <p className="text-sm text-gray-500 text-center">
        <a 
          href="https://www.manee.com.np" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-gray-700 transition-colors duration-300"
        >
          © {new Date().getFullYear()} Manee
        </a>
      </p>
    </motion.footer>
  );
};

export default Footer;
