/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Car, Review } from './types';

export const INITIAL_CARS: Car[] = [
  {
    id: 'car-1',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2023,
    price: 9450000, // in TRY
    mileage: 12000,
    transmission: 'Otomatik',
    fuel: 'Benzin',
    bodyType: 'Coupé',
    color: 'Tebeşir Grisi',
    enginePower: 450,
    imageUrl: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
    description: 'Doğuş Otomotiv çıkışlı, hatasız, boyasız Porsche 911 Carrera S. Sport Chrono paket, spor egzoz sistemi, arka aks yönlendirme ve karbon fiber iç detaylar ile donatılmıştır. Kapalı garajda muhafaza edilmiştir.',
    features: [
      'Sport Chrono Paket',
      'Spor Egzoz Sistemi',
      'Matrix LED Farlar',
      'Bose Ses Sistemi',
      'Arka Aks Yönlendirme',
      '18 Yönlü Spor Koltuklar',
      'Karbon Fiber İç Trimler',
      '360 Derece Çevre Görüş'
    ],
    status: 'active',
    createdAt: '2026-05-10T10:00:00Z'
  },
  {
    id: 'car-2',
    brand: 'Audi',
    model: 'RS e-tron GT',
    year: 2024,
    price: 8850000,
    mileage: 4500,
    transmission: 'Otomatik',
    fuel: 'Elektrik',
    bodyType: 'Sedan',
    color: 'Mit siyahı',
    enginePower: 646,
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
    description: 'Yenilikçi elektrik gücü ve RS ruhunun mükemmel birleşimi. Sıfır ayarında, lansman rengi Mit Siyahı Audi RS e-tron GT. Bang & Olufsen ses sistemi ve panoramik cam tavan bulunmaktadır.',
    features: [
      'Quattro Dört Tekerlekten Çekiş',
      'Bang & Olufsen Premium Ses Sistemi',
      'Adaptif Havalı Süspansiyon',
      'Panoramilk Cam Tavan',
      'Lazer Aydınlatmalı Matrix Farlar',
      'Isıtmalı ve Havalandırmalı Koltuklar',
      'Karbon Seramik Fren Sistemi',
      'Head-up Display'
    ],
    status: 'active',
    createdAt: '2026-05-15T14:30:00Z'
  },
  {
    id: 'car-3',
    brand: 'Mercedes-Benz',
    model: 'G 400 d Stronger Than Time',
    year: 2022,
    price: 13200000,
    mileage: 28000,
    transmission: 'Otomatik',
    fuel: 'Dizel',
    bodyType: 'SUV',
    color: 'Mat Selenit Grisi',
    enginePower: 330,
    imageUrl: 'https://images.unsplash.com/photo-1520050206274-a1ae446cb3cc?auto=format&fit=crop&q=80&w=1200',
    description: 'Stronger Than Time özel seri Mercedes-Benz G400d. Hatasız eziksiz çiziksiz durumdadır. Tüm bakımları yetkili servisinde yapılmıştır. Özel mat selenyum gri kaplama ve nappa deri koltuklar.',
    features: [
      'Stronger Than Time Özel Donanım',
      'Burmester Surround Ses Sistemi',
      'Nappa Deri Isıtmalı-Soğutmalı Koltuklar',
      'Sürüş Asistan Paketi Plus',
      'Sunroof',
      'Multibeam LED Teknolojisi',
      'Masajlı Ön Koltuklar',
      '20 inç AMG Alaşımlı Jantlar'
    ],
    status: 'active',
    createdAt: '2026-05-18T09:15:00Z'
  },
  {
    id: 'car-4',
    brand: 'BMW',
    model: 'M4 Competition xDrive',
    year: 2023,
    price: 7600000,
    mileage: 9500,
    transmission: 'Otomatik',
    fuel: 'Benzin',
    bodyType: 'Coupé',
    color: 'Yalın Metalik Mavi',
    enginePower: 510,
    imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=1200',
    description: '510 Beygir gücünde pist canavarı BMW M4 Competition. xDrive dört çeker sistemi ile maksimum yol tutuşu. Karbon kova koltuklar ve profesyonel pist takip asistanı entegredir.',
    features: [
      'xDrive Akıllı Dört Çeker',
      'M Karbon Kova Koltuklar',
      'M Drift Analizörü',
      'Harman Kardon Profesyonel Ses',
      'Karbon Dış Tasarım Paketi',
      'M Adaptif Süspansiyon',
      'Lazer Farlar',
      'Aktif Şerit Takip Asistanı'
    ],
    status: 'active',
    createdAt: '2026-05-20T16:45:00Z'
  },
  {
    id: 'car-5',
    brand: 'Land Rover',
    model: 'Range Rover 3.0 D350 Vogue',
    year: 2023,
    price: 15400000,
    mileage: 15000,
    transmission: 'Otomatik',
    fuel: 'Dizel',
    bodyType: 'SUV',
    color: 'Kutup Beyazı',
    enginePower: 350,
    imageUrl: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&q=80&w=1200',
    description: 'Lüks ve heybetin simgesi yeni kasa Range Rover Vogue. İthalat durumlu, tam ÖTV’li olup evrakları eksiksizdir. Arka multimedya ekranları ve buzdolabı konsolu mevcuttur.',
    features: [
      'Arka Eğlence Paketi (Ekranlar)',
      'Meridian Signature Ses Sistemi',
      'Isıtmalı Direksiyon ve Kolçaklar',
      'Buzdolabı Entegre Konsol',
      'Yumuşak Kapanır Kapılar (Vakum)',
      'Dört Bölge Dijital Klima',
      'Panoramilk Açılır Tavan',
      'Yükseklik Ayarlı Havalı Süspansiyon'
    ],
    status: 'sold', // let's seed one sold car to show sold state styling perfectly
    createdAt: '2026-05-05T11:20:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    carId: 'car-1',
    userName: 'Murat Yıldırım',
    email: 'murat.yildirim@example.com',
    rating: 5,
    comment: 'Aracı yerinde inceleme fırsatım oldu. Kartal Motors ekibi son derece ilgili ve profesyoneldi. Porsche kelimenin tam anlamıyla kusursuz bir kondisyonda.',
    createdAt: '2026-05-12T13:40:00Z',
    adminReply: 'Değerli yorumunuz için çok teşekkür ederiz Murat Bey. Sizleri ağırlamaktan her zaman mutluluk duyarız.'
  },
  {
    id: 'rev-2',
    carId: 'car-2',
    userName: 'Buse Demirel',
    email: 'buse@example.com',
    rating: 5,
    comment: 'Elektrikli araç konusundaki tüm tabularımı yıkan bir model. Test sürüşünde ve bilgilendirme sürecindeki güler yüzlü hizmet için teşekkürler.',
    createdAt: '2026-05-17T11:05:00Z',
    adminReply: 'Buse Hanım, RS e-tron GT gerçekten yeni nesil mobilite teknolojisinin zirvesi. Aracımızla keyifli ve güvenli sürüşler dileriz.'
  },
  {
    id: 'rev-3',
    carId: 'general',
    userName: 'Kaan Demir',
    email: 'k.demir@example.com',
    rating: 5,
    comment: 'Uzun süredir hayalini kurduğum aracımı Kartal Motors güvencesiyle satın aldım. İşlemler çok hızlı ve şeffaf yürüdü. Kesinlikle tavsiye ederim.',
    createdAt: '2026-05-22T15:30:00Z'
  },
  {
    id: 'rev-4',
    carId: 'general',
    userName: 'Arda Soylu',
    email: 'arda.soylu@gmail.com',
    rating: 4,
    comment: 'Araç çeşitliliği ve galerinin kalitesi mükemmel. Sektördeki en prestijli showroomlardan biri diyebilirim.',
    createdAt: '2026-05-24T18:20:00Z'
  }
];

export const CAR_BRAND_PRESETS = [
  'Porsche',
  'Audi',
  'Mercedes-Benz',
  'BMW',
  'Land Rover',
  'Aston Martin',
  'Ferrari',
  'Lamborghini',
  'Maserati',
  'Bentley'
];

export const CAR_BODY_TYPES = [
  'Sedan',
  'Hatchback',
  'SUV',
  'Coupé',
  'Cabrio',
  'Station Wagon'
];

export const FUEL_TYPES = [
  'Benzin',
  'Dizel',
  'Hibrit',
  'Elektrik',
  'LPG'
];

export const TRANSMISSION_TYPES = [
  'Manuel',
  'Otomatik',
  'Yarı Otomatik'
];

export const LUXURY_FEATURES_PRESETS = [
  'Panoramilk Cam Tavan',
  'Koltuk Isıtma',
  'Koltuk Havalandırma',
  'Masajlı Koltuklar',
  'Premium Ses Sistemi',
  'Ceviz Ahşap / Karbon Fiber Detaylar',
  'Adaptif Hız Sabitleyici (ACC)',
  'Arka Eğlence Paketi',
  '360 Derece Çevre Kamerası',
  'Vakumlu Kapılar',
  'Matrix LED / Lazer Farlar',
  'Adaptif Havalı Süspansiyon',
  'Head-Up Display',
  'Hayalet Gösterge Paneli',
  'Şerit Takip Sürüş Asistanı',
  'Kör Nokta Uyarı Sistemi',
  'Kablosuz Şarj Platformu',
  'Elektrikli Bagaj Kapağı'
];
