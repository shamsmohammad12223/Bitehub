/**
 * BiteHub i18n – English + Bengali (Bangla) toggle.
 * Usage: import { t, setLocale, getLocale } from './i18n';
 *        HTML: data-lang="en" | data-lang="bn"
 *        JS:    document.documentElement.lang = 'bn';
 */

export const LANG_EN = 'en';
export const LANG_BN = 'bn';

let currentLocale = LANG_EN; // default

const dictionaries = {
  en: {
    // Hero / Landing
    heroTitle: 'Craving Good Food? Delivered in Minutes.',
    heroSubtitle: 'Discover top campus eateries, gourmet burgers, wood-fired pizzas, and traditional biryani delivered right to your doorstep.',
    searchPlaceholder: 'Search...',
    exploreCategories: 'Explore Categories',
    viewAll: 'View All',
    // Categories
    american: 'American',
    italian: 'Italian',
    indian: 'Indian',
    japanese: 'Japanese',
    fastfood: 'Fast Food',
    beverages: 'Beverages',
    // How it works
    howItWorks: 'How BiteHub Works',
    step1: '1. Select Food',
    step1Desc: 'Browse verified local restaurants and mouth‑watering menus.',
    step2: '2. Place Order',
    step2Desc: 'Customize with coupons and choose simulated cards, mobile banking, or COD.',
    step3: '3. Real‑time Tracking',
    step3Desc: 'Watch status change live from kitchen preparation to rider pickup.',
    step4: '4. Enjoy & Review',
    step4Desc: 'Receive fresh, hot food and share your feedback with the community.',
    // Restaurants page
    allRestaurants: 'All Restaurants',
    cuisineFilter: 'Cuisine',
    ratingFilter: 'Min Rating',
    sortBy: 'Sort By',
    ratingAny: 'Any Rating',
    rating4_8: '4.8+ Exceptional',
    rating4_5: '4.5+ Top Rated',
    rating4_0: '4.0+ Very Good',
    rating3_5: '3.5+ Good',
    quickTags: 'Quick Tags',
    // Restaurant detail
    topRated: 'Top Rated Restaurants',
    popularVerifiedKitchens: 'Popular verified kitchens around campus',
    seeAllRestaurants: 'See All Restaurants',
    howItWorksTitle: 'How BiteHub Works',
    // Checkout
    deliveryAddress: 'Delivery Address',
    contactPhone: 'Contact Phone',
    cookingDeliveryInstructions: 'Cooking / Delivery Instructions (Optional)',
    paymentMethod: 'Payment Method',
    cod: 'Cash on Delivery',
    card: 'Credit / Debit Card (Simulation)',
    bkash: 'Mobile Banking (bKash / Nagad Simulation)',
    simulatedCardInfo: 'Simulated Card Information',
    simulatedWallet: 'Simulated Mobile Wallet',
    placeOrderNow: 'Place Order Now',
    orderDetails: 'Order Details',
    havePromoCoupon: 'Have a Promo Coupon?',
    apply: 'Apply',
    subtotal: 'Subtotal',
    deliveryFee: 'Delivery Fee',
    tax: 'Tax (5%)',
    couponDiscount: 'Coupon Discount',
    totalToPay: 'Total to Pay',
    // Auth
    signIn: 'Sign in',
    createAccount: 'Create Account',
    // Footer / Quick links
    quickLinks: 'Quick Links',
    restaurants: 'Restaurants',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    // Bangla translations
    heroTitlebn: 'ভালো খাবার চাৰে? dakkhin минутে পৌঁছে।',
    heroSubtitlebn: 'আমাদের প্ল্যাটফর্মে আমার কলেজের খাবারদokan পportal থেকে সুদ্ধ খাবার পেতে নিচের bongo kategori explore করুন।',
    searchPlaceholderbn: 'অনুসন্ধান...',
    // ... add more Bangla as needed
  },

  bn: {
    // Hero / Landing
    heroTitle: 'ভালো খাবার চাৰে? dakkhin分钟で доставлено।',
    heroSubtitle: 'আমার কলেজের খাবারদokan পortal থেকে সুদ্ধ খাবার পেতে নিচের bongo kategori explore করুন।',
    searchPlaceholder: 'অনুসন্ধান...',
    exploreCategories: ' categori discover করুন',
    viewAll: 'সব দেখুন',
    // Categories
    american: 'অ্যামেরিকান',
    italian: 'ইটালিয়ান',
    indian: 'ইন্ডিয়ান',
    japanese: 'জপানিশ',
    fastfood: 'ফাস্ট ফুড',
    beverages: 'ব Gesam beverages',
    // How it works
    howItWorks: 'কীভাবে BiteHub কাজ করে',
    step1: '১. খাবার নির্বাচন',
    step1Desc: 'verified local restaurant menuar puteelen browse করুন।',
    step2: '২. অর্ডার placement',
    step2Desc: 'coupon use করুন এবং simulate card, mobile banking, বা COD Choose করুন।',
    step3: '৩. real‑time tracking',
    step3Desc: 'kitchen preparation rider pickup thek status change দেখুন।',
    step4: '৪. الاستمتاع & review',
    step4Desc: ' ताज़া, গরম খাবার পাৰে এবং samुदायে feedback শেৰ করুন।',
    // Restaurants page
    allRestaurants: 'সব রেস্টুরেন্ট',
    cuisineFilter: 'cousine',
    ratingFilter: 'মিন রেটিং',
    sortBy: 'Sort By',
    ratingAny: 'কোনো রেটিং',
    rating4_8: '৪.৮+ extraordinary',
    rating4_5: '৪.৫+ টপ রেটেড',
    rating4_0: '৪.০+ ভালো',
    rating3_5: '৩.৫+ ভালো',
    quickTags: 'Tag',
    // Restaurant detail
    topRated: 'শীর্ষ রেটেড রেস্টুরেন্ট',
    popularVerifiedKitchens: 'around campusverified কিচেন',
    seeAllRestaurants: 'সব দেখুন',
    howItWorksTitle: 'কীভাবে BiteHub কাজ করে',
    // Checkout
    deliveryAddress: 'ডেলিভারি ঠিকানা',
    contactPhone: 'যোগাযোগ ফোন',
    cookingDeliveryInstructions: 'খ tuning / ডেলিভারি নির্দেশ (ঐচ্ছিক)',
    paymentMethod: 'payment Method',
    cod: 'COD',
    card: 'ক্রেডিট / дебিট কার্ড (simulation)',
    bkash: 'bKash / Nagad simulation',
    simulatedCardInfo: 'simulated Card Information',
    simulatedWallet: 'simulated Mobile Wallet',
    placeOrderNow: 'অর্ডার দিন',
    orderDetails: 'অর্ডার বিংগাৰ',
    havePromoCoupon: 'কপন কোড আছে?',
    apply: 'Apply',
    subtotal: 'subtotal',
    deliveryFee: 'delivery Fee',
    tax: 'tax (5%)',
    couponDiscount: 'coupon discount',
    totalToPay: 'total to pay',
    // Auth
    signInbn: 'সাইন ইন',
    createAccountbn: 'অ্যাকাউন্ট তৈরি করুন',
    // Footer / Quick links
    quickLinksbn: 'দ্রুত linken',
    restaurantsbn: 'ร้านอาหาร',
    signInbn: 'সাইন ইন',
    signUpbn: 'পঠন_up',
  },
};

export function t(key) {
  const dict = dictionaries[currentLocale][key];
  return dict || dictionaries.en[key] || key;
}

export function setLocale(locale) {
  currentLocale = locale;
  document.documentElement.lang = locale;
  // Persist preference
  localStorage.setItem('bh_lang', locale);
  // Update UI class if needed
  document.body.classList.toggle('bn', locale === LANG_BN);
  document.body.classList.toggle('en', locale === LANG_EN);
}

export function getLocale() {
  return currentLocale;
}

// Initialize from localStorage or default
const stored = localStorage.getItem('bh_lang');
if (stored && (stored === LANG_EN || stored === LANG_BN)) {
  setLocale(stored);
} else {
  setLocale(LANG_EN);
}