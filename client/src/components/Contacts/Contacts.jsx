// src/Contact.jsx
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We'd love to hear from you. Reach out with questions, feedback, or partnership inquiries.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-700 mr-4 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">Email Us</h3>
                    <p className="text-blue-700">contact@helpinghands.org</p>
                    <p className="text-blue-700">support@helpinghands.org</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-700 mr-4 flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">Call Us</h3>
                    <p className="text-blue-700">+1 (555) 123-4567</p>
                    <p className="text-blue-700">Mon-Fri: 9am-5pm EST</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-700 mr-4 flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-1">Visit Us</h3>
                    <p className="text-blue-700">123 Charity Lane</p>
                    <p className="text-blue-700">Compassion City, CA 90210</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  {[...Array(4)].map((_, i) => (
                    <a 
                      key={i}
                      href="#" 
                      className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      <div className="bg-blue-300 rounded-full w-6 h-6"></div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Send a Message</h2>
              <p className="text-blue-700 mb-8">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
              
              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  Thank you! Your message has been sent successfully.
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-blue-800 font-medium mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-blue-800 font-medium mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="subject" className="block text-blue-800 font-medium mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="How can we help?"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-blue-800 font-medium mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message here..."
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center px-6 py-3 font-semibold text-white rounded-lg transition-colors ${
                    isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-blue-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {[
                  {
                    question: "How do I start a fundraiser?",
                    answer: "You can create a fundraiser directly from your dashboard after signing up. Our step-by-step process will guide you through setting up your campaign."
                  },
                  {
                    question: "What percentage of donations goes to the cause?",
                    answer: "We have a 90% pass-through rate, meaning 90% of all donations go directly to the cause. The remaining 10% covers payment processing and platform maintenance costs."
                  },
                  {
                    question: "How do I volunteer for an event?",
                    answer: "Browse our events page and register for any event that interests you. Event organizers will contact you with more details once you've registered."
                  },
                  {
                    question: "Can my organization partner with Helping Hands?",
                    answer: "Absolutely! We're always looking for new charity partners. Visit our partnerships page or contact us directly to learn more about our vetting process."
                  }
                ].map((faq, index) => (
                  <div key={index} className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                    <button className="w-full text-left p-5 font-medium text-blue-900 flex justify-between items-center">
                      <span>{faq.question}</span>
                      <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="p-5 pt-0 text-blue-700">
                      {faq.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="bg-blue-200 border-t border-b border-blue-300 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-blue-900 mb-8 text-center">Our Locations</h2>
          <div className="bg-blue-300 border-2 border-dashed border-blue-400 rounded-xl w-full h-96 flex items-center justify-center text-blue-700">
            <div className="text-center">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p>Interactive Map</p>
              <p className="text-sm mt-2">Showing our headquarters and regional offices</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;