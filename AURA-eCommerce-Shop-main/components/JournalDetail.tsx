/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { JournalArticle } from '../types';

interface JournalDetailProps {
  article: JournalArticle;
  onBack: () => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, onBack }) => {
  return (
    <div className="min-h-screen bg-[#F5F2EB] animate-fade-in-up">
      {/* Hero Image for Article */}
      <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#2C2A26]/30"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-32 relative z-10 pb-32">
        <div className="bg-[#F5F2EB] p-8 md:p-16 shadow-xl border border-[#D6D1C7]">
          
          {/* Header bar */}
          <div className="flex justify-between items-center mb-10 border-b border-[#D6D1C7] pb-6">
            <button 
              onClick={onBack}
              className="group flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Return to Bodhi Journal
            </button>
            <div className="text-right">
              <span className="text-xs uppercase tracking-widest text-[#8C7355] block font-medium">{article.authorSage}</span>
              <span className="text-[11px] text-[#A8A29E]">{article.date}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-serif text-[#2C2A26] mb-8 leading-tight text-center">
            {article.title}
          </h1>

          <p className="text-center italic text-[#8C7355] font-serif text-lg mb-12 max-w-xl mx-auto">
            &ldquo;{article.excerpt}&rdquo;
          </p>

          {/* Main Article Prose Content */}
          <div className="prose prose-stone prose-lg mx-auto font-light leading-relaxed text-[#5D5A53] mb-14">
            {article.content}
          </div>

          {/* Embedded Sacred Video Discourse */}
          {article.youtubeId && (
            <div className="my-14 p-8 bg-[#EBE7DE]/70 border border-[#D6D1C7]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#2C2A26] text-[#F5F2EB] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4 text-[#8C7355]">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#8C7355] font-medium block">Curated Sage Discourse</span>
                  <h3 className="font-serif text-[#2C2A26] text-xl">{article.videoTitle || 'Sacred Audio & Video Discourse'}</h3>
                </div>
              </div>

              {/* Responsive 16:9 Video Container */}
              <div className="relative w-full aspect-video bg-black overflow-hidden shadow-md mb-4">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${article.youtubeId}?rel=0`}
                  title={article.videoTitle || 'Sage Discourse'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>

              <p className="text-xs text-[#5D5A53] font-light italic">
                Contemplation note: Watch with undivided presence. Allow the words to bypass intellectual debate and settle directly in your breath.
              </p>
            </div>
          )}

          {/* Closing contemplation block */}
          <div className="mt-16 pt-10 border-t border-[#D6D1C7] flex flex-col items-center text-center space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#8C7355] font-medium">Daily Contemplation</span>
            <p className="text-sm font-serif text-[#2C2A26] italic max-w-md">
              &ldquo;When the mind is empty of craving, the heart is full of compassion.&rdquo;
            </p>
            <div className="pt-4">
              <button 
                onClick={onBack}
                className="px-8 py-3 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
              >
                Back to All Articles
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
