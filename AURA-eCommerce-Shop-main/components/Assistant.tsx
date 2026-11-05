/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Concierge.
 *
 * Answers come from `data/knowledge-base.json` through `askConcierge`, with
 * no network call and no model. It cannot invent a delivery date, an
 * ingredient, or a certificate, and it says so when it does not know.
 * An optional Gemini key can be wired in later for free-form chat, but the
 * default path must stay free, offline, and auditable.
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { askConcierge, CONCIERGE_GREETING, CONCIERGE_SUGGESTIONS } from '../services/concierge';

const Assistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: CONCIERGE_GREETING, timestamp: Date.now() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const send = (text: string) => {
    const question = text.trim();
    if (!question) return;

    const reply = askConcierge(question);
    setMessages(previous => [
      ...previous,
      { role: 'user', text: question, timestamp: Date.now() },
      { role: 'model', text: reply.text, timestamp: Date.now() + 1 }
    ]);
    setInputValue('');
  };

  const handleSend = () => send(inputValue);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.filter(message => message.role === 'user').length === 0;

  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-[#F5F2EB] rounded-none shadow-2xl shadow-[#2C2A26]/10 w-[90vw] sm:w-[380px] h-[550px] mb-6 flex flex-col overflow-hidden border border-[#D6D1C7] animate-slide-up-fade">
          <div className="bg-[#EBE7DE] p-5 border-b border-[#D6D1C7] flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-[#2C2A26] rounded-full"></div>
              <div>
                <span className="font-serif italic text-[#2C2A26] text-lg block leading-tight">Concierge</span>
                <span className="text-[10px] uppercase tracking-widest text-[#A8A29E]">Written answers · no AI model</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close concierge"
              className="text-[#A8A29E] hover:text-[#2C2A26] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F5F2EB]" ref={scrollRef}>
            {messages.map((message, index) => (
              <div key={`${message.timestamp}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-5 text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-[#2C2A26] text-[#F5F2EB]'
                      : 'bg-white border border-[#EBE7DE] text-[#5D5A53] shadow-sm'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {showSuggestions && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] uppercase tracking-widest text-[#A8A29E] block">You could ask</span>
                {CONCIERGE_SUGGESTIONS.map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => send(suggestion)}
                    className="block w-full text-left text-xs px-3 py-2 border border-[#D6D1C7] bg-white/60 text-[#5D5A53] hover:border-[#2C2A26] hover:text-[#2C2A26] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-5 bg-[#F5F2EB] border-t border-[#D6D1C7]">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about the shop…"
                aria-label="Ask the concierge"
                className="flex-1 bg-white border border-[#D6D1C7] focus:border-[#2C2A26] px-4 py-3 text-sm outline-none transition-colors placeholder-[#A8A29E] text-[#2C2A26]"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                aria-label="Send question"
                className="bg-[#2C2A26] text-[#F5F2EB] px-4 hover:bg-[#444] transition-colors disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-[#A8A29E] mt-2 leading-relaxed">
              Answers are pre-written and checked. It will say when it does not know rather than guess.
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close concierge' : 'Open concierge'}
        className="bg-[#2C2A26] text-[#F5F2EB] w-14 h-14 flex items-center justify-center rounded-full shadow-xl hover:scale-105 transition-all duration-500 z-50"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm3.75 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default Assistant;
