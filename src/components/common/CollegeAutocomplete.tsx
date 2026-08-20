import React, { useState, useEffect, useRef } from 'react';
import { fetchCollegesFromSupabase, FetchedCollege } from '../../services/collegeService';
import { IndianCollege } from '../../data/indianCollegesDataset';

interface CollegeAutocompleteProps {
  value: string;
  onChange: (collegeName: string, collegeData?: IndianCollege | FetchedCollege) => void;
  placeholder?: string;
  className?: string;
  label?: string;
}

export const CollegeAutocomplete: React.FC<CollegeAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'Search 43,000+ Colleges across India (e.g. IIT Bombay, Anna University, SPPU, VIT)...',
  className = '',
  label,
}) => {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<FetchedCollege[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsLoading(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const fetched = await fetchCollegesFromSupabase(query, 30);
        setResults(fetched);
      } catch (err) {
        console.error('Error in college autocomplete fetch:', err);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [query]);

  const handleSelect = (college: FetchedCollege) => {
    setQuery(college.name);
    onChange(college.name, college);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50">
            43,000+ Live Database
          </span>
        </div>
      )}

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-lg">
          school
        </span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 250)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
        />

        {/* Loading Spinner or Clear Button */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          ) : query ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                onChange('');
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {results.map((college) => (
            <div
              key={college.id}
              onMouseDown={() => handleSelect(college)}
              className="p-3 hover:bg-indigo-50/80 dark:hover:bg-indigo-950/50 cursor-pointer transition-colors flex items-start justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                  {college.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center flex-wrap gap-1.5 mt-0.5">
                  {college.city && <span>{college.city}</span>}
                  {college.district && college.district !== college.city && (
                    <span>({college.district})</span>
                  )}
                  {college.state && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span>{college.state}</span>
                    </>
                  )}
                  {college.category && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">
                        {college.category}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                  college.tier === 'Tier 1'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {college.tier || 'Tier 2'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

