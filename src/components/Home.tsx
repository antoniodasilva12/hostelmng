import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Cog, BarChart, Brain, Clock, Shield, Calendar, ArrowRight, Check } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();

  const features = [
    'Smart Room Allocation System',
    'Real-time Maintenance Requests',
    'AI-Powered Chat Assistant',
    'Digital Meal Management',
    'Secure Payment System',
    'Student Community Portal'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Welcome to</span>
                  <span className="block text-indigo-600">SmartHostel AI</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Experience the future of hostel living with our AI-powered management system. 
                  Smart solutions for comfortable and efficient student accommodation.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={() => navigate('/auth')}
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80"
            alt="Modern hostel interior"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need in one place
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our comprehensive hostel management system provides all the tools you need for a seamless experience.
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 bg-indigo-50 px-4 py-3 rounded-lg">
                  <Check className="h-5 w-5 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block">Join SmartHostel AI today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-100">
            Experience the most advanced hostel management system designed for modern student living.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Sign up now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-base text-gray-500">
            © 2024 SmartHostel AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: 'AI-Powered Room Allocation',
    description: 'Smart algorithms ensure optimal room distribution based on preferences and availability.',
    icon: Building2,
  },
  {
    title: 'Automated Management',
    description: 'Streamlined check-in/out processes and maintenance request handling.',
    icon: Cog,
  },
  {
    title: 'Real-time Analytics',
    description: 'Comprehensive insights into occupancy rates and resource utilization.',
    icon: BarChart,
  },
  {
    title: 'AI Assistant',
    description: '24/7 intelligent chatbot support for students and staff.',
    icon: Brain,
  },
  {
    title: 'Real-time Monitoring',
    description: 'Instant updates on room status and maintenance requests.',
    icon: Clock,
  },
  {
    title: 'Secure Access',
    description: 'Role-based access control and data protection.',
    icon: Shield,
  },
]; 