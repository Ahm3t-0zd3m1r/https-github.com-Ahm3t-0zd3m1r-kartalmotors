/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car, Review } from '../types';
import ReviewList from './ReviewList';
import { 
  X, Calendar, Fuel, Milestone, Settings, Palette, Zap, Cpu, 
  Check, Phone, Mail, FileText, BadgePercent, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CarDetailModalProps {
  car: Car;
  reviews: Review[];
  onClose: () => void;
  onAddReview: (reviewData: { userName: string; email: string; rating: number; comment: string }) => void;
}

export default function CarDetailModal({ car, reviews, onClose, onAddReview }: CarDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [inquiryType, setInquiryType] = useState<'info' | 'trade' | 'price'>('info');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [tradeDetails, setTradeDetails] = useState('');
  const [isSent, setIsSent] = useState(false);
  
  // Interactive slider gallery state
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const allImages = car.images && car.images.length > 0 ? car.images : [car.imageUrl];

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' ₺';
  };

  const isSold = car.status === 'sold';

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Lütfen adınızı ve telefon numaranızı eksiksiz doldurunuz.');
      return;
    }
    // Simulate query receiving (will display success alert/banner)
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setName('');
      setPhone('');
      setTradeDetails('');
    }, 4000);
  };

  const technicalSpecs = [
    { label: 'Model Yılı', value: car.year, icon: <Calendar size={16} className="text-rose-500" /> },
    { label: 'Kilometre', value: `${car.mileage.toLocaleString('tr-TR')} km`, icon: <Milestone size={16} className="text-rose-500" /> },
    { label: 'Şanzıman', value: car.transmission, icon: <Settings size={16} className="text-rose-500" /> },
    { label: 'Yakıt Türü', value: car.fuel, icon: <Fuel size={16} className="text-rose-500" /> },
    { label: 'Gövde Tipi', value: car.bodyType, icon: <Cpu size={16} className="text-rose-500" /> },
    { label: 'Renk', value: car.color, icon: <Palette size={16} className="text-rose-500" /> },
    { label: 'Motor Gücü', value: `${car.enginePower} HP (Beygir)`, icon: <Zap size={16} className="text-rose-500" /> },
  ];

  const carReviews = reviews.filter((r) => r.carId === car.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-5xl bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border border-slate-800 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-mono tracking-widest text-rose-500">{car.brand}</span>
            <span className="text-lg font-bold tracking-tight">{car.model}</span>
            {isSold && (
              <span className="ml-2 rounded-md bg-rose-600/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider">
                SATILDI
              </span>
            )}
          </div>
          <button
            id={`btn-close-modal-${car.id}`}
            onClick={onClose}
            className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scroll Container */}
        <div className="overflow-y-auto flex-1 bg-slate-950">
          {/* Main Car Showcase Banner */}
          <div className="relative aspect-16/10 sm:aspect-21/9 w-full bg-slate-950 group">
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={allImages[activeImgIndex] || car.imageUrl}
                alt={`${car.brand} ${car.model}`}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-all duration-300"
              />
            </div>

            {/* Slider arrows (Only if multiple images exist) */}
            {allImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-950/85 border border-slate-800 text-white rounded-full p-2 hover:bg-rose-600 hover:border-rose-500 transition-all z-20 cursor-pointer shadow-lg"
                  aria-label="Önceki Resim"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-950/85 border border-slate-800 text-white rounded-full p-2 hover:bg-rose-600 hover:border-rose-500 transition-all z-20 cursor-pointer shadow-lg"
                  aria-label="Sonraki Resim"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Image Counter Indicator */}
            {allImages.length > 1 && (
              <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-800 text-[10px] font-mono font-bold text-slate-350 px-3 py-1.5 rounded-full z-20 shadow-md">
                {activeImgIndex + 1} / {allImages.length}
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-85 pointer-events-none z-10" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 text-white z-10">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-rose-500">Anahtar Teslim</p>
                <h1 className="text-2xl md:text-3xl font-black font-sans tracking-tight">
                  {formatPrice(car.price)}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-slate-900 border border-slate-800 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck size={14} className="text-rose-500" />
                  Ekspertiz Garantili
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Gallery Strip (Only if multiple images exist) */}
          {allImages.length > 1 && (
            <div className="bg-slate-950 border-b border-slate-900 px-6 py-3 flex gap-2.5 overflow-x-auto scrollbar-none scroll-smooth">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImgIndex(idx)}
                  className={`relative aspect-video w-20 rounded-lg overflow-hidden border transition active:scale-95 cursor-pointer shrink-0 ${
                    idx === activeImgIndex ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img src={img} alt="Thumbnail representation" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`cursor-pointer border-b-2 py-4 px-4 text-sm font-semibold tracking-wide transition-all ${
                activeTab === 'details'
                  ? 'border-rose-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Araç Özellikleri
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`cursor-pointer border-b-2 py-4 px-4 text-sm font-semibold tracking-wide transition-all ${
                activeTab === 'reviews'
                  ? 'border-rose-500 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              Müşteri Görüşleri ({carReviews.length})
            </button>
          </div>

          <div className="p-6 bg-slate-950">
            <AnimatePresence mode="wait">
              {activeTab === 'details' ? (
                <motion.div
                  key="details-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  duration={0.15}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                  {/* Left Column: Specs & Features */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Technical Specs Grid */}
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Teknik Detaylar</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {technicalSpecs.map((spec) => (
                          <div key={spec.label} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 shadow-2xs">
                              {spec.icon}
                            </div>
                            <div>
                              <span className="text-[10px] font-mono text-slate-400 block leading-tight">{spec.label}</span>
                              <span className="text-xs font-bold text-white leading-tight block mt-0.5">{spec.value}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expandable description card */}
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2.5">Açıklama</h4>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 border border-rose-500/10 rounded-xl p-4 italic">
                        {car.description}
                      </p>
                    </div>

                    {/* Features checklist */}
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Donanım ve Aksesuarlar</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {car.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                            <div className="h-5 w-5 rounded-full bg-emerald-950/40 border border-emerald-900/30 flex items-center justify-center text-emerald-400 shrink-0">
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Dynamic Inquiry Module */}
                  <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 sticky top-4">
                    <div className="mb-4">
                      <h4 className="text-base font-bold tracking-tight">Soru Sor & Teklif Al</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Kartal Motors danışmanları 15 dakika içinde sizinle iletişime geçecektir.
                      </p>
                    </div>

                    {/* Inquiry tab toggles */}
                    <div className="grid grid-cols-3 gap-1.5 bg-slate-950 border border-slate-850 p-1 rounded-xl mb-4 text-center">
                      <button
                        type="button"
                        onClick={() => setInquiryType('info')}
                        className={`cursor-pointer rounded-lg py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                          inquiryType === 'info' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Bilgi İste
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryType('trade')}
                        className={`cursor-pointer rounded-lg py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                          inquiryType === 'trade' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Takas Teklifi
                      </button>
                      <button
                        type="button"
                        onClick={() => setInquiryType('price')}
                        className={`cursor-pointer rounded-lg py-1.5 text-[10px] font-bold tracking-wide transition-all ${
                          inquiryType === 'price' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Nakit Teklif
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {isSent ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="flex flex-col items-center justify-center text-center py-10 bg-slate-950 border border-slate-850 rounded-xl px-4"
                        >
                          <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                            <ShieldCheck size={24} />
                          </div>
                          <p className="text-sm font-bold text-white">Talep İletildi!</p>
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            Formunuz başarıyla kaydedildi. Kartal Motors yöneticileri kayıtlı numaranızdan kısa süre içerisinde sizi arayacaktır.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleInquirySubmit} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Adınız Soyadınız</label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="Örn: Ahmet Yılmaz"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Telefon Numaranız</label>
                            <input
                              type="tel"
                              required
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="Örn: 0532 123 45 67"
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-500"
                            />
                          </div>

                          {inquiryType === 'trade' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden"
                            >
                              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Takas Edilecek Aracınızın Bilgileri</label>
                              <textarea
                                required
                                rows={2}
                                value={tradeDetails}
                                onChange={(e) => setTradeDetails(e.target.value)}
                                placeholder="Marka, Model, Yıl, Kilometre, Boya Durumu..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-500 resize-none"
                              />
                            </motion.div>
                          )}

                          {inquiryType === 'price' && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              className="overflow-hidden"
                            >
                              <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1">Nakit Fiyat Teklifiniz (₺)</label>
                              <input
                                type="text"
                                required
                                value={tradeDetails}
                                onChange={(e) => setTradeDetails(e.target.value)}
                                placeholder="Örn: 9.300.000 ₺"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-500"
                              />
                            </motion.div>
                          )}

                          <button
                            id={`btn-submit-inquiry-${car.id}`}
                            type="submit"
                            className="cursor-pointer w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm py-2.5 rounded-xl transition-all duration-200 active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.2)]"
                          >
                            <Phone size={14} />
                            Talebi İlet
                          </button>
                        </form>
                      )}
                    </AnimatePresence>

                    {/* Showroom Direct Contact Info */}
                    <div className="mt-5 border-t border-slate-800 pt-4 flex flex-col gap-2.5 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <Phone size={12} className="text-rose-500" />
                        <span>Showroom Sabit: +90 (212) 555 1907</span>
                      </div>
                      <a href="https://wa.me/905380705210" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-emerald-400 hover:text-emerald-350 transition-colors font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Satış & WP: 0538 070 52 10</span>
                      </a>
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-rose-500" />
                        <span>iletisim@kartalmotors.com</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="reviews-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  duration={0.15}
                >
                  <ReviewList
                    reviews={reviews}
                    carId={car.id}
                    carName={`${car.brand} ${car.model}`}
                    onAddReview={onAddReview}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
