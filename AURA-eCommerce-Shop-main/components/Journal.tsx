/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { JOURNAL_ARTICLES } from '../constants';
import { JournalArticle } from '../types';

interface JournalProps {
  onArticleClick: (article: JournalArticle) => void;
}

const Journal: React.FC<JournalProps> = ({ onArticleClick }) => {
  return (
    <section id="journal" className="bg-[#F5F2EB] py-32 px-6 md:px-12 border-t border-[#D6D1C7]/60">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 pb-8 border-b border-[#D6D1C7]">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] mb-3">Wisdom & Contemplation</span>
            <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26]">The Bodhi Journal</h2>
            <p className="text-[#5D5A53] font-light text-base mt-2 max-w-xl">
              In-depth essays on ascetic living, lessening desire (Aparigraha), and integrated teachings from enlightened sages.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {JOURNAL_ARTICLES.map((article) => (
            <div key={article.id} className="group cursor-pointer flex flex-col text-left" onClick={() => onArticleClick(article)}>
              <div className="w-full aspect-[4/3] overflow-hidden mb-6 bg-[#EBE7DE] relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                {article.youtubeId && (
                  <div className="absolute bottom-3 right-3 bg-[#2C2A26]/85 text-[#F5F2EB] px-2.5 py-1 text-[10px] tracking-widest uppercase flex items-center gap-1.5 backdrop-blur-sm font-mono">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 text-[#8C7355]">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    <span>Discourse</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col flex-1 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-medium uppercase tracking-widest text-[#8C7355]">{article.authorSage || 'Sage Wisdom'}</span>
                  <span className="text-[#A8A29E] text-xs">·</span>
                  <span className="text-[11px] text-[#A8A29E] uppercase tracking-wider">{article.date}</span>
                </div>
                <h3 className="text-xl md:text-2xl font-serif text-[#2C2A26] mb-3 leading-snug group-hover:underline decoration-1 underline-offset-4">
                  {article.title}
                </h3>
                <p className="text-xs text-[#5D5A53] font-light leading-relaxed line-clamp-3">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
