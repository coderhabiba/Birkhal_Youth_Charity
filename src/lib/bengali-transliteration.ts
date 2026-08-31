/**
 * Comprehensive Bengali to English transliteration & translation utility.
 * Ensures that when English mode is active, any Bengali database content
 * (names, roles, addresses, descriptions, bios, titles, occupations, institutions)
 * seamlessly renders in flawless English.
 */

// Common name dictionary for highest fidelity
const KNOWN_NAMES: Record<string, string> = {
  "মুহাম্মদ": "Muhammad",
  "মোহাম্মদ": "Mohammad",
  "মোহাম্মাদ": "Mohammad",
  "মো:": "Md.",
  "মোঃ": "Md.",
  "মো": "Md.",
  "মহিন": "Mohin",
  "নুরুল": "Nurul",
  "ইসলাম": "Islam",
  "কাশেম": "Kashem",
  "মির্জা": "Mirza",
  "ফুল": "Ful",
  "মিয়া": "Miah",
  "মিঞা": "Miah",
  "আরিফুল": "Ariful",
  "কামরুল": "Kamrul",
  "হাসান": "Hasan",
  "হোসাইন": "Hossain",
  "হোসেন": "Hossain",
  "তানভীর": "Tanvir",
  "শুভ": "Shuvo",
  "জুবায়ের": "Zubayer",
  "সুমন": "Sumon",
  "আল-আমিন": "Al-Amin",
  "আল আমিন": "Al-Amin",
  "সাইফুল": "Saiful",
  "জহিরুল": "Zahirul",
  "রাশেদুল": "Rashedul",
  "হক": "Haque",
  "মামুন": "Mamun",
  "আব্দুল্লাহ": "Abdullah",
  "আব্দুর": "Abdur",
  "রহমান": "Rahman",
  "আলী": "Ali",
  "আহমেদ": "Ahmed",
  "আহম্মদ": "Ahmed",
  "খান": "Khan",
  "চৌধুরী": "Chowdhury",
  "মোল্লা": "Molla",
  "কাজী": "Kazi",
  "শেখ": "Sheikh",
  "সৈয়দ": "Syed",
  "তালুকদার": "Talukder",
  "মজুমদার": "Majumder",
  "ভূঁইয়া": "Bhuiyan",
  "ভুইয়া": "Bhuiyan",
  "সরকার": "Sarker",
  "পাটোয়ারী": "Patwary",
  "দেওয়ান": "Dewan",
  "গাজী": "Gazi",
  "মুন্সী": "Munshi",
  "হাজী": "Haji",
  "আলহাজ্ব": "Alhaj",
  "আলহাজ": "Alhaj",
  "সামসুল": "Samsul",
  "ফারুক": "Faruk",
  "শাহীন": "Shahin",
  "রুবেল": "Rubel",
  "সোহেল": "Sohel",
  "বাবু": "Babu",
  "রানা": "Rana",
  "রিপন": "Ripon",
  "শাকিল": "Shakil",
  "সুজন": "Sujon",
  "মিলন": "Milon",
  "বিল্লাল": "Billal",
  "শরীফ": "Sharif",
  "তারেক": "Tarek",
  "নাঈম": "Nayeem",
  "ইমরান": "Imran",
  "ফয়সাল": "Faysal",
  "মাহমুদ": "Mahmud",
  "মাসুম": "Masum",
  "সবুজ": "Sabuj",
  "আজাদ": "Azad",
  "জসিম": "Jasim",
  "সাগর": "Sagar",
  "আকাশ": "Akash",
  "খোকন": "Khokon",
  "মনির": "Monir",
  "সেলিম": "Selim",
  "বাপ্পি": "Bappi",
  "রফিক": "Rafiq",
  "শফিক": "Shafiq",
  "মতিউর": "Motiur",
  "লতিফ": "Latif",
  "আনিস": "Anis",
  "জাহাঙ্গীর": "Jahangir",
  "আলমগীর": "Alamgir",
  "শাহজাহান": "Shahjahan",
  "মোস্তফা": "Mostofa",
  "গোলাম": "Golam",
  "মোর্শেদ": "Morshed",
  "শওকত": "Shawkat",
  "হাবিব": "Habib",
  "ইউসুফ": "Yousuf",
  "ইব্রাহিম": "Ibrahim",
  "ইসমাইল": "Ismail",
  "ইউনুস": "Yunus",
  "হারুন": "Harun",
  "শাহাদাত": "Shahadat",
  "আনোয়ার": "Anwar",
  "বেলাল": "Belal",
  "জালাল": "Jalal",
  "কামাল": "Kamal",
  "জামাল": "Jamal",
  "নাসির": "Nasir",
  "মাসুদ": "Masud",
  "জয়নাল": "Jaynal",
  "আব্দুস": "Abdus",
  "সালাম": "Salam",
  "সাত্তার": "Sattar",
  "কালাম": "Kalam",
  "আমীন": "Amin",
  "রশীদ": "Rashid",
  "ওয়াদুদ": "Wadud",
  "মজিদ": "Majid",
  "মতিন": "Matin",
  "সোবহান": "Sobhan",
  "মান্নান": "Mannan",
  "ফখরুল": "Fakhrul",
  "তুহিন": "Tuhin",
  "আশরাফ": "Ashraf",
  "আলম": "Alam",
  "আলাউদ্দিন": "Alauddin",
  "মোজাম্মেল": "Mozammel",
  "খোরশেদ": "Khorshed",
  "মোস্তাক": "Mostaq",
  "এমদাদুল": "Emdadul",
  "সুলতান": "Sultan",
  "ইমরানুল": "Imranul",
  "মাওলানা": "Maulana",
  "মওলানা": "Maulana",
  "মুহাদ্দিস": "Muhaddis",
  "মাস্টার": "Master",
  "মাষ্টার": "Master",
  "লতিফা": "Latifa",
  "ফাতেমা": "Fatema",
  "আয়েশা": "Ayesha",
  "খাদিজা": "Khadija",
  "রোকেয়া": "Rokeya",
  "নুরজাহান": "Nurjahan",
  "রাবেয়া": "Rabeya",
  "সালমা": "Salma",
  "পারভীন": "Parvin",
  "ইয়াসমিন": "Yasmin",
  "নাসরিন": "Nasrin",
  "রুপা": "Rupa",
  "বৃষ্টি": "Brishti",
  "সীমা": "Sima",
  "রীমা": "Rima"
};

// Educational Institutions, Occupations, Titles, and Phrases
const KNOWN_PHRASES: Record<string, string> = {
  // Activity Gallery Titles & Taglines (Exact Matches First)
  "গ্রামের অসহায় মানুষের জন্য দিনব্যাপী ফ্রি মেডিকেল ক্যাম্প ও ওষুধ বিতরণ": "Day-long Free Medical Camp & Medicine Distribution for Villagers",
  "দরিদ্র শিক্ষার্থীদের মাঝে শিক্ষাসামগ্রী বিতরণ": "Educational Materials Distribution to Underprivileged Students",
  "দরিদ্র ও মেধাবী শিক্ষার্থীদের মাঝে শিক্ষাসামগ্রী ও মেধা বৃত্তি বিতরণ": "Study Materials & Merit Scholarship Distribution for Students",
  "বীরখাল সমাজ কল্যাণ যুব সংগঠনের ঐক্যবদ্ধ কার্যক্রম": "Unified Community Welfare Activities of Birkhal Youth Organization",
  "বীরখাল সমাজ কল্যাণ যুব সংগঠনের ঐক্যবদ্ধ সমাজসেবা কার্যক্রম": "Unified Community Welfare Activities of Birkhal Youth Organization",
  "বীরখাল সবুজায়ন ও পরিবেশ সুরক্ষা বৃক্ষরোপণ": "Birkhal Green Ecology & Environmental Tree Plantation Drive",
  "বীরখাল সবুজায়ন ও পরিবেশ সুরক্ষা বৃক্ষরোপণ কর্মসূচি": "Birkhal Green Ecology & Environmental Tree Plantation Drive",
  "বন্যা ও দুর্যোগকালীন জরুরি খাদ্য ও ত্রাণ সামগ্রী বিতরণ": "Emergency Food & Relief Distribution during Flood and Calamities",
  "বিনামূল্যে জরুরি স্বাস্থ্যসেবা ও রক্তের গ্রুপ নির্ণয় কর্মসূচি": "Free Emergency Healthcare & Blood Grouping Campaign",
  "দিনব্যাপী ফ্রি মেডিকেল ক্যাম্প ও ওষুধ বিতরণ": "Day-long Free Medical Camp & Medicine Distribution",
  "শিক্ষাসামগ্রী বিতরণ": "Educational Supplies Distribution",
  "বৃক্ষরোপণ কর্মসূচি": "Tree Plantation Program",
  "ত্রাণ সামগ্রী বিতরণ": "Relief Materials Distribution",
  "রক্তের গ্রুপ নির্ণয় কর্মসূচি": "Blood Grouping Campaign",

  // Institutional Names & Types (Longest First)
  "বীরখাল সরকারি প্রাথমিক বিদ্যালয়": "Birkhal Govt. Primary School",
  "বীরখাল সরকারী প্রাথমিক বিদ্যালয়": "Birkhal Govt. Primary School",
  "বীরখাল প্রাথমিক সরকারি বিদ্যালয়": "Birkhal Govt. Primary School",
  "বীরখাল সরকারি প্রাথমিক বিদ্যালয়": "Birkhal Govt. Primary School",
  "বীরখাল প্রাথমিক বিদ্যালয়": "Birkhal Primary School",
  "বীরখাল প্রাথমিক বিদ্যালয়": "Birkhal Primary School",
  "বীরখাল উচ্চ বিদ্যালয়": "Birkhal High School",
  "বীরখাল উচ্চ বিদ্যালয়": "Birkhal High School",
  "ভাড়েল্লা কামিল মাদ্রাসা": "Bharella Kamil Madrasa",
  "ভাড়েল্লা কামিল মাদরাসা": "Bharella Kamil Madrasa",
  "ভাড়েল্লা মাদ্রাসা": "Bharella Madrasa",
  "ভাড়েল্লা মাদরাসা": "Bharella Madrasa",
  "সরকারি প্রাথমিক বিদ্যালয়": "Govt. Primary School",
  "সরকারী প্রাথমিক বিদ্যালয়": "Govt. Primary School",
  "সরকারি প্রাথমিক বিদ্যালয়": "Govt. Primary School",
  "সরকারী প্রাথমিক বিদ্যালয়": "Govt. Primary School",
  "প্রাথমিক সরকারি বিদ্যালয়": "Govt. Primary School",
  "প্রাথমিক সরকারি বিদ্যালয়": "Govt. Primary School",
  "প্রাথমিক বিদ্যালয়": "Primary School",
  "প্রাথমিক বিদ্যালয়": "Primary School",
  "উচ্চ বিদ্যালয়": "High School",
  "উচ্চ বিদ্যালয়": "High School",
  "মাধ্যমিক বিদ্যালয়": "Secondary School",
  "মাধ্যমিক বিদ্যালয়": "Secondary School",
  "কেজি স্কুল": "Kindergarten School",
  "কিন্ডারগার্টেন": "Kindergarten",
  "কামিল মাদ্রাসা": "Kamil Madrasa",
  "কামিল মাদরাসা": "Kamil Madrasa",
  "ফাজিল মাদ্রাসা": "Fazil Madrasa",
  "ফাজিল মাদরাসা": "Fazil Madrasa",
  "আলিম মাদ্রাসা": "Alim Madrasa",
  "আলিম মাদরাসা": "Alim Madrasa",
  "দাখিল মাদ্রাসা": "Dakhil Madrasa",
  "দাখিল মাদরাসা": "Dakhil Madrasa",
  "হাফেজিয়া মাদ্রাসা": "Hafezia Madrasa",
  "কওমি মাদ্রাসা": "Qawmi Madrasa",
  "নূরানী মাদ্রাসা": "Noorani Madrasa",
  "মাদ্রাসা": "Madrasa",
  "মাদরাসা": "Madrasa",
  "মহাবিদ্যালয়": "College",
  "মহাবিদ্যালয়": "College",
  "কলেজ": "College",
  "বিশ্ববিদ্যালয়": "University",
  "বিশ্ববিদ্যালয়": "University",
  "বিদ্যালয়": "School",
  "বিদ্যালয়": "School",
  "স্কুল": "School",
  "ইনস্টিটিউট": "Institute",
  "একাডেমি": "Academy",
  "অ্যাকাডেমি": "Academy",

  // Designations & Occupations
  "প্রধান শিক্ষক": "Head Teacher",
  "প্রধান শিক্ষিকা": "Head Teacher",
  "সহকারী প্রধান শিক্ষক": "Assistant Head Teacher",
  "সহকারী শিক্ষক": "Assistant Teacher",
  "সহ শিক্ষক": "Assistant Teacher",
  "সিনিয়র শিক্ষক": "Senior Teacher",
  "সিনিয়র শিক্ষক": "Senior Teacher",
  "শিক্ষক": "Teacher",
  "শিক্ষিকা": "Teacher",
  "মাস্টার": "Master",
  "মাষ্টার": "Master",
  "মুহাদ্দিস": "Muhaddis",
  "মুহতামিম": "Principal",
  "মুফতি": "Mufti",
  "অধ্যক্ষ": "Principal",
  "উপাধ্যক্ষ": "Vice Principal",
  "প্রভাষক": "Lecturer",
  "সহকারী অধ্যাপক": "Assistant Professor",
  "সহযোগী অধ্যাপক": "Associate Professor",
  "অধ্যাপক": "Professor",
  "খতিব": "Khatib",
  "পেশ ইমাম": "Imam",
  "ইমাম": "Imam",
  "মুয়াজ্জিন": "Muazzin",
  "মোয়াজ্জিন": "Muazzin",

  // Business, Expat, Professions
  "বিশিষ্ট ব্যবসায়ী সৌদি আরব": "Prominent Businessman, Saudi Arabia",
  "বিশিষ্ট ব্যবসায়ী": "Prominent Businessman",
  "বিশিষ্ট সমাজসেবক": "Prominent Social Worker",
  "বিশিষ্ট সমাজকর্মী": "Prominent Social Worker",
  "বিশিষ্ট": "Prominent",
  "ব্যবসায়ী": "Businessman",
  "ব্যবসায়ী": "Businessman",
  "ব্যবসা": "Business",
  "প্রবাসী": "Expatriate",
  "সৌদি আরব": "Saudi Arabia",
  "সৌদি": "Saudi",
  "আরব": "Arabia",
  "সংযুক্ত আরব আমিরাত": "UAE",
  "আমিরাত": "Emirates",
  "দুবাই": "Dubai",
  "কাতার": "Qatar",
  "কুয়েত": "Kuwait",
  "ওমান": "Oman",
  "বাহরাইন": "Bahrain",
  "মালয়েশিয়া": "Malaysia",
  "সিঙ্গাপুর": "Singapore",
  "যুক্তরাজ্য": "UK",
  "লন্ডন": "London",
  "যুক্তরাষ্ট্র": "USA",
  "আমেরিকা": "USA",
  "ইতালি": "Italy",
  "কানাডা": "Canada",
  "অস্ট্রেলিয়া": "Australia",
  "ইউরোপ": "Europe",
  "চাকরিজীবী": "Service Holder",
  "চাকুরীজীবী": "Service Holder",
  "আইনজীবী": "Advocate",
  "ডাক্তার": "Doctor",
  "চিকিৎসক": "Physician",
  "প্রকৌশলী": "Engineer",
  "ইঞ্জিনিয়ার": "Engineer",
  "ছাত্র": "Student",
  "শিক্ষার্থী": "Student",
  "সমাজসেবক": "Social Worker",
  "সমাজকর্মী": "Social Worker",
  "সমাজ সেবক": "Social Worker",
  "উদ্যোক্তা": "Entrepreneur",
  "সরকারি": "Govt.",
  "সরকারী": "Govt.",
  "প্রাথমিক": "Primary",
  "প্রধান": "Head",
  "পিতা": "Father",
  "মাতা": "Mother",
  "এলাকা": "Area",
  "ঠিকানা": "Address",
  "পেশা": "Profession",
  "রক্তের গ্রুপ": "Blood Group",
  "মোবাইল": "Mobile",
  "ফোন": "Phone"
};

// Location keywords & variations
const KNOWN_LOCATIONS: Record<string, string> = {
  "বীরখাল (পশ্চিম পাড়া)": "Birkhal (West Para)",
  "বীরখাল (পশ্চিম পাড়া)": "Birkhal (West Para)",
  "বীরখাল (পূর্ব পাড়া)": "Birkhal (East Para)",
  "বীরখাল (পূর্ব পাড়া)": "Birkhal (East Para)",
  "বীরখাল (উত্তর পাড়া)": "Birkhal (North Para)",
  "বীরখাল (উত্তর পাড়া)": "Birkhal (North Para)",
  "বীরখাল (দক্ষিণ পাড়া)": "Birkhal (South Para)",
  "বীরখাল (দক্ষিণ পাড়া)": "Birkhal (South Para)",
  "বীরখাল (মধ্য পাড়া)": "Birkhal (Central Para)",
  "বীরখাল (মধ্য পাড়া)": "Birkhal (Central Para)",
  "বীরখাল পশ্চিম পাড়া": "Birkhal West Para",
  "বীরখাল পশ্চিম পাড়া": "Birkhal West Para",
  "বীরখাল পশ্চিমপাড়া": "Birkhal West Para",
  "বীরখাল পূর্ব পাড়া": "Birkhal East Para",
  "বীরখাল পূর্বপাড়া": "Birkhal East Para",
  "বীরখাল উত্তর পাড়া": "Birkhal North Para",
  "বীরখাল উত্তরপাড়া": "Birkhal North Para",
  "বীরখাল দক্ষিণ পাড়া": "Birkhal South Para",
  "বীরখাল দক্ষিণপাড়া": "Birkhal South Para",
  "বীরখাল মধ্য পাড়া": "Birkhal Central Para",
  "বীরখাল মধ্যপাড়া": "Birkhal Central Para",
  "পশ্চিম পাড়া": "West Para",
  "পশ্চিম পাড়া": "West Para",
  "পশ্চিমপাড়া": "West Para",
  "পশ্চিমপাড়া": "West Para",
  "পূর্ব পাড়া": "East Para",
  "পূর্ব পাড়া": "East Para",
  "পূর্বপাড়া": "East Para",
  "পূর্বপাড়া": "East Para",
  "উত্তর পাড়া": "North Para",
  "উত্তর পাড়া": "North Para",
  "উত্তরপাড়া": "North Para",
  "উত্তরপাড়া": "North Para",
  "দক্ষিণ পাড়া": "South Para",
  "দক্ষিণ পাড়া": "South Para",
  "দক্ষিণপাড়া": "South Para",
  "দক্ষিণপাড়া": "South Para",
  "মধ্য পাড়া": "Central Para",
  "মধ্য পাড়া": "Central Para",
  "মধ্যপাড়া": "Central Para",
  "মধ্যপাড়া": "Central Para",
  "বীরখাল": "Birkhal",
  "চান্দিনা": "Chandina",
  "কুমিল্লা": "Cumilla",
  "কাদুটি": "Kaduti",
  "বাজার": "Bazar",
  "মাইজখার": "Maijkhar",
  "বাড়েরা": "Barera",
  "মহিচাইল": "Mohichail",
  "কেরণখাল": "Keronkhal",
  "শুহিলপুর": "Shuhilpur",
  "বাতাঘাসী": "Bataghasi",
  "দোল্লাই": "Dollai",
  "নবাবপুর": "Nawabpur",
  "জোড়পুকুরিয়া": "Jorpukuria",
  "বরকইট": "Barkait",
  "গল্লাই": "Gallai",
  "ভাড়েল্লা": "Bharella",
  "ভারেলা": "Bharella",
  "বুড়িচং": "Burichang",
  "বুড়িচং": "Burichang",
  "দেবীদ্বার": "Debidwar",
  "মুরাদনগর": "Muradnagar",
  "দাউদকান্দি": "Daudkandi",
  "হোমনা": "Homna",
  "তিতাস": "Titas",
  "মেঘনা": "Meghna",
  "বরুড়া": "Barura",
  "লাকসাম": "Laksam",
  "মনোহরগঞ্জ": "Monohargonj",
  "নাঙ্গলকোট": "Nangalkot",
  "চৌদ্দগ্রাম": "Chauddagram",
  "ব্রাহ্মণপাড়া": "Brahmanpara",
  "পশ্চিম": "West",
  "পূর্ব": "East",
  "উত্তর": "North",
  "দক্ষিণ": "South",
  "মধ্য": "Central",
  "পাড়া": "Para",
  "পাড়া": "Para",
  "গ্রাম": "Village",
  "ওয়ার্ড": "Ward",
  "ইউনিয়ন": "Union",
  "উপজেলা": "Upazila",
  "থানা": "Thana",
  "জেলা": "District"
};

// Role translation mapping
const KNOWN_ROLES: Record<string, string> = {
  "সভাপতি": "President",
  "সহ-সভাপতি": "Vice President",
  "সহ সভাপতি": "Vice President",
  "সিনিয়র সহ-সভাপতি": "Senior Vice President",
  "সিনিয়র সহ-সভাপতি": "Senior Vice President",
  "সিনিয়র সহ সভাপতি": "Senior Vice President",
  "সাধারণ সম্পাদক": "General Secretary",
  "যুগ্ম সাধারণ সম্পাদক": "Joint General Secretary",
  "যুগ্ম-সাধারণ সম্পাদক": "Joint General Secretary",
  "সাংগঠনিক সম্পাদক": "Organizing Secretary",
  "সহ-সাংগঠনিক সম্পাদক": "Assistant Organizing Secretary",
  "সহ সাংগঠনিক সম্পাদক": "Assistant Organizing Secretary",
  "অর্থ সম্পাদক": "Finance Secretary",
  "কোষাধ্যক্ষ": "Treasurer",
  "ত্রাণ সম্পাদক": "Relief Secretary",
  "উপ-ত্রাণ সম্পাদক": "Assistant Relief Secretary",
  "উপ ত্রাণ সম্পাদক": "Assistant Relief Secretary",
  "ত্রাণ ও পুনর্বাসন সম্পাদক": "Relief & Rehabilitation Secretary",
  "ক্রীড়া সম্পাদক": "Sports Secretary",
  "ক্রীড়া সম্পাদক": "Sports Secretary",
  "উপ-ক্রীড়া সম্পাদক": "Assistant Sports Secretary",
  "উপ ক্রীড়া সম্পাদক": "Assistant Sports Secretary",
  "উপ-ক্রীড়া সম্পাদক": "Assistant Sports Secretary",
  "ক্রীড়া ও সাংস্কৃতিক সম্পাদক": "Sports & Cultural Secretary",
  "ক্রীড়া ও সাংস্কৃতিক সম্পাদক": "Sports & Cultural Secretary",
  "সাংস্কৃতিক সম্পাদক": "Cultural Secretary",
  "প্রচার সম্পাদক": "Publicity Secretary",
  "উপ-প্রচার সম্পাদক": "Assistant Publicity Secretary",
  "প্রচার ও প্রকাশনা সম্পাদক": "Publicity & Publication Secretary",
  "প্রকাশনা সম্পাদক": "Publication Secretary",
  "দপ্তর সম্পাদক": "Office Secretary",
  "উপ-দপ্তর সম্পাদক": "Assistant Office Secretary",
  "সমাজকল্যাণ সম্পাদক": "Social Welfare Secretary",
  "সমাজ সেবা সম্পাদক": "Social Service Secretary",
  "সমাজকল্যাণ ও ত্রাণ সম্পাদক": "Social Welfare & Relief Secretary",
  "শিক্ষা সম্পাদক": "Education Secretary",
  "শিক্ষা ও সাহিত্য সম্পাদক": "Education & Literature Secretary",
  "স্বাস্থ্য সম্পাদক": "Health Secretary",
  "চিকিৎসা সম্পাদক": "Medical Secretary",
  "স্বাস্থ্য ও চিকিৎসা বিষয়ক সম্পাদক": "Health & Medical Secretary",
  "ধর্ম বিষয়ক সম্পাদক": "Religious Affairs Secretary",
  "ধর্ম সম্পাদক": "Religious Affairs Secretary",
  "তথ্য ও প্রযুক্তি সম্পাদক": "IT & Technology Secretary",
  "তথ্য প্রযুক্তি সম্পাদক": "IT Secretary",
  "আইন সম্পাদক": "Legal Secretary",
  "আইন ও মানবাধিকার সম্পাদক": "Legal & Human Rights Secretary",
  "মহিলা বিষয়ক সম্পাদক": "Women Affairs Secretary",
  "পরিবেশ সম্পাদক": "Environment Secretary",
  "পরিবেশ ও বৃক্ষরোপণ সম্পাদক": "Environment & Plantation Secretary",
  "আন্তর্জাতিক বিষয়ক সম্পাদক": "International Affairs Secretary",
  "আপ্যায়ন সম্পাদক": "Entertainment Secretary",
  "পাঠাগার সম্পাদক": "Library Secretary",
  "স্বেচ্ছাসেবক বিষয়ক সম্পাদক": "Volunteer Affairs Secretary",
  "প্রধান উপদেষ্টা": "Chief Advisor",
  "উপদেষ্টা": "Advisor",
  "উপদেষ্টা মণ্ডলীর সদস্য": "Advisory Board Member",
  "কার্যনির্বাহী সদস্য": "Executive Member",
  "কার্যকরী সদস্য": "Executive Member",
  "সদস্য": "Member",
  "সাধারণ সদস্য": "General Member",
  "আজীবন সদস্য": "Life Member",
  "প্রতিষ্ঠাতা": "Founder",
  "প্রতিষ্ঠাতা সভাপতি": "Founding President",
  "প্রতিষ্ঠাতা সাধারণ সম্পাদক": "Founding General Secretary",
  "সংযোজক": "Coordinator"
};

// Bengali vowel & consonant phonetic map
const BENGALI_CHAR_MAP: Record<string, string> = {
  'অ': 'o', 'আ': 'a', 'ই': 'i', 'ঈ': 'i', 'উ': 'u', 'ঊ': 'u', 'ঋ': 'ri', 'এ': 'e', 'ঐ': 'oi', 'ও': 'o', 'ঔ': 'ou',
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
  'ক': 'k', 'খ': 'kh', 'গ': 'g', 'ঘ': 'gh', 'ঙ': 'ng',
  'চ': 'ch', 'ছ': 'chh', 'জ': 'j', 'ঝ': 'jh', 'ঞ': 'n',
  'ট': 't', 'ঠ': 'th', 'ড': 'd', 'ঢ': 'dh', 'ণ': 'n',
  'ত': 't', 'থ': 'th', 'দ': 'd', 'ধ': 'dh', 'ন': 'n',
  'প': 'p', 'ফ': 'f', 'ব': 'b', 'ভ': 'bh', 'ম': 'm',
  'য': 'j', 'র': 'r', 'ল': 'l', 'শ': 'sh', 'ষ': 'sh', 'স': 's', 'হ': 'h',
  'ড়': 'r', 'ঢ়': 'rh', 'য়': 'y', 'ৎ': 't', 'ং': 'ng', 'ঃ': 'h', 'ঁ': '', '্': ''
};

/**
 * Phonetically transliterates a single Bengali word
 */
export function phoneticTransliterateWord(word: string): string {
  if (!word) return "";
  const cleaned = word.trim();
  if (KNOWN_NAMES[cleaned]) return KNOWN_NAMES[cleaned];
  if (KNOWN_LOCATIONS[cleaned]) return KNOWN_LOCATIONS[cleaned];
  if (KNOWN_PHRASES[cleaned]) return KNOWN_PHRASES[cleaned];

  let result = "";
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (BENGALI_CHAR_MAP[char] !== undefined) {
      result += BENGALI_CHAR_MAP[char];
    } else {
      result += char;
    }
  }

  // Capitalize first letter
  if (result.length > 0) {
    return result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

/**
 * Translates/transliterates any Bengali Name
 */
export function translateBanglaName(name: string, lang: string): string {
  if (!name) return "";
  if (lang === "bn") return name;

  // Split by whitespace or punctuation
  const words = name.trim().split(/(\s+|[.,()\-]+)/);
  const translated = words.map(w => {
    const trimmed = w.trim();
    if (!trimmed) return w;
    if (KNOWN_NAMES[trimmed]) return KNOWN_NAMES[trimmed];
    // Check without colon e.g. "মো:" -> "Md."
    if (trimmed === "মো:" || trimmed === "মোঃ") return "Md.";
    if (/^[a-zA-Z0-9\s.,()\-]+$/.test(trimmed)) return trimmed; // already English
    return phoneticTransliterateWord(trimmed);
  });

  return translated.join("").replace(/\s+/g, " ").trim();
}

/**
 * Translates any Bengali Committee Role or Institutional Title
 */
export function translateBanglaRole(role: string, lang: string): string {
  if (!role) return "";
  const cleanRole = role.trim();
  if (lang === "bn") {
    return cleanRole.replace(/\s*\([^)]*\)/g, "").trim();
  }

  // Check direct exact match
  if (KNOWN_ROLES[cleanRole]) return KNOWN_ROLES[cleanRole];
  if (KNOWN_PHRASES[cleanRole]) return KNOWN_PHRASES[cleanRole];

  // If role has English inside parenthesis e.g. "সভাপতি (President)"
  const bracketMatch = cleanRole.match(/\(([^)]+)\)/);
  if (bracketMatch && bracketMatch[1] && /^[a-zA-Z\s&/]+$/.test(bracketMatch[1].trim())) {
    return bracketMatch[1].trim();
  }

  let translatedRole = cleanRole;

  // Replace known institutional & position phrases first (Longest first)
  for (const [bn, en] of Object.entries(KNOWN_PHRASES)) {
    if (translatedRole.includes(bn)) {
      translatedRole = translatedRole.split(bn).join(en);
    }
  }

  // Replace known roles
  for (const [bn, en] of Object.entries(KNOWN_ROLES)) {
    if (translatedRole.includes(bn)) {
      translatedRole = translatedRole.split(bn).join(en);
    }
  }

  // Replace known locations
  for (const [bn, en] of Object.entries(KNOWN_LOCATIONS)) {
    if (translatedRole.includes(bn)) {
      translatedRole = translatedRole.split(bn).join(en);
    }
  }

  // Prefix combinations
  translatedRole = translatedRole
    .replace(/উপ[- ]?/g, "Assistant ")
    .replace(/সহ[- ]?/g, "Vice ")
    .replace(/সিনিয়র /g, "Senior ")
    .replace(/সিনিয়র /g, "Senior ")
    .replace(/সম্পাদক/g, "Secretary")
    .replace(/পরিষদ/g, "Council")
    .replace(/কমিটি/g, "Committee");

  // If any residual Bengali words exist in the role string, translate them
  if (/[\u0980-\u09FF]/.test(translatedRole)) {
    const parts = translatedRole.split(/(\s+|[.,()\-–—]+)/);
    translatedRole = parts.map(p => {
      const trimmed = p.trim();
      if (!trimmed || !/[\u0980-\u09FF]/.test(trimmed)) return p;
      if (KNOWN_PHRASES[trimmed]) return KNOWN_PHRASES[trimmed];
      if (KNOWN_LOCATIONS[trimmed]) return KNOWN_LOCATIONS[trimmed];
      if (KNOWN_NAMES[trimmed]) return KNOWN_NAMES[trimmed];
      return phoneticTransliterateWord(trimmed);
    }).join("");
  }

  return translatedRole.replace(/\s+/g, " ").trim();
}

/**
 * Translates Bengali Address / Location
 */
export function translateBanglaAddress(address: string, lang: string): string {
  if (!address) return "";
  if (lang === "bn") return address;

  let trans = address.trim();

  // Replace known full phrases / locations
  for (const [bn, en] of Object.entries(KNOWN_LOCATIONS)) {
    trans = trans.split(bn).join(en);
  }

  // Catch any mixed text like "West পাড়া" or "East পাড়া"
  trans = trans
    .replace(/West\s*[পপা][াড়ড়]া/gi, "West Para")
    .replace(/East\s*[পপা][াড়ড়]া/gi, "East Para")
    .replace(/North\s*[পপা][াড়ড়]া/gi, "North Para")
    .replace(/South\s*[পপা][াড়ড়]া/gi, "South Para")
    .replace(/Central\s*[পপা][াড়ড়]া/gi, "Central Para")
    .replace(/[পপা][াড়ড়]া/g, "Para")
    .replace(/বীরখাল/g, "Birkhal")
    .replace(/চান্দিনা/g, "Chandina")
    .replace(/কুমিল্লা/g, "Cumilla")
    .replace(/কাদুটি/g, "Kaduti")
    .replace(/বাজার/g, "Bazar");

  // Transliterate any remaining Bengali word
  if (/[\u0980-\u09FF]/.test(trans)) {
    const parts = trans.split(/(\s+|[.,()\-]+)/);
    trans = parts.map(p => {
      const trimmed = p.trim();
      if (!trimmed || !/[\u0980-\u09FF]/.test(trimmed)) return p;
      if (KNOWN_LOCATIONS[trimmed]) return KNOWN_LOCATIONS[trimmed];
      return phoneticTransliterateWord(trimmed);
    }).join("");
  }

  return trans.replace(/\s+/g, " ").trim();
}

/**
 * Translates Bengali Bio / Parentage / Area / Quote description
 */
export function translateBanglaBio(bio: string, lang: string): string {
  if (!bio) return "";
  if (lang === "bn") return bio;

  let trans = bio.trim();

  // Common bio label translations
  trans = trans
    .replace(/পিতা\s*:\s*/g, "Father: ")
    .replace(/মাতা\s*:\s*/g, "Mother: ")
    .replace(/এলাকা\s*:\s*/g, "Area: ")
    .replace(/গ্রাম\s*:\s*/g, "Village: ")
    .replace(/ঠিকানা\s*:\s*/g, "Address: ")
    .replace(/পেশা\s*:\s*/g, "Profession: ");

  // Translate known full phrases first (Longest first)
  for (const [bn, en] of Object.entries(KNOWN_PHRASES)) {
    trans = trans.split(bn).join(en);
  }

  // Translate locations inside bio
  for (const [bn, en] of Object.entries(KNOWN_LOCATIONS)) {
    trans = trans.split(bn).join(en);
  }

  // Translate names inside bio (e.g. "ফুল মিয়া" -> "Ful Miah")
  for (const [bn, en] of Object.entries(KNOWN_NAMES)) {
    trans = trans.split(bn).join(en);
  }

  // Catch any mixed text
  trans = trans
    .replace(/West\s*[পপা][াড়ড়]া/gi, "West Para")
    .replace(/East\s*[পপা][াড়ড়]া/gi, "East Para")
    .replace(/North\s*[পপা][াড়ড়]া/gi, "North Para")
    .replace(/South\s*[পপা][াড়ড়]া/gi, "South Para")
    .replace(/Central\s*[পপা][াড়ড়]া/gi, "Central Para")
    .replace(/[পপা][াড়ড়]া/g, "Para");

  // If any residual Bengali words exist, transliterate them
  if (/[\u0980-\u09FF]/.test(trans)) {
    const parts = trans.split(/(\s+|[.,()\-–—'"]+)/);
    trans = parts.map(p => {
      const trimmed = p.trim();
      if (!trimmed || !/[\u0980-\u09FF]/.test(trimmed)) return p;
      if (KNOWN_PHRASES[trimmed]) return KNOWN_PHRASES[trimmed];
      if (KNOWN_LOCATIONS[trimmed]) return KNOWN_LOCATIONS[trimmed];
      if (KNOWN_NAMES[trimmed]) return KNOWN_NAMES[trimmed];
      return phoneticTransliterateWord(trimmed);
    }).join("");
  }

  return trans.replace(/\s+/g, " ").trim();
}
