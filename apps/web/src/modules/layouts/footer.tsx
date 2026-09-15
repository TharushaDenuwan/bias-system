import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Facebook, Instagram, Mail, MapPin, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#001b35] to-[#00255a] backdrop-blur-md bg-opacity-30 text-white border-t border-white/20">
      {/* Newsletter Section */}
      <div className="border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-2">
              Get the Best Travel Deals
            </h3>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter and never miss out on exclusive offers
              and travel inspiration.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/20 text-white placeholder-white/70 border border-white/30"
              />
              <Button className="bg-white/20 hover:bg-white/30 text-white font-semibold">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white font-heading">
              Bloonsoo
            </h4>
            <p className="text-white/80 text-sm leading-relaxed">
              Your trusted travel companion for finding the perfect
              accommodation. Discover amazing places to stay around the world.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon size={16} />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white">Quick Links</h5>
            <ul className="space-y-2">
              {[
                { label: "Search Hotels", href: "/search" },
                { label: "Deals & Offers", href: "/deals" },
                { label: "Destinations", href: "/destinations" },
                { label: "Travel Guide", href: "/guide" },
                { label: "About Us", href: "/about" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white">Support</h5>
            <ul className="space-y-2">
              {[
                { label: "Help Center", href: "/help" },
                { label: "Contact Us", href: "/contact" },
                { label: "Terms of Service", href: "/legal/terms" },
                { label: "Privacy Policy", href: "/legal/privacy" },
                { label: "FAQs", href: "/legal/faqs" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/80 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h5 className="text-lg font-semibold text-white">Contact</h5>
            <div className="space-y-3 text-white/80 text-sm">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-white" />
                <span>123 Travel Street, City, Country</span>
              </div>
              {/* <div className="flex items-center space-x-3">
                <Phone size={16} className="text-white" />
                <span>+94 712 568 568 / +94 718 568 568</span>
              </div> */}
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-white" />
                <span> info@bloonsoo.com </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/70 text-sm">
              © 2025 Marriex PVT LTD All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["terms", "privacy", "cookies"].map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
