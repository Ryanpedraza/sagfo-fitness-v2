
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
    <div className="fixed bottom-6 left-6 z-[200]">
      <div className="relative flex items-center gap-0.5 p-1 bg-neutral-200/80 dark:bg-neutral-800/80 backdrop-blur-xl rounded-full shadow-lg border border-neutral-300/50 dark:border-neutral-700/50">
        {/* Sliding Indicator */}
        <div
          className="absolute top-1 left-1 h-7 w-7 bg-white dark:bg-neutral-900 rounded-full transition-all duration-300 ease-out shadow-md"
          style={{ transform: `translateX(${activeIndex * 30}px)` }}
        />

        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setTheme(option.id)}
            className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full transition-colors duration-300 ${theme === option.id
              ? 'text-primary-600'
              : 'text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
            aria-label={`Theme: ${option.id}`}
          >
            <option.icon size={14} strokeWidth={2.5} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;

