
import React, { useState } from 'react';
import ServiceFilters from './ServiceFilters';
import ServiceListingCard from './ServiceListingCard';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { services } from './ServicesData';

interface ServiceListingsProps {
    onNavigate: (page: string, data?: any) => void;
}

const MAX_BUDGET = 100000;

const ServiceListings: React.FC<ServiceListingsProps> = ({ onNavigate }) => {
    const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
    const [budget, setBudget] = useState<[number, number]>([0, MAX_BUDGET]);
    const [selectedTools, setSelectedTools] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
    const [selectedLevels, setSelectedLevels] = useState<string[]>([]);

    const handleClearFilters = () => {
        setSelectedDeliveryTime('');
        setBudget([0, MAX_BUDGET]);
        setSelectedTools([]);
        setSelectedLocations([]);
        setSelectedLanguages([]);
        setSelectedLevels([]);
    };

    const filteredServices = services.filter(service => {
        const deliveryTimeMatch = (() => {
            if (!selectedDeliveryTime || selectedDeliveryTime === 'anytime') return true;
            
            // Map packages basic delivery to filter logic if available
            const delivery = service.packages?.basic?.delivery || 100;

            if (selectedDeliveryTime === 'express') return delivery <= 1;
            if (selectedDeliveryTime === '3days') return delivery <= 3;
            if (selectedDeliveryTime === '7days') return delivery <= 7;
            return true;
        })();
        
        const budgetMatch = service.price >= budget[0] && service.price <= budget[1];

        const toolsMatch = selectedTools.length === 0 || (service.tags && selectedTools.some(tool => service.tags.includes(tool)));
        
        const locationMatch = selectedLocations.length === 0 || (service.location && selectedLocations.some(loc => service.location.includes(loc)));

        // Checking seller languages if available or defaulting
        const languageMatch = selectedLanguages.length === 0 || (service.seller?.languages && selectedLanguages.some(lang => service.seller.languages.includes(lang)));
        
        // Mock level check - assuming all are Level One if not specified for now
        const levelMatch = selectedLevels.length === 0 || selectedLevels.includes('Level One'); 

        return deliveryTimeMatch && budgetMatch && toolsMatch && locationMatch && languageMatch && levelMatch;
    });

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 lg:sticky top-6">
          <ServiceFilters 
            selectedDeliveryTime={selectedDeliveryTime}
            onDeliveryTimeChange={setSelectedDeliveryTime}
            budget={budget}
            onBudgetChange={setBudget}
            maxBudget={MAX_BUDGET}
            selectedTools={selectedTools}
            onToolsChange={setSelectedTools}
            selectedLocations={selectedLocations}
            onLocationsChange={setSelectedLocations}
            selectedLanguages={selectedLanguages}
            onLanguagesChange={setSelectedLanguages}
            selectedLevels={selectedLevels}
            onLevelsChange={setSelectedLevels}
            onClear={handleClearFilters}
          />
        </div>

        {/* Services List */}
        <div className="lg:col-span-3">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <p className="text-gray-600 mb-4 sm:mb-0">
              <span className="font-bold text-gray-800">{filteredServices.length}</span> services available
            </p>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Sort by:</span>
              <button className="flex items-center gap-1 font-semibold text-gray-800">
                Best Seller
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredServices?.map(service => (
              <ServiceListingCard key={service.id} service={service} onNavigate={onNavigate} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-12">
            <p className="text-sm text-gray-600">1 – {filteredServices.length} of {services.length}+ services available</p>
            <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">1</button>
                <button className="w-10 h-10 flex items-center justify-center border border-blue-600 bg-blue-600 text-white rounded-full">2</button>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">3</button>
                <span className="text-gray-600">...</span>
                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100"><ChevronRight className="w-5 h-5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceListings;
