import React, { useState, useEffect, useRef } from 'react';
import { usePassport } from '../../context/PassportContext';
import { fetchCollegesFromSupabase, FetchedCollege } from '../../services/collegeService';

export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  semester: number;
  credits: number;
  type: 'Core' | 'Elective' | 'Lab' | 'Project';
}

// Indian States & Union Territories for Filter Dropdown
export const INDIAN_STATES = [
  'All States',
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

// All Available Degrees in India
export const INDIAN_DEGREES = [
  // B.Tech / B.E. Degrees
  { code: 'BTech-CSE', name: 'B.Tech / B.E. - Computer Science & Engineering (CSE)', category: 'Engineering' },
  { code: 'BTech-IT', name: 'B.Tech / B.E. - Information Technology (IT)', category: 'Engineering' },
  { code: 'BTech-AIML', name: 'B.Tech / B.E. - Artificial Intelligence & Machine Learning (AI & ML)', category: 'Engineering' },
  { code: 'BTech-DS', name: 'B.Tech / B.E. - Data Science & Analytics', category: 'Engineering' },
  { code: 'BTech-ECE', name: 'B.Tech / B.E. - Electronics & Communication Engineering (ECE)', category: 'Engineering' },
  { code: 'BTech-EEE', name: 'B.Tech / B.E. - Electrical & Electronics Engineering (EEE)', category: 'Engineering' },
  { code: 'BTech-MECH', name: 'B.Tech / B.E. - Mechanical Engineering', category: 'Engineering' },
  { code: 'BTech-CIVIL', name: 'B.Tech / B.E. - Civil Engineering', category: 'Engineering' },
  { code: 'BTech-ROBOTICS', name: 'B.Tech / B.E. - Robotics & Automation', category: 'Engineering' },

  // B.Sc & BCA Degrees
  { code: 'BCA', name: 'BCA - Bachelor of Computer Applications', category: 'Computer Applications' },
  { code: 'BSc-CS', name: 'B.Sc - Computer Science (Honours)', category: 'Sciences' },
  { code: 'BSc-DS', name: 'B.Sc - Data Science & Artificial Intelligence', category: 'Sciences' },
  { code: 'BSc-IT', name: 'B.Sc - Information Technology', category: 'Sciences' },
  { code: 'BSc-MATH', name: 'B.Sc - Mathematics & Statistics', category: 'Sciences' },

  // Commerce & Management
  { code: 'BCom-HONS', name: 'B.Com - Bachelor of Commerce (Honours)', category: 'Commerce' },
  { code: 'BCom-AF', name: 'B.Com - Accounting & Finance', category: 'Commerce' },
  { code: 'BBA', name: 'BBA - Bachelor of Business Administration', category: 'Management' },
  { code: 'BDes-UIUX', name: 'B.Des - Bachelor of Design (UI/UX & Interactive Media)', category: 'Design' },

  // Postgraduate Degrees
  { code: 'MTech-CSE', name: 'M.Tech / M.E. - Computer Science & Engineering', category: 'Postgraduate' },
  { code: 'MTech-AI', name: 'M.Tech / M.E. - Artificial Intelligence & Data Engineering', category: 'Postgraduate' },
  { code: 'MCA', name: 'MCA - Master of Computer Applications', category: 'Postgraduate' },
  { code: 'MSc-CS', name: 'M.Sc - Computer Science / Data Science', category: 'Postgraduate' },
  { code: 'MBA-TECH', name: 'MBA - Technology Management / Business Analytics', category: 'Postgraduate' },
  { code: 'PhD-CS', name: 'Ph.D. - Computer Science & Engineering', category: 'Doctorate' }
];

// Academic Years / Levels
export const ACADEMIC_YEAR_LEVELS = [
  { id: '1st-year', label: 'First Year (1st Year / Semester 1 & 2)', yearNum: 1 },
  { id: '2nd-year', label: 'Second Year (2nd Year / Semester 3 & 4)', yearNum: 2 },
  { id: '3rd-year', label: 'Third Year (3rd Year / Semester 5 & 6)', yearNum: 3 },
  { id: '4th-year', label: 'Fourth Year (4th Year / Semester 7 & 8)', yearNum: 4 },
  { id: '5th-year', label: 'Fifth Year (5th Year - Dual / Integrated Program)', yearNum: 5 },
  { id: 'alumni', label: 'Graduated / Alumni (Class of 2026)', yearNum: 4 }
];

// Academic Batches
export const ACADEMIC_BATCHES = [
  '2026 - 2030 (Admitted 2026)',
  '2025 - 2029',
  '2024 - 2028 (Current 2nd Year)',
  '2023 - 2027 (Current 3rd Year)',
  '2022 - 2026 (Graduating Batch 2026)',
  '2021 - 2025',
  '2020 - 2024'
];

// Subject Curricula Mapping by Degree and Academic Year
export const SUBJECT_CURRICULA: Record<string, Record<number, SubjectItem[]>> = {
  'BTech-CSE': {
    1: [
      { id: 'sub-101', code: 'MA101', name: 'Engineering Mathematics - I (Linear Algebra & Calculus)', semester: 1, credits: 4, type: 'Core' },
      { id: 'sub-102', code: 'PH101', name: 'Engineering Physics & Electromagnetism', semester: 1, credits: 4, type: 'Core' },
      { id: 'sub-103', code: 'CS101', name: 'Programming for Problem Solving (C Language)', semester: 1, credits: 4, type: 'Core' },
      { id: 'sub-104', code: 'EE101', name: 'Basic Electrical & Electronics Engineering', semester: 1, credits: 3, type: 'Core' },
      { id: 'sub-105', code: 'CS102', name: 'C Programming & Data Structures Lab', semester: 1, credits: 2, type: 'Lab' },
      { id: 'sub-106', code: 'MA102', name: 'Engineering Mathematics - II (Differential Equations)', semester: 2, credits: 4, type: 'Core' },
      { id: 'sub-107', code: 'CS103', name: 'Data Structures & Fundamentals', semester: 2, credits: 4, type: 'Core' },
      { id: 'sub-108', code: 'EC102', name: 'Digital Logic & Microprocessor Fundamentals', semester: 2, credits: 3, type: 'Core' }
    ],
    2: [
      { id: 'sub-201', code: 'MA201', name: 'Discrete Mathematics & Graph Theory', semester: 3, credits: 4, type: 'Core' },
      { id: 'sub-202', code: 'CS201', name: 'Object-Oriented Programming (Java / C++)', semester: 3, credits: 4, type: 'Core' },
      { id: 'sub-203', code: 'CS202', name: 'Computer Organization & Architecture (COA)', semester: 3, credits: 4, type: 'Core' },
      { id: 'sub-204', code: 'CS203', name: 'Database Management Systems (DBMS)', semester: 3, credits: 4, type: 'Core' },
      { id: 'sub-205', code: 'CS204', name: 'DBMS & Java OOPs Laboratory', semester: 3, credits: 2, type: 'Lab' },
      { id: 'sub-206', code: 'CS205', name: 'Operating Systems & System Programming', semester: 4, credits: 4, type: 'Core' },
      { id: 'sub-207', code: 'CS206', name: 'Theory of Computation & Automata (TOC)', semester: 4, credits: 4, type: 'Core' },
      { id: 'sub-208', code: 'CS207', name: 'Software Engineering & Agile Practices', semester: 4, credits: 3, type: 'Core' }
    ],
    3: [
      { id: 'sub-301', code: 'CS301', name: 'Design & Analysis of Algorithms (DAA)', semester: 5, credits: 4, type: 'Core' },
      { id: 'sub-302', code: 'CS302', name: 'Computer Networks & Protocols (TCP/IP)', semester: 5, credits: 4, type: 'Core' },
      { id: 'sub-303', code: 'CS303', name: 'Artificial Intelligence & Machine Learning', semester: 5, credits: 4, type: 'Core' },
      { id: 'sub-304', code: 'CS304', name: 'Web Technologies & Full Stack (React/Node)', semester: 5, credits: 3, type: 'Elective' },
      { id: 'sub-305', code: 'CS305', name: 'Compiler Design & Language Processors', semester: 6, credits: 4, type: 'Core' },
      { id: 'sub-306', code: 'CS306', name: 'Cryptography & Information Security', semester: 6, credits: 4, type: 'Core' },
      { id: 'sub-307', code: 'CS307', name: 'Cloud Computing & Microservices Architecture', semester: 6, credits: 3, type: 'Elective' }
    ],
    4: [
      { id: 'sub-401', code: 'CS401', name: 'Distributed Systems & Big Data Processing', semester: 7, credits: 4, type: 'Core' },
      { id: 'sub-402', code: 'CS402', name: 'Deep Learning & Neural Networks', semester: 7, credits: 3, type: 'Elective' },
      { id: 'sub-403', code: 'CS403', name: 'DevOps & Automated Deployment Pipelines', semester: 7, credits: 3, type: 'Elective' },
      { id: 'sub-404', code: 'CS404', name: 'Capstone Major Project & Research Dissertation', semester: 8, credits: 10, type: 'Project' }
    ]
  },
  'BTech-AIML': {
    1: [
      { id: 'sub-ai-101', code: 'MA101', name: 'Linear Algebra, Probability & Statistics for AI', semester: 1, credits: 4, type: 'Core' },
      { id: 'sub-ai-102', code: 'CS101', name: 'Python Programming for Artificial Intelligence', semester: 1, credits: 4, type: 'Core' },
      { id: 'sub-ai-103', code: 'CS103', name: 'Data Structures & Algorithms', semester: 2, credits: 4, type: 'Core' }
    ],
    2: [
      { id: 'sub-ai-201', code: 'AI201', name: 'Machine Learning Algorithms & Optimization', semester: 3, credits: 4, type: 'Core' },
      { id: 'sub-ai-202', code: 'AI202', name: 'Data Wrangling with Pandas & NumPy', semester: 3, credits: 3, type: 'Core' },
      { id: 'sub-ai-203', code: 'AI203', name: 'Database Systems & SQL Data Warehousing', semester: 4, credits: 4, type: 'Core' }
    ],
    3: [
      { id: 'sub-ai-301', code: 'AI301', name: 'Deep Learning & PyTorch/TensorFlow Frameworks', semester: 5, credits: 4, type: 'Core' },
      { id: 'sub-ai-302', code: 'AI302', name: 'Natural Language Processing (NLP) & LLMs', semester: 6, credits: 4, type: 'Core' },
      { id: 'sub-ai-303', code: 'AI303', name: 'Computer Vision & Image Processing', semester: 6, credits: 4, type: 'Core' }
    ],
    4: [
      { id: 'sub-ai-401', code: 'AI401', name: 'MLOps: Machine Learning Model Deployment & Monitoring', semester: 7, credits: 4, type: 'Core' },
      { id: 'sub-ai-402', code: 'AI402', name: 'Generative AI & Autonomous Agents', semester: 7, credits: 3, type: 'Elective' }
    ]
  },
  'BCA': {
    1: [
      { id: 'bca-101', code: 'BCA101', name: 'Fundamentals of Information Technology', semester: 1, credits: 3, type: 'Core' },
      { id: 'bca-102', code: 'BCA102', name: 'Programming in C & Logic Building', semester: 1, credits: 4, type: 'Core' },
      { id: 'bca-103', code: 'BCA103', name: 'Web Designing (HTML5, CSS3, JavaScript)', semester: 2, credits: 3, type: 'Core' }
    ],
    2: [
      { id: 'bca-201', code: 'BCA201', name: 'Data Structures using C++', semester: 3, credits: 4, type: 'Core' },
      { id: 'bca-202', code: 'BCA202', name: 'Relational Database Management Systems (RDBMS)', semester: 3, credits: 4, type: 'Core' },
      { id: 'bca-203', code: 'BCA203', name: 'Java Programming & Web Application Development', semester: 4, credits: 4, type: 'Core' }
    ],
    3: [
      { id: 'bca-301', code: 'BCA301', name: 'Python & Data Analytics Fundamentals', semester: 5, credits: 4, type: 'Core' },
      { id: 'bca-302', code: 'BCA302', name: 'Mobile App Development (React Native / Android)', semester: 5, credits: 3, type: 'Elective' },
      { id: 'bca-303', code: 'BCA303', name: 'BCA Major Capstone Project & Internship', semester: 6, credits: 8, type: 'Project' }
    ]
  }
};

export const StudentAcademicProfile: React.FC = () => {
  const { setActiveView, showToast } = usePassport();

  // Saved Profile State
  const [selectedDegree, setSelectedDegree] = useState<string>('BTech-CSE');
  const [collegeSearch, setCollegeSearch] = useState<string>('Indian Institute of Technology (IIT) Bombay');
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedCollegeCategory, setSelectedCollegeCategory] = useState<string>('All');
  const [selectedYearId, setSelectedYearId] = useState<string>('3rd-year');
  const [selectedBatch, setSelectedBatch] = useState<string>('2023 - 2027 (Current 3rd Year)');
  const [rollNumber, setRollNumber] = useState<string>('2023CSE1042');
  const [cgpa, setCgpa] = useState<string>('8.95');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState<boolean>(false);
  const [selectedCollegeObj, setSelectedCollegeObj] = useState<FetchedCollege | null>(null);

  // Dynamic College Search State from Supabase
  const [collegeResults, setCollegeResults] = useState<FetchedCollege[]>([]);
  const [isSearchingColleges, setIsSearchingColleges] = useState<boolean>(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Subject completion tracking state
  const [completedSubjects, setCompletedSubjects] = useState<string[]>([
    'sub-101', 'sub-102', 'sub-103', 'sub-104', 'sub-105', 'sub-106', 'sub-107', 'sub-108',
    'sub-201', 'sub-202', 'sub-203', 'sub-204', 'sub-205', 'sub-206'
  ]);
  const [inProgressSubjects, setInProgressSubjects] = useState<string[]>([
    'sub-301', 'sub-302', 'sub-303', 'sub-304'
  ]);
  const [customSubjectName, setCustomSubjectName] = useState<string>('');

  // Load persisted profile from localStorage if exists
  useEffect(() => {
    try {
      const saved = localStorage.getItem('student_academic_profile_2026');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.selectedDegree) setSelectedDegree(parsed.selectedDegree);
        if (parsed.collegeSearch) setCollegeSearch(parsed.collegeSearch);
        if (parsed.selectedYearId) setSelectedYearId(parsed.selectedYearId);
        if (parsed.selectedBatch) setSelectedBatch(parsed.selectedBatch);
        if (parsed.rollNumber) setRollNumber(parsed.rollNumber);
        if (parsed.cgpa) setCgpa(parsed.cgpa);
        if (parsed.completedSubjects) setCompletedSubjects(parsed.completedSubjects);
        if (parsed.inProgressSubjects) setInProgressSubjects(parsed.inProgressSubjects);
      }
    } catch (e) {
      console.error('Error loading academic profile:', e);
    }
  }, []);

  // Fetch colleges from Supabase dynamically on search/filter changes
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setIsSearchingColleges(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        let results = await fetchCollegesFromSupabase(collegeSearch, 40);

        // Apply state filter if specific state selected
        if (selectedState !== 'All States') {
          results = results.filter((c) =>
            c.state.toLowerCase().includes(selectedState.toLowerCase())
          );
        }

        // Apply category filter if specific category selected
        if (selectedCollegeCategory !== 'All') {
          results = results.filter((c) =>
            c.category.toLowerCase().includes(selectedCollegeCategory.toLowerCase())
          );
        }

        setCollegeResults(results);
      } catch (err) {
        console.error('Error fetching colleges for profile:', err);
      } finally {
        setIsSearchingColleges(false);
      }
    }, 180);

    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [collegeSearch, selectedState, selectedCollegeCategory]);

  // Current selected degree object
  const currentDegreeObj = INDIAN_DEGREES.find((d) => d.code === selectedDegree) || INDIAN_DEGREES[0];
  const currentYearObj = ACADEMIC_YEAR_LEVELS.find((y) => y.id === selectedYearId) || ACADEMIC_YEAR_LEVELS[2];

  // Dynamic Subjects for selected degree & year
  const degreeCurriculum = SUBJECT_CURRICULA[selectedDegree] || SUBJECT_CURRICULA['BTech-CSE'];
  const activeYearSubjects = degreeCurriculum[currentYearObj.yearNum] || degreeCurriculum[1] || [];

  // Toggle subject completion status
  const toggleSubjectStatus = (subjectId: string) => {
    if (completedSubjects.includes(subjectId)) {
      setCompletedSubjects(completedSubjects.filter((id) => id !== subjectId));
      setInProgressSubjects([...inProgressSubjects, subjectId]);
    } else if (inProgressSubjects.includes(subjectId)) {
      setInProgressSubjects(inProgressSubjects.filter((id) => id !== subjectId));
    } else {
      setCompletedSubjects([...completedSubjects, subjectId]);
    }
  };

  // Add custom subject
  const handleAddCustomSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSubjectName.trim()) return;
    const newId = `custom-sub-${Date.now()}`;
    setCompletedSubjects([...completedSubjects, newId]);
    showToast(`Added custom subject: ${customSubjectName}`, 'success');
    setCustomSubjectName('');
  };

  // Save Academic Profile
  const handleSaveProfile = () => {
    const profilePayload = {
      selectedDegree,
      degreeName: currentDegreeObj.name,
      collegeSearch,
      selectedYearId,
      yearLabel: currentYearObj.label,
      selectedBatch,
      rollNumber,
      cgpa,
      completedSubjects,
      inProgressSubjects,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem('student_academic_profile_2026', JSON.stringify(profilePayload));
    showToast('Academic Profile & 2026 Curriculum Details Saved Successfully!', 'success');
  };

  // Calculate Academic Progress Percentage
  const totalRelevantSubjects = activeYearSubjects.length;
  const completedCount = activeYearSubjects.filter((s) => completedSubjects.includes(s.id)).length;
  const progressPercent = totalRelevantSubjects > 0 ? Math.round((completedCount / totalRelevantSubjects) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-primary-container via-primary to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/20">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>2026 Indian Higher Education Registry & Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Student Academic Profile & Degree Details</h1>
            <p className="text-sm text-indigo-100 max-w-2xl">
              Configure your university enrollment, degree program, academic year level, and track your semester subject completion matrix.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
            >
              ← Back to Dashboard
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Academic Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left (Colleges, Degree, Year) + Right (Dynamic Subject Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Enrollment & Institution Details (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">account_balance</span>
                <span>Institution & Degree Enrollment</span>
              </h2>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                2026 Verified
              </span>
            </div>

            {/* 1. Indian College & University Selection */}
            <div className="space-y-3 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Select Indian College / University <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  43,000+ Colleges Live
                </span>
              </div>

              {/* State & Category Filters Row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                {/* State Dropdown */}
                <div className="sm:col-span-6">
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-border rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quick Category Selector */}
                <div className="sm:col-span-6">
                  <select
                    value={selectedCollegeCategory}
                    onChange={(e) => setSelectedCollegeCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-border rounded-lg text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="All">All Categories</option>
                    <option value="IIT">IITs (Tech Institutes)</option>
                    <option value="NIT">NITs (National)</option>
                    <option value="IIIT">IIITs (Information Tech)</option>
                    <option value="Central Univ">Central Universities</option>
                    <option value="State Univ">State Universities</option>
                    <option value="Autonomous">Autonomous Colleges</option>
                    <option value="Medical">Medical / Health</option>
                    <option value="College">Engineering & Arts Colleges</option>
                  </select>
                </div>
              </div>

              {/* Search / Select Input */}
              <div className="relative">
                <input
                  type="text"
                  value={collegeSearch}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setShowCollegeDropdown(true);
                  }}
                  onFocus={() => setShowCollegeDropdown(true)}
                  placeholder="Type college name, city, or district (e.g. IIT Bombay, Anna Univ, COEP)..."
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-xs"
                />
                <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-[18px] text-slate-400">
                  search
                </span>

                <div className="absolute right-2.5 top-2.5 flex items-center">
                  {isSearchingColleges ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : collegeSearch ? (
                    <button
                      type="button"
                      onClick={() => {
                        setCollegeSearch('');
                        setShowCollegeDropdown(true);
                      }}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  ) : null}
                </div>
              </div>

              {/* College Dropdown List with Backdrop Overlay */}
              {showCollegeDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowCollegeDropdown(false)}
                  ></div>
                  <div className="absolute z-40 w-full left-0 mt-1 max-h-64 overflow-y-auto bg-surface border border-border rounded-xl shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95">
                    {collegeResults.length > 0 ? (
                      collegeResults.map((col) => (
                        <div
                          key={col.id}
                          onClick={() => {
                            setCollegeSearch(col.name);
                            setSelectedCollegeObj(col);
                            setShowCollegeDropdown(false);
                          }}
                          className="p-2.5 hover:bg-indigo-50/80 rounded-lg cursor-pointer transition-colors flex items-center justify-between text-xs"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="font-semibold text-slate-900 truncate">
                              {col.name}
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{col.city || col.district}</span>
                              <span className="text-slate-300">•</span>
                              <span>{col.state}</span>
                              <span className="text-slate-300">•</span>
                              <span className="text-primary font-medium">{col.category}</span>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider shrink-0 ${
                              col.tier === 'Tier 1'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {col.tier || 'Tier 2'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-xs text-slate-500">
                        {isSearchingColleges
                          ? 'Searching 43,000+ colleges in Supabase...'
                          : 'No matching college found. You can type your custom college name above.'}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Selected College Verified Info Badge */}
              {selectedCollegeObj && (
                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-base">verified</span>
                    <div>
                      <span className="font-bold text-slate-900">{selectedCollegeObj.name}</span>
                      <div className="text-[11px] text-indigo-700">
                        {selectedCollegeObj.city && `${selectedCollegeObj.city}, `}
                        {selectedCollegeObj.state} • {selectedCollegeObj.category}
                      </div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-white text-primary font-bold text-[10px] rounded-md shadow-xs border border-indigo-200">
                    {selectedCollegeObj.tier || 'Tier 1'}
                  </span>
                </div>
              )}
            </div>

            {/* 2. Select Degree Program */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Degree Program (India 2026 Taxonomy) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedDegree}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              >
                {INDIAN_DEGREES.map((deg) => (
                  <option key={deg.code} value={deg.code}>
                    [{deg.category}] {deg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Current Academic Year / Level */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Current Year Level (Degree Progress) <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedYearId}
                onChange={(e) => setSelectedYearId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-primary focus:bg-white transition-all"
              >
                {ACADEMIC_YEAR_LEVELS.map((yr) => (
                  <option key={yr.id} value={yr.id}>
                    {yr.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Academic Batch & Roll Number */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Academic Session/Batch</label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-medium"
                >
                  {ACADEMIC_BATCHES.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-600 uppercase">Roll / PRN Number</label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. 2023CSE1042"
                  className="w-full px-2.5 py-2 bg-slate-50 border border-border rounded-xl text-xs font-mono"
                />
              </div>
            </div>

            {/* 5. Cumulative GPA / Percentage */}
            <div className="space-y-1 pt-1">
              <label className="block text-[11px] font-bold text-slate-600 uppercase">Cumulative CGPA / Score (%)</label>
              <input
                type="text"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                placeholder="e.g. 8.95 / 10"
                className="w-full px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs font-semibold text-emerald-700"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Subject & Curriculum Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-surface rounded-2xl p-6 border border-border shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">menu_book</span>
                  <span>Dynamic Academic Subject & Curriculum Matrix</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Showing subjects for <span className="font-semibold text-primary">{currentDegreeObj.name}</span> — <span className="font-semibold text-amber-700">{currentYearObj.label}</span>
                </p>
              </div>

              {/* Credit Completion Badge */}
              <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-right">
                <div className="text-[10px] font-bold text-indigo-600 uppercase">Subject Completion Rate</div>
                <div className="text-sm font-extrabold text-indigo-900">{progressPercent}% ({completedCount} / {totalRelevantSubjects} Done)</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Interactive Subject Cards Matrix */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Current Year & Semester Core Subjects</span>
                <span className="text-[11px] font-normal text-slate-500">Click card to toggle completion status</span>
              </div>

              {activeYearSubjects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeYearSubjects.map((sub) => {
                    const isDone = completedSubjects.includes(sub.id);
                    const isInProg = inProgressSubjects.includes(sub.id);

                    return (
                      <div
                        key={sub.id}
                        onClick={() => toggleSubjectStatus(sub.id)}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 select-none ${
                          isDone
                            ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                            : isInProg
                            ? 'bg-blue-50/70 border-blue-300 shadow-xs'
                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-1.5 py-0.5 bg-white rounded border border-slate-200">
                              {sub.code} • Sem {sub.semester}
                            </span>
                            <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                              {sub.name}
                            </h4>
                          </div>
                          <span className={`material-symbols-outlined text-[20px] ${
                            isDone ? 'text-emerald-600' : isInProg ? 'text-blue-600' : 'text-slate-300'
                          }`}>
                            {isDone ? 'check_circle' : isInProg ? 'pending' : 'radio_button_unchecked'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-1 text-[10px]">
                          <span className="font-semibold text-slate-600">{sub.credits} Credits • {sub.type}</span>
                          <span className={`font-bold px-2 py-0.5 rounded ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : isInProg
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-200 text-slate-600'
                          }`}>
                            {isDone ? 'Completed' : isInProg ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                  Curriculum details for {currentDegreeObj.name} are loaded dynamically. Select a major or add custom subjects below.
                </div>
              )}
            </div>

            {/* Add Custom Elective Subject Form */}
            <form onSubmit={handleAddCustomSubject} className="pt-3 border-t border-border space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Add Custom Elective / Project Course
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSubjectName}
                  onChange={(e) => setCustomSubjectName(e.target.value)}
                  placeholder="e.g. Advanced Microservices & Cloud Native Architectures"
                  className="flex-1 px-3 py-2 bg-slate-50 border border-border rounded-xl text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-bold rounded-xl text-xs hover:bg-primary-hover transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Subject</span>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentAcademicProfile;
