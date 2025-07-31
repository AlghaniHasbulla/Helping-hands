// src/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Globe, Award, HandCoins } from 'lucide-react';

const About = () => {
  // Team members
  const teamMembers = [
    {
      id: 1,
      name: 'George Evans',
      role: 'Founder & CEO',
      bio: 'Former nonprofit director with 15+ years in humanitarian work.'
    },
    {
      id: 2,
      name: 'Isaac Juma',
      role: 'Technology Director',
      bio: 'Tech entrepreneur passionate about social impact solutions.'
    },
    {
      id: 3,
      name: 'Brian Okello',
      role: 'Partnership Manager',
      bio: 'Expert in building strategic alliances for social causes.'
    },
    {
      id: 4,
      name: 'Cornelius Chebet',
      role: 'Community Outreach',
      bio: 'Grassroots organizer with extensive community networks.'
    },
    {
      id: 5,
      name: 'Adrian Amoke',
      role: 'Community Outreach',
      bio: 'Grassroots organizer with extensive community networks.'
    },
  ];

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Helping Hands</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            We're building a global community where compassion meets action to create meaningful change.
          </p>
        </div>
      </div>


      {/* Mission & Values */}
      <div className="bg-blue-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission & Values</h2>
            <p className="text-blue-700 max-w-3xl mx-auto">
              These principles guide everything we do at Helping Hands
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="text-blue-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Compassion</h3>
              <p className="text-blue-700 text-center">
                We believe in the inherent worth of every individual and approach our work with empathy and kindness.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Integrity</h3>
              <p className="text-blue-700 text-center">
                We maintain the highest standards of transparency and accountability in all our operations.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">Impact</h3>
              <p className="text-blue-700 text-center">
                We focus on creating sustainable, measurable change in the communities we serve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Impact</h2>
          <p className="text-blue-700 max-w-3xl mx-auto">
            Together with our community, we've achieved remarkable results
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">$25M+</div>
            <div className="text-blue-100">Raised for Charities</div>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">500K+</div>
            <div className="text-blue-100">People Helped</div>
          </div>
          <div className="bg-blue-600 text-white p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">42</div>
            <div className="text-blue-100">Countries Reached</div>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-xl text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">250+</div>
            <div className="text-blue-100">Charity Partners</div>
          </div>
        </div>

      </div>

      {/* Our Team */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Meet Our Team</h2>
            <p className="text-blue-700 max-w-3xl mx-auto">
              Passionate individuals dedicated to making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-blue-50 rounded-xl overflow-hidden shadow-sm">
                <div className="h-48 bg-blue-200 flex items-center justify-center">
                  <div className="bg-blue-300 rounded-full w-24 h-24 flex items-center justify-center text-blue-700">
                    <Users className="w-12 h-12" />
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-blue-900">{member.name}</h3>
                  <p className="text-blue-600 mb-3">{member.role}</p>
                  <p className="text-blue-700">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
          
      
        </div>
      </div>

    
    </div>
  );
};

export default About;