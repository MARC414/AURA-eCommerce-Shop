/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore in sandboxed environments
      }
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[800px] overflow-hidden bg-[#D6D1C7]">
      
      {/* Background Image - Serene Misty Landscape */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
          alt="Serene misty mountain sanctuary" 
          className="w-full h-full object-cover grayscale contrast-[0.7] brightness-[0.95] animate-[pulse_15s_ease-in-out_infinite_alternate]"
        />
        {/* Warm Tonal Overlays for Depth */}
        <div className="absolute inset-0 bg-[#433E38]/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-[#313030]/25"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start text-left md:items-center md:text-center px-6">
        <div className="animate-fade-in-up w-full md:w-auto">
          <span className="block text-xs md:text-sm font-medium uppercase tracking-[0.25em] text-white/90 mb-6 backdrop-blur-sm bg-white/10 px-5 py-2 mx-0 md:mx-auto w-fit border border-white/20">
            The Bodhi Sanctuary
          </span>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-normal text-white tracking-tight mb-8 drop-shadow-sm">
            Quiet <span className="italic text-[#F5F2EB]">presence.</span>
          </h1>
          <p className="max-w-xl mx-0 md:mx-auto text-lg md:text-xl text-white/95 font-light leading-relaxed mb-12 text-shadow-sm">
            Sacred Ayurvedic botanicals, timeless yogic texts, 432Hz meditative audio, <br className="hidden sm:inline" />
            and tactile tools crafted to lessen desire and quiet the mind.
          </p>
          
          <a 
            href="#products" 
            onClick={(e) => handleNavClick(e, 'products')}
            className="group relative px-10 py-4 bg-[#F5F2EB] text-[#2C2A26] text-xs font-semibold uppercase tracking-widest hover:bg-white transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl inline-block"
          >
            <span className="relative z-10 group-hover:text-[#2C2A26]">Explore Sanctuary</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/60">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
