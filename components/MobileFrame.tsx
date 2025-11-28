import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#E5E5E5] flex items-center justify-center p-0 md:p-8 font-sans">
      <div className="relative w-full h-full md:max-w-[430px] md:h-[932px] bg-[#FBFBF9] md:rounded-[60px] md:shadow-2xl md:border-[14px] md:border-[#1a1a1a] overflow-hidden flex flex-col">
        {/* Dynamic Island / Notch Simulation */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 h-[35px] w-[120px] bg-black rounded-b-[24px] z-50"></div>
        
        {/* Status Bar Time Simulation */}
        <div className="hidden md:flex absolute top-[14px] left-[34px] z-50 text-white text-[15px] font-semibold tracking-wide">
          9:41
        </div>
        
        {/* Status Bar Icons Simulation */}
        <div className="hidden md:flex absolute top-[14px] right-[34px] z-50 gap-2 items-center">
            <div className="w-4 h-4 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,21L15.6,16.2C14.6,15.45 13.35,15 12,15C10.65,15 9.4,15.45 8.4,16.2L12,21M12,3C7.95,3 4.21,4.34 1.2,6.6L3,9C5.5,7.12 8.62,6 12,6C15.38,6 18.5,7.12 21,9L22.8,6.6C19.79,4.34 16.05,3 12,3M12,9C10.3,9 8.79,9.3 7.5,9.82L12,15.82L16.5,9.82C15.21,9.3 13.7,9 12,9Z" /></svg>
            </div>
            <div className="w-6 h-3 border border-white/40 rounded-[4px] relative">
                <div className="absolute inset-[1px] bg-white rounded-[2px] w-[80%]"></div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-y-auto no-scrollbar h-full w-full">
          {children}
        </div>

        {/* Home Indicator */}
        <div className="hidden md:block absolute bottom-2 left-1/2 -translate-x-1/2 w-[140px] h-[5px] bg-black/20 rounded-full z-50 pointer-events-none"></div>
      </div>
    </div>
  );
};