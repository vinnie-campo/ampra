'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Zap, 
  LayoutDashboard, 
  FileText, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';

const navItems = [
  { href: '/portal/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/documents', label: 'Documents', icon: FileText },
  { href: '/portal/payments', label: 'Payments', icon: CreditCard },
  { href: '/portal/help', label: 'Help', icon: HelpCircle },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock user data
  const user = {
    name: 'John Smith',
    email: 'john@example.com',
  };

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-sand-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/portal/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-display font-bold text-slate-900">
              Power<span className="text-primary-600">Vault</span>
            </span>
          </Link>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-sand-100"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-white border-r border-sand-200 z-50 transform transition-transform duration-300',
        'lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-sand-200">
            <Link href="/portal/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-bold text-slate-900">
                Power<span className="text-primary-600">Vault</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-sand-600 hover:bg-sand-100 hover:text-slate-900'
                  )}
                >
                  <item.icon className={cn('w-5 h-5', isActive && 'text-primary-600')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sand-200">
            <div className="flex items-center gap-3 px-4 py-3 bg-sand-50 rounded-xl mb-2">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-sand-500 truncate">{user.email}</p>
              </div>
            </div>
            
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 text-sand-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
