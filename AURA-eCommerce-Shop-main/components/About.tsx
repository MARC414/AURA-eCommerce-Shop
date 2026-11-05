/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-[#EBE7DE]">
      
      {/* Introduction / Story */}
      <div className="py-24 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-16 md:gap-32">
        <div className="md:w-1/3">
          <span className="text-xs uppercase tracking-widest text-[#8C7355] font-medium block mb-3">Our Core Philosophy</span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#2C2A26] leading-tight">
            Born from the earth, <br/> built for the unconditioned mind.
          </h2>
        </div>
        <div className="md:w-2/3 max-w-2xl">
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-8">
            Aura was founded on a simple, ancient premise: human peace is not found in the accumulation of desires, but in their quiet surrender.
          </p>
          <p className="text-lg md:text-xl text-[#5D5A53] font-light leading-relaxed mb-8">
            In an age of infinite stimulation, algorithmic panic, and sensory exhaustion, we create a sanctuary for the spirit. We unite organic Ayurvedic root remedies (Rasayana), sacred yogic literature, 432Hz harmonic soundscapes, and tactile living objects to help you cultivate <strong className="font-medium text-[#2C2A26]">Aparigraha</strong> (freedom from craving) and awaken <strong className="font-medium text-[#2C2A26]">Bodhi</strong> (luminous presence) in everyday life.
          </p>
          <img 
            src="https://images.pexels.com/photos/6583355/pexels-photo-6583355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Aura Sanctuary Atelier" 
            className="w-full h-[400px] object-cover grayscale contrast-[0.9] brightness-110 mt-12"
          />
          <p className="text-xs font-medium uppercase tracking-widest text-[#A8A29E] mt-4">
            The Aura Sanctuary Archive
          </p>
        </div>
      </div>

      {/* Philosophy Block 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="order-2 lg:order-1 relative h-[500px] lg:h-auto overflow-hidden group">
          <img 
            src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200" 
            alt="Natural Sandstone and Raw Textures" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-12 lg:p-24 bg-[#D6D1C7]">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5D5A53] mb-6">Aparigraha (Non-Possession)</span>
          <h3 className="text-4xl md:text-5xl font-serif mb-8 text-[#2C2A26] leading-tight">
            The power of <br/> living with less.
          </h3>
          <p className="text-lg text-[#5D5A53] font-light leading-relaxed mb-8 max-w-md">
            When you stop chasing what the world tells you to desire, the agitation of the ego collapses. What remains is pristine, unadulterated stillness. Every object in our collection exists solely to support that inward journey.
          </p>
        </div>
      </div>

      {/* Philosophy Block 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-[#2C2A26] text-[#F5F2EB]">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8C7355] mb-6">The Bodhi Path</span>
          <h3 className="text-4xl md:text-5xl font-serif mb-8 text-[#F5F2EB] leading-tight">
            Silence as the <br/> ultimate teacher.
          </h3>
          <p className="text-lg text-[#D6D1C7] font-light leading-relaxed mb-8 max-w-md">
            No flashing notifications, no artificial noise. From the deep resonance of hand-hammered 432Hz singing bowls to the grounding roots of organic Ashwagandha, we offer tools to return you to your biological and spiritual home.
          </p>
        </div>
        <div className="relative h-[500px] lg:h-auto overflow-hidden group">
          <img 
            src="https://images.pexels.com/photos/6801917/pexels-photo-6801917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Mindful sitting in quiet light" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105 brightness-90"
          />
        </div>
      </div>
    </section>
  );
};

export default About;