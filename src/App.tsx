/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Car, Review } from './types';
import { INITIAL_CARS, INITIAL_REVIEWS } from './data';
import CarCard from './components/CarCard';
import CarDetailModal from './components/CarDetailModal';
import AdminPanel from './components/AdminPanel';
import ReviewList from './components/ReviewList';
import { 
  ShieldCheck, Phone, Mail, Award, Landmark, Sparkles, 
  Search, SlidersHorizontal, MapPin, Clock, Check, ChevronRight, MessageSquare 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Core application States
  const [cars, setCars] = useState<Car[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Navigation State: 'vitrin' | 'reviews' | 'about' | 'admin'
  const [activeNav, setActiveNav] = useState<'vitrin' | 'reviews' | 'about' | 'admin'>('vitrin');
  
  // Detailed modal view
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedFuel, setSelectedFuel] = useState('all');
  const [selectedBody, setSelectedBody] = useState('all');
  const [maxPrice, setMaxPrice] = useState(20000000);
  const [hideSold, setHideSold] = useState(false);

  // Initialize data from localStorage or default seed data
  useEffect(() => {
    const localCars = localStorage.getItem('kartal_motors_cars');
    const localReviews = localStorage.getItem('kartal_motors_reviews');

    if (localCars) {
      setCars(JSON.parse(localCars));
    } else {
      setCars(INITIAL_CARS);
      localStorage.setItem('kartal_motors_cars', JSON.stringify(INITIAL_CARS));
    }

    if (localReviews) {
      setReviews(JSON.parse(localReviews));
    } else {
      setReviews(INITIAL_REVIEWS);
      localStorage.setItem('kartal_motors_reviews', JSON.stringify(INITIAL_REVIEWS));
    }
  }, []);

  // Sync state to local storage when changed
  const saveCarsToLocal = (updatedCars: Car[]) => {
    setCars(updatedCars);
    localStorage.setItem('kartal_motors_cars', JSON.stringify(updatedCars));
  };

  const saveReviewsToLocal = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
    localStorage.setItem('kartal_motors_reviews', JSON.stringify(updatedReviews));
  };

  // --- Handlers for Admin actions ---
  const handleAddCar = (newCar: Car) => {
    const updated = [newCar, ...cars];
    saveCarsToLocal(updated);
  };

  const handleUpdateCar = (updatedCar: Car) => {
    const updated = cars.map((c) => (c.id === updatedCar.id ? updatedCar : c));
    saveCarsToLocal(updated);
    if (selectedCar && selectedCar.id === updatedCar.id) {
      setSelectedCar(updatedCar);
    }
  };

  const handleUpdateCarStatus = (carId: string, status: 'active' | 'sold') => {
    const updated = cars.map((c) => (c.id === carId ? { ...c, status } : c));
    saveCarsToLocal(updated);
    // Update active modal reference if open
    if (selectedCar && selectedCar.id === carId) {
      setSelectedCar({ ...selectedCar, status });
    }
  };

  const handleDeleteCar = (carId: string) => {
    const updated = cars.filter((c) => c.id !== carId);
    saveCarsToLocal(updated);
    if (selectedCar && selectedCar.id === carId) {
      setSelectedCar(null);
    }
    // Delete any reviews connected with this car
    const cleanedReviews = reviews.filter((r) => r.carId !== carId);
    saveReviewsToLocal(cleanedReviews);
  };

  const handleAddAdminReply = (reviewId: string, replyText: string) => {
    const updated = reviews.map((r) => r.id === reviewId ? { ...r, adminReply: replyText || undefined } : r);
    saveReviewsToLocal(updated);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updated = reviews.filter((r) => r.id !== reviewId);
    saveReviewsToLocal(updated);
  };

  // --- Handlers for Customer actions ---
  const handleAddNewReview = (carId: string, reviewData: { userName: string; email: string; rating: number; comment: string }) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      carId,
      userName: reviewData.userName,
      email: reviewData.email,
      rating: reviewData.rating,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };
    const updated = [newReview, ...reviews];
    saveReviewsToLocal(updated);
  };

  // --- Filtering logic ---
  const filteredCars = cars.filter((car) => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'all' || car.brand === selectedBrand;
    const matchesFuel = selectedFuel === 'all' || car.fuel === selectedFuel;
    const matchesBody = selectedBody === 'all' || car.bodyType === selectedBody;
    const matchesPrice = car.price <= maxPrice;
    const matchesStatus = !hideSold || car.status === 'active';

    return matchesSearch && matchesBrand && matchesFuel && matchesBody && matchesPrice && matchesStatus;
  });

  // Extract unique brands for filtering list dynamically
  const uniqueBrands = Array.from(new Set(cars.map((c) => c.brand)));

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans select-none text-slate-100">
      
      {/* Top Elite Indicator Info Utility Bar */}
      <div className="bg-slate-950 border-b border-white/[0.04] text-[11px] font-mono text-slate-400 py-2.5 px-6 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-500" /> Etiler, İstanbul</span>
            <span className="flex items-center gap-1.5"><Clock size={12} className="text-rose-500" /> Hafta İçi: 09:00 - 19:00</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"><Phone size={12} className="text-rose-500" /> +90 (212) 555 1907</span>
            <span className="text-white/25">|</span>
            <a href="https://wa.me/905380705210" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-350 transition-colors font-bold"><Phone size={12} className="text-emerald-500 fill-emerald-500/20" /> Gsm / WhatsApp: 0538 070 5210</a>
            <span className="text-rose-500 font-bold font-sans">100% Ekspertiz Garantisi</span>
          </div>
        </div>
      </div>

      {/* Main Luxury Header */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-900 shadow-xs px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Logo with eagle badge style */}
          <div 
            onClick={() => setActiveNav('vitrin')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative h-10 w-10 bg-slate-900 rounded-xl flex items-center justify-center border border-rose-500/20 shadow-md transform group-hover:rotate-6 transition-all duration-300">
              {/* Abstract wing logo */}
              <span className="font-sans font-black text-lg text-rose-500 tracking-tight">K</span>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-rose-500 border-2 border-slate-950" />
            </div>
            <div>
              <h1 className="font-sans text-xl font-black tracking-tighter text-white block">
                KARTAL <span className="text-rose-550 font-semibold text-lg text-rose-500">MOTORS</span>
              </h1>
              <p className="text-[9px] font-mono uppercase tracking-widest text-slate-400 leading-none">Automotive Gallery</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => setActiveNav('vitrin')}
              className={`cursor-pointer text-xs uppercase font-bold tracking-widest transition-colors ${
                activeNav === 'vitrin' ? 'text-rose-500 border-b-2 border-rose-500 pb-1' : 'text-slate-400 hover:text-white'
              }`}
            >
              Vitrin
            </button>
            <button
              onClick={() => setActiveNav('reviews')}
              className={`cursor-pointer text-xs uppercase font-bold tracking-widest transition-colors ${
                activeNav === 'reviews' ? 'text-rose-500 border-b-2 border-rose-500 pb-1' : 'text-slate-400 hover:text-white'
              }`}
            >
              Müşteri Görüşleri
            </button>
            <button
              onClick={() => setActiveNav('about')}
              className={`cursor-pointer text-xs uppercase font-bold tracking-widest transition-colors ${
                activeNav === 'about' ? 'text-rose-500 border-b-2 border-rose-500 pb-1' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hakkımızda
            </button>
          </nav>

          {/* Direct Actions: Call Now & Administrator trigger */}
          <div className="flex items-center gap-2.5">
            <button
              id="admin-nav-toggle"
              onClick={() => setActiveNav(activeNav === 'admin' ? 'vitrin' : 'admin')}
              className={`cursor-pointer text-xs font-bold px-4 py-2 rounded-xl border transition-all ${
                activeNav === 'admin' 
                  ? 'bg-rose-600 border-rose-600 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-850'
              }`}
            >
              {activeNav === 'admin' ? 'Kullanıcı Modu' : 'Yönetim Modu'}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Visual Area & Filter Strip (Rendered on Showcase Mode only) */}
      {activeNav === 'vitrin' && (
        <div className="relative bg-slate-950 overflow-hidden py-14 px-6">
          {/* Cover image under dark scrim */}
          <div className="absolute inset-0 z-0 bg-[url('https://instagram.fada9-2.fna.fbcdn.net/v/t51.82787-15/543759716_18073303502116197_7242795450113711265_n.jpg?stp=cp6_dst-jpg_e35_s640x640_sh2.08_tt6&_nc_cat=103&ig_cache_key=MzcxOTk6Njc4MDEyNDA4MzY2Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=xFwSG0l87jYQ7kNvwGtl51A&_nc_oc=Adp4s2XhmgrQVucMdMecILRT1ApaF4k6X5Dx7pFKCk2D2PRa67m-f4fhjl58ibSjSCM&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fada9-2.fna&_nc_gid=nXLwMk7DWm_wB07VBk-iwQ&_nc_ss=7a22e&oh=00_Af7vx76Y4aaxsk3a0dLINkLzH-SwmA1VhCJwfqQHVSwvdg&oe=6A1E6BB8')] bg-cover bg-center brightness-[0.22] saturate-75" />
          
          <div className="relative z-10 max-w-7xl mx-auto text-center md:text-left text-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Catchy headline */}
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full text-rose-500 text-[10px] font-bold uppercase tracking-widest">
                <Sparkles size={11} /> Seçkin Otomobil Deneyimi
              </div>
              <h2 className="font-sans text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
                Hayallerinizi Süsleyen <span className="text-rose-500 block md:inline">Zarif Detaylar</span>
              </h2>
              <p className="text-xs md:text-sm text-slate-305 text-slate-300 leading-relaxed max-w-lg">
                Kartal Motors, İstanbul Etiler'deki seçkin showroomunda dünyanın en prestijli markalarını, kusursuz ekpertis garantisi ve profesyonel hizmet anlayışı ile sizlerle buluşturuyor.
              </p>
              
              <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-450 text-slate-450">
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-rose-500" />
                  <span className="text-slate-300">Gerçek Ekspertiz</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-rose-500" />
                  <span className="text-slate-300">Hızlı Ruhsat Devri</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check size={14} className="text-rose-500" />
                  <span className="text-slate-300">Şeffaf Takas Olanağı</span>
                </div>
              </div>
            </div>

            {/* Quick overview metric cards */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:ml-auto">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <Landmark size={20} className="text-rose-500 mb-2" />
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Prestijli Portföy</p>
                <p className="text-base font-bold mt-1 text-white">Lüks Modeller</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <Award size={20} className="text-rose-500 mb-2" />
                <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400">Geri Bildirim</p>
                <p className="text-base font-bold mt-1 text-white">Mutlu Alıcılar</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Core Dynamic Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          
          {/* NAV VIEW 1: Vitrin (Showcase of cars) */}
          {activeNav === 'vitrin' && (
            <motion.div
              key="view-vitrin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Dynamic Filter Section */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-white">
                  <SlidersHorizontal size={16} className="text-rose-500" />
                  <h3 className="font-sans text-xs font-bold uppercase tracking-wider">Arama Filtreleri</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                  {/* Text search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-505 text-slate-500" />
                    <input
                      type="text"
                      className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-rose-500 focus:bg-slate-950"
                      placeholder="Model veya Marka Ara..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Brand Selector */}
                  <div>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-300 focus:outline-hidden focus:border-rose-500 focus:bg-slate-950"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                    >
                      <option value="all" className="bg-slate-950 text-slate-300">Tüm Markalar</option>
                      {uniqueBrands.map((brand) => (
                        <option key={brand} value={brand} className="bg-slate-950 text-slate-200">{brand}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Selector */}
                  <div>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-300 focus:outline-hidden focus:border-rose-500 focus:bg-slate-950"
                      value={selectedFuel}
                      onChange={(e) => setSelectedFuel(e.target.value)}
                    >
                      <option value="all" className="bg-slate-950 text-slate-300">Tüm Yakıt Türleri</option>
                      <option value="Benzin" className="bg-slate-950 text-slate-300">Benzin</option>
                      <option value="Dizel" className="bg-slate-950 text-slate-300">Dizel</option>
                      <option value="Elektrik" className="bg-slate-950 text-slate-300">Elektrik</option>
                      <option value="Hibrit" className="bg-slate-950 text-slate-305 text-slate-300">Hibrit</option>
                    </select>
                  </div>

                  {/* Body Selector */}
                  <div>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-slate-300 focus:outline-hidden focus:border-rose-500 focus:bg-slate-950"
                      value={selectedBody}
                      onChange={(e) => setSelectedBody(e.target.value)}
                    >
                      <option value="all" className="bg-slate-950 text-slate-300">Tüm Gövde Tipleri</option>
                      <option value="Sedan" className="bg-slate-950 text-slate-300">Sedan</option>
                      <option value="SUV" className="bg-slate-950 text-slate-300">SUV</option>
                      <option value="Coupé" className="bg-slate-950 text-slate-300">Coupé</option>
                      <option value="Cabrio" className="bg-slate-950 text-slate-305 text-slate-300">Cabrio</option>
                    </select>
                  </div>

                  {/* Hide Sold Toggler */}
                  <div className="flex items-center justify-start py-1 px-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 font-medium select-none">
                      <input
                        type="checkbox"
                        checked={hideSold}
                        onChange={() => setHideSold(!hideSold)}
                        className="rounded border-slate-805 border-slate-800 text-rose-500 focus:ring-rose-500 h-4 w-4 bg-slate-950"
                      />
                      <span>Yalnızca Satıştakiler</span>
                    </label>
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="mt-4 pt-4 border-t border-slate-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between items-center mb-1 text-xs font-mono text-slate-400 font-medium">
                      <span>Maksimum Bütçe</span>
                      <span className="text-rose-500 font-bold">{maxPrice.toLocaleString('tr-TR')} ₺</span>
                    </div>
                    <input
                      type="range"
                      min={1000000}
                      max={20000000}
                      step={250000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-500">Bulunan Sonuçlar</p>
                    <p className="text-xs font-bold text-rose-500 mt-0.5">{filteredCars.length} adet lüks araç</p>
                  </div>
                </div>
              </div>

              {/* Cars Show-grid */}
              {filteredCars.length === 0 ? (
                <div className="text-center py-24 bg-slate-900 rounded-2xl border border-slate-800">
                  <div className="h-10 w-10 mx-auto rounded-full bg-slate-950 flex items-center justify-center text-slate-500 mb-3 border border-slate-800">
                    <Search size={18} />
                  </div>
                  <h4 className="font-sans text-sm font-bold text-white">Aradığınız kriterlerde araç bulunamadı.</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                    Arama kriterlerini esneterek tekrar arama yapabilir veya showroomumuz ile doğrudan iletişime geçebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCars.map((car) => (
                    <CarCard
                      key={car.id}
                      car={car}
                      onViewDetails={(selected) => setSelectedCar(selected)}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* NAV VIEW 2: Global Reviews / Testimonials */}
          {activeNav === 'reviews' && (
            <motion.div
              key="view-reviews"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-slate-900 rounded-3xl border border-slate-800 p-6 md:p-8 shadow-sm"
            >
              <ReviewList
                reviews={reviews}
                carId="general"
                carName="Kartal Motors"
                onAddReview={(data) => handleAddNewReview('general', data)}
              />
            </motion.div>
          )}

          {/* NAV VIEW 3: About & Contact */}
          {activeNav === 'about' && (
            <motion.div
              key="view-about"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
            >
              {/* About card text */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-sans text-2xl font-black tracking-tight text-white">Hakkımızda</h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-rose-500 mt-1">Kartal Motors Tarihçesi</p>
                </div>

                <div className="space-y-4 text-sm text-slate-300 leading-relaxed font-normal">
                  <p>
                    Kartal Motors, İstanbul'un kalbi Etiler'de kurulu, otomotiv sektöründe yüksek kalibreli lüks ve premium segment araç tedariğinde uzmanlaşmış öncü bir galeridir. Kurucumuzun 6 yıllık oto tamir (mekanik) ustalığı geçmişi ile 7 yıldır sürdürdüğü galeri hizmet sektörü tecrübesi birleşerek, toplamda 13 yıllık sarsılmaz bir teknik uzmanlık ve güvence sunmaktadır.
                  </p>
                  <p>
                    Aracın sadece kaportasına değil, motorunun her bir dişlisine ve tüm mekanik detaylarına hakim olan bu 13 yıllık ustalık birikimi, sunduğumuz %100 ekspertiz garantisinin en güçlü teminatıdır. Galeri portföyümüzde yalnızca titizlikle seçilmiş, belgelendirilebilir geçmişe sahip premium araçlar yer alır.
                  </p>
                  <p>
                    Müşteri memnuniyetini satıştan sonrasına da taşıyarak, araç sahiplerimize tescil, sigortalama ve özel teslimat alanlarında butik ve kesintisiz koordinasyon destekleri sağlamaktan gurur duyuyoruz.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-center">
                  <div>
                    <h5 className="text-2xl font-sans font-black text-rose-500">13 Yıl</h5>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Ustalık & Sektör Deneyimi</p>
                  </div>
                  <div>
                    <h5 className="text-2xl font-sans font-black text-rose-500">%100</h5>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Güvenli Ekspertiz</p>
                  </div>
                  <div>
                    <h5 className="text-2xl font-sans font-black text-rose-500">1200+</h5>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mt-0.5">Mutlu Araç Sahibi</p>
                  </div>
                </div>
              </div>

              {/* Contact / Map info details card */}
              <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-sans text-2xl font-black tracking-tight text-white">Showroom İletişim</h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-rose-500 mt-1">Sizleri Kahveye Bekleriz</p>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex gap-3">
                    <MapPin size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white font-sans text-sm">Adres Bilgimiz</h4>
                      <p className="text-xs mt-1 leading-relaxed text-slate-405 text-slate-400">Etiler Mahallesi, Nispetiye Caddesi No: 90 / A Pin: 34337 Beşiktaş, İstanbul, Türkiye</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white font-sans text-sm">Doğrudan İletişim</h4>
                      <p className="text-xs mt-1 font-mono hover:text-rose-450 text-rose-400 transition-colors cursor-pointer">+90 (212) 555 1907</p>
                      <p className="text-xs font-mono text-slate-450">+90 (212) 555 1908</p>
                      <a href="https://wa.me/905380705210" target="_blank" rel="noreferrer" className="text-xs mt-1.5 font-mono text-emerald-400 hover:text-emerald-350 transition-colors flex items-center gap-1.5 font-bold">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                        Gsm & WP: 0538 070 52 10
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail size={18} className="text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white font-sans text-sm">E-posta Yazışma</h4>
                      <p className="text-xs mt-1 font-mono text-slate-300">yonetim@kartalmotors.com</p>
                      <p className="text-xs font-mono text-slate-500">destek@kartalmotors.com</p>
                    </div>
                  </div>
                </div>

                {/* Simulated stylized map container */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden relative leading-none bg-slate-950 text-white h-48 flex flex-col items-center justify-center p-6 text-center shadow-inner">
                  {/* Subtle dynamic backdrop */}
                  <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/istanbulmap/600/300')] bg-cover opacity-20 filter grayscale" />
                  <div className="relative z-10 space-y-2">
                    <MapPin size={28} className="text-rose-500 mx-auto animate-bounce" />
                    <h5 className="font-black text-sm text-white">Etiler Showroom Noktası</h5>
                    <p className="text-[10px] text-slate-405 text-slate-400">Nispetiye Metro Çıkışına 100 Metre Mesafede</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* NAV VIEW 4: Admin controls cabinet */}
          {activeNav === 'admin' && (
            <motion.div
              key="view-admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <AdminPanel
                cars={cars}
                reviews={reviews}
                onAddCar={handleAddCar}
                onUpdateCar={handleUpdateCar}
                onUpdateCarStatus={handleUpdateCarStatus}
                onDeleteCar={handleDeleteCar}
                onAddAdminReply={handleAddAdminReply}
                onDeleteReview={handleDeleteReview}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Persistent Detail modal backdrop */}
      <AnimatePresence>
        {selectedCar && (
          <CarDetailModal
            car={selectedCar}
            reviews={reviews}
            onClose={() => setSelectedCar(null)}
            onAddReview={(reviewData) => handleAddNewReview(selectedCar.id, reviewData)}
          />
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="bg-slate-950 text-white py-12 px-6 mt-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500">Kartal Motors</span>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              Otomotiv galericiliğinde yeni çağın standardı. Ekspertiz onaylı lüks araçlar, şeffaf pazarlıklar ve güler yüzlü butik hizmet ayrıcalıkları.
            </p>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500">Hızlı Bağlantılar</span>
            <ul className="text-xs text-slate-400 space-y-2.5 mt-2.5">
              <li onClick={() => { setActiveNav('vitrin'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <ChevronRight size={10} /> Akıllı Vitrin
              </li>
              <li onClick={() => { setActiveNav('reviews'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <ChevronRight size={10} /> Müşteri Yorumları
              </li>
              <li onClick={() => { setActiveNav('about'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5">
                <ChevronRight size={10} /> Showroom Konumu
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-rose-500">Aydınlatma Metni</span>
            <p className="text-[10px] text-slate-400 mt-2.5 leading-relaxed">
              © 2026 Kartal Motors S.A.T. Tüm hakları saklıdır. Bu site premium araç portföyünün simülasyonunu listeler. Paylaşılan tüm görseller, telif hakkı sahiplerine aittir.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
