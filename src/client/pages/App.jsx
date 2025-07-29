import { useState, useEffect, useRef } from 'react';
import { BarChart3, Bot, Link, Smartphone, Shield, Zap, ArrowRight, Play } from 'lucide-react';
import Navbar from '../components/nav.jsx'
import Footer from '../components/footer.jsx'
// import { useNavigate } from 'react-router-dom '

const App = () => {
  const statsRef = useRef(null);
  const [statsAnimated, setStatsAnimated] = useState(false);

  

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsAnimated) {
          setStatsAnimated(true);
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  const AnimatedCounter = ({ end, duration = 2000, suffix = "" }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!statsAnimated) return;

      let startTime;
      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    }, [end, duration, statsAnimated]);

    const formatNumber = (num) => {
      if (end >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
      if (end >= 1000000) return (num / 1000000).toFixed(1) + 'M';
      if (end >= 1000) return (num / 1000).toFixed(1) + 'K';
      return num.toString();
    };

    return <span>{formatNumber(count)}{suffix}</span>;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <style jsx='true'>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }
        .transition-all-smooth {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      <Navbar/>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 gradient-animate">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-grid-white/10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <h1 className="text-5xl lg:text-6xl font-black leading-tight">
                Smarter Investing
                <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
                AI Insights for the Nigerian Stock Market.
                FifthSense helps you invest wisely with real-time analysis and personalized stock advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-white/20 backdrop-blur-xl text-white px-8 py-4 rounded-full font-semibold border-2 border-white/30 hover:bg-white/30 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2">
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group bg-transparent text-white px-8 py-4 rounded-full font-semibold border-2 border-white/50 hover:bg-white hover:text-purple-600 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Play className="w-5 h-5" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>
            
            <div className="animate-float">
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-ping"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Nigerian Investors
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to grow your wealth and stay ahead of the curve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={BarChart3}
              title="Real-time Stock Signals"
              description="Track market movements on the Nigerian Stock Exchange as they happen. Get alerts, updates, and price changes instantly."
              delay={0}
            />
            <FeatureCard
              icon={Bot}
              title="AI-Powered Portfolio Advisory"
              description="Let our smart algorithms do the research for you. Analyzing fundamentals, news, sentiment, and trends to suggest the best NGX-listed opportunities."
              delay={200}
            />
            <FeatureCard
              icon={Link}
              title="NGX-Focused Intelligence"
              description="From blue-chip stocks to undervalued gems, our platform understands the dynamics of Nigeria’s capital market and tailors advice accordingly."
              delay={400}
            />
            <FeatureCard
              icon={Smartphone}
              title="Accessible Anywhere"
              description="Stay in control whether you’re on mobile or desktop. FifthSense is designed for the modern Nigerian investor on the go."
              delay={600}
            />
            <FeatureCard
              icon={Shield}
              title="Security you can Trust"
              description="Bank-level encryption and compliance with GDPR, SOC 2, and other security standards to keep your data safe."
              delay={800}
            />
            <FeatureCard
              icon={Zap}
              title="Lightning Fast"
              description="Process millions of data points in seconds. Our optimized infrastructure ensures your reports load instantly."
              delay={1000}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section ref={statsRef} className="py-20 bg-gradient-to-r from-gray-900 via-purple-900/20 to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                <AnimatedCounter end={10000} suffix="+" />
              </div>
              <p className="text-gray-400 text-lg">Happy Customers</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                99.9%
              </div>
              <p className="text-gray-400 text-lg">Uptime Guarantee</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                <AnimatedCounter end={50000000000} suffix="+" />
              </div>
              <p className="text-gray-400 text-lg">Data Points Processed</p>
            </div>
            <div className="space-y-2">
              <div className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                24/7
              </div>
              <p className="text-gray-400 text-lg">Expert Support</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
            Ready to Transform Your Investment?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands of investors already using FifthSense to make smarter decisions and make profits.
          </p>
          <button className="group bg-white/20 backdrop-blur-xl text-white px-10 py-4 rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white hover:text-purple-600 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-2 mx-auto">
            <span>Start Your Free Trial</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
      <Footer />
    </div>
  );
};


const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <div 
      className="group bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-700 hover:border-purple-500/50"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}


const DashboardMockup = () => {
  return (
    <div className="relative">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 h-3 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full animate-pulse"></div>
            <div className="w-12 h-3 bg-white/30 rounded-full"></div>
          </div>
          <div className="bg-white/90 rounded-2xl p-6">
            <div className="space-y-4">
              {[85, 65, 90, 45].map((width, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg"></div>
                  <div 
                    className="h-2 bg-gradient-to-r from-purple-400 to-blue-500 rounded-full transition-all duration-2000 ease-out"
                    style={{ width: `${width}%` }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-purple-400/20 rounded-xl backdrop-blur-sm animate-pulse"></div>
            <div className="h-20 bg-blue-400/20 rounded-xl backdrop-blur-sm animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full opacity-20 animate-ping"></div>
      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-10 animate-bounce"></div>
    </div>
  )
}







export default App;