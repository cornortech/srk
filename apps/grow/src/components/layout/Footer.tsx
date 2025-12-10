import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react';
import {MagneticButton} from '../../lib/ui/MagneticButton';

export const Footer = () => {
  const socialLinks = [
    { icon: Facebook, label: "Facebook", color: "#1877F2" },
    { icon: Instagram, label: "Instagram", color: "#E4405F" },
    { icon: Twitter, label: "Twitter", color: "#1DA1F2" },
    { icon: Linkedin, label: "LinkedIn", color: "#0A66C2" },
    { icon: Youtube, label: "YouTube", color: "#FF0000" },
  ];

  return (
    <footer className="bg-black pt-20 pb-12 border-t border-white/5 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center">
                <span className="font-bold text-black text-xl">S</span>
              </div>
              <span className="font-bold text-white text-xl tracking-wide">
                SRK<span className="text-[#b68938]">Grow</span>
              </span>
            </div>
            <p className="text-gray-500 max-w-sm mb-8 leading-relaxed">
              The central hub for social media growth in the SRK ecosystem.
              Connecting verified users with authentic engagement opportunities.
            </p>
            <a href="#packages">
              <MagneticButton className="px-5 py-2 text-sm">
                Get Started
              </MagneticButton>
            </a>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Platform</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {["How It Works", "Pricing", "FAQ"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace(/\s/g, "")}`}
                    className="hover:text-[#b68938] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 text-lg">Ecosystem</h4>
            <ul className="space-y-4 text-gray-500 text-sm">
              {["SRK University", "SRK Task", "SRK Grow", "Support"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-[#b68938] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-600">
              © 2024 SRK Grow. All rights reserved. Part of the SRK Ecosystem.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors group"
                  style={{ border: `1px solid ${social.color}40` }}
                >
                  <social.icon
                    size={18}
                    className="text-gray-400 group-hover:text-white transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              Designed with ❤️ for the SRK community | support@srikgrow.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
