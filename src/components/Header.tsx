'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from './ui/Button';
import { Menu, X, Phone } from 'lucide-react';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-sm' 
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            {/* Logomark */}
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
              isScrolled ? "bg-slate-900" : "bg-white"
            )}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M13 2L4 14H11L9 22L20 10H12L14 2H13Z" 
                  fill={isScrolled ? "#4ADE80" : "#1E293B"}
                />
              </svg>
            </div>
            {/* Wordmark */}
            <span className={cn(
              "text-xl font-display font-bold tracking-tight transition-colors",
              isScrolled ? "text-slate-900" : "text-white"
            )}>
              ampra
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isScrolled 
                    ? "text-slate-600 hover:text-slate-900" 
                    : "text-white/80 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link 
              href="tel:1-888-555-0123" 
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors",
                isScrolled 
                  ? "text-slate-600 hover:text-slate-900" 
                  : "text-white/80 hover:text-white"
              )}
            >
              <Phone className="w-4 h-4" />
              (888) 555-0123
            </Link>
            <Link href="/quote">
              <Button size="sm">Get Quote</Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              isScrolled ? "hover:bg-slate-100" : "hover:bg-white/10"
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={cn("w-6 h-6", isScrolled ? "text-slate-600" : "text-white")} />
            ) : (
              <Menu className={cn("w-6 h-6", isScrolled ? "text-slate-600" : "text-white")} />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-base font-medium text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <Link href="tel:1-888-555-0123" className="flex items-center gap-2 text-slate-600 py-2">
                <Phone className="w-4 h-4" />
                (888) 555-0123
              </Link>
              <Link href="/quote" className="block">
                <Button className="w-full">Get Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
