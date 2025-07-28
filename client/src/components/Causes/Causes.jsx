import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Heart, Star, DollarSign, MapPin, ChevronDown } from 'lucide-react';
import api from '../../lib/api';

const Causes = () => {
  const [causes, setCauses] = useState([]);
  const [filteredCauses, setFilteredCauses] = useState([]);
  const [filters, setFilters] = useState({
    category: 'all',
    sort: 'popular',
    search: ''
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Categories for filtering
  const categories = [
    { id: 'all', name: 'All Causes' },
    { id: 'education', name: 'Education', icon: '📚' },
    { id: 'health', name: 'Health', icon: '⚕️' },
    { id: 'environment', name: 'Environment', icon: '🌳' },
    { id: 'poverty', name: 'Poverty Relief', icon: '🏠' },
    { id: 'human-rights', name: 'Human Rights', icon: '✊' },
    { id: 'animals', name: 'Animals', icon: '🐾' },
    { id: 'disaster', name: 'Disaster Relief', icon: '🚨' }
  ];

  // Load causes from backend API
  useEffect(() => {
    const fetchCauses = async () => {
      try {
        const response = await api.get('/causes');
        setCauses(response.data);
        setFilteredCauses(response.data);
      } catch (error) {
        console.error('Error fetching causes:', error);
      }
    };
    fetchCauses();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let results = [...causes];
    
    // Apply category filter
    if (filters.category !== 'all') {
      results = results.filter(cause => cause.category === filters.category);
    }
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(cause => 
        cause.title.toLowerCase().includes(searchLower) || 
        cause.description.toLowerCase().includes(searchLower) ||
        cause.location.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sorting
    switch (filters.sort) {
      case 'popular':
        results.sort((a, b) => b.donors - a.donors);
        break;
      case 'newest':
        // Simulating newest by ID - in real app would use date
        results.sort((a, b) => b.id - a.id);
        break;
      case 'urgent':
        const urgencyOrder = { critical: 3, high: 2, medium: 1, low: 0 };
        results.sort((a, b) => urgencyOrder[b.urgency] - urgencyOrder[a.urgency]);
        break;
      case 'ending':
        // Sort by closest to goal percentage
        results.sort((a, b) => {
          const aProgress = (a.raised / a.goal) * 100;
          const bProgress = (b.raised / b.goal) * 100;
          return bProgress - aProgress; // Show nearly completed first
        });
        break;
      default:
        break;
    }
    
    setFilteredCauses(results);
  }, [filters, causes]);

  const handleCategoryChange = (categoryId) => {
    setActiveTab(categoryId);
    setFilters(prev => ({ ...prev, category: categoryId }));
  };

  const handleSortChange = (sortType) => {
    setFilters(prev => ({ ...prev, sort: sortType }));
    setIsFilterOpen(false);
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Support Meaningful Causes</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 opacity-90">
            Discover and support charitable initiatives that are making a real difference in communities worldwide.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search causes by name, location, or keyword..."
              className="w-full py-4 pl-12 pr-4 rounded-full text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter Tabs */}
        <div className="mb-12">
          <div className="flex overflow-x-auto pb-2 space-x-1 md:space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`flex-shrink-0 px-4 py-3 rounded-full text-sm md:text-base font-medium flex items-center transition-colors ${
                  activeTab === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-blue-800 hover:bg-blue-100'
                }`}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Header and Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-blue-900">
              {activeTab === 'all' ? 'All Causes' : categories.find(c => c.id === activeTab).name}
            </h2>
            <p className="text-blue-700 mt-1">
              Showing {filteredCauses.length} causes
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-white px-4 py-2.5 rounded-lg text-blue-800 font-medium flex items-center border border-blue-200 hover:border-blue-400 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              {filters.sort === 'popular' && 'Most Popular'}
              {filters.sort === 'newest' && 'Newest'}
              {filters.sort === 'urgent' && 'Most Urgent'}
              {filters.sort === 'ending' && 'Ending Soon'}
              <ChevronDown className="h-5 w-5 ml-2" />
            </button>
            
            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-blue-100">
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 rounded-t-lg ${
                    filters.sort === 'popular' ? 'text-blue-600 font-medium' : 'text-blue-800'
                  }`}
                >
                  Most Popular
                </button>
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 ${
                    filters.sort === 'newest' ? 'text-blue-600 font-medium' : 'text-blue-800'
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => handleSortChange('urgent')}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 ${
                    filters.sort === 'urgent' ? 'text-blue-600 font-medium' : 'text-blue-800'
                  }`}
                >
                  Most Urgent
                </button>
                <button
                  onClick={() => handleSortChange('ending')}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 rounded-b-lg ${
                    filters.sort === 'ending' ? 'text-blue-600 font-medium' : 'text-blue-800'
                  }`}
                >
                  Ending Soon
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Causes Grid */}
        {filteredCauses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-blue-300 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mb-2">No causes found</h3>
            <p className="text-blue-700 max-w-md mx-auto">
              We couldn't find any causes matching your search. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setFilters({ category: 'all', sort: 'popular', search: '' });
                setActiveTab('all');
              }}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCauses.map((cause) => (
              <div 
                key={cause.id} 
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                {/* Cause Image */}
                <div className="h-48 bg-blue-200 relative">
                  {cause.urgency === 'critical' && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold">
                      URGENT
                    </div>
                  )}
                  {cause.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-blue-900 px-3 py-1 rounded-lg text-xs font-bold flex items-center">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" /> FEATURED
                    </div>
                  )}
                </div>
                
                {/* Cause Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
<span className="inline-block bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium">
  {categories.find(c => c.id === cause.category)?.name || 'Unknown'}
</span>
                    </div>
                    <div className="flex items-center text-blue-700 text-sm">
                      <Heart className="h-4 w-4 mr-1" />
                      <span>{cause.donors} supporters</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-blue-900 mb-2">{cause.title}</h3>
                  <p className="text-blue-700 mb-4 line-clamp-2">{cause.description}</p>
                  
                  <div className="flex items-center text-blue-700 text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{cause.location}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-blue-900 mb-1.5">
                      <span>Raised: ${cause.raised.toLocaleString()}</span>
                      <span>Goal: ${cause.goal.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ 
                          width: `${Math.min(100, (cause.raised / cause.goal) * 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-blue-900 font-medium">
                      {Math.round((cause.raised / cause.goal) * 100)}% funded
                    </div>
                    <Link 
                      to={`/cause/${cause.id}`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                    >
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Featured Causes Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl overflow-hidden shadow-lg">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Become a Monthly Supporter</h2>
              <p className="text-blue-100 text-lg mb-6">
                Join our community of recurring donors and provide sustained support to causes you care about.
              </p>
              <div className="flex flex-wrap gap-3">
                <div className="bg-blue-400 bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm">
                  <DollarSign className="h-4 w-4 inline mr-1" /> Flexible giving
                </div>
                <div className="bg-blue-400 bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm">
                  <Heart className="h-4 w-4 inline mr-1" /> Exclusive updates
                </div>
                <div className="bg-blue-400 bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm">
                  <Star className="h-4 w-4 inline mr-1" /> Supporter recognition
                </div>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center">
              <Link 
                to="/monthly-giving" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-bold py-3 px-8 rounded-full text-center transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* How Donations Help */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">How Your Donations Help</h2>
            <p className="text-blue-700 max-w-3xl mx-auto">
              Every contribution, no matter the size, creates meaningful change. Here's what your support can accomplish.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <DollarSign className="text-blue-700 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Transparent Impact</h3>
              <p className="text-blue-700">
                See exactly how your donations are being used with regular impact reports and updates.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Verified Charities</h3>
              <p className="text-blue-700">
                All causes are vetted to ensure they meet our standards of transparency and effectiveness.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-2">Sustainable Solutions</h3>
              <p className="text-blue-700">
                We prioritize initiatives that create long-term, sustainable change in communities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Causes;
