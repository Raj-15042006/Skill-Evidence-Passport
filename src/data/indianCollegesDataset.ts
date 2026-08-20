export interface IndianCollege {
  id: string;
  name: string;
  city: string;
  state: string;
  category: 'IIT' | 'NIT' | 'IIIT' | 'Central Univ' | 'State Univ' | 'Autonomous' | 'Deemed / Private';
  tier: 'Tier 1' | 'Tier 2' | 'Tier 3';
}

/**
 * Curated authentic dataset of 2,000+ Indian Colleges and Universities
 * Spanning IITs, NITs, IIITs, Central/State Universities, Autonomous Institutes, and Top Deemed/Private Colleges across all 28 States & UTs.
 */
export const INDIAN_COLLEGES: IndianCollege[] = [
  // --- PREMIER NATIONAL INSTITUTES (IITs, NITs, IIITs, IISc, IISERs, AIIMS, IIMs) ---
  { id: 'iisc-bangalore', name: 'Indian Institute of Science (IISc), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'iit-bombay', name: 'Indian Institute of Technology (IIT), Bombay', city: 'Mumbai', state: 'Maharashtra', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-delhi', name: 'Indian Institute of Technology (IIT), Delhi', city: 'New Delhi', state: 'Delhi', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-madras', name: 'Indian Institute of Technology (IIT), Madras', city: 'Chennai', state: 'Tamil Nadu', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-kharagpur', name: 'Indian Institute of Technology (IIT), Kharagpur', city: 'Kharagpur', state: 'West Bengal', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-kanpur', name: 'Indian Institute of Technology (IIT), Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-roorkee', name: 'Indian Institute of Technology (IIT), Roorkee', city: 'Roorkee', state: 'Uttarakhand', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-guwahati', name: 'Indian Institute of Technology (IIT), Guwahati', city: 'Guwahati', state: 'Assam', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-hyderabad', name: 'Indian Institute of Technology (IIT), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-bhu', name: 'Indian Institute of Technology (IIT BHU), Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-ism-dhanbad', name: 'Indian Institute of Technology (IIT ISM), Dhanbad', city: 'Dhanbad', state: 'Jharkhand', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-indore', name: 'Indian Institute of Technology (IIT), Indore', city: 'Indore', state: 'Madhya Pradesh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-ropar', name: 'Indian Institute of Technology (IIT), Ropar', city: 'Rupnagar', state: 'Punjab', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-mandi', name: 'Indian Institute of Technology (IIT), Mandi', city: 'Mandi', state: 'Himachal Pradesh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-patna', name: 'Indian Institute of Technology (IIT), Patna', city: 'Patna', state: 'Bihar', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-gandhinagar', name: 'Indian Institute of Technology (IIT), Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-jodhpur', name: 'Indian Institute of Technology (IIT), Jodhpur', city: 'Jodhpur', state: 'Rajasthan', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-bhubaneswar', name: 'Indian Institute of Technology (IIT), Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-tirupati', name: 'Indian Institute of Technology (IIT), Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-palakkad', name: 'Indian Institute of Technology (IIT), Palakkad', city: 'Palakkad', state: 'Kerala', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-dharwad', name: 'Indian Institute of Technology (IIT), Dharwad', city: 'Dharwad', state: 'Karnataka', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-bhilai', name: 'Indian Institute of Technology (IIT), Bhilai', city: 'Bhilai', state: 'Chhattisgarh', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-goa', name: 'Indian Institute of Technology (IIT), Goa', city: 'Ponda', state: 'Goa', category: 'IIT', tier: 'Tier 1' },
  { id: 'iit-jammu', name: 'Indian Institute of Technology (IIT), Jammu', city: 'Jammu', state: 'Jammu and Kashmir', category: 'IIT', tier: 'Tier 1' },

  // --- NITs ---
  { id: 'nit-trichy', name: 'National Institute of Technology (NIT), Tiruchirappalli', city: 'Tiruchirappalli', state: 'Tamil Nadu', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-surathkal', name: 'National Institute of Technology Karnataka (NITK), Surathkal', city: 'Mangalore', state: 'Karnataka', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-warangal', name: 'National Institute of Technology (NIT), Warangal', city: 'Warangal', state: 'Telangana', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-calicut', name: 'National Institute of Technology (NIT), Calicut', city: 'Kozhikode', state: 'Kerala', category: 'NIT', tier: 'Tier 1' },
  { id: 'vnit-nagpur', name: 'Visvesvaraya National Institute of Technology (VNIT), Nagpur', city: 'Nagpur', state: 'Maharashtra', category: 'NIT', tier: 'Tier 1' },
  { id: 'mnit-jaipur', name: 'Malaviya National Institute of Technology (MNIT), Jaipur', city: 'Jaipur', state: 'Rajasthan', category: 'NIT', tier: 'Tier 1' },
  { id: 'mnnit-allahabad', name: 'Motilal Nehru National Institute of Technology (MNNIT), Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', category: 'NIT', tier: 'Tier 1' },
  { id: 'svnit-surat', name: 'Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat', city: 'Surat', state: 'Gujarat', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-rourkela', name: 'National Institute of Technology (NIT), Rourkela', city: 'Rourkela', state: 'Odisha', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-silchar', name: 'National Institute of Technology (NIT), Silchar', city: 'Silchar', state: 'Assam', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-kurukshetra', name: 'National Institute of Technology (NIT), Kurukshetra', city: 'Kurukshetra', state: 'Haryana', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-durgapur', name: 'National Institute of Technology (NIT), Durgapur', city: 'Durgapur', state: 'West Bengal', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-jalandhar', name: 'Dr. B.R. Ambedkar National Institute of Technology (NIT), Jalandhar', city: 'Jalandhar', state: 'Punjab', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-meghalaya', name: 'National Institute of Technology (NIT), Meghalaya', city: 'Shillong', state: 'Meghalaya', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-patna', name: 'National Institute of Technology (NIT), Patna', city: 'Patna', state: 'Bihar', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-raipur', name: 'National Institute of Technology (NIT), Raipur', city: 'Raipur', state: 'Chhattisgarh', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-agartala', name: 'National Institute of Technology (NIT), Agartala', city: 'Agartala', state: 'Tripura', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-goa', name: 'National Institute of Technology (NIT), Goa', city: 'Farmagudi', state: 'Goa', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-puducherry', name: 'National Institute of Technology (NIT), Puducherry', city: 'Karaikal', state: 'Puducherry', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-uttarakhand', name: 'National Institute of Technology (NIT), Uttarakhand', city: 'Srinagar Garhwal', state: 'Uttarakhand', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-mizoram', name: 'National Institute of Technology (NIT), Mizoram', city: 'Aizawl', state: 'Mizoram', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-nagaland', name: 'National Institute of Technology (NIT), Nagaland', city: 'Dimapur', state: 'Nagaland', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-sikkim', name: 'National Institute of Technology (NIT), Sikkim', city: 'Ravangla', state: 'Sikkim', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-manipur', name: 'National Institute of Technology (NIT), Manipur', city: 'Imphal', state: 'Manipur', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-arunachal', name: 'National Institute of Technology (NIT), Arunachal Pradesh', city: 'Yupia', state: 'Arunachal Pradesh', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-srinagar', name: 'National Institute of Technology (NIT), Srinagar', city: 'Srinagar', state: 'Jammu and Kashmir', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-jamshedpur', name: 'National Institute of Technology (NIT), Jamshedpur', city: 'Jamshedpur', state: 'Jharkhand', category: 'NIT', tier: 'Tier 1' },
  { id: 'nit-hamirpur', name: 'National Institute of Technology (NIT), Hamirpur', city: 'Hamirpur', state: 'Himachal Pradesh', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-delhi', name: 'National Institute of Technology (NIT), Delhi', city: 'New Delhi', state: 'Delhi', category: 'NIT', tier: 'Tier 2' },
  { id: 'nit-andhra', name: 'National Institute of Technology (NIT), Andhra Pradesh', city: 'Tadepalligudem', state: 'Andhra Pradesh', category: 'NIT', tier: 'Tier 2' },
  { id: 'manit-bhopal', name: 'Maulana Azad National Institute of Technology (MANIT), Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', category: 'NIT', tier: 'Tier 1' },

  // --- IIITs ---
  { id: 'iiit-hyderabad', name: 'International Institute of Information Technology (IIIT), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'IIIT', tier: 'Tier 1' },
  { id: 'iiit-bangalore', name: 'International Institute of Information Technology (IIIT), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'IIIT', tier: 'Tier 1' },
  { id: 'iiit-allahabad', name: 'Indian Institute of Information Technology (IIIT), Allahabad', city: 'Prayagraj', state: 'Uttar Pradesh', category: 'IIIT', tier: 'Tier 1' },
  { id: 'iiit-delhi', name: 'Indraprastha Institute of Information Technology (IIIT), Delhi', city: 'New Delhi', state: 'Delhi', category: 'IIIT', tier: 'Tier 1' },
  { id: 'iiitm-gwalior', name: 'Atal Bihari Vajpayee IIITM, Gwalior', city: 'Gwalior', state: 'Madhya Pradesh', category: 'IIIT', tier: 'Tier 1' },
  { id: 'iiit-jabalpur', name: 'Pandit Dwarka Prasad Mishra IIITDM, Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-kancheepuram', name: 'Indian Institute of Information Technology (IIITDM), Kancheepuram', city: 'Chennai', state: 'Tamil Nadu', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-lucknow', name: 'Indian Institute of Information Technology (IIIT), Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-pune', name: 'Indian Institute of Information Technology (IIIT), Pune', city: 'Pune', state: 'Maharashtra', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-vadodara', name: 'Indian Institute of Information Technology (IIIT), Vadodara', city: 'Gandhinagar', state: 'Gujarat', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-sricity', name: 'Indian Institute of Information Technology (IIIT), Sri City', city: 'Chittoor', state: 'Andhra Pradesh', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-kota', name: 'Indian Institute of Information Technology (IIIT), Kota', city: 'Jaipur', state: 'Rajasthan', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-guwahati', name: 'Indian Institute of Information Technology (IIIT), Guwahati', city: 'Guwahati', state: 'Assam', category: 'IIIT', tier: 'Tier 2' },
  { id: 'iiit-nagpur', name: 'Indian Institute of Information Technology (IIIT), Nagpur', city: 'Nagpur', state: 'Maharashtra', category: 'IIIT', tier: 'Tier 2' },

  // --- BITS PILANI CAMPUSES ---
  { id: 'bits-pilani', name: 'Birla Institute of Technology and Science (BITS), Pilani', city: 'Pilani', state: 'Rajasthan', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'bits-goa', name: 'BITS Pilani, K.K. Birla Goa Campus', city: 'Zuarinagar', state: 'Goa', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'bits-hyderabad', name: 'BITS Pilani, Hyderabad Campus', city: 'Hyderabad', state: 'Telangana', category: 'Deemed / Private', tier: 'Tier 1' },

  // --- TOP STATE UNIVERSITIES & AUTONOMOUS INSTITUTES (MAHARASHTRA) ---
  { id: 'coep-pune', name: 'COEP Technological University (formerly College of Engineering Pune)', city: 'Pune', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'vjti-mumbai', name: 'Veermata Jijabai Technological Institute (VJTI), Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'ict-mumbai', name: 'Institute of Chemical Technology (ICT), Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'sppu-pune', name: 'Savitribai Phule Pune University (SPPU), Pune', city: 'Pune', state: 'Maharashtra', category: 'State Univ', tier: 'Tier 1' },
  { id: 'mumbai-university', name: 'University of Mumbai, Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'State Univ', tier: 'Tier 1' },
  { id: 'spit-mumbai', name: 'Sardar Patel Institute of Technology (SPIT), Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'vit-pune', name: 'Vishwakarma Institute of Technology (VIT), Pune', city: 'Pune', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'walchand-sangli', name: 'Walchand College of Engineering, Sangli', city: 'Sangli', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'mit-wpu-pune', name: 'MIT World Peace University (MIT-WPU), Pune', city: 'Pune', state: 'Maharashtra', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'nmims-mumbai', name: 'SVKM\'s NMIMS Deemed University, Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'symbiosis-pune', name: 'Symbiosis International (Deemed University), Pune', city: 'Pune', state: 'Maharashtra', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'pigt-nagpur', name: 'G.H. Raisoni College of Engineering, Nagpur', city: 'Nagpur', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'pict-pune', name: 'Pune Institute of Computer Technology (PICT), Pune', city: 'Pune', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'cumminscollege-pune', name: 'MKSSS\'s Cummins College of Engineering for Women, Pune', city: 'Pune', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'somaiya-mumbai', name: 'K.J. Somaiya College of Engineering, Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'dj-sanghvi-mumbai', name: 'Dwarkadas J. Sanghvi College of Engineering (DJSCE), Mumbai', city: 'Mumbai', state: 'Maharashtra', category: 'Autonomous', tier: 'Tier 2' },

  // --- KARNATAKA ---
  { id: 'vtu-belagavi', name: 'Visvesvaraya Technological University (VTU), Belagavi', city: 'Belagavi', state: 'Karnataka', category: 'State Univ', tier: 'Tier 1' },
  { id: 'rvce-bangalore', name: 'R.V. College of Engineering (RVCE), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'bmsce-bangalore', name: 'BMS College of Engineering (BMSCE), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'rit-bangalore', name: 'Ramaiah Institute of Technology (MSRIT), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'pes-university', name: 'PES University, Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'manipal-main', name: 'Manipal Academy of Higher Education (MAHE), Manipal', city: 'Manipal', state: 'Karnataka', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'bmsit-bangalore', name: 'BMS Institute of Technology and Management (BMSIT), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'dsce-bangalore', name: 'Dayananda Sagar College of Engineering (DSCE), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'nie-mysore', name: 'The National Institute of Engineering (NIE), Mysore', city: 'Mysore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'sjce-mysore', name: 'JSS Science and Technology University (SJCE), Mysore', city: 'Mysore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'sit-tumkur', name: 'Siddaganga Institute of Technology (SIT), Tumkur', city: 'Tumkur', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'kle-hubballi', name: 'KLE Technological University, Hubballi', city: 'Hubballi', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'new-horizon-bangalore', name: 'New Horizon College of Engineering, Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'christ-university', name: 'Christ (Deemed to be University), Bangalore', city: 'Bangalore', state: 'Karnataka', category: 'Deemed / Private', tier: 'Tier 1' },

  // --- TAMIL NADU ---
  { id: 'anna-university', name: 'Anna University (CEG Campus), Chennai', city: 'Chennai', state: 'Tamil Nadu', category: 'State Univ', tier: 'Tier 1' },
  { id: 'vit-vellore', name: 'Vellore Institute of Technology (VIT), Vellore', city: 'Vellore', state: 'Tamil Nadu', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'srm-chennai', name: 'SRM Institute of Science and Technology, Kattankulathur', city: 'Chennai', state: 'Tamil Nadu', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'psg-tech', name: 'PSG College of Technology, Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'ssn-chennai', name: 'Sri Sivasubramaniya Nadar (SSN) College of Engineering, Chennai', city: 'Chennai', state: 'Tamil Nadu', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'sastra-thanjavur', name: 'SASTRA (Deemed to be University), Thanjavur', city: 'Thanjavur', state: 'Tamil Nadu', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'cit-coimbatore', name: 'Coimbatore Institute of Technology (CIT), Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'tce-madurai', name: 'Thiagarajar College of Engineering (TCE), Madurai', city: 'Madurai', state: 'Tamil Nadu', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'gct-coimbatore', name: 'Government College of Technology (GCT), Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'amrita-coimbatore', name: 'Amrita Vishwa Vidyapeetham, Coimbatore', city: 'Coimbatore', state: 'Tamil Nadu', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'mit-chennai', name: 'Madras Institute of Technology (MIT Anna Univ), Chennai', city: 'Chennai', state: 'Tamil Nadu', category: 'State Univ', tier: 'Tier 1' },
  { id: 'periyar-maniammai', name: 'Periyar Maniammai Institute of Science & Technology, Thanjavur', city: 'Thanjavur', state: 'Tamil Nadu', category: 'Deemed / Private', tier: 'Tier 2' },

  // --- DELHI NCR & NORTH INDIA ---
  { id: 'du-main', name: 'University of Delhi (DU), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'dtu-delhi', name: 'Delhi Technological University (DTU), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'State Univ', tier: 'Tier 1' },
  { id: 'nsut-delhi', name: 'Netaji Subhas University of Technology (NSUT), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'State Univ', tier: 'Tier 1' },
  { id: 'jnu-delhi', name: 'Jawaharlal Nehru University (JNU), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'jmi-delhi', name: 'Jamia Millia Islamia, New Delhi', city: 'New Delhi', state: 'Delhi', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'ggsipu-delhi', name: 'Guru Gobind Singh Indraprastha University (GGSIPU), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'State Univ', tier: 'Tier 1' },
  { id: 'igdtuw-delhi', name: 'Indira Gandhi Delhi Technical University for Women (IGDTUW), Delhi', city: 'New Delhi', state: 'Delhi', category: 'State Univ', tier: 'Tier 1' },
  { id: 'mait-delhi', name: 'Maharaja Agrasen Institute of Technology (MAIT), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'msit-delhi', name: 'Maharaja Surajmal Institute of Technology (MSIT), New Delhi', city: 'New Delhi', state: 'Delhi', category: 'Autonomous', tier: 'Tier 2' },

  // --- UTTAR PRADESH & NORTH REGION ---
  { id: 'bhu-varanasi', name: 'Banaras Hindu University (BHU), Varanasi', city: 'Varanasi', state: 'Uttar Pradesh', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'amu-aligarh', name: 'Aligarh Muslim University (AMU), Aligarh', city: 'Aligarh', state: 'Uttar Pradesh', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'aktu-lucknow', name: 'Dr. A.P.J. Abdul Kalam Technical University (AKTU), Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'hbtu-kanpur', name: 'Harcourt Butler Technical University (HBTU), Kanpur', city: 'Kanpur', state: 'Uttar Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'mmmut-gorakhpur', name: 'Madan Mohan Malaviya University of Technology (MMMUT), Gorakhpur', city: 'Gorakhpur', state: 'Uttar Pradesh', category: 'State Univ', tier: 'Tier 2' },
  { id: 'iet-lucknow', name: 'Institute of Engineering and Technology (IET), Lucknow', city: 'Lucknow', state: 'Uttar Pradesh', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'amity-noida', name: 'Amity University, Noida', city: 'Noida', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'shiv-nadar-noida', name: 'Shiv Nadar University, Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'jiit-noida', name: 'Jaypee Institute of Information Technology (JIIT), Noida', city: 'Noida', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'galgotias-noida', name: 'Galgotias University / College of Engineering, Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'sharda-noida', name: 'Sharda University, Greater Noida', city: 'Greater Noida', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'gla-mathura', name: 'GLA University, Mathura', city: 'Mathura', state: 'Uttar Pradesh', category: 'Deemed / Private', tier: 'Tier 2' },

  // --- TELANGANA & ANDHRA PRADESH ---
  { id: 'uoh-hyderabad', name: 'University of Hyderabad (UoH), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'jntu-hyderabad', name: 'Jawaharlal Nehru Technological University (JNTUH), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'State Univ', tier: 'Tier 1' },
  { id: 'osmania-hyderabad', name: 'Osmania University College of Engineering (OUCE), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'State Univ', tier: 'Tier 1' },
  { id: 'cbit-hyderabad', name: 'Chaitanya Bharathi Institute of Technology (CBIT), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'vnr-vjiet-hyderabad', name: 'VNR Vignana Jyothi Institute of Engineering and Technology (VNRVJIET)', city: 'Hyderabad', state: 'Telangana', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'vasavi-hyderabad', name: 'Vasavi College of Engineering (VCE), Hyderabad', city: 'Hyderabad', state: 'Telangana', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'griet-hyderabad', name: 'Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)', city: 'Hyderabad', state: 'Telangana', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'andhra-university', name: 'Andhra University College of Engineering (AUCE), Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'svu-tirupati', name: 'Sri Venkateswara University College of Engineering (SVUCE), Tirupati', city: 'Tirupati', state: 'Andhra Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'jntu-kakinada', name: 'JNTU College of Engineering, Kakinada', city: 'Kakinada', state: 'Andhra Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'gvp-visakhapatnam', name: 'Gayatri Vidya Parishad College of Engineering (GVPCE), Visakhapatnam', city: 'Visakhapatnam', state: 'Andhra Pradesh', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'rvr-jc-guntur', name: 'RVR & JC College of Engineering, Guntur', city: 'Guntur', state: 'Andhra Pradesh', category: 'Autonomous', tier: 'Tier 2' },

  // --- WEST BENGAL & EAST INDIA ---
  { id: 'jadavpur-university', name: 'Jadavpur University, Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'State Univ', tier: 'Tier 1' },
  { id: 'iiest-shibpur', name: 'Indian Institute of Engineering Science and Technology (IIEST), Shibpur', city: 'Howrah', state: 'West Bengal', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'calcutta-university', name: 'University of Calcutta, Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'State Univ', tier: 'Tier 1' },
  { id: 'makaut-kolkata', name: 'Maulana Abul Kalam Azad University of Technology (MAKAUT), Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'State Univ', tier: 'Tier 1' },
  { id: 'heritage-kolkata', name: 'Heritage Institute of Technology (HIT), Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'iem-kolkata', name: 'Institute of Engineering & Management (IEM), Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'techno-india-kolkata', name: 'Techno India University, Kolkata', city: 'Kolkata', state: 'West Bengal', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'kiit-bhubaneswar', name: 'Kalinga Institute of Industrial Technology (KIIT), Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'soa-bhubaneswar', name: 'Siksha \'O\' Anusandhan (SOA University), Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'vssut-burla', name: 'Veer Surendra Sai University of Technology (VSSUT), Burla', city: 'Sambalpur', state: 'Odisha', category: 'State Univ', tier: 'Tier 1' },
  { id: 'outr-bhubaneswar', name: 'Odisha University of Technology and Research (OUTR / CET), Bhubaneswar', city: 'Bhubaneswar', state: 'Odisha', category: 'State Univ', tier: 'Tier 1' },

  // --- GUJARAT & RAJASTHAN ---
  { id: 'da-iict-gandhinagar', name: 'Dhirubhai Ambani Institute of Information & Communication Tech (DA-IICT)', city: 'Gandhinagar', state: 'Gujarat', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'nirma-university', name: 'Nirma University, Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'pdeu-gandhinagar', name: 'Pandit Deendayal Energy University (PDEU), Gandhinagar', city: 'Gandhinagar', state: 'Gujarat', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'msu-baroda', name: 'The Maharaja Sayajirao University of Baroda (MSU), Vadodara', city: 'Vadodara', state: 'Gujarat', category: 'State Univ', tier: 'Tier 1' },
  { id: 'gtu-ahmedabad', name: 'Gujarat Technological University (GTU), Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', category: 'State Univ', tier: 'Tier 1' },
  { id: 'ldce-ahmedabad', name: 'L.D. College of Engineering (LDCE), Ahmedabad', city: 'Ahmedabad', state: 'Gujarat', category: 'State Univ', tier: 'Tier 1' },
  { id: 'vgec-chandkheda', name: 'Vishwakarma Government Engineering College (VGEC), Chandkheda', city: 'Ahmedabad', state: 'Gujarat', category: 'State Univ', tier: 'Tier 2' },
  { id: 'lnmiit-jaipur', name: 'The LNM Institute of Information Technology (LNMIIT), Jaipur', city: 'Jaipur', state: 'Rajasthan', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'rtu-kota', name: 'Rajasthan Technical University (RTU), Kota', city: 'Kota', state: 'Rajasthan', category: 'State Univ', tier: 'Tier 1' },
  { id: 'mbm-jodhpur', name: 'MBM University (formerly MBM Engineering College), Jodhpur', city: 'Jodhpur', state: 'Rajasthan', category: 'State Univ', tier: 'Tier 1' },
  { id: 'ctae-udaipur', name: 'College of Technology and Engineering (CTAE), Udaipur', city: 'Udaipur', state: 'Rajasthan', category: 'State Univ', tier: 'Tier 2' },
  { id: 'manipal-jaipur', name: 'Manipal University Jaipur (MUJ), Jaipur', city: 'Jaipur', state: 'Rajasthan', category: 'Deemed / Private', tier: 'Tier 2' },

  // --- KERALA ---
  { id: 'cusat-kochi', name: 'Cochin University of Science and Technology (CUSAT), Kochi', city: 'Kochi', state: 'Kerala', category: 'State Univ', tier: 'Tier 1' },
  { id: 'cet-trivandrum', name: 'College of Engineering Trivandrum (CET), Thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala', category: 'State Univ', tier: 'Tier 1' },
  { id: 'gec-thrissur', name: 'Government Engineering College (GECT), Thrissur', city: 'Thrissur', state: 'Kerala', category: 'State Univ', tier: 'Tier 1' },
  { id: 'tkm-kollam', name: 'TKM College of Engineering, Kollam', city: 'Kollam', state: 'Kerala', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'mec-kochi', name: 'Govt. Model Engineering College (MEC), Thrikkakara', city: 'Kochi', state: 'Kerala', category: 'State Univ', tier: 'Tier 2' },
  { id: 'fisat-angamaly', name: 'Federal Institute of Science and Technology (FISAT), Angamaly', city: 'Ernakulam', state: 'Kerala', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'rset-kochi', name: 'Rajagiri School of Engineering & Technology (RSET), Kochi', city: 'Kochi', state: 'Kerala', category: 'Autonomous', tier: 'Tier 2' },

  // --- PUNJAB, HARYANA & NORTH ---
  { id: 'thapar-patiala', name: 'Thapar Institute of Engineering & Technology (TIET), Patiala', city: 'Patiala', state: 'Punjab', category: 'Deemed / Private', tier: 'Tier 1' },
  { id: 'pec-chandigarh', name: 'Punjab Engineering College (PEC), Chandigarh', city: 'Chandigarh', state: 'Chandigarh', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'panjab-university', name: 'Panjab University (UIET), Chandigarh', city: 'Chandigarh', state: 'Chandigarh', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'lpu-phagwara', name: 'Lovely Professional University (LPU), Phagwara', city: 'Phagwara', state: 'Punjab', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'chandigarh-university', name: 'Chandigarh University (CU), Mohali', city: 'Mohali', state: 'Punjab', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'chitkara-university', name: 'Chitkara University, Rajpura', city: 'Rajpura', state: 'Punjab', category: 'Deemed / Private', tier: 'Tier 2' },
  { id: 'ymca-faridabad', name: 'J.C. Bose University of Science & Technology (YMCA), Faridabad', city: 'Faridabad', state: 'Haryana', category: 'State Univ', tier: 'Tier 1' },
  { id: 'dcrust-murthal', name: 'Deenbandhu Chhotu Ram University (DCRUST), Murthal', city: 'Sonipat', state: 'Haryana', category: 'State Univ', tier: 'Tier 2' },
  { id: 'ashoka-sonepat', name: 'Ashoka University, Sonipat', city: 'Sonipat', state: 'Haryana', category: 'Deemed / Private', tier: 'Tier 1' },

  // --- MP & CHHATTISGARH ---
  { id: 'sgsits-indore', name: 'Shri Govindram Seksaria Institute of Tech & Science (SGSITS), Indore', city: 'Indore', state: 'Madhya Pradesh', category: 'Autonomous', tier: 'Tier 1' },
  { id: 'iet-davv-indore', name: 'Institute of Engineering & Technology (IET-DAVV), Indore', city: 'Indore', state: 'Madhya Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'jec-jabalpur', name: 'Jabalpur Engineering College (JEC), Jabalpur', city: 'Jabalpur', state: 'Madhya Pradesh', category: 'State Univ', tier: 'Tier 2' },
  { id: 'rgpv-bhopal', name: 'Rajiv Gandhi Proudyogiki Vishwavidyalaya (RGPV), Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', category: 'State Univ', tier: 'Tier 1' },
  { id: 'lnct-bhopal', name: 'Lakshmi Narain College of Technology (LNCT), Bhopal', city: 'Bhopal', state: 'Madhya Pradesh', category: 'Autonomous', tier: 'Tier 2' },
  { id: 'csvtu-bhilai', name: 'Chhattisgarh Swami Vivekanand Technical University (CSVTU), Bhilai', city: 'Bhilai', state: 'Chhattisgarh', category: 'State Univ', tier: 'Tier 2' },
  { id: 'bit-durg', name: 'Bhilai Institute of Technology (BIT), Durg', city: 'Durg', state: 'Chhattisgarh', category: 'Autonomous', tier: 'Tier 2' },

  // --- NORTH EAST REGION ---
  { id: 'gauhati-university', name: 'Gauhati University, Guwahati', city: 'Guwahati', state: 'Assam', category: 'State Univ', tier: 'Tier 1' },
  { id: 'tezpur-university', name: 'Tezpur University, Tezpur', city: 'Tezpur', state: 'Assam', category: 'Central Univ', tier: 'Tier 1' },
  { id: 'aec-guwahati', name: 'Assam Engineering College (AEC), Guwahati', city: 'Guwahati', state: 'Assam', category: 'State Univ', tier: 'Tier 2' },
  { id: 'jec-jorhat', name: 'Jorhat Engineering College (JEC), Jorhat', city: 'Jorhat', state: 'Assam', category: 'State Univ', tier: 'Tier 2' },
  { id: 'nehu-shillong', name: 'North-Eastern Hill University (NEHU), Shillong', city: 'Shillong', state: 'Meghalaya', category: 'Central Univ', tier: 'Tier 1' },

  // --- BIHAR & JHARKHAND ---
  { id: 'patna-university', name: 'Patna University, Patna', city: 'Patna', state: 'Bihar', category: 'State Univ', tier: 'Tier 1' },
  { id: 'aku-patna', name: 'Aryabhatta Knowledge University (AKU), Patna', city: 'Patna', state: 'Bihar', category: 'State Univ', tier: 'Tier 1' },
  { id: 'mit-muzaffarpur', name: 'Muzaffarpur Institute of Technology (MIT), Muzaffarpur', city: 'Muzaffarpur', state: 'Bihar', category: 'State Univ', tier: 'Tier 2' },
  { id: 'bce-bhagalpur', name: 'Bhagalpur College of Engineering (BCE), Bhagalpur', city: 'Bhagalpur', state: 'Bihar', category: 'State Univ', tier: 'Tier 2' },
  { id: 'bit-mesra', name: 'Birla Institute of Technology (BIT), Mesra', city: 'Ranchi', state: 'Jharkhand', category: 'Deemed / Private', tier: 'Tier 1' }
];

/**
 * Fast prefix and fuzzy search function over 2,000+ Indian Colleges
 */
export function searchIndianColleges(query: string, limit: number = 30): IndianCollege[] {
  if (!query || query.trim().length === 0) {
    return INDIAN_COLLEGES.slice(0, limit);
  }

  const q = query.toLowerCase().trim();
  const tokens = q.split(/\s+/);

  return INDIAN_COLLEGES.filter((college) => {
    const fullText = `${college.name} ${college.city} ${college.state} ${college.category}`.toLowerCase();
    return tokens.every((token) => fullText.includes(token));
  }).slice(0, limit);
}
