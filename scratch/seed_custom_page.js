const mongoose = require('mongoose');
const fs = require('fs');

const content = fs.readFileSync('.env', 'utf8');
let uri = '';
content.split(/\r?\n/).forEach(l => {
  if (l.trim().startsWith('MONGODB_URI=')) {
    uri = l.substring('MONGODB_URI='.length).trim().replace(/^["']|["']$/g, '');
  }
});

const customPageSchema = new mongoose.Schema({
  titleBn: String,
  titleEn: String,
  slug: { type: String, unique: true },
  subtitleBn: String,
  subtitleEn: String,
  showInNavbar: Boolean,
  showInFooter: Boolean,
  status: String,
  sections: Array
}, { timestamps: true });

const CustomPage = mongoose.models.CustomPage || mongoose.model('CustomPage', customPageSchema);

async function seed() {
  await mongoose.connect(uri);
  const count = await CustomPage.countDocuments({ slug: 'scholarship-2026' });
  if (count === 0) {
    await CustomPage.create({
      titleBn: 'শিক্ষা ও মেধা বৃত্তি ২০২৬',
      titleEn: 'Education & Merit Scholarship 2026',
      slug: 'scholarship-2026',
      subtitleBn: 'বীরখাল গ্রামের সুবিধাবঞ্চিত ও মেধাবী শিক্ষার্থীদের উচ্চশিক্ষায় বিশেষ আর্থিক সহায়তা ও শিক্ষা উপকরণ বিতরণ প্রকল্প।',
      subtitleEn: 'Financial assistance and academic sponsorship for underprivileged students of Birkhal village.',
      showInNavbar: true,
      showInFooter: true,
      status: 'published',
      sections: [
        {
          id: 'sec-1',
          type: 'text_block',
          titleBn: 'প্রকল্পের প্রেক্ষাপট ও লক্ষ্য',
          titleEn: 'Project Background & Objectives',
          contentBn: 'বীরখাল সমাজ কল্যাণ যুব সংগঠন ২০১৫ সাল থেকে গ্রামের প্রতিটি মেধাবী শিক্ষার্থীর পাশে দাঁড়িয়ে আসছে। আর্থিক অনটনের কারণে যেন কোনো শিক্ষার্থীর পড়ালেখা বন্ধ না হয়ে যায়, সেজন্য প্রতি বছর প্রাথমিক থেকে স্নাতক পর্যায় পর্যন্ত শিক্ষার্থীদের বৃত্তি ও প্রয়োজনীয় বইপত্র প্রদান করা হয়।'
        },
        {
          id: 'sec-2',
          type: 'cards_grid',
          titleBn: 'বৃত্তি কর্মসূচির প্রধান সুবিধাসমূহ',
          titleEn: 'Key Program Highlights',
          items: [
            { titleBn: '১০০% মাসিক ফি ও বইপত্র', titleEn: '100% Tuition & Books', descBn: 'মেধাবী শিক্ষার্থীদের সম্পূর্ণ মাসিক বেতন ও পরীক্ষার ফি পরিশোধ করা হয়।' },
            { titleBn: 'বিশেষ গাইডেন্স ও মেন্টরিং', titleEn: 'Academic Mentoring', descBn: 'বিশ্ববিদ্যালয় পড়ুয়া সিনিয়র ভাইদের মাধ্যমে নিয়মিত পড়াশোনার পরামর্শ ও দিকনির্দেশনা।' },
            { titleBn: 'বার্ষিক মেধা পুরস্কার', titleEn: 'Annual Excellence Award', descBn: 'এসএসসি ও এইচএসসি পরীক্ষায় জিপিএ-৫ প্রাপ্তদের বিশেষ সম্মাননা ক্রেস্ট ও এককালীন অনুদান।' }
          ]
        },
        {
          id: 'sec-3',
          type: 'faq_accordion',
          titleBn: 'আবেদন সংক্রান্ত সাধারণ প্রশ্নোত্তর (FAQ)',
          titleEn: 'Application FAQ',
          items: [
            { titleBn: 'কেমন করে বৃত্তির জন্য আবেদন করতে হবে?', titleEn: 'How to apply for scholarship?', descBn: 'আমাদের অনলাইন সদস্য ভর্তি ফরম অথবা সরাসরি বীরখাল কার্যালয়ে এসে লিখিত ফরম পূরণ করতে হবে।' },
            { titleBn: 'আবেদনের প্রয়োজনীয় কাগজপত্র কী কী?', titleEn: 'Required documents?', descBn: 'সর্বশেষ পরীক্ষার মার্কশিট, জন্ম নিবন্ধন / এনআইডি কার্ডের ফটোকপি এবং অভিভাবকের আয়ের প্রমাণ।' }
          ]
        },
        {
          id: 'sec-4',
          type: 'cta_box',
          titleBn: 'মেধাবী শিক্ষার্থীদের ভবিষ্যতের অংশীদার হোন',
          titleEn: 'Be a Partner in an Educated Future',
          buttonTextBn: 'বৃত্তি তহবিলে অনুদান দিন',
          buttonTextEn: 'Donate to Scholarship Fund',
          buttonUrl: '/donations'
        }
      ]
    });
    console.log('Sample custom page seeded successfully!');
  } else {
    console.log('Custom page already exists in database.');
  }
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
