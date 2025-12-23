
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
    <div id="events" className="w-full px-4 md:px-12 py-32 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
      {/* Decorative background text for depth */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-[15vw] font-black text-neutral-100 dark:text-white/5 pointer-events-none select-none uppercase italic tracking-tighter">
        Comunidad
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center space-x-6">
            <div className="h-[2px] w-16 bg-primary-600/40" />
            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-primary-600 italic">Network de Élite</span>
            <div className="h-[2px] w-16 bg-primary-600/40" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-neutral-900 dark:text-white tracking-tighter uppercase italic leading-[0.9] max-w-4xl">
            Eventos <br className="md:hidden" /> <span className="text-primary-600">SAGFOFITNESS</span>
          </h2>
          <p className="max-w-2xl text-xl text-neutral-500 dark:text-neutral-400 font-medium italic opacity-70 leading-relaxed">
            Experiencias diseñadas para la élite del fitness, lanzamientos exclusivos y formación de alto rendimiento.
          </p>
        </div>


        {/* Dynamic Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {events.map((event, index) => (
            <ScrollReveal key={event.id} delay={index * 0.1} className="h-full">
              <div className="group relative flex flex-col h-full bg-white dark:bg-zinc-900 rounded-[3rem] overflow-hidden border border-neutral-100 dark:border-white/5 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] transition-all duration-700 hover:-translate-y-4">

                {/* Visual Stage */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Date Badge - Boutique Style */}
                  <div className="absolute top-6 left-6 bg-white/95 dark:bg-black/80 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase text-primary-600 tracking-widest">{new Date(event.date).toLocaleDateString('es-CO', { month: 'short' }).replace('.', '')}</span>
                    <span className="text-2xl font-black text-neutral-900 dark:text-white leading-none mt-1">{new Date(event.date).getDate()}</span>
                  </div>

                  {/* Intensity Tag */}
                  <div className="absolute bottom-6 left-6 py-1.5 px-4 bg-primary-600 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg italic">
                    Live Experience
                  </div>
                </div>

                {/* Narrative Content */}
                <div className="p-10 flex flex-col flex-grow space-y-6">
                  <div className="space-y-4 flex-grow">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-neutral-400">
                      <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                    <h3 className="text-3xl font-black text-neutral-900 dark:text-white italic uppercase tracking-tighter leading-[0.95]">
                      {event.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed italic opacity-80 line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-4">
                    <button
                      onClick={() => onEventClick(event)}
                      className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black py-4 px-6 rounded-2xl hover:scale-[1.05] active:scale-[0.95] transition-all shadow-xl text-[10px] uppercase tracking-widest italic"
                    >
                      Ver Agenda
                    </button>

                    {isAdmin && (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onEditEvent(event); }} className="p-4 bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-primary-600 rounded-2xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
                        <button onClick={(e) => { e.stopPropagation(); onDeleteEvent(event.id); }} className="p-4 bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-red-500 rounded-2xl transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
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
