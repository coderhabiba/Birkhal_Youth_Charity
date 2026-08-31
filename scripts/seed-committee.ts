import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://birkhalyouthorg_db_user:EeqnMH8Q39VleBRC@cluster0.8hr2yka.mongodb.net/?appName=Cluster0';

const CommitteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    description: { type: String, default: '' },
    address: { type: String, default: '' },
    image: { type: String },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const MemberSchema = new mongoose.Schema({
  nameBn: { type: String, required: true },
  nameEn: { type: String, required: true },
  fatherHusbandName: { type: String, required: true },
  motherName: { type: String, default: 'মাতা' },
  dateOfBirth: { type: String, default: '2000-01-01' },
  bloodGroup: { type: String, default: 'A+' },
  mobileNumber: { type: String, default: '01882447721' },
  email: { type: String, default: '' },
  nidOrBirthCert: { type: String, default: '19951912345678901' },
  presentAddress: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  photoUrl: { type: String },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved',
  },
  createdAt: { type: Date, default: Date.now },
});

const Committee =
  mongoose.models.Committee || mongoose.model('Committee', CommitteeSchema);
const Member = mongoose.models.Member || mongoose.model('Member', MemberSchema);

// Official 7 Advisors from Image 1
const advisors = [
  {
    name: 'এমদাদুল হক মাস্টার',
    role: 'উপদেষ্টা - প্রধান শিক্ষক বীরখাল প্রাথমিক সরকারি বিদ্যালয়',
    description: 'প্রধান শিক্ষক বীরখাল প্রাথমিক সরকারি বিদ্যালয়',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-1.jpeg',
    isVerified: true,
  },
  {
    name: 'মাওলানা ইমরানুল হক',
    role: 'উপদেষ্টা - মুহাদ্দিস ভারেল্লা কামিল মাদ্রাসা বুড়িচং',
    description: 'মুহাদ্দিস ভারেল্লা কামিল মাদ্রাসা বুড়িচং',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-2.jpeg',
    isVerified: true,
  },
  {
    name: 'সুলতান আহম্মেদ মাস্টার',
    role: 'উপদেষ্টা - শিক্ষক বীরখাল প্রাথমিক সরকারি বিদ্যালয়',
    description: 'শিক্ষক বীরখাল প্রাথমিক সরকারি বিদ্যালয়',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-3.jpeg',
    isVerified: true,
  },
  {
    name: 'মাজেদুল হক প্রধান',
    role: 'উপদেষ্টা - গ্রাম সহ-সভাপতি বীরখাল',
    description: 'গ্রাম সহ-সভাপতি বীরখাল',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-4.jpeg',
    isVerified: true,
  },
  {
    name: 'হাজী শাহ আলম প্রধান',
    role: 'উপদেষ্টা - গ্রাম সমাজ প্রধান বীরখাল',
    description: 'গ্রাম সমাজ প্রধান বীরখাল',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-5.jpeg',
    isVerified: true,
  },
  {
    name: 'আব্দুল করিম মেম্বার',
    role: 'উপদেষ্টা - বীরখাল ৪নং ওয়ার্ড মেম্বার',
    description: 'বীরখাল ৪নং ওয়ার্ড মেম্বার',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-6.jpeg',
    isVerified: true,
  },
  {
    name: 'আব্দুস সাত্তার',
    role: 'উপদেষ্টা - বিশিষ্ট ব্যবসায়ী সৌদি আরব',
    description: 'বিশিষ্ট ব্যবসায়ী সৌদি আরব',
    address: 'বীরখাল, চান্দিনা, কুমিল্লা',
    image: '/up-7.jpeg',
    isVerified: true,
  },
];

// Official 33 Committee Members from Image 2
const executiveCommittee = [
  {
    num: 1,
    name: 'আলী আশরাফ (তুহিন)',
    nameEn: 'Ali Ashraf (Tuhin)',
    role: 'সভাপতি',
    father: 'সিরাজুল ইসলাম',
    area: 'পশ্চিম পাড়া',
    image: '/up-8.jpeg',
    blood: 'A+',
  },
  {
    num: 2,
    name: 'ফখরুল ইসলাম',
    nameEn: 'Fakhrul Islam',
    role: 'সিনিয়র সহ-সভাপতি',
    father: 'মোঃ অদুদ মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-9.jpeg',
    blood: 'B+',
  },
  {
    num: 3,
    name: 'মোঃ আজাদ',
    nameEn: 'Md. Azad',
    role: 'সহ-সভাপতি',
    father: 'আলী আশরাফ প্রধান',
    area: 'মধ্য পাড়া',
    image: '/up-10.jpeg',
    blood: 'O+',
  },
  {
    num: 4,
    name: 'মোঃ বিল্লাল',
    nameEn: 'Md. Billal',
    role: 'সহ-সভাপতি',
    father: 'সুরুজ মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-11.jpeg',
    blood: 'AB+',
  },
  {
    num: 5,
    name: 'মহাসিন সরকার',
    nameEn: 'Mohasin Sarker',
    role: 'সহ-সভাপতি',
    father: 'মোঃ মতিন সরকার',
    area: 'উত্তর পাড়া',
    image: '/up-12.jpeg',
    blood: 'A+',
  },
  {
    num: 6,
    name: 'সাজ্জাদ হোসেন সুমন',
    nameEn: 'Sajjad Hossain Sumon',
    role: 'সাধারণ সম্পাদক',
    father: 'হাজী শাহ আলম প্রধান',
    area: 'পশ্চিম পাড়া',
    image: '/up-13.jpeg',
    blood: 'O+',
  },
  {
    num: 7,
    name: 'মহিউদ্দিন সরকার',
    nameEn: 'Mohiuddin Sarker',
    role: 'সিনিয়র যুগ্ম সাধারণ সম্পাদক',
    father: 'মোঃ লনি মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-14.jpeg',
    blood: 'B+',
  },
  {
    num: 8,
    name: 'ইসমাইল মজুমদার',
    nameEn: 'Ismail Majumder',
    role: 'যুগ্ম-সাধারণ সম্পাদক',
    father: 'সিরাজ মজুমদার',
    area: 'উত্তর পাড়া',
    image: '/up-15.jpeg',
    blood: 'A+',
  },
  {
    num: 9,
    name: 'রুবেল খান',
    nameEn: 'Rubel Khan',
    role: 'যুগ্ম-সাধারণ সম্পাদক',
    father: 'আবু কালাম',
    area: 'মধ্য পাড়া',
    image: '/up-16.jpeg',
    blood: 'O+',
  },
  {
    num: 10,
    name: 'আল আমিন গাজী',
    nameEn: 'Al Amin Gazi',
    role: 'যুগ্ম-সাধারণ সম্পাদক',
    father: 'আবুল মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-17.jpeg',
    blood: 'B+',
  },
  {
    num: 11,
    name: 'সাইফুল ইসলাম মজুমদার',
    nameEn: 'Saiful Islam Majumder',
    role: 'সাংগঠনিক সম্পাদক',
    father: 'গিয়াসউদ্দিন প্রধান',
    area: 'উত্তর পাড়া',
    image: '/up-18.jpeg',
    blood: 'A+',
  },
  {
    num: 12,
    name: 'সোহেল মিয়াজি',
    nameEn: 'Sohel Miazi',
    role: 'সিনিয়র সহ সাংগঠনিক সম্পাদক',
    father: 'আবু তাহের মিয়াজি',
    area: 'উত্তর পাড়া',
    image: '/up-19.jpeg',
    blood: 'AB+',
  },
  {
    num: 13,
    name: 'ফারুক মিয়াঁ',
    nameEn: 'Faruk Mia',
    role: 'উপ সাংগঠনিক সম্পাদক',
    father: 'নজির আহম্মদ',
    area: 'পশ্চিম পাড়া',
    image: '/up-20.jpeg',
    blood: 'O+',
  },
  {
    num: 14,
    name: 'মেহেদি হাসান',
    nameEn: 'Mehedi Hasan',
    role: 'উপ সাংগঠনিক সম্পাদক',
    father: 'রুহুল আমিন',
    area: 'পশ্চিম পাড়া',
    image: '/up-21.jpeg',
    blood: 'B+',
  },
  {
    num: 15,
    name: 'আবু ইউসুফ',
    nameEn: 'Abu Yusuf',
    role: 'উপ সাংগঠনিক সম্পাদক',
    father: 'মোঃ অদুদ মিয়াঁ',
    area: 'পূর্ব পাড়া',
    image: '/up-22.jpeg',
    blood: 'A+',
  },
  {
    num: 16,
    name: 'শাহাব উদ্দিন',
    nameEn: 'Shahab Uddin',
    role: 'অর্থ ও সমাজসেবা সম্পাদক',
    father: 'হোছন আলী প্রধান',
    area: 'পশ্চিম পাড়া',
    image: '/up-23.jpeg',
    blood: 'O+',
  },
  {
    num: 17,
    name: 'আবু কাশেম খান',
    nameEn: 'Abu Kashem Khan',
    role: 'সিনিয়র উপ সমাজসেবা সম্পাদক',
    father: 'আয়েত আলী',
    area: 'পশ্চিম পাড়া',
    image: '/up-24.jpeg',
    blood: 'B+',
  },
  {
    num: 18,
    name: 'মোঃ সোহেল সরকার',
    nameEn: 'Md. Sohel Sarker',
    role: 'উপ-সমাজসেবা সম্পাদক',
    father: 'মফিজুল ইসলাম',
    area: 'দক্ষিণ পাড়া',
    image: '/up-25.jpeg',
    blood: 'A+',
  },
  {
    num: 19,
    name: 'মোঃ মোহাইমিনুন',
    nameEn: 'Md. Mohaiminun',
    role: 'উপ-সমাজসেবা সম্পাদক',
    father: 'বাচ্ছু মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-26.jpeg',
    blood: 'O+',
  },
  {
    num: 20,
    name: 'মোঃ নাজমুল মাহতাব',
    nameEn: 'Md. Nazmul Mahtab',
    role: 'প্রচার ও উপ-অর্থ সম্পাদক',
    father: 'মোঃ মনির হোসেন',
    area: 'মধ্য পাড়া',
    image: '/up-27.jpeg',
    blood: 'AB+',
  },
  {
    num: 21,
    name: 'মোঃ ইরাজ হোসাইন',
    nameEn: 'Md. Iraj Hossain',
    role: 'উপ-প্রচার সম্পাদক',
    father: 'মোঃ আনু মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-28.jpeg',
    blood: 'B+',
  },
  {
    num: 22,
    name: 'মাওঃ ইমাম হোসাইন',
    nameEn: 'Maw. Imam Hossain',
    role: 'ধর্ম বিষয়ক সম্পাদক',
    father: 'আয়েত আলী',
    area: 'পশ্চিম পাড়া',
    image: '/up-29.jpeg',
    blood: 'A+',
  },
  {
    num: 23,
    name: 'হাফেজ মইনুদ্দিন সালেমি',
    nameEn: 'Hafez Moinuddin Salemi',
    role: 'উপ-ধর্ম বিষয়ক সম্পাদক',
    father: 'শাহ আলম প্রধান',
    area: 'পূর্ব পাড়া',
    image: '/up-30.jpeg',
    blood: 'O+',
  },
  {
    num: 24,
    name: 'হাফেজ ইউনুস মিয়াজি',
    nameEn: 'Hafez Yunus Miazi',
    role: 'উপ-ধর্ম বিষয়ক সম্পাদক',
    father: 'হালিম মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-31.jpeg',
    blood: 'B+',
  },
  {
    num: 25,
    name: 'ডাঃ জুনায়েদ সাদ্দাম',
    nameEn: 'Dr. Junayed Saddam',
    role: 'স্বাস্থ্যসেবা সম্পাদক',
    father: 'মোঃ এবায়েদুল্লাহ',
    area: 'পশ্চিম পাড়া',
    image: '/up-32.jpeg',
    blood: 'A+',
  },
  {
    num: 26,
    name: 'তাজুল ইসলাম',
    nameEn: 'Tajul Islam',
    role: 'উপ-স্বাস্থ্যসেবা সম্পাদক',
    father: 'নজির আহম্মদ',
    area: 'পশ্চিম পাড়া',
    image: '/up-33.jpeg',
    blood: 'O+',
  },
  {
    num: 27,
    name: 'হাবিবুল্লাহ হাবিব',
    nameEn: 'Habibullah Habib',
    role: 'উপ-স্বাস্থ্যসেবা সম্পাদক',
    father: 'সেলিম মিয়াঁ',
    area: 'দক্ষিণ পাড়া',
    image: '/up-34.jpeg',
    blood: 'B+',
  },
  {
    num: 28,
    name: 'মোফাজ্জল হোসেন',
    nameEn: 'Mofazzal Hossain',
    role: 'ত্রান বিষয়ক সম্পাদক',
    father: 'সিরাজ মিয়াঁ',
    area: 'পশ্চিম পাড়া',
    image: '/up-35.jpeg',
    blood: 'A+',
  },
  {
    num: 29,
    name: 'আতিকুর রহমান',
    nameEn: 'Atikur Rahman',
    role: 'সিনিয়র উপ-ত্রান সম্পাদক',
    father: 'ছফিউল্লাহ',
    area: 'পশ্চিম পাড়া',
    image: '/up-36.jpeg',
    blood: 'O+',
  },
  {
    num: 30,
    name: 'মোঃ মহিন',
    nameEn: 'Md. Mohin',
    role: 'উপ-ত্রান সম্পাদক',
    father: 'ফুল মিয়াঁ',
    area: 'পশ্চিম পাড়া',
    image: '/up-37.jpeg',
    blood: 'B+',
  },
  {
    num: 31,
    name: 'নুরুল ইসলাম',
    nameEn: 'Nurul Islam',
    role: 'উপ-ত্রান সম্পাদক',
    father: 'আব্দুল হক',
    area: 'পশ্চিম পাড়া',
    image: '/up-38.jpeg',
    blood: 'A+',
  },
  {
    num: 32,
    name: 'কাশেম মির্জা',
    nameEn: 'Kashem Mirza',
    role: 'ক্রীড়া সম্পাদক',
    father: 'মাজেদ মিয়াঁ',
    area: 'পশ্চিম পাড়া',
    image: '/up-39.jpeg',
    blood: 'O+',
  },
  {
    num: 33,
    name: 'শাহরিয়ার সুজন',
    nameEn: 'Shahriar Sujon',
    role: 'উপ-ক্রীড়া সম্পাদক',
    father: 'আলম মিয়াঁ',
    area: 'উত্তর পাড়া',
    image: '/up-40.jpeg',
    blood: 'AB+',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clean existing committee & members
    await Committee.deleteMany({});
    await Member.deleteMany({});
    console.log('Cleared old Committee and Member data');

    // Insert 7 Advisors
    for (const adv of advisors) {
      await Committee.create({
        name: adv.name,
        role: adv.role,
        description: adv.description,
        address: adv.address,
        image: adv.image,
        isVerified: true,
      });
    }
    console.log('Seeded 7 Advisors');

    // Insert 33 Executive Committee Members
    for (const exec of executiveCommittee) {
      await Committee.create({
        name: exec.name,
        role: exec.role,
        description: `পিতা: ${exec.father}, এলাকা: ${exec.area}`,
        address: `বীরখাল (${exec.area}), চান্দিনা, কুমিল্লা`,
        image: exec.image,
        isVerified: true,
      });

      // Also create approved member record
      await Member.create({
        nameBn: exec.name,
        nameEn: exec.nameEn,
        fatherHusbandName: exec.father,
        motherName: 'মাতা',
        dateOfBirth: '1998-05-15',
        bloodGroup: exec.blood,
        mobileNumber: '01882447721',
        email: `member${exec.num}@birkhalyouth.org`,
        nidOrBirthCert: `199819123456${exec.num.toString().padStart(4, '0')}`,
        presentAddress: `বীরখাল (${exec.area}), ডাকঘর: কাদুটি বাজার, উপজেলা: চান্দিনা, জেলা: কুমিল্লা`,
        permanentAddress: `বীরখাল (${exec.area}), ডাকঘর: কাদুটি বাজার, উপজেলা: চান্দিনা, জেলা: কুমিল্লা`,
        photoUrl: exec.image,
        status: 'approved',
      });
    }

    console.log(
      'Seeded 33 Executive Committee Members and General Members successfully!',
    );
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
