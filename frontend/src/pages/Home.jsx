import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Wallet,
  ArrowRight,
  Target,
  BarChart3,
  ShieldCheck,
  Receipt,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  PieChart,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  Lock,
  ChevronDown,
  Star,
  Users,
  Check,
  Globe,
  Award,
  Zap,
  Coffee,
  Car,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Logo from '../components/common/Logo';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterDone, setNewsletterDone] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactName('');
      setContactEmail('');
      setContactSubject('');
      setContactMessage('');
    }, 2500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterDone(true);
    setNewsletterEmail('');
  };

  const whyChooseCards = [
    {
      icon: Receipt,
      title: 'Track Expenses',
      desc: 'Record daily expenses effortlessly with real-time categorization and 1-tap quick adds.',
      badge: 'Frictionless',
    },
    {
      icon: Target,
      title: 'Set Budgets',
      desc: 'Plan and control your spending with automated threshold warnings at 75%, 90%, and 100%.',
      badge: 'Smart Caps',
    },
    {
      icon: BarChart3,
      title: 'Smart Reports',
      desc: 'Get detailed insights with visual charts, money flow analytics, and monthly trends.',
      badge: 'Deep Analytics',
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      desc: 'Bank-grade encryption, zero tracking ads, and strict user isolation for complete peace of mind.',
      badge: 'Bank-Grade',
    },
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '0',
      period: 'free forever',
      badge: 'Getting Started',
      popular: false,
      desc: 'Ideal for students and individuals starting their financial journey.',
      features: [
        'Unlimited daily income & expense tracking',
        '2 Accounts (Bank + Cash Wallet)',
        'Monthly category budget caps',
        '1-Tap quick expense presets (Coffee, Snacks)',
        'Excel & CSV export support',
        'Bank-grade SSL data encryption',
      ],
      cta: 'Get Started Free',
      ctaLink: '/register',
    },
    {
      name: 'Pro Saver',
      price: '199',
      period: 'per month',
      badge: 'Most Popular',
      popular: true,
      desc: 'For professionals and families who want total wealth control.',
      features: [
        'Everything in Starter Plan',
        'Unlimited accounts (Bank, UPI, Credit Cards, Wallets)',
        'Trips & Vacation budgets (Goa, Manali, etc.)',
        'Recurring bill reminders & alert notifications',
        'Savings goals with milestone celebration confetti',
        'Printable tax-ready PDF statement reports',
        'Priority email & live chat support',
      ],
      cta: 'Start 14-Day Free Trial',
      ctaLink: '/register',
    },
    {
      name: 'Family & Enterprise',
      price: '499',
      period: 'per month',
      badge: 'Maximum Power',
      popular: false,
      desc: 'For business owners, freelancers, and shared household budgets.',
      features: [
        'Everything in Pro Saver',
        'Multi-currency ledger (USD, EUR, GBP, AED, INR)',
        'Loans & Peer Lending (Hisab-Kitab tracker)',
        'Unlimited receipt photo & invoice uploads',
        'Custom category tags & tax deductions organizer',
        'Full account JSON & CSV cloud backup',
        'Dedicated 24/7 financial support',
      ],
      cta: 'Contact Sales',
      ctaLink: '#contact',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#160408] text-[#24050D] dark:text-[#FFFDF9] transition-colors duration-200">
      {/* 1. Header (Navbar) */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF]/95 dark:bg-[#1A0408]/95 backdrop-blur-md border-b border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo with explicit SVG */}
          <Logo size="md" />

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-[#4A3528] dark:text-[#D4C5B5]">
            <a href="#home" className="text-[#801E35] dark:text-[#FFFDF9] hover:text-[#C25A70] transition-colors">
              Home
            </a>
            <a href="#features" className="hover:text-[#801E35] dark:hover:text-[#E09CA9] transition-colors">
              Features
            </a>
            <a href="#pricing" className="hover:text-[#801E35] dark:hover:text-[#E09CA9] transition-colors">
              Pricing
            </a>
            <a href="#about" className="hover:text-[#801E35] dark:hover:text-[#E09CA9] transition-colors">
              About
            </a>
            <a href="#contact" className="hover:text-[#801E35] dark:hover:text-[#E09CA9] transition-colors">
              Contact
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-[#DCCEBD] dark:border-[#520B1C] bg-[#FAF7F2] dark:bg-[#260810] text-[#2D0B14] dark:text-[#FAF7F2] hover:bg-[#F6F1EA] dark:hover:bg-[#380C16] transition-colors shadow-sm"
              title="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F5D7DE]" />
              ) : (
                <Moon className="w-4 h-4 text-[#801E35]" />
              )}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="btn-burgundy px-5 py-2.5 rounded-xl font-bold text-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-nav-login px-5 py-2 rounded-xl text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-burgundy px-6 py-2.5 rounded-xl text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[#DCCEBD] dark:border-[#520B1C] bg-[#FAF7F2] dark:bg-[#260810] text-[#2D0B14] dark:text-[#FAF7F2] shadow-sm active:scale-95 transition-transform"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-[#F5D7DE]" /> : <Moon className="w-4 h-4 text-[#801E35]" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#DCCEBD] dark:border-[#520B1C] bg-[#FAF7F2] dark:bg-[#260810] text-[#2D0B14] dark:text-[#FAF7F2] shadow-sm active:scale-95 transition-transform"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-[#EAE0D3] dark:border-[#3F0E1B] bg-white dark:bg-[#1A0408] px-4 py-4 space-y-3">
            <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-bold text-[#801E35] dark:text-[#FFFDF9]">Home</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-bold text-[#4A3528] dark:text-[#D4C5B5]">Features</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-bold text-[#4A3528] dark:text-[#D4C5B5]">Pricing</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-bold text-[#4A3528] dark:text-[#D4C5B5]">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-1.5 text-sm font-bold text-[#4A3528] dark:text-[#D4C5B5]">Contact</a>
            <div className="pt-3 border-t border-[#EAE0D3] dark:border-[#3F0E1B] flex flex-col gap-2">
              <Link to="/login" className="btn-nav-login w-full py-2.5 rounded-xl text-center text-sm">Login</Link>
              <Link to="/register" className="btn-burgundy w-full py-2.5 rounded-xl text-center text-sm">Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section (#home) */}
      <section id="home" className="py-14 sm:py-20 lg:py-28 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* Left Column Content */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAECF0] dark:bg-[#250810] border border-[#F5D7DE] dark:border-[#520B1C] text-[#801E35] dark:text-[#E09CA9] text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#C25A70]" />
                <span>Smart Personal Expense & Wealth Management</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#24050D] dark:text-[#FFFDF9] leading-[1.14]">
                Manage Your <br />
                <span className="text-[#801E35] dark:text-[#E09CA9]">Income & Expenses</span> <br />
                Smartly
              </h1>

              <p className="text-base sm:text-lg text-[#4A3528] dark:text-[#D4C5B5] max-w-lg font-medium leading-relaxed">
                Track expenses, plan budgets, analyze spending and take control of your finances with our simple and secure system.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
                <Link
                  to="/register"
                  className="btn-burgundy px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-black text-sm sm:text-base group text-center"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform inline" />
                </Link>

                <a
                  href="#features"
                  className="btn-sand px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl font-bold text-sm sm:text-base shadow-sm text-center"
                >
                  Learn More
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Forever Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#801E35] dark:text-[#E09CA9]" />
                  <span>Bank-Grade 256-bit Security</span>
                </div>
              </div>
            </div>

            {/* Right Column: Realistic Live Dashboard Mockup */}
            <div className="relative w-full max-w-lg mx-auto">
              <div className="relative rounded-3xl p-4 sm:p-7 bg-[#FFFFFF] dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] shadow-2xl">
                {/* Mockup Title Bar */}
                <div className="rounded-2xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#EAE0D3] dark:border-[#3F0E1B] p-4 sm:p-5 shadow-sm space-y-4">
                  {/* Mockup Title Bar */}
                  <div className="flex items-center pb-3 border-b border-[#EAE0D3] dark:border-[#3F0E1B]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#E09CA9]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#DCCEBD]"></div>
                      <div className="w-3 h-3 rounded-full bg-[#801E35]"></div>
                    </div>
                  </div>

                  {/* Stat tiles inside preview */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                    <div className="p-3 sm:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm">
                      <span className="text-[10px] font-bold text-[#614D3C] dark:text-[#B59D85] uppercase tracking-wider">
                        Income
                      </span>
                      <div className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-baseline">
                        <span className="text-sm mr-1 font-bold">₹</span>50,000
                      </div>
                    </div>
                    <div className="p-3 sm:p-3.5 rounded-xl bg-[#FFFFFF] dark:bg-[#250810] border border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm">
                      <span className="text-[10px] font-bold text-[#614D3C] dark:text-[#B59D85] uppercase tracking-wider">
                        Expenses
                      </span>
                      <div className="text-lg sm:text-xl font-black text-[#C25A70] dark:text-[#E09CA9] mt-0.5 flex items-baseline">
                        <span className="text-sm mr-1 font-bold">₹</span>32,400
                      </div>
                    </div>
                  </div>

                  {/* Monthly Budget Usage Bar */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">
                      <span>Monthly Budget Usage</span>
                      <span className="text-[#801E35] dark:text-[#E09CA9] font-black">81%</span>
                    </div>
                    <div className="w-full bg-[#EAE0D3] dark:bg-[#250810] rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#801E35] to-[#C25A70] h-full rounded-full"
                        style={{ width: '81%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Balance Strip */}
                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5] border-t border-[#EAE0D3] dark:border-[#3F0E1B]">
                    <span className="flex items-baseline">
                      <span>Balance:&nbsp;</span>
                      <strong className="text-[#24050D] dark:text-[#FFFDF9] font-black inline-flex items-baseline">
                        <span className="text-xs mr-0.5 font-bold">₹</span>17,600
                      </strong>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold">
                      ● Active
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section (#features) */}
      <section id="features" className="py-20 sm:py-28 bg-[#FFFFFF] dark:bg-[#1E050B] border-t border-[#EAE0D3] dark:border-[#3F0E1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C25A70] dark:text-[#E09CA9]">
              Why Choose ExpenseManager?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#24050D] dark:text-[#FFFDF9] tracking-tight">
              Simple, Powerful & Transparent Wealth Tracking
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#4A3528] dark:text-[#D4C5B5] leading-relaxed">
              Designed around daily Indian financial realities: UPI, bank transfers, cash pockets, bill deadlines, and trip budgeting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF7F2] dark:bg-[#250810] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 text-left space-y-4 shadow-sm hover:shadow-md hover:border-[#801E35] dark:hover:border-[#E09CA9] transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#801E35] text-white flex items-center justify-center shadow-md shadow-[#801E35]/25">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-[#FAECF0] text-[#801E35] dark:bg-[#380C16] dark:text-[#F5D7DE]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-black text-lg text-[#24050D] dark:text-[#FFFDF9]">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#4A3528] dark:text-[#D4C5B5] font-semibold leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Pricing Section (#pricing) */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#FAF7F2] dark:bg-[#160408] border-t border-[#EAE0D3] dark:border-[#3F0E1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C25A70] dark:text-[#E09CA9]">
              Clear & Honest Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#24050D] dark:text-[#FFFDF9] tracking-tight">
              Start 100% Free, Scale With Your Wealth
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#4A3528] dark:text-[#D4C5B5] leading-relaxed">
              No hidden fees, no credit card needed for signup, cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200 relative ${
                  plan.popular
                    ? 'bg-[#FFFFFF] dark:bg-[#250810] border-2 border-[#801E35] shadow-xl md:scale-105 z-10'
                    : 'bg-[#FFFFFF] dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#801E35] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-xl text-[#24050D] dark:text-[#FFFDF9]">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F6F1EA] dark:bg-[#380C16] text-[#4A3528] dark:text-[#D4C5B5]">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#614D3C] dark:text-[#B59D85] min-h-[32px] font-medium">{plan.desc}</p>

                  <div className="pt-2 flex items-baseline">
                    <span className="text-2xl sm:text-3xl font-black text-[#801E35] dark:text-[#E09CA9] mr-1.5 font-sans">
                      ₹
                    </span>
                    <span className="text-3xl sm:text-4xl font-black text-[#24050D] dark:text-[#FFFDF9]">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-[#614D3C] dark:text-[#B59D85] ml-2">
                      / {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-4 border-t border-[#EAE0D3] dark:border-[#3F0E1B] space-y-2.5 text-xs font-semibold text-[#380C16] dark:text-[#FAF7F2]">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  {plan.ctaLink.startsWith('#') ? (
                    <a
                      href={plan.ctaLink}
                      className="btn-sand w-full py-3.5 rounded-2xl text-center text-sm"
                    >
                      {plan.cta}
                    </a>
                  ) : (
                    <Link
                      to={plan.ctaLink}
                      className={`w-full py-3.5 rounded-2xl text-center text-sm ${
                        plan.popular
                          ? 'btn-burgundy'
                          : 'btn-sand'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. About Us Section (#about) */}
      <section id="about" className="py-20 sm:py-28 bg-[#FFFFFF] dark:bg-[#1E050B] border-t border-[#EAE0D3] dark:border-[#3F0E1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Story Content */}
            <div className="space-y-6 text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C25A70] dark:text-[#E09CA9]">
                About ExpenseManager
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#24050D] dark:text-[#FFFDF9] leading-tight">
                Designed For Peace of Mind, Not Spreadsheet Complexity
              </h2>
              <p className="text-sm sm:text-base text-[#4A3528] dark:text-[#D4C5B5] leading-relaxed font-medium">
                We started ExpenseManager with a single premise: most people lose track of their savings not from huge purchases, but from hundreds of untracked daily micro-expenses like coffee, food deliveries, and forgotten subscriptions.
              </p>
              <p className="text-sm sm:text-base text-[#4A3528] dark:text-[#D4C5B5] leading-relaxed font-medium">
                Unlike traditional banking apps or ad-supported trackers that sell your financial habits to third-party lenders, ExpenseManager guarantees complete user isolation and bank-grade data privacy.
              </p>

              <div className="space-y-3 pt-2 text-xs sm:text-sm font-bold text-[#380C16] dark:text-[#FAF7F2]">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Strict IDOR Protection: Your financial ledger is strictly isolated.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Zero Advertisements, zero third-party data tracking.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>Real-time Multi-account sync with MongoDB Atlas Cloud.</span>
                </div>
              </div>
            </div>

            {/* Right Metric Cards */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] dark:bg-[#250810] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-1.5 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#801E35] dark:text-[#E09CA9] flex items-baseline">
                  <span className="text-lg sm:text-2xl mr-1 font-bold font-sans">₹</span>
                  <span>15+ Cr</span>
                </div>
                <p className="text-[11px] sm:text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">Expenses Tracked Safely</p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] dark:bg-[#250810] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-1.5 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#C25A70]">50,000+</div>
                <p className="text-[11px] sm:text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">Active Smart Savers</p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] dark:bg-[#250810] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-1.5 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#614D3C] dark:text-[#D4C5B5]">99.9%</div>
                <p className="text-[11px] sm:text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">Cloud Sync & Reliability</p>
              </div>

              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#FAF7F2] dark:bg-[#250810] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-1.5 sm:space-y-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600">4.9 / 5</div>
                <p className="text-[11px] sm:text-xs font-bold text-[#4A3528] dark:text-[#D4C5B5]">Verified User Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Contact Us Section (#contact) */}
      <section id="contact" className="py-20 sm:py-28 bg-[#FAF7F2] dark:bg-[#160408] border-t border-[#EAE0D3] dark:border-[#3F0E1B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C25A70] dark:text-[#E09CA9]">
              Get In Touch
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#24050D] dark:text-[#FFFDF9] tracking-tight">
              We're Here to Help You Succeed
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-[#4A3528] dark:text-[#D4C5B5] leading-relaxed">
              Have feedback, questions about pro features, or need support with your account? Reach out directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Contact Channels (Left) */}
            <div className="space-y-6 text-left">
              <div className="p-6 rounded-3xl bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAECF0] dark:bg-[#380C16] text-[#801E35] dark:text-[#FFFDF9] flex items-center justify-center font-bold">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#24050D] dark:text-[#FFFDF9]">Email Support</h4>
                    <p className="text-xs text-[#614D3C] dark:text-[#B59D85]">support@expensemanager.com</p>
                  </div>
                </div>
                <p className="text-xs text-[#4A3528] dark:text-[#D4C5B5]">
                  We reply to all inquiries within 2 hours during active business hours.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FAECF0] dark:bg-[#380C16] text-[#C25A70] dark:text-[#E09CA9] flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#24050D] dark:text-[#FFFDF9]">Operating Hours</h4>
                    <p className="text-xs text-[#614D3C] dark:text-[#B59D85]">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
                <p className="text-xs text-[#4A3528] dark:text-[#D4C5B5]">
                  Emergency automated system monitoring active 24/7/365.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F6F1EA] dark:bg-[#380C16] text-[#4A3528] dark:text-[#D4C5B5] flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#24050D] dark:text-[#FFFDF9]">Headquarters</h4>
                    <p className="text-xs text-[#614D3C] dark:text-[#B59D85]">Naka Bypass, Ayodhya 224001</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form (Right) */}
            <div className="bg-white dark:bg-[#20050B] border-2 border-[#EAE0D3] dark:border-[#3F0E1B] rounded-3xl p-6 sm:p-8 shadow-sm">
              {contactSubmitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-black text-[#24050D] dark:text-[#FFFDF9]">Thank You!</h4>
                  <p className="text-xs text-[#4A3528] dark:text-[#D4C5B5] max-w-xs mx-auto">
                    Your message has been received. Our team will contact you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Vikas Maurya"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="vikas@example.com"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Feature inquiry or Feedback"
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-1">
                      Message
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you?"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#801E35] text-[#24050D] dark:text-[#FFFDF9] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn-burgundy w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#801E35]/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comprehensive Mega Footer */}
      <footer className="border-t-2 border-[#EAE0D3] dark:border-[#3F0E1B] bg-white dark:bg-[#140306] text-[#4A3528] dark:text-[#D4C5B5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8 sm:pt-10 sm:pb-5">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-3.5 text-left">
              <Logo size="md" />

              <p className="text-xs text-[#614D3C] dark:text-[#B59D85] max-w-sm leading-relaxed font-medium">
                Smart MERN personal finance web application with multi-account ledgers, category threshold budgets, recurring bills, savings goals, and CSV/PDF export.
              </p>

              {/* Newsletter subscribe */}
              <div className="pt-1 max-w-sm">
                <p className="text-[11px] font-black text-[#24050D] dark:text-[#FFFDF9] uppercase tracking-wider mb-2">
                  Weekly Wealth & Savings Tips
                </p>
                {newsletterDone ? (
                  <p className="text-xs font-bold text-emerald-600">✓ Subscribed successfully!</p>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] dark:bg-[#160408] border border-[#DCCEBD] dark:border-[#520B1C] text-xs font-semibold text-[#24050D] dark:text-[#FFFDF9] focus:outline-none focus:ring-2 focus:ring-[#801E35]"
                    />
                    <button
                      type="submit"
                      className="btn-burgundy px-4 py-2.5 rounded-xl text-xs shrink-0 active:scale-95 transition-transform"
                    >
                      Subscribe
                    </button>
                  </form>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <span>System 100% Operational • 256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Links Columns: 2 cols on mobile, 3 cols on sm/tablet, 3 cols on desktop */}
            <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
              {/* Product Links */}
              <div className="space-y-2.5 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#24050D] dark:text-[#FFFDF9]">
                  Product
                </h4>
                <ul className="space-y-2 text-xs font-bold">
                  <li><Link to="/dashboard" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Dashboard</Link></li>
                  <li><Link to="/transactions" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Transactions</Link></li>
                  <li><Link to="/budgets" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Budgets</Link></li>
                  <li><Link to="/categories" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Categories</Link></li>
                  <li><Link to="/reports" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Reports & Analytics</Link></li>
                  <li><Link to="/goals" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Savings Goals</Link></li>
                </ul>
              </div>

              {/* Company Links */}
              <div className="space-y-2.5 text-left">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#24050D] dark:text-[#FFFDF9]">
                  Company
                </h4>
                <ul className="space-y-2 text-xs font-bold">
                  <li><a href="#about" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">About Us</a></li>
                  <li><a href="#pricing" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Pricing Plans</a></li>
                  <li><a href="#features" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Why ExpenseManager</a></li>
                  <li><a href="#contact" className="hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Contact Support</a></li>
                  <li><Link to="/register" className="text-[#801E35] dark:text-[#E09CA9] hover:underline font-extrabold">Sign Up Free</Link></li>
                </ul>
              </div>

              {/* Legal & Security Links */}
              <div className="col-span-2 sm:col-span-1 space-y-2.5 text-left pt-2 sm:pt-0">
                <h4 className="text-xs font-black uppercase tracking-wider text-[#24050D] dark:text-[#FFFDF9]">
                  Security & Legal
                </h4>
                <ul className="space-y-2 text-xs font-bold">
                  <li><span className="cursor-pointer hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Privacy Policy</span></li>
                  <li><span className="cursor-pointer hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Terms of Service</span></li>
                  <li><span className="cursor-pointer hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">IDOR Protection</span></li>
                  <li><span className="cursor-pointer hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Cookie Preferences</span></li>
                  <li><span className="cursor-pointer hover:text-[#801E35] dark:hover:text-[#FFFDF9] transition-colors">Security Audit</span></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-[#EAE0D3] dark:border-[#3F0E1B] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs font-bold text-[#614D3C] dark:text-[#B59D85]">
            <div>
              © 2026 ExpenseManager. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Safe & Secure Expense Management</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
