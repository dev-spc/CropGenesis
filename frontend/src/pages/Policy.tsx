import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Globe, Calendar, Users, IndianRupee } from 'lucide-react';
import { policiesData } from '@/data/data';
import Navbar from '@/components/Navbar';

const PolicyDashboard = () => {
  const [selectedState, setSelectedState] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const allPolicies = useMemo(() => {
    const policies = [];
    Object.entries(policiesData).forEach(([state, data]) => {
      data.schemes.forEach(scheme => {
        policies.push({ ...scheme, state });
      });
    });
    return policies;
  }, []);

  const states = ['All', ...Object.keys(policiesData)];

  const filteredPolicies = useMemo(() => {
    let filtered = allPolicies;
    
    if (selectedState !== 'All') {
      filtered = filtered.filter(policy => policy.state === selectedState);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(policy => 
        policy.scheme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedState, searchTerm, allPolicies]);

  const PolicyCard = ({ policy }) => (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            policy.state === 'Central' 
              ? 'bg-yellow-500 text-yellow-900' 
              : 'bg-green-500 text-green-900'
          }`}>
            {policy.state === 'Central' ? 'Central Scheme' : `${policy.state} State`}
          </span>
          <div className="flex items-center text-sm opacity-90">
            <Calendar className="w-4 h-4 mr-1" />
            {policy.last_updated}
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">{policy.scheme_name}</h3>
        <p className="text-blue-100 text-sm leading-relaxed">{policy.description}</p>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Benefits */}
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
          <div className="flex items-center mb-2">
            <IndianRupee className="w-5 h-5 text-green-600 mr-2" />
            <h4 className="font-semibold text-green-800">Benefits Offered</h4>
          </div>
          <p className="text-green-700 text-sm">{policy.benefits_offered}</p>
        </div>

        {/* Eligibility */}
        <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
          <div className="flex items-center mb-2">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-blue-800">Eligibility Criteria</h4>
          </div>
          <p className="text-blue-700 text-sm">{policy.eligibility_criteria}</p>
        </div>

        {/* How to Apply */}
        <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
          <h4 className="font-semibold text-purple-800 mb-2">How to Apply</h4>
          <p className="text-purple-700 text-sm">{policy.how_to_avail}</p>
        </div>

        {/* Required Documents */}
        <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-400">
          <h4 className="font-semibold text-orange-800 mb-3">Required Documents</h4>
          <div className="flex flex-wrap gap-2">
            {policy.required_documents.map((doc, index) => (
              <span key={index} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-medium">
                {doc}
              </span>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-400">
          <h4 className="font-semibold text-gray-800 mb-3">Contact Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-gray-500" />
              {policy.contact_details.department_name}
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              {policy.contact_details.helpline_number || '--'}
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              {policy.contact_details.email || '--'}
            </div>
            <div className="flex items-center text-gray-700">
              <Globe className="w-4 h-4 mr-2 text-gray-500" />
              <a href={policy.contact_details.official_website} className="text-blue-600 hover:underline">
                Official Website
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <Navbar/>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pt-32">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search policies..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* State Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-[200px]"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredPolicies.length} policies
            {selectedState !== 'All' && ` from ${selectedState}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPolicies.map((policy, index) => (
            <PolicyCard key={index} policy={policy} />
          ))}
        </div>

        {/* No Results */}
        {filteredPolicies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">No policies found</div>
            <div className="text-gray-500 text-sm">Try adjusting your search or filter criteria</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyDashboard;