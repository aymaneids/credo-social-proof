import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Loader, CheckCircle, XCircle } from 'lucide-react';
import { checkUsernameAvailability, validateUsernameFormat } from '../../lib/supabase';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: '' });
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    company: '',
    username: ''
  });
  const [error, setError] = useState('');

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value.toLowerCase();
    setFormData(prev => ({ ...prev, username }));
    
    // Clear previous status
    setUsernameStatus({ checking: false, available: null, message: '' });
    
    if (!username) {
      return;
    }
    
    if (username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: false,
        message: 'Username must be at least 3 characters'
      });
      return;
    }
    
    if (username.length >= 3) {
      const formatValidation = validateUsernameFormat(username);
      if (!formatValidation.valid) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: formatValidation.message || 'Invalid format'
        });
        return;
      }
      
      setUsernameStatus({ checking: true, available: null, message: 'Checking availability...' });
      
      try {
        const { available, error } = await checkUsernameAvailability(username);
        if (error) {
          setUsernameStatus({
            checking: false,
            available: false,
            message: 'Error checking availability'
          });
        } else {
          setUsernameStatus({
            checking: false,
            available,
            message: available ? `${username} is available!` : `${username} is already taken`
          });
        }
      } catch (error) {
        setUsernameStatus({
          checking: false,
          available: false,
          message: 'Error checking availability'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        navigate('/dashboard');
      } else {
        // Validate username before signup if provided
        if (formData.username && !usernameStatus.available) {
          throw new Error('Please choose an available username');
        }
        
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          company: formData.company,
          username: formData.username
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">Credo</span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Holla,\nWelcome Back' : 'Holla,\nGet Started'}
            </h1>
            <p className="text-gray-600 text-base">
              {isLogin ? 'Hey, welcome back to your testimonial space' : 'Create your account and start collecting amazing testimonials'}
            </p>
          </div>

          {/* Auth Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Sign Up Fields - Only show when signing up */}
              {!isLogin && (
                <>
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="First Name"
                      required={!isLogin}
                    />
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                      placeholder="Last Name"
                      required={!isLogin}
                    />
                  </div>
                  
                  {/* Username */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleUsernameChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
                        placeholder="Username"
                        required={!isLogin}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {usernameStatus.checking && <Loader className="w-4 h-4 text-gray-400 animate-spin" />}
                        {!usernameStatus.checking && usernameStatus.available === true && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {!usernameStatus.checking && usernameStatus.available === false && <XCircle className="w-4 h-4 text-red-500" />}
                      </div>
                    </div>
                    {usernameStatus.message && (
                      <p className={`text-xs mt-1 ${
                        usernameStatus.available === true ? 'text-green-600' : 
                        usernameStatus.available === false ? 'text-red-600' : 'text-gray-500'
                      }`}>
                        {usernameStatus.message}
                      </p>
                    )}
                  </div>
                  
                  {/* Company */}
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                    placeholder="Company (Optional)"
                  />
                </>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                  placeholder="john@example.com"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 pr-12"
                  placeholder="••••••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Remember Me & Forgot Password */}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span className="text-sm text-gray-700">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (!isLogin && usernameStatus.available === false && !!formData.username)}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                )}
              </button>

              {/* Toggle Auth Mode */}
              <div className="text-center">
                <p className="text-gray-600">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                      setFormData({
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        company: '',
                        username: ''
                      });
                      setUsernameStatus({ checking: false, available: null, message: '' });
                    }}
                    className="ml-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          {/* Clouds */}
          <div className="absolute top-20 left-20 w-24 h-12 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute top-32 left-32 w-16 h-8 bg-white/15 rounded-full blur-sm"></div>
          <div className="absolute top-40 right-32 w-20 h-10 bg-white/20 rounded-full blur-sm"></div>
          <div className="absolute bottom-32 left-24 w-18 h-9 bg-white/15 rounded-full blur-sm"></div>
          <div className="absolute bottom-20 right-20 w-22 h-11 bg-white/20 rounded-full blur-sm"></div>
          
          {/* Security Lock */}
          <div className="absolute bottom-32 right-32 w-16 h-20 bg-white/10 rounded-lg flex items-end justify-center pb-2">
            <div className="w-6 h-3 bg-yellow-400 rounded-sm"></div>
          </div>
          
          {/* Check Circle */}
          <div className="absolute top-48 left-48 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white border-l-0 border-t-0 rotate-45 translate-y-[-1px]"></div>
            </div>
          </div>
        </div>

        {/* Main Illustration */}
        <div className="relative z-10 flex items-center justify-center">
          {/* Phone/Device */}
          <div className="relative">
            <div className="w-64 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-4 shadow-2xl transform rotate-12">
              <div className="w-full h-full bg-white/10 rounded-2xl flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="w-32 h-3 bg-white/30 rounded"></div>
                  <div className="w-24 h-3 bg-white/20 rounded"></div>
                </div>
                <div className="w-20 h-8 bg-white/30 rounded-lg"></div>
              </div>
            </div>
            
            {/* Person Character */}
            <div className="absolute -bottom-32 -left-16 z-20">
              {/* Person Body */}
              <div className="relative">
                {/* Head */}
                <div className="w-12 h-12 bg-yellow-600 rounded-full mb-2 mx-auto"></div>
                
                {/* Body */}
                <div className="w-16 h-20 bg-yellow-500 rounded-t-full relative">
                  {/* Arms */}
                  <div className="absolute -left-2 top-2 w-8 h-3 bg-yellow-500 rounded-full transform -rotate-45"></div>
                  <div className="absolute -right-2 top-2 w-8 h-3 bg-yellow-500 rounded-full transform rotate-45"></div>
                </div>
                
                {/* Legs */}
                <div className="flex justify-center space-x-1">
                  <div className="w-3 h-12 bg-blue-800 rounded-b-full"></div>
                  <div className="w-3 h-12 bg-blue-800 rounded-b-full"></div>
                </div>
                
                {/* Shoes */}
                <div className="flex justify-center space-x-1 -mt-1">
                  <div className="w-4 h-3 bg-gray-800 rounded-full"></div>
                  <div className="w-4 h-3 bg-gray-800 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Text */}
        <div className="absolute bottom-8 left-8 right-8 text-center">
          <p className="text-white/80 text-sm">
            "Collecting testimonials has never been easier. Our platform helps you build trust with authentic customer feedback."
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;