
import React from 'react';
import { Event } from '../types';
import ScrollReveal from './ScrollReveal';

interface EventsSectionProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  isAdmin: boolean;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

const EventsSection: React.FC<EventsSectionProps> = ({ events, onEventClick, isAdmin, onEditEvent, onDeleteEvent }) => {
  return (
    <div id="events" className="w-full px-1 md:px-4 py-8">
      <div className="w-full bg-white dark:bg-[#111] rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-neutral-200/50 dark:shadow-[0_30px_60px_rgba(0,0,0,0.35)] overflow-hidden p-4 sm:p-8 md:p-12 border border-neutral-200 dark:border-white/5 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="text-left">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase italic">
              Eventos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">SAGFO</span>
            </h2>
            <p className="mt-2 text-lg text-neutral-500 dark:text-neutral-400 max-w-xl">
              Experiencias exclusivas, lanzamientos y talleres para nuestra comunidad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 0.1} className="h-full">
              <div className="group relative bg-white dark:bg-[#1c1c1e] rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ease-out flex flex-col h-full border border-neutral-100 dark:border-white/5">

                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-neutral-200 dark:bg-zinc-800 animate-pulse" />
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400/1c1c1e/white?text=Imagen+No+Disponible';
                      e.currentTarget.onerror = null;
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Date Badge - Apple Style */}
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-xl px-4 py-2 rounded-xl shadow-lg border border-white/20 dark:border-white/10 flex flex-col items-center justify-center min-w-[3.5rem]">
                    <span className="text-xs font-bold uppercase text-red-500 tracking-wider">
                      {new Date(event.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}
                    </span>
                    <span className="text-xl font-black text-neutral-900 dark:text-white leading-none mt-0.5">
                      {new Date(event.date).getDate()}
                    </span>
                  </div>

                  {/* Time Badge */}
                  <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-semibold text-white tracking-wide">
                      {new Date(event.date).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-800">
                        Evento
                      </span>
                      <div className="flex items-center text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate">
                        <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight tracking-tight">
                      {event.title}
                    </h3>

                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-6">
                      {event.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-6 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                      className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-neutral-200/50 dark:shadow-none flex items-center justify-center gap-2 text-sm"
                    >
                      Ver Detalles
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); onEditEvent(event); }}
                          className="p-3 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }}
                          className="p-3 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Eliminar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsSection;
