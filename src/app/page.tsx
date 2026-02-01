import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/Button';
import { 
  Check,
  ArrowRight,
  Star,
  ChevronDown,
  Play,
  Shield,
  Zap,
  Clock,
  Phone,
} from 'lucide-react';

const pressLogos = [
  { name: 'TechCrunch', opacity: 0.6 },
  { name: 'Forbes', opacity: 0.6 },
  { name: 'Bloomberg', opacity: 0.6 },
  { name: 'CNBC', opacity: 0.6 },
];

const testimonials = [
  {
    name: 'Sarah M.',
    location: 'San Diego, CA',
    text: 'During the PSPS shutoffs, we were the only house on our block with power. I didn\'t even realize the grid went down.',
    image: '/testimonials/sarah.jpg',
  },
  {
    name: 'James K.',
    location: 'Los Angeles, CA', 
    text: 'The whole process took 3 weeks from quote to activation. No hassle, no surprises. Just reliable backup power.',
    image: '/testimonials/james.jpg',
  },
  {
    name: 'Maria G.',
    location: 'San Jose, CA',
    text: 'Combined with our solar panels, we\'re producing more energy than we use. Our electricity bill is basically zero.',
    image: '/testimonials/maria.jpg',
  },
];

const faqs = [
  {
    question: 'How long will a Powerwall power my home?',
    answer: 'A single Powerwall 3 has 13.5 kWh of capacity, typically providing 12-24 hours of backup for essential loads. For whole-home backup including AC, we recommend adding extension packs for 27-40.5 kWh total capacity.',
  },
  {
    question: 'Do I need solar panels?',
    answer: 'No! While batteries pair great with solar, they work standalone too. Charge from the grid during cheap off-peak hours and use stored energy during expensive peak times.',
  },
  {
    question: 'What\'s the federal tax credit?',
    answer: 'The federal Investment Tax Credit (ITC) provides a 30% tax credit on the total installed cost. On a $20,000 system, that\'s $6,000 back on your taxes.',
  },
  {
    question: 'How long does installation take?',
    answer: 'Most installations complete in a single day. The full process from quote to activation typically takes 3-6 weeks, depending on local permitting.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section - Dark, dramatic, Base-style */}
      <section className="relative min-h-screen flex items-center bg-slate-950 overflow-hidden">
        {/* Background image overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-950/80" />
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920")',
            backgroundSize: 'cover',
            backgroundPosition: 'center right',
          }}
        />
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5 bg-grid-pattern" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="max-w-3xl">
            {/* Star rating */}
            <div className="flex items-center gap-2 mb-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/80 text-sm font-medium">4.9 stars from 500+ homeowners</span>
            </div>
            
            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.05] tracking-tight">
              Keep your lights on
              <span className="block text-volt-400">when theirs go out</span>
            </h1>
            
            <p className="mt-8 text-xl text-slate-300 max-w-2xl leading-relaxed">
              Whole-home battery backup, professionally installed. Protection from blackouts, 
              lower energy bills, and the 30% federal tax credit—all in one.
            </p>
            
            {/* CTA buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/quote">
                <Button size="lg" className="w-full sm:w-auto text-base px-8">
                  Get Your Free Quote
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="tel:1-888-555-0123">
                <Button size="lg" variant="ghost" className="w-full sm:w-auto text-white hover:bg-white/10 text-base">
                  <Phone className="w-5 h-5" />
                  (888) 555-0123
                </Button>
              </Link>
            </div>
            
            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-volt-400" />
                Tesla Certified Installer
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-volt-400" />
                Licensed & Insured
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-volt-400" />
                10-Year Warranty
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/50 to-transparent" />
        </div>
      </section>
      
      {/* Press logos */}
      <section className="py-8 bg-slate-100 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-12 opacity-60">
            <span className="text-sm text-slate-500 uppercase tracking-wider">As seen in</span>
            {pressLogos.map((logo) => (
              <span key={logo.name} className="text-xl font-display font-bold text-slate-400">
                {logo.name}
              </span>
            ))}
          </div>
        </div>
      </section>
      
      {/* Value Props - Clean, spacious */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
              Backup power made simple
            </h2>
            <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
              Professional installation, instant backup, and savings that add up.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-volt-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">
                Automatic protection
              </h3>
              <p className="text-slate-500 leading-relaxed">
                When the grid goes down, your battery kicks in instantly. 
                You might not even notice there&apos;s an outage.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-volt-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">
                Lower your bills
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Store energy when it&apos;s cheap, use it when rates are high. 
                Most homeowners save $50-150 per month.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-volt-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-slate-900 mb-3">
                Installed in one day
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Our certified crew handles everything. Most installations 
                are done in a single day with minimal disruption.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Pricing - Simple, prominent */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
                Simple, transparent pricing
              </h2>
              <p className="mt-6 text-xl text-slate-500">
                What would cost $25,000+ elsewhere starts at $8,750 after tax credits.
              </p>
            </div>
            
            {/* Main pricing card */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="inline-block px-3 py-1 bg-volt-100 text-volt-700 text-sm font-semibold rounded-full mb-4">
                      Most Popular
                    </span>
                    <h3 className="text-2xl font-display font-bold text-slate-900">
                      Home Backup System
                    </h3>
                    <p className="text-slate-500 mt-1">Powerwall 3 + Extension Pack</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 line-through">$20,500</p>
                    <p className="text-4xl font-display font-bold text-slate-900">$14,350</p>
                    <p className="text-sm text-volt-600 font-medium">after 30% tax credit</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    '27 kWh total storage',
                    '24-48 hours backup',
                    'Whole home coverage',
                    'Professional installation',
                    '10-year warranty',
                    '24/7 monitoring app',
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-volt-500 flex-shrink-0" />
                      <span className="text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Link href="/quote">
                  <Button size="lg" className="w-full text-base">
                    Get Your Custom Quote
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="bg-slate-50 px-8 lg:px-12 py-6 border-t border-slate-200">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                  <span>Need more or less? We customize every system.</span>
                  <Link href="/quote" className="text-ampra-600 font-medium hover:underline">
                    See all options →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials - Large, featured */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              California homeowners love Ampra
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="bg-slate-800/50 backdrop-blur rounded-2xl p-8 border border-slate-700/50"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  &quot;{testimonial.text}&quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-white font-semibold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-400">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works - Minimal */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
              From quote to power in 3 weeks
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Get your quote', desc: 'Answer a few questions online. We\'ll design a system for your home.' },
              { step: '02', title: 'We handle the rest', desc: 'Permits, paperwork, scheduling—our team takes care of everything.' },
              { step: '03', title: 'Enjoy backup power', desc: 'Installation takes one day. Monitor everything from your phone.' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span className="text-6xl font-display font-bold text-slate-200">{item.step}</span>
                <h3 className="text-xl font-display font-semibold text-slate-900 mt-4 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link href="/quote">
              <Button size="lg" className="text-base">
                Start Your Quote
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section id="faq" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900">
              Questions? We&apos;ve got answers.
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-slate-900 pr-4 text-lg">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-slate-600 leading-relaxed">{faq.answer}</div>
              </details>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-slate-500">
              Still have questions?{' '}
              <Link href="tel:1-888-555-0123" className="text-ampra-600 font-medium hover:underline">
                Call us at (888) 555-0123
              </Link>
            </p>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
            Ready to stop worrying about power outages?
          </h2>
          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto">
            Join thousands of California homeowners who&apos;ve made the switch to reliable backup power.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="text-base px-8">
                Get Your Free Quote
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="tel:1-888-555-0123">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 text-base">
                <Phone className="w-5 h-5" />
                (888) 555-0123
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
}
