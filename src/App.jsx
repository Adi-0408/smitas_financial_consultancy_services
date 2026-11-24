import Icon from './Icon.jsx';
import React, { useState, useEffect, useMemo, useRef } from 'react';

const STORAGE_KEY_REVIEWS = 'sfcs_client_reviews_v1';
const STORAGE_KEY_MY_REVIEWS = 'sfcs_my_review_ids_v1';
const SIP_ACCOUNT_URL = 'http://p.njw.bz/28795';
const SITE_SHARE_URL = 'https://smitasfinancialconsultancyservices.vercel.app/?share=profile';
const FLYER_SECTIONS = [
  { tag: 'Flyer collection 1' },
  { tag: 'Flyer collection 2' },
  { tag: 'Flyer collection 3' },
  { tag: 'Flyer collection 4' }
];
const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Ashwinii Garud',
    role: 'Salaried Professional, Sangli',
    rating: 5,
    service: 'Health Insurance',
    date: '2 weeks ago',
    text: "I was guided so thoroughly regarding my family's health insurance. Smita ma'am analyzed our medical requirements and suggested a Tata AIG plan that saved us taxes under 80D and gives cashless cover across all top hospitals. Truly committed financial consultant!"
  },
  {
    id: 'rev-2',
    name: 'Swapnil Shinde',
    role: 'MSME Enterprise Owner, Sangli',
    rating: 5,
    service: 'Business Loans (Secured / Unsecured)',
    date: '1 month ago',
    text: "Got our commercial business expansion loan sanctioned smoothly without repeated rounds to the bank. The documentation assistance and transparency were top-class. Highly recommended for business loans!"
  },
  {
    id: 'rev-3',
    name: 'Dr. Nitin Kulkarni',
    role: 'Physician / Clinic Owner, Sangli',
    rating: 5,
    service: 'Professional Loans (Doctors / CA)',
    date: '1 month ago',
    text: "Smita Desai helped finance my clinic's new equipment with a tailored doctor professional loan. Very competitive rates, zero hassle, and instant sanctioning. Exceptional guidance."
  },
  {
    id: 'rev-4',
    name: 'Sunil Patil',
    role: 'Government Service, Sangli',
    rating: 5,
    service: 'Mutual Funds & SIP / SWP',
    date: '2 months ago',
    text: "Started systematic mutual fund SIPs through NJ Wealth platform under Smita Desai's guidance. The top-up strategy and periodic reviews give me total peace of mind for wealth creation."
  }
];

function SchemeFlyerCarousel({ category, items, onOpen, activeIndex, onManualIndexChange }) {
  const touchStartX = useRef(null);
  const suppressOpen = useRef(false);
  const currentIndex = items.length ? activeIndex % items.length : 0;
  const previousIndex = useRef(currentIndex);
  const [displayIndex, setDisplayIndex] = useState(currentIndex);
  const [skipTransition, setSkipTransition] = useState(false);
  const move = (direction) => onManualIndexChange((currentIndex + direction + items.length) % items.length);

  useEffect(() => {
    if (currentIndex === previousIndex.current) return;
    setSkipTransition(false);
    setDisplayIndex(previousIndex.current === items.length - 1 && currentIndex === 0
      ? items.length
      : currentIndex);
    previousIndex.current = currentIndex;
  }, [currentIndex, items.length]);

  useEffect(() => {
    if (!skipTransition) return;
    const frame = requestAnimationFrame(() => setSkipTransition(false));
    return () => cancelAnimationFrame(frame);
  }, [skipTransition]);

  return (
    <article
      className="group relative border-b border-slate-200 py-5 last:border-b-0"
      aria-label={`${category.tag} flyers`}
    >
      <div
        className="relative overflow-hidden"
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null || items.length < 2) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(distance) > 45) {
            suppressOpen.current = true;
            window.setTimeout(() => { suppressOpen.current = false; }, 400);
            move(distance < 0 ? 1 : -1);
          }
          touchStartX.current = null;
        }}
        aria-label={`${category.tag} image slider`}
      >
        <div
          className="scheme-slide-track flex"
          style={{ transform: `translateX(-${displayIndex * 100}%)`, transition: skipTransition ? 'none' : undefined }}
          onTransitionEnd={event => {
            if (event.target !== event.currentTarget || displayIndex !== items.length) return;
            setSkipTransition(true);
            setDisplayIndex(0);
          }}
        >
          {items.map((item, index) => (
            <div key={item.id} className="w-full shrink-0" aria-hidden={index !== currentIndex}>
              <button type="button" tabIndex={index === currentIndex ? 0 : -1} onClick={() => { if (suppressOpen.current) { suppressOpen.current = false; return; } onOpen(item); }} className="group/image flex h-[360px] w-full items-center justify-center bg-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB] sm:h-[500px] lg:h-[560px]" aria-label={`View ${item.title} flyer in full size`}>
                <img src={item.src} alt={item.title} className="h-full w-full object-contain transition-transform duration-500 group-hover/image:scale-[1.02]" loading="lazy" />
              </button>
            </div>
          ))}
          {items.length > 1 && (
            <div className="w-full shrink-0" aria-hidden="true">
              <div className="flex h-[360px] w-full items-center justify-center sm:h-[500px] lg:h-[560px]">
                <img src={items[0].src} alt="" className="h-full w-full object-contain" loading="lazy" />
              </div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={items.length < 2}
          className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#0047AB] shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB] disabled:opacity-40 sm:left-3 sm:h-10 sm:w-10"
          aria-label={`Previous ${category.tag} flyer`}
        >
          <Icon name="chevron-left" className="h-4 w-4" aria-hidden="true"></Icon>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={items.length < 2}
          className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-white/90 text-[#0047AB] shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0047AB] disabled:opacity-40 sm:right-3 sm:h-10 sm:w-10"
          aria-label={`Next ${category.tag} flyer`}
        >
          <Icon name="chevron-right" className="h-4 w-4" aria-hidden="true"></Icon>
        </button>
      </div>

      <div className="mt-3 flex justify-center">
        <div className="flex max-w-full gap-1.5 overflow-x-auto px-2 py-1" aria-label="Choose flyer">
          {items.map((item, index) => <button key={item.id} type="button" onClick={() => onManualIndexChange(index)} className={`h-2 shrink-0 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-[#0047AB]' : 'w-2 bg-slate-300 hover:bg-[#82C8E5]'}`} aria-label={`Show ${item.title}`} aria-current={index === currentIndex ? 'true' : undefined} />)}
        </div>
      </div>
    </article>
  );
}

export default function App() {
  // Navigation & UI States
  const [schemeSlideIndex, setSchemeSlideIndex] = useState(0);
  const [schemeSlideOffsets, setSchemeSlideOffsets] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeGalleryTab, setActiveGalleryTab] = useState('all');
  const [activeAboutTab, setActiveAboutTab] = useState('about');
  const [calcTab, setCalcTab] = useState('sip');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Reviews State (with LocalStorage persistence for user-submitted reviews)
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter(r => r && r.id && r.name && r.text);
          if (valid.length > 0) return valid;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved reviews from localStorage', e);
    }
    return INITIAL_REVIEWS;
  });

  // Track review IDs authored by the current user on this device
  const [myReviewIds, setMyReviewIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MY_REVIEWS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      }
      // Backward compatibility: any saved review not in INITIAL_REVIEWS is user-uploaded
      const savedReviews = localStorage.getItem(STORAGE_KEY_REVIEWS);
      if (savedReviews) {
        const parsedReviews = JSON.parse(savedReviews);
        if (Array.isArray(parsedReviews)) {
          const initialIds = new Set(INITIAL_REVIEWS.map(r => r.id));
          return parsedReviews.filter(r => r && r.id && r.name && !initialIds.has(r.id)).map(r => r.id);
        }
      }
    } catch (e) {
      console.warn('Failed to load myReviewIds from localStorage', e);
    }
    return [];
  });

  // Delete Review Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    open: false,
    reviewId: null,
    reviewName: ''
  });

  // Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewService, setReviewService] = useState('Mutual Funds & SIP / SWP');
  const [reviewText, setReviewText] = useState('');

  // Modals & Toasts
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [lightboxData, setLightboxData] = useState({ open: false, src: '', caption: '' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // SIP Calculator State
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);

  // EMI Calculator State
  const [emiAmount, setEmiAmount] = useState(2500000);
  const [emiRate, setEmiRate] = useState(8.75);
  const [emiYears, setEmiYears] = useState(20);

  // Enquiry Form State
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [clientProfile, setClientProfile] = useState('Individual / Salaried');
  const [serviceRequired, setServiceRequired] = useState('General Financial Consultation');
  const [requirementDetails, setRequirementDetails] = useState('');
  const [formHighlighted, setFormHighlighted] = useState(false);

  // Close mobile drawer on Escape key or on window resize to desktop
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [mobileMenuOpen]);

  // Mobile Hardware / Gesture Back Button Handling
  // Prevents exiting the browser when an image lightbox, drawer, or modal is open on a mobile phone
  const isAnyOverlayOpen = Boolean(
    lightboxData.open ||
    qrModalOpen ||
    reviewModalOpen ||
    deleteConfirmModal.open ||
    mobileMenuOpen
  );

  const isAnyOverlayOpenRef = useRef(isAnyOverlayOpen);
  isAnyOverlayOpenRef.current = isAnyOverlayOpen;

  const historyPushedRef = useRef(false);
  const isProgrammaticBackRef = useRef(false);
  const mobileNavNavigationRef = useRef(false);

  const navigateFromMobileMenu = (event, targetId) => {
    event.preventDefault();
    mobileNavNavigationRef.current = true;
    setMobileMenuOpen(false);
    window.history.replaceState(window.history.state, '', `#${targetId}`);
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  // Close the highest priority open overlay
  const closeTopOverlay = () => {
    if (deleteConfirmModal.open) {
      setDeleteConfirmModal({ open: false, reviewId: null, reviewName: '' });
      return true;
    }
    if (lightboxData.open) {
      setLightboxData({ open: false, src: '', caption: '' });
      return true;
    }
    if (reviewModalOpen) {
      setReviewModalOpen(false);
      return true;
    }
    if (qrModalOpen) {
      setQrModalOpen(false);
      return true;
    }
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
      return true;
    }
    return false;
  };

  const closeTopOverlayRef = useRef(closeTopOverlay);
  closeTopOverlayRef.current = closeTopOverlay;

  // Sync browser history state when overlays open / close
  useEffect(() => {
    if (isAnyOverlayOpen) {
      if (!historyPushedRef.current) {
        historyPushedRef.current = true;
        try {
          window.history.pushState({ sfcsOverlayOpen: true }, '');
        } catch {}
      }
    } else {
      if (historyPushedRef.current) {
        historyPushedRef.current = false;
        if (mobileNavNavigationRef.current) {
          mobileNavNavigationRef.current = false;
          return;
        }
        isProgrammaticBackRef.current = true;
        try {
          window.history.back();
        } catch {}
      }
    }
  }, [isAnyOverlayOpen]);

  // Intercept the browser/phone back button (popstate event)
  useEffect(() => {
    const handlePopState = () => {
      // If this popstate was triggered by our programmatic history cleanup, ignore it
      if (isProgrammaticBackRef.current) {
        isProgrammaticBackRef.current = false;
        return;
      }

      // If any modal/drawer/image was open when the user pressed back:
      if (isAnyOverlayOpenRef.current) {
        // The browser already popped the history entry
        historyPushedRef.current = false;
        // Close the open overlay so the user stays on the page instead of exiting the browser
        closeTopOverlayRef.current();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Toast Helper
  const triggerToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // vCard Generator & Downloader
  const downloadVCard = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:Desai;Smita;Rahul;;',
      'FN:Smita Rahul Desai',
      'ORG:Smita\'s Financial Consultancy Services',
      'TITLE:Founder & Principal Financial Consultant',
      'TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+917057132237',
      'TEL;TYPE=WORK,VOICE;VALUE=uri:tel:+917776977171',
      'EMAIL;TYPE=INTERNET,WORK:smitadesai1821@gmail.com',
      'ADR;TYPE=WORK:;;Sujata Apartment, in front of Mathubai Garware College, Star Bhel Road, behind Divekar Hospital, Risala Road;Sangli;Maharashtra;416416;India',
      'NOTE:Alternate phone +91 77769 77171 is for calls only and is not available on WhatsApp. WhatsApp: +91 70571 32237. 8+ Years Financial Excellence. Life & Health Insurance, Mutual Funds SIP, Home & Business Loans. Certified NJ Wealth Partner (Code: 28795). "Your Trust, Our Commitment."',
      'URL:https://smitasfinancialconsultancyservices.vercel.app/',
      'END:VCARD'
    ].join('\r\n');

    const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Smita_Financial_Consultancy.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    triggerToast('Contact card (vCard) downloaded successfully!');
  };

  // Native Web Share with Clipboard Fallback
  const shareProfile = () => {
    const shareData = { url: SITE_SHARE_URL };

    if (navigator.share) {
      navigator.share(shareData)
        .then(() => triggerToast('Profile shared successfully!'))
        .catch((err) => {
          if (err.name !== 'AbortError') copyLinkFallback();
        });
    } else {
      copyLinkFallback();
    }
  };

  const copyLinkFallback = () => {
    navigator.clipboard.writeText(SITE_SHARE_URL).then(() => {
      triggerToast('Direct link copied to clipboard!');
    }).catch(() => {
      triggerToast('Share URL: ' + SITE_SHARE_URL);
    });
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText('smitadesai1821-3@okicici').then(() => {
      triggerToast('UPI ID copied: smitadesai1821-3@okicici');
    });
  };

  // Submit and Publish New Client Review
  const handleReviewSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    // Read from state or fallback directly to DOM elements
    const authorVal = reviewAuthor.trim() || document.querySelector('input[placeholder*="Ramesh"]')?.value.trim() || '';
    const roleVal = reviewRole.trim() || document.querySelector('input[placeholder*="Business Owner"]')?.value.trim() || 'Client, Sangli';
    const textVal = reviewText.trim();

    if (!authorVal) {
      triggerToast('Please enter your full name.', 'error');
      return;
    }
    if (!textVal) {
      triggerToast('Please write a short review or feedback.', 'error');
      return;
    }

    const newReview = {
      id: 'rev-' + Date.now(),
      name: authorVal,
      role: roleVal || 'Client, Sangli',
      rating: Number(reviewRating),
      service: reviewService,
      date: 'Just now',
      text: textVal
    };

    const updated = [newReview, ...reviews];
    const updatedMyIds = [newReview.id, ...myReviewIds];
    setReviews(updated);
    setMyReviewIds(updatedMyIds);
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_MY_REVIEWS, JSON.stringify(updatedMyIds));
    } catch (err) {
      console.error('Error saving review to localStorage', err);
    }

    setReviewModalOpen(false);
    setReviewAuthor('');
    setReviewRole('');
    setReviewText('');
    setReviewRating(5);
    triggerToast('Thank you! Your review has been saved in this browser.', 'success');

    // Smooth scroll to reviews section
    setTimeout(() => {
      document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' });
    }, 250);
  };

  // Remove user-authored review
  const handleDeleteReview = (reviewId) => {
    const updated = reviews.filter(r => r.id !== reviewId);
    const updatedMyIds = myReviewIds.filter(id => id !== reviewId);
    setReviews(updated);
    setMyReviewIds(updatedMyIds);
    try {
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify(updated));
      localStorage.setItem(STORAGE_KEY_MY_REVIEWS, JSON.stringify(updatedMyIds));
    } catch (err) {
      console.error('Error saving updated reviews to localStorage', err);
    }
    setDeleteConfirmModal({ open: false, reviewId: null, reviewName: '' });
    triggerToast('Your review has been successfully removed from the website.', 'info');
  };

  // Treat the entered annual return as an effective annual rate (CAGR).
  // SIP installments are invested at the start of each month (annuity due).
  const sipResult = useMemo(() => {
    const P = parseFloat(sipAmount);
    const rAnnual = parseFloat(sipRate);
    const years = parseFloat(sipYears);

    if (!Number.isFinite(P) || P <= 0 || !Number.isFinite(years) || years <= 0) {
      return { totalInvested: 0, maturityValue: 0, wealthGained: 0, investedPercent: 0, gainPercent: 0 };
    }

    const n = Math.round(years * 12);
    const totalInvested = Math.round(P * n);

    if (!Number.isFinite(rAnnual) || rAnnual < 0) {
      return { totalInvested, maturityValue: 0, wealthGained: 0, investedPercent: 0, gainPercent: 0 };
    }

    const i = Math.expm1(Math.log1p(rAnnual / 100) / 12);
    if (i === 0) {
      return {
        totalInvested,
        maturityValue: totalInvested,
        wealthGained: 0,
        investedPercent: 100,
        gainPercent: 0
      };
    }

    // expm1/log1p keep the annuity factor accurate for small monthly rates.
    const annuityFactor = Math.expm1(n * Math.log1p(i)) / i;
    const maturity = P * annuityFactor * (1 + i);
    if (!Number.isFinite(maturity)) {
      return { totalInvested, maturityValue: 0, wealthGained: 0, investedPercent: 0, gainPercent: 0 };
    }
    const maturityValue = Math.round(maturity);
    const wealthGained = maturityValue - totalInvested;

    const investedPercent = maturityValue > 0 ? Math.min(100, Math.max(0, Math.round((totalInvested / maturityValue) * 100))) : 50;
    const gainPercent = 100 - investedPercent;

    return {
      totalInvested,
      maturityValue,
      wealthGained,
      investedPercent,
      gainPercent
    };
  }, [sipAmount, sipRate, sipYears]);

  // EMI Math Calculation (Standard Reducing Balance Method used by Indian Banks / RBI)
  const emiResult = useMemo(() => {
    const P = parseFloat(emiAmount);
    const rAnnual = parseFloat(emiRate);
    const years = parseFloat(emiYears);

    if (isNaN(P) || P <= 0 || isNaN(years) || years <= 0) {
      return { monthlyEmi: 0, totalPayment: 0, totalInterest: 0, principalPercent: 0, interestPercent: 0 };
    }

    const n = Math.round(years * 12);

    if (isNaN(rAnnual) || rAnnual <= 0) {
      const emi = Math.round(P / n);
      return {
        monthlyEmi: emi,
        totalPayment: P,
        totalInterest: 0,
        principalPercent: 100,
        interestPercent: 0
      };
    }

    const r = rAnnual / 100 / 12;
    // Standard reducing balance formula: E = P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emiExact = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const monthlyEmi = Math.round(emiExact);
    // Crucial for 100% mathematical consistency:
    // Total amount the borrower actually pays across n installments is monthlyEmi * n
    const totalPayment = monthlyEmi * n;
    const totalInterest = Math.max(0, totalPayment - P);

    const principalPercent = totalPayment > 0 ? Math.min(100, Math.max(0, Math.round((P / totalPayment) * 100))) : 50;
    const interestPercent = 100 - principalPercent;

    return {
      monthlyEmi,
      totalPayment,
      totalInterest,
      principalPercent,
      interestPercent
    };
  }, [emiAmount, emiRate, emiYears]);

  // Number Formatter (Indian Rupees)
  const formatINR = (val) => {
    if (isNaN(val)) return '₹0';
    return '₹' + Number(val).toLocaleString('en-IN');
  };

  // Quick Enquire jump from service cards
  const handleQuickEnquire = (serviceName) => {
    setServiceRequired(serviceName);
    const enquiryElem = document.getElementById('enquiry-section');
    if (enquiryElem) {
      enquiryElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setFormHighlighted(true);
      setTimeout(() => setFormHighlighted(false), 2200);
    }
  };

  // WhatsApp Enquiry Form Submit Handler
  const handleSubmitEnquiry = (e) => {
    e.preventDefault();

    const cleanPhone = mobileNumber.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      triggerToast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }

    const message = [
      '*New Financial Enquiry - Website*',
      '----------------------------------',
      `*Name:* ${fullName.trim()}`,
      `*Phone:* +91 ${cleanPhone.slice(-10)}`,
      `*Profile:* ${clientProfile}`,
      `*Service Interested:* ${serviceRequired}`,
      requirementDetails.trim() ? `*Details:* ${requirementDetails.trim()}` : '*Details:* Interested in understanding options and best plans.',
      '----------------------------------',
      'Please connect with me regarding this requirement.'
    ].join('\n');

    const whatsappUrl = `https://wa.me/917057132237?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    triggerToast('Redirecting your enquiry to WhatsApp...');
  };

  // WhatsApp Plan Inquire Handler from Calculators
  const handleInquirePlan = (type) => {
    let message = '';
    if (type === 'sip') {
      message = [
        '*SIP Investment Inquiry - Website*',
        '----------------------------------',
        `*Monthly SIP Amount:* ${formatINR(sipAmount)}`,
        `*Expected Annual Return:* ${sipRate}% p.a.`,
        `*Investment Tenure:* ${sipYears} Years (${sipYears * 12} Installments)`,
        `*Total Invested:* ${formatINR(sipResult.totalInvested)}`,
        `*Estimated Wealth Gain:* ${formatINR(sipResult.wealthGained)}`,
        `*Estimated Maturity Value:* ${formatINR(sipResult.maturityValue)}`,
        '----------------------------------',
        'Hello Smita Desai, I would like to set up a personalized mutual fund SIP portfolio based on this simulation.'
      ].join('\n');
    } else {
      message = [
        '*Loan EMI Inquiry - Website*',
        '----------------------------------',
        `*Loan Amount (Principal):* ${formatINR(emiAmount)}`,
        `*Interest Rate:* ${emiRate}% p.a.`,
        `*Loan Tenure:* ${emiYears} Years (${emiYears * 12} Months)`,
        `*Estimated Monthly EMI:* ${formatINR(emiResult.monthlyEmi)}/month`,
        `*Total Interest Payable:* ${formatINR(emiResult.totalInterest)}`,
        `*Total Amount Payable:* ${formatINR(emiResult.totalPayment)}`,
        '----------------------------------',
        'Hello Smita Desai, I want to check my loan eligibility, lowest interest rates, and required documents for this requirement.'
      ].join('\n');
    }

    const whatsappUrl = `https://wa.me/917057132237?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // 9 Core Services Data (mapped to new authentic high-res flyers)
  const services = [
    {
      id: 1,
      title: 'Life Insurance',
      category: 'insurance',
      badge: 'Insurance',
      icon: 'shield',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      oneLiner: 'Secure your family\'s long-term financial future.',
      description: 'Comprehensive term plans, endowment savings, retirement pensions, and child education plans with full tax exemption under Section 80C and 10(10D).',
      bullets: [
        'High sum assured with economical premiums',
        'Married Women\'s Property Act (MWPA) protection',
        'Immediate claim assistance & policy servicing'
      ],
      flyer: 'assets/flyer_kotak_signature_hq.jpg',
      flyerTitle: 'Kotak Signature Term Plan Flyer'
    },
    {
      id: 2,
      title: 'Health Insurance',
      category: 'insurance',
      badge: 'Insurance',
      icon: 'activity',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
      oneLiner: 'Comprehensive medical coverage for peace of mind.',
      description: 'Defend your lifetime savings against unexpected hospitalization expenses. Family floaters, critical illness rider, and senior citizen health plans.',
      bullets: [
        'Cashless treatment across 10,000+ top hospitals',
        'Tata AIG Medicare Select & Super Top-Up plans',
        'Tax saving benefit under Section 80D'
      ],
      flyer: 'assets/flyer_health_insurance_service.png',
      flyerTitle: 'Family Health Insurance & Mediclaim Scheme Flyer'
    },
    {
      id: 3,
      title: 'Mutual Funds & SIP / SWP',
      category: 'investments',
      badge: 'Investments',
      icon: 'trending-up',
      iconBg: 'bg-sky-50 text-cobalt border-sky-200',
      oneLiner: 'Goal-based wealth creation and systematic investments.',
      description: 'Harness the power of compounding with curated mutual fund portfolios through NJ Wealth network. Disciplined monthly SIP, step-up SIPs, SWP, and ELSS funds.',
      bullets: [
        'Top-up SIP strategy for accelerated wealth',
        'SWP regular monthly cashflow & pension planning',
        'Risk-profile matched equity & hybrid funds',
        'Seamless digital portfolio tracking & rebalancing'
      ],
      flyer: 'assets/flyer_sip_service.png',
      flyerTitle: 'Top-Up SIP ₹11.78 Cr Compounding Guide'
    },
    {
      id: 4,
      title: 'Vehicle / Motor Insurance',
      category: 'insurance',
      badge: 'Insurance',
      icon: 'car',
      iconBg: 'bg-sky-50 text-sky-600 border-sky-200',
      oneLiner: 'Instant protection for two-wheelers, cars, and commercial vehicles.',
      description: 'Instant policy issuance via WhatsApp. Comprehensive coverage, third-party liability, zero-depreciation add-on, engine protector, and 24x7 roadside assistance.',
      bullets: [
        'Instant quote by sending RC book on WhatsApp',
        'Best rates for 2-Wheelers, Private Cars & Commercial',
        'Zero-Depreciation & Cashless network garages'
      ],
      flyer: 'assets/flyer_motor_insurance_service.png',
      flyerTitle: 'All Types of Vehicle Online Insurance Flyer'
    },
    {
      id: 5,
      title: 'Home Loan',
      category: 'loans',
      badge: 'Loans',
      icon: 'home',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      oneLiner: 'Competitive interest rates and hassle-free sanctioning for your dream home.',
      description: 'Turn home ownership into reality. New flat purchase, independent bungalow construction, plot purchase with construction, and balance transfer facility.',
      bullets: [
        'Multi-bank rate comparison for the lowest ROI',
        'End-to-end legal & valuation document assistance',
        'Flexible tenure up to 30 years with easy EMI'
      ],
      flyer: 'assets/flyer_home_loan_service.png',
      flyerTitle: 'Home Loan Financing Guide'
    },
    {
      id: 6,
      title: 'Business Loans (Secured / Unsecured)',
      category: 'loans',
      badge: 'Loans',
      icon: 'briefcase',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      oneLiner: 'Flexible capital to scale your business operations.',
      description: 'Fuel your commercial growth with collateral-free unsecured business loans or large-ticket secured credit lines, cash credit (C.C.), and overdraft (O.D.).',
      bullets: [
        'Unsecured loan limits up to ₹5 Crore for MSMEs & traders',
        'Authorised channel partner of leading Banks & NBFCs',
        'Minimum documentation & quick disbursement'
      ],
      flyer: 'assets/flyer_business_loan_service.png',
      flyerTitle: 'Business Loan (Up to ₹5 Cr) Saturday Club Global Trust Flyer'
    },
    {
      id: 7,
      title: 'Professional Loans (Doctors / CA)',
      category: 'loans',
      badge: 'Loans',
      icon: 'stethoscope',
      iconBg: 'bg-teal-50 text-teal-600 border-teal-200',
      oneLiner: 'Tailored high-value credit lines for certified professionals.',
      description: 'Exclusive bespoke financial products for practicing Doctors, Chartered Accountants, Architects, and certified practitioners looking to set up clinics or purchase equipment.',
      bullets: [
        'Preferential interest rates & higher sanctioned limits',
        'Special schemes for Doctors, CA, Architects',
        'Hospital / clinic setup financing without friction'
      ],
      flyer: 'assets/flyer_professional_loan_service.png',
      flyerTitle: 'Professional Loan Financing Guide'
    },
    {
      id: 8,
      title: 'Personal Loans (For Salaried Individuals)',
      category: 'loans',
      badge: 'Loans',
      icon: 'user-check',
      iconBg: 'bg-sky-50 text-cobalt border-sky-200',
      oneLiner: 'Quick disbursement for personal milestones and urgent needs.',
      description: 'Unsecured financing for weddings, international travel, home renovation, or medical emergencies with minimal documentation and transparent terms.',
      bullets: [
        'Sanctions based on monthly salary slips & CIBIL score',
        'Zero collateral requirement & flexible repayment',
        'Disbursement within 24 to 48 working hours'
      ],
      flyer: 'assets/flyer_personal_loan_service.png',
      flyerTitle: 'Personal Loan for Salaried Individuals Guide'
    },
    {
      id: 9,
      title: 'New & Used Car Loans',
      category: 'loans',
      badge: 'Loans',
      icon: 'key',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      oneLiner: 'Fast financing with flexible EMI options for new and pre-owned cars.',
      description: 'Drive home your preferred car today. Up to 100% on-road funding on new cars and attractive refinancing options on certified pre-owned vehicles.',
      bullets: [
        'Lowest processing fees & customized EMI schedules',
        'Quick sanctioning with pre-approved options'
      ],
      flyer: 'assets/flyer_car_loan_hq.png',
      flyerTitle: 'New and Used Car Loan Financing Guide'
    }
  ];

  // Filtered Services List
  const filteredServices = useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter(s => s.category === activeCategory);
  }, [activeCategory]);

    // Client-provided flyers for schemes and the financial services opportunity.
  const schemeFlyers = [
    {
      id: 1,
      title: 'Business Loan Scheme (Up to ₹5 Cr)',
      tag: 'Loans',
      badgeMetric: 'Up to ₹5 Cr Limit',
      subtitle: 'Saturday Club Global Trust Member verified flyer • Unsecured & Secured',
      src: 'assets/flyer_business_loan_whatsapp.jpeg',
      caption: 'Business Loan (Up to ₹5 Cr) Scheme Flyer - Saturday Club Global Trust Regn E-26480, Sangli Office',
      highlights: [
        'Unsecured MSME loans up to ₹50 Lakh & Secured credit lines up to ₹5 Cr',
        'Authorized Channel Partner tie-ups with leading nationalized Banks & NBFCs',
        'Saturday Club Global Trust Sangli Chapter verified scheme'
      ]
    },
    {
      id: 2,
      title: 'All Loan Portfolio Guide',
      tag: 'Loans',
      badgeMetric: 'Multi-Bank Tie-ups',
      subtitle: 'Home, Business, Professional, Personal & Car Loans • Smitaa R Desai',
      src: 'assets/flyer_all_loan_portfolio_whatsapp.jpeg',
      caption: 'Complete Loan Portfolio Overview Flyer - Smitaa R Desai (+91 70571 32237)',
      highlights: [
        'Comparative ROI check across all major Indian banks for lowest interest rates',
        'Home Loans, Business Loans, Doctor/CA Credit, Personal & Car Loans',
        'End-to-end legal verification, valuation & documentation assistance'
      ]
    },
    {
      id: 3,
      title: 'Top-Up SIP Compounding Model',
      tag: 'Investments',
      badgeMetric: '₹11.78 Cr Target',
      subtitle: '₹11.78 Crore Wealth Creation Case Study • Smita Desai Financial Consultancy',
      src: 'assets/flyer_sip_topup_marathi.jpeg',
      caption: 'Top-Up SIP ₹11.78 Cr Compounding Guide - Smita Desai (+91 70571 32237)',
      highlights: [
        'Disciplined 10% - 15% annual step-up compounding strategy model',
        'Systematic investment planning for retirement, wealth & child higher education',
        'Curated equity & hybrid schemes tracked digitally on NJ Wealth Platform'
      ]
    },
    {
      id: 4,
      title: 'Family Health Insurance & Mediclaim',
      tag: 'Insurance',
      badgeMetric: '10,000+ Hospitals',
      subtitle: 'Comprehensive Hospitalization & Cashless Network Protection',
      src: 'assets/flyer_health_insurance_marathi.jpeg',
      caption: 'Family Health Insurance Scheme Flyer - Smita Desai (+91 70571 32237)',
      highlights: [
        'Cashless admission & claims settlement across 10,000+ top Indian hospitals',
        'Family floater coverage, critical illness rider & pre/post hospitalization cover',
        '100% tax savings benefit under Section 80D of the Income Tax Act'
      ]
    },
    {
      id: 5,
      title: 'Tata AIG Medicare Select Policy',
      tag: 'Insurance',
      badgeMetric: '₹5L to ₹3 Cr Cover',
      subtitle: 'Cashless Hospitalization • ₹5 Lakh to ₹3 Crore Coverage on EMI',
      src: 'assets/flyer_tata_aig_medicare_marathi.jpeg',
      caption: 'Tata AIG Medicare Select Policy Flyer - Official Partner Network',
      highlights: [
        'Zero room rent capping with automatic restoration benefit for unrelated illnesses',
        'Global emergency medical assistance & consumable expense riders',
        'Convenient monthly or quarterly EMI premium payment options'
      ]
    },
    {
      id: 6,
      title: 'All Types of Vehicle Insurance',
      tag: 'Insurance',
      badgeMetric: 'Instant WhatsApp Quote',
      subtitle: 'Instant Online Policy for Bikes, Cars, Commercial Vehicles & Buses',
      src: 'assets/flyer_vehicle_insurance_marathi.jpeg',
      caption: 'Vehicle Online Insurance Flyer - Fast Paperless Process & Best Rates',
      highlights: [
        'Instant quotes generated directly by sharing RC Book photo on WhatsApp',
        'Zero-Depreciation add-on, engine protector & 24x7 roadside breakdown service',
        'Comprehensive coverage for 2-Wheelers, Private Cars & Commercial Fleet'
      ]
    },
    {
      id: 7,
      title: 'Kotak Life MWPA Estate Protection',
      tag: 'Insurance',
      badgeMetric: '100% Creditor-Proof',
      subtitle: 'Senior Agency Associate Smita Desai • Protect Wife & Children',
      src: 'assets/flyer_kotak_mwpa_marathi.jpeg',
      caption: 'Kotak Life MWPA Wife & Children Protection Flyer - Associate Smita Desai (Call only: +91 77769 77171; no WhatsApp)',
      highlights: [
        'Married Women’s Property Act (MWPA 1874) legal ring-fencing protection',
        'Policy proceeds strictly reserved for wife & children, free from business debts',
        'Immune to court attachments, creditor claims & business liabilities'
      ]
    },
    {
      id: 8,
      title: 'Kotak Signature Term Plan',
      tag: 'Insurance',
      badgeMetric: '16% Women Discount',
      subtitle: 'High Life Cover • Special Exit Option • 16% Women Discount',
      src: 'assets/flyer_kotak_signature_marathi.jpeg',
      caption: 'Kotak Signature Term Plan High Cover Flyer',
      highlights: [
        'High life cover with special exit benefit and return of premium option',
        'Exclusive 16% premium rate discount for female policyholders',
        'Comprehensive critical illness rider & whole life cover options up to 99 years'
      ]
    },
    {
      id: 9,
      title: 'Mutual Funds for Every Family',
      tag: 'Investments',
      badgeMetric: 'Start from ₹500',
      subtitle: 'Marathi guide to mutual funds and disciplined SIP investing',
      src: 'assets/flyer_mutual_funds_marathi.jpeg',
      caption: 'Mutual Funds for Every Family • Marathi Flyer',
      highlights: ['Start investing through SIPs from ₹500', 'Build long-term savings with disciplined investing', 'Understand mutual fund risks before investing']
    },
    {
      id: 10,
      title: 'Financial Services Career Opportunity',
      tag: 'Careers',
      badgeMetric: 'Career Opportunity',
      subtitle: 'A financial services opportunity for homemakers, retirees and part-time workers',
      src: 'assets/flyer_financial_career.jpeg',
      caption: 'Financial Services Career Opportunity • Marathi Flyer',
      highlights: ['Training and guidance', 'Flexible work opportunity', 'Contact Smita Desai for details']
    },
    {
      id: 11,
      title: 'SIP for Life Goals',
      tag: 'Investments',
      badgeMetric: 'Goal-Based SIP',
      subtitle: 'Plan for education, weddings and retirement',
      src: 'assets/flyer_sip_life_goals.jpeg',
      caption: 'SIP for Life Goals • Education, Wedding and Retirement',
      highlights: ['Illustrative examples for different life goals', 'Choose a contribution suited to your timeline', 'Mutual fund returns are market-linked and not guaranteed']
    },
    {
      id: 12,
      title: 'Top-Up SIP Retirement Plan',
      tag: 'Investments',
      badgeMetric: '₹11.78 Cr Illustration',
      subtitle: 'Marathi top-up SIP retirement illustration',
      src: 'assets/flyer_sip_topup_retirement.jpeg',
      caption: 'Top-Up SIP Retirement Plan • Marathi Illustration',
      highlights: ['Shows an example of annual SIP increases', 'Illustrative figures are not guaranteed', 'Mutual fund investments are subject to market risks']
    },
    {
      id: 13,
      title: 'Kotak Assured Pension',
      tag: 'Insurance',
      badgeMetric: 'Retirement Income',
      subtitle: 'Kotak Life pension plan flyer',
      src: 'assets/flyer_kotak_assured_pension.jpeg',
      caption: 'Kotak Assured Pension • Flyer',
      highlights: ['Retirement income product information', 'Review policy terms and annuity rates', 'Please read the insurer brochure before purchase']
    },
    {
      id: 14,
      title: 'Kotak Confident Retirement Savings Plan',
      tag: 'Insurance',
      badgeMetric: 'Retirement Savings',
      subtitle: 'Savings plan with life cover',
      src: 'assets/flyer_kotak_retirement_savings.jpeg',
      caption: 'Kotak Confident Retirement Savings Plan • Flyer',
      highlights: ['Plan information for retirement savings', 'Includes life cover as described in the flyer', 'Review the official policy terms before purchase']
    },
    {
      id: 15,
      title: 'Kotak Gen2Gen Protect',
      tag: 'Insurance',
      badgeMetric: 'Generational Protection',
      subtitle: 'Kotak Life protection plan flyer',
      src: 'assets/flyer_kotak_gen2gen.jpeg',
      caption: 'Kotak Gen2Gen Protect • Flyer',
      highlights: ['Life cover options as described in the flyer', 'Review plan options and rider details', 'Read the insurer brochure for terms and exclusions']
    }
  ];

  const schemeSlideCount = Math.ceil(schemeFlyers.length / FLYER_SECTIONS.length);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || schemeSlideCount < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setSchemeSlideIndex(index => index + 1);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [schemeSlideCount]);

  // Photo Gallery Data (Awards, Certificates & Visiting Cards)
  const photoGalleryItems = [
    {
      id: 'gallery-1',
      title: 'Tata AIG Insurance Recognition Award',
      category: 'awards',
      tag: 'Tata AIG Honor',
      badgeMetric: 'Stage Felicitation',
      subtitle: 'National Partner Meet • Recognized for Outstanding General Insurance Consulting',
      src: 'assets/award_tata_aig.jpg',
      caption: 'Smita Desai receiving the prestigious recognition award on stage at Tata AIG Insurance partner conference',
      highlights: [
        'Felicitated by senior leadership at Tata AIG Insurance national partner meet',
        'Recognized for exceptional general insurance consultancy across health & motor portfolios',
        'Commitment to zero-friction claim settlements and proactive client advocacy'
      ]
    },
    {
      id: 'gallery-2',
      title: 'Kotak Life Insurance - Drive Excellence Award',
      category: 'awards',
      tag: 'Kotak Life Excellence',
      badgeMetric: 'Excellence Trophy',
      subtitle: 'Set New Benchmarks & Drive Excellence • Annual Partner Summit',
      src: 'assets/award_kotak_life.jpg',
      caption: 'Smita Desai receiving the "Set New Benchmarks & Drive Excellence" trophy on stage at Kotak Life Insurance Annual Conference',
      highlights: [
        'Awarded for extraordinary consultancy in long-term life cover & MWPA estate protection',
        'Honored on stage by regional leadership for setting new performance benchmark standards',
        'Senior Agency Associate driving tailored long-term financial security for families'
      ]
    },
    {
      id: 'gallery-3',
      title: 'Annual Partner Felicitation & Merit Trophy',
      category: 'awards',
      tag: 'Merit Trophy',
      badgeMetric: 'Premier Honor',
      subtitle: 'Honored on Stage with Leadership Trophy & Felicitation Hamper',
      src: 'assets/award_felicitation.jpg',
      caption: 'Smita Desai honored on stage with the prestigious leadership trophy and gift hamper during the annual partner excellence ceremony',
      highlights: [
        'Prestigious recognition for milestone consultancy across wealth management & loan services',
        'Honored for cultivating multi-decade trust and tailored financial strategies across Western Maharashtra',
        'Special tribute to client-centric consulting ethics, professional diligence, and community impact'
      ]
    },
    {
      id: 'gallery-4',
      title: 'NJ Wealth Partner Appointment Certificate',
      category: 'certifications',
      tag: 'NJ Wealth Partner',
      badgeMetric: 'Partner Code #28795',
      subtitle: 'Official Certificate of Appointment • Financial Products Distributors Network',
      src: 'assets/nj_wealth_certificate_clean.png',
      caption: 'NJ Wealth Partner Appointment Certificate (Partner Code: 28795) - Smita Rahul Desai',
      highlights: [
        'Official appointment as NJ Wealth Authorized Distribution Partner (Code: 28795)',
        'AMFI Registered Mutual Fund Distributor adhering to strict code of ethics and statutory standards',
        'Comprehensive digital desk providing 500+ clients automated portfolio tracking & SIP execution'
      ]
    },
    {
      id: 'gallery-5',
      title: 'Saturday Club Global Trust Membership',
      category: 'certifications',
      tag: 'SCGT Member',
      badgeMetric: 'Valid Thru June 2027',
      subtitle: 'Yellow City Sangli Chapter • Regn. No. E-26480(Mum) • Business Network',
      src: 'assets/saturday_club_membership_certificate.png',
      caption: 'Saturday Club Global Trust Certificate of Membership - Smita Rahul Desai (Yellow City Sangli Chapter, Valid upto 24th June 2027)',
      highlights: [
        'Official Certificate of Membership presented to Smita Rahul Desai by SCGT Leadership',
        'Active member of Saturday Club Global Trust - Yellow City Sangli Chapter (Regn E-26480)',
        'Membership valid upto 24th June 2027 fostering trusted enterprise financial consultancy'
      ]
    },
    {
      id: 'gallery-visiting-card-financial',
      title: "Smita's Financial Consultancy Services Visiting Card",
      category: 'visiting-cards',
      tag: 'Financial Consultancy',
      badgeMetric: 'Sangli Contact',
      subtitle: 'Financial planning, insurance, investments, SIP and business services',
      src: 'assets/visiting_card_smita_financial.jpg',
      caption: "Smita Rahul Desai's visiting card for Smita's Financial Consultancy Services in Sangli",
      highlights: [
        'Main line for calls and WhatsApp: +91 70571 32237',
        'Alternate number for calls only: +91 77769 77171',
        'Email: smitadesai1821@gmail.com'
      ]
    },
    {
      id: 'gallery-visiting-card-starpowerz',
      title: 'StarPowerz Loan Services Visiting Card',
      category: 'visiting-cards',
      tag: 'Loan Assistance',
      badgeMetric: 'StarPowerz',
      subtitle: 'Loan services from StarPowerz Digital Technologies Pvt. Ltd.',
      src: 'assets/visiting_card_starpowerz_loans.jpg',
      caption: "Smita Rahul Desai's StarPowerz visiting card for loan enquiry services",
      highlights: [
        'Land, business, home, mortgage, personal and vehicle loan enquiries',
        'Main line for calls and WhatsApp: +91 70571 32237',
        'Alternate number for calls only: +91 77769 77171',
        'Website: starpowerz.com'
      ]
    }
  ];

  const filteredPhotoGallery = useMemo(() => {
    if (activeGalleryTab === 'all') return photoGalleryItems;
    return photoGalleryItems.filter(item => item.category.toLowerCase() === activeGalleryTab.toLowerCase());
  }, [activeGalleryTab, photoGalleryItems]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-200 selection:text-navy-900 pb-16 md:pb-0">

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border ${
            toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <Icon name={toast.type === 'error' ? 'alert-circle' : 'check-circle-2'} className="w-4 h-4"></Icon>
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* TOP DESKTOP & MOBILE HEADER (Fixed Glassmorphic Bar) */}
      <header className="glass-nav-fixed">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">

          {/* Logo & Brand Monogram */}
          <a href="#hero" className="flex items-center gap-3 group shrink-0">
            <div className="w-12 h-12 rounded-2xl bg-white p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-slate-200/90 relative overflow-hidden shrink-0">
              <img 
                src="assets/sfcs_logo_emblem.png" 
                alt="Smita's Financial Consultancy logo" 
                className="w-full h-full object-contain"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-0.5 -right-0.5 animate-pulse"></span>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1 font-heading">
                <span>Smita's</span>
                <span className="text-[#0047AB]">Financial</span>
              </div>
              <p className="text-[10px] tracking-wider uppercase font-extrabold text-slate-500 -mt-1">
                Consultancy Services • Sangli
              </p>
            </div>
          </a>

          {/* Desktop Nav Links - Single Line, Clean Spacing, Never Wraps */}
          <nav className="hidden xl:flex items-center gap-3.5 xl:gap-6 text-xs xl:text-[13px] font-bold text-slate-700 tracking-wide">
            <a href="#hero" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Home</a>
            <a href="#services" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Services</a>
            <a href="#calculators" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Calculators</a>
            <a href="#about" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">About</a>
            <a href="#schemes" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Schemes</a>
            <a href="#gallery" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Gallery</a>
            <a href="#payment" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Payment</a>
            <a href="#reviews" className="nav-link-interactive hover:text-[#0047AB] whitespace-nowrap">Reviews</a>
          </nav>

          {/* Desktop Action Group - Strictly visible only on desktop (lg:) alongside full navigation */}
          <div className="hidden xl:flex items-center gap-2 xl:gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-2 border-r border-slate-200 pr-3">
              <button 
                onClick={shareProfile} 
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs flex items-center justify-center active:scale-95" 
                title="Share Digital vCard"
                aria-label="Share Website"
              >
                <Icon name="share-2" className="w-4 h-4"></Icon>
              </button>
              <button 
                onClick={() => setQrModalOpen(true)} 
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all shadow-xs flex items-center justify-center active:scale-95" 
                title="Show QR Code"
                aria-label="Show Website QR Code"
              >
                <Icon name="qr-code" className="w-4 h-4 text-[#0047AB]"></Icon>
              </button>
            </div>

            <a 
              href="tel:+917776977171"
              aria-label="Call only number +91 77769 77171. WhatsApp is available on +91 70571 32237."
              title="Call-only number"
              className="btn-pill btn-pill-cobalt px-3.5 xl:px-5 py-2 xl:py-2.5 text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1.5 xl:gap-2 whitespace-nowrap"
            >
              <Icon name="phone-call" className="w-3.5 h-3.5"></Icon>
              <span>Call: +91 77769 77171</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle & QR Code Button */}
          <div className="flex items-center gap-2 xl:hidden shrink-0">
            <button 
              onClick={() => setQrModalOpen(true)} 
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[#0047AB] flex items-center justify-center shadow-xs active:scale-95 transition-all focus:outline-none" 
              title="Show QR Code"
              aria-label="Show QR Code"
            >
              <Icon name="qr-code" className="w-5 h-5 text-[#0047AB]"></Icon>
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center shadow-xs focus:outline-none active:scale-95 transition-all"
              aria-label="Toggle navigation menu"
            >
              <Icon name={mobileMenuOpen ? "x" : "menu"} className={`w-5 h-5 transition-transform duration-300 ${mobileMenuOpen ? 'rotate-90 text-[#0047AB]' : 'rotate-0'}`}></Icon>
            </button>
          </div>

        </div>

        {/* Mobile Drawer & Backdrop */}
        {mobileMenuOpen && (
          <>
            {/* Click-outside backdrop below header */}
            <div 
              onClick={() => setMobileMenuOpen(false)} 
              className="xl:hidden fixed inset-0 top-20 bg-slate-900/40 backdrop-blur-xs z-10 animate-drawer-backdrop cursor-pointer"
              aria-label="Close mobile navigation menu"
            />

            {/* Smooth Slide-down Drawer Container */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className="xl:hidden relative z-20 border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-drawer max-h-[calc(100vh-5.5rem)] overflow-y-auto overscroll-contain"
            >
              <nav className="flex flex-col space-y-1.5 text-sm font-semibold text-slate-700">
                <a href="#hero" onClick={event => navigateFromMobileMenu(event, 'hero')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>Home</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#services" onClick={event => navigateFromMobileMenu(event, 'services')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>9 Core Services</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#calculators" onClick={event => navigateFromMobileMenu(event, 'calculators')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>SIP & Loan Calculators</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#about" onClick={event => navigateFromMobileMenu(event, 'about')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>About Smita Desai</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#schemes" onClick={event => navigateFromMobileMenu(event, 'schemes')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>Official Scheme Flyers</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#gallery" onClick={event => navigateFromMobileMenu(event, 'gallery')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>Awards, Gallery & Visiting Cards</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#payment" onClick={event => navigateFromMobileMenu(event, 'payment')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>UPI Payment & Bank Details</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#reviews" onClick={event => navigateFromMobileMenu(event, 'reviews')} className="px-3.5 py-2.5 rounded-xl hover:bg-[#82C8E5]/15 hover:text-[#0047AB] active:scale-[0.99] transition-all flex items-center justify-between group">
                  <span>Client Reviews</span>
                  <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] group-hover:translate-x-0.5 transition-transform"></Icon>
                </a>
                <a href="#enquiry-section" onClick={event => navigateFromMobileMenu(event, 'enquiry-section')} className="px-3.5 py-2.5 rounded-xl bg-[#82C8E5]/20 text-[#000080] font-bold border border-[#82C8E5]/50 flex items-center justify-between hover:bg-[#82C8E5]/30 active:scale-[0.99] transition-all shadow-xs group">
                  <span>Fast WhatsApp Enquiry</span>
                  <Icon name="message-circle" className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform"></Icon>
                </a>
              </nav>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <a href="tel:+917776977171" aria-label="Call only number +91 77769 77171" className="flex-1 py-2.5 px-3 rounded-full btn-pill-cobalt text-xs font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform">
                  <Icon name="phone-call" className="w-4 h-4"></Icon> Call Now
                </a>
                <button onClick={shareProfile} className="flex-1 py-2.5 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200 active:scale-95 transition-all">
                  <Icon name="share-2" className="w-4 h-4"></Icon> Share
                </button>
              </div>
            </div>
          </>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-grow pb-20 md:pb-0">

        {/* 1. HERO SECTION WITH ORGANIC LAYERED FLUID WAVE FRAME (User Reference Design Aesthetic) */}
        <section id="hero" className="organic-wave-outer pt-28 pb-16 lg:pt-32 lg:pb-24 px-3 sm:px-6 lg:px-8">

          {/* Atmospheric 3D Ribbon Wave & Ambient Specular Glow (User Reference Design Aesthetic) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <img 
              src="assets/ribbon-wave.svg" 
              alt="Decorative 3D Ribbon Wave Background" 
              className="w-full h-full object-cover ribbon-drift" 
            />
            {/* Ambient Specular Glass Accents */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-[#82C8E5]/25 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#f49fbb]/25 rounded-full blur-3xl"></div>
          </div>

          {/* INNER WHITE STAGE (The Framed Card matching the user's reference UI) */}
          <div className="max-w-7xl mx-auto wave-framed-stage p-6 sm:p-10 lg:p-12 relative">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">

              {/* Left Column: Copy & Actions */}
              <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                
                {/* Verified Trust Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#82C8E5]/15 border border-[#82C8E5]/60 text-[#000080] text-xs font-bold tracking-wide shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>8+ Years Experience • Sangli, Maharashtra</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] font-heading">
                  Smart, Transparent <br />
                  <span className="text-gold-gradient">Financial Solutions</span> <br />
                  <span className="text-slate-800 text-2xl sm:text-3xl md:text-4xl font-extrabold">for Individuals, Professionals & Businesses.</span>
                </h1>

                {/* Tagline in Playfair Display italic */}
                <div className="text-lg sm:text-2xl font-serif-italic font-bold text-[#0047AB] tracking-wide">
                  “Your Trust, Our Commitment.”
                </div>

                {/* Concise Value Proposition */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Empowering your financial journey with objective guidance, personalized wealth creation, comprehensive insurance protection, and seamless loan sanctions across leading Indian banks and NBFCs.
                </p>

                {/* Pill Action Triggers (Matching the Reference UI's rounded-full pill button style) */}
                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
                  <a href="tel:+917776977171" aria-label="Call only number +91 77769 77171" title="Call-only alternate number" className="btn-pill btn-pill-cobalt px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm shadow-md touch-target justify-center whitespace-nowrap">
                    <Icon name="phone" className="w-4 h-4"></Icon>
                    <span>Call Now</span>
                  </a>

                  <a 
                    href="https://wa.me/917057132237?text=Hello%20Smita's%20Financial%20Consultancy,%20I%20would%20like%20to%20know%20more%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill px-4 sm:px-5 py-3 sm:py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-600 text-xs sm:text-sm shadow-md pulse-whatsapp-light touch-target justify-center whitespace-nowrap"
                  >
                    <Icon name="message-circle" className="w-4 h-4"></Icon>
                    <span>WhatsApp Direct</span>
                  </a>

                  <button 
                    onClick={shareProfile}
                    className="btn-pill btn-pill-outline px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm shadow-xs touch-target justify-center whitespace-nowrap"
                    title="Share Profile"
                  >
                    <Icon name="share-2" className="w-4 h-4"></Icon>
                    <span>Share</span>
                  </button>

                  <button 
                    onClick={() => setQrModalOpen(true)}
                    className="btn-pill btn-pill-outline px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm shadow-xs touch-target justify-center whitespace-nowrap"
                    title="Show Scannable QR"
                  >
                    <Icon name="qr-code" className="w-4 h-4 text-[#0047AB]"></Icon>
                    <span>QR Code</span>
                  </button>
                </div>

                {/* Metrics Strip */}
                <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto lg:mx-0">
                  <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#82C8E5]/80 hover:bg-white/95 transition-all duration-300">
                    <div className="text-2xl font-black text-slate-900 font-heading">8+</div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Years Experience</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#82C8E5]/80 hover:bg-white/95 transition-all duration-300">
                    <div className="text-2xl font-black text-slate-900 font-heading">1000+</div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Happy Clients</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#82C8E5]/80 hover:bg-white/95 transition-all duration-300">
                    <div className="text-2xl font-black text-slate-900 font-heading">9+</div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Core Services</div>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/90 text-center shadow-xs hover:shadow-md hover:-translate-y-1 hover:border-[#82C8E5]/80 hover:bg-white/95 transition-all duration-300">
                    <div className="text-2xl font-black text-[#0047AB] font-heading">100%</div>
                    <div className="text-[11px] text-slate-600 font-semibold mt-0.5">Direct Consultation</div>
                  </div>
                </div>

              </div>

              {/* Right Column: BIGGER SHOWCASE CARD FOR SMITA DESAI (Using pure high-res full image) */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-full max-w-lg hero-photo-card rounded-3xl p-5 sm:p-7 space-y-6">
                  
                  {/* Clean Portrait Image Container - Display full image without cropping */}
                  <div className="rounded-2xl overflow-hidden bg-white/70 backdrop-blur-md border border-slate-200/90 shadow-md group p-1.5 flex items-center justify-center">
                    <img 
                      src="assets/smita_profile.jpg" 
                      alt="Smita Rahul Desai - Principal Financial Consultant" 
                      className="w-full h-auto block rounded-xl object-contain group-hover:scale-[1.01] transition-transform duration-500"
                    />
                  </div>

                  {/* Clean Accreditation Bar (Outside the image) */}
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                      <Icon name="badge-check" className="w-4 h-4 text-emerald-600"></Icon>
                      <span>Verified Financial Consultant</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
                      NJ Wealth Partner: <strong className="text-slate-900">#28795</strong> • Sangli, MH
                    </span>
                  </div>

                  {/* Identity & Name Block */}
                  <div className="space-y-2 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 justify-center sm:justify-start">
                        <div className="w-12 h-12 rounded-2xl bg-white p-1 border border-slate-200/90 shadow-xs shrink-0 flex items-center justify-center">
                          <img 
                            src="assets/sfcs_logo_emblem.png" 
                            alt="Smita's Financial Consultancy logo" 
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                            Smita Rahul Desai
                          </h2>
                          <p className="text-[#0047AB] font-bold text-xs sm:text-sm">
                            Founder & Principal Financial Consultant
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-nowrap items-center justify-center sm:justify-end gap-1 whitespace-nowrap text-yellow-400">
                        <Icon name="star" className="w-4 h-4 shrink-0 fill-yellow-400"></Icon>
                        <Icon name="star" className="w-4 h-4 shrink-0 fill-yellow-400"></Icon>
                        <Icon name="star" className="w-4 h-4 shrink-0 fill-yellow-400"></Icon>
                        <Icon name="star" className="w-4 h-4 shrink-0 fill-yellow-400"></Icon>
                        <Icon name="star" className="w-4 h-4 shrink-0 fill-yellow-400"></Icon>
                        <span className="shrink-0 text-xs font-bold text-slate-700 ml-1">5.0</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Smita's Financial Consultancy Services • 8+ Years of Financial Excellence
                    </p>
                  </div>

                  {/* Direct Contact Chips inside Card */}
                  <div className="space-y-2.5 pt-1">
                    <a 
                      href="tel:+917057132237"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#82C8E5]/15 border border-slate-200 text-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#82C8E5]/25 text-[#0047AB] flex items-center justify-center">
                          <Icon name="phone" className="w-4 h-4"></Icon>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Main line · Calls & WhatsApp</span>
                          <span className="text-sm font-bold text-slate-900">+91 70571 32237</span>
                        </div>
                      </div>
                      <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-[#0047AB] transition-transform group-hover:translate-x-1"></Icon>
                    </a>

                    <a
                      href="tel:+917776977171"
                      aria-label="Call alternate number +91 77769 77171. Calls only, no WhatsApp."
                      className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 hover:bg-amber-50 border border-amber-200/80 text-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                          <Icon name="phone-call" className="w-4 h-4"></Icon>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-amber-800 block tracking-wider">Alternate · Calls only</span>
                          <span className="text-sm font-bold text-slate-900">+91 77769 77171</span>
                          <span className="block text-[10px] font-semibold text-amber-800">Not available on WhatsApp</span>
                        </div>
                      </div>
                      <Icon name="chevron-right" className="w-4 h-4 text-amber-700 transition-transform group-hover:translate-x-1"></Icon>
                    </a>

                    <a 
                      href="mailto:smitadesai1821@gmail.com"
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-[#82C8E5]/15 border border-slate-200 text-slate-800 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                          <Icon name="mail" className="w-4 h-4"></Icon>
                        </div>
                        <div className="text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Official Email</span>
                          <span className="text-sm font-bold text-slate-900 break-all">smitadesai1821@gmail.com</span>
                        </div>
                      </div>
                      <Icon name="chevron-right" className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-1"></Icon>
                    </a>
                  </div>

                  {/* Card Action Dual Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <a 
                      href="tel:+917776977171"
                      aria-label="Call only number +91 77769 77171"
                      className="btn-pill btn-pill-cobalt py-3 text-xs tracking-wider uppercase shadow-xs touch-target"
                    >
                      <Icon name="phone-call" className="w-4 h-4"></Icon>
                      <span>Call · 77769 77171</span>
                    </a>
                    <a 
                      href="https://wa.me/917057132237?text=Hello%20Smita%20Desai,%20I%20am%20connecting%20from%20your%20website."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-pill py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs tracking-wider uppercase font-bold shadow-xs touch-target"
                    >
                      <Icon name="message-circle" className="w-4 h-4"></Icon>
                      <span>WhatsApp</span>
                    </a>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* Bottom Organic Wave Transition */}
          <div className="w-full max-w-7xl mx-auto mt-8 flex justify-center">
            <div className="inline-flex items-center gap-6 text-slate-300 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><Icon name="check" className="w-4 h-4 text-[#82C8E5]"></Icon> Authorized NJ Wealth Network</span>
              <span className="hidden sm:flex items-center gap-1.5"><Icon name="check" className="w-4 h-4 text-[#82C8E5]"></Icon> Saturday Club Global Trust Member</span>
              <span className="flex items-center gap-1.5"><Icon name="check" className="w-4 h-4 text-[#82C8E5]"></Icon> Leading Banks & NBFC Partner</span>
            </div>
          </div>

        </section>

        {/* 2. INTERACTIVE 9-SERVICE BENTO GRID */}
        <section id="services" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#82C8E5]/20 border border-[#82C8E5]/60 text-[#000080] text-xs font-bold uppercase tracking-wider mb-3">
              Financial Solutions Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 font-heading">
              Comprehensive Services Crafted for Your Wealth & Protection
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Explore our complete suite of 9 specialized financial solutions. Filter by category or enquire directly with one click.
            </p>

            {/* Category Filter Pills (Aligned with rounded-full pill aesthetic) */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
              <button
                onClick={() => setActiveCategory('all')}
                className={`btn-pill px-5 py-2.5 text-xs uppercase tracking-wider transition-all ${
                  activeCategory === 'all'
                    ? 'btn-pill-cobalt shadow-md'
                    : 'btn-pill-outline text-slate-700'
                }`}
              >
                All Services (9)
              </button>
              <button
                onClick={() => setActiveCategory('insurance')}
                className={`btn-pill px-5 py-2.5 text-xs uppercase tracking-wider transition-all ${
                  activeCategory === 'insurance'
                    ? 'btn-pill-cobalt shadow-md'
                    : 'btn-pill-outline text-slate-700'
                }`}
              >
                Insurance (3)
              </button>
              <button
                onClick={() => setActiveCategory('investments')}
                className={`btn-pill px-5 py-2.5 text-xs uppercase tracking-wider transition-all ${
                  activeCategory === 'investments'
                    ? 'btn-pill-cobalt shadow-md'
                    : 'btn-pill-outline text-slate-700'
                }`}
              >
                Investments & SIP (1)
              </button>
              <button
                onClick={() => setActiveCategory('loans')}
                className={`btn-pill px-5 py-2.5 text-xs uppercase tracking-wider transition-all ${
                  activeCategory === 'loans'
                    ? 'btn-pill-cobalt shadow-md'
                    : 'btn-pill-outline text-slate-700'
                }`}
              >
                Loans & Credit (5)
              </button>
            </div>
          </div>

          {/* Bento Grid of Services */}
          <div key={activeCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-tab-content">
            {filteredServices.map((service) => (
              <div 
                key={service.id}
                className="card-light rounded-3xl p-6 sm:p-7 flex flex-col justify-between group relative overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <div>
                  {/* Full Scheme Flyer Preview Header - Display complete image */}
                  {service.flyer && (
                    <div 
                      onClick={() => setLightboxData({ open: true, src: service.flyer, caption: service.flyerTitle })}
                      className="w-full h-auto sm:h-72 rounded-2xl overflow-hidden relative mb-5 bg-slate-50/90 border border-slate-200/90 shadow-sm cursor-pointer group/img flex items-center justify-center p-0 sm:p-2"
                      title="Click to inspect official scheme flyer"
                    >
                      <img 
                        src={service.flyer} 
                        alt={service.title} 
                        className="w-full h-auto sm:h-full object-contain rounded-xl group-hover/img:scale-[1.02] transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="btn-pill px-3.5 py-1.5 bg-white text-[#000080] font-black text-xs shadow-lg flex items-center gap-1.5 transform group-hover/img:scale-105 transition-transform">
                          <Icon name="zoom-in" className="w-3.5 h-3.5 text-[#0047AB]"></Icon>
                          <span>Inspect Flyer</span>
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#000080]/85 backdrop-blur-md text-white text-[10px] font-bold shadow-xs border border-white/20">
                        Official Scheme Guide
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${service.iconBg} service-icon-box shadow-xs`}>
                      <Icon name={service.icon} className="w-6 h-6"></Icon>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs">
                      {service.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0047AB] transition-colors font-heading mb-1.5">
                    {service.title}
                  </h3>

                  <p className="text-[#0047AB] font-semibold text-xs mb-3">
                    {service.oneLiner}
                  </p>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {service.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Icon name="check-circle-2" className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5"></Icon>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {service.category === 'investments' && (
                    <a
                      href={SIP_ACCOUNT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/sip relative mb-6 block overflow-hidden rounded-2xl border border-[#82C8E5]/70 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#0047AB]/50 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
                      aria-label="Create an NJ Wealth SIP account with Smita Desai's partner reference 28795 (opens in a new tab)"
                    >
                      <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#82C8E5]/25 blur-2xl transition-transform duration-500 group-hover/sip:scale-150" aria-hidden="true" />
                      <span className="relative inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#0047AB] shadow-xs">
                        <Icon name="badge-check" className="h-3.5 w-3.5" aria-hidden="true"></Icon>
                        NJ Wealth Partner #28795
                      </span>
                      <span className="relative mt-3 block text-base font-bold text-slate-900 font-heading">Create your SIP account</span>
                      <span className="relative mt-1.5 block text-xs leading-relaxed text-slate-600">
                        Open the NJ Wealth account page with Smita Desai's partner reference. Complete your account setup there to get started with SIPs.
                      </span>
                      <span className="relative mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0047AB]">
                        Open account page
                        <Icon name="arrow-up-right" className="h-4 w-4 transition-transform duration-300 group-hover/sip:-translate-y-0.5 group-hover/sip:translate-x-0.5" aria-hidden="true"></Icon>
                      </span>
                    </a>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => handleQuickEnquire(service.title)}
                    className="flex-1 py-2.5 px-4 rounded-full bg-slate-100 hover:bg-[#0047AB] hover:text-white text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all group-hover:border-[#82C8E5] shadow-xs hover:shadow-md"
                  >
                    <span>QUICK ENQUIRE</span>
                    <Icon name="arrow-right" className="w-3.5 h-3.5"></Icon>
                  </button>

                  {service.flyer && (
                    <button
                      onClick={() => setLightboxData({ open: true, src: service.flyer, caption: service.flyerTitle })}
                      className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors shadow-xs"
                      title="View Official Scheme Flyer"
                    >
                      <Icon name="image" className="w-4 h-4"></Icon>
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>

        </section>

        {/* 3. SIP & LOAN EMI CALCULATORS */}
        <section id="calculators" className="py-16 bg-white/50 backdrop-blur-md border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                <Icon name="calculator" className="w-3.5 h-3.5"></Icon>
                <span>Smart Financial Planner</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                Calculate Your Wealth or Loan EMI in Real–Time
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                Simulate your expected returns or calculate exact monthly installments with standard Indian financial compounding formulas, then discuss your goals directly with Smita Desai.
              </p>

              {/* Tab Selector */}
              <div className="inline-flex p-1.5 rounded-full glass-card border border-white/80 mt-6 shadow-xs">
                <button
                  onClick={() => setCalcTab('sip')}
                  className={`btn-pill px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
                    calcTab === 'sip' ? 'btn-pill-cobalt shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon name="trending-up" className="w-3.5 h-3.5"></Icon>
                  <span>SIP Wealth Calculator</span>
                </button>
                <button
                  onClick={() => setCalcTab('emi')}
                  className={`btn-pill px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
                    calcTab === 'emi' ? 'btn-pill-cobalt shadow-md' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon name="home" className="w-3.5 h-3.5"></Icon>
                  <span>Loan EMI Calculator</span>
                </button>
              </div>
            </div>

            {/* Calculator Card */}
            {calcTab === 'sip' ? (
              <div key="sip" className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-white/95 shadow-2xl animate-tab-content">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  <div className="md:col-span-7 space-y-6">

                    {/* Quick Amount Presets */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Quick Investment Presets
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[2500, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setSipAmount(amt)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                              sipAmount === amt
                                ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            ₹{Number(amt).toLocaleString('en-IN')}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Monthly Investment */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Monthly Investment Amount
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <span className="text-slate-500 font-bold text-xs">₹</span>
                          <input 
                            type="number"
                            min="500"
                            max="500000"
                            step="500"
                            value={sipAmount || ''}
                            onChange={(e) => setSipAmount(e.target.value === '' ? 0 : Math.min(500000, Math.max(0, Number(e.target.value))))}
                            className="w-24 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Monthly investment amount in Rupees"
                          />
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="500" 
                        max="500000" 
                        step="500" 
                        value={sipAmount} 
                        onChange={(e) => setSipAmount(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Monthly investment amount slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>₹500 (Min)</span>
                        <span>₹2,50,000</span>
                        <span>₹5,00,000 (Max)</span>
                      </div>
                    </div>

                    {/* Expected Return Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Expected Annual Return (p.a., CAGR)
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <input 
                            type="number"
                            min="0"
                            max="30"
                            step="0.1"
                            value={sipRate || ''}
                            onChange={(e) => setSipRate(e.target.value === '' ? 0 : Math.min(30, Math.max(0, Number(e.target.value))))}
                            className="w-14 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Expected annual return percentage"
                          />
                          <span className="text-slate-500 font-bold text-xs">%</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="30" 
                        step="0.1" 
                        value={sipRate} 
                        onChange={(e) => setSipRate(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Expected return rate slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>0%</span>
                        <span>15%</span>
                        <span>30%</span>
                      </div>
                    </div>

                    {/* Time Horizon */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Investment Tenure (Years)
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <input 
                            type="number"
                            min="1"
                            max="40"
                            step="1"
                            value={sipYears || ''}
                            onChange={(e) => setSipYears(e.target.value === '' ? 0 : Math.min(40, Math.max(0, Number(e.target.value))))}
                            className="w-12 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Investment tenure in years"
                          />
                          <span className="text-slate-500 font-bold text-xs">Yrs</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="40" 
                        step="1" 
                        value={sipYears} 
                        onChange={(e) => setSipYears(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Investment tenure slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>1 Year</span>
                        <span>20 Years</span>
                        <span>40 Years</span>
                      </div>

                      {/* Quick Tenure Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Tenure:</span>
                        {[5, 10, 15, 20, 25, 30, 35, 40].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setSipYears(yr)}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all border ${
                              sipYears === yr
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {yr} Yrs
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Results Panel */}
                  <div className="md:col-span-5 rounded-2xl bg-gradient-to-b from-[#82C8E5]/15 to-white p-6 border border-[#82C8E5]/50 text-center space-y-4 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                      Estimated Maturity Value
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-[#0047AB] font-heading">
                      {formatINR(sipResult.maturityValue)}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Total {sipYears * 12} monthly installments of {formatINR(sipAmount)}
                    </p>

                    {/* Proportional Wealth Distribution Bar */}
                    <div className="space-y-1.5 text-left pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB] inline-block"></span>
                          Invested ({sipResult.investedPercent}%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                          Gain ({sipResult.gainPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                        <div 
                          style={{ width: `${sipResult.investedPercent}%` }} 
                          className="bg-[#0047AB] transition-all duration-300"
                          title={`Invested: ${sipResult.investedPercent}%`}
                        />
                        <div 
                          style={{ width: `${sipResult.gainPercent}%` }} 
                          className="bg-emerald-500 transition-all duration-300"
                          title={`Estimated Gain: ${sipResult.gainPercent}%`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-left">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Invested</span>
                        <span className="text-xs font-bold text-slate-800">{formatINR(sipResult.totalInvested)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Estimated Gain</span>
                        <span className="text-xs font-bold text-emerald-700">+{formatINR(sipResult.wealthGained)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInquirePlan('sip')}
                      className="w-full btn-pill py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md touch-target flex items-center justify-center gap-2"
                    >
                      <Icon name="message-circle" className="w-4 h-4"></Icon>
                      <span>Enquire This Plan on WhatsApp</span>
                    </button>

                    <a
                      href={SIP_ACCOUNT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/sip flex w-full items-center justify-center gap-2 rounded-full border border-[#0047AB]/25 bg-white px-4 py-3 text-center text-xs font-bold text-[#0047AB] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0047AB] hover:bg-sky-50 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0047AB]"
                      aria-label="Create an NJ Wealth SIP account with Smita Desai's partner reference 28795 (opens in a new tab)"
                    >
                      <Icon name="user-round-plus" className="h-4 w-4" aria-hidden="true"></Icon>
                      <span>Create SIP Account · Partner #28795</span>
                      <Icon name="arrow-up-right" className="h-3.5 w-3.5 transition-transform duration-300 group-hover/sip:-translate-y-0.5 group-hover/sip:translate-x-0.5" aria-hidden="true"></Icon>
                    </a>

                    <p className="text-[10px] text-slate-400 italic text-center pt-1 leading-tight">
                      *The annual return is converted to an equivalent monthly rate, with each SIP invested at the start of the month. Returns are estimates, not guaranteed; mutual funds are subject to market risks.
                    </p>
                  </div>

                </div>
              </div>
            ) : (
              <div key="emi" className="max-w-4xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-white/95 shadow-2xl animate-tab-content">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  
                  <div className="md:col-span-7 space-y-6">

                    {/* Loan Category Presets */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Popular Loan Presets
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: '🏠 Home (8.5% • 20Y)', amt: 3000000, rate: 8.5, yrs: 20 },
                          { label: '🚗 Car (9.0% • 5Y)', amt: 800000, rate: 9.0, yrs: 5 },
                          { label: '💼 Business (11.5% • 5Y)', amt: 1500000, rate: 11.5, yrs: 5 },
                          { label: '👤 Personal (12% • 3Y)', amt: 500000, rate: 12.0, yrs: 3 },
                          { label: '🏢 Mortgage (9.5% • 15Y)', amt: 2500000, rate: 9.5, yrs: 15 }
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => {
                              setEmiAmount(preset.amt);
                              setEmiRate(preset.rate);
                              setEmiYears(preset.yrs);
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                              emiAmount === preset.amt && emiRate === preset.rate && emiYears === preset.yrs
                                ? 'bg-[#0047AB] text-white border-[#0047AB] shadow-xs'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Loan Amount */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Loan Amount (Principal ₹)
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <span className="text-slate-500 font-bold text-xs">₹</span>
                          <input 
                            type="number"
                            min="25000"
                            max="50000000"
                            step="25000"
                            value={emiAmount || ''}
                            onChange={(e) => setEmiAmount(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            className="w-28 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Loan amount in Rupees"
                          />
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="100000" 
                        max="20000000" 
                        step="50000" 
                        value={emiAmount} 
                        onChange={(e) => setEmiAmount(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Loan amount slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>₹1 Lakh</span>
                        <span>₹1 Crore (Midpoint)</span>
                        <span>₹2 Crore</span>
                      </div>

                      {/* Quick Amount Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Quick:</span>
                        {[500000, 1000000, 2500000, 5000000, 10000000].map((amt) => (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => setEmiAmount(amt)}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all border ${
                              emiAmount === amt
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {amt >= 10000000 ? `₹${amt / 10000000} Cr` : `₹${amt / 100000} Lakh`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Annual Interest Rate (% p.a.)
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <input 
                            type="number"
                            min="1"
                            max="30"
                            step="0.05"
                            value={emiRate || ''}
                            onChange={(e) => setEmiRate(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            className="w-14 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Annual interest rate percentage"
                          />
                          <span className="text-slate-500 font-bold text-xs">%</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="6" 
                        max="18" 
                        step="0.25" 
                        value={emiRate} 
                        onChange={(e) => setEmiRate(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Interest rate slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>6% (Lowest ROI)</span>
                        <span>12% (Midpoint)</span>
                        <span>18% (Unsecured Max)</span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          Loan Tenure (Years)
                        </label>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-300 focus-within:border-[#0047AB] focus-within:ring-2 focus-within:ring-[#0047AB]/20 transition-all shadow-2xs">
                          <input 
                            type="number"
                            min="1"
                            max="35"
                            step="1"
                            value={emiYears || ''}
                            onChange={(e) => setEmiYears(e.target.value === '' ? 0 : Math.max(0, Number(e.target.value)))}
                            className="w-12 font-bold text-slate-900 text-sm bg-transparent outline-none text-right"
                            aria-label="Loan tenure in years"
                          />
                          <span className="text-slate-500 font-bold text-xs">Yrs</span>
                        </div>
                      </div>
                      <input 
                        type="range" 
                        min="1" 
                        max="30" 
                        step="1" 
                        value={emiYears} 
                        onChange={(e) => setEmiYears(Number(e.target.value))}
                        className="w-full cursor-pointer"
                        aria-label="Loan tenure slider"
                      />
                      <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-semibold">
                        <span>1 Year</span>
                        <span>15 Years</span>
                        <span>30 Years</span>
                      </div>

                      {/* Quick Tenure Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Tenure:</span>
                        {[3, 5, 10, 15, 20].map((yr) => (
                          <button
                            key={yr}
                            type="button"
                            onClick={() => setEmiYears(yr)}
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold transition-all border ${
                              emiYears === yr
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {yr} Yrs
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Results Panel */}
                  <div className="md:col-span-5 rounded-2xl bg-gradient-to-b from-blue-50/60 to-white p-6 border border-blue-200/90 text-center space-y-4 shadow-sm">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block">
                      Estimated Monthly EMI
                    </span>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                      {formatINR(emiResult.monthlyEmi)}
                      <span className="text-sm font-semibold text-slate-500 block sm:inline sm:ml-1">/ month</span>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium">
                      {formatINR(emiResult.monthlyEmi)} × {emiYears * 12} Mos = {formatINR(emiResult.totalPayment)}
                    </p>

                    {/* Proportional Loan Distribution Bar */}
                    <div className="space-y-1.5 text-left pt-1">
                      <div className="flex justify-between text-[11px] font-bold text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#0047AB] inline-block"></span>
                          Principal ({emiResult.principalPercent}%)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span>
                          Interest ({emiResult.interestPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden flex shadow-inner">
                        <div 
                          style={{ width: `${emiResult.principalPercent}%` }} 
                          className="bg-[#0047AB] transition-all duration-300"
                          title={`Principal: ${emiResult.principalPercent}%`}
                        />
                        <div 
                          style={{ width: `${emiResult.interestPercent}%` }} 
                          className="bg-slate-500 transition-all duration-300"
                          title={`Interest: ${emiResult.interestPercent}%`}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-left">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Principal Loan</span>
                        <span className="text-xs font-bold text-slate-800">{formatINR(emiAmount)}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Interest</span>
                        <span className="text-xs font-bold text-[#0047AB]">{formatINR(emiResult.totalInterest)}</span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-600">Total Amount Payable</span>
                      <span className="text-sm font-black text-slate-900">{formatINR(emiResult.totalPayment)}</span>
                    </div>

                    <button
                      onClick={() => handleInquirePlan('emi')}
                      className="w-full btn-pill py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md touch-target flex items-center justify-center gap-2"
                    >
                      <Icon name="message-circle" className="w-4 h-4"></Icon>
                      <span>Check Loan Eligibility on WhatsApp</span>
                    </button>

                    <p className="text-[10px] text-slate-400 italic text-center pt-1 leading-tight">
                      *Calculated using standard RBI/bank reducing-balance formula. Exact monthly installments, ROI and processing charges depend on bank underwriting.
                    </p>
                  </div>

                </div>
              </div>
            )}

          </div>
        </section>

        {/* 4. ABOUT US, VISION & MISSION */}
        <section id="about" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden glass-card border border-white/95 shadow-glass p-4 sm:p-5 relative group">
                <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-sky-100/70 px-5 py-8 text-center shadow-sm">
                  <img
                    src="assets/sfcs_logo_emblem.png"
                    alt="Smita's Financial Consultancy Services logo"
                    className="mx-auto h-36 w-36 object-contain drop-shadow-sm"
                  />
                  <div className="mt-3">
                    <p className="text-2xl font-black tracking-tight text-slate-900">Smita's <span className="text-[#0047AB]">Financial</span></p>
                    <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-500">Consultancy Services · Sangli</p>
                    <p className="mt-3 text-sm font-semibold italic text-[#0047AB]">Your Trust, Our Commitment.</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-5 gap-1.5" aria-label="Financial service areas">
                  {[
                    { icon: 'users', label: 'Wealth', tone: 'text-blue-700 bg-blue-50' },
                    { icon: 'trending-up', label: 'Invest', tone: 'text-sky-700 bg-sky-50' },
                    { icon: 'shield', label: 'Insurance', tone: 'text-emerald-700 bg-emerald-50' },
                    { icon: 'briefcase', label: 'Loans', tone: 'text-indigo-700 bg-indigo-50' },
                    { icon: 'sprout', label: 'Growth', tone: 'text-teal-700 bg-teal-50' },
                  ].map((item) => (
                    <div key={item.label} className={`flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 ${item.tone}`}>
                      <Icon name={item.icon} className="h-4 w-4" aria-hidden="true"></Icon>
                      <span className="text-[9px] font-extrabold uppercase tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 text-center">
                  <div className="text-xs text-slate-500 font-medium">
                    Financial planning, protection, investments &amp; loans
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0047AB]">Institutional Governance</span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading mt-1">
                  Built on Trust. Driven by Commitment.
                </h2>
              </div>

              {/* Tab selector */}
              <div className="flex gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setActiveAboutTab('about')}
                  className={`btn-pill px-5 py-2 text-xs font-bold transition-all ${
                    activeAboutTab === 'about' ? 'btn-pill-cobalt shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  About Us
                </button>
                <button
                  onClick={() => setActiveAboutTab('vision')}
                  className={`btn-pill px-5 py-2 text-xs font-bold transition-all ${
                    activeAboutTab === 'vision' ? 'btn-pill-cobalt shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Our Vision
                </button>
                <button
                  onClick={() => setActiveAboutTab('mission')}
                  className={`btn-pill px-5 py-2 text-xs font-bold transition-all ${
                    activeAboutTab === 'mission' ? 'btn-pill-cobalt shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Our Mission
                </button>
              </div>

              <div key={activeAboutTab} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xl animate-tab-content">
                {activeAboutTab === 'about' && (
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <div className="flex items-center gap-2 text-[#0047AB] font-bold text-sm">
                      <Icon name="building-2" className="w-4 h-4"></Icon>
                      <span>About Smita's Financial Consultancy Services</span>
                    </div>
                    <p>
                      Smita's Financial Consultancy Services is a trusted financial consultancy based in Sangli, Maharashtra, providing personalized financial solutions to individuals, professionals, and businesses. With 8+ years of experience in the financial services sector, we focus on understanding our clients' financial needs and helping them choose suitable solutions with transparency and professional guidance.
                    </p>
                    <p>
                      Our aim is to provide simple, transparent, and customer-focused financial assistance while building long-term relationships based on trust.
                    </p>
                    <div className="p-3.5 rounded-2xl bg-[#82C8E5]/15 border border-[#82C8E5]/50 text-[#000080] font-serif-italic text-sm">
                      “Your Trust, Our Commitment.”
                    </div>
                  </div>
                )}

                {activeAboutTab === 'vision' && (
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <div className="flex items-center gap-2 text-[#0047AB] font-bold text-sm">
                      <Icon name="compass" className="w-4 h-4"></Icon>
                      <span>Our Strategic Vision</span>
                    </div>
                    <p>
                      At Smita's Financial Consultancy Services, our vision is to become a trusted and reliable financial consultancy partner for individuals, professionals, and businesses.
                    </p>
                    <p>
                      We aim to empower our clients with right financial guidance, suitable financial solutions, and transparent services that help them achieve their personal and business goals.
                    </p>
                    <p>
                      We are committed to delivering professional guidance, suitable financial products, and excellent customer service while building long-term relationships based on trust, integrity, and commitment.
                    </p>
                  </div>
                )}

                {activeAboutTab === 'mission' && (
                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    <div className="flex items-center gap-2 text-[#0047AB] font-bold text-sm">
                      <Icon name="target" className="w-4 h-4"></Icon>
                      <span>Our Operational Mission</span>
                    </div>
                    <p>
                      At Smita's Financial Consultancy Services, our mission is to provide trusted, transparent, and personalized financial solutions that help individuals, families, and businesses achieve their financial goals and build a secure future.
                    </p>
                    <p>
                      We are committed to delivering professional guidance, suitable financial products, and excellent customer service while building long-term relationships based on trust, integrity, and commitment.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </section>

        {/* 5. AUTHENTIC SCHEME CATALOGUES & FLYERS (Dedicated Section for Verified Product Flyers) */}
        <section id="schemes" className="py-16 bg-white/50 backdrop-blur-md border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#82C8E5]/20 border border-[#82C8E5]/60 text-[#000080] text-xs font-bold uppercase tracking-wider mb-3">
                <Icon name="file-text" className="w-3.5 h-3.5 text-[#0047AB]"></Icon>
                <span>Official Scheme Catalogues & Verified Flyers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                Authentic Scheme Catalogues & Flyers
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-2">
                Explore our loan, insurance, investment and career flyers across four collections.
              </p>
            </div>

            <div className="space-y-0" aria-label="Scheme flyer collections">
              {FLYER_SECTIONS.map((category, sectionIndex) => {
                const categoryItems = schemeFlyers.filter((item, flyerIndex) => flyerIndex % FLYER_SECTIONS.length === sectionIndex);
                const categoryLength = categoryItems.length;
                const categoryOffset = schemeSlideOffsets[category.tag] || 0;
                const activeIndex = categoryLength
                  ? (schemeSlideIndex + categoryOffset) % categoryLength
                  : 0;

                return (
                  <SchemeFlyerCarousel
                    key={category.tag}
                    category={category}
                    items={categoryItems}
                    activeIndex={activeIndex}
                    onManualIndexChange={index => setSchemeSlideOffsets(offsets => ({
                      ...offsets,
                      [category.tag]: categoryLength
                        ? (index - (schemeSlideIndex % categoryLength) + categoryLength) % categoryLength
                        : 0
                    }))}
                    onOpen={item => setLightboxData({ open: true, src: item.src, caption: item.caption })}
                  />
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. AWARDS, HONORS & PHOTO GALLERY (Dedicated Section with Stage Felicitations & Certifications) */}
        <section id="gallery" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0047AB]/10 border border-[#0047AB]/25 text-[#0047AB] text-xs font-bold uppercase tracking-wider mb-3">
              <Icon name="award" className="w-3.5 h-3.5 text-[#0047AB]"></Icon>
              <span>Honors, Credentials & Visiting Cards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
              Professional Highlights & Visiting Cards
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-2xl mx-auto">
              Explore industry awards, official partner accreditations, and the visiting cards for our consultancy and loan services.
            </p>

            {/* Gallery Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {[
                { id: 'all', label: 'All Highlights' },
                { id: 'awards', label: 'Awards & Honors (3)' },
                { id: 'certifications', label: 'Certifications (2)' },
                { id: 'visiting-cards', label: 'Visiting Cards (2)' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGalleryTab(tab.id)}
                  className={`btn-pill px-5 py-2 text-xs font-bold transition-all ${
                    activeGalleryTab === tab.id ? 'btn-pill-cobalt shadow-sm' : 'btn-pill-outline text-slate-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Gallery Grid - 2 columns for maximum clarity & impact */}
          <div key={activeGalleryTab} className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 animate-tab-content">
            {filteredPhotoGallery.map((item) => (
              <div 
                key={item.id}
                className="glass-card rounded-3xl p-6 sm:p-7 border border-white/95 shadow-xl hover:shadow-2xl transition-all flex flex-col justify-between group"
              >
                {/* Photo Image Container - Display full image without cropping */}
                <div 
                  onClick={() => setLightboxData({ open: true, src: item.src, caption: item.caption })}
                  className={`w-full ${item.category === 'visiting-cards' ? 'aspect-[16/9]' : 'aspect-[4/3]'} rounded-2xl overflow-hidden relative bg-slate-50 border border-slate-200/90 shadow-md group-hover:border-[#0047AB]/60 transition-colors cursor-pointer flex items-center justify-center p-2`}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Floating Metric Badge */}
                  <div className="absolute top-3.5 left-3.5 hidden px-3.5 py-1.5 rounded-full bg-[#000080]/90 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider shadow-md border border-white/20 sm:block">
                    {item.badgeMetric}
                  </div>
                  {/* Floating Tag */}
                  <div className="absolute top-3.5 right-3.5 hidden px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#000080] text-[11px] font-black uppercase tracking-wider shadow-xs border border-white/70 sm:block">
                    {item.tag}
                  </div>
                  {/* Smooth Zoom Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="btn-pill px-5 py-2.5 bg-white text-[#000080] font-black text-xs shadow-xl flex items-center gap-2 transform group-hover:scale-105 transition-transform">
                      <Icon name="zoom-in" className="w-4 h-4 text-[#0047AB]"></Icon>
                      <span>Inspect Photo</span>
                    </span>
                  </div>
                </div>

                {/* Details & Highlights */}
                <div className="pt-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-[#0047AB] transition-colors font-heading leading-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 font-medium">{item.subtitle}</p>

                    {/* Bullet Highlights */}
                    {item.highlights && item.highlights.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                        {item.highlights.map((bullet, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                            <Icon name="check-circle-2" className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5"></Icon>
                            <span className="leading-relaxed">{bullet}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxData({ open: true, src: item.src, caption: item.caption });
                      }}
                      className="flex-1 py-3 px-4 rounded-full bg-slate-100 hover:bg-[#0047AB] hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md"
                    >
                      <Icon name="zoom-in" className="w-4 h-4"></Icon>
                      <span>Enlarge Photo</span>
                    </button>
                    <a
                      href={`https://wa.me/917057132237?text=${encodeURIComponent(`Hello Smita Desai, congratulations on "${item.title}". I would like to connect for financial consultancy.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="py-3 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md"
                      title="Connect on WhatsApp"
                    >
                      <Icon name="message-circle" className="w-4 h-4"></Icon>
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* 6. SMART WHATSAPP ENQUIRY FORM */}
        <section id="enquiry-section" className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            <div className="lg:col-span-5 space-y-6">
              
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
                  Fast Track Connection
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 font-heading">
                  Ready to Secure Your Financial Future?
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2">
                  Submit your enquiry to immediately route your requirements to Smita Desai on WhatsApp with zero waiting time.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-[#82C8E5]/25 text-[#0047AB] flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="check" className="w-4 h-4"></Icon>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Objective & Transparent Advice</h4>
                    <p className="text-xs text-slate-500 mt-0.5">We don’t push one product. We compare market options to find the best fit for your budget.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="zap" className="w-4 h-4"></Icon>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Instant WhatsApp Response</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Receive immediate quotes, policy brochures, or loan eligibility checklists directly on WhatsApp.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="file-check" className="w-4 h-4"></Icon>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Complete Paperwork Assistance</h4>
                    <p className="text-xs text-slate-500 mt-0.5">From bank documentation to health claim settlements, our team guides you every step of the way.</p>
                  </div>
                </div>
              </div>

              {/* Live WhatsApp Message Preview Card */}
              <div className="rounded-2xl bg-slate-900 text-white p-5 shadow-lg border border-slate-800">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-slate-300 flex items-center gap-1.5">
                    <Icon name="message-square" className="w-3.5 h-3.5 text-emerald-400"></Icon>
                    Live WhatsApp Message Preview:
                  </span>
                  <span className="text-[10px] text-slate-500">Auto-generated</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
                  <div className="font-bold text-emerald-400 mb-1">New Financial Enquiry - Website</div>
                  <div className="text-slate-500 text-xs mb-2">─────────────────────────</div>
                  <div><span className="text-slate-400">Name:</span> {fullName || 'Your Name'}</div>
                  <div><span className="text-slate-400">Phone:</span> +91 {mobileNumber || '9876543210'}</div>
                  <div><span className="text-slate-400">Profile:</span> {clientProfile}</div>
                  <div><span className="text-slate-400">Service:</span> <span className="text-[#82C8E5] font-medium">{serviceRequired}</span></div>
                  <div className="mt-1.5"><span className="text-slate-400">Details:</span> {requirementDetails || 'Interested in understanding options and best plans.'}</div>
                  <div className="text-slate-500 text-xs mt-2 mb-1">─────────────────────────</div>
                  <div className="text-slate-400 italic text-[11px]">Please connect with me regarding this requirement.</div>
                </div>
              </div>

            </div>

            <div className="lg:col-span-7">
              <div className={`glass-panel rounded-3xl p-6 sm:p-9 border border-white/95 shadow-glass transition-all ${formHighlighted ? 'highlight-jump-light' : ''}`}>
                
                <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">Consultation Request</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Routes directly to Smita Desai: +91 70571 32237</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <Icon name="message-circle" className="w-5 h-5"></Icon>
                  </div>
                </div>

                <form onSubmit={handleSubmitEnquiry} className="space-y-4 pt-5">
                  
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Full Name <span className="text-[#0047AB]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="user" className="w-4 h-4"></Icon>
                      </div>
                      <input 
                        type="text" 
                        required 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Kulkarni" 
                        className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-slate-900 placeholder-slate-400 text-sm font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      10-Digit Mobile / WhatsApp Number <span className="text-[#0047AB]">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Icon name="phone" className="w-4 h-4"></Icon>
                      </div>
                      <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none text-slate-500 text-sm font-bold">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        required 
                        maxLength="10"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="70571 32237" 
                        className="w-full pl-20 pr-4 py-3 rounded-xl glass-input text-slate-900 placeholder-slate-400 text-sm font-medium"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      We will send quotes and details directly to this WhatsApp number.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Client Profile <span className="text-[#0047AB]">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {['Individual / Salaried', 'Doctor / CA / Prof.', 'Business Owner'].map((prof) => (
                        <button
                          key={prof}
                          type="button"
                          onClick={() => setClientProfile(prof)}
                          className={`btn-pill py-2.5 px-3 text-xs font-bold transition-all border ${
                            clientProfile === prof
                              ? 'btn-pill-cobalt shadow-xs'
                              : 'glass-card text-slate-700 hover:text-[#0047AB]'
                          }`}
                        >
                          {prof}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Service Interested In <span className="text-[#0047AB]">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        value={serviceRequired}
                        onChange={(e) => setServiceRequired(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl glass-input text-slate-900 text-sm font-medium"
                      >
                        <option value="General Financial Consultation">General Financial Consultation</option>
                        <option value="Life Insurance">1. Life Insurance (Term Plan, Endowment, Pension)</option>
                        <option value="Health Insurance">2. Health Insurance (Family Mediclaim, Critical Illness)</option>
                        <option value="Mutual Funds & SIP / SWP">3. Mutual Funds & SIP / SWP (Top-Up SIP, SWP Cashflow, Wealth)</option>
                        <option value="Vehicle / Motor Insurance">4. Vehicle / Motor Insurance (2-Wheeler, Car, Commercial)</option>
                        <option value="Home Loan">5. Home Loan (Purchase, Construction, Balance Transfer)</option>
                        <option value="Business Loans (Secured / Unsecured)">6. Business Loans (Secured / Unsecured Up to ₹5 Cr)</option>
                        <option value="Professional Loans (Doctors / CA)">7. Professional Loans (Doctors / CA / Architects)</option>
                        <option value="Personal Loans (For Salaried Individuals)">8. Personal Loans (For Salaried Needs)</option>
                        <option value="New & Used Car Loans">9. New & Used Car Loans</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Requirement Details (Optional)
                    </label>
                    <textarea 
                      rows="3"
                      value={requirementDetails}
                      onChange={(e) => setRequirementDetails(e.target.value)}
                      placeholder="Tell us more about your target investment, required loan amount, or family insurance needs..."
                      className="w-full px-4 py-3 rounded-xl glass-input text-slate-900 placeholder-slate-400 text-sm font-medium resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-pill py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all touch-target"
                  >
                    <Icon name="send" className="w-4 h-4"></Icon>
                    <span>Submit & Open WhatsApp Enquiry</span>
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    🔒 Your details are never shared with third parties. Strictly for consultancy.
                  </p>

                </form>

              </div>
            </div>

          </div>
        </section>

        {/* 7. DIGITAL PAYMENTS & BANK CREDENTIALS */}
        <section id="payment" className="py-16 bg-white/40 backdrop-blur-md border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
                Digital Payments
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                Official Payment & Bank Account Details
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Scan with any UPI app (GPay, PhonePe, Paytm, BHIM) or make direct bank transfers.
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* QR Code Card (BIGGER & CRISP) */}
              <div className="md:col-span-5 flex justify-center">
                <div className="glass-panel rounded-3xl p-6 border border-white/95 shadow-glass text-center space-y-4 max-w-sm w-full">
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0047AB] block">
                    Scan to Pay with Any UPI
                  </span>
                  
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2 flex items-center justify-center">
                    <img 
                      src="assets/upi_payment_qr.jpg" 
                      alt="Smitaa Desai UPI payment QR for smitadesai1821-3@okicici"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto max-h-[32rem] object-contain rounded-xl"
                    />
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Smitaa Desai</h4>
                    <p className="text-xs text-slate-500">Punjab National Bank 3830</p>
                  </div>

                  <button
                    onClick={copyUpiId}
                    className="w-full btn-pill py-2.5 px-3 bg-slate-100 hover:bg-[#82C8E5]/20 text-slate-800 text-xs font-bold transition-all border border-slate-200 hover:text-[#0047AB] flex items-center justify-center gap-2"
                  >
                    <Icon name="copy" className="w-3.5 h-3.5"></Icon>
                    <span>Copy UPI: smitadesai1821-3@okicici</span>
                  </button>
                </div>
              </div>

              {/* Banking Credentials */}
              <div className="md:col-span-7">
                <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-glass space-y-5">
                  <div className="flex items-center gap-2 text-[#0047AB] font-bold text-sm">
                    <Icon name="landmark" className="w-5 h-5"></Icon>
                    <span>Banking Credentials</span>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Account Holder Name:</span>
                      <span className="font-bold text-slate-900">Smita Rahul Desai</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Bank Name:</span>
                      <span className="font-bold text-slate-900">Punjab National Bank (PNB)</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Branch Location:</span>
                      <span className="font-bold text-slate-900">Sangli Branch, Maharashtra</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">UPI Handle:</span>
                      <span className="font-bold text-emerald-700 font-mono">smitadesai1821-3@okicici</span>
                    </div>
                    <div className="py-2.5 flex justify-between">
                      <span className="text-slate-500">Accepted Apps:</span>
                      <span className="font-bold text-[#0047AB]">Google Pay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://wa.me/917057132237?text=Hello%20Smita%20Desai,%20I%20have%20completed%20a%20UPI/Bank%20payment.%20Sharing%20the%20screenshot%20here."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-pill py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 shadow-xs touch-target"
                    >
                      <Icon name="receipt" className="w-4 h-4 text-emerald-600"></Icon>
                      <span>Share Payment Screenshot on WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* 8. CLIENT REVIEWS & TESTIMONIALS (Dynamic Direct Reviews + Add Review Modal) */}
        <section id="reviews" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#82C8E5]/20 border border-[#82C8E5]/60 text-[#000080] text-xs font-bold uppercase tracking-wider mb-2">
                Client Endorsements & Feedback
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-heading">
                What Our Clients Say in Sangli
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Verified reviews from individuals, doctors, and business owners across Maharashtra.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl glass-card border border-white/90 shadow-glass">
                <div className="flex text-yellow-400">
                  <Icon name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                  <Icon name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                  <Icon name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                  <Icon name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                  <Icon name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  5.0 ★ ({reviews.length} Verified Reviews)
                </span>
              </div>

              <button 
                onClick={() => setReviewModalOpen(true)}
                className="btn-pill btn-pill-cobalt px-5 py-2.5 text-xs font-bold uppercase tracking-wider shadow-md flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <Icon name="message-square-plus" className="w-4 h-4"></Icon>
                <span>+ Write a Review</span>
              </button>
            </div>
          </div>

          {/* Dynamic Grid of Reviews */}
          <div id="reviews-list" key={showAllReviews ? 'all-reviews' : 'featured-reviews'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-tab-content">
            {(showAllReviews ? reviews : reviews.slice(0, 4)).map((rev, reviewIndex) => {
              const isMyReview = myReviewIds.includes(rev.id);
              return (
                <div 
                  key={rev.id} 
                  style={{ animationDelay: `${Math.min(reviewIndex, 8) * 70}ms` }}
                  className={`glass-card rounded-3xl p-6 border shadow-xl hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between relative group transition-all duration-300 ${
                    isMyReview 
                      ? 'border-amber-300/90 bg-gradient-to-b from-amber-50/30 to-white/95 hover:border-amber-400 ring-1 ring-amber-200/50' 
                      : 'border-white/90 hover:border-[#82C8E5]'
                  }`}
                >
                  {/* Badges on top edge */}
                  <div className="absolute -top-3 right-5 flex items-center gap-1.5 z-10">
                    {isMyReview && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1 border border-amber-300">
                        <Icon name="user-check" className="w-3 h-3 text-slate-950"></Icon>
                        <span>Your Review</span>
                      </span>
                    )}
                    {rev.date === 'Just now' && !isMyReview && (
                      <span className="px-3 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-md animate-pulse">
                        Just Added
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#82C8E5]">
                        {[...Array(rev.rating || 5)].map((_, i) => (
                          <Icon key={i} name="star" className="w-4 h-4 fill-yellow-400"></Icon>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-400">{rev.date}</span>
                        {isMyReview && (
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmModal({ open: true, reviewId: rev.id, reviewName: rev.name })}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 transition-all active:scale-95 flex items-center gap-1 text-[11px] font-bold shadow-2xs hover:border-rose-300"
                            title="Remove your review from the website"
                            aria-label="Remove your review"
                          >
                            <Icon name="trash-2" className="w-3.5 h-3.5"></Icon>
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {rev.service && (
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#82C8E5]/15 border border-[#82C8E5]/50 text-[11px] font-bold text-[#000080]">
                        {rev.service}
                      </span>
                    )}

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shadow-xs shrink-0 ${
                        isMyReview 
                          ? 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black' 
                          : 'bg-gradient-to-br from-[#0047AB] to-[#000080] text-white font-bold'
                      }`}>
                        {rev.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate flex items-center gap-1.5">
                          <span>{rev.name}</span>
                          {isMyReview && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200/70 px-1.5 py-0.2 rounded-md">You</span>
                          )}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{rev.role}</p>
                      </div>
                    </div>

                    {isMyReview && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmModal({ open: true, reviewId: rev.id, reviewName: rev.name })}
                        className="sm:hidden p-2 rounded-xl text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-rose-100 transition-colors"
                        title="Remove your review"
                        aria-label="Remove your review"
                      >
                        <Icon name="trash-2" className="w-4 h-4"></Icon>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {reviews.length > 4 && (
            <div className="mt-9 flex flex-col items-center gap-2 animate-tab-content">
              <button
                type="button"
                onClick={() => setShowAllReviews((currentlyShowingAll) => !currentlyShowingAll)}
                aria-expanded={showAllReviews}
                aria-controls="reviews-list"
                className="group inline-flex items-center gap-2 rounded-full border border-[#0047AB]/20 bg-white px-6 py-3 text-sm font-bold text-[#0047AB] shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0047AB]/50 hover:bg-[#0047AB] hover:text-white hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#82C8E5]/50"
              >
                <span>{showAllReviews ? 'Show fewer reviews' : `Show all ${reviews.length} reviews`}</span>
                <Icon name="chevron-down" className={`h-4 w-4 transition-transform duration-300 ${showAllReviews ? 'rotate-180' : 'group-hover:translate-y-0.5'}`}></Icon>
              </button>
              <span className="text-xs text-slate-500" aria-live="polite">
                {showAllReviews ? `Showing all ${reviews.length} client reviews` : `Showing 4 of ${reviews.length} client reviews`}
              </span>
            </div>
          )}

        </section>

        {/* 9. LOCATION & SANGALI OFFICE SECTION */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card-light rounded-3xl p-6 sm:p-12 border border-slate-200/90 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#82C8E5]/20 text-[#000080] text-xs font-bold border border-[#82C8E5]/50">
                    <Icon name="map-pin" className="w-3.5 h-3.5 text-[#0047AB]"></Icon>
                    <span>Consultancy Headquarters</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                    Visit Our Office in Sangli
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Our office is at Sujata Apartment, in front of Mathubai Garware College, on Star Bhel Road, behind Divekar Hospital, Risala Road, Sangli. Please schedule an in-person financial review before visiting (Monday to Saturday, 10:00 AM – 7:00 PM).
                  </p>

                  <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-slate-700">
                    <div className="flex items-start gap-2.5">
                      <Icon name="building" className="w-4 h-4 text-[#0047AB] shrink-0 mt-0.5"></Icon>
                      <span><strong>Address:</strong> Sujata Apartment, in front of Mathubai Garware College, Star Bhel Road, behind Divekar Hospital, Risala Road, Sangli - 416416, Maharashtra</span>
                    </div>
                    <a href="tel:+917057132237" className="flex items-center gap-2.5 text-slate-700 hover:text-[#0047AB] transition-colors">
                      <Icon name="phone" className="w-4 h-4 text-[#0047AB] shrink-0"></Icon>
                      <span><strong>Main line · Calls & WhatsApp:</strong> +91 70571 32237</span>
                    </a>
                    <a href="tel:+917776977171" aria-label="Call alternate number +91 77769 77171. Calls only, no WhatsApp." className="flex items-start gap-2.5 text-slate-700 hover:text-[#0047AB] transition-colors">
                      <Icon name="phone-call" className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"></Icon>
                      <span><strong>Alternate · Calls only:</strong> +91 77769 77171 <span className="block pl-0.5 text-[11px] text-slate-500">Not available on WhatsApp</span></span>
                    </a>
                    <div className="flex items-center gap-2.5">
                      <Icon name="mail" className="w-4 h-4 text-[#0047AB] shrink-0"></Icon>
                      <span><strong>Email:</strong> smitadesai1821@gmail.com</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  <a
                    href="https://maps.app.goo.gl/g3sJiweKafxiKUjK6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill py-3.5 bg-[#000080] hover:bg-[#00144d] text-white text-xs font-bold border border-[#000080] shadow-md touch-target"
                  >
                    <Icon name="map" className="w-4 h-4 text-[#82C8E5]"></Icon>
                    <span>Open Location in Google Maps</span>
                  </a>

                  <a
                    href="tel:+917776977171"
                    aria-label="Call only number +91 77769 77171"
                    className="btn-pill btn-pill-cobalt py-3.5 text-xs font-bold uppercase tracking-wider shadow-sm touch-target"
                  >
                    <Icon name="phone-call" className="w-4 h-4"></Icon>
                    <span>Call only: +91 77769 77171</span>
                  </a>
                  <a
                    href="https://wa.me/917057132237?text=Hello%20Smita%20Desai,%20I%20would%20like%20to%20connect%20on%20WhatsApp."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm touch-target"
                  >
                    <Icon name="message-circle" className="w-4 h-4"></Icon>
                    <span>WhatsApp: +91 70571 32237</span>
                  </a>
                </div>

              </div>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-[#000e2b] text-slate-400 pt-16 pb-12 border-t border-[#001c54] text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
          
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-md overflow-hidden shrink-0">
                <img 
                  src="assets/sfcs_logo_emblem.png" 
                  alt="Smita's Financial Consultancy logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-white font-black text-base font-heading">Smita's Financial Consultancy Services</div>
                <div className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Sangli, Maharashtra</div>
              </div>
            </div>
            <p className="text-slate-400 text-xs max-w-md leading-relaxed">
              Personalized, transparent, and customer-focused financial consultancy. Life & Health Insurance, Mutual Funds SIP, Home, Business, Professional & Personal Loans.
            </p>
            <div className="text-[#82C8E5] font-serif-italic text-sm">
              “Your Trust, Our Commitment.”
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#hero" className="hover:text-[#82C8E5]">Home / vCard</a></li>
              <li><a href="#services" className="hover:text-[#82C8E5]">9 Core Services</a></li>
              <li><a href="#about" className="hover:text-[#82C8E5]">About & Vision</a></li>
              <li><a href="#schemes" className="hover:text-[#82C8E5]">Official Scheme Flyers</a></li>
              <li><a href="#gallery" className="hover:text-[#82C8E5]">Awards, Gallery & Visiting Cards</a></li>
              <li><a href="#calculators" className="hover:text-[#82C8E5]">SIP & Loan EMI Calculators</a></li>
              <li><a href="#payment" className="hover:text-[#82C8E5]">UPI Payment & Bank Details</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase tracking-wider text-xs">Contact Consultant</h4>
            <p className="text-slate-300 font-bold">Smita Rahul Desai</p>
            <p><a href="tel:+917057132237" className="hover:text-white">Main line · Calls & WhatsApp: +91 70571 32237</a></p>
            <p><a href="tel:+917776977171" aria-label="Call alternate number +91 77769 77171. Calls only, no WhatsApp." className="hover:text-white">Alternate · Calls only: +91 77769 77171</a></p>
            <p className="text-[11px] text-slate-500">The alternate number is not available on WhatsApp.</p>
            <p>Email: smitadesai1821@gmail.com</p>
            <p className="leading-relaxed">Sujata Apartment, in front of Mathubai Garware College, Star Bhel Road, behind Divekar Hospital, Risala Road, Sangli - 416416, Maharashtra</p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-800/80 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-2">
          <div>
            © {new Date().getFullYear()} Smita's Financial Consultancy Services. All rights reserved.
          </div>
          <div className="text-slate-400">
            AMFI Registered Mutual Fund Distributor • NJ Wealth Network Partner (#28795)
          </div>
        </div>
      </footer>

      {/* MOBILE STICKY BOTTOM DOCK (md:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-dock-light px-3 py-2">
        <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
          <a href="tel:+917776977171" aria-label="Call only number +91 77769 77171" title="Call only: +91 77769 77171" className="touch-target flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-600 hover:text-[#0047AB]">
            <Icon name="phone" className="w-5 h-5 text-[#0047AB]"></Icon>
            <span className="text-[10px] font-bold mt-1">Call</span>
          </a>
          <a href="#services" className="touch-target flex flex-col items-center justify-center p-1.5 rounded-xl text-slate-600 hover:text-[#0047AB]">
            <Icon name="grid" className="w-5 h-5 text-blue-600"></Icon>
            <span className="text-[10px] font-bold mt-1">Services</span>
          </a>
          <a href="#enquiry-section" className="touch-target flex flex-col items-center justify-center p-1.5 rounded-xl bg-emerald-600 text-white font-bold shadow-md active:scale-95 transition-transform">
            <Icon name="message-circle" className="w-5 h-5"></Icon>
            <span className="text-[10px] font-bold mt-1">Enquire</span>
          </a>
          <a 
            href="https://wa.me/917057132237?text=Hello%20Smita%20Desai,%20I%20am%20connecting%20from%20your%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="touch-target flex flex-col items-center justify-center p-1.5 rounded-xl text-emerald-600 hover:text-emerald-700"
          >
            <Icon name="message-square" className="w-5 h-5 text-emerald-600"></Icon>
            <span className="text-[10px] font-bold mt-1">WhatsApp</span>
          </a>
        </div>
      </div>

      {/* QR CODE MODAL */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-[100] modal-backdrop-light animate-modal-backdrop flex items-center justify-center p-4">
          <div className="glass-panel border border-white/95 rounded-3xl p-6 sm:p-8 max-w-sm w-full relative shadow-2xl space-y-5 text-center animate-modal-content">
            <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900" aria-label="Close">
              <Icon name="x" className="w-5 h-5"></Icon>
            </button>
            <div className="space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-white p-1.5 shadow-md mx-auto border border-slate-200/90 overflow-hidden flex items-center justify-center">
                <img 
                  src="assets/sfcs_logo_emblem.png" 
                  alt="Smita's Financial Consultancy logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-heading">Official Connect QR</h3>
              <p className="text-xs text-slate-500">Scan to open or share Smita's Financial Consultancy</p>
            </div>
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=https%3A%2F%2Fsmitasfinancialconsultancyservices.vercel.app%2F" 
                alt="Website QR Code - https://smitasfinancialconsultancyservices.vercel.app/"
                className="w-48 h-48 rounded-xl shadow-xs"
              />
              <a 
                href="https://smitasfinancialconsultancyservices.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-bold text-[#0047AB] hover:underline text-center break-all"
              >
                smitasfinancialconsultancyservices.vercel.app
              </a>
            </div>
            <div className="flex gap-2">
              <a 
                href="https://wa.me/917057132237?text=Hello%20Smita%20Desai,%20I%20scanned%20your%20QR%20code%20and%20would%20like%20to%20connect."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-pill btn-pill-cobalt py-2.5 text-xs flex items-center justify-center gap-1.5"
              >
                <Icon name="message-circle" className="w-4 h-4"></Icon> WhatsApp
              </a>
              <button onClick={() => setQrModalOpen(false)} className="btn-pill btn-pill-outline py-2.5 px-4 text-xs">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR SCHEME FLYERS & CERTIFICATES */}
      {lightboxData.open && (
        <div className="fixed inset-0 z-[100] modal-backdrop-light flex items-center justify-center p-4">
          <div className="max-w-3xl w-full bg-white/95 backdrop-blur-xl border border-white/90 rounded-3xl p-5 relative shadow-2xl flex flex-col items-center max-h-[92vh] animate-modal-content">
            <button onClick={() => setLightboxData({ open: false, src: '', caption: '' })} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 z-10" aria-label="Close">
              <Icon name="x" className="w-5 h-5"></Icon>
            </button>
            <div className="w-full flex-1 overflow-auto rounded-2xl bg-slate-50/80 p-3 flex items-center justify-center min-h-[300px]">
              <img src={lightboxData.src} alt={lightboxData.caption || 'Scheme flyer'} className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-xs" />
            </div>
            {lightboxData.caption && <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-800 text-center sm:text-left">{lightboxData.caption}</span>
              <a 
                href={`https://wa.me/917057132237?text=${encodeURIComponent(`Hello Smita Desai, I saw the flyer for "${lightboxData.caption}" and would like to get more information.`)}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-pill px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0 shadow-xs"
              >
                <Icon name="message-circle" className="w-3.5 h-3.5"></Icon>
                <span>Enquire on WhatsApp</span>
              </a>
            </div>}
          </div>
        </div>
      )}

      {/* WRITE A CLIENT REVIEW MODAL (Glassmorphic) */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-[100] modal-backdrop-light flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xl space-y-5 my-8 animate-modal-content">
            
            {/* Close Button */}
            <button 
              onClick={() => setReviewModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Close modal"
            >
              <Icon name="x" className="w-5 h-5"></Icon>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#82C8E5]/20 text-[#000080] text-xs font-bold border border-[#82C8E5]/50 mb-2">
                <Icon name="star" className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"></Icon>
                <span>Direct Client Review</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                Share Your Experience
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your feedback will be saved in this browser to guide other families and businesses in Sangli.
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Interactive Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 text-yellow-400 hover:scale-125 transition-transform focus:outline-none"
                    >
                      <Icon 
                        name="star" 
                        className={`w-7 h-7 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                      ></Icon>
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#000080] ml-2 bg-[#82C8E5]/20 px-2.5 py-1 rounded-lg border border-[#82C8E5]/50">
                    {reviewRating === 5 ? '5.0 ★ Excellent' : `${reviewRating}.0 ★ Rated`}
                  </span>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Full Name *
                </label>
                <input 
                  type="text" 
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Ramesh Kulkarni"
                  required
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-slate-900 outline-none"
                />
              </div>

              {/* Profession / Location */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  City / Profession (Optional)
                </label>
                <input 
                  type="text" 
                  value={reviewRole}
                  onChange={(e) => setReviewRole(e.target.value)}
                  placeholder="e.g. Business Owner, Sangli or Salaried, Miraj"
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-slate-900 outline-none"
                />
              </div>

              {/* Service Consulted */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Service Used
                </label>
                <select 
                  value={reviewService}
                  onChange={(e) => setReviewService(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-slate-900 outline-none"
                >
                  <option value="Mutual Funds & SIP / SWP">Mutual Funds & SIP / SWP</option>
                  <option value="Health Insurance">Health Insurance</option>
                  <option value="Life Insurance">Life Insurance</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Business Loans (Secured / Unsecured)">Business Loans (Secured / Unsecured)</option>
                  <option value="Professional Loans (Doctors / CA)">Professional Loans (Doctors / CA)</option>
                  <option value="Personal Loans">Personal Loans (Salaried)</option>
                  <option value="New & Used Car Loans">New & Used Car Loans</option>
                  <option value="Vehicle / Motor Insurance">Vehicle / Motor Insurance</option>
                  <option value="General Financial Consultation">General Financial Consultation</option>
                </select>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Your Review / Experience *
                </label>
                <textarea 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="3"
                  placeholder="Tell us about the financial advice, loan process, insurance selection, or returns you experienced with Smita Desai..."
                  required
                  className="w-full glass-input px-4 py-3 rounded-2xl text-sm text-slate-900 outline-none resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  onClick={handleReviewSubmit}
                  className="w-full sm:flex-1 btn-pill btn-pill-cobalt py-3.5 text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  <Icon name="check-circle-2" className="w-4 h-4"></Icon>
                  <span>Publish Review Directly</span>
                </button>
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE REVIEW CONFIRMATION MODAL */}
      {deleteConfirmModal.open && (
        <div className="fixed inset-0 z-[110] modal-backdrop-light flex items-center justify-center p-4">
          <div className="relative w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7 border border-white/95 shadow-2xl space-y-4 animate-modal-content">
            
            <button
              type="button"
              onClick={() => setDeleteConfirmModal({ open: false, reviewId: null, reviewName: '' })}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              aria-label="Close"
            >
              <Icon name="x" className="w-4 h-4"></Icon>
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Icon name="trash-2" className="w-6 h-6"></Icon>
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 font-heading">
                Remove Your Review?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to remove your published review as <strong className="text-slate-900 font-semibold">{deleteConfirmModal.reviewName}</strong>? It will be deleted from Smita's Financial Consultancy website immediately.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDeleteReview(deleteConfirmModal.reviewId)}
                className="w-full sm:flex-1 py-3 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Icon name="trash-2" className="w-4 h-4"></Icon>
                <span>Yes, Remove Review</span>
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmModal({ open: false, reviewId: null, reviewName: '' })}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel / Keep
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON (BOTTOM-RIGHT WITH PRETEXT) */}
      <aside aria-label="WhatsApp quick chat" className="hidden md:block fixed bottom-20 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-40">
        <a
          href="https://wa.me/917057132237?text=Hello%20Smita%20Desai%2C%20I%20visited%20your%20website%20and%20would%20like%20to%20get%20a%20personalized%20consultation%20regarding%20your%20financial%20services."
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with Smita Desai on WhatsApp"
          className="flex items-center gap-2.5 p-3.5 sm:px-4 sm:py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-2xl hover:shadow-[0_10px_25px_-5px_rgba(37,211,102,0.6)] border-2 border-white transform hover:scale-105 active:scale-95 transition-all duration-300 group"
          title="Direct WhatsApp Consultation with Smita Desai"
        >
          <div className="relative flex items-center justify-center">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100"></span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-xs font-black tracking-wide font-heading">
            Chat on WhatsApp
          </span>
        </a>
      </aside>

    </div>
  );
}
