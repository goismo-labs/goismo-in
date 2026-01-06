import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { useForm, ValidationError } from '@formspree/react';

// Theme Context
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
};

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useScrollReveal();

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Fixed ShinyText component with proper animation coverage
const ShinyText = ({ children, className = '' }) => (
  <span className={`relative inline-block overflow-hidden ${className}`}>
    <span className="relative z-10">{children}</span>
    <span 
      className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shine pointer-events-none" 
      style={{ transform: 'translateX(-100%)' }}
    ></span>
  </span>
);

// Mobile-friendly gradient text with shine effect
const GradientShinyText = ({ children, isDark }) => (
  <span className="relative inline-block overflow-hidden">
    <span 
      className={`relative z-10 bg-gradient-to-r ${isDark ? 'from-white via-orange-500 to-blue-500' : 'from-gray-900 via-orange-500 to-blue-500'} bg-clip-text`}
      style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
    >
      {children}
    </span>
    <span 
      className="absolute top-0 left-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine pointer-events-none z-20" 
      style={{ transform: 'translateX(-100%)' }}
    ></span>
  </span>
);

const GlassCard = ({ children, className = '', hover = true }) => {
  const { isDark } = useTheme();
  return (
    <div className={`${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.03] border-black/[0.08]'} border rounded-2xl p-8 transition-all duration-400 ${hover ? `${isDark ? 'hover:bg-white/[0.06] hover:border-orange-500/30' : 'hover:bg-black/[0.06] hover:border-orange-500/50'} hover:-translate-y-1 hover:shadow-2xl` : ''} ${className}`}>
      {children}
    </div>
  );
};

// Theme Toggle Button
const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button 
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-white/[0.05] hover:bg-white/[0.1] text-yellow-400' : 'bg-black/[0.05] hover:bg-black/[0.1] text-slate-700'}`}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

const Navigation = ({ currentPage, setCurrentPage, scrolled }) => {
  const { isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'products', label: 'Products' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'team', label: 'Team' },
    { id: 'careers', label: 'Careers' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${scrolled ? `${isDark ? 'bg-[#0D0D0D]/90' : 'bg-white/90'} backdrop-blur-xl py-3 border-b ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}` : 'py-5'}`}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => setCurrentPage('home')}>
          <div className="w-10 h-10 text-orange-500">
            <svg viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="animate-spin" style={{animationDuration: '20s'}}/>
              <path d="M20 8 L32 20 L20 32 L8 20 Z" fill="currentColor" className="animate-pulse"/>
              <circle cx="20" cy="20" r="4" fill={isDark ? '#0D0D0D' : '#ffffff'}/>
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-wider bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">GOISMO</span>
        </div>

        <div className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-full left-0 right-0 md:top-auto ${isDark ? 'bg-[#0D0D0D]/98' : 'bg-white/98'} md:bg-transparent backdrop-blur-xl md:backdrop-blur-none p-6 md:p-0 gap-0 md:gap-2 items-center`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setMobileMenuOpen(false); }}
              className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'} text-sm font-medium py-4 md:py-2 px-4 relative transition-colors border-b md:border-b-0 ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'} ${currentPage === item.id ? (isDark ? 'text-white' : 'text-black') : ''}`}
            >
              {item.label}
              <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-orange-500 transition-all ${currentPage === item.id ? 'w-3/5' : 'w-0'}`}></span>
            </button>
          ))}
          <div className="mt-4 md:mt-0 md:ml-4">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle />
          <button className="w-8 h-8 relative" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`absolute w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-black'} left-1 transition-all ${mobileMenuOpen ? 'rotate-45 top-4' : 'top-2'}`}></span>
            <span className={`absolute w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-black'} left-1 top-4 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`absolute w-6 h-0.5 ${isDark ? 'bg-white' : 'bg-black'} left-1 transition-all ${mobileMenuOpen ? '-rotate-45 top-4' : 'top-6'}`}></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const HeroSection = ({ setCurrentPage }) => {
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{backgroundImage: `linear-gradient(${isDark ? 'rgba(255,87,34,0.03)' : 'rgba(255,87,34,0.08)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,87,34,0.03)' : 'rgba(255,87,34,0.08)'} 1px, transparent 1px)`, backgroundSize: '60px 60px', maskImage: 'radial-gradient(ellipse at center, black 0%, transparent 70%)'}}></div>
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-50 -top-48 -right-24 bg-orange-500/40" style={{transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`}}></div>
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[80px] opacity-50 -bottom-24 -left-24 bg-blue-500/30" style={{transform: `translate(${-mousePos.x * 0.03}px, ${mousePos.y * 0.01}px)`}}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        <div className={`inline-flex items-center gap-2 px-5 py-2 ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.03] border-black/[0.08]'} border rounded-full text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 animate-fadeInUp`}>
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
          Software Excellence Since 2019
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
          <span className={`block animate-fadeInUp ${isDark ? 'text-white' : 'text-gray-900'}`}>Building the</span>
          <span className="block animate-fadeInUp" style={{animationDelay: '0.2s'}}>
            <GradientShinyText isDark={isDark}>Future of Software</GradientShinyText>
          </span>
        </h1>
        
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed max-w-2xl mx-auto mb-10 animate-fadeInUp`} style={{animationDelay: '0.4s'}}>
          Enterprise solutions powered by innovation. We architect secure, scalable systems across Fintech, Education, and Cybersecurity—including 24/7 SOC and VSOC services.
        </p>

        <div className="flex gap-4 justify-center flex-wrap animate-fadeInUp" style={{animationDelay: '0.6s'}}>
          <button onClick={() => setCurrentPage('portfolio')} className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 transition-all">
            Explore Our Work
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <button onClick={() => setCurrentPage('contact')} className={`px-7 py-4 rounded-xl font-semibold ${isDark ? 'bg-white/[0.03] text-white border-white/[0.08] hover:bg-white/[0.06]' : 'bg-black/[0.03] text-gray-900 border-black/[0.08] hover:bg-black/[0.06]'} border hover:border-orange-500 transition-all`}>
            Get in Touch
          </button>
        </div>

        <div className="flex justify-center gap-10 mt-16 animate-fadeInUp" style={{animationDelay: '0.8s'}}>
          {[{value: 50, suffix: '+', label: 'Projects Delivered'}, {value: 99, suffix: '%', label: 'Client Satisfaction'}, {value: 3, suffix: '', label: 'Global Offices'}].map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className={`w-px ${isDark ? 'bg-white/[0.08]' : 'bg-black/[0.08]'}`}></div>}
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500"><AnimatedCounter end={stat.value} suffix={stat.suffix} /></div>
                <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const PillarsSection = () => {
  const { isDark } = useTheme();
  const pillars = [
    { icon: '🎼', title: 'Managed Operations', desc: 'Like a symphony orchestra, we orchestrate complex systems with precision and harmony.', features: ['24/7 Support', 'Proactive Monitoring', 'Incident Response'] },
    { icon: '🎂', title: 'Security Compliance', desc: 'Our layered "Cyber Cake" approach ensures protection at every level of your stack.', features: ['SOC 2 Type II', 'GDPR Compliant', 'ISO 27001'] },
    { icon: '🔄', title: 'Continuous Improvement', desc: 'Iterative feedback loops that evolve your systems alongside your business.', features: ['Agile Sprints', 'Performance Reviews', 'Tech Debt Mgmt'] }
  ];

  return (
    <section className={`py-24 px-6 ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Our Approach</span>
          <h2 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Three Pillars of Excellence</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => {
            const [ref, isVisible] = useScrollReveal(0.1);
            return (
              <GlassCard key={i} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div ref={ref}>
                  <div className="text-5xl mb-6">{pillar.icon}</div>
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{pillar.title}</h3>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{pillar.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {pillar.features.map((f, j) => (
                      <span key={j} className={`px-3 py-1 ${isDark ? 'bg-white/[0.05] text-gray-400' : 'bg-black/[0.05] text-gray-600'} rounded-lg text-xs`}>{f}</span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  const { isDark } = useTheme();
  const timeline = [
    { year: '2019', title: 'Founded', desc: 'Started in Bangalore with a vision for excellence' },
    { year: '2020', title: 'First Major Client', desc: 'Secured enterprise fintech partnership' },
    { year: '2021', title: 'Team Growth', desc: 'Expanded to 25+ engineers' },
    { year: '2022', title: 'Sweden Office', desc: 'Opened Göteborg development center' },
    { year: '2023', title: 'Security Guard App', desc: 'Launched flagship workforce platform' },
    { year: '2024', title: 'US Expansion', desc: 'Established Oakland headquarters' },
    { year: '2025', title: 'SOC & VSOC Launch', desc: 'Security Operations Centre services' }
  ];

  const cyberCakeLayers = [
    { name: 'Application Layer', color: 'from-orange-500 to-orange-400', desc: 'Secure code practices & input validation' },
    { name: 'Network Layer', color: 'from-orange-400 to-yellow-500', desc: 'Firewalls, VPNs & encrypted communications' },
    { name: 'Infrastructure Layer', color: 'from-yellow-500 to-green-500', desc: 'Cloud security & access controls' },
    { name: 'Data Layer', color: 'from-green-500 to-blue-500', desc: 'Encryption at rest & in transit' }
  ];

  return (
    <section className={`py-24 px-6 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">About Goismo</span>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our <ShinyText>Story</ShinyText></h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>From a Bangalore startup to a global technology partner.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>The Cyber Cake Security Model</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Security isn't a single layer—it's a carefully crafted stack. Like a perfectly baked cake, each layer serves a purpose.</p>
            <div className="space-y-3">
              {cyberCakeLayers.map((layer, i) => (
                <div key={i} className={`p-4 rounded-xl bg-gradient-to-r ${layer.color} transform hover:scale-[1.02] transition-all cursor-default`}>
                  <div className="font-semibold text-white">{layer.name}</div>
                  <div className="text-sm text-white/80">{layer.desc}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className={`text-2xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Journey</h3>
            <div className="space-y-0">
              {timeline.map((item, i) => (
                <div key={i} className={`relative pl-8 pb-6 border-l-2 ${isDark ? 'border-white/10' : 'border-black/10'} last:border-l-0`}>
                  <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"></div>
                  <span className="text-orange-500 font-mono text-sm">{item.year}</span>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesPreview = ({ setCurrentPage }) => {
  const { isDark } = useTheme();
  const services = [
    {
      icon: '🛡️',
      title: 'Security Operations Centre',
      subtitle: 'SOC as a Service',
      desc: 'Comprehensive 24/7 threat monitoring with MXDR and Managed SIEM capabilities powered by Microsoft security stack.',
      features: ['24/7 Monitoring', 'MXDR', 'Managed SIEM', 'Incident Response']
    },
    {
      icon: '🚗',
      title: 'Vehicle Security Operations',
      subtitle: 'VSOC for Automotive',
      desc: 'Specialized cybersecurity for connected vehicles with compliance support for UNECE R155 and ISO/SAE 21434.',
      features: ['Fleet Monitoring', 'OTA Security', 'Threat Intelligence', 'Compliance Support']
    }
  ];

  return (
    <section className={`py-24 px-6 ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Our Services</span>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cyber Defense <ShinyText>Solutions</ShinyText></h2>
          <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>Enterprise-grade security operations for IT and automotive ecosystems.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {services.map((service, i) => {
            const [ref, isVisible] = useScrollReveal(0.1);
            return (
              <GlassCard key={i} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div ref={ref}>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{service.icon}</span>
                    <div>
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                      <span className="text-sm text-orange-500">{service.subtitle}</span>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>{service.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((f, j) => (
                      <span key={j} className={`px-3 py-1 ${isDark ? 'bg-white/[0.05] text-gray-400' : 'bg-black/[0.05] text-gray-600'} rounded-lg text-xs`}>{f}</span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="text-center">
          <button onClick={() => setCurrentPage('services')} className="inline-flex items-center gap-3 px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/40 hover:-translate-y-0.5 hover:shadow-xl transition-all">
            Explore All Services
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

const TrustIndicators = () => {
  const { isDark } = useTheme();
  const indicators = [
    { icon: '🏆', label: 'ISO 27001', desc: 'Certified' },
    { icon: '✅', label: 'SOC 2 Type II', desc: 'Compliant' },
    { icon: '🇪🇺', label: 'GDPR', desc: 'Compliant' },
    { icon: '🔒', label: 'UNECE R155', desc: 'Aligned' },
    { icon: '🛡️', label: 'Microsoft', desc: 'Partner' },
    { icon: '⚡', label: '99.9%', desc: 'Uptime SLA' }
  ];

  return (
    <section className={`py-16 px-6 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'} border-y ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {indicators.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.label}</div>
              <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ServicesPage = () => {
  const { isDark } = useTheme();

  const socFeatures = [
    { icon: '📡', title: 'Managed MXDR', desc: 'Extended Detection and Response across endpoints, identities, cloud workloads, and applications with automated threat containment.' },
    { icon: '📊', title: 'Managed SIEM', desc: 'Centralised log collection, event correlation, and incident management with Microsoft Sentinel as the core platform.' },
    { icon: '🔍', title: 'Threat Hunting', desc: 'Proactive threat hunting using MITRE ATT&CK framework and enriched threat intelligence.' },
    { icon: '🚨', title: '24/7 Monitoring', desc: 'Round-the-clock surveillance with rapid incident response and automated playbooks.' },
    { icon: '📋', title: 'Compliance Support', desc: 'Built-in support for ISO 27001, NIST, GDPR, and industry-specific regulations.' },
    { icon: '📈', title: 'Reporting & Insights', desc: 'Dashboards, compliance reports, and incident summaries with continuous optimization.' }
  ];

  const vsocFeatures = [
    { icon: '🚙', title: 'Fleet Monitoring', desc: 'Continuous surveillance of vehicle telemetry, backend infrastructure, and connected services.' },
    { icon: '🔐', title: 'OTA Security', desc: 'Over-the-Air patch validation ensuring firmware integrity and secure software updates.' },
    { icon: '📡', title: 'CAN Bus Analytics', desc: 'Anomaly detection on Controller Area Network to identify potential ECU attacks.' },
    { icon: '🌐', title: 'Threat Intelligence', desc: 'Automotive-specific intelligence with Auto-ISAC feeds and global threat data integration.' },
    { icon: '✅', title: 'Regulatory Compliance', desc: 'Full alignment with UNECE WP.29 R155/R156 and ISO/SAE 21434 requirements.' },
    { icon: '🤝', title: 'OEM Collaboration', desc: 'Joint workflows, escalation management, and knowledge transfer with engineering teams.' }
  ];

  const socTiers = [
    {
      name: 'Security Essentials',
      subtitle: 'For MSMEs & Startups',
      focus: 'MXDR Only',
      features: ['Endpoint Protection', 'Identity Monitoring', 'Cloud App Security', '24/7 SOC Monitoring', 'Basic Compliance Reports', 'Rapid Onboarding'],
      ideal: 'Small to mid-sized organisations with lean IT environments'
    },
    {
      name: 'Security Core',
      subtitle: 'For Enterprises',
      focus: 'MXDR + Managed SIEM',
      features: ['Full-Stack Coverage', 'Advanced Log Correlation', 'Custom Detection Rules', 'Co-Managed Options', 'Advanced Compliance', 'Dedicated Support'],
      ideal: 'Large enterprises with complex IT environments and regulatory needs'
    }
  ];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Services</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Cyber Defense <ShinyText>Centre</ShinyText></h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto`}>Comprehensive Security Operations Centre services for enterprise IT and connected vehicle ecosystems.</p>
      </section>

      {/* SOC Section */}
      <section className={`py-24 px-6 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-3xl">🛡️</div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Security Operations Centre</h2>
              <p className="text-orange-500">SOC as a Service</p>
            </div>
          </div>
          
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-12 max-w-4xl`}>
            Goismo's SOC provides organisations with comprehensive, scalable, and proactive cybersecurity—delivering real-time threat detection, incident response, and security intelligence across all environments through MXDR and Managed SIEM powered by Microsoft's native security stack.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {socFeatures.map((f, i) => {
              const [ref, isVisible] = useScrollReveal(0.1);
              return (
                <GlassCard key={i} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div ref={ref}>
                    <div className="text-3xl mb-4">{f.icon}</div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Service Tiers */}
          <h3 className={`text-2xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Service Tiers</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {socTiers.map((tier, i) => (
              <GlassCard key={i} className={`relative overflow-hidden ${i === 1 ? 'border-orange-500/50' : ''}`}>
                {i === 1 && <div className="absolute top-0 right-0 px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-bl-lg">Popular</div>}
                <h4 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h4>
                <p className="text-orange-500 text-sm mb-2">{tier.subtitle}</p>
                <div className={`inline-block px-3 py-1 ${isDark ? 'bg-white/[0.05]' : 'bg-black/[0.05]'} rounded-lg text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{tier.focus}</div>
                <ul className="space-y-2 mb-6">
                  {tier.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span className="text-orange-500">✓</span>{f}
                    </li>
                  ))}
                </ul>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'} border-t ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'} pt-4`}>
                  <strong>Ideal for:</strong> {tier.ideal}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* VSOC Section */}
      <section className={`py-24 px-6 ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl">🚗</div>
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Vehicle Security Operations Centre</h2>
              <p className="text-blue-500">VSOC as a Service for Automotive OEMs</p>
            </div>
          </div>
          
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-12 max-w-4xl`}>
            Designed for scalability, adaptability, and precision—our VSOC provides OEMs with real-time fleet monitoring, AI-driven threat detection, compliance readiness, and expert security response for connected vehicle ecosystems.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {vsocFeatures.map((f, i) => {
              const [ref, isVisible] = useScrollReveal(0.1);
              return (
                <GlassCard key={i} className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div ref={ref}>
                    <div className="text-3xl mb-4">{f.icon}</div>
                    <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{f.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{f.desc}</p>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* VSOC Highlights */}
          <div className={`p-8 rounded-2xl ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.03] border-black/[0.08]'} border`}>
            <h4 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Frameworks & Standards</h4>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: 'ISO/SAE 21434', desc: 'Automotive cybersecurity engineering' },
                { name: 'UNECE R155', desc: 'Cybersecurity management systems' },
                { name: 'MITRE ATT&CK', desc: 'Automotive threat mapping' },
                { name: 'NIST CSF', desc: 'Risk management framework' }
              ].map((fw, i) => (
                <div key={i} className="text-center">
                  <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{fw.name}</div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{fw.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SLA Section */}
      <section className={`py-24 px-6 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Service Level Agreements</h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Response times based on incident severity</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className={`w-full ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'} rounded-2xl overflow-hidden`}>
              <thead>
                <tr className="bg-orange-500/10">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Severity</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Description</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Initial Response</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { level: 'Critical (P1)', desc: 'Active breach with high operational impact', time: '15 minutes' },
                  { level: 'High (P2)', desc: 'Confirmed attack with potential data access', time: '1 hour' },
                  { level: 'Medium (P3)', desc: 'Suspicious activity requiring attention', time: '4 hours' },
                  { level: 'Low (P4)', desc: 'Minor incident with minimal impact', time: '1 business day' },
                  { level: 'Informational (P5)', desc: 'No immediate impact, informational', time: '2-3 business days' }
                ].map((row, i) => (
                  <tr key={i} className={`border-t ${isDark ? 'border-white/[0.08]' : 'border-black/[0.08]'}`}>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium ${
                        i === 0 ? 'bg-red-500/20 text-red-400' :
                        i === 1 ? 'bg-orange-500/20 text-orange-400' :
                        i === 2 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>{row.level}</span>
                    </td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.desc}</td>
                    <td className={`px-6 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const PortfolioPage = () => {
  const { isDark } = useTheme();
  const features = [
    { cat: 'Workforce', feat: 'Dynamic shift scheduling with AI optimization', metric: '40% efficiency gain' },
    { cat: 'Field Ops', feat: 'GPS tracking & geofenced check-ins', metric: 'Real-time accuracy' },
    { cat: 'Security', feat: 'Biometric authentication & audit trails', metric: '99.9% uptime SLA' },
    { cat: 'Communications', feat: 'Encrypted messaging & alert broadcasts', metric: '<2s delivery' },
    { cat: 'Analytics', feat: 'Custom dashboards & predictive insights', metric: '50+ report types' }
  ];

  // Fixed: All cards now have equal sizing with uniform grid
  const featureCards = [
    { icon: '📊', title: 'Unified Dashboard', desc: 'Real-time visibility' },
    { icon: '⏰', title: '24/7 Monitoring', desc: 'Round-the-clock vigilance' },
    { icon: '🔒', title: 'Secure by Design', desc: 'Enterprise-grade' },
    { icon: '🤖', title: 'Smart Scheduling', desc: 'AI-powered management' },
    { icon: '🗺️', title: 'Incident Heat Maps', desc: 'Visual analytics' },
    { icon: '📱', title: 'Mobile First', desc: 'Cross-platform support' }
  ];

  return (
    <div className="pt-20">
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Portfolio</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our <ShinyText>Flagship</ShinyText> Work</h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>Enterprise solutions that transform industries.</p>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block px-5 py-2 bg-gradient-to-r from-orange-500/20 to-blue-500/20 border border-orange-500 rounded-full text-sm font-semibold mb-4">🏆 Flagship Product</div>
          <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Security Guard App</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-3xl mx-auto mb-12`}>A comprehensive workforce management platform revolutionizing security operations with AI-powered scheduling, real-time monitoring, and unified command center integration.</p>

          {/* Fixed: Uniform 3-column grid with equal card sizes */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-16">
            {featureCards.map((item, i) => (
              <GlassCard key={i} className="text-left">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h4 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
              </GlassCard>
            ))}
          </div>

          <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Core Capabilities</h3>
          <div className="overflow-x-auto">
            <table className={`w-full ${isDark ? 'bg-white/[0.03]' : 'bg-black/[0.03]'} rounded-2xl overflow-hidden`}>
              <thead>
                <tr className="bg-orange-500/10">
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Category</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Feature</th>
                  <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-orange-500">Performance</th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, i) => (
                  <tr key={i} className={`border-t ${isDark ? 'border-white/[0.08] hover:bg-white/[0.03]' : 'border-black/[0.08] hover:bg-black/[0.03]'}`}>
                    <td className="px-6 py-4"><span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-md text-xs text-blue-400">{row.cat}</span></td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.feat}</td>
                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{row.metric}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = () => {
  const { isDark } = useTheme();
  return (
    <div className="pt-20">
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Products</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Domain <ShinyText>Expertise</ShinyText></h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>Specialized solutions for Fintech and Education sectors.</p>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <GlassCard className="min-h-[500px] flex flex-col">
            <span className="inline-block px-3 py-1 bg-orange-500/10 rounded-md text-xs text-orange-500 uppercase tracking-wider mb-3 w-fit">Financial Technology</span>
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>MoneyWeaver</h2>
            <p className="text-sm text-orange-500 font-medium mb-4">Smart AI-Powered Finance App</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Take control of your financial future with intelligent insights, automated tracking, and personalized recommendations powered by advanced AI technology.</p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {['Intelligent Insights', 'Automated Tracking', 'AI Recommendations', 'Smart Budgeting'].map((f, i) => (
                <div key={i} className={`flex items-center gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}><span className="w-5 h-5 text-orange-500">✓</span>{f}</div>
              ))}
            </div>
            <div className={`mt-auto p-8 ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'} rounded-xl flex justify-center items-end gap-3 h-32`}>
              {[60, 80, 45, 90, 70].map((h, i) => (
                <div key={i} className="w-6 rounded-t-sm bg-gradient-to-t from-orange-500 to-blue-500 animate-pulse" style={{height: `${h}%`, animationDelay: `${i*0.2}s`}}></div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="min-h-[500px] flex flex-col">
            <span className="inline-block px-3 py-1 bg-orange-500/10 rounded-md text-xs text-orange-500 uppercase tracking-wider mb-3 w-fit">Educational Technology</span>
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>GoKred</h2>
            <p className="text-sm text-orange-500 font-medium mb-4">Digital Accreditation Platform</p>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Build trust with verified digital credentials. GoKred makes it easy to issue, manage, and validate secure digital certifications — enhancing credibility for organizations and individuals alike.</p>
            <div className="space-y-3 mb-8">
              {[
                { title: 'Credential Issuance', desc: 'Create and distribute tamper-proof digital certifications effortlessly' },
                { title: 'Global Validation', desc: 'Ensure compliance with international standards for global recognition' },
                { title: 'Real-Time Verification', desc: 'Instantly confirm credentials, boosting trust and transparency' }
              ].map((f, i) => (
                <div key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  <span className="w-5 h-5 text-orange-500 mt-0.5">✓</span>
                  <div><span className="font-medium">{f.title}</span> <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>– {f.desc}</span></div>
                </div>
              ))}
            </div>
            <div className={`mt-auto p-8 ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-200'} rounded-xl flex justify-center items-center gap-4`}>
              <div className="relative">
                <div className="w-16 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                </div>
              </div>
              <div className={`text-left ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className="text-xs text-green-500 font-semibold uppercase tracking-wider">Verified</div>
                <div className="font-medium">Digital Certificate</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

const TeamPage = () => {
  const { isDark } = useTheme();
  const team = [
    { name: 'Rajesh Kumar', role: 'Founder & CEO', loc: 'Bangalore', avatar: 'RK' },
    { name: 'Anna Lindqvist', role: 'CTO', loc: 'Göteborg', avatar: 'AL' },
    { name: 'Michael Chen', role: 'VP Engineering', loc: 'Oakland', avatar: 'MC' },
    { name: 'Priya Sharma', role: 'Head of Security', loc: 'Bangalore', avatar: 'PS' },
    { name: 'Erik Johansson', role: 'Lead Designer', loc: 'Göteborg', avatar: 'EJ' },
    { name: 'Sarah Williams', role: 'Product Manager', loc: 'Oakland', avatar: 'SW' },
    { name: 'Amit Patel', role: 'DevOps Lead', loc: 'Bangalore', avatar: 'AP' },
    { name: 'Lisa Andersson', role: 'QA Director', loc: 'Göteborg', avatar: 'LA' }
  ];

  return (
    <div className="pt-20">
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Our Team</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>The <ShinyText>Architects</ShinyText> of Innovation</h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>A global team united by a passion for building exceptional software.</p>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {team.map((member, i) => {
              const [ref, isVisible] = useScrollReveal(0.1);
              return (
                <GlassCard key={i} className={`text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div ref={ref}>
                    <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-orange-500 to-blue-500 rounded-full flex items-center justify-center text-2xl font-bold text-white">{member.avatar}</div>
                    <h3 className={`text-lg font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                    <span className="text-sm text-orange-500 font-medium block mb-2">{member.role}</span>
                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'} flex items-center justify-center gap-1`}>📍 {member.loc}</span>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Culture</h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>We believe in fostering an environment where innovation thrives and every voice matters.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '🌍', title: 'Global Mindset', desc: 'Three continents, one vision' },
              { icon: '💡', title: 'Innovation DNA', desc: 'Always learning, always improving' },
              { icon: '🤝', title: 'Collaboration First', desc: 'Cross-functional teams that deliver' },
              { icon: '📈', title: 'Continuous Learning', desc: 'Growth is part of the job' }
            ].map((value, i) => (
              <GlassCard key={i} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{value.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{value.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const CareersPage = () => {
  const { isDark } = useTheme();
  const jobs = [
    { title: 'Senior React Developer', loc: 'Bangalore / Remote', type: 'Full-time', tags: ['React', 'TypeScript', 'Node.js'] },
    { title: 'DevOps Engineer', loc: 'Göteborg', type: 'Full-time', tags: ['AWS', 'Kubernetes', 'Terraform'] },
    { title: 'Product Designer', loc: 'Oakland', type: 'Full-time', tags: ['Figma', 'Design Systems', 'UX'] },
    { title: 'Security Analyst', loc: 'Remote', type: 'Contract', tags: ['Penetration Testing', 'SOC 2', 'Risk Assessment'] }
  ];

  return (
    <div className="pt-20">
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Careers</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Join Our <ShinyText>Mission</ShinyText></h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>Build the future of software with a team that values excellence and innovation.</p>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: '🏥', title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage' },
              { icon: '🌴', title: 'Flexible PTO', desc: 'Unlimited vacation policy with minimum 4 weeks' },
              { icon: '📚', title: 'Learning Budget', desc: '$2,500 annual allowance for courses and conferences' },
              { icon: '🏠', title: 'Remote Options', desc: 'Flexible work-from-home arrangements' },
              { icon: '💰', title: 'Equity Package', desc: 'Stock options for all full-time employees' },
              { icon: '🎯', title: 'Career Growth', desc: 'Clear progression paths and mentorship programs' }
            ].map((benefit, i) => (
              <GlassCard key={i} className="text-center">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{benefit.title}</h4>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{benefit.desc}</p>
              </GlassCard>
            ))}
          </div>

          <h2 className={`text-3xl font-bold mb-8 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>Open Positions</h2>
          <div className="space-y-4">
            {jobs.map((job, i) => (
              <GlassCard key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, j) => (
                      <span key={j} className={`px-2 py-1 ${isDark ? 'bg-blue-500/10' : 'bg-blue-500/20'} border border-blue-500/30 rounded text-xs text-blue-400`}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{job.loc}</div>
                    <div className="text-xs text-orange-500">{job.type}</div>
                  </div>
                  <button className="px-5 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">Apply</button>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const ContactPage = ({ setCurrentPage }) => {
  const { isDark } = useTheme();
  const [state, handleSubmit] = useForm("xnjnkkaw");
  
  const offices = [
    { city: 'Bangalore', country: 'India', addr: '441, 9th Main, AECS B Block, Singasandra, Bangalore - 560068', flag: '🇮🇳' },
    { city: 'Göteborg', country: 'Sweden', addr: 'Herkulesgatan 3A, 417 03 Göteborg, Sweden', flag: '🇸🇪' },
    { city: 'Oakland', country: 'United States', addr: '1999 Harrison St, Suite 1800 Oakland, CA 94612', flag: '🇺🇸' }
  ];

  return (
    <div className="pt-20">
      <section className={`py-20 px-6 text-center bg-gradient-to-b ${isDark ? 'from-[#141414] to-[#0D0D0D]' : 'from-gray-100 to-white'}`}>
        <span className="inline-block px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full text-xs text-orange-500 uppercase tracking-widest mb-4">Contact</span>
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Let's <ShinyText>Connect</ShinyText></h1>
        <p className={`text-xl ${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>Ready to start your next project? We'd love to hear from you.</p>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Our Offices</h2>
            <div className="space-y-6">
              {offices.map((office, i) => (
                <GlassCard key={i}>
                  <div className="flex items-start gap-4">
                    <span className="text-3xl">{office.flag}</span>
                    <div>
                      <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{office.city}, {office.country}</h3>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>{office.addr}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>

            <div className="mt-8">
              <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Direct Contact</h3>
              <a href="mailto:info@goismo.in" className="inline-flex items-center gap-3 text-orange-500 hover:text-orange-400 transition-colors text-lg">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                info@goismo.in
              </a>
            </div>
          </div>

          <div>
            <h2 className={`text-3xl font-bold mb-8 ${isDark ? 'text-white' : 'text-gray-900'}`}>Send a Message</h2>
            
            {state.succeeded ? (
              <GlassCard className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>Thank you for reaching out. We'll get back to you shortly.</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl hover:-translate-y-0.5 transition-all"
                >
                  Send Another Message
                </button>
              </GlassCard>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
                  <input 
                    id="name"
                    type="text" 
                    name="name"
                    required
                    placeholder="John Doe"
                    className={`w-full px-4 py-4 ${isDark ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-white/30' : 'bg-black/[0.03] border-black/[0.08] text-gray-900 placeholder-black/30'} border rounded-xl focus:outline-none focus:border-orange-500 transition-all`}
                  />
                  <label htmlFor="name" className={`absolute -top-2.5 left-3 px-1 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'} text-xs text-orange-500`}>Full Name</label>
                  <ValidationError prefix="Name" field="name" errors={state.errors} className="text-red-500 text-sm mt-1" />
                </div>
                
                <div className="relative">
                  <input 
                    id="email"
                    type="email" 
                    name="email"
                    required
                    placeholder="john@company.com"
                    className={`w-full px-4 py-4 ${isDark ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-white/30' : 'bg-black/[0.03] border-black/[0.08] text-gray-900 placeholder-black/30'} border rounded-xl focus:outline-none focus:border-orange-500 transition-all`}
                  />
                  <label htmlFor="email" className={`absolute -top-2.5 left-3 px-1 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'} text-xs text-orange-500`}>Email</label>
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-sm mt-1" />
                </div>
                
                <div className="relative">
                  <input 
                    id="company"
                    type="text" 
                    name="company"
                    placeholder="Your Company"
                    className={`w-full px-4 py-4 ${isDark ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-white/30' : 'bg-black/[0.03] border-black/[0.08] text-gray-900 placeholder-black/30'} border rounded-xl focus:outline-none focus:border-orange-500 transition-all`}
                  />
                  <label htmlFor="company" className={`absolute -top-2.5 left-3 px-1 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'} text-xs text-orange-500`}>Company</label>
                </div>
                
                <div className="relative">
                  <textarea 
                    id="message"
                    name="message"
                    rows="4" 
                    required
                    placeholder="Tell us about your project..."
                    className={`w-full px-4 py-4 ${isDark ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-white/30' : 'bg-black/[0.03] border-black/[0.08] text-gray-900 placeholder-black/30'} border rounded-xl focus:outline-none focus:border-orange-500 transition-all resize-none`}
                  ></textarea>
                  <label htmlFor="message" className={`absolute -top-2.5 left-3 px-1 ${isDark ? 'bg-[#0D0D0D]' : 'bg-white'} text-xs text-orange-500`}>Message</label>
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-sm mt-1" />
                </div>
                
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className={`w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 transition-all ${state.submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {state.submitting ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const Footer = ({ setCurrentPage }) => {
  const { isDark } = useTheme();
  return (
    <footer className={`${isDark ? 'bg-[#0a0a0a] border-white/[0.05]' : 'bg-gray-100 border-black/[0.05]'} border-t py-16 px-6`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 text-orange-500">
                <svg viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/><path d="M20 8 L32 20 L20 32 L8 20 Z" fill="currentColor"/></svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent">GOISMO</span>
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>Empowering innovation through technology excellence.</p>
          </div>

          {[
            { title: 'Company', links: [{ label: 'Team', id: 'team' }, { label: 'Careers', id: 'careers' }, { label: 'Contact', id: 'contact' }] },
            { title: 'Services', links: [{ label: 'SOC Services', id: 'services' }, { label: 'Products', id: 'products' }, { label: 'Portfolio', id: 'portfolio' }] },
            { title: 'Connect', links: [{ label: 'Get in Touch', id: 'contact' }] }
          ].map((col, i) => (
            <div key={i}>
              <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link, j) => (
                  <li key={j}><button onClick={() => setCurrentPage(link.id)} className={`text-sm ${isDark ? 'text-gray-500 hover:text-orange-500' : 'text-gray-600 hover:text-orange-500'} transition-colors`}>{link.label}</button></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`pt-8 border-t ${isDark ? 'border-white/[0.05]' : 'border-black/[0.05]'} flex flex-col md:flex-row justify-between items-center gap-4`}>
          <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>© 2025 Goismo Technologies India Private Limited. All rights reserved.</p>
          <a href="mailto:info@goismo.in" className="text-sm text-orange-500 hover:text-orange-400 transition-colors">info@goismo.in</a>
        </div>
      </div>
    </footer>
  );
};

export default function GoismoWebsite() {
  const [currentPage, setCurrentPage] = useState('home');
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark(!isDark);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'services': return <ServicesPage />;
      case 'portfolio': return <PortfolioPage />;
      case 'products': return <ProductsPage />;
      case 'team': return <TeamPage />;
      case 'careers': return <CareersPage />;
      case 'contact': return <ContactPage setCurrentPage={setCurrentPage} />;
      default: return (
        <>
          <HeroSection setCurrentPage={setCurrentPage} />
          <TrustIndicators />
          <PillarsSection />
          <ServicesPreview setCurrentPage={setCurrentPage} />
          <AboutSection />
          <section className={`py-24 ${isDark ? 'bg-[#141414]' : 'bg-gray-50'}`}>
            <div className="max-w-6xl mx-auto px-6">
              <GlassCard className={`text-center p-16 bg-gradient-to-r ${isDark ? 'from-orange-500/10 to-blue-500/5' : 'from-orange-500/20 to-blue-500/10'}`} hover={false}>
                <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Ready to Transform Your Business?</h2>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-lg mb-8`}>Let's discuss how Goismo can architect your digital future.</p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button onClick={() => setCurrentPage('contact')} className="px-7 py-4 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg shadow-orange-500/40 hover:-translate-y-0.5 transition-all">Start a Conversation</button>
                  <button onClick={() => setCurrentPage('services')} className={`px-7 py-4 rounded-xl font-semibold ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-black/[0.03] border-black/[0.08]'} border hover:border-orange-500 transition-all`}>Explore Services</button>
                </div>
              </GlassCard>
            </div>
          </section>
        </>
      );
    }
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <div className={`min-h-screen ${isDark ? 'bg-[#0D0D0D] text-[#E4E4E4]' : 'bg-white text-gray-900'} transition-colors duration-300`} style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes shine {
            0% { transform: translateX(-100%); }
            50%, 100% { transform: translateX(100%); }
          }
          .animate-fadeInUp { animation: fadeInUp 0.8s ease-out both; }
          .animate-shine { animation: shine 5s ease-in-out infinite; }
        `}</style>
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} scrolled={scrolled} />
        {renderPage()}
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    </ThemeContext.Provider>
  );
}
