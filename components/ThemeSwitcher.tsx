
import React from 'react';
import { Theme } from '../types';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSwitcherProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ theme, setTheme }) => {
  const options: { id: Theme; icon: React.ElementType }[] = [
    { id: 'light', icon: Sun },
    { id: 'dark', icon: Moon },
    { id: 'auto', icon: Monitor },
  ];
  const activeIndex = options.findIndex(opt => opt.id === theme);

  return (
    <div className="fixed bottom-4 left-4 z-[200] scale-90 md:scale-100 origin-bottom-left">
      <div className="relative flex items-center gap-0.5 p-1 bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/20 dark:border-white/10 shadow-lg">
        {/* Sliding Indicator */}
        <div
          className="absolute top-1 left-1 h-6 w-6 bg-white dark:bg-neutral-800 rounded-full transition-all duration-300 ease-out shadow-sm"
          style={{ transform: `translateX(${activeIndex * 28}px)` }}
        />

        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative z-10 w-6 h-6 flex items-center justify-center rounded-full transition-colors duration-300 ${theme === option.id
              ? 'text-primary-600'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            aria-label={`Theme: ${option.id}`}
          >
            <option.icon size={12} strokeWidth={2.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;

