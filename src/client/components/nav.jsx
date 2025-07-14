import {useState, useEffect} from 'react'
import { Menu, X } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
// import FifthSenseLogo from '../assets/imgs/logo.jsx'
// import FifthSenseLogo from '../assets/imgs/fifthsense_logo.png'

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => {
          setScrolled(window.scrollY > 50);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    return(
      <nav className={`fixed top-0 w-full z-50 transition-all-smooth ${
        scrolled 
          ? 'bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-700' 
          : 'bg-gray-900/80 backdrop-blur-md'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to='/' className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex gap-2 items-center">
              FifthSense
            </Link>
            <div className="hidden md:flex space-x-8">
              {['Solutions', 'Features', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-purple-400 font-medium transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            
            <div className="hidden md:block">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate('/auth', {state: { hadSignedUp: false}})}
              >
                Get Started
              </button>
            </div>

            <button
              className="md:hidden text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              {['Solutions', 'Features', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-300 hover:text-purple-400 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full font-semibold" 
                onClick={() => navigate('/auth', {state: { hadSignedUp: false}})}
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>
    )
}

export default Navbar