/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

interface AuthenticSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SourceEntry {
  title: string;
  figure: string;
  authenticScript?: string;
  lineage: string;
  coreTexts: string[];
  authenticPublishers: string[];
  dropshipAndSourcingPaths: string[];
  notes: string;
}

const SOURCES_DATA: SourceEntry[] = [
  {
    title: 'Sufi Gnosis & The Living Fakir',
    figure: 'Dr. Qalandar Baba Jahangir Ba-Iman Al Sureshwari',
    authenticScript: 'ড. বাবা জাহাঙ্গীর (সুরেশ্বর দরবার শরীফ) • Bengali Sufi Lineage',
    lineage: 'Sureshwari Sufi Tariqa (Chishti-Qadiri branch of Jan Sharif Shah Sureshwari, Bangladesh)',
    coreTexts: [
      'মারেফাতের গোপন কথা (Marefater Gopan Kotha / The Secrets of Marifat)',
      'সুফিবাদ আত্মপরিচয়ের একমাত্র পথ (১ম-৪র্থ খণ্ড) (Sufism is the Only Path to Self-Identity - Vols 1–4)',
      'কালামে জাহাঙ্গীর (Kalame Jahangir)',
      'মরমি দর্শন ও ধ্যান সাধনা (Mystic Philosophy and Contemplation)'
    ],
    authenticPublishers: [
      'Sureshwar Darbar Sharif Publication Bureau (Naria, Shariatpur & Dhaka)',
      'Banglabazar Sufi Book Guilds (Ahmedia Library, Sulemania Book Depot, Ramon Publishers, Dhaka)',
      'Authorized Sureshwari Trust Publications'
    ],
    dropshipAndSourcingPaths: [
      'Direct tie-up with Banglabazar bulk wholesale distributors or Sureshwar Darbar central office for wholesale copies at $3–$6 USD/copy.',
      'International fulfillment via Bangladesh Post Express EMS or DHL Book Freight to overseas buyers at $30–$65 retail.',
      'Heirloom PDF & Digital Audio Bundle format: Zero procurement cost, instant worldwide delivery with 100% net margin.'
    ],
    notes: 'Dr. Baba Jahangir’s works focus on transcending outward religious sectarianism, unlocking the inner stations of the spiritual heart (Qalb), and recognizing the divine essence within.'
  },
  {
    title: 'Esoteric Quranic Philosophy & Wilayah',
    figure: 'Mawla Shah Sufi Sadar Uddin Ahmad Chishty',
    authenticScript: 'শাহ্ সুফি সদর উদ্দিন আহ্ মদ চিশতী • Chishti Sufi Order',
    lineage: 'Chishti Sufi Order (Tariqa-e-Chishtia / Imamia Chistia Research Foundation)',
    coreTexts: [
      'কোরান দর্শন (অখণ্ড) (Quran Dorshon: The Metaphysics and Philosophy of the Holy Quran)',
      'মাওলার অভিষেক (গাদীরে খুম) (Mawlar Avishek / The Anointing of Mawla Ali at Ghadir Khumm)',
      'তত্ত্বদর্শন ও চিশতীয়া সাধনা (Principles of Chishti Contemplation)'
    ],
    authenticPublishers: [
      'Imamia Chistia Research Foundation, Dhaka',
      'Ramon Publishers (Banglabazar, Dhaka)',
      'Chishti Spiritual Heritage Library'
    ],
    dropshipAndSourcingPaths: [
      'Wholesale bulk acquisition from Ramon Publishers / Imamia Chistia Foundation (Dhaka).',
      'Bilingual / English monograph print editions for international seekers.',
      'Print-on-Demand (POD) via IngramSpark or Lulu Direct for international hardcover dropshipping with zero inventory cost.'
    ],
    notes: 'Sufi Sadar Uddin Chishty reveals the esoteric (Batin) secrets of the Quran, proving how scripture is a living mirror of human consciousness, self-realization, and divine sovereignty.'
  },
  {
    title: 'The Peak of Ascetic Eloquence & Justice',
    figure: 'Amir al-Mu\'minin Hazrat Ali ibn Abi Talib (a.s.)',
    authenticScript: 'علي بن أبي طالب (عليه السلام) • Classical Arabic',
    lineage: 'The Gateway to the City of Knowledge, Fountainhead of all Sufi silsilas',
    coreTexts: [
      'Nahj al-Balāghah (Peak of Eloquence) — Sermons, letters, and aphorisms',
      'Ghurar al-Hikam wa Durar al-Kalim (Exalted Aphorisms and Pearls of Wisdom)',
      'Diwan of Imam Ali — Verses on ascetic detachment (Zuhd)'
    ],
    authenticPublishers: [
      'English: Ansariyan Publications, Tahrike Tarsile Quran (New York), Islamic College Advanced Press (London)',
      'Arabic Heritage: Dar al-Thaqafah (Cairo / Beirut)',
      'Bengali Translations: Islamic Foundation Bangladesh, Ahmedia Library (Dhaka)'
    ],
    dropshipAndSourcingPaths: [
      'Global wholesale via IngramSpark / Baker & Taylor for Sayed Ali Reza or Yasin T. al-Jibouri scholarly translations.',
      'Amazon KDP Print-on-Demand integration for zero-inventory global hardcovers.',
      'Direct distribution partnerships for heritage bilingual texts.'
    ],
    notes: 'Hazrat Ali’s sermons on Zuhd (asceticism) teach that true freedom is not owning nothing, but being owned by nothing. His teachings on conquering lower desires are universally revered.'
  },
  {
    title: 'Ecstatic Divine Love & The Masnavi',
    figure: 'Maulana Jalaluddin Rumi',
    authenticScript: 'مولانا جلال‌الدین محمد بلخی رومی • Persian (Farsi)',
    lineage: 'Mevlevi Sufi Order (The Whirling Dervishes, Konya, Turkey)',
    coreTexts: [
      'The Masnavi-ye Ma\'navi (Complete Books 1–6)',
      'Divan-e Shams-e Tabrizi (The Great Divan of Love)',
      'Fihi Ma Fihi (It Is What It Is / Signs of the Unseen)'
    ],
    authenticPublishers: [
      'Threshold Sufi Society (Kabir & Camille Helminski — authorized Mevlevi lineage)',
      'Cambridge University Press (R.A. Nicholson complete 6-volume critical text)',
      'Oxford World\'s Classics (Jawid Mojaddedi rhymed verse translation)'
    ],
    dropshipAndSourcingPaths: [
      'IngramSpark dropship distribution for clothbound heirloom gift editions.',
      'Direct distribution partnerships with Threshold Society or university presses.',
      'High-margin digital audio companions (Rumi recitals with acoustic Turkish Ney flute).'
    ],
    notes: 'Rumi’s reed flute (Ney) serves as the primary metaphor for emptying the ego so that the divine breath may play through us without impediment.'
  },
  {
    title: 'Wahdat al-Wujud & Metaphysical Realization',
    figure: 'Shaykh al-Akbar Muhyiddin Ibn al-Arabi',
    authenticScript: 'محيي الدين ابن عربي (الشيخ الأكبر) • Classical Arabic',
    lineage: 'The Greatest Master (Al-Shaykh al-Akbar), Andalusia & Damascus',
    coreTexts: [
      'Fusus al-Hikam (The Ringstones of Wisdom)',
      'Al-Futuhat al-Makkiyya (The Meccan Revelations)',
      'Treatise on Being (Risalat al-Wujud / Whoso Knoweth Himself)'
    ],
    authenticPublishers: [
      'The Muhyiddin Ibn \'Arabi Society (MIAS, Oxford & Berkeley) — mias.org',
      'Beshara Publications (Scotland)',
      'State University of New York (SUNY) Press (William C. Chittick translations)'
    ],
    dropshipAndSourcingPaths: [
      'Academic wholesale dropshipping via SUNY Press or Oxford MIAS.',
      'Lulu Direct print-on-demand for authorized public domain scholarly editions.',
      'Study guides and audio lecture commentary bundles.'
    ],
    notes: 'Ibn Arabi’s non-dual metaphysics (Wahdat al-Wujud) explains how all creation is a unified self-disclosure of the Divine, demanding universal tolerance and deep self-inquiry.'
  },
  {
    title: 'Self-Overcoming & Amor Fati',
    figure: 'Friedrich Nietzsche',
    authenticScript: 'Friedrich Wilhelm Nietzsche • Original German',
    lineage: 'Continental Philosophy & Radical Existentialism (Germany)',
    coreTexts: [
      'Thus Spoke Zarathustra (Also sprach Zarathustra)',
      'Beyond Good and Evil (Jenseits von Gut und Böse)',
      'The Gay Science (Amor Fati — Love of One\'s Fate)'
    ],
    authenticPublishers: [
      'Vintage / Random House (Walter Kaufmann authoritative translations)',
      'Penguin Classics (R.J. Hollingdale translations)',
      'Cambridge Texts in the History of Philosophy'
    ],
    dropshipAndSourcingPaths: [
      'Baker & Taylor / Ingram wholesale catalog (available in every dropship book connector).',
      'Heirloom clothbound custom editions via Bookvault or Blurb with Aura gold foil branding.'
    ],
    notes: 'Nietzsche’s piercing critique of hollow dogma urges the individual to rise above the herd, cultivate genuine spiritual discipline, and love their destiny (Amor Fati).'
  },
  {
    title: 'Sacred Meditative Sound & 432Hz Acoustics',
    figure: 'Mevlevi Ney Masters, Tibetan Bell Founders & Varanasi Maestros',
    authenticScript: 'नाद ब्रह्म • موسیقی عرفانی • 432Hz Acoustic Harmonics',
    lineage: 'Sacred Nada Yoga & Mevlevi Sema Acoustics',
    coreTexts: [
      'Sufi Ney & Daf Suites (recorded in Mevlevi Tekke courtyard, Konya)',
      'Bansuri & Tanpura Twilight Ragas (Varanasi acoustic lineage)',
      '432Hz Himalayan Singing Bowls (Patan, Kathmandu Valley alloy founders)'
    ],
    authenticPublishers: [
      'Aura Sacred Sound Archives (Direct artisan acoustic recordings)',
      'Patan Himalayan Metal Craft Guild (7-Metal Bell Bronze)'
    ],
    dropshipAndSourcingPaths: [
      'Digital FLAC / 320kbps MP3 downloads: 100% Net Profit, zero shipping, instant delivery link sent to customer email.',
      'Singing bowls & brass incense burners: Sourced via CJ Dropshipping / Zendrop or direct artisan freight with 60–70% margins.'
    ],
    notes: 'Acoustic instruments and pure 432Hz sound vibrate in harmony with natural biophilic frequencies, calming the nervous system without digital fatigue.'
  },
  {
    title: 'Certified Organic Botanicals & Pure Roots',
    figure: 'Pure Sun-Dried Roots, Herbs & Stone-Ground Powders',
    authenticScript: 'लवङ्ग • निम्ब • शाल्मली • अश्वगन्धा • Sanskrit, Latin & TCM',
    lineage: 'Traditional Ayurvedic & Oriental Ethno-Botanical Heritage',
    coreTexts: [
      'Organic KSM-66 Ashwagandha Root (Withania somnifera / 睡茄)',
      'Sun-Dried Organic Cloves & Powder (Lavanga / Syzygium aromaticum / 丁香)',
      'Wildcrafted Pure Neem Powder & Leaves (Nimba / Azadirachta indica / 印楝)',
      'Heritage Shimul Root Powder (Shalmali / Bombax ceiba / 木棉根 / শিমুল মূল)',
      'Sacred Bacopa Brahmi Leaf & Himalayan Shilajit Pitch'
    ],
    authenticPublishers: [
      'Certified Organic Agro-Forestry Farms (Bengal, Kerala & Sri Lanka)',
      'Ixoreal Biomed (KSM-66 patent extractors)',
      'Traditional Ayurvedic Apothecary Guilds & Herbal Grinding Mills'
    ],
    dropshipAndSourcingPaths: [
      'Pure whole sun-dried roots and low-friction stone-ground powders in amber glass apothecary jars.',
      'Sourcing cost: $1.50–$3.50 USD per 100g -> Retail $22–$38 USD (75%–85% gross margin).',
      'Zero chemicals, zero binders, zero artificial preservatives. Certificate of Analysis (COA) for heavy metal & microbial purity.'
    ],
    notes: 'The purest approach to wellness: whole plants, sun-cured naturally and stone-milled without chemical extraction solvents or synthetic fillers.'
  }
];

export const AuthenticSourcesModal: React.FC<AuthenticSourcesModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  if (!isOpen) return null;

  const current = SOURCES_DATA[selectedCategory];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#2C2A26]/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#F5F2EB] border border-[#D6D1C7] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-[#D6D1C7] flex items-center justify-between bg-[#EBE7DE]/60">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-semibold block mb-1">
              Store Master Authority & Procurement Guide
            </span>
            <h2 className="text-2xl md:text-3xl font-serif text-[#2C2A26]">
              Authentic Sourcing & Lineage Directory
            </h2>
            <p className="text-xs text-[#5D5A53] font-light mt-1 max-w-2xl">
              Authentic publishers, lineages, and practical dropshipping fulfillment pathways for Sufism, philosophy, sacred sound, and botanicals.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 border border-[#D6D1C7] text-[#2C2A26] hover:bg-[#2C2A26] hover:text-[#F5F2EB] transition-colors flex items-center justify-center text-sm font-mono"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content: Left sidebar + Right details */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#D6D1C7]">
          
          {/* Sidebar tabs (4 cols) */}
          <div className="md:col-span-4 p-4 md:p-6 space-y-2 overflow-y-auto max-h-[60vh] md:max-h-none bg-[#F5F2EB]">
            <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] font-medium block px-2 mb-2">
              Select Tradition / Master
            </span>
            {SOURCES_DATA.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(idx)}
                className={`w-full text-left p-3 text-xs transition-all border ${
                  selectedCategory === idx
                    ? 'border-[#2C2A26] bg-[#EBE7DE] text-[#2C2A26] font-medium shadow-sm'
                    : 'border-transparent text-[#5D5A53] hover:bg-[#EBE7DE]/50 hover:text-[#2C2A26]'
                }`}
              >
                <div className="font-serif text-sm text-[#2C2A26] leading-snug">{item.figure}</div>
                {item.authenticScript && (
                  <div className="text-[11px] text-[#8C7355] mt-0.5">{item.authenticScript}</div>
                )}
                <div className="text-[10px] text-[#A8A29E] uppercase tracking-wider mt-1 truncate">
                  {item.title}
                </div>
              </button>
            ))}
          </div>

          {/* Details Pane (8 cols) */}
          <div className="md:col-span-8 p-6 md:p-10 space-y-6 overflow-y-auto bg-white/60">
            
            {/* Header info */}
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#8C7355] font-semibold block mb-1">
                {current.title}
              </span>
              <h3 className="text-2xl md:text-3xl font-serif text-[#2C2A26] mb-1">
                {current.figure}
              </h3>
              {current.authenticScript && (
                <p className="text-sm font-serif text-[#8C7355] tracking-wide mb-3">
                  {current.authenticScript}
                </p>
              )}
              <div className="p-3 bg-[#EBE7DE]/70 border-l-2 border-[#8C7355] text-xs text-[#5D5A53] italic">
                Lineage / Tradition: <strong>{current.lineage}</strong>
              </div>
            </div>

            {/* Core Masterworks */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#2C2A26] font-semibold mb-3">
                Core Masterworks & Canonical Texts
              </h4>
              <ul className="space-y-2">
                {current.coreTexts.map((text, i) => (
                  <li key={i} className="text-xs text-[#5D5A53] flex items-start gap-2.5">
                    <span className="text-[#8C7355] mt-0.5">✦</span>
                    <span className="font-medium text-[#2C2A26]">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Authentic Publishers */}
            <div>
              <h4 className="text-xs uppercase tracking-widest text-[#2C2A26] font-semibold mb-3">
                Authentic Authorized Publishers & Archives
              </h4>
              <ul className="space-y-2">
                {current.authenticPublishers.map((pub, i) => (
                  <li key={i} className="text-xs text-[#5D5A53] flex items-start gap-2.5">
                    <span className="text-emerald-700 mt-0.5">✓</span>
                    <span>{pub}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Dropship & Procurement Strategy */}
            <div className="p-5 bg-[#F5F2EB] border border-[#D6D1C7] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#2C2A26]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[#8C7355]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <span>Practical Dropshipping & Distribution Pathway</span>
              </div>
              <ul className="space-y-2.5">
                {current.dropshipAndSourcingPaths.map((path, i) => (
                  <li key={i} className="text-xs text-[#5D5A53] leading-relaxed flex items-start gap-2">
                    <span className="font-mono text-[10px] text-[#8C7355] mt-0.5">[{i + 1}]</span>
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Esoteric Significance & Purpose */}
            <div className="pt-2 text-xs text-[#5D5A53] leading-relaxed font-light border-t border-[#D6D1C7]">
              <span className="font-medium text-[#2C2A26]">Spiritual Intention: </span>
              {current.notes}
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 md:p-6 border-t border-[#D6D1C7] bg-[#EBE7DE]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5D5A53]">
          <span className="italic font-light">
            All texts in the Aura collection are vetted for authentic lineage and historical integrity.
          </span>
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2C2A26] text-[#F5F2EB] uppercase tracking-widest text-[11px] font-medium hover:bg-[#433E38] transition-colors"
          >
            Return to Sanctuary
          </button>
        </div>

      </div>
    </div>
  );
};
