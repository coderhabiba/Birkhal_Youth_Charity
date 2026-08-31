'use client';

import {
  Save,
  Home,
  Info,
  PhoneCall,
  Loader2,
  LayoutTemplate,
  BarChart3,
  Image as ImageIcon,
  Users,
  BookOpen,
  Award,
  Heart,
  Upload,
  Layers,
  CheckCircle2,
  Trash2,
  Menu,
  Bell,
  MessageCircle,
  Share2,
  Sliders,
} from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/components/language-provider';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AlertModal } from '@/components/confirm-modal';

export default function ContentManagerPage() {
  const { language } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    'navbar' | 'home' | 'causes' | 'about' | 'donations' | 'contact' | 'footer'
  >('navbar');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // ================= NAVBAR & HEADER =================
    brand_name_en: 'Birkhal Youth',
    brand_name_bn: 'বীরখাল যুব সংগঠন',
    logo_url: '/logo.png',

    // Top Notification / Donation Ticker
    top_banner_enabled: 'true',
    top_banner_badge_en: 'Charity Appeal',
    top_banner_badge_bn: 'জরুরি মানবসেবা ফান্ড',
    top_banner_text_en:
      'Support Birkhal Youth Welfare Fund with your Zakat & Charity. bKash/Nagad: 01882447721',
    top_banner_text_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠনের তহবিলে আপনার যাকাত ও অনুদান দিন। বিকাশ/নগদ: 01882447721',
    top_banner_btn_en: 'Donate Now',
    top_banner_btn_bn: 'অনলাইনে অনুদান দিন',

    // Navbar Menu Links Toggles
    nav_about_enabled: 'true',
    nav_donations_enabled: 'true',
    nav_registration_enabled: 'true',
    nav_members_enabled: 'true',
    nav_contact_enabled: 'true',

    // ================= HOME PAGE =================
    // Hero
    section_hero_enabled: 'true',
    hero_badge_en: 'New Initiative 2026',
    hero_badge_bn: 'নতুন উদ্যোগ ২০২৬',
    hero_heading_en: 'Empowering Our Community Together',
    hero_heading_bn: 'আমাদের সমাজকে একসাথে শক্তিশালী করি',
    hero_desc_en:
      'Join us in building a brighter future for the youth of Cumilla. Your support creates local opportunities and fosters transparent growth.',
    hero_desc_bn:
      'কুমিল্লার যুবসমাজের জন্য একটি উজ্জ্বল ভবিষ্যৎ গড়তে আমাদের সাথে যোগ দিন। আপনার সহায়তা স্থানীয় সুযোগ তৈরি করে এবং স্বচ্ছ প্রবৃদ্ধি নিয়ে আসে।',
    home_hero_image: '/ai_education.jpg',

    // Section Toggles on Home Page
    section_stats_enabled: 'true',
    section_committee_enabled: 'true',
    section_causes_enabled: 'true',
    section_goal_enabled: 'true',
    section_members_enabled: 'true',
    section_gallery_enabled: 'true',
    section_rules_enabled: 'true',
    section_reviews_enabled: 'true',

    // Stats Counters
    stat_volunteers: '0',
    stat_volunteers_label_en: 'Families Supported',
    stat_volunteers_label_bn: 'পরিবারকে সহায়তা',
    stat_trees: '0',
    stat_trees_label_en: 'Trees Planted',
    stat_trees_label_bn: 'বৃক্ষরোপণ',
    stat_students: '0',
    stat_students_label_en: 'Students Helped',
    stat_students_label_bn: 'শিক্ষার্থীকে সহায়তা',

    // Gallery Section
    gallery_heading_en: 'Our Activity Moments & Gallery',
    gallery_heading_bn: 'আমাদের কার্যক্রমের ছবি ও স্মৃতি অ্যালবাম',
    gallery_desc_en:
      'A visual journey capturing the spirit, unity, and ground-level charity works of our youth volunteers.',
    gallery_desc_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠনের মাঠপর্যায়ের সমাজসেবা, ত্রাণ বিতরণ ও উন্নয়নমূলক কার্যক্রমের বাস্তব চিত্র।',

    // Committee Slider Section
    committee_heading_en: 'Our Dynamic Leadership Committee',
    committee_heading_bn: 'বীরখাল যুব সংগঠনের সুযোগ্য পরিচালনা পরিষদ',
    committee_desc_en:
      'The dedicated leaders driving positive changes, unity, and development in our society.',
    committee_desc_bn:
      'সততা, একতা ও মানবিক মূল্যবোধে সমাজ বিনির্মাণে নিবেদিত আমাদের সম্মানিত পরিচালনা ও উপদেষ্টা পর্ষদ।',

    // Members Directory Section
    members_heading_en: 'All Registered General Members',
    members_heading_bn: 'সংগঠনের সকল নিবেদিত সদস্যবৃন্দ',
    members_desc_en:
      'Meet the dynamic youth volunteers and members building a stronger future.',
    members_desc_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠনের নিবন্ধিত ও অনুমোদিত সকল সম্মানিত সদস্য ও স্বেচ্ছাসেবী তালিকা।',

    // Rules Section
    rules_heading_en: 'Constitutional Policies & Code of Conduct',
    rules_heading_bn: 'সাংগঠনিক নীতিমালা ও আচরণবিধি',
    rules_desc_en:
      'Official constitutional guidelines governing our youth organization.',
    rules_desc_bn:
      'একটি সুন্দর আদর্শ সমাজ বিনির্মাণে ও আর্ত মানবতার সেবায় বীরখাল সমাজ কল্যাণ সংগঠনের আনুষ্ঠানিক নীতিমালা।',

    // ================= CAUSES & 4 CARDS =================
    causes_title_en: 'Where Your Support Goes',
    causes_title_bn: 'যেখানে আপনার অনুদান ব্যবহৃত হয়',
    causes_desc_en: 'We work in the areas where the need is greatest.',
    causes_desc_bn:
      'যেখানে প্রয়োজন সবচেয়ে বেশি আমরা সেসকল ক্ষেত্রেই কাজ করি।',

    // Cause 1
    cause_1_image: '/ai_education.jpg',
    cause_1_title_en: 'Education for All',
    cause_1_title_bn: 'সবার জন্য শিক্ষা',
    cause_1_desc_en:
      'Help children build a brighter future with education resources.',
    cause_1_desc_bn:
      'শিশুদের একটি উজ্জ্বল ভবিষ্যৎ গড়তে শিক্ষা সামগ্রী ও বৃত্তি প্রদান করুন।',

    // Cause 2
    cause_2_image: '/ai_plantation.jpg',
    cause_2_title_en: 'Plantation & Environment',
    cause_2_title_bn: 'বৃক্ষরোপণ ও পরিবেশ',
    cause_2_desc_en:
      'Contribute to a greener planet and sustainable local ecology.',
    cause_2_desc_bn:
      'সবুজ পৃথিবী ও টেকসই পরিবেশ রক্ষায় বৃক্ষরোপণে অংশগ্রহণ করুন।',

    // Cause 3
    cause_3_image: '/ai_medical.jpg',
    cause_3_title_en: 'Healthcare & Support',
    cause_3_title_bn: 'স্বাস্থ্যসেবা ও চিকিৎসা',
    cause_3_desc_en:
      'Provide essential medical care and free medicines to families.',
    cause_3_desc_bn:
      'দরিদ্র ও অসহায় পরিবারগুলোকে প্রয়োজনীয় চিকিৎসাসেবা ও ওষুধ সরবরাহ করুন।',

    // Cause 4
    cause_4_image: '/ai_relief.jpg',
    cause_4_title_en: 'Emergency Relief',
    cause_4_title_bn: 'জরুরি ত্রাণ সহায়তা',
    cause_4_desc_en:
      'Support families and vulnerable communities in disaster crises.',
    cause_4_desc_bn:
      'বন্যা ও প্রাকৃতিক দুর্যোগে ক্ষতিগ্রস্ত মানুষের পাশে জরুরি ত্রাণ নিয়ে দাঁড়ান।',

    // Goal Section
    goal_title_en: 'Our Goal & Core Focus',
    goal_title_bn: 'আমাদের লক্ষ্য ও মূল উদ্দেশ্য',
    goal_desc_en:
      'Focused on sustainable development, education, and mutual support within our community.',
    goal_desc_bn:
      'আমাদের সমাজে টেকসই উন্নয়ন, শিক্ষা এবং পারস্পরিক সহায়তার দিকে মনোনিবেশ করা।',
    goal_banner_image: '',

    // ================= ABOUT US PAGE =================
    about_hero_image: '/ai_medical.jpg',
    about_hero_title_en: 'Empowering the Next Generation of Leaders',
    about_hero_title_bn: 'পরবর্তী প্রজন্মের নেতাদের ক্ষমতায়ন',
    about_hero_desc_en:
      'Birkhal Youth Organization is dedicated to fostering growth, education, and community engagement among the youth of Cumilla, Chandina, and Kaduti Bazar.',
    about_hero_desc_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠন কুমিল্লা, চান্দিনা এবং কাদুটি বাজারের যুবসমাজের মধ্যে প্রবৃদ্ধি, শিক্ষা এবং সামাজিক সম্পৃক্ততা বৃদ্ধির জন্য নিবেদিত।',

    about_mission_title_en: 'Our Mission',
    about_mission_title_bn: 'আমাদের লক্ষ্য',
    about_mission_desc_en:
      'To empower local youth by providing accessible educational resources, skills training, and a platform for civic engagement.',
    about_mission_desc_bn:
      'সাশ্রয়ী মূল্যের শিক্ষা উপকরণ, দক্ষতা প্রশিক্ষণ এবং নাগরিক সম্পৃক্ততার প্ল্যাটফর্ম প্রদান করে স্থানীয় যুবসমাজের ক্ষমতায়ন করা।',
    about_mission_image: '',

    about_vision_title_en: 'Our Vision',
    about_vision_title_bn: 'আমাদের ভিশন',
    about_vision_desc_en:
      'A thriving, interconnected community where empowered youth lead the way in sustainable development, innovation, and social harmony.',
    about_vision_desc_bn:
      'একটি সমৃদ্ধ, আন্তঃসংযুক্ত সম্প্রদায় যেখানে ক্ষমতায়িত যুবসমাজ টেকসই উন্নয়ন, উদ্ভাবন এবং সামাজিক সম্প্রীতির নেতৃত্ব দেয়।',
    about_vision_image: '',

    about_val1_title_en: 'Transparency & Trust',
    about_val1_title_bn: 'স্বচ্ছতা ও বিশ্বাস',
    about_val1_desc_en:
      'We maintain 100% transparency in all our operations and funding.',
    about_val1_desc_bn:
      'আমাদের সকল কার্যক্রম ও অর্থায়নে আমরা শতভাগ স্বচ্ছতা বজায় রাখি।',
    about_val2_title_en: 'Unity & Collaboration',
    about_val2_title_bn: 'ঐক্য ও সহযোগিতা',
    about_val2_desc_en:
      'Only by working together can we bring about the greatest change.',
    about_val2_desc_bn:
      'একসাথে কাজ করার মাধ্যমেই আমরা সবচেয়ে বড় পরিবর্তন আনতে পারি।',
    about_val3_title_en: 'Sustainable Growth',
    about_val3_title_bn: 'টেকসই উন্নয়ন',
    about_val3_desc_en: 'We are working to create long-term positive impacts.',
    about_val3_desc_bn:
      'দীর্ঘমেয়াদী ইতিবাচক প্রভাব তৈরি করার জন্য আমরা কাজ করে যাচ্ছি।',

    // ================= DONATIONS PAGE =================
    donation_hero_image: '',
    donation_hero_title_en: 'Donation Fund & Analytics',
    donation_hero_title_bn: 'অনুদানের পরিসংখ্যান ও তহবিল',
    donation_hero_desc_en:
      'We express our sincere gratitude to all generous donors whose contributions power our education, healthcare, and humanitarian projects.',
    donation_hero_desc_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠনের মানবিক সহায়তা, শিক্ষা বৃত্তি, বৃক্ষরোপণ ও জরুরি ত্রাণ কার্যক্রমে যারা আর্থিক সহায়তা দিয়েছেন তাদের প্রতি আমরা আন্তরিক কৃতজ্ঞ।',
    donation_bkash_number: '01882447721 (Personal / Merchant)',
    donation_bkash_qr: '',
    donation_nagad_number: '01609296990 (Personal)',
    donation_nagad_qr: '',
    donation_rocket_number: '01882447721-8 (Personal)',
    donation_rocket_qr: '',
    donation_bank_info_en:
      'Bank: Islami Bank Bangladesh Ltd\nAccount Name: Birkhal Youth Welfare Org\nAccount No: 20503920100123456\nBranch: Chandina Branch, Cumilla',
    donation_bank_info_bn:
      'ব্যাংক: ইসলামী ব্যাংক বাংলাদেশ লিমিটেড\nহিসাবের নাম: বীরখাল সমাজ কল্যাণ যুব সংগঠন\nহিসাব নম্বর: ২০৫০৩৯২০১০০১২৩৪৫৬\nশাখা: চান্দিনা শাখা, কুমিল্লা',

    // ================= CONTACT PAGE =================
    contact_hero_image: '/ai_relief.jpg',
    contact_hero_title_en: 'Get in Touch with Birkhal Youth',
    contact_hero_title_bn: 'বীরখাল সমাজ কল্যাণ যুব সংগঠনের সাথে যোগাযোগ',
    contact_hero_desc_en:
      'We are here to answer any questions you may have about our youth initiatives. Reach out to us anytime.',
    contact_hero_desc_bn:
      'বীরখাল সমাজ কল্যাণ যুব সংগঠনের কার্যক্রম সম্পর্কে যেকোনো তথ্য, অনুদান বিষয়ক পরামর্শ অথবা মানবিক সহায়তার জন্য আমাদের সাথে সরাসরি যোগাযোগ করুন।',
    contact_address_en: 'Birkhal, Kaduti Bazar, Chandina, Cumilla',
    contact_address_bn: 'বীরখাল, কাদুটি বাজার, চান্দিনা, কুমিল্লা',
    contact_email: 'birkhal.youth.org@gmail.com',
    contact_phone: '01882447721 / 01609296990',
    contact_office_hours_en: 'Saturday - Thursday: 9:00 AM - 6:00 PM',
    contact_office_hours_bn: 'শনিবার - বৃহস্পতিবার: সকাল ৯:০০ - সন্ধ্যা ৬:০০',

    // ================= FOOTER & FLOATING ACTIONS =================
    footer_desc_en:
      'Building a stronger, transparent, and empowered community together.',
    footer_desc_bn: 'একটি শক্তিশালী, সৎ ও মানবিক সমাজ গড়ার অঙ্গীকার।',
    footer_copyright_en: '© 2026 Birkhal Youth. All rights reserved.',
    footer_copyright_bn:
      '© ২০২৬ বীরখাল সমাজ কল্যাণ যুব সংগঠন। সর্বস্বত্ব সংরক্ষিত।',

    // Floating Actions
    floating_donation_enabled: 'true',
    floating_chat_enabled: 'true',
    social_whatsapp_number: '01882447721',
    social_messenger_url: 'https://facebook.com/BirkhalYouth',

    // Social Links
    social_facebook: 'https://facebook.com/BirkhalYouth',
    social_youtube: 'https://youtube.com',
    social_instagram: 'https://instagram.com',
    social_x: 'https://x.com',
    social_tiktok: 'https://tiktok.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        const newFormData = { ...formData };
        data.forEach((setting: any) => {
          if (setting.key in newFormData) {
            (newFormData as any)[setting.key] = setting.value;
          }
        });
        setFormData(newFormData);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (key: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        [key]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const settingsToSave = Object.keys(formData).map(key => ({
      key,
      value: (formData as any)[key],
      category:
        activeTab === 'causes'
          ? 'home'
          : activeTab === 'navbar'
            ? 'general'
            : activeTab === 'footer'
              ? 'general'
              : activeTab === 'donations'
                ? 'general'
                : activeTab,
    }));

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave),
      });

      if (res.ok) {
        setAlertMessage(
          language === 'bn'
            ? 'সকল কন্টেন্ট, ছবি ও কম্পোনেন্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!'
            : 'All section contents, images and component settings saved successfully live!',
        );
        router.refresh();
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setAlertMessage(
        language === 'bn'
          ? 'সংরক্ষণ করতে ব্যর্থ হয়েছে।'
          : 'Failed to save content.',
      );
    } finally {
      setSaving(false);
    }
  };

  const ImageInputSection = ({
    title,
    fieldKey,
    currentValue,
    placeholder = '/sample.jpg',
  }: {
    title: string;
    fieldKey: string;
    currentValue: string;
    placeholder?: string;
  }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
      <div className="bg-surface-container-low dark:bg-surface-container-lowest p-5 border border-border space-y-3 rounded-xl">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-growth-green" />
            <span>{title}</span>
          </label>
          {currentValue && (
            <span className="text-[11px] text-growth-green font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {language === 'bn' ? 'ছবি লোড করা আছে' : 'Image Set'}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative w-28 h-20 bg-gray-100 dark:bg-gray-800 border border-border overflow-hidden shrink-0 group rounded-xl">
            {currentValue ? (
              <Image
                src={currentValue}
                alt={title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                unoptimized={currentValue.startsWith('data:')}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant text-[10px] p-2 text-center">
                <ImageIcon className="w-6 h-6 mb-1 opacity-40" />
                <span>{language === 'bn' ? 'ছবি নেই' : 'No Image'}</span>
              </div>
            )}
          </div>

          <div className="flex-grow space-y-2 w-full">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-surface hover:bg-surface-container-high dark:bg-surface-container border border-border text-foreground px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer rounded-xl"
              >
                <Upload className="w-3.5 h-3.5 text-growth-green" />
                <span>
                  {language === 'bn' ? 'কম্পিউটার থেকে আপলোড' : 'Upload File'}
                </span>
              </button>

              {currentValue && (
                <button
                  type="button"
                  onClick={() =>
                    setFormData(prev => ({ ...prev, [fieldKey]: '' }))
                  }
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 border border-transparent hover:border-red-200 transition-all cursor-pointer rounded-xl"
                  title="Remove Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(fieldKey, file);
              }}
            />

            <input
              type="text"
              name={fieldKey}
              value={currentValue}
              onChange={handleInputChange}
              placeholder={`or direct image URL e.g. ${placeholder}`}
              className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none font-mono rounded-xl"
            />
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-growth-green" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="font-headline-xl text-3xl md:text-4xl text-foreground font-bold mb-1">
            {language === 'bn'
              ? 'ওয়েবসাইট কম্পোনেন্ট ও কন্টেন্ট কন্ট্রোল প্যানেল'
              : 'Full Website Components & Content Control'}
          </h2>
          <p className="font-body-md text-on-surface-variant text-sm">
            {language === 'bn'
              ? 'Navbar, Footer, Home, Causes, About, Donations, Contact সহ ওয়েবসাইটের সকল সেকশন ও কম্পোনেন্ট এখান থেকে সরাসরি নিয়ন্ত্রণ করুন।'
              : 'Control all components, images, banners, navbar links, footer info, and section toggles in real-time.'}
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="bg-growth-green hover:bg-[#236026] text-white font-bold text-sm px-7 py-3 flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50 rounded-xl"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving
            ? language === 'bn'
              ? 'সংরক্ষণ হচ্ছে...'
              : 'Saving...'
            : language === 'bn'
              ? 'সকল পরিবর্তন সংরক্ষণ করুন'
              : 'Save All Changes'}
        </button>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border mb-8 pb-3">
        <button
          onClick={() => setActiveTab('navbar')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'navbar'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>
            {language === 'bn' ? 'Navbar ও হেডার' : 'Navbar & Header'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'home'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>
            {language === 'bn' ? 'হোম পেজ ও সেকশনস' : 'Home & Sections'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('causes')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'causes'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>
            {language === 'bn'
              ? '৪টি সাপোর্ট কার্ড ও লক্ষ্য'
              : '4 Causes Cards & Goal'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'about'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>
            {language === 'bn' ? 'আমাদের সম্পর্কে পেজ' : 'About Us Page'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'donations'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Heart className="w-4 h-4 text-red-500" />
          <span>
            {language === 'bn'
              ? 'অনুদানের তথ্য ও QR কোড'
              : 'Donation & QR Codes'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('contact')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'contact'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          <span>{language === 'bn' ? 'যোগাযোগ পেজ' : 'Contact Page'}</span>
        </button>

        <button
          onClick={() => setActiveTab('footer')}
          className={`flex items-center gap-2 px-5 py-2.5 font-bold text-sm transition-all cursor-pointer rounded-xl ${
            activeTab === 'footer'
              ? 'bg-growth-green text-white shadow-xs'
              : 'bg-surface-container-lowest text-on-surface-variant hover:text-foreground border border-border'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>
            {language === 'bn'
              ? 'Footer ও চ্যাট বাটন'
              : 'Footer & Chat Buttons'}
          </span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ======================= TAB: NAVBAR & HEADER ======================= */}
        {activeTab === 'navbar' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Notification Bar Ticker */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-impact-orange" />
                  <h3 className="font-bold text-lg text-foreground">
                    {language === 'bn'
                      ? 'হেডার নোটিফিকেশন ব্যানার (Top Donation/Notice Bar)'
                      : 'Top Header Notice / Donation Ticker'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant">
                    {language === 'bn' ? 'ব্যানার প্রদর্শন' : 'Banner Visible'}:
                  </label>
                  <select
                    name="top_banner_enabled"
                    value={formData.top_banner_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border px-2 py-1 text-xs font-bold text-foreground outline-none"
                  >
                    <option value="true">
                      {language === 'bn'
                        ? 'হ্যাঁ (প্রদর্শিত)'
                        : 'Yes (Visible)'}
                    </option>
                    <option value="false">
                      {language === 'bn' ? 'না (লুকানো)' : 'No (Hidden)'}
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্যাজ টেক্সট (বাংলা)'
                      : 'Badge Text (Bengali)'}
                  </label>
                  <input
                    type="text"
                    name="top_banner_badge_bn"
                    value={formData.top_banner_badge_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্যাজ টেক্সট (ইংরেজি)'
                      : 'Badge Text (English)'}
                  </label>
                  <input
                    type="text"
                    name="top_banner_badge_en"
                    value={formData.top_banner_badge_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্যানার নোটিশ মেসেজ (বাংলা)'
                      : 'Notice Message (Bengali)'}
                  </label>
                  <textarea
                    rows={2}
                    name="top_banner_text_bn"
                    value={formData.top_banner_text_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্যানার নোটিশ মেসেজ (ইংরেজি)'
                      : 'Notice Message (English)'}
                  </label>
                  <textarea
                    rows={2}
                    name="top_banner_text_en"
                    value={formData.top_banner_text_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Navbar Brand & Logo */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <ImageIcon className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'লোগো ও ব্র্যান্ডের নাম'
                    : 'Navbar Brand & Logo'}
                </h3>
              </div>

              <ImageInputSection
                title={
                  language === 'bn'
                    ? 'ওয়েবসাইট লোগো (Brand Logo)'
                    : 'Brand Logo Image'
                }
                fieldKey="logo_url"
                currentValue={formData.logo_url}
                placeholder="/logo.png"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্র্যান্ডের নাম (বাংলা)'
                      : 'Brand Name (Bengali)'}
                  </label>
                  <input
                    type="text"
                    name="brand_name_bn"
                    value={formData.brand_name_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    {language === 'bn'
                      ? 'ব্র্যান্ডের নাম (ইংরেজি)'
                      : 'Brand Name (English)'}
                  </label>
                  <input
                    type="text"
                    name="brand_name_en"
                    value={formData.brand_name_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Navbar Menu Links Visibility Controls */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Menu className="w-5 h-5 text-reliability-blue" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'Navbar মেন্যু লিংক সক্রিয়/নিষ্ক্রিয় করুন'
                    : 'Navbar Menu Links Visibility Toggles'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn'
                      ? 'আমাদের সম্পর্কে (About Us)'
                      : 'About Us'}
                  </span>
                  <select
                    name="nav_about_enabled"
                    value={formData.nav_about_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn'
                      ? 'অনুদানের তালিকা (Donations)'
                      : 'Donations'}
                  </span>
                  <select
                    name="nav_donations_enabled"
                    value={formData.nav_donations_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn'
                      ? 'সদস্য নিবন্ধন (Registration)'
                      : 'Registration'}
                  </span>
                  <select
                    name="nav_registration_enabled"
                    value={formData.nav_registration_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn' ? 'সদস্যবৃন্দ (Members)' : 'Members'}
                  </span>
                  <select
                    name="nav_members_enabled"
                    value={formData.nav_members_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    {language === 'bn' ? 'যোগাযোগ (Contact)' : 'Contact'}
                  </span>
                  <select
                    name="nav_contact_enabled"
                    value={formData.nav_contact_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: HOME PAGE ======================= */}
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Main Section */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-5 h-5 text-impact-orange" />
                  <h3 className="font-bold text-lg text-foreground">
                    {language === 'bn'
                      ? 'হোম পেজ হিরো ব্যানার ও টেক্সট'
                      : 'Home Hero Banner & Content'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant">
                    Hero Enabled:
                  </label>
                  <select
                    name="section_hero_enabled"
                    value={formData.section_hero_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border px-2 py-1 text-xs font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              {/* Hero Banner Image */}
              <ImageInputSection
                title={
                  language === 'bn'
                    ? 'হোম হিরো ব্যানার ছবি'
                    : 'Home Hero Banner Image'
                }
                fieldKey="home_hero_image"
                currentValue={formData.home_hero_image}
                placeholder="/ai_education.jpg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Hero Badge (EN)
                  </label>
                  <input
                    type="text"
                    name="hero_badge_en"
                    value={formData.hero_badge_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Hero Badge (BN)
                  </label>
                  <input
                    type="text"
                    name="hero_badge_bn"
                    value={formData.hero_badge_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Heading (EN)
                  </label>
                  <input
                    type="text"
                    name="hero_heading_en"
                    value={formData.hero_heading_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Heading (BN)
                  </label>
                  <input
                    type="text"
                    name="hero_heading_bn"
                    value={formData.hero_heading_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Description (EN)
                  </label>
                  <textarea
                    rows={3}
                    name="hero_desc_en"
                    value={formData.hero_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Description (BN)
                  </label>
                  <textarea
                    rows={3}
                    name="hero_desc_bn"
                    value={formData.hero_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Home Sections Visibility Toggles */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Sliders className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'হোম পেজের সকল সেকশন অন/অফ (Section Toggles)'
                    : 'Home Page Section Toggles'}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    পরিসংখ্যান (Stats Counters)
                  </span>
                  <select
                    name="section_stats_enabled"
                    value={formData.section_stats_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    কমিটি স্লাইডার (Leadership)
                  </span>
                  <select
                    name="section_committee_enabled"
                    value={formData.section_committee_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    সদস্য ডিরেক্টরি (Members)
                  </span>
                  <select
                    name="section_members_enabled"
                    value={formData.section_members_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    ফটো গ্যালারি (Gallery)
                  </span>
                  <select
                    name="section_gallery_enabled"
                    value={formData.section_gallery_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    নীতিমালা (Rules & Conduct)
                  </span>
                  <select
                    name="section_rules_enabled"
                    value={formData.section_rules_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>

                <div className="p-3 bg-surface-container-low dark:bg-surface-container-lowest border border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">
                    মানুষের মতামত (Reviews)
                  </span>
                  <select
                    name="section_reviews_enabled"
                    value={formData.section_reviews_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Stats Counter Section */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <BarChart3 className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'পরিসংখ্যান ও প্রভাব কাউন্টার (Stats)'
                    : 'Impact & Stats Counters'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-3">
                  <span className="font-bold text-xs text-growth-green uppercase">
                    Stat 1: Families Supported
                  </span>
                  <input
                    type="text"
                    name="stat_volunteers"
                    value={formData.stat_volunteers}
                    onChange={handleInputChange}
                    placeholder="500+"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm font-bold text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_volunteers_label_bn"
                    value={formData.stat_volunteers_label_bn}
                    onChange={handleInputChange}
                    placeholder="পরিবারকে সহায়তা"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_volunteers_label_en"
                    value={formData.stat_volunteers_label_en}
                    onChange={handleInputChange}
                    placeholder="Families Supported"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                </div>

                <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-3">
                  <span className="font-bold text-xs text-impact-orange uppercase">
                    Stat 2: Trees Planted
                  </span>
                  <input
                    type="text"
                    name="stat_trees"
                    value={formData.stat_trees}
                    onChange={handleInputChange}
                    placeholder="1K+"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm font-bold text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_trees_label_bn"
                    value={formData.stat_trees_label_bn}
                    onChange={handleInputChange}
                    placeholder="বৃক্ষরোপণ"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_trees_label_en"
                    value={formData.stat_trees_label_en}
                    onChange={handleInputChange}
                    placeholder="Trees Planted"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                </div>

                <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-3">
                  <span className="font-bold text-xs text-reliability-blue uppercase">
                    Stat 3: Students Helped
                  </span>
                  <input
                    type="text"
                    name="stat_students"
                    value={formData.stat_students}
                    onChange={handleInputChange}
                    placeholder="200+"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm font-bold text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_students_label_bn"
                    value={formData.stat_students_label_bn}
                    onChange={handleInputChange}
                    placeholder="শিক্ষার্থীকে সহায়তা"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                  <input
                    type="text"
                    name="stat_students_label_en"
                    value={formData.stat_students_label_en}
                    onChange={handleInputChange}
                    placeholder="Students Helped"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: CAUSES & 4 CARDS ======================= */}
        {activeTab === 'causes' && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Section Info */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-growth-green" />
                  <h3 className="font-bold text-lg text-foreground">
                    {language === 'bn'
                      ? 'যেখানে আপনার অনুদান ব্যবহৃত হয় (Where Your Support Goes)'
                      : 'Causes & Support Cards Configuration'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant">
                    Section Enabled:
                  </label>
                  <select
                    name="section_causes_enabled"
                    value={formData.section_causes_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border px-2 py-1 text-xs font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Section Title (BN)
                  </label>
                  <input
                    type="text"
                    name="causes_title_bn"
                    value={formData.causes_title_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Section Title (EN)
                  </label>
                  <input
                    type="text"
                    name="causes_title_en"
                    value={formData.causes_title_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Sub-heading (BN)
                  </label>
                  <input
                    type="text"
                    name="causes_desc_bn"
                    value={formData.causes_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Sub-heading (EN)
                  </label>
                  <input
                    type="text"
                    name="causes_desc_en"
                    value={formData.causes_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4 Causes Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="w-6 h-6 bg-growth-green text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h4 className="font-bold text-base text-foreground">
                    Card 1: Education (শিক্ষা)
                  </h4>
                </div>
                <ImageInputSection
                  title="Card 1 Image"
                  fieldKey="cause_1_image"
                  currentValue={formData.cause_1_image}
                  placeholder="/ai_education.jpg"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (BN)
                    </label>
                    <input
                      type="text"
                      name="cause_1_title_bn"
                      value={formData.cause_1_title_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      name="cause_1_title_en"
                      value={formData.cause_1_title_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (BN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_1_desc_bn"
                      value={formData.cause_1_desc_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (EN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_1_desc_en"
                      value={formData.cause_1_desc_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="w-6 h-6 bg-impact-orange text-white text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <h4 className="font-bold text-base text-foreground">
                    Card 2: Plantation & Environment
                  </h4>
                </div>
                <ImageInputSection
                  title="Card 2 Image"
                  fieldKey="cause_2_image"
                  currentValue={formData.cause_2_image}
                  placeholder="/ai_plantation.jpg"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (BN)
                    </label>
                    <input
                      type="text"
                      name="cause_2_title_bn"
                      value={formData.cause_2_title_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      name="cause_2_title_en"
                      value={formData.cause_2_title_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (BN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_2_desc_bn"
                      value={formData.cause_2_desc_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (EN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_2_desc_en"
                      value={formData.cause_2_desc_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="w-6 h-6 bg-reliability-blue text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <h4 className="font-bold text-base text-foreground">
                    Card 3: Healthcare
                  </h4>
                </div>
                <ImageInputSection
                  title="Card 3 Image"
                  fieldKey="cause_3_image"
                  currentValue={formData.cause_3_image}
                  placeholder="/ai_medical.jpg"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (BN)
                    </label>
                    <input
                      type="text"
                      name="cause_3_title_bn"
                      value={formData.cause_3_title_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      name="cause_3_title_en"
                      value={formData.cause_3_title_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (BN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_3_desc_bn"
                      value={formData.cause_3_desc_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (EN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_3_desc_en"
                      value={formData.cause_3_desc_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <span className="w-6 h-6 bg-red-500 text-white text-xs font-bold flex items-center justify-center">
                    4
                  </span>
                  <h4 className="font-bold text-base text-foreground">
                    Card 4: Emergency Relief
                  </h4>
                </div>
                <ImageInputSection
                  title="Card 4 Image"
                  fieldKey="cause_4_image"
                  currentValue={formData.cause_4_image}
                  placeholder="/ai_relief.jpg"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (BN)
                    </label>
                    <input
                      type="text"
                      name="cause_4_title_bn"
                      value={formData.cause_4_title_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Title (EN)
                    </label>
                    <input
                      type="text"
                      name="cause_4_title_en"
                      value={formData.cause_4_title_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (BN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_4_desc_bn"
                      value={formData.cause_4_desc_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Desc (EN)
                    </label>
                    <textarea
                      rows={2}
                      name="cause_4_desc_en"
                      value={formData.cause_4_desc_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Goal Section */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-growth-green" />
                  <h3 className="font-bold text-lg text-foreground">
                    Our Goal & Core Focus Bento Section
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant">
                    Goal Enabled:
                  </label>
                  <select
                    name="section_goal_enabled"
                    value={formData.section_goal_enabled}
                    onChange={handleInputChange}
                    className="bg-surface dark:bg-background border border-border px-2 py-1 text-xs font-bold"
                  >
                    <option value="true">Visible</option>
                    <option value="false">Hidden</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Goal Title (BN)
                  </label>
                  <input
                    type="text"
                    name="goal_title_bn"
                    value={formData.goal_title_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Goal Title (EN)
                  </label>
                  <input
                    type="text"
                    name="goal_title_en"
                    value={formData.goal_title_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Goal Desc (BN)
                  </label>
                  <textarea
                    rows={3}
                    name="goal_desc_bn"
                    value={formData.goal_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Goal Desc (EN)
                  </label>
                  <textarea
                    rows={3}
                    name="goal_desc_en"
                    value={formData.goal_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: ABOUT US ======================= */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Info className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'অ্যাবাউট পেজ হিরো ব্যানার ও পরিচিতি'
                    : 'About Us Hero Banner & Intro'}
                </h3>
              </div>

              <ImageInputSection
                title={
                  language === 'bn'
                    ? 'অ্যাবাউট পেজ ব্যানার ছবি'
                    : 'About Page Banner Image'
                }
                fieldKey="about_hero_image"
                currentValue={formData.about_hero_image}
                placeholder="/ai_medical.jpg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    About Title (BN)
                  </label>
                  <input
                    type="text"
                    name="about_hero_title_bn"
                    value={formData.about_hero_title_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    About Title (EN)
                  </label>
                  <input
                    type="text"
                    name="about_hero_title_en"
                    value={formData.about_hero_title_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    About Desc (BN)
                  </label>
                  <textarea
                    rows={4}
                    name="about_hero_desc_bn"
                    value={formData.about_hero_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    About Desc (EN)
                  </label>
                  <textarea
                    rows={4}
                    name="about_hero_desc_en"
                    value={formData.about_hero_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Award className="w-5 h-5 text-impact-orange" />
                <h3 className="font-bold text-lg text-foreground">
                  Mission & Vision
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border">
                  <h4 className="font-bold text-sm text-growth-green">
                    Mission (লক্ষ্য)
                  </h4>
                  <input
                    type="text"
                    name="about_mission_title_bn"
                    value={formData.about_mission_title_bn}
                    onChange={handleInputChange}
                    placeholder="শিরোনাম (বাংলা)"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                  />
                  <textarea
                    rows={3}
                    name="about_mission_desc_bn"
                    value={formData.about_mission_desc_bn}
                    onChange={handleInputChange}
                    placeholder="বিবরণ (বাংলা)"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                  />
                </div>

                <div className="space-y-3 p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border">
                  <h4 className="font-bold text-sm text-reliability-blue">
                    Vision (ভিশন)
                  </h4>
                  <input
                    type="text"
                    name="about_vision_title_bn"
                    value={formData.about_vision_title_bn}
                    onChange={handleInputChange}
                    placeholder="শিরোনাম (বাংলা)"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                  />
                  <textarea
                    rows={3}
                    name="about_vision_desc_bn"
                    value={formData.about_vision_desc_bn}
                    onChange={handleInputChange}
                    placeholder="বিবরণ (বাংলা)"
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: DONATIONS ======================= */}
        {activeTab === 'donations' && (
          <div className="space-y-8 animate-fade-in">
            {/* Donation Banner */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-lg text-foreground">
                  Donation Hero Banner & Intro
                </h3>
              </div>

              <ImageInputSection
                title="Donation Page Header Banner"
                fieldKey="donation_hero_image"
                currentValue={formData.donation_hero_image}
                placeholder="/ai_relief.jpg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Heading (BN)
                  </label>
                  <input
                    type="text"
                    name="donation_hero_title_bn"
                    value={formData.donation_hero_title_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Heading (EN)
                  </label>
                  <input
                    type="text"
                    name="donation_hero_title_en"
                    value={formData.donation_hero_title_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods QR Codes & Numbers */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <BarChart3 className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  Mobile Banking QR Codes & Numbers
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* bKash */}
                <div className="p-4 bg-pink-500/5 border border-pink-500/20 space-y-4">
                  <span className="font-bold text-sm text-pink-600">
                    bKash (বিকাশ)
                  </span>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      বিকাশ নম্বর ও বিবরণ
                    </label>
                    <input
                      type="text"
                      name="donation_bkash_number"
                      value={formData.donation_bkash_number}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs font-bold text-foreground focus:border-growth-green outline-none"
                    />
                  </div>
                  <ImageInputSection
                    title="bKash QR Code Image"
                    fieldKey="donation_bkash_qr"
                    currentValue={formData.donation_bkash_qr}
                    placeholder="/bkash-qr.png"
                  />
                </div>

                {/* Nagad */}
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 space-y-4">
                  <span className="font-bold text-sm text-orange-600">
                    Nagad (নগদ)
                  </span>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      নগদ নম্বর ও বিবরণ
                    </label>
                    <input
                      type="text"
                      name="donation_nagad_number"
                      value={formData.donation_nagad_number}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs font-bold text-foreground focus:border-growth-green outline-none"
                    />
                  </div>
                  <ImageInputSection
                    title="Nagad QR Code Image"
                    fieldKey="donation_nagad_qr"
                    currentValue={formData.donation_nagad_qr}
                    placeholder="/nagad-qr.png"
                  />
                </div>
              </div>

              {/* Bank Transfer Info */}
              <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-4">
                <h4 className="font-bold text-sm text-reliability-blue">
                  Official Bank Account Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      বাংলা বিবরণী
                    </label>
                    <textarea
                      rows={4}
                      name="donation_bank_info_bn"
                      value={formData.donation_bank_info_bn}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:border-growth-green outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      English Details
                    </label>
                    <textarea
                      rows={4}
                      name="donation_bank_info_en"
                      value={formData.donation_bank_info_en}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground focus:border-growth-green outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: CONTACT ======================= */}
        {activeTab === 'contact' && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-surface-container-lowest p-6 border border-border space-y-6 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <PhoneCall className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  Contact Page Content & Banner
                </h3>
              </div>

              <ImageInputSection
                title="Contact Page Banner Image"
                fieldKey="contact_hero_image"
                currentValue={formData.contact_hero_image}
                placeholder="/ai_relief.jpg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Contact Title (BN)
                  </label>
                  <input
                    type="text"
                    name="contact_hero_title_bn"
                    value={formData.contact_hero_title_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Contact Title (EN)
                  </label>
                  <input
                    type="text"
                    name="contact_hero_title_en"
                    value={formData.contact_hero_title_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Contact Description (BN)
                  </label>
                  <textarea
                    rows={3}
                    name="contact_hero_desc_bn"
                    value={formData.contact_hero_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Contact Description (EN)
                  </label>
                  <textarea
                    rows={3}
                    name="contact_hero_desc_en"
                    value={formData.contact_hero_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Phone Numbers
                  </label>
                  <input
                    type="text"
                    name="contact_phone"
                    value={formData.contact_phone}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-sm text-foreground focus:border-growth-green outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= TAB: FOOTER & FLOATING ======================= */}
        {activeTab === 'footer' && (
          <div className="space-y-8 animate-fade-in">
            {/* Floating Action Buttons Controls */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <MessageCircle className="w-5 h-5 text-growth-green" />
                <h3 className="font-bold text-lg text-foreground">
                  {language === 'bn'
                    ? 'ভাসমান চ্যাট ও অনুদান বাটন (Floating Buttons)'
                    : 'Floating Action Buttons Controls'}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground uppercase">
                      WhatsApp / Messenger Chat
                    </span>
                    <select
                      name="floating_chat_enabled"
                      value={formData.floating_chat_enabled}
                      onChange={handleInputChange}
                      className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                    >
                      <option value="true">Visible</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      WhatsApp Number (e.g. 01882447721)
                    </label>
                    <input
                      type="text"
                      name="social_whatsapp_number"
                      value={formData.social_whatsapp_number}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      Facebook Messenger Link
                    </label>
                    <input
                      type="text"
                      name="social_messenger_url"
                      value={formData.social_messenger_url}
                      onChange={handleInputChange}
                      className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low dark:bg-surface-container-lowest border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground uppercase">
                      Floating Donation Button
                    </span>
                    <select
                      name="floating_donation_enabled"
                      value={formData.floating_donation_enabled}
                      onChange={handleInputChange}
                      className="bg-surface dark:bg-background border border-border text-xs px-2 py-1 font-bold"
                    >
                      <option value="true">Visible</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    {language === 'bn'
                      ? 'পর্দার নিচে ডানপাশে ভাসমান দ্রুত অনুদান বাটন প্রদর্শন বা লুকিয়ে রাখার সুইচ।'
                      : 'Control the visibility of the persistent floating quick donation button on screen bottom-right.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Text & Social Links */}
            <div className="bg-surface-container-lowest p-6 border border-border space-y-4 shadow-xs">
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <Share2 className="w-5 h-5 text-impact-orange" />
                <h3 className="font-bold text-lg text-foreground">
                  Footer Text & Social Links
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Footer Short Desc (BN)
                  </label>
                  <input
                    type="text"
                    name="footer_desc_bn"
                    value={formData.footer_desc_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Footer Short Desc (EN)
                  </label>
                  <input
                    type="text"
                    name="footer_desc_en"
                    value={formData.footer_desc_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Copyright Text (BN)
                  </label>
                  <input
                    type="text"
                    name="footer_copyright_bn"
                    value={formData.footer_copyright_bn}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Copyright Text (EN)
                  </label>
                  <input
                    type="text"
                    name="footer_copyright_en"
                    value={formData.footer_copyright_en}
                    onChange={handleInputChange}
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Facebook URL
                  </label>
                  <input
                    type="text"
                    name="social_facebook"
                    value={formData.social_facebook}
                    onChange={handleInputChange}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    YouTube URL
                  </label>
                  <input
                    type="text"
                    name="social_youtube"
                    value={formData.social_youtube}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    name="social_instagram"
                    value={formData.social_instagram}
                    onChange={handleInputChange}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Twitter / X URL
                  </label>
                  <input
                    type="text"
                    name="social_x"
                    value={formData.social_x}
                    onChange={handleInputChange}
                    placeholder="https://x.com/..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    TikTok URL
                  </label>
                  <input
                    type="text"
                    name="social_tiktok"
                    value={formData.social_tiktok}
                    onChange={handleInputChange}
                    placeholder="https://tiktok.com/@..."
                    className="w-full bg-surface dark:bg-background border border-border px-3 py-1.5 text-xs text-foreground outline-none rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Modern Alert Modal */}
      <AlertModal
        isOpen={!!alertMessage}
        onClose={() => setAlertMessage(null)}
        title={language === 'bn' ? 'সফলভাবে সংরক্ষিত' : 'Success'}
        message={alertMessage || ''}
        type="success"
      />
    </>
  );
}
