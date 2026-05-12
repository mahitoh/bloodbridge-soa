import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import SocialLinks from '../components/layout/SocialLinks'
import {
  Droplets,
  Shield,
  MapPin,
  Heart,
  Search,
  Bell,
  Zap,
  CheckCircle,
  Mail,
  Phone,
  Menu,
  X,
} from 'lucide-react'


const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 supports-[backdrop-filter]:bg-white/70">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center">
              <Droplets className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">BloodBridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#how-it-works" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">How it Works</a>
            <a href="#features" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Features</a>
            <a href="#impact" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Impact</a>
            <Link to="/login" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Login</Link>
            <Link to="/register" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
              <Button className="shadow-md shadow-red-100">Get Started</Button>
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="landing-mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div
            id="landing-mobile-nav"
            className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 font-medium text-gray-700"
          >
            <a href="#how-it-works" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              How it Works
            </a>
            <a href="#features" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              Features
            </a>
            <a href="#impact" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              Impact
            </a>
            <Link to="/login" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              Login
            </Link>
            <Link to="/register" className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              <Button className="w-full shadow-md shadow-red-100">Get Started</Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-12 sm:py-16 md:py-28 max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        <div className="space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-primary-red rounded-full text-xs sm:text-sm font-bold border border-red-100">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 motion-safe:animate-ping motion-reduce:animate-none" aria-hidden />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" aria-hidden />
            </span>
            Real-time Blood Donation Network
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] sm:leading-tight">
            Every Drop <br />
            <span className="text-primary-red">Saves a Life.</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            BloodBridge connects hospitals with donors nearby. When a need is posted, matching donors get notified fast—so help can arrive when it counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link to="/login" className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
              <Button className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-2xl shadow-xl shadow-red-200">
                Explore Demo
              </Button>
            </Link>
            <Link to="/register?role=donor" className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
              <Button variant="outline" className="w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-5 sm:py-6 rounded-2xl">
                Register Now
              </Button>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4 text-sm text-gray-500">
            <div className="flex -space-x-2" aria-hidden>
              {[
                'from-rose-400 to-red-500',
                'from-amber-300 to-orange-500',
                'from-sky-400 to-blue-600',
                'from-emerald-400 to-teal-600',
              ].map((gradient, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br ${gradient} shadow-sm`}
                />
              ))}
            </div>
            <p><span className="text-gray-900 font-bold">1,240+</span> donors joined this month</p>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-light rounded-full blur-3xl opacity-30 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:group-hover:opacity-50 motion-reduce:group-hover:opacity-30" aria-hidden />
          <div className="absolute -bottom-12 -right-12 w-80 h-80 bg-red-100 rounded-full blur-3xl opacity-30 motion-safe:transition-opacity motion-safe:duration-500 motion-safe:group-hover:opacity-50 motion-reduce:group-hover:opacity-30" aria-hidden />
          <img 
            src="/donation_hero_premium_1778503945880.png" 
            alt="Blood Donation Community" 
            width={1200}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(220,38,38,0.15)] relative z-10 w-full object-cover aspect-[4/3] motion-safe:md:hover:scale-[1.02] motion-safe:transition-transform motion-safe:duration-500 motion-reduce:transition-none"
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section id="impact" className="scroll-mt-24 bg-gray-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-red/10 blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-14 md:gap-12 relative z-10">
          {[
            { label: 'Verified Donors', value: '15.4K', icon: Droplets },
            { label: 'Partner Hospitals', value: '420+', icon: Shield },
            { label: 'Units Delivered', value: '8.2K', icon: Heart },
            { label: 'Average Response', value: '12min', icon: Zap },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20">
                <stat.icon className="text-primary-red" size={28} />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black">{stat.value}</div>
              <div className="text-[11px] sm:text-sm font-bold text-gray-400 uppercase tracking-[0.18em] sm:tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
        <p className="relative z-10 mt-12 text-center text-xs text-gray-500 max-w-2xl mx-auto px-4">
          Figures shown are illustrative and for demonstration only.
        </p>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-primary-red font-black uppercase tracking-[0.2em] text-sm">Our Process</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900">Three Steps to Save a Life</h3>
          <p className="text-gray-500 text-base sm:text-lg">We've streamlined the connection between those who can give and those in urgent need.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              step: '01',
              title: 'Hospitals Post Request',
              desc: 'Hospitals identify an urgent blood need and post it on our platform with blood type and urgency level.',
              icon: Search,
              color: 'bg-blue-50 text-blue-600'
            },
            {
              step: '02',
              title: 'Donors Get Notified',
              desc: 'Our system instantly alerts all nearby eligible donors with the matching blood type via push notifications.',
              icon: Bell,
              color: 'bg-amber-50 text-amber-600'
            },
            {
              step: '03',
              title: 'Donor Responds',
              desc: 'The first available donor accepts the request and heads to the hospital. Real-time tracking keeps doctors informed.',
              icon: CheckCircle,
              color: 'bg-green-50 text-green-600'
            }
          ].map((item, i) => (
            <div key={i} className="relative p-6 sm:p-8 rounded-3xl border border-gray-100 hover:border-primary-red/20 hover:shadow-xl transition-all duration-300 group">
              <span className="absolute top-6 right-8 text-5xl font-black text-gray-100 group-hover:text-primary-red/10 transition-colors">{item.step}</span>
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6`}>
                <item.icon size={28} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h4>
              <p className="text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-24 bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-primary-red font-black uppercase tracking-[0.2em] text-sm mb-4">Platform Features</h2>
              <h3 className="text-3xl sm:text-4xl font-black text-gray-900 mb-8 leading-tight">Simple tools for urgent needs</h3>
              <div className="space-y-6">
                {[
                  { title: 'Smart Proximity Matching', desc: 'We use geo-fencing to only notify donors within a safe and practical travel radius.', icon: MapPin },
                  { title: 'Urgency Verification', desc: 'Each hospital is verified to ensure every alert is authentic and life-critical.', icon: Shield },
                  { title: 'Privacy First', desc: 'Donor personal data is never shared with hospitals until a donation is confirmed.', icon: Heart }
                ].map((feat, i) => (
                  <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="shrink-0 w-12 h-12 bg-primary-light text-primary-red rounded-xl flex items-center justify-center">
                      <feat.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">{feat.title}</h4>
                      <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="h-64 bg-primary-red rounded-3xl overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-black/25 motion-safe:transition-colors motion-safe:duration-300 motion-safe:group-hover:bg-black/10 motion-reduce:group-hover:bg-black/25" aria-hidden />
                  <img src="/blood_bridge_impact_1778503567274.png" width={1000} height={667} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Medical Lab" />
                </div>
                <div className="h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1536856782524-df4231df3f80?q=80&w=1000&auto=format&fit=crop" width={1000} height={667} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Hospital Hall" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded-3xl overflow-hidden shadow-lg">
                  <img src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1000&auto=format&fit=crop" width={1000} height={667} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Doctors" />
                </div>
                <div className="h-64 bg-primary-dark rounded-3xl overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-black/25 motion-safe:transition-colors motion-safe:duration-300 motion-safe:group-hover:bg-black/10 motion-reduce:group-hover:bg-black/25" aria-hidden />
                  <img src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1000&auto=format&fit=crop" width={1000} height={667} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Patient Care" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary-red rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center text-white relative overflow-hidden shadow-[0_32px_64px_-16px_rgba(220,38,38,0.3)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black leading-tight">Ready to become a local hero?</h2>
              <p className="text-base sm:text-lg md:text-xl text-red-100 opacity-90 leading-relaxed">
                Join thousands of others in our network today. Your registration takes less than 2 minutes but can provide a lifetime of hope.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link to="/register?role=donor" className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-red">
                  <Button className="w-full sm:w-auto bg-white text-primary-red hover:bg-gray-50 text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-2xl shadow-2xl">
                    Join as a Donor
                  </Button>
                </Link>
                <Link to="/register?role=hospital" className="inline-flex rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-red">
                  <Button variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg sm:text-xl px-8 sm:px-12 py-6 sm:py-8 rounded-2xl">
                    Partner Hospital
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 pt-16 sm:pt-24 pb-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-12 mb-16">
            <div className="sm:col-span-2 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-red rounded-xl flex items-center justify-center">
                  <Droplets className="text-white" size={24} />
                </div>
                <span className="text-2xl font-bold text-gray-900 tracking-tight">BloodBridge</span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed">
                Saving lives through instant connection. BloodBridge links verified hospitals with nearby donors so urgent needs get a faster response.
              </p>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Follow us</p>
                <SocialLinks />
              </div>

            </div>
            <div className="space-y-6">
              <h5 className="font-bold text-gray-900">Platform</h5>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#how-it-works" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">How it works</a></li>
                <li><a href="#features" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Features</a></li>
                <li><Link to="/login" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Sign in</Link></li>
                <li><Link to="/register?role=hospital" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Hospital registration</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="font-bold text-gray-900">Company</h5>
              <ul className="space-y-4 text-gray-500">
                <li><a href="#impact" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Impact</a></li>
                <li><a href="mailto:support@bloodbridge.com" className="rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Contact</a></li>
                <li><span className="text-gray-400 cursor-default" title="Coming soon">Privacy Policy</span></li>
                <li><span className="text-gray-400 cursor-default" title="Coming soon">Terms of Service</span></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h5 className="font-bold text-gray-900">Contact</h5>
              <ul className="space-y-4 text-gray-500">
                <li>
                  <a href="mailto:support@bloodbridge.com" className="flex items-center gap-3 rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
                    <Mail size={18} className="text-primary-red shrink-0" /> support@bloodbridge.com
                  </a>
                </li>
                <li>
                  <a href="tel:+237677000000" className="flex items-center gap-3 rounded-sm hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
                    <Phone size={18} className="text-primary-red shrink-0" /> +237 677 000 000
                  </a>
                </li>
                <li className="flex items-start gap-3"><MapPin size={18} className="text-primary-red shrink-0 mt-0.5" /> Yaoundé, Cameroon</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} BloodBridge. All rights reserved.</p>
            <p className="text-xs text-gray-400">Emergency? Call your local hospital or emergency services first.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing

