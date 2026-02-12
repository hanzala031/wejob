
import React, { useState } from 'react';
import { ChevronDown, ArrowRight, Search } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200 py-6">
      <button onClick={onToggle} className="w-full flex justify-between items-center text-left">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
          <div className="space-y-3">
            {children}
          </div>
      </div>
    </div>
  );
};

interface RadioOptionProps {
  value: string;
  label: string;
  count: string;
  checked: boolean;
  onChange: (value: string) => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({ value, label, count, checked, onChange }) => (
  <label className="flex items-center justify-between text-gray-600 cursor-pointer w-full">
    <div className="flex items-center">
      <input
        type="radio"
        name="deliveryTime"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="h-4 w-4 accent-blue-600 border-gray-300 focus:ring-blue-500"
      />
      <span className="ml-3 text-sm">{label}</span>
    </div>
    <span className="text-sm text-gray-500">({count})</span>
  </label>
);

interface CheckboxOptionProps {
  value: string;
  label: string;
  count: string;
  checked: boolean;
  onChange: (value: string, isChecked: boolean) => void;
}

const CheckboxOption: React.FC<CheckboxOptionProps> = ({ value, label, count, checked, onChange }) => (
  <label className="flex items-center justify-between text-gray-600 cursor-pointer w-full">
    <div className="flex items-center">
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={(e) => onChange(value, e.target.checked)}
        className="h-4 w-4 rounded accent-blue-600 border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-3 text-sm">{label}</span>
    </div>
    <span className="text-sm text-gray-500">({count})</span>
  </label>
);

const BudgetFilter: React.FC<{
  budget: [number, number];
  onBudgetChange: (value: [number, number]) => void;
  maxBudget: number;
}> = ({ budget, onBudgetChange, maxBudget }) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(0, Math.min(Number(e.target.value), budget[1]));
    onBudgetChange([value, budget[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(maxBudget, Math.max(Number(e.target.value), budget[0]));
    onBudgetChange([budget[0], value]);
  };
  
  const minPercent = (budget[0] / maxBudget) * 100;
  const maxPercent = 100 - (budget[1] / maxBudget) * 100;

  return (
    <div className="pt-2">
      <div className="relative h-1 bg-gray-200 rounded-full my-4">
        <div 
          className="absolute h-1 bg-blue-500 rounded-full"
          style={{ left: `${minPercent}%`, right: `${maxPercent}%` }}
        ></div>
        <div 
          className="absolute -top-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"
          style={{ left: `calc(${minPercent}% - 8px)` }}
        ></div>
        <div 
          className="absolute -top-1.5 w-4 h-4 bg-white border-2 border-blue-500 rounded-full cursor-pointer"
          style={{ right: `calc(${maxPercent}% - 8px)` }}
        ></div>
      </div>
      <div className="flex items-center justify-between gap-4 mt-6">
        <input
          type="number"
          value={budget[0]}
          onChange={handleMinChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-center"
          min={0}
          max={maxBudget}
        />
        <span className="text-gray-500">-</span>
        <input
          type="number"
          value={budget[1]}
          onChange={handleMaxChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-center"
          min={0}
          max={maxBudget}
        />
      </div>
    </div>
  );
};

interface ServiceFiltersProps {
  selectedDeliveryTime: string;
  onDeliveryTimeChange: (value: string) => void;
  budget: [number, number];
  onBudgetChange: (value: [number, number]) => void;
  maxBudget: number;
  selectedTools: string[];
  onToolsChange: (tools: string[]) => void;
  selectedLocations: string[];
  onLocationsChange: (locations: string[]) => void;
  selectedLanguages: string[];
  onLanguagesChange: (languages: string[]) => void;
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
  onClear: () => void;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  selectedDeliveryTime,
  onDeliveryTimeChange,
  budget,
  onBudgetChange,
  maxBudget,
  selectedTools,
  onToolsChange,
  selectedLocations,
  onLocationsChange,
  selectedLanguages,
  onLanguagesChange,
  selectedLevels,
  onLevelsChange,
  onClear
}) => {
  const [openSection, setOpenSection] = useState<string | null>('delivery');
  const [locationSearch, setLocationSearch] = useState('');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  const designTools = [
    { value: 'Adobe Photoshop', label: 'Adobe Photoshop', count: '1,945' },
    { value: 'Figma', label: 'Figma', count: '8,15' },
    { value: 'Sketch', label: 'Sketch', count: '654' },
    { value: 'Adobe XD', label: 'Adobe XD', count: '323' },
    { value: 'Balsamiq', label: 'Balsamiq', count: '2,455' },
  ];
  
  const locations = [
    { value: 'United States', label: 'United States', count: '1,945' },
    { value: 'United Kingdom', label: 'United Kingdom', count: '8,136' },
    { value: 'Canada', label: 'Canada', count: '917' },
    { value: 'Germany', label: 'Germany', count: '240' },
    { value: 'Turkey', label: 'Turkey', count: '2,460' },
  ];

  const languages = [
    { value: 'Turkish', label: 'Turkish', count: '1,945' },
    { value: 'English', label: 'English', count: '8,15' },
    { value: 'Italian', label: 'Italian', count: '654' },
    { value: 'Spanish', label: 'Spanish', count: '323' },
  ];

  const levels = [
    { value: 'Top Rated Seller', label: 'Top Rated Seller', count: '1,945' },
    { value: 'Level Two', label: 'Level Two', count: '8,136' },
    { value: 'Level One', label: 'Level One', count: '917' },
    { value: 'New Seller', label: 'New Seller', count: '240' },
  ];

  const handleToolChange = (tool: string, isChecked: boolean) => {
      if (isChecked) {
          onToolsChange([...selectedTools, tool]);
      } else {
          onToolsChange(selectedTools.filter(t => t !== tool));
      }
  };
  
  const handleLocationChange = (location: string, isChecked: boolean) => {
      if (isChecked) {
          onLocationsChange([...selectedLocations, location]);
      } else {
          onLocationsChange(selectedLocations.filter(l => l !== location));
      }
  };

  const handleLanguageChange = (language: string, isChecked: boolean) => {
    if (isChecked) {
        onLanguagesChange([...selectedLanguages, language]);
    } else {
        onLanguagesChange(selectedLanguages.filter(l => l !== language));
    }
  };

  const handleLevelChange = (level: string, isChecked: boolean) => {
    if (isChecked) {
        onLevelsChange([...selectedLevels, level]);
    } else {
        onLevelsChange(selectedLevels.filter(l => l !== level));
    }
  };

  const filteredLocations = locations.filter(loc =>
    loc.label.toLowerCase().includes(locationSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <FilterSection title="Delivery Time" isOpen={openSection === 'delivery'} onToggle={() => toggleSection('delivery')}>
        <RadioOption value="express" label="Express 24H" count="1,945" checked={selectedDeliveryTime === 'express'} onChange={onDeliveryTimeChange} />
        <RadioOption value="3days" label="Up to 3 days" count="8,136" checked={selectedDeliveryTime === '3days'} onChange={onDeliveryTimeChange} />
        <RadioOption value="7days" label="Up to 7 days" count="917" checked={selectedDeliveryTime === '7days'} onChange={onDeliveryTimeChange} />
        <RadioOption value="anytime" label="Anytime" count="240" checked={selectedDeliveryTime === 'anytime'} onChange={onDeliveryTimeChange} />
      </FilterSection>

      <FilterSection title="Budget" isOpen={openSection === 'budget'} onToggle={() => toggleSection('budget')}>
        <BudgetFilter budget={budget} onBudgetChange={onBudgetChange} maxBudget={maxBudget} />
      </FilterSection>

      <FilterSection title="Design Tool" isOpen={openSection === 'tools'} onToggle={() => toggleSection('tools')}>
        {designTools.map(tool => (
            <CheckboxOption
                key={tool.value}
                value={tool.value}
                label={tool.label}
                count={tool.count}
                checked={selectedTools.includes(tool.value)}
                onChange={handleToolChange}
            />
        ))}
        <button className="text-blue-600 font-semibold text-sm hover:underline mt-2">+20 more</button>
      </FilterSection>

      <FilterSection title="Location" isOpen={openSection === 'location'} onToggle={() => toggleSection('location')}>
        <div className="relative mb-4">
            <input 
                type="text" 
                placeholder="Search" 
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 pl-4 pr-10 focus:ring-blue-500 focus:border-blue-500" 
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        {filteredLocations.map(loc => (
            <CheckboxOption
                key={loc.value}
                value={loc.value}
                label={loc.label}
                count={loc.count}
                checked={selectedLocations.includes(loc.value)}
                onChange={handleLocationChange}
            />
        ))}
        <button className="text-blue-600 font-semibold text-sm hover:underline mt-2">+20 more</button>
      </FilterSection>

      <FilterSection title="Speaks" isOpen={openSection === 'speaks'} onToggle={() => toggleSection('speaks')}>
        {languages.map(lang => (
            <CheckboxOption
                key={lang.value}
                value={lang.value}
                label={lang.label}
                count={lang.count}
                checked={selectedLanguages.includes(lang.value)}
                onChange={handleLanguageChange}
            />
        ))}
        <button className="text-blue-600 font-semibold text-sm hover:underline mt-2">+20 more</button>
      </FilterSection>

      <FilterSection title="Level" isOpen={openSection === 'level'} onToggle={() => toggleSection('level')}>
        {levels.map(level => (
            <CheckboxOption
                key={level.value}
                value={level.value}
                label={level.label}
                count={level.count}
                checked={selectedLevels.includes(level.value)}
                onChange={handleLevelChange}
            />
        ))}
      </FilterSection>

      <button onClick={onClear} className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors">
        Clear <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ServiceFilters;
