// src/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, HandCoins, Users, Calendar, Globe, Star } from 'lucide-react';

const Home = () => {
  // Sample data for the home page
  const featuredCauses = [
    {
      id: 1,
      title: 'Education for Children',
      description: 'Support underprivileged children access quality education',
      progress: 75,
      raised: 12000,
      goal: 16000
    },
    {
      id: 2,
      title: 'Clean Water Initiative',
      description: 'Provide clean drinking water to rural communities',
      progress: 45,
      raised: 9000,
      goal: 20000
    },
    {
      id: 3,
      title: 'Medical Relief Fund',
      description: 'Medical supplies for disaster-stricken regions',
      progress: 90,
      raised: 18000,
      goal: 20000
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Charity Run 2025',
      date: 'Oct 15, 2025',
      location: 'Central Park',
      description: '5K run to raise funds for homeless shelters'
    },
    {
      id: 2,
      title: 'Food Drive',
      date: 'Nov 5, 2025',
      location: 'Community Center',
      description: 'Collect non-perishable food items for food banks'
    },
    {
      id: 3,
      title: 'Fundraising Gala',
      date: 'Dec 10, 2025',
      location: 'Grand Ballroom',
      description: 'Annual fundraising dinner and auction'
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Donor',
      content: 'Helping Hands made it so easy to support causes I care about. I can see exactly where my donations are going!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Volunteer',
      content: 'Volunteering through this platform connected me with amazing organizations doing vital work in my community.',
      rating: 5
    },
    {
      id: 3,
      name: 'Amina Diallo',
      role: 'Charity Director',
      content: 'The support we received through Helping Hands transformed our ability to serve vulnerable populations.',
      rating: 5
    }
  ];

  return (
    <div className="bg-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 md:py-32 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
              Together, We Can Make a Difference
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl">
              Join thousands of compassionate people supporting causes that matter. Every contribution creates positive change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/donate" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full text-center transition duration-300"
              >
                Donate Now
              </Link>
              <Link 
                to="/causes" 
                className="bg-transparent border-2 border-white hover:bg-blue-700 font-bold py-3 px-8 rounded-full text-center transition duration-300"
              >
                Explore Causes
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="bg-blue-500 rounded-full w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
                <div className="bg-blue-400 rounded-full w-60 h-60 md:w-72 md:h-72 flex items-center justify-center">
                  <Heart className="w-32 h-32" strokeWidth={1.5} />
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-blue-800 p-4 rounded-xl shadow-lg w-48">
                <div className="text-2xl font-bold">5,000+</div>
                <div className="text-sm">People Helped</div>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white text-blue-800 p-4 rounded-xl shadow-lg w-48">
                <div className="text-2xl font-bold">$1.2M+</div>
                <div className="text-sm">Raised</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Our Impact</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Since 2015, we've connected donors with causes that transform lives and communities around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <HandCoins className="text-blue-700 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">$5.2M+</h3>
              <p className="text-blue-700">Raised for Charities</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="text-blue-700 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">250+</h3>
              <p className="text-blue-700">Charities Supported</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="text-blue-700 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">42</h3>
              <p className="text-blue-700">Countries Impacted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Causes */}
      <section className="py-16 bg-blue-100 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Featured Causes</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Support these urgent initiatives making a real difference in people's lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCauses.map((cause) => (
              <div key={cause.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
                <div className="h-48 bg-blue-200 relative">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-4">
                    <h3 className="text-xl font-bold text-white">{cause.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-blue-800 mb-4">{cause.description}</p>
                  
                  <div className="mb-3">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${cause.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-blue-900 mb-4">
                    <span>${cause.raised.toLocaleString()} raised</span>
                    <span>${cause.goal.toLocaleString()} goal</span>
                  </div>
                  
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-300">
                    Donate Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/causes" 
              className="inline-block border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 px-8 rounded-full transition duration-300"
            >
              View All Causes
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">How Helping Hands Works</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Making a difference has never been easier. Join us in three simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Choose a Cause</h3>
              <p className="text-blue-700">
                Browse our verified charities and select a cause that resonates with you.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Make a Donation</h3>
              <p className="text-blue-700">
                Contribute any amount - every dollar makes a difference to those in need.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">Track Impact</h3>
              <p className="text-blue-700">
                See exactly how your donation is being used to create positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-blue-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">Upcoming Events</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Join our community events and make a hands-on difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="h-48 bg-blue-300 relative">
                  <div className="absolute top-4 left-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    <div className="text-xl font-bold">{event.date.split(',')[0].split(' ')[1]}</div>
                    <div className="text-sm">{event.date.split(' ')[0]}</div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-blue-700 mb-3">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-blue-700 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{event.location}</span>
                  </div>
                  <p className="text-blue-800 mb-4">{event.description}</p>
                  <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-medium py-2.5 rounded-lg transition duration-300">
                    Register Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/events" 
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
            >
              See All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">What People Say</h2>
            <p className="text-blue-700 max-w-2xl mx-auto">
              Hear from donors, volunteers, and charity partners about their experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-blue-800 italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-blue-200 rounded-full w-12 h-12 flex items-center justify-center text-blue-800 font-bold mr-4">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">{testimonial.name}</h4>
                    <p className="text-blue-700">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-600 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto">
            Join our community of changemakers today. Together, we can create a better world for everyone.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/sign-up" 
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full transition duration-300"
            >
              Create Account
            </Link>
            <Link 
              to="/causes" 
              className="bg-transparent border-2 border-white hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
            >
              Browse Causes
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Helping Hands</span>
            </div>
            <p className="text-blue-200 mb-6">
              Connecting compassionate donors with causes that transform lives and communities.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-blue-200 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm-1 15h-2v-7h2v7zm-1-8.272c-.619 0-1.126-.508-1.126-1.125 0-.619.507-1.127 1.126-1.127.62 0 1.126.508 1.126 1.127 0 .617-.507 1.125-1.126 1.125zm8 4.272h-1.5v3.5h-2v-3.5h-1v-2h1v-.75c0-1.034.62-1.75 1.5-1.75.62 0 1 .25 1 .25v1.5h-.875c-.125 0-.125.125-.125.125v.875h1.625l-.25 2z"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/></svg>
              </a>
              <a href="#" className="text-blue-200 hover:text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white">Home</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Causes</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Events</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Causes</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-blue-200 hover:text-white">Education</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Health</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Environment</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Poverty</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Human Rights</a></li>
              <li><a href="#" className="text-blue-200 hover:text-white">Disaster Relief</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Contact Us</h3>
            <ul className="space-y-3 text-blue-200">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Charity Lane, Compassion City</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>info@helpinghands.org</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-blue-800 text-center text-blue-400">
          <p>© 2023 Helping Hands. All rights reserved. Charity Registration #12345-67</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;