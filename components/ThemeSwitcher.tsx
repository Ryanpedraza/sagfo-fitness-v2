
import React from 'react';
import { Theme } from '../types';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const options: { id: Theme; label: string; icon: any }[] = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'auto', label: 'Auto', icon: Monitor },
  ];
  const activeIndex = options.findIndex(opt => opt.id === theme);

  return (
    <div className="fixed bottom-8 left-8 z-[150]">
      <div className="relative flex items-center p-1.5 bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-neutral-200 dark:border-white/10">
        <div
          className="absolute top-1.5 left-1.5 h-10 w-10 bg-primary-600 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-lg shadow-primary-600/20"
          style={{ transform: `translateX(calc(${activeIndex} * 2.75rem))` }} // 2.75rem = w-11
        />
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative z-10 w-11 h-10 flex items-center justify-center rounded-xl transition-all duration-500 group ${theme === option.id ? 'text-white' : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            title={`Modo ${option.label}`}
          >
            <option.icon size={18} strokeWidth={theme === option.id ? 3 : 2} className="transition-transform group-hover:scale-110" />

            {/* Tooltip on Hover */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-3 py-1 bg-neutral-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              {option.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
