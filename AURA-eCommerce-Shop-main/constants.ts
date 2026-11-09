/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle, CategoryInfo } from './types';

export const BRAND_NAME = 'OPAR';
export const PRIMARY_COLOR = 'stone-900'; 
export const ACCENT_COLOR = 'stone-500';

export const PRODUCTS: Product[] = [
  // 1. AYURVEDIC BOTANICALS & PURE HERBS
  {
    id: 'aura-ashwagandha',
    name: 'OPAR Organic Ashwagandha Root',
    authenticScript: 'अश्वगन्धा',
    scriptLanguage: 'Sanskrit',
    botanicalLatin: 'Withania somnifera',
    traditionalTcm: '睡茄 (Shuì Jiā)',
    tagline: 'Quiet the storm within.',
    description: 'Full-spectrum KSM-66 organic root extract. Clinically revered to calm the central nervous system, regulate cortisol, and ground chronic restlessness.',
    longDescription: 'Cultivated in the mineral-dense soils of central India through organic regenerative farming, OPAR Ashwagandha is an unadulterated botanical adaptogen. Used by Vedic rishis for millennia to cultivate Ojas (vital spiritual essence) and ground Vata dosha during prolonged meditative austerities. We use gentle water-extraction without harsh solvents. Stir one teaspoon into warm plant milk or raw honey at dusk to signal to your nervous system that the striving of the day is complete.',
    price: 38,
    supplierCost: 11.50,
    supplierSku: 'AYUR-ASHWA-001',
    stock: 84,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Certified USDA Organic Root', 'KSM-66 Gold Standard Extract', 'Zero Artificial Binders or Fillers', 'Non-GMO & Vegan'],
    variants: ['100g Pure Extract Powder', '250g Apothecary Glass Jar', '60 Vegan Herbal Capsules'],
    rating: 4.95,
    reviewCount: 52,
    origin: 'Regenerative organic farms, Madhya Pradesh'
  },
  {
    id: 'aura-brahmi',
    name: 'OPAR Sacred Brahmi Leaf Extract',
    authenticScript: 'ब्राह्मी',
    scriptLanguage: 'Sanskrit',
    botanicalLatin: 'Bacopa monnieri',
    traditionalTcm: '假马齿苋 (Jiǎ Mǎ Chǐ Xiàn)',
    tagline: 'Clarity of the unclouded mind.',
    description: 'Concentrated Bacopa Monnieri water extract. Revered in Ayurvedic medicine to elevate Medhya (intellect), enhance memory, and steady contemplative awareness.',
    longDescription: 'Named after Brahma, the creative energy of the universe, Brahmi is the premier herb of the contemplative mind. Traditionally harvested by monks near sacred water springs, Brahmi cools cerebral heat (Pitta) and promotes synaptogenesis. It gently calms erratic mental chatter without inducing lethargy, creating an unshakeable platform for silent meditation.',
    price: 34,
    supplierCost: 10.00,
    supplierSku: 'AYUR-BRAHMI-002',
    stock: 45,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Whole-Plant Bacopa Monnieri Extract', '20% Bacosides Potency', 'Wild-harvested in Clean Springs', 'Heavy-Metal Batch Tested'],
    variants: ['60ml Liquid Sublingual Tincture', '100g Fine Leaf Powder'],
    rating: 4.9,
    reviewCount: 31,
    origin: 'Kerala Highlands, India'
  },
  {
    id: 'aura-shilajit',
    name: 'OPAR Wildcrafted Himalayan Shilajit',
    authenticScript: 'शिलाजित्',
    scriptLanguage: 'Sanskrit',
    botanicalLatin: 'Asphaltum punjabianum',
    traditionalTcm: '喜来芝 (Xǐ Lái Zhī)',
    tagline: 'Ancient resin of primal fortitude.',
    description: 'Purified gold-grade mineral pitch harvested at 16,000 feet in the high Himalayas. Over 84 trace minerals and 60% bioactive fulvic acid.',
    longDescription: 'For millennia, Ayurvedic texts called Shilajit the "conqueror of mountains and destroyer of weakness." Oozing from pristine Himalayan rock faces warmed by the summer sun, this pure resin is purified through traditional Ayurvedic Surya Tapi (sun-infusion with Triphala water). Dissolve a rice-grain sized portion in warm spring water for systemic cellular vitality.',
    price: 49,
    supplierCost: 16.00,
    supplierSku: 'AYUR-SHILA-003',
    stock: 36,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['High-Altitude Gold Grade (16,000+ ft)', 'Rich in 84+ Ionic Trace Minerals', '>60% Fulvic Acid Content', 'Traditional Sun-Purified (Surya Tapi)'],
    variants: ['30g Pure Resin Jar (with Wooden Spoon)', '50g Master Apothecary Jar'],
    rating: 4.97,
    reviewCount: 44,
    origin: 'Gilgit-Baltistan & Ladakh Himalayas'
  },
  {
    id: 'aura-tulsi',
    name: 'OPAR Organic Krishna Tulsi Sacred Tea',
    authenticScript: 'कृष्ण तुलसी',
    scriptLanguage: 'Sanskrit',
    botanicalLatin: 'Ocimum sanctum',
    traditionalTcm: '圣罗勒 (Shèng Luó Lè)',
    tagline: 'The Queen of Herbs.',
    description: 'Hand-picked sacred purple holy basil leaves. Brews a warm peppery infusion that purifies the breath, uplifts the heart, and dissolves stress.',
    longDescription: 'Known as the "Incomparable One," Tulsi is grown at the threshold of spiritual households across India. Krishna Tulsi boasts the highest concentration of eugenol and antioxidant polyphenols. Drinking this tea is an invitation to slow down and breathe with the rhythm of the earth.',
    price: 24,
    supplierCost: 7.00,
    supplierSku: 'AYUR-TULSI-004',
    stock: 90,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Certified USDA Organic Holy Basil', 'Single-Estate Hand-Harvested', 'Caffeine-Free Adaptogen', 'Biodegradable Unbleached Packaging'],
    variants: ['100g Loose Leaf Botanical Tin', '250g Refill Apothecary Pouch'],
    rating: 4.88,
    reviewCount: 29,
    origin: 'Vrindavan Valley, India'
  },
  {
    id: 'aura-clove-buds',
    name: 'OPAR Sun-Dried Organic Whole & Ground Cloves',
    authenticScript: 'लवङ्ग (Lavanga)',
    scriptLanguage: 'Sanskrit / Botanical',
    botanicalLatin: 'Syzygium aromaticum',
    traditionalTcm: '丁香 (Dīng Xiāng)',
    tagline: 'Sacred fire of the breath and inner warmth.',
    description: 'Hand-selected, single-origin sun-dried aromatic clove buds (Syzygium aromaticum). 100% pure dried botanicals with zero chemical preservatives. Naturally rich in bioactive eugenol.',
    longDescription: 'Sourced from organic mountain foothills and dried under gentle morning sunlight to preserve its volatile essential oils. In Ayurvedic and traditional oriental practice, Clove stimulates digestive fire (Agni), cleanses the oral microbiome, and supports respiratory clarity. Free from artificial sulfur bleaching, radiation, or synthetic anti-caking agents. Chew a whole bud before meditation for clear breath, or steep 1/4 teaspoon of ground powder into warm ginger water.',
    price: 22,
    supplierCost: 6.00,
    supplierSku: 'AYUR-CLOVE-005',
    stock: 65,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Single-Ingredient Sun-Dried Cloves', 'High-Potency Natural Eugenol', 'Zero Chemical Preservatives or Additives', 'Food-Grade Pure Dried Botanical'],
    variants: ['100g Whole Sun-Dried Flower Buds', '100g Stone-Ground Microfine Powder', '250g Apothecary Glass Jar'],
    rating: 4.96,
    reviewCount: 37,
    origin: 'Organic Hill Tracts & Sri Lankan Estates'
  },
  {
    id: 'aura-neem-powder',
    name: 'OPAR Wildcrafted Pure Neem Leaf & Bark Powder',
    authenticScript: 'निम्ब (Nimba)',
    scriptLanguage: 'Sanskrit / Botanical',
    botanicalLatin: 'Azadirachta indica',
    traditionalTcm: '印楝 (Yìn Liàn)',
    tagline: 'The cooling essence of pure austerity.',
    description: '100% pure shade-dried mature neem leaves and root bark (Azadirachta indica). The premier bitter tonic for deep blood purification, radiant skin, and clearing heat.',
    longDescription: 'Revered across classical Eastern medicine as the "Sacred Healer." Yogis and ascetics have consumed small doses of pure bitter neem for millennia to cool physical restlessness, soothe internal heat (Pitta), and purify the blood. Harvested sustainably from wild, mature trees away from urban pollution, shade-dried to retain its deep emerald chlorophyll, and pulverized on low-friction stone mills without chemical heat degradation.',
    price: 24,
    supplierCost: 6.50,
    supplierSku: 'AYUR-NEEM-006',
    stock: 58,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Pure Azadirachta Indica', 'Zero Fillers, Maltodextrin, or Chemical Binders', 'Shade-Dried to Preserve Phytochemicals', 'Bitter Rasayana for Blood & Skin'],
    variants: ['150g Fine Leaf Powder', '250g Master Apothecary Glass Jar', 'Whole Dried Leaves (100g)'],
    rating: 4.93,
    reviewCount: 42,
    origin: 'Certified Wildcrafted Groves, Bengal'
  },
  {
    id: 'aura-shimul-root',
    name: 'OPAR Heritage Shimul Root (Red Silk Cotton Root)',
    authenticScript: 'शाल्मली (Shalmali)',
    scriptLanguage: 'Sanskrit & Lineage',
    botanicalLatin: 'Bombax ceiba',
    traditionalTcm: '木棉根 (Mù Mián Gēn)',
    bengaliName: 'শিমুল মূল (Shimul Mool)',
    tagline: 'Primal vitality rooted in the earth.',
    description: 'Sun-cured organic taproots of the red silk cotton tree (Salmali / Bombax ceiba). The legendary eastern restorative for stamina, cooling systemic inflammation, and deep vitality.',
    longDescription: 'Shimul Root (Salmali / Bombax ceiba) is one of the most treasured botanical secrets of traditional Eastern herbalism. Acting as a deeply nourishing demulcent and adaptogenic tonic, it pacifies irritated tissues, relieves internal heat, and restores core stamina and vigor without aggressive stimulants. We harvest young, potent root taproots, sun-dry them slowly under clean natural air, and crush them into a silky, unadulterated botanical powder.',
    price: 29,
    supplierCost: 8.00,
    supplierSku: 'AYUR-SHIMUL-007',
    stock: 48,
    category: 'Ayurvedic Botanicals',
    imageUrl: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Pure Bombax Ceiba Root', 'Traditional Sun-Cured & Stone-Milled', 'Zero Chemicals, Artificial Flavors, or Starch', 'Revered Traditional Tonic for Stamina & Calm'],
    variants: ['150g Pure Stone-Ground Powder', '100g Sun-Dried Root Slices', '300g Apothecary Glass Jar'],
    rating: 4.98,
    reviewCount: 51,
    origin: 'Traditional Heritage Agro-Forestry, Sylhet & Rajshahi'
  },

  // 2. SUFI MYSTICISM & MARIFAT
  {
    id: 'baba-jahangir-gopan-kotha',
    name: 'Marefater Gopan Kotha: Esoteric Gnosis',
    authenticScript: 'মারেফাতের গোপন কথা',
    scriptLanguage: 'Bengali (Authorized Heritage Text)',
    bengaliName: 'মারেফাতের গোপন কথা — ড. বাবা জাহাঙ্গীর',
    tagline: 'The esoteric secrets of inner gnosis.',
    description: 'By Dr. Qalandar Baba Jahangir Ba-Iman Al Sureshwari. The foundational masterwork unveiling the inner secrets of Marifat, self-purification, and divine union.',
    longDescription: 'A monumental text in Bengali Sufi literature. Dr. Baba Jahangir strips away external religious sectarianism to reveal the esoteric core of Islamic mysticism. He articulates the stations of the spiritual heart (Qalb), the transformation of the lower ego (Nafs), and the inner reality of the Fakir. An indispensable guide for any seeker walking the path of inner realization.',
    price: 36,
    supplierCost: 12.00,
    supplierSku: 'SUFI-BABA-001',
    stock: 50,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Original Authorized Edition', 'Foreword on Sureshwari Sufi Lineage', 'Includes Aphorisms on Meditation (Dhyan)', 'Acid-Free Archival Paper'],
    variants: ['Hardcover Bengali Edition', 'English Translation Monograph', 'Digital eBook & PDF Bundle'],
    rating: 4.98,
    reviewCount: 67,
    origin: 'Dhaka Sufi Publishing Guild',
    language: 'Bengali / English Commentary'
  },
  {
    id: 'baba-jahangir-atto-porichoy',
    name: 'Sufism is the Only Path to Self-Identity (Vols 1–4)',
    authenticScript: 'সুফিবাদ আত্মপরিচয়ের একমাত্র পথ',
    scriptLanguage: 'Bengali (Authorized Heritage Text)',
    bengaliName: 'সুফিবাদ আত্মপরিচয়ের একমাত্র পথ (১ম-৪র্থ খণ্ড)',
    tagline: 'Know thy soul to know thy Lord.',
    description: 'Dr. Baba Jahangir’s comprehensive 4-volume opus on self-realization through Sufism. Bridging mystical contemplation and practical everyday ethics.',
    longDescription: 'Rooted in the timeless prophetic axiom "He who knows himself knows his Lord," this 4-volume set guides the dervish step-by-step through self-observation, meditation (Muraqabah), divine longing (Ishq), and universal human compassion.',
    price: 64,
    supplierCost: 24.00,
    supplierSku: 'SUFI-BABA-002',
    stock: 35,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Complete 4-Volume Collector Boxed Set', 'Comprehensive Commentary on Self-Knowledge', 'Annotated Passages on Murshid & Disciple', 'Embossed Gold Foil Clothbound Spines'],
    variants: ['Complete 4-Volume Boxed Set', 'Digital Complete Edition'],
    rating: 4.96,
    reviewCount: 41,
    origin: 'Sureshwar Darbar Sharif Archive',
    language: 'Bengali'
  },
  {
    id: 'sadaruddin-chishti-quran-dorshon',
    name: 'Quran Dorshon: The Philosophy of the Holy Quran',
    authenticScript: 'কোরান দর্শন (অখণ্ড)',
    scriptLanguage: 'Chishti Sufi Order',
    bengaliName: 'কোরান দর্শন (অখণ্ড) — শাহ্ সুফি সদর উদ্দিন আহ্ মদ চিশতী',
    tagline: 'The esoteric inner depths of the sacred word.',
    description: 'By Mawla Shah Sufi Sadar Uddin Ahmad Chishty. An extraordinary multi-volume metaphysical exploration uncovering the esoteric wisdom (Batin) of the Quran.',
    longDescription: 'Sufi Sadar Uddin Ahmad Chishty of the Chishti Sufi order presents an awe-inspiring philosophical interpretation of the Quran. Rather than viewing the scripture merely as outward law, he unpacks its deep psychological and cosmic dimensions—how every verse mirrors the landscape of human consciousness, spiritual ascent, and unity with the Divine.',
    price: 48,
    supplierCost: 16.00,
    supplierSku: 'SUFI-CHISHTI-003',
    stock: 38,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Unabridged Complete Edition (Okhondo)', 'Chishti Spiritual Esoteric Tafsir', 'Foreword on Sador Uddin Chishti’s Philosophy', 'Premium Library Binding'],
    variants: ['Deluxe Hardcover Edition', 'Softcover Study Edition'],
    rating: 4.99,
    reviewCount: 58,
    origin: 'Imamia Chistia Research Foundation',
    language: 'Bengali / Arabic Verses'
  },
  {
    id: 'sadaruddin-chishti-mawla-ali',
    name: 'Mawlar Avishek: The Sovereignty of Hazrat Ali',
    authenticScript: 'মাওলার অভিষেক (গাদীরে খুম)',
    scriptLanguage: 'Chishti Sufi Order',
    bengaliName: 'মাওলার অভিষেক (গাদীরে খুম)',
    tagline: 'The gateway to mystical knowledge.',
    description: 'By Sufi Sadar Uddin Ahmad Chishty. A profound historic and spiritual study of Ghadir Khumm and the spiritual sovereignty (Wilayah) of Hazrat Ali.',
    longDescription: 'Examining the inner meaning of the prophetic declaration "Whoever takes me as his Mawla, Ali is his Mawla." Chishty explores how Hazrat Ali stands as the perennial fountainhead of all Sufi lineages, embodying courage, profound detachment, and supreme divine knowledge.',
    price: 29,
    supplierCost: 9.50,
    supplierSku: 'SUFI-CHISHTI-004',
    stock: 42,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Rigorous Historical & Mystical References', 'Translations of Authentic Hadith & Sūrahs', 'English & Bengali Bilingual Edition Available', 'Collector Quality Typography'],
    variants: ['Bengali Edition', 'English Translation (The Anointing of Mawla Ali)', 'Both Editions Bundle'],
    rating: 4.97,
    reviewCount: 39,
    origin: 'Ramon Publishers & Chishti Archive',
    language: 'Bengali & English'
  },
  {
    id: 'hazrat-ali-nahjul-balagha',
    name: 'Nahj al-Balāghah: The Peak of Eloquence',
    authenticScript: 'نهج البلاغة — أمير المؤمنين علي بن أبي طالب',
    scriptLanguage: 'Classical Arabic',
    tagline: 'The supreme sermons on asceticism and the soul.',
    description: 'By Hazrat Ali ibn Abi Talib (a.s.). Sermons, letters, and timeless aphorisms on Zuhd (ascetic detachment), conquering egoic desires, and supreme divine justice.',
    longDescription: 'Celebrated across world literature for its unmatched Arabic eloquence and spiritual depth. Hazrat Ali’s words on asceticism, the fleeting nature of worldly illusions, and the inner discipline required to rule oneself remain unequaled. A foundational pillar for anyone seeking to conquer the restless mind.',
    price: 42,
    supplierCost: 14.00,
    supplierSku: 'SUFI-ALI-005',
    stock: 50,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Complete Unabridged Text', 'Available in English and Arabic', 'Commentary on Asceticism (Zuhd) & Justice', 'Debossed Gold Foil Hardcover'],
    variants: ['English Deluxe Hardcover (Translated by Sayed Ali Reza)', 'Arabic Classical Text', 'Bilingual Edition'],
    rating: 5.0,
    reviewCount: 94,
    origin: 'Dar al-Thaqafah Islamic Heritage',
    language: 'English / Arabic'
  },
  {
    id: 'rumi-masnavi',
    name: 'The Masnavi-ye Ma\'navi: Complete 6 Books',
    authenticScript: 'مثنوی معنوی — مولانا جلال‌الدین محمد بلخی رومی',
    scriptLanguage: 'Classical Persian (Farsi)',
    tagline: 'The flute carved from the heart.',
    description: 'By Maulana Jalaluddin Rumi. The supreme masterpiece of Persian Sufi poetry. The spiritual journey of the soul returning to the Beloved.',
    longDescription: 'Rumi’s Masnavi is the Quran in Persian verse—a vast ocean of allegory, teaching stories, and ecstatic divine longing. From the opening lament of the reed flute torn from its reed-bed, Rumi guides the human heart to surrender trivial desires and awaken into universal divine love.',
    price: 52,
    supplierCost: 18.00,
    supplierSku: 'SUFI-RUMI-006',
    stock: 45,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Scholarly Translation by Reynold A. Nicholson / E.H. Whinfield', 'Complete 6 Books with Extensive Notes', 'Clothbound Heirloom Binding', 'Includes Introduction on Shams Tabrizi'],
    variants: ['Nicholson English Translation (Clothbound)', 'Persian & English Dual-Language Edition', 'Compact Pilgrim Edition'],
    rating: 4.99,
    reviewCount: 88,
    origin: 'Threshold Sufi Society Archive',
    language: 'English / Persian (Farsi)'
  },
  {
    id: 'ibn-arabi-fusus',
    name: 'Fusus al-Hikam: The Ringstones of Wisdom',
    authenticScript: 'فصوص الحكم — الشيخ الأكبر محيي الدين ابن عربي',
    scriptLanguage: 'Classical Arabic',
    tagline: 'The unity of all existence.',
    description: 'By Shaykh al-Akbar Muhyiddin Ibn al-Arabi. The crowning achievement of Islamic metaphysics on Wahdat al-Wujud (The Unity of Being).',
    longDescription: 'Ibn Arabi’s masterpiece reveals how each of the 27 great prophets represents a unique jewel and facet of divine consciousness. A profound text exploring how the universe is the perpetual self-disclosure of the Divine, and how the purified heart becomes the mirror for the Infinite.',
    price: 38,
    supplierCost: 13.00,
    supplierSku: 'SUFI-ARABI-007',
    stock: 30,
    category: 'Sufi Mysticism & Marifat',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Authorized Translation by R.W.J. Austin / Caner Dagli', 'Extensive Introduction by Titus Burckhardt', 'Scholarly Glossary of Sufi Terminology', 'Library Quality Binding'],
    variants: ['Hardcover Edition', 'Paperback Academic Edition'],
    rating: 4.97,
    reviewCount: 42,
    origin: 'Muhyiddin Ibn Arabi Society (MIAS)',
    language: 'English / Arabic Glossary'
  },

  // 3. YOGA & EASTERN WISDOM
  {
    id: 'aura-book-yogasutras',
    name: 'The Yoga Sūtras of Patañjali',
    authenticScript: 'पातञ्जलयोगसूत्राणि',
    scriptLanguage: 'Classical Sanskrit',
    tagline: 'The foundational map of human consciousness.',
    description: 'Clothbound heirloom edition. Sanskṛt text with word-by-word philosophical commentary on the Eight Limbs of Yoga (Ashtanga) and the stilling of mental fluctuations.',
    longDescription: 'Yogas chitta vritti nirodha—"Yoga is the stilling of the fluctuations of consciousness." Patañjali’s 196 aphorisms form the spiritual blueprint for liberating the soul from desire, egoic attachment, and suffering. Bound in unbleached linen with foil stamping and acid-free archival paper.',
    price: 32,
    supplierCost: 11.00,
    supplierSku: 'BOOK-SUTRA-008',
    stock: 40,
    category: 'Yoga & Eastern Wisdom',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Original Sanskrit with Devanāgarī Script', 'Word-by-word Analysis & Commentary', 'Unbleached Linen Clothbound Spine', 'Ribbon Bookmark & Archival Paper'],
    variants: ['Linen Clothbound Hardcover', 'Pocket Pilgrim Paperback'],
    rating: 4.96,
    reviewCount: 38,
    origin: 'Printed by Master Guild Artisans'
  },
  {
    id: 'aura-book-gita',
    name: 'The Bhagavad Gītā: Song of the Self',
    authenticScript: 'श्रीमद्भगवद्गीता',
    scriptLanguage: 'Classical Sanskrit',
    tagline: 'Surrendering the fruits of desire.',
    description: 'An illuminating translation of the sacred dialogue between Krishna and Arjuna on the battlefield of life. The supreme treatise on Karma Yoga and detachment.',
    longDescription: 'When Arjuna collapses in paralysis between duty and attachment, Krishna reveals the timeless truth of the immortal Self (Atman). The Gita teaches the ultimate spiritual science: how to act dynamically in the world while remaining free from craving for results (Nishkama Karma).',
    price: 28,
    supplierCost: 9.50,
    supplierSku: 'BOOK-GITA-009',
    stock: 55,
    category: 'Yoga & Eastern Wisdom',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Verse-by-Verse Poetic English Translation', 'Introduction on Karma, Bhakti, and Jnana', 'Hardcover with Debossed Typography', 'FSC-Certified Environmental Paper'],
    variants: ['Heirloom Hardcover', 'Paperback Edition'],
    rating: 4.98,
    reviewCount: 62,
    origin: 'Vedic Literary Archive'
  },
  {
    id: 'aura-book-buddha',
    name: 'The Heart of the Buddha\'s Teaching',
    authenticScript: '四圣谛与八正道 • Bodhi Heart',
    scriptLanguage: 'Zen & Classical Buddhist',
    tagline: 'Transforming suffering into peace.',
    description: 'By Zen Master Thich Nhat Hanh. A compassionate, lucid introduction to the Four Noble Truths, the Noble Eightfold Path, and living with Bodhi awareness.',
    longDescription: 'Thich Nhat Hanh shows us that suffering and peace are not two separate things; like mud and lotus, suffering is the soil from which compassion blooms. His gentle prose unpacks the core teachings of Siddhartha Gautama with clarity and practical wisdom for modern living.',
    price: 24,
    supplierCost: 8.00,
    supplierSku: 'BOOK-BUDDHA-010',
    stock: 60,
    category: 'Yoga & Eastern Wisdom',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Authorized Plum Village Publication', 'Accessible Commentary on Buddhist Wisdom', 'Includes Daily Breathing Gathas', 'Recycled Natural Fiber Paper'],
    variants: ['Paperback Edition', 'Hardcover Edition'],
    rating: 4.94,
    reviewCount: 47,
    origin: 'Plum Village Community'
  },

  // 4. PHILOSOPHY & EXISTENTIALISM
  {
    id: 'nietzsche-zarathustra',
    name: 'Thus Spoke Zarathustra (Also sprach Zarathustra)',
    authenticScript: 'Also sprach Zarathustra: Ein Buch für Alle und Keinen',
    scriptLanguage: 'Original German',
    tagline: 'The courage of self-overcoming.',
    description: 'By Friedrich Nietzsche. The philosophical masterpiece on overcoming the petty herd mentality, finding your own sacred values, and loving your fate (Amor Fati).',
    longDescription: 'Nietzsche’s prophetic prose poem follows Zarathustra descending from his mountain cave to challenge humanity to transcend mediocrity and guilt. Nietzsche’s profound critique of hollow asceticism challenges the seeker to create genuine spiritual strength rather than escaping life.',
    price: 28,
    supplierCost: 9.00,
    supplierSku: 'PHIL-NIETZ-011',
    stock: 44,
    category: 'Philosophy & Existentialism',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Celebrated Walter Kaufmann / R.J. Hollingdale Translation', 'Scholarly Introduction on the Übermensch & Will to Power', 'Heirloom Linen Spine', 'Complete Unabridged Text'],
    variants: ['Hardcover Collector Edition', 'Paperback Edition'],
    rating: 4.93,
    reviewCount: 54,
    origin: 'European Philosophical Guild'
  },
  {
    id: 'nietzsche-beyond-good',
    name: 'Beyond Good and Evil: Prelude to a Philosophy of the Future',
    authenticScript: 'Jenseits von Gut und Böse',
    scriptLanguage: 'Original German',
    tagline: 'Piercing the veil of dogmatic thought.',
    description: 'By Friedrich Nietzsche. A blistering dissection of human morality, dogma, and the courage required to think without societal illusion.',
    longDescription: 'Nietzsche exposes the hidden motives behind philosophical systems and cultural morality. A brilliant intellectual companion to eastern non-dual philosophy, urging the individual to rise above black-and-white duality into radical self-honesty.',
    price: 24,
    supplierCost: 8.00,
    supplierSku: 'PHIL-NIETZ-012',
    stock: 38,
    category: 'Philosophy & Existentialism',
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Complete Unabridged Text', 'Critical Aphorisms Annotated', 'Archival Quality Printing', 'FSC-Certified Environmental Paper'],
    variants: ['Paperback Edition', 'Hardcover Edition'],
    rating: 4.9,
    reviewCount: 36,
    origin: 'Modern Library Classics'
  },

  // 5. SACRED SOUND & MUSIC
  {
    id: 'aura-singing-bowl',
    name: 'OPAR 432Hz Himalayan Singing Bowl',
    authenticScript: 'नाद कांस्य पात्र (Nāda Pātra) • 432 Hz',
    scriptLanguage: 'Himalayan Bronze Tradition',
    tagline: 'A frequency that settles the pulse.',
    description: 'Hand-hammered seven-metal bell alloy crafted in the Kathmandu valley. Tuned to 432Hz sacred resonance for deep nervous system calming and heart coherence.',
    longDescription: 'Hand-hammered by master Himalayan artisans using traditional acoustic bronze. When circled with the rosewood and leather mallet, it generates rich oscillating harmonic overtones that resonate for up to 90 seconds, gently entraining brainwaves into restorative alpha and theta states.',
    price: 82,
    supplierCost: 26.00,
    supplierSku: 'SND-BOWL-013',
    stock: 14,
    category: 'Sacred Sound & Music',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Traditional 7-Metal Bell Bronze', 'Precision Tuned to 432 Hz', 'Rosewood & Suede Striker Included', 'Hand-Stitched Ring Cushion'],
    variants: ['Medium Bowl (14cm Diameter)', 'Deep Resonance (18cm Diameter)'],
    rating: 4.97,
    reviewCount: 31,
    origin: 'Patan, Kathmandu Valley'
  },
  {
    id: 'aura-music-sufi-ney',
    name: 'The Breath of Rumi: Sufi Ney & Daf Suites',
    authenticScript: 'نغمه نی و دف • Mevlevi Sufi Acoustics',
    scriptLanguage: 'Ottoman Turkish & Persian',
    tagline: 'Acoustic lament of the sacred reed flute.',
    description: 'High-resolution lossless digital audio album (24-bit / 96kHz FLAC & MP3). Masterful Turkish and Persian Ney flute improvisations with frame drum (Daf).',
    longDescription: 'Instant digital audio download with zero shipping. Recorded inside a Mevlevi tekke courtyard. The hollow reed of the Ney mirrors the empty ego through which divine breath sings. Perfect for Muraqaba (Sufi contemplation), yoga, or deep reading.',
    price: 19,
    supplierCost: 0.00,
    supplierSku: 'SND-NEY-014',
    stock: 999,
    category: 'Sacred Sound & Music',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['High-Resolution 24-bit FLAC + 320kbps MP3', 'Over 82 Minutes of Sacred Sufi Acoustics', 'Includes Digital Booklet of Rumi’s Poetry', 'Instant Secure Download Link'],
    variants: ['Digital Download (Lossless FLAC & MP3)', 'Deluxe Bundle with Liner Poetry Guide'],
    rating: 5.0,
    reviewCount: 46,
    origin: 'Konya & Istanbul Sufi Sanctuary',
    format: 'Digital Download'
  },
  {
    id: 'aura-music-bansuri',
    name: 'Bansuri & Tanpura Twilight Ragas',
    authenticScript: 'वंशी नाद • Rāga Dhyāna',
    scriptLanguage: 'Indian Classical Tradition',
    tagline: 'Acoustic breathing of the Indian bamboo flute.',
    description: 'High-resolution lossless digital audio album. Masterful twilight ragas played by Indian maestro Pandit Hariprasad disciples.',
    longDescription: 'Recorded in Varanasi at dusk. The pure tone of the natural bamboo flute supported by the continuous drone of the acoustic tanpura creates an unbroken field of stillness for meditation and inner silence.',
    price: 19,
    supplierCost: 0.00,
    supplierSku: 'SND-FLUTE-015',
    stock: 999,
    category: 'Sacred Sound & Music',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['High-Resolution 24-bit Lossless Audio', '78 Minutes of Contemplative Drone & Flute', 'Zero Digital Compression', 'Instant Delivery Link'],
    variants: ['Instant Digital Download (FLAC & MP3)'],
    rating: 4.99,
    reviewCount: 34,
    origin: 'Varanasi Acoustic Sanctuary',
    format: 'Digital Download'
  },

  // 6. ORGANIC QUIET TECH & MOVEMENT
  {
    id: 'aura-cork-mat',
    name: 'OPAR Grounded Cork Yoga Mat',
    authenticScript: 'Yoga Āsana • Terra Firma',
    scriptLanguage: 'Sanskrit & Latin',
    tagline: 'Grip rooted in the earth.',
    description: 'Sustainably harvested Mediterranean oak cork bonded to a dense natural tree-rubber underlay. Non-toxic, moisture-activated grip, and plastic-free.',
    longDescription: 'Crafted without PVC, synthetic foams, or petroleum glues. Cork contains natural suberin—a waxy compound that increases grip as hands warm. The 4.5mm natural tree rubber base anchors firmly to the floor, protecting joints during prolonged asana holds.',
    price: 94,
    supplierCost: 32.00,
    supplierSku: 'YOG-CORK-016',
    stock: 28,
    category: 'Organic Quiet Tech',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Organic Renewable Oak Cork', '4.5mm High-Density Natural Rubber', 'Naturally Antimicrobial & Odor-Repelling', 'Includes Unbleached Cotton Carry Strap'],
    variants: ['Standard (183cm x 61cm)', 'Extra Wide Edition (188cm x 68cm)'],
    rating: 4.95,
    reviewCount: 42,
    origin: 'Alentejo, Portugal'
  },
  {
    id: 'aura-zafu',
    name: 'OPAR Belgian Linen Zafu Cushion',
    authenticScript: '座蒲 (Zafu) • ध्यान आसन',
    scriptLanguage: 'Zen & Sanskrit Tradition',
    tagline: 'Posture for still minds.',
    description: 'Traditional round meditation zafu sewn from unbleached Belgian stonewashed linen and stuffed with organic buckwheat hulls.',
    longDescription: 'The Zafu gently elevates the pelvis, allowing the spine to effortlessly align its natural curves without muscular strain. Filled with organic buckwheat hulls that shift and contour to your anatomy, maintaining airflow and cool comfort during prolonged sitting.',
    price: 68,
    supplierCost: 21.00,
    supplierSku: 'YOG-ZAFU-017',
    stock: 22,
    category: 'Organic Quiet Tech',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Unbleached Stonewashed Linen', 'Organic Buckwheat Hull Fill', 'Concealed Zipper to Adjust Height', 'Reinforced Carry Handle'],
    variants: ['Warm Oat Cream', 'Earthy Charcoal', 'Raw Terracotta'],
    rating: 4.92,
    reviewCount: 26,
    origin: 'Flanders, Belgium'
  },
  {
    id: 'aura-diffuser',
    name: 'OPAR Ultrasonic Stone Mist Diffuser',
    authenticScript: 'Silentium Aromatica',
    scriptLanguage: 'Classical Latin',
    tagline: 'Mist from raw porcelain.',
    description: 'Handcrafted matte ceramic porcelain casing that diffuses botanical essential oils using silent cold ultrasonic oscillation.',
    longDescription: 'Cast in heavy porcelain with a refined matte glaze. At 2.5 million vibrations per second, cold ultrasonic mist disperses pure Frankincense, Sandalwood, or Cedarwood without heating, safeguarding the delicate therapeutic volatile compounds.',
    price: 118,
    supplierCost: 38.00,
    supplierSku: 'TECH-DIFFUSE-018',
    stock: 31,
    category: 'Organic Quiet Tech',
    imageUrl: 'https://images.pexels.com/photos/8092420/pexels-photo-8092420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    gallery: [
      'https://images.pexels.com/photos/8092420/pexels-photo-8092420.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    ],
    features: ['Cast Matte Porcelain Cover', 'Silent Cold Ultrasonic Mist', 'Warm 2700K Candle Ambient Glow', 'Automatic Shut-off When Empty'],
    variants: ['Sandstone Cream', 'Basalt Charcoal'],
    rating: 4.88,
    reviewCount: 37,
    origin: 'Jingdezhen Kiln'
  },
  {
    id: 'aura-beam-lamp',
    name: 'OPAR Circadian Sunset Glow Lamp',
    authenticScript: 'Lux Circadiana • 1800K',
    scriptLanguage: 'Classical Latin',
    tagline: 'Light that breathes with the sun.',
    description: 'Solid lathe-turned walnut base with a hand-blown frosted glass sphere. Casts an 1800K amber glow free of melatonin-suppressing blue light.',
    longDescription: 'Artificial blue light fractures natural circadian architecture. OPAR Beam transitions gently into a soft amber candlelight glow (1800K) at sunset, signaling to your brain to produce melatonin and prepare for restorative sleep.',
    price: 185,
    supplierCost: 65.00,
    supplierSku: 'TECH-BEAM-019',
    stock: 18,
    category: 'Organic Quiet Tech',
    imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Zero Sleep-Disrupting Blue Light', 'Solid American Walnut Base', 'Hand-Blown Frosted Glass', 'Analog Brass Rotary Dimmer'],
    variants: ['Natural Walnut', 'Smoked Black Ash'],
    rating: 4.9,
    reviewCount: 28,
    origin: 'Portland Woodcraft Guild'
  },
  {
    id: 'aura-copper-vessel',
    name: 'OPAR Hammered Pure Copper Water Carafe (Tamra Jal)',
    authenticScript: 'ताम्र जल पात्र (Tāmra Jala Pātra)',
    scriptLanguage: 'Ayurvedic Sanskrit',
    tagline: 'Ancient vessel of ionized vitality.',
    description: '100% pure heavy-gauge hammered copper (Cu > 99.7%). Naturally ionizes, alkalizes, and balances drinking water overnight through the Ayurvedic Tamra Jal tradition.',
    longDescription: 'In classical Ayurveda and Hatha Yoga, storing spring water in pure copper vessels overnight destroys pathogens through the oligodynamic effect and balances all three doshas (Vata, Pitta, Kapha). Hand-hammered by traditional brass and copper coppersmiths from a single solid sheet with zero lead, nickel, or chemical inner linings. Drink one cup on an empty stomach at dawn to gently awaken digestion and cellular energy.',
    price: 48,
    supplierCost: 16.00,
    supplierSku: 'YOG-COPPER-020',
    stock: 34,
    category: 'Yoga & Sacred Materials',
    imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['100% Unlined Heavy Gauge Pure Copper', 'Hand-Hammered Texture by Heritage Guild', 'Naturally Antibacterial & Ionizing', 'Leak-Proof Solid Copper Cap with Silicone Seal'],
    variants: ['950ml Hand-Hammered Carafe', '1200ml Temple Pitcher with Tumbler'],
    rating: 4.97,
    reviewCount: 39,
    origin: 'Heritage Coppersmith Guild, Moradabad'
  },
  {
    id: 'aura-kusha-mat',
    name: 'OPAR Handwoven Kusha Grass Asana Mat',
    authenticScript: 'पवित्र कुशास्तरण (Pavitra Kuśāsana)',
    scriptLanguage: 'Classical Sanskrit',
    botanicalLatin: 'Desmostachya bipinnata',
    tagline: 'Insulating the mind for deep Dharana.',
    description: 'Sacred wild Kusha grass (Desmostachya bipinnata) handwoven with organic unbleached cotton warp. Revered in the Bhagavad Gita as the ultimate non-conductive meditation seat.',
    longDescription: 'In Chapter 6 of the Bhagavad Gita, Lord Krishna describes the ideal seat of meditation: a firm base of sacred Kusha grass covered with a cloth. Kusha grass possesses unique electromagnetic insulating properties, preventing the subtle spiritual energy (Prana) generated during deep meditation from discharging into the ground.',
    price: 36,
    supplierCost: 11.00,
    supplierSku: 'YOG-KUSHA-021',
    stock: 26,
    category: 'Yoga & Sacred Materials',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Hand-Harvested Wild Kusha Grass', 'Organic Unbleached Cotton Threading', 'Natural Earth Grounding & Insulation', 'Folds Flat with Cotton Ribbon Tie'],
    variants: ['Standard Meditation Mat (60cm x 90cm)', 'Full Asana Mat (70cm x 180cm)'],
    rating: 4.93,
    reviewCount: 22,
    origin: 'Ganges River Valley Artisan Collective'
  },
  {
    id: 'aura-brass-timer',
    name: 'OPAR Analog Brass Sand & Chime Meditation Timer',
    authenticScript: 'Chronos Metallicus • Analog Contemplation',
    scriptLanguage: 'Classical Latin',
    tagline: 'Time measured in flowing earth, not glowing pixels.',
    description: 'Solid heavy machined brass hour-glass casing with volcanic black sand and single singing acoustic chime. 30-minute and 45-minute silent contemplative flow.',
    longDescription: 'True quiet technology requires replacing digital smartphone timers with physical analog contemplation. Turn the heavy brass housing to begin your meditation or reading ritual. As the last grain of volcanic silica falls, a gentle mechanical acoustic striker gently chimes once on a bronze bell, gently awakening you from silence without dopamine spikes.',
    price: 58,
    supplierCost: 19.50,
    supplierSku: 'TECH-TIMER-022',
    stock: 20,
    category: 'Organic Quiet Tech',
    imageUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000',
    gallery: [
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000'
    ],
    features: ['Solid Machined Unlacquered Brushed Brass', 'Natural Volcanic Silica Black Sand', 'Single Mechanical Strike Bronze Chime', 'Zero Screens, Bluetooth, or RF Radiation'],
    variants: ['30-Minute Sitting Timer', '45-Minute Deep Contemplation Timer'],
    rating: 4.96,
    reviewCount: 35,
    origin: 'Artisanal Brassworks, Kyoto & Florence'
  }
];

export const CATEGORIES_CATALOG: CategoryInfo[] = [
  {
    slug: 'ayurvedic-botanicals',
    title: 'Ayurvedic Pure Herbs',
    tagline: 'Unadulterated roots, whole sun-dried herbs, and pure single-ingredient powders.',
    quoteOriginalScript: 'हिताहितं सुखं दुःखमायुस्तस्य हिताहितम् । मानं च तच्च यत्रोक्तमायुर्वेदः स उच्यते ॥',
    quote: 'When diet and herbs are pure, the body cleanses itself; when the inner nature is stilled, disease finds no lodging.',
    quoteAuthor: 'Charaka Samhita (Caraka-Saṃhitā, Sutrasthana)',
    description: 'Our botanicals represent pure, single-origin sourcing from wild harvest collectives and regenerative farms. We offer only raw, sun-cured roots and stone-milled powders — strictly free of synthetic anti-caking agents, chemical solvents, preservatives, or artificial extracts. From KSM-66 Ashwagandha to wild sun-dried Cloves (Syzygium aromaticum / 丁香), pure bitter Neem (Azadirachta indica / 印楝), and restorative Shimul root (Bombax ceiba / 木棉根), each plant serves to restore balance (Sattva) and ground inner agitation.',
    subcategories: ['All', 'Roots & Barks', 'Pure Leaf Powders', 'Sacred Herbs & Teas', 'Mineral Resins'],
    matchesProduct: (p) => p.category === 'Ayurvedic Botanicals'
  },
  {
    slug: 'sacred-texts-philosophy',
    title: 'Books & Sacred Texts',
    tagline: 'Timeless treatises on Marifat, ascetic detachment, and the courage of self-overcoming.',
    quoteOriginalScript: 'مَنْ عَرَفَ نَفْسَهُ فَقَدْ عَرَفَ رَبَّهُ — بشنو این نی چون حکایت می‌کند',
    quote: 'He who knows himself knows his Lord. Silence is the gate of wisdom, and detachment is the king of peace.',
    quoteAuthor: 'Hazrat Ali ibn Abi Talib (a.s.) & Maulana Jalaluddin Rumi',
    description: 'A curated library of genuine spiritual authority, bridging Sufi mysticism (Irfan & Marifat), eastern wisdom, and radical existential philosophy. Featuring authoritative works by Dr. Qalandar Baba Jahangir, Mawla Shah Sufi Sadar Uddin Ahmad Chishty, Nahj al-Balaghah of Hazrat Ali, Rumi’s Masnavi, Ibn Arabi, the Yoga Sutras, Bhagavad Gita, and Nietzsche’s Thus Spoke Zarathustra. Procured through historical cultural foundations and non-commercial publishing guilds to protect authentic lineages from corporate inflation.',
    subcategories: ['All', 'Sufi Mysticism & Marifat', 'Eastern Wisdom & Yoga', 'Philosophy & Existentialism', 'Classical Lineage Texts'],
    matchesProduct: (p) => 
      p.category === 'Sufi Mysticism & Marifat' || 
      p.category === 'Yoga & Eastern Wisdom' || 
      p.category === 'Philosophy & Existentialism'
  },
  {
    slug: 'sacred-sound-music',
    title: 'Sacred Music & Sound',
    tagline: 'Harmonics and acoustic instruments crafted to settle the wandering mind.',
    quoteOriginalScript: 'بشنو از نی چون حکایت می‌کند / از جدایی‌ها شکایت می‌کند',
    quote: 'Listen to the reed flute how it tells its tale, complaining of separation: Ever since I was torn from the reed-bed, my lament has moved men and women to tears.',
    quoteAuthor: 'Maulana Jalaluddin Rumi (Masnavi Book 1)',
    description: 'Sound is the primal vibration (Nada Brahma) through which consciousness coalesces. Our collection includes hand-hammered 432Hz Himalayan singing bowls cast in seven bell bronzes, lossless acoustic recordings of the Turkish and Persian Sufi Ney flute, and contemplative Varanasi Bansuri raga drones. Each frequency is specifically selected to down-regulate nervous system arousal, dissolve anxiety, and deepen meditation.',
    subcategories: ['All', 'Singing Bowls & Bronze', 'Sufi Acoustic Albums', 'Bansuri & Drone Soundscapes'],
    matchesProduct: (p) => p.category === 'Sacred Sound & Music'
  },
  {
    slug: 'organic-quiet-tech',
    title: 'Organic Electronics',
    tagline: 'Mindful electronics designed to respect human attention and circadian biology.',
    quoteOriginalScript: 'अपरिग्रहस्थैर्ये जन्मकथंतासंबोधः',
    quote: 'When contentment and non-possessiveness are established, the mind ceases its frantic grasping and awakens to true stillness.',
    quoteAuthor: 'Yoga Sutras of Patanjali (2.39)',
    description: 'The founding foundation of OPAR: technology that refuses to scream for your dopamine. We replace glowing notification displays and intrusive blue light with tactile porcelain mist diffusers, soothing 1800K circadian sunset lamps, and analog brushed brass sand timers. Crafted from authentic natural materials — heavy ceramic, turned American walnut, and unlacquered brass — to support a sanctuary free of digital noise.',
    subcategories: ['All', 'Circadian Lighting', 'Ultrasonic Stone Diffusers', 'Analog Brass Contemplation Timers'],
    matchesProduct: (p) => p.category === 'Organic Quiet Tech' && (p.id.includes('diffuse') || p.id.includes('lamp') || p.id.includes('timer'))
  },
  {
    slug: 'yoga-materials',
    title: 'Yoga Materials',
    tagline: 'Pure natural materials to support physical stillness and grounded sadhana.',
    quoteOriginalScript: 'शुचौ देशे प्रतिष्ठाप्य स्थिरमासनमात्मनः । नात्युच्छ्रितं नातिनीचं चैलाजिनकुशोत्तरम् ॥',
    quote: 'In a clean and sacred spot, establishing a firm seat of meditation, neither too high nor too low, covered with sacred Kusha grass, a deerskin, and a cloth.',
    quoteAuthor: 'The Bhagavad Gita (Chapter 6, Verse 11)',
    description: 'In authentic yoga and ascetic sadhana, the materials you sit and practice upon directly influence mental stability. We supply zero-plastic natural oak cork mats, Belgian linen zafu meditation cushions stuffed with organic buckwheat hulls, hand-hammered pure copper vessels for Ayurvedic dawn water ionization (Tamra Jal), and sacred handwoven Kusha grass mats mentioned in classical scriptures for energy insulation.',
    subcategories: ['All', 'Asana Mats & Cushions', 'Copper & Pure Vessels', 'Kusha Grass Seats'],
    matchesProduct: (p) => 
      p.category === 'Yoga & Sacred Materials' || 
      (p.category === 'Organic Quiet Tech' && (p.id.includes('mat') || p.id.includes('zafu')))
  }
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 1,
    title: "The Song of the Reed: Maulana Rumi on the Ney & Divine Longing",
    date: "October 14, 2026",
    authorSage: "Maulana Jalaluddin Rumi (Mevlevi Sufi Tradition)",
    youtubeId: "nUvGf0rSrqk", // Authentic Sufi Ney & Masnavi recital
    videoTitle: "The Sacred Ney Flute: The Opening Lament of Rumi’s Masnavi",
    excerpt: "Why the opening 18 couplets of the Masnavi compare the human soul to a hollow reed flute yearning for its origin.",
    image: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "\"Listen to the reed how it complains, telling a tale of separations: Ever since I was cut from the reed-bed, my wailing has caused man and woman to weep.\""
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "So begins the Masnavi of Maulana Rumi—perhaps the greatest spiritual poem ever penned. In Sufism, the Ney (bamboo reed flute) is the universal symbol of the purified human being. The bamboo had to be severed from its roots, hollowed of its inner pith, and pierced with burning holes before it could become an instrument through which the divine musician plays."
      ),
      React.createElement("blockquote", { className: "border-l border-[#2C2A26] pl-6 italic text-2xl text-[#2C2A26] my-10 font-serif leading-relaxed" },
        "\"We are the flute, and the music in us is from thee; we are the mountain, and the echo in us is from thee.\""
      ),
      React.createElement("p", { className: "mb-6 text-[#5D5A53] leading-relaxed" },
        "Our spiritual suffering in the modern world is not an illness; it is nostalgia. It is the cry of the severed reed longing to return to its eternal source. When we silence the petty ego, the breath of Truth flows unhindered through our lives."
      )
    )
  },
  {
    id: 2,
    title: "The Gate of Knowledge: Hazrat Ali on Asceticism (Zuhd) & Conquering Desire",
    date: "October 8, 2026",
    authorSage: "Amir al-Mu'minin Hazrat Ali (a.s.)",
    youtubeId: "V_J1b3pEWW0", // Teachings from Nahj al-Balagha on Wisdom and the Soul
    videoTitle: "Hazrat Ali’s Wisdom from Nahj al-Balaghah: Conquering the Lower Self",
    excerpt: "How the sermons of Nahj al-Balaghah provide the ultimate blueprint for mastering the mind, living simply, and finding contentment.",
    image: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "The Prophet of Islam famously proclaimed: \"I am the city of knowledge, and Ali is its gate.\" In the masterwork Nahj al-Balāghah (The Peak of Eloquence), Hazrat Ali unveils the anatomy of human greed and the liberation of asceticism (Zuhd)."
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "Hazrat Ali taught that true asceticism is not owning nothing; it is being owned by nothing. The wealthy person who is chained to anxiety over their possessions is a beggar in disguise; the ascetic who is content with water and a coarse cloak is the true emperor of the soul."
      ),
      React.createElement("blockquote", { className: "border-l border-[#2C2A26] pl-6 italic text-2xl text-[#2C2A26] my-10 font-serif leading-relaxed" },
        "\"The strongest person is the one who can overcome his own desires. Contentment (Qana'ah) is a wealth that never diminishes.\""
      ),
      React.createElement("p", { className: "mb-6 text-[#5D5A53] leading-relaxed" },
        "By disciplining the tongue, the belly, and the gaze, the inner eye opens to perceive the eternal. His teachings offer an unshakeable fortress against the endless consumer treadmill of contemporary existence."
      )
    )
  },
  {
    id: 3,
    title: "Marefater Gopan Kotha: Dr. Baba Jahangir on Self-Identity & The Fakir",
    date: "September 28, 2026",
    authorSage: "Dr. Qalandar Baba Jahangir (Sureshwari Tariqa)",
    youtubeId: "bO7y5q96Kk0", // Sufi contemplation on self-identity
    videoTitle: "Sufi Wisdom: Awakening the Inner Eye of Marifat",
    excerpt: "Dr. Baba Jahangir’s profound insights on moving beyond external religious dogma into direct mystical experience and self-knowledge.",
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "In his seminal texts Marefater Gopan Kotha and Sufibad Atto Porichoyer Ekmatro Poth, Dr. Baba Jahangir addresses the deepest question of spiritual existence: Who am I?"
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "He explains that the true Fakir is not one dressed in external rags, but one whose heart has been emptied of ego, arrogance, and the illusion of separateness. In Marifat (spiritual gnosis), prayer ceases to be a repetitive physical exercise and becomes an intimate, heart-centered dialogue with the Infinite."
      ),
      React.createElement("blockquote", { className: "border-l border-[#2C2A26] pl-6 italic text-2xl text-[#2C2A26] my-10 font-serif leading-relaxed" },
        "\"Knowing your physical name and body is worldly knowledge. Knowing the spirit that animates your breath is Marifat.\""
      ),
      React.createElement("p", { className: "mb-6 text-[#5D5A53] leading-relaxed" },
        "Through contemplation (Dhyan) and Muraqaba, Baba Jahangir offers a bridge between classical Sufi metaphysics and the living reality of South Asian seekers."
      )
    )
  },
  {
    id: 4,
    title: "The Living Quran: Sufi Sadar Uddin Chishty on the Inner Batin",
    date: "September 19, 2026",
    authorSage: "Mawla Shah Sufi Sadar Uddin Ahmad Chishty",
    youtubeId: "q0zvpj_Q5rU", // Chishti Sufi metaphysics and Quranic contemplation
    videoTitle: "Chishti Mysticism: The Philosophical and Esoteric Dimensions of Faith",
    excerpt: "Examining Quran Dorshon: How Sufi Sadar Uddin Chishty unlocked the psychological and spiritual secrets within the verses.",
    image: "https://images.unsplash.com/photo-1516834474-48c0abc2a902?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "In his monumental three-volume treatise Quran Dorshon, Sufi Sadar Uddin Ahmad Chishty reminds us that every sacred verse possesses both an outward skin (Zahir) and an infinite inward ocean (Batin)."
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "Writing with the ecstatic love of the Chishti tradition, he illustrates that fasting (Siam) is not merely abstaining from bread, but withholding the mind from toxic thoughts; that the true Qibla is the heart purified of idols; and that love is the supreme law of creation."
      ),
      React.createElement("blockquote", { className: "border-l border-[#2C2A26] pl-6 italic text-2xl text-[#2C2A26] my-10 font-serif leading-relaxed" },
        "\"The letter of the law without the spirit of love is a dry well. Come to the living fountain.\""
      )
    )
  },
  {
    id: 5,
    title: "The Art of Living with Less: Aparigraha and the Emancipation of Desire",
    date: "September 10, 2026",
    authorSage: "J. Krishnamurti & Patañjali",
    youtubeId: "bO7y5q96Kk0",
    videoTitle: "J. Krishnamurti: The Nature of Desire and Inner Freedom",
    excerpt: "Why the ancient yogic practice of non-grasping (Aparigraha) is the ultimate antidote to modern consumer anxiety.",
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "Sage Patañjali identified Aparigraha—freedom from greed and excessive accumulation—as one of the five moral foundation pillars of yoga."
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "When you possess fewer things, fewer things possess you. In stillness, desire loses its grip, and the natural bliss of your own unconditioned nature shines through."
      )
    )
  },
  {
    id: 6,
    title: "Nietzsche and the Ascetic Ideal: Overcoming the Herd and Amor Fati",
    date: "August 24, 2026",
    authorSage: "Friedrich Nietzsche (Zarathustra)",
    youtubeId: "vJ5t0WqI9k0",
    videoTitle: "Friedrich Nietzsche: The Path of Self-Overcoming & Amor Fati",
    excerpt: "How Nietzsche’s philosophy challenges seekers to build authentic spiritual resilience, love their fate, and transcend the mediocrity of the crowd.",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1000",
    content: React.createElement(React.Fragment, null,
      React.createElement("p", { className: "mb-6 first-letter:text-6xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-[#5D5A53] leading-relaxed" },
        "In Thus Spoke Zarathustra, Friedrich Nietzsche famously proclaimed that the human being is a rope tied between the beast and the Overman—a rope over an abyss."
      ),
      React.createElement("p", { className: "mb-8 text-[#5D5A53] leading-relaxed" },
        "Nietzsche cautioned against weak asceticism that hates life or flees into fantasy. Instead, he championed Amor Fati: the profound, fearless love of one’s fate, embracing both the bitter storm and the morning calm as raw fuel for spiritual greatness."
      )
    )
  }
];