import { useState, useEffect } from 'react';

const Footer = () => {

    return (
      <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-4">Product</h4>
                        <div className="space-y-2">
                          {['Features', 'Pricing', 'Integrations', 'API'].map((item) => (
                            <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                              {item}
                            </a>
                          ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Company</h4>
                        <div className="space-y-2">
                          {['About Us', 'Careers', 'Press', 'Contact'].map((item) => (
                            <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                              {item}
                            </a>
                          ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Resources</h4>
                        <div className="space-y-2">
                          {['Documentation', 'Help Center', 'Blog', 'Community'].map((item) => (
                            <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                              {item}
                            </a>
                          ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4">Legal</h4>
                        <div className="space-y-2">
                          {['Privacy Policy', 'Terms of Service', 'Security', 'Compliance'].map((item) => (
                            <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors">
                              {item}
                            </a>
                          ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 DataFlow. All rights reserved.</p>
                </div>
            </div>
      </footer>
    )
}


export default Footer