import React from "react";
import {
  Twitter,
  Facebook,
  Youtube,
  Instagram,
  HelpCircle,
  Shield,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F97316] text-white text-sm">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">AI Summarizer</h1>
          <p>
            123 AI Lane
            <br />
            Lagos, Nigeria
            <br />
            info@aisummarizer.com
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-3">Menu</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Tools
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-3">Support</h2>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline flex items-center gap-1">
                <Shield size={14} />
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline flex items-center gap-1">
                <HelpCircle size={14} />
                Help
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-semibold text-base mb-3">Follow</h2>
          <div className="flex items-center gap-4">
            <a href="#">
              <Twitter size={18} className="hover:opacity-80" />
            </a>
            <a href="#">
              <Facebook size={18} className="hover:opacity-80" />
            </a>
            <a href="#">
              <Youtube size={18} className="hover:opacity-80" />
            </a>
            <a href="#">
              <Instagram size={18} className="hover:opacity-80" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 px-6 text-center text-xs opacity-70">
        &copy; {new Date().getFullYear()} HeaderAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
