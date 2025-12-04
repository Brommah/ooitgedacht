import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * FAQ accordion item component
 */
export const FAQItem: React.FC<FAQItemProps> = ({
  question,
  answer,
  isOpen,
  onToggle
}) => (
  <div className="border-b border-blue-500/20">
    <button
      onClick={onToggle}
      className="w-full py-6 flex items-center justify-between text-left hover:bg-blue-500/5 transition-colors px-2 -mx-2 rounded-lg"
    >
      <span className="font-medium text-white pr-8">{question}</span>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all ${isOpen ? 'bg-blue-400 border-blue-400' : 'border-blue-500/30'}`}>
        {isOpen ? <Minus size={14} className="text-[#0a1628]" /> : <Plus size={14} className="text-blue-400" />}
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}>
      <p className="text-blue-200/60 font-light leading-relaxed px-2">{answer}</p>
    </div>
  </div>
);




