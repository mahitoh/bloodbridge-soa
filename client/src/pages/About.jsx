import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { Heart, Shield, MapPin, Menu, X } from 'lucide-react'

const About = () => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const teamMembers = [
    {
      name: 'ANKAIMBOM RICHCAL CHIA',
      role: 'Scrum Master',
      initials: 'ARC',
      color: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      name: 'KUWAN RANDY LANJO',
      role: 'Product Owner',
      initials: 'KRL',
      color: 'bg-gradient-to-br from-purple-400 to-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 supports-[backdrop-filter]:bg-white/70">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
            onClick={() => setMobileOpen(false)}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="/favicon.svg" alt="BloodBridge Logo" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">BloodBridge</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <Link to="/" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Home</Link>
            <a href="#team" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Team</a>
            <Link to="/login" className="rounded-md px-1 py-0.5 -mx-1 hover:text-primary-red transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">Login</Link>
            <Link to="/register" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2">
              <Button className="shadow-md shadow-red-100">Get Started</Button>
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden rounded-xl p-2 text-gray-700 hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-offset-2"
            aria-expanded={mobileOpen}
            aria-controls="about-mobile-nav"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileOpen && (
          <div
            id="about-mobile-nav"
            className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 font-medium text-gray-700"
          >
            <Link to="/" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              Home
            </Link>
            <a href="#team" className="block rounded-lg py-2 hover:text-primary-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red focus-visible:ring-inset" onClick={() => setMobileOpen(false)}>
              Team
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

      <section className="bg-gradient-to-r from-primary-light via-white to-red-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.24em] font-bold text-primary-red">About BloodBridge</p>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900">We connect donors and hospitals when every minute counts.</h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                BloodBridge is a purpose-built platform that makes blood donation faster, safer, and more reliable. We bring verified hospitals and eligible donors together with timely alerts, secure matchmaking, and a human-centered experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register?role=donor" className="inline-flex rounded-2xl">
                  <Button className="px-8 py-4">Join as Donor</Button>
                </Link>
                <Link to="/login" className="inline-flex rounded-2xl">
                  <Button variant="outline" className="px-8 py-4">Hospital Login</Button>
                </Link>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-[2rem] bg-white border border-gray-100 shadow-xl p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-primary-light text-primary-red mb-6">
                  <Heart size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To reduce the time between blood requests and donations by enabling fast, trusted connections across communities.
                </p>
              </div>
              <div className="rounded-[2rem] bg-white border border-gray-100 shadow-xl p-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-primary-light text-primary-red mb-6">
                  <Shield size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Trust</h2>
                <p className="text-gray-600 leading-relaxed">
                  Hospitals and donors both rely on clear verification, secure privacy safeguards, and transparent request tracking.
                </p>
              </div>
              <div className="rounded-[2rem] bg-white border border-gray-100 shadow-xl p-8 sm:col-span-2">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-3xl bg-primary-light text-primary-red mb-6">
                  <MapPin size={28} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Community</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our platform focuses on local response so the right people can act quickly and the right blood arrives where it is needed most.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
          <div className="space-y-6">
            <p className="text-primary-red font-black uppercase tracking-[0.24em] text-sm">Our story</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Built by people who care, for people who give.</h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              BloodBridge was created to simplify the lifesaving logistics behind blood donation. We believe every organization should have fast access to the right donors, and every donor should know how they are helping.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-gray-100 p-6 bg-white shadow-sm">
                <p className="text-2xl font-black text-gray-900">24/7</p>
                <p className="mt-3 text-sm text-gray-500">Always on to support urgent requests.</p>
              </div>
              <div className="rounded-3xl border border-gray-100 p-6 bg-white shadow-sm">
                <p className="text-2xl font-black text-gray-900">420+</p>
                <p className="mt-3 text-sm text-gray-500">Hospital partners and growing donor communities.</p>
              </div>
              <div className="rounded-3xl border border-gray-100 p-6 bg-white shadow-sm">
                <p className="text-2xl font-black text-gray-900">15k+</p>
                <p className="mt-3 text-sm text-gray-500">Donors connected through the platform monthly.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="rounded-[2rem] border border-gray-100 bg-gray-50 p-8 shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] font-bold text-primary-red">Team values</p>
              <ul className="mt-6 space-y-4 text-gray-600">
                <li className="flex gap-3"><span className="h-2.5 w-2.5 rounded-full bg-primary-red mt-2" />Human-centered support for donors and hospitals.</li>
                <li className="flex gap-3"><span className="h-2.5 w-2.5 rounded-full bg-primary-red mt-2" />Fast notifications with clear eligibility and travel guidance.</li>
                <li className="flex gap-3"><span className="h-2.5 w-2.5 rounded-full bg-primary-red mt-2" />Privacy-first design and trusted verification for every request.</li>
              </ul>
            </div>
            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900">Our approach</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                We combine real-time matching, clean hospital workflows, and mobile-ready donor alerts so the right resource is delivered without unnecessary delay.
              </p>
              <p className="mt-6 text-sm text-gray-500">If you want to partner with us or learn more, reach out to the BloodBridge team anytime.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-[0.24em] font-bold text-primary-red">Contact</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4">Let's keep lifesaving work moving forward.</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              For partnership, hospital onboarding, or donor community questions, our team is here to help.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-3 gap-6 text-center">
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-4">Email</p>
              <p className="text-base font-semibold text-gray-900">support@bloodbridge.org</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-4">Location</p>
              <p className="text-base font-semibold text-gray-900">Global donor network, locally supported.</p>
            </div>
            <div className="rounded-3xl bg-white border border-gray-100 p-8 shadow-sm">
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em] mb-4">Mission</p>
              <p className="text-base font-semibold text-gray-900">Make every blood request count.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-sm uppercase tracking-[0.24em] font-bold text-primary-red">Meet our team</p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-4">The people behind BloodBridge</h2>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Our dedicated team is committed to connecting donors with those who need them most.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="rounded-3xl border border-gray-100 bg-white shadow-lg hover:shadow-xl transition-shadow p-8 text-center space-y-6">
                <div className={`w-24 h-24 mx-auto rounded-full ${member.color} flex items-center justify-center shadow-lg`}>
                  <span className="text-4xl font-black text-white">{member.initials}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                  <p className="text-primary-red font-semibold">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About

