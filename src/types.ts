/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number; // in EUR or TRY
  mileage: number; // in km
  transmission: 'Manuel' | 'Otomatik' | 'Yarı Otomatik';
  fuel: 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik' | 'LPG';
  bodyType: 'Sedan' | 'Hatchback' | 'SUV' | 'Coupé' | 'Cabrio' | 'Station Wagon';
  color: string;
  enginePower: number; // in HP
  imageUrl: string;
  description: string;
  features: string[];
  status: 'active' | 'sold';
  createdAt: string;
}

export interface Review {
  id: string;
  carId: string; // "general" for site-wide, or specific car ID
  userName: string;
  email: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  adminReply?: string;
}
