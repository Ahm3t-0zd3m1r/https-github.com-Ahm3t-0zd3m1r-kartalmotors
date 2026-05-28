/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Review } from '../types';
import { MessageSquare, Star, Reply, User, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReviewListProps {
  reviews: Review[];
  carId: string; // 'general' or specific car ID
  carName?: string;
  onAddReview: (reviewData: { userName: string; email: string; rating: number; comment: string }) => void;
}

export default function ReviewList({ reviews, carId, carName, onAddReview }: ReviewListProps) {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter reviews for this scope
  const filteredReviews = reviews.filter((r) => r.carId === carId);

  // Compute average rating
  const averageRating = filteredReviews.length
    ? (filteredReviews.reduce((sum, r) => sum + r.rating, 0) / filteredReviews.length).toFixed(1)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg('Lütfen adınızı giriniz.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    if (!comment.trim() || comment.length < 5) {
      setErrorMsg('Yorumunuz en az 5 karakter uzunluğunda olmalıdır.');
      return;
    }

    onAddReview({ userName, email, rating, comment });
    setUserName('');
    setEmail('');
    setRating(5);
    setComment('');
    setErrorMsg('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  const renderStars = (count: number, size = 16, onClick?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            onClick={() => onClick && onClick(star)}
            onMouseEnter={() => !onClick && null}
            className={`${
              star <= count
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-800'
            } ${onClick ? 'cursor-pointer transition-colors duration-150 hover:scale-110' : ''}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div id={`review-list-${carId}`} className="space-y-8">
      {/* Average & Title Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h4 className="font-sans text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-rose-500" />
            {carId === 'general' ? 'Müşteri Değerlendirmeleri' : `${carName} Değerlendirmeleri`}
          </h4>
          <p className="text-xs text-slate-450 mt-1 text-slate-400">
            Müşterilerimizin galeri deneyimleri ve araç hakkındaki gerçek görüşleri.
          </p>
        </div>

        {averageRating && (
          <div className="flex items-center gap-3 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
            <div className="text-right">
              <span className="text-sm font-mono text-slate-500 block leading-none">Ortalama</span>
              <span className="text-xl font-black font-sans text-white">{averageRating} / 5</span>
            </div>
            <div className="flex flex-col gap-0.5 justify-center">
              {renderStars(Math.round(Number(averageRating)))}
              <span className="text-[10px] text-slate-400 font-mono text-right">{filteredReviews.length} yorum</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Review Submission Form */}
        <div className="lg:col-span-5 bg-slate-950/30 border border-slate-800 rounded-2xl p-6">
          <h5 className="font-sans text-base font-bold text-white mb-4">Görüşünüzü Bizimle Paylaşın</h5>
          
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center p-6 bg-emerald-950/20 border border-emerald-900/40 rounded-xl"
              >
                <CheckCircle2 size={40} className="text-emerald-400 mb-2" />
                <p className="text-sm font-bold text-emerald-300">Değerlendirmeniz Alındı</p>
                <p className="text-xs text-emerald-400 mt-1">
                  Yorumunuz başarıyla yayınlandı. Geri bildiriminiz bizim için çok değerlidir!
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-920/40 rounded-lg text-xs font-medium text-red-400">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Puanınız
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="cursor-pointer focus:outline-hidden"
                        >
                          <Star
                            size={24}
                            className={`${
                              star <= (hoverRating || rating)
                                ? 'fill-rose-500 text-rose-500 hover:scale-110'
                                : 'text-slate-800'
                            } transition-all duration-150`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold font-mono text-slate-350 text-slate-300">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                      Adınız Soyadınız
                    </label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Örn. Ahmet Demir"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-hidden transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                      E-posta Adresiniz
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ahmet@ornek.com"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-hidden transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide">
                    Görüşünüz / Yorumunuz
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Deneyiminizi anlatın, galeri veya araç detaylarından bahsedin..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 focus:outline-hidden transition resize-none"
                  />
                </div>

                <button
                  id={`review-submit-${carId}`}
                  type="submit"
                  className="cursor-pointer w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2.5 text-sm font-bold text-white transition-all duration-200 active:scale-[0.98] shadow-[0_4px_12px_rgba(225,29,72,0.15)]"
                >
                  <Send size={15} />
                  Yorumu Gönder
                </button>
              </form>
            )}
          </AnimatePresence>
        </div>

        {/* Reviews List */}
        <div className="lg:col-span-7 space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-850 rounded-2xl flex flex-col items-center justify-center">
              <MessageSquare size={36} className="text-slate-600 mb-3" />
              <p className="text-sm font-medium text-slate-400">Henüz yorum yapılmamış.</p>
              <p className="text-xs text-slate-500 mt-1">İlk yorumu yukarıdaki formu doldurarak siz yapabilirsiniz!</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((rev, index) => (
                <motion.div
                  key={rev.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-rose-500 font-bold uppercase">
                        {rev.userName.slice(0, 2)}
                      </div>
                      <div>
                        <h6 className="font-sans text-sm font-bold text-white">{rev.userName}</h6>
                        <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                          {new Date(rev.createdAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    <div>{renderStars(rev.rating)}</div>
                  </div>

                  <p className="mt-3.5 text-sm text-slate-300 leading-relaxed pl-1">{rev.comment}</p>

                  {/* Admin Reply */}
                  {rev.adminReply && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-4 border-t border-slate-800 pt-3.5 pl-4 flex gap-3"
                    >
                      <Reply size={16} className="text-rose-500 rotate-180 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-xs font-bold text-rose-450 px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                            Kartal Motors Yetkilisi
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                          {rev.adminReply}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
