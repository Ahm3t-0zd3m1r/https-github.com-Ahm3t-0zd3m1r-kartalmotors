/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Car } from '../types';
import { Fuel, Gauge, Milestone, Settings } from 'lucide-react';
import { motion } from 'motion/react';

interface CarCardProps {
  key?: string;
  car: Car;
  onViewDetails: (car: Car) => void;
}

export default function CarCard({ car, onViewDetails }: CarCardProps) {
  // Format price helper (Turkish Lira, e.g., 9.450.000 TL)
  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR') + ' ₺';
  };

  // Format mileage helper
  const formatMileage = (km: number) => {
    return km.toLocaleString('tr-TR') + ' km';
  };

  const isSold = car.status === 'sold';

  return (
    <motion.div
      id={`car-card-${car.id}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-slate-900 border border-slate-800/95 shadow-md transition-all duration-300 hover:shadow-[0_0_20px_rgba(225,29,72,0.15)] hover:border-rose-500/50"
    >
      {/* Car Image Area */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-950">
        <img
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-85" />

        {/* Status Badges */}
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <span className="rounded-md bg-slate-950/90 px-2.5 py-1 text-xs font-mono font-medium tracking-wide text-white border border-slate-800 backdrop-blur-xs">
            {car.year}
          </span>
          <span className="rounded-md bg-rose-600/90 px-2.5 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-xs">
            {car.bodyType}
          </span>
        </div>

        {/* Sold Overlay */}
        {isSold && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="rounded-xl border-2 border-rose-600 bg-rose-600/10 px-6 py-2 text-center uppercase tracking-widest font-bold text-rose-500"
            >
              SATILDI
            </motion.div>
          </div>
        )}
      </div>

      {/* Car Content Area */}
      <div className="flex flex-1 flex-col p-5">
        {/* Brand & Model */}
        <div className="mb-2">
          <h3 className="font-sans text-xs font-medium uppercase tracking-widest text-rose-500">
            {car.brand}
          </h3>
          <h4 className="font-sans text-lg font-bold tracking-tight text-white group-hover:text-rose-500 transition-colors">
            {car.model}
          </h4>
        </div>

        {/* Quick specs grid */}
        <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 my-3 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-1.5" title="Kilometre">
            <Milestone size={14} className="text-rose-500/70" />
            <span className="truncate">{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center" title="Şanzıman">
            <Settings size={14} className="text-rose-500/70" />
            <span className="truncate">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-end" title="Yakıt Türü">
            <Fuel size={14} className="text-rose-500/70" />
            <span className="truncate">{car.fuel}</span>
          </div>
        </div>

        {/* Price & Action button */}
        <div className="mt-auto flex items-center justify-between gap-4 pt-1">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Anahtar Teslim</p>
            <p className={`font-sans text-lg font-black tracking-tight ${isSold ? 'text-slate-500 line-through' : 'text-white'}`}>
              {formatPrice(car.price)}
            </p>
          </div>

          <button
            id={`btn-view-${car.id}`}
            onClick={() => onViewDetails(car)}
            className={`cursor-pointer rounded-lg px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-200 ${
              isSold
                ? 'bg-slate-800 hover:bg-slate-750 text-slate-400 border border-slate-700'
                : 'bg-rose-600 text-white hover:bg-rose-500 active:scale-95 shadow-[0_4px_12px_rgba(225,29,72,0.2)]'
            }`}
          >
            İncele
          </button>
        </div>
      </div>
    </motion.div>
  );
}
