'use client'

import { Button } from '@/components/ui/button'
import { Mail, MapPin, Phone } from 'lucide-react'

interface FooterProps {
  onBookingClick: () => void
}

export function Footer({ onBookingClick }: FooterProps) {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-serif font-bold mb-2">Auralixa</h3>
            <p className="text-sm opacity-80">
              Premium aesthetic treatments for your most confident self.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#treatments" className="opacity-80 hover:opacity-100 transition-opacity">
                  Treatments
                </a>
              </li>
              <li>
                <a href="#testimonials" className="opacity-80 hover:opacity-100 transition-opacity">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#faq" className="opacity-80 hover:opacity-100 transition-opacity">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="opacity-80 hover:opacity-100 transition-opacity">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a href="tel:07448297154" className="opacity-80 hover:opacity-100 transition-opacity">
                  07448 297154
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:auralixax@gmail.com" className="opacity-80 hover:opacity-100 transition-opacity">
                  auralixax@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="opacity-80">
                  Castlemere Community Centre, 60 Tweedale St, OL11 1HH, Rochdale, Greater Manchester, United Kingdom
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-medium mb-4">Hours</h4>
            <ul className="space-y-1 text-sm opacity-80">
              <li className="flex justify-between gap-4">
                <span>Monday–Friday:</span>
                <span>10 am–6 pm</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Saturday–Sunday:</span>
                <span>10 am–5 pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm">
          <p className="opacity-80">
            © 2024 Auralixa Aesthetics. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0 opacity-80">
            <a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a>
            <a href="#" className="hover:opacity-100 transition-opacity">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
