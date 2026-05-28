/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Car, Review } from '../types';
import { 
  PlusCircle, Trash2, LayoutGrid, Check, Settings, ShieldCheck, 
  MessageSquare, Star, Reply, LogOut, CheckCircle, CarFront, FileText 
} from 'lucide-react';
import { 
  CAR_BRAND_PRESETS, CAR_BODY_TYPES, FUEL_TYPES, 
  TRANSMISSION_TYPES, LUXURY_FEATURES_PRESETS 
} from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  cars: Car[];
  reviews: Review[];
  onAddCar: (newCar: Car) => void;
  onUpdateCarStatus: (carId: string, status: 'active' | 'sold') => void;
  onDeleteCar: (carId: string) => void;
  onAddAdminReply: (reviewId: string, reply: string) => void;
  onDeleteReview: (reviewId: string) => void;
}

export default function AdminPanel({
  cars,
  reviews,
  onAddCar,
  onUpdateCarStatus,
  onDeleteCar,
  onAddAdminReply,
  onDeleteReview
}: AdminPanelProps) {
  // Authentication states
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');

  // Navigation states
  const [activeTab, setActiveTab] = useState<'listings' | 'add' | 'reviews'>('listings');

  // Form states (Add Car)
  const [brand, setBrand] = useState('Porsche');
  const [customBrand, setCustomBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [price, setPrice] = useState(5000000);
  const [mileage, setMileage] = useState(0);
  const [transmission, setTransmission] = useState<'Manuel' | 'Otomatik' | 'Yarı Otomatik'>('Otomatik');
  const [fuel, setFuel] = useState<'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG'>('Benzin');
  const [bodyType, setBodyType] = useState<'Sedan' | 'Hatchback' | 'SUV' | 'Coupé' | 'Cabrio' | 'Station Wagon'>('Sedan');
  const [color, setColor] = useState('');
  const [enginePower, setEnginePower] = useState(300);
  const [description, setDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [customFeature, setCustomFeature] = useState('');
  
  // Dynamic premium preset URLs for admin comfort
  const [imageUrlPreset, setImageUrlPreset] = useState('custom');
  const [customImageUrl, setCustomImageUrl] = useState('');

  const PRESET_IMAGE_URLS = {
    porsche: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    audi: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    mercedes: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=1200',
    bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
    rangerover: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=1200',
    ferrari: 'https://images.unsplash.com/photo-1592853625597-7d17be820d0c?auto=format&fit=crop&q=80&w=1200',
    lamborghini: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
  } as Record<string, string>;

  // Form states (Add review reply)
  const [repliesState, setRepliesState] = useState<Record<string, string>>({});
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default pass is "kartal1907" or simple bypass
    if (password.toLowerCase() === 'kartal1907' || password === 'admin') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError('Hatalı yönetici şifresi. (İpucu: kartal1907)');
    }
  };

  const handleFeatureToggle = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleAddCustomFeature = () => {
    if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
      setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
      setCustomFeature('');
    }
  };

  const handleAddCarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!model.trim() || !color.trim() || !description.trim()) {
      alert('Lütfen zorunlu alanları doldurunuz.');
      return;
    }

    const finalBrand = brand === 'Custom' ? customBrand : brand;
    const finalImageUrl = imageUrlPreset === 'custom' ? customImageUrl : PRESET_IMAGE_URLS[imageUrlPreset];

    if (!finalImageUrl) {
      alert('Lütfen geçerli bir araç görsel adresi giriniz veya şablondan seçiniz.');
      return;
    }

    const newCar: Car = {
      id: `car-${Date.now()}`,
      brand: finalBrand,
      model,
      year: Number(year),
      price: Number(price),
      mileage: Number(mileage),
      transmission,
      fuel,
      bodyType,
      color,
      enginePower: Number(enginePower),
      imageUrl: finalImageUrl,
      description,
      features: selectedFeatures,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    onAddCar(newCar);

    // Reset Form
    setModel('');
    setColor('');
    setMileage(0);
    setDescription('');
    setSelectedFeatures([]);
    setCustomImageUrl('');
    setImageUrlPreset('custom');
    
    setFormSuccessMessage('Araç başarılı bir şekilde portföye yüklendi!');
    setActiveTab('listings');
    setTimeout(() => setFormSuccessMessage(''), 4000);
  };

  const handleReplyChange = (reviewId: string, val: string) => {
    setRepliesState({
      ...repliesState,
      [reviewId]: val
    });
  };

  const handleReplySubmit = (reviewId: string) => {
    const text = repliesState[reviewId];
    if (!text || !text.trim()) {
      alert('Lütfen yanıt yazınız.');
      return;
    }
    onAddAdminReply(reviewId, text.trim());
    setRepliesState({
      ...repliesState,
      [reviewId]: ''
    });
  };

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-3">
            <ShieldCheck size={26} />
          </div>
          <h3 className="font-sans text-xl font-bold text-white">Yönetim Paneli Girişi</h3>
          <p className="text-xs text-slate-400 mt-1">
            Kartal Motors yönetim paneline erişmek için yetkili şifresini giriniz.
          </p>
        </div>

        {authError && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-900/40 rounded-xl text-xs font-medium text-red-400">
            {authError}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
              Yönetici Şifresi
            </label>
            <input
              type="password"
              placeholder="Şifreyi giriniz..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-hidden transition"
              autoFocus
            />
          </div>

          <button
            id="btn-admin-login"
            type="submit"
            className="cursor-pointer w-full rounded-xl bg-rose-600 font-bold text-sm text-white py-2.5 hover:bg-rose-500 active:scale-95 transition-all duration-200 shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
          >
            Sisteme Giriş Yap
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <span className="text-[10px] font-mono text-slate-500 block">
            Hızlı Test Şifresi: <strong className="text-rose-500 select-all">kartal1907</strong> veya <strong className="text-rose-500 select-all">admin</strong>
          </span>
          <button
            onClick={() => setIsAuthenticated(true)}
            className="cursor-pointer mt-2 text-xs font-bold text-rose-500 hover:underline hover:text-rose-400"
          >
            Otomatik Giriş Yap (Geliştirici Bypass)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Admin header menu */}
      <div className="bg-slate-950 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 text-white">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-black font-sans shadow-[0_2px_8px_rgba(225,29,72,0.2)]">
            K
          </div>
          <div>
            <h3 className="font-sans text-base font-bold leading-tight">Yönetici Rezerv Kabini</h3>
            <span className="text-[10px] font-mono text-rose-500">Rol: Kartal Gallery Director</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('listings')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'listings' ? 'bg-rose-600 text-white shadow-[0_2px_8px_rgba(225,29,72,0.2)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Araçları Yönet ({cars.length})
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'add' ? 'bg-rose-600 text-white shadow-[0_2px_8px_rgba(225,29,72,0.2)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Yeni Araç Ekle
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`cursor-pointer px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'reviews' ? 'bg-rose-600 text-white shadow-[0_2px_8px_rgba(225,29,72,0.2)]' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Yorumları ve Cevapları Yönet ({reviews.length})
          </button>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="cursor-pointer ml-2 p-1.5 rounded-lg bg-red-950/40 border border-red-500/20 text-red-500 hover:text-white hover:bg-rose-600 transition-colors"
            title="Güvenli Çıkış"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {formSuccessMessage && (
        <div className="mx-6 mt-6 p-4 bg-emerald-950/25 border border-emerald-900/40 rounded-2xl flex items-center gap-2.5 text-emerald-400">
          <CheckCircle size={18} className="text-emerald-400" />
          <span className="text-sm font-semibold">{formSuccessMessage}</span>
        </div>
      )}

      {/* Admin Panel Body */}
      <div className="p-6 bg-slate-900">
        <AnimatePresence mode="wait">
          {/* TAB 1: listings */}
          {activeTab === 'listings' && (
            <motion.div
              key="tab-listings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-400">Mevcut Araç Portföyü</h4>
                <span className="text-xs font-mono text-slate-500">Toplam {cars.length} ilan yayında</span>
              </div>

              {cars.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl">
                  <CarFront size={48} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-400">Galerinizde hiç araç kaydı yok.</p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="cursor-pointer mt-3 font-semibold text-xs text-rose-500 hover:underline hover:text-rose-450"
                  >
                    Yeni bir araç ekleyerek başlayın.
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/25">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-950/50 font-mono text-[10px] text-slate-500 uppercase tracking-wider border-b border-slate-800">
                        <th className="py-3 px-4">Görsel</th>
                        <th className="py-3 px-4">Araç Tanımı</th>
                        <th className="py-3 px-4">Yıl / Kilometre</th>
                        <th className="py-3 px-4">Fiyat</th>
                        <th className="py-3 px-4 text-center">Durum</th>
                        <th className="py-3 px-4 text-right">Eylemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {cars.map((car) => (
                        <tr key={car.id} className="hover:bg-slate-950/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <img
                              src={car.imageUrl}
                              alt={car.model}
                              referrerPolicy="no-referrer"
                              className="h-10 w-16 object-cover rounded-lg border border-slate-800 bg-slate-950"
                            />
                          </td>
                          <td className="py-3.5 px-4 font-sans text-white">
                            <span className="block text-xs uppercase font-mono tracking-widest text-rose-500 font-bold">{car.brand}</span>
                            <span className="font-bold text-sm">{car.model}</span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            <span className="block">{car.year} Model</span>
                            <span className="text-[11px] block text-slate-500">{car.mileage.toLocaleString('tr-TR')} km</span>
                          </td>
                          <td className="py-3.5 px-4 font-bold font-sans text-white text-sm">
                            {car.price.toLocaleString('tr-TR')} ₺
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <button
                              id={`status-toggle-${car.id}`}
                              onClick={() => onUpdateCarStatus(car.id, car.status === 'active' ? 'sold' : 'active')}
                              className={`cursor-pointer px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide transition-colors ${
                                car.status === 'active'
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/40 hover:bg-emerald-900/50'
                                  : 'bg-rose-950/40 text-rose-450 border border-rose-900/40 hover:bg-rose-900/50'
                              }`}
                              title="Tıkla ve Durumu Değiştir"
                            >
                              {car.status === 'active' ? 'Aktif Satış' : 'SATILDI'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              id={`btn-delete-car-${car.id}`}
                              onClick={() => {
                                if (window.confirm(`${car.brand} ${car.model} ilanını tamamen kaldırmak istediğinizden emin misiniz?`)) {
                                  onDeleteCar(car.id);
                                }
                              }}
                              className="cursor-pointer rounded-lg p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-950/40 transition-all duration-150"
                              title="İlanı Tamamen Sil"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: add (Add Car Form) */}
          {activeTab === 'add' && (
            <motion.div
              key="tab-add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-slate-950/20 rounded-2xl p-6 border border-slate-800"
            >
              <form onSubmit={handleAddCarSubmit} className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                  <PlusCircle size={18} className="text-rose-500" />
                  <span className="font-sans text-sm font-bold uppercase tracking-wider text-slate-200">Sisteme Yeni Araç Yükle</span>
                </div>

                {/* Form row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Marka</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    >
                      {CAR_BRAND_PRESETS.map((b) => (
                        <option key={b} value={b} className="bg-slate-950 text-slate-200">{b}</option>
                      ))}
                      <option value="Custom" className="bg-slate-950 text-slate-250">-- Diğer Marka Gir --</option>
                    </select>
                    {brand === 'Custom' && (
                      <input
                        type="text"
                        required
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="Örn: Maserati"
                        className="w-full mt-2 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:outline-hidden"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Model & Versiyon</label>
                    <input
                      type="text"
                      required
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      placeholder="Örn: Vantage V8 Supercharged"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Model Yılı</label>
                    <input
                      type="number"
                      required
                      min={1950}
                      max={2027}
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Form row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Fiyat (₺ / TL)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Kilometre (km)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Motor Gücü (HP / Beygir)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={enginePower}
                      onChange={(e) => setEnginePower(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Dış Renk</label>
                    <input
                      type="text"
                      required
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Örn: Metalik Füme"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Form row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Şanzıman</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    >
                      {TRANSMISSION_TYPES.map((t) => (
                        <option key={t} value={t} className="bg-slate-950 text-slate-200">{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Yakıt Türü</label>
                    <select
                      value={fuel}
                      onChange={(e) => setFuel(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    >
                      {FUEL_TYPES.map((f) => (
                        <option key={f} value={f} className="bg-slate-950 text-slate-200">{f}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Gövde Tipi</label>
                    <select
                      value={bodyType}
                      onChange={(e) => setBodyType(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    >
                      {CAR_BODY_TYPES.map((b) => (
                        <option key={b} value={b} className="bg-slate-950 text-slate-200">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Cover Image Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Görsel Seçimi (Şablonlar)</label>
                    <select
                      value={imageUrlPreset}
                      onChange={(e) => setImageUrlPreset(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 focus:border-rose-500 focus:outline-hidden"
                    >
                      <option value="custom" className="bg-slate-950 text-slate-200">-- Kendi Görsel Adresimi Gireceğim (Aşağıya) --</option>
                      <option value="porsche" className="bg-slate-950 text-slate-200">Şablon Porsche 911 (Tarihi Klasman)</option>
                      <option value="audi" className="bg-slate-950 text-slate-200">Şablon Audi RS e-tron GT (Siyah Elektrikli)</option>
                      <option value="mercedes" className="bg-slate-950 text-slate-200">Şablon Mercedes G-Kasa (Heybetli Arazi)</option>
                      <option value="bmw" className="bg-slate-950 text-slate-200">Şablon BMW M4 (Pist Sporcusu)</option>
                      <option value="rangerover" className="bg-slate-950 text-slate-200">Şablon Range Rover Vogue (Klasik Lüks)</option>
                      <option value="ferrari" className="bg-slate-950 text-slate-200">Şablon Ferrari 488 (İtalyan Kırmızısı)</option>
                      <option value="lamborghini" className="bg-slate-950 text-slate-200">Şablon Lamborghini Aventador (Yol Ejderhası)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Özel Görsel Adresi (URL)</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imageUrlPreset === 'custom' ? customImageUrl : PRESET_IMAGE_URLS[imageUrlPreset]}
                      disabled={imageUrlPreset !== 'custom'}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:outline-hidden disabled:bg-slate-950 disabled:text-slate-600 transition"
                    />
                  </div>
                </div>

                {/* Description Area */}
                <div>
                  <label className="block text-xs font-semibold text-slate-450 mb-1.5 uppercase tracking-wide text-slate-400">Araç Geçmişi ve Detaylı Açıklama</label>
                  <textarea
                    required
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Aracın hasar durumu, kaza geçmişi, hangi kapalı garajda muhafaza edildiği veya ekstralarını belirtiniz..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:outline-hidden transition resize-none"
                  />
                </div>

                {/* Luxury Features Selector Checklist */}
                <div>
                  <label className="block text-xs font-semibold text-slate-450 mb-2 uppercase tracking-wide text-slate-400 font-sans">Konfor ve Paket Aksesuarları Seçin</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-slate-950 border border-slate-800/80 p-4 rounded-xl">
                    {LUXURY_FEATURES_PRESETS.map((feat) => (
                      <label key={feat} className="flex items-center gap-2 text-xs text-slate-350 cursor-pointer hover:text-rose-500 select-none text-slate-300">
                        <input
                          type="checkbox"
                          checked={selectedFeatures.includes(feat)}
                          onChange={() => handleFeatureToggle(feat)}
                          className="rounded border-slate-800 text-rose-500 focus:ring-rose-500 bg-slate-950"
                        />
                        <span>{feat}</span>
                      </label>
                    ))}
                  </div>

                  {/* Add customized extra feature */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Özel ekstra donanım gir (Örn: Buzdolabı Konsol)"
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-850 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-hidden focus:border-rose-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomFeature}
                      className="cursor-pointer bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Ekle
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-850 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('listings')}
                    className="cursor-pointer rounded-xl border border-slate-800 hover:bg-slate-900 text-slate-300 font-bold text-xs px-4 py-2.5 transition"
                  >
                    Vazgeç
                  </button>
                  <button
                    id="btn-confirm-add-car"
                    type="submit"
                    className="cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-6 py-2.5 transition active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.2)]"
                  >
                    İlanı Yayınla
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* TAB 3: reviews (Manage Comments & Replies) */}
          {activeTab === 'reviews' && (
            <motion.div
              key="tab-reviews"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-850">
                <h4 className="font-sans text-sm font-bold uppercase tracking-wider text-slate-400">Müşteri Yorumları & Yanıtları</h4>
                <span className="text-xs font-mono text-slate-500">{reviews.length} Toplam değerlendirme</span>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl">
                  <MessageSquare size={48} className="mx-auto text-slate-700 mb-3" />
                  <p className="text-sm font-medium text-slate-400">Henüz yazılmış bir yorum bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => {
                    const linkedCar = cars.find((c) => c.id === rev.carId);
                    return (
                      <div
                        key={rev.id}
                        className="bg-slate-950/20 border border-slate-850 rounded-2xl p-5 hover:border-slate-800 transition-all shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-white text-sm">{rev.userName} </span>
                            <span className="text-xs text-slate-400">({rev.email})</span>
                            <span className="text-[10px] font-mono text-slate-500 block sm:inline sm:ml-2">
                              {new Date(rev.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Star Rating Display */}
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={s <= rev.rating ? 'fill-rose-500 text-rose-500' : 'text-slate-800'}
                                />
                              ))}
                            </div>

                            {/* Reference info context */}
                            <span className="text-[10px] uppercase font-bold tracking-wide rounded-md bg-slate-950 text-rose-500 px-2 py-0.5 border border-slate-850">
                              {rev.carId === 'general' ? 'Genel Şirket Değerlendirmesi' : `${linkedCar?.brand || 'Bilinmeyen'} ${linkedCar?.model || 'Model'}`}
                            </span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm text-slate-300 font-sans leading-relaxed">
                          "{rev.comment}"
                        </p>

                        {/* Reply Section */}
                        <div className="mt-4 border-t border-slate-850 pt-3.5 space-y-3">
                          {rev.adminReply ? (
                            <div className="flex items-start gap-2 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                              <Reply size={14} className="text-rose-500 rotate-180 shrink-0 mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs font-bold text-rose-400 block">Yazdığınız Resmi Yanıt:</p>
                                <p className="text-xs text-slate-300 leading-relaxed italic mt-1">"{rev.adminReply}"</p>
                              </div>
                              <button
                                onClick={() => {
                                  // Reset reply to edit
                                  handleReplyChange(rev.id, rev.adminReply || '');
                                  onAddAdminReply(rev.id, ''); // clears client reply to allow overwrite
                                }}
                                className="cursor-pointer text-xs font-semibold text-rose-500 hover:underline hover:text-rose-400"
                              >
                                Düzenle
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5">
                              <Reply size={14} className="text-slate-500 rotate-180 mt-1 shrink-0" />
                              <input
                                type="text"
                                value={repliesState[rev.id] || ''}
                                onChange={(e) => handleReplyChange(rev.id, e.target.value)}
                                placeholder="Müşteriye galerimiz adına bir nezaket cevabı yazınız..."
                                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-650 focus:outline-hidden focus:border-rose-500"
                              />
                              <button
                                onClick={() => handleReplySubmit(rev.id)}
                                className="cursor-pointer rounded-lg bg-rose-600 hover:bg-rose-500 font-bold text-xs px-3.5 py-1.5 text-white transition-colors"
                              >
                                Cevapla
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Extra delete review choice */}
                        <div className="mt-3 pt-2 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm('Bu müşteri yorumunu silmek istediğinizden emin misiniz?')) {
                                onDeleteReview(rev.id);
                              }
                            }}
                            className="cursor-pointer text-[11px] font-bold text-rose-500 hover:underline flex items-center gap-1 ml-auto"
                          >
                            <Trash2 size={12} /> Yorumu Sil
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
