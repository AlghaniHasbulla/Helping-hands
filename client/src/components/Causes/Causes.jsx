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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Fetch causes from backend API
  useEffect(() => {
    const fetchCauses = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/causes');
        setCauses(response.data);
        setFilteredCauses(response.data);
      } catch (err) {
        setError('Failed to load causes. Please try again later.');
      } finally {
        setLoading(false);
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
        results.sort((a, b) => (b.donors || 0) - (a.donors || 0));
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
          const aProgress = ((a.raised || a.amount_raised) / (a.goal || a.amount_target)) * 100;
          const bProgress = ((b.raised || b.amount_raised) / (b.goal || b.amount_target)) * 100;
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
              {activeTab === 'all' ? 'All Causes' : categories.find(c => c.id === activeTab)?.name}
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

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-blue-700 font-medium py-12">
            Loading causes...
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 font-medium py-12">
            {error}
          </div>
        )}

        {/* Causes Grid */}
        {!loading && !error && (
          filteredCauses.length === 0 ? (
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
                        <span>{cause.donors || 0} supporters</span>
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
                        <span>Raised: ${cause.raised?.toLocaleString() || (cause.amount_raised?.toLocaleString() || '0')}</span>
                        <span>Goal: ${cause.goal?.toLocaleString() || (cause.amount_target?.toLocaleString() || '0')}</span>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ 
                            width: `${Math.min(100, ((cause.raised || cause.amount_raised) / (cause.goal || cause.amount_target)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="text-blue-900 font-medium">
                        {Math.round(((cause.raised || cause.amount_raised) / (cause.goal || cause.amount_target)) * 100)}% funded
                      </div>
                      <Link 
                        to={`/donate/${cause.id}`} 
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                      >
                        Donate
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Causes;
