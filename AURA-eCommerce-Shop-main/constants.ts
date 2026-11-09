/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product, JournalArticle, CategoryInfo } from './types';

export const BRAND_NAME = 'OPAR';
export const PRIMARY_COLOR = 'stone-900'; 
export const ACCENT_COLOR = 'stone-500';

/* The room list lives in data/site.json (nav + footer) and data/collections.json
   (pages). The third copy that used to live here is gone, so the React footer and
   the generated footer cannot disagree. */


/* D-018 (owner decision): the seeded demo catalogue is removed. Products
   reach the storefront through data/pilot-products.json and the generated
   /shop/ pages, not through invented entries rendered in the React shell. */
export const PRODUCTS: Product[] = [];

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