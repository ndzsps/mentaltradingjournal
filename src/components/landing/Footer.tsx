import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C] text-gray-300 py-16 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Disclaimer */}
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm leading-relaxed">
              Tools for futures, currency & options involves substantial risk & is not appropriate for everyone. Only risk capital should be used for trading. Results are not guaranteed and may vary from person to person. There are inherent risks involved with trading, including the loss of your investment. Past performance in the market is not indicative of future results. Any investment is solely at your own risk, you assume full responsibility.
            </p>
          </div>

          {/* Navigation Links - Column 1 */}
          <div className="space-y-4">
            <Link to="/login" className="block hover:text-white transition-colors">Log In</Link>
            <Link to="/features" className="block hover:text-white transition-colors">Features</Link>
            <Link to="/pricing" className="block hover:text-white transition-colors">Pricing</Link>
          </div>

          {/* Navigation Links - Column 2 */}
          <div className="space-y-4">
            <Link to="/contact" className="block hover:text-white transition-colors">Contact Us</Link>
            <Link to="/privacy" className="block hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="block hover:text-white transition-colors">Terms & Conditions</Link>
            
            {/* Social Media Icons */}
            <div className="flex gap-4 pt-4">
              <a href="#" className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};