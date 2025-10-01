'use client';

import React, { useState } from 'react';
import { ChevronDown, Users, Target, Award, Phone, Mail, MapPin, Menu, X, ArrowRight, CheckCircle, Star } from 'lucide-react';

const AATopTalent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Executive Search",
      description: "C-level and senior executive placements across all industries",
      icon: <Target className="w-8 h-8" />
    },
    {
      title: "Professional Staffing",
      description: "Mid-level professionals and specialized roles",
      icon: <Users className="w-8 h-8" />
    },
    {
      title: "Contract Placement",
      description: "Temporary and contract-to-hire solutions",
      icon: <Award className="w-8 h-8" />
    }
  ];

  const specialties = [
    "Financial Services", "Technology", "Healthcare", "Manufacturing", 
    "Legal", "Marketing", "Sales", "Operations"
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "CEO, TechCorp",
      quote: "A&A Top Talent found us the perfect CFO in just 3 weeks. Their understanding of our needs was exceptional.",
      rating: 5
    },
    {
      name: "Michael Chen",
      title: "VP Operations, Global Industries",
      quote: "The quality of candidates they presented was outstanding. True professionals who understand talent acquisition.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-blue-900">
                A&A Top Talent
              </div>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-8">
                <a href="#services" className="text-gray-700 hover:text-blue-900 transition-colors">Services</a>
                <a href="#about" className="text-gray-700 hover:text-blue-900 transition-colors">About</a>
                <a href="#process" className="text-gray-700 hover:text-blue-900 transition-colors">Process</a>
                <a href="#contact" className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors">Contact Us</a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#services" className="block px-3 py-2 text-gray-700 hover:text-blue-900">Services</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-900">About</a>
              <a href="#process" className="block px-3 py-2 text-gray-700 hover:text-blue-900">Process</a>
              <a href="#contact" className="block px-3 py-2 bg-blue-900 text-white rounded-lg mx-3">Contact Us</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Next
              <span className="text-blue-900 block">Top Talent</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A&A Top Talent connects exceptional professionals with leading companies. 
              We specialize in executive search and professional staffing across multiple industries.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="bg-blue-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-800 transition-colors flex items-center justify-center">
                Hire Top Talent <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-blue-900 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-900 hover:text-white transition-colors">
                Find Your Next Role
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive recruiting solutions tailored to your unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`p-8 rounded-xl border-2 cursor-pointer transition-all ${
                  activeService === index
                    ? 'border-blue-900 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => setActiveService(index)}
              >
                <div className="text-blue-900 mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>

          {/* Industry Specialties */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Industry Specialties</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-900 px-4 py-2 rounded-full font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">Proven methodology for successful placements</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Discovery", desc: "Understanding your specific needs and culture" },
              { step: "2", title: "Search", desc: "Leveraging our network and advanced sourcing" },
              { step: "3", title: "Evaluation", desc: "Comprehensive candidate assessment and screening" },
              { step: "4", title: "Placement", desc: "Seamless onboarding and follow-up support" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose A&A Top Talent?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Proven Track Record</h3>
                    <p className="text-gray-600">Over 500 successful placements across various industries and roles.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Extensive Network</h3>
                    <p className="text-gray-600">Deep connections with top professionals and industry leaders.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Service</h3>
                    <p className="text-gray-600">Dedicated attention to both client and candidate needs.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Guarantee</h3>
                    <p className="text-gray-600">Comprehensive guarantee period on all permanent placements.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-900 to-indigo-800 p-8 rounded-2xl text-white">
              <h3 className="text-2xl font-bold mb-6">By the Numbers</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">500+</div>
                  <div className="text-blue-200">Successful Placements</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">95%</div>
                  <div className="text-blue-200">Client Satisfaction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">21</div>
                  <div className="text-blue-200">Average Days to Hire</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">8+</div>
                  <div className="text-blue-200">Industries Served</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Top Talent?</h2>
            <p className="text-xl text-blue-100">Let's discuss how we can help you achieve your hiring goals</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-bold mb-8">Get In Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 mr-4 text-blue-300" />
                  <span className="text-lg">(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 mr-4 text-blue-300" />
                  <span className="text-lg">info@aatoptalent.com</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 mr-4 text-blue-300" />
                  <span className="text-lg">New York, NY</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h3>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>I'm looking to hire</option>
                  <option>I'm looking for a job</option>
                  <option>General inquiry</option>
                </select>
                <textarea
                  rows={4}
                  placeholder="Tell us about your needs..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
                <button
                  onClick={() => alert('Message sent! We\'ll get back to you soon.')}
                  className="w-full bg-blue-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-2xl font-bold mb-4">A&A Top Talent</div>
            <p className="text-gray-400 mb-6">Connecting exceptional talent with leading companies</p>
            <div className="text-gray-500">
              © 2025 A&A Top Talent. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function Page() {
  return <AATopTalent />;
}
