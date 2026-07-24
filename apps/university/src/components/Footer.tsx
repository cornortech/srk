import { Image } from "@nextui-org/react";
import {
  ContactRound,
  Instagram,
  MessageCircleQuestion,
  Youtube,
} from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  const affiliateLink = "/affiliate-landing";

  return (
    <footer className="bg-bgPrimary text-gray-400 py-14">
      <div className="max-w-custom mx-auto p-16 rounded-2xl border-[0.5px] border-gray-700 filter drop-shadow-[0_35px_35px_rgba(0,0.5,0)] ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* EXPLORE Section */}
          <div className="flex flex-col items-center md:items-start">
            <Image src="/logo-280.webp" width={140} />
          </div>

          <div>
            <h2 className="text-white mb-4 font-medium">[ EXPLORE ]</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="https://thesrkuniversity.com/course/1"
                  className="hover:text-white transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  to="/packages"
                  className="hover:text-white transition-colors"
                >
                  Packages
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          {/* ACCOUNTS Section */}
          <div>
            <h2 className="text-white mb-4 font-medium">[ ACCOUNTS ]</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/study"
                  className="hover:text-white transition-colors"
                >
                  My Study
                </Link>
              </li>
              <li>
                <Link
                  to={affiliateLink}
                  className="hover:text-white transition-colors"
                >
                  Affiliate Program
                </Link>
              </li>
              <li>
                <button
                  className="inline-block bg-primary text-black px-4 py-1 rounded transition-colors animate-shake"
                >
                  <a href="/">Home</a>
                </button>
              </li>
            </ul>
          </div>

          {/* CONTACT Section */}
          <div>
            <h2 className="text-white mb-4 font-medium">[ RESOURCES ]</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/getting-started"
                  className="hover:text-white transition-colors"
                >
                  Getting Started
                </Link>
              </li>
              <li>
                <Link
                  to="/help"
                  className="hover:text-white transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT Section */}
          <div>
            <h2 className="text-white mb-4 font-medium">[ SUPPORT ]</h2>
            <ul className="space-y-2">
              <li className="flex gap-2 items-center">
                <MessageCircleQuestion className="w-4 h-4" />
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li className="flex gap-2 items-center">
                <ContactRound className="w-4 h-4" />
                <a href="tel:+977976922301" className="hover:text-white transition-colors">
                  +977 976-9223013
                </a>
              </li>
              <li className="flex gap-4 pt-2">
                <a
                  href="https://www.instagram.com/thesrkuniversity/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@thesrkuniversity.com1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className=" mt-8 rounded-xl bg-gray-800">
          <div className=" p-4 flex flex-col sm:flex-row justify-between items-center text-sm">
            <p>@ THE SRK University 2025. All Right Reserved</p>
            <div className="flex gap-4 mt-2 sm:mt-0">
              <Link
                to="/privacy-policy"
                className="hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/disclaimer"
                className="hover:text-white transition-colors"
              >
                Disclaimer
              </Link>
              <Link
                to="/termsAndCondition"
                className="hover:text-white transition-colors"
              >
                Terms Of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
