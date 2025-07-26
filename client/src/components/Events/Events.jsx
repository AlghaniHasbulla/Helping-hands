import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, Users, Heart } from 'lucide-react';
import api from '../../lib/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Event categories (static)
  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'fundraiser', name: 'Fundraisers' },
    { id: 'volunteer', name: 'Volunteering' },
    { id: 'education', name: 'Education' },
    { id: 'environment', name: 'Environment' }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/events');
        setEvents(response.data);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Join Our Community Events</h1>
          <p className="text-xl max-w-3xl mx-auto mb-8 opacity-90">
            Participate in meaningful events that bring people together to create positive change in our communities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/events/create" 
              className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Host an Event
            </Link>
            <Link 
              to="/volunteer" 
              className="bg-transparent border-2 border-white hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Events List */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap gap-4 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    category.id === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-800 border border-blue-200 hover:border-blue-400'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {loading && <p className="text-center text-blue-700 font-medium py-12">Loading events...</p>}
            {error && <p className="text-center text-red-600 font-medium py-12">{error}</p>}

            {!loading && !error && (
              <div className="space-y-6">
                {events.map((event) => (
                  <div 
                    key={event.id} 
                    className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg ${
                      event.featured ? 'border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="p-6 md:flex">
                      <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-center justify-center bg-blue-50 rounded-lg py-4">
                        <div className="text-3xl font-bold text-blue-700">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {new Date(event.date).toLocaleString('default', { month: 'short' })}
                        </div>
                        <div className="text-blue-500 mt-2 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time || 'TBD'}</span>
                        </div>
                      </div>
                      
                      <div className="md:w-3/4 md:pl-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-blue-900 mb-2">{event.title}</h3>
                            <div className="flex items-center text-blue-700 mb-3">
                              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                          {event.featured && (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <p className="text-blue-800 mb-4">{event.description}</p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center text-blue-700">
                            <Users className="h-5 w-5 mr-2" />
                            <span>{event.volunteersNeeded || 0} volunteers needed</span>
                          </div>
                          
                          <div className="flex gap-3">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                              Register
                            </button>
                            <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors">
                              <Heart className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Create Your Event</h3>
              <p className="text-blue-700 mb-4">
                Host your own fundraising or volunteer event through Helping Hands.
              </p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors">
                Submit Event
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Volunteer Spotlight</h3>
              <div className="flex items-center mb-4">
                <div className="bg-blue-200 rounded-full w-16 h-16 flex items-center justify-center text-blue-800 font-bold mr-4">
                  MJ
                </div>
                <div>
                  <h4 className="font-bold text-blue-900">Maria Johnson</h4>
                  <p className="text-blue-700">32 events participated</p>
                </div>
              </div>
              <p className="text-blue-800 italic mb-4">
                "Volunteering through Helping Hands has been one of the most rewarding experiences of my life."
              </p>
              <button className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg transition-colors">
                Become a Volunteer
              </button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Subscribe to Events</h3>
              <p className="mb-4 opacity-90">
                Get notified about upcoming events in your area.
              </p>
              <div className="space-y-4">
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-3 rounded-lg text-blue-900"
                />
                <button className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
