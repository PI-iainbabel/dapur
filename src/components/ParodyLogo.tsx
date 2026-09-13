import React from 'react';

interface ParodyLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
}

export const ParodyLogo: React.FC<ParodyLogoProps> = ({
  size = 'md',
  withText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8', svg: 'w-7 h-7', text: 'text-sm' },
    md: { box: 'w-11 h-11', svg: 'w-9 h-9', text: 'text-lg' },
    lg: { box: 'w-16 h-16', svg: 'w-13 h-13', text: 'text-2xl' },
    xl: { box: 'w-24 h-24', svg: 'w-20 h-20', text: 'text-4xl' },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Red fast-food emblem with Golden Brain Arches */}
      <div
        className={`${sizeMap[size].box} rounded-2xl bg-gradient-to-b from-[#DA291C] via-[#C8102E] to-[#990000] p-1.5 flex items-center justify-center shadow-lg shadow-red-900/20 border-2 border-amber-300/40 relative overflow-hidden group`}
      >
        {/* Subtle glossy sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-transparent pointer-events-none" />

        {/* Golden Arch shaped like Brain Hemispheres */}
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeMap[size].svg} transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]`}
        >
          {/* Double Golden Arch with cerebral convolution styling */}
          <path
            d="M18 84C18 84 16 38 34 22C46 11 50 32 50 44C50 32 54 11 66 22C84 38 82 84 82 84"
            stroke="#FFC72C"
            strokeWidth="15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brain-like sulcus accent */}
          <path
            d="M32 36C28 44 26 56 28 68"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d="M68 36C72 44 74 56 72 68"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* Spark of insight at apex */}
          <circle cx="50" cy="20" r="3.5" fill="#FFF" className="animate-pulse" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-tight text-red-600 font-['Space_Grotesk'] leading-none ${sizeMap[size].text}`}>
              Dapur MBE <span className="text-amber-500">&amp;</span> PIBI
            </span>
            <span className="bg-amber-400 text-red-950 font-black text-[10px] tracking-wider px-1.5 py-0.5 rounded uppercase font-mono shadow-xs">
              RESTO ILMU
            </span>
          </div>
          <span className="text-[11px] font-medium text-amber-700 tracking-wide flex items-center gap-1 font-sans">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Behavioral Economics &amp; Psikologi Bisnis Islam · Drive-Thru Wawasan
          </span>
        </div>
      )}
    </div>
  );
};
