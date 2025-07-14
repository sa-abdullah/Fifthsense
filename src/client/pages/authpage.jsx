import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom'
import {
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    setPersistence, 
    browserLocalPersistence, 
    browserSessionPersistence, 
    updateProfile
} from 'firebase/auth'

import { useGlobal } from '../components/global.jsx'
import googleLogo from '../assets/imgs/g-logo.png'

import { Auth } from '../../backend/auth.js'


const AuthForm = () => {
    const [hadSignedUp, setHadSignedUp] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [error, setError] = useState('')
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    const [rememberMe, setRememberMe] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { setUser } = useGlobal()

    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        location?.state?.hadSignedUp ? 
        setHadSignedUp(true): 
        setHadSignedUp(false)
    }, [location.state])



    const handleSignin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true)

        setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        if (!emailRegex.test(email)) {
            setError('Invalid Email Format'); 
            return
        }

        if (!hadSignedUp && !passwordRegex.test(password)) {
            setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol');
            return
        }

        try {
            await setPersistence(Auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
            const userCred = hadSignedUp ? 
            await signInWithEmailAndPassword(Auth, email, password) : 
            await createUserWithEmailAndPassword(Auth, email, password)
            await updateProfile(userCred.user, {
                displayName: `${firstName} ${lastName}`
            })
            setUser(userCred.user)
            // console.log('User signed in successfully', userCred.user)
            navigate('/dashboard')
            setEmail('')
            setPassword('')
            setFirstName('')
            setLastName('')
        } catch(err) {
            setError(err.message)
        }
    }

    const handleGoogleSignin = async () => {
        const provider = new GoogleAuthProvider() 
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)

        try {
            await setPersistence(Auth, rememberMe ? browserLocalPersistence : browserSessionPersistence)
            const userCred = await signInWithPopup(Auth, provider)
            console.log('user signed in successfully via Google', userCred.user)
            setUser(userCred.user)
            navigate('/dashboard')
            setEmail('')
            setPassword('')

        } catch (err) {
            setError(`Error signing in with Google ${err.message}`)
        }
    }

    return (

    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DataFlow
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            {hadSignedUp ? "Welcome back! Please sign in" : "Create your account to get started"}
          </p>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="space-y-6">
            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignin}
            //   disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg> */}
              <img src={googleLogo} alt="" className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {!hadSignedUp && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/50"
                      required={!hadSignedUp}
                    />
                  </div>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/50"
                      required={!hadSignedUp}
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/50"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            {hadSignedUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSignin}
            //   disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-medium"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {hadSignedUp ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                hadSignedUp ? "Sign In" : "Create an Account"
              )}
            </button>

            {/* Toggle Sign Up/Sign In */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                {hadSignedUp ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setHadSignedUp(!hadSignedUp)}
                  className="ml-2 text-blue-600 hover:text-blue-500 font-medium underline"
                >
                  {hadSignedUp ? "Sign Up" : "Log In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Privacy */}
        {!hadSignedUp && (
          <p className="text-center text-xs text-gray-500 mt-6">
            By creating an account, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </p>
        )}
      </div>
    </div>
    );
}


export default AuthForm