/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { LegalPolicyType } from '../types';

interface PolicyModalProps {
  policy: LegalPolicyType | null;
  onClose: () => void;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ policy, onClose }) => {
  if (!policy) return null;

  const contentMap: Record<LegalPolicyType, { title: string; subtitle: string; content: React.ReactNode }> = {
    shipping: {
      title: 'Shipping & Delivery Policy',
      subtitle: 'Transparent timelines, global dispatch, and tracked transit.',
      content: (
        <div className="space-y-6 text-[#5D5A53] font-light leading-relaxed text-sm">
          <p>
            At <strong className="text-[#2C2A26] font-medium">Aura</strong>, every parcel is dispatched directly from our certified artisanal ateliers and ethical botanical sourcing partners to minimize warehouse footprint and preserve botanical freshness.
          </p>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">1. Order Processing Time</h4>
            <p>All orders are processed, verified, and quality-inspected within <strong>1 to 2 business days</strong> (Monday through Friday). You will receive an automated tracking notification as soon as the carrier registers your package.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">2. Estimated Delivery Windows</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>United States & Canada:</strong> 6 – 10 business days</li>
              <li><strong>United Kingdom & Europe:</strong> 7 – 12 business days</li>
              <li><strong>Australia & New Zealand:</strong> 8 – 14 business days</li>
              <li><strong>International / Rest of World:</strong> 10 – 16 business days</li>
            </ul>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">3. Free Shipping Threshold</h4>
            <p>Orders totaling <strong>$75 USD or more</strong> automatically qualify for complimentary insured worldwide shipping. Orders below $75 incur a flat-rate shipping charge of $9 USD.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">4. Customs & Tracking</h4>
            <p>Every shipment is assigned a tracking number from carriers including USPS, YunExpress, DHL, or Royal Mail. Customers can track their order status 24/7. International customs duties are handled under DDP (Delivered Duty Paid) whenever available.</p>
          </div>
        </div>
      )
    },
    refund: {
      title: '30-Day Return & Refund Guarantee',
      subtitle: 'Stillness, confidence, and complete customer protection.',
      content: (
        <div className="space-y-6 text-[#5D5A53] font-light leading-relaxed text-sm">
          <p>
            We believe an object in your home should bring peace, not hesitation. If you are not completely grounded and satisfied with your purchase, we offer a straightforward <strong>30-day return window</strong> from the date of delivery.
          </p>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">1. Return Eligibility</h4>
            <p>To be eligible for a refund, products must be in their original packaging and in unused, undamaged condition. For our organic botanical powders and herbal tinctures, safety seals must be intact due to sanitary and health standards.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">2. Damaged or Defective Items</h4>
            <p>If your package arrives damaged in transit or encounters a craftsmanship flaw, photograph the item and notify our concierge at <em>concierge@aurastudios.co</em> within 48 hours. We issue immediate free replacements or 100% full refunds.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">3. Refund Processing</h4>
            <p>Once your return is inspected at our regional intake hub, your refund is credited directly to your original payment method (Credit/Debit Card or Payoneer) within <strong>3 to 5 business days</strong>.</p>
          </div>
        </div>
      )
    },
    privacy: {
      title: 'Privacy & Data Protection Policy',
      subtitle: 'Committed to GDPR, CCPA, and radical digital privacy.',
      content: (
        <div className="space-y-6 text-[#5D5A53] font-light leading-relaxed text-sm">
          <p>
            Aura honors your privacy. We collect only the essential information necessary to deliver your sanctuary objects and maintain secure transaction verification.
          </p>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">1. Information We Collect</h4>
            <p>When you complete a transaction, we collect your name, shipping address, email, phone number, and encrypted payment reference. We do not store raw 16-digit credit card numbers on our servers; payments are processed securely through certified PCI-DSS compliant gateways.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">2. Zero Sale of Personal Data</h4>
            <p>We never sell, trade, or monetize customer data to third-party data brokers. Your contact details are utilized solely for order dispatch notices and optional journal newsletters.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">3. Your Rights</h4>
            <p>Under GDPR and CCPA guidelines, you retain the legal right to request an export or complete deletion of your customer profile at any time by contacting our data protection officer at <em>concierge@aurastudios.co</em>.</p>
          </div>
        </div>
      )
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Agreement and commercial conditions for quiet commerce.',
      content: (
        <div className="space-y-6 text-[#5D5A53] font-light leading-relaxed text-sm">
          <p>
            By accessing or purchasing from Aura, you agree to these Terms of Service. Please review them carefully prior to completing any checkout.
          </p>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">1. Product Descriptions & Botanical Disclaimers</h4>
            <p>We make every effort to display true textures, natural grain, and botanical compositions. Statements regarding herbal adaptogens (such as Ashwagandha root) have not been evaluated by the FDA and are not intended to diagnose, treat, or cure medical diseases. Consult a healthcare practitioner if pregnant or nursing.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">2. Pricing & Currency</h4>
            <p>All prices are quoted in USD unless specified otherwise. We reserve the right to modify pricing or discontinue items based on natural crop harvest yields and artisan availability.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-2">3. Order Acceptance</h4>
            <p>Receipt of an electronic order confirmation does not constitute our final acceptance of an order. We reserve the right to cancel or limit quantities if fraudulent payment activity or incorrect address entries are detected.</p>
          </div>
        </div>
      )
    },
    faq: {
      title: 'Customer Support & FAQ',
      subtitle: 'Answers to frequent inquiries regarding orders, botanicals, and yoga materials.',
      content: (
        <div className="space-y-6 text-[#5D5A53] font-light leading-relaxed text-sm">
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-1">How can I track my shipment?</h4>
            <p>As soon as your parcel is dispatched, you will receive an email containing your tracking code. You can also view live delivery milestones on your order confirmation page.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-1">How should I store Organic Ashwagandha Root?</h4>
            <p>Store in a cool, dry place away from direct sunlight. Reseal the amber glass jar or apothecary pouch firmly after each morning or evening ritual to keep ambient moisture out.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-1">How do I clean my Natural Cork Yoga Mat?</h4>
            <p>Cork is naturally antimicrobial and repels bacteria. Simply wipe down with a damp cloth and mild water-diluted essential oil spray after vigorous practice, then lay flat to air dry. Never machine wash.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-1">Which payment methods do you accept?</h4>
            <p>We accept all major credit and debit cards (Visa, MasterCard, American Express) as well as direct Payoneer payments for global flexibility.</p>
          </div>
          <div>
            <h4 className="font-serif text-[#2C2A26] text-base mb-1">How do I contact customer support?</h4>
            <p>Our concierge team is available Monday through Friday. Contact us at <strong className="text-[#2C2A26]">concierge@aurastudios.co</strong> — we guarantee a human reply within 24 hours.</p>
          </div>
        </div>
      )
    }
  };

  const current = contentMap[policy];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-[#2C2A26]/50 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl max-h-[85vh] bg-[#F5F2EB] border border-[#D6D1C7] shadow-2xl overflow-hidden flex flex-col animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-[#D6D1C7] bg-[#EBE7DE]/40 flex items-start justify-between">
          <div>
            <span className="text-xs uppercase tracking-widest text-[#A8A29E] block mb-1">Aura Legal & Transparency</span>
            <h3 className="text-2xl font-serif text-[#2C2A26]">{current.title}</h3>
            <p className="text-xs text-[#5D5A53] mt-1">{current.subtitle}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
            aria-label="Close dialog"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {current.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#D6D1C7] bg-[#EBE7DE]/30 flex justify-between items-center text-xs text-[#A8A29E]">
          <span>Updated for 2026/2027 E-Commerce Standards</span>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-[#2C2A26] text-[#F5F2EB] text-xs uppercase tracking-widest font-medium hover:bg-[#433E38] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
