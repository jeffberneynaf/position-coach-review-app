import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#333333] text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Position Coach Review</h3>
            <p className="text-sm mb-4">
              Find and connect with experienced position coaches in your area. Read reviews, 
              compare ratings, and take your athletic skills to the next level.
            </p>
            <div className="flex gap-3">
              <a href="#" className="hover:text-[#f91942] transition">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-[#f91942] transition">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-[#f91942] transition">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-[#f91942] transition">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-[#f91942] transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/coaches" className="hover:text-[#f91942] transition">
                  Browse Coaches
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#f91942] transition">
                  Become a Coach
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#f91942] transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#f91942] transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f91942] transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f91942] transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#f91942] transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-lg font-bold mb-4">Newsletter</h4>
            <p className="text-sm mb-4">
              Subscribe to get updates and special offers.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white text-sm focus:outline-none focus:border-[#f91942]"
              />
              <button className="bg-[#f91942] hover:bg-[#d01437] text-white px-4 py-2 rounded-lg transition">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Position Coach Review. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
