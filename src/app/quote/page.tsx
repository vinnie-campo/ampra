'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  Sun,
  Home,
  Clock,
  ChevronDown,
  MapPin,
} from 'lucide-react';

// Battery configuration options
const batteryOptions = [
  {
    id: 'pw3',
    name: '1 Powerwall 3',
    capacity: 13.5,
    power: 11.5,
    price: 15500,
    backupHours: { essentials: 24, partial: 12, whole: 6 },
  },
  {
    id: 'pw3-1exp',
    name: '1 Powerwall 3 + 1 Expansion Pack',
    capacity: 27,
    power: 11.5,
    price: 20100,
    backupHours: { essentials: 48, partial: 24, whole: 12 },
  },
  {
    id: 'pw3-2exp',
    name: '1 Powerwall 3 + 2 Expansion Packs',
    capacity: 40.5,
    power: 11.5,
    price: 26100,
    backupHours: { essentials: 72, partial: 36, whole: 18 },
  },
  {
    id: 'pw3-3exp',
    name: '1 Powerwall 3 + 3 Expansion Packs',
    capacity: 54,
    power: 11.5,
    price: 32500,
    backupHours: { essentials: 96, partial: 48, whole: 24 },
  },
];

const paymentOptions = [
  { id: 'cash', label: 'Cash' },
  { id: 'lease', label: 'Lease' },
  { id: 'finance', label: 'Finance' },
];

export default function QuotePage() {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [hasSolar, setHasSolar] = useState<boolean | null>(null);
  const [selectedConfig, setSelectedConfig] = useState(batteryOptions[0]);
  const [paymentType, setPaymentType] = useState('cash');
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  // Calculate prices
  const federalTaxCredit = selectedConfig.price * 0.3;
  const netPrice = selectedConfig.price - federalTaxCredit;

  const canProceedToQuote = address.length > 5 && hasSolar !== null;

  const handleGetQuote = () => {
    if (canProceedToQuote) {
      setStep(2);
    }
  };

  const handleContactSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: contactInfo.email,
          firstName: contactInfo.firstName,
          lastName: contactInfo.lastName,
          phone: contactInfo.phone,
          address: { street: address },
          hasSolar,
          configuration: {
            name: selectedConfig.name,
            capacity: selectedConfig.capacity,
            power: selectedConfig.power,
          },
          pricing: {
            subtotal: selectedConfig.price,
            federalTaxCredit,
            netCost: netPrice,
          },
        }),
      });
      
      if (response.ok) {
        setStep(4); // Success step
      }
    } catch (error) {
      console.error('Error submitting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Zap className="w-4 h-4 text-volt-400" />
            </div>
            <span className="text-xl font-display font-bold">ampra</span>
          </Link>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            Exit
          </Link>
        </div>
      </header>

      {/* Step 1: Address Input */}
      {step === 1 && (
        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Get your quote
            </h1>
            <p className="text-slate-600">
              Enter your address to see pricing for your home
            </p>
          </div>

          <div className="space-y-6">
            {/* Address Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Home Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ampra-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Solar Question */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Do you have solar panels?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setHasSolar(true)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 transition-all',
                    hasSolar === true
                      ? 'border-ampra-500 bg-ampra-50 text-ampra-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  )}
                >
                  <Sun className="w-5 h-5" />
                  Yes
                </button>
                <button
                  onClick={() => setHasSolar(false)}
                  className={cn(
                    'flex items-center justify-center gap-2 py-4 px-6 rounded-xl border-2 transition-all',
                    hasSolar === false
                      ? 'border-ampra-500 bg-ampra-50 text-ampra-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  )}
                >
                  <Home className="w-5 h-5" />
                  No
                </button>
              </div>
            </div>

            {/* Continue Button */}
            <Button
              size="lg"
              className="w-full mt-8"
              onClick={handleGetQuote}
              disabled={!canProceedToQuote}
            >
              See My Quote
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </main>
      )}

      {/* Step 2: Quote Builder (Tesla-style) */}
      {step === 2 && (
        <main className="max-w-4xl mx-auto px-4 py-12">
          <button
            onClick={() => setStep(1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-2">
              Powerwall 3
            </h1>
            <p className="text-slate-600 max-w-lg mx-auto">
              Powerwall 3 stores energy from solar or the grid to optimize home backup and savings. 
              Expansion Packs extend your backup protection without the cost of additional equipment.
            </p>
            <p className="text-sm text-slate-500 mt-2 underline">{address}</p>
          </div>

          {/* Payment Type Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex border-b border-slate-200">
              {paymentOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setPaymentType(option.id)}
                  className={cn(
                    'px-8 py-3 text-sm font-medium transition-colors relative',
                    paymentType === option.id
                      ? 'text-slate-900'
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {option.label}
                  {paymentType === option.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Configuration Options */}
          <div className="space-y-3 max-w-xl mx-auto">
            {batteryOptions.slice(0, showMore ? undefined : 3).map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedConfig(option)}
                className={cn(
                  'w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all text-left',
                  selectedConfig.id === option.id
                    ? 'border-slate-900 bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300'
                )}
              >
                <div>
                  <p className="font-semibold text-slate-900">{option.name}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {option.capacity} kWh • Up to {option.backupHours.partial} hrs backup
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(option.price)}
                  </p>
                  {paymentType === 'finance' && (
                    <p className="text-sm text-slate-500">
                      ${Math.round((option.price * 0.7) / 120)}/mo
                    </p>
                  )}
                </div>
              </button>
            ))}

            {!showMore && batteryOptions.length > 3 && (
              <button
                onClick={() => setShowMore(true)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 py-3"
              >
                <span className="text-lg">+</span>
                See More
              </button>
            )}
          </div>

          {/* Backup Time Indicator */}
          <div className="mt-10 max-w-xl mx-auto">
            <div className="bg-slate-100 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-volt-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Estimated Backup Time</p>
                  <p className="text-2xl font-display font-bold text-slate-900">
                    {selectedConfig.backupHours.partial} hours
                  </p>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Based on average home usage. Actual backup time varies based on your energy consumption.
              </p>
            </div>
          </div>

          {/* Bottom Price Bar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-display font-bold text-slate-900">
                    {formatCurrency(selectedConfig.price)}
                  </p>
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">
                  {formatCurrency(netPrice)} after tax credit
                </p>
              </div>
              <Button size="lg" onClick={() => setStep(3)}>
                Order Now
              </Button>
            </div>
          </div>

          {/* Spacer for fixed bottom bar */}
          <div className="h-32" />
        </main>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <main className="max-w-xl mx-auto px-4 py-12">
          <button
            onClick={() => setStep(2)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
              Complete Your Order
            </h1>
            <p className="text-slate-600">
              Enter your contact information to reserve your {selectedConfig.name}
            </p>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 rounded-2xl p-6 mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-semibold text-slate-900">{selectedConfig.name}</p>
                <p className="text-sm text-slate-500">{selectedConfig.capacity} kWh capacity</p>
              </div>
              <p className="font-semibold text-slate-900">{formatCurrency(selectedConfig.price)}</p>
            </div>
            <div className="border-t border-slate-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Federal Tax Credit (30%)</span>
                <span className="text-volt-600">-{formatCurrency(federalTaxCredit)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-900">Net Price</span>
                <span className="text-slate-900">{formatCurrency(netPrice)}</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name
                </label>
                <Input
                  value={contactInfo.firstName}
                  onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <Input
                  value={contactInfo.lastName}
                  onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                  placeholder="Smith"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <Input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                placeholder="(555) 555-5555"
              />
            </div>

            <div className="pt-4">
              <p className="text-sm text-slate-500 mb-4">
                By clicking &quot;Place Order&quot;, you agree to be contacted about your Powerwall installation.
                A $500 refundable deposit will be collected to reserve your installation slot.
              </p>
              <Button
                size="lg"
                className="w-full"
                onClick={handleContactSubmit}
                disabled={!contactInfo.email || !contactInfo.firstName || !contactInfo.phone || isSubmitting}
                isLoading={isSubmitting}
              >
                Place Order - $500 Deposit
              </Button>
            </div>
          </div>
        </main>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-volt-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-volt-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mb-4">
            Order Received!
          </h1>
          <p className="text-slate-600 mb-8">
            Thank you for your order! We&apos;ll be in touch within 24 hours to schedule your 
            site assessment and confirm your installation date.
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 text-left mb-8">
            <h3 className="font-semibold text-slate-900 mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">System</span>
                <span className="text-slate-900">{selectedConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Address</span>
                <span className="text-slate-900">{address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total (after tax credit)</span>
                <span className="font-semibold text-slate-900">{formatCurrency(netPrice)}</span>
              </div>
            </div>
          </div>
          <Link href="/">
            <Button variant="secondary">Return Home</Button>
          </Link>
        </main>
      )}
    </div>
  );
}
