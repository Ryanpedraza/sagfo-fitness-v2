
import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { X, Calendar, MapPin, Type, AlignLeft, Camera, Shield, Save } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event, imageFile?: File) => void;
  event?: Event;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, event }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    date: '',
    location: '',
    description: '',
    imageUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: event.date ? new Date(event.date).toISOString().substring(0, 16) : '' // Format for datetime-local input
      });
    } else {
      setFormData({ title: '', date: '', location: '', description: '', imageUrl: '' });
    }
  }, [event, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const localImageUrl = URL.createObjectURL(file);
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, imageUrl: localImageUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      alert('Por favor, selecciona una imagen para representar este evento elite.');
      return;
    }
    const eventToSave: Event = {
      ...formData,
      id: event?.id || '',
      date: new Date(formData.date || '').toISOString(),
    } as Event;
    onSave(eventToSave, selectedFile);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[500] flex items-center justify-center p-4 transition-all duration-700 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" onClick={onClose} />

      <div className={`relative bg-white dark:bg-[#0a0a0a] rounded-[3.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto no-scrollbar border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] transform transition-transform duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'scale-100' : 'scale-90'}`}>

        <form onSubmit={handleSubmit} className="flex flex-col">
          {/* Header Elite */}
          <div className="px-10 py-8 border-b border-neutral-100 dark:border-white/5 flex items-center justify-between sticky top-0 bg-white/50 dark:bg-black/50 backdrop-blur-xl z-20">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-2xl rotate-3">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase italic tracking-tighter leading-none mb-1">
                  {event ? 'Refinar Evento Elite' : 'Programar Nueva Apertura'}
                </h2>
                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-widest italic">Gestión de Narrativa y Presencia de Marca</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="p-4 rounded-full bg-neutral-100 dark:bg-white/5 text-neutral-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-10 space-y-12">
            {/* Main Image Setup */}
            <div className="relative group overflow-hidden rounded-[3rem] border border-neutral-100 dark:border-white/5 bg-neutral-50 dark:bg-white/5 aspect-video flex items-center justify-center">
              {formData.imageUrl ? (
                <>
                  <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-black uppercase italic tracking-widest text-[10px] cursor-pointer hover:bg-white/20 transition-all">
                      Cambiar Visual Elite
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </>
              ) : (
                <label className="flex flex-col items-center gap-4 cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-primary-600/10 flex items-center justify-center text-primary-600">
                    <Camera className="w-10 h-10" />
                  </div>
                  <span className="text-[10px] font-black uppercase italic tracking-widest text-neutral-500">Cargar Imagen de Alto Impacto</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Informative Grid */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[11px] font-black text-neutral-400 uppercase tracking-widest italic px-2">
                    <Type className="w-4 h-4 text-primary-600" /> Título de la Narrativa
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Ejem: Gran apertura SAGFO Headquarters..."
                    className="w-full bg-neutral-50 dark:bg-white/5 p-5 rounded-2xl font-bold border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[11px] font-black text-neutral-400 uppercase tracking-widest italic px-2">
                    <MapPin className="w-4 h-4 text-primary-600" /> Ubicación Maestra
                  </label>
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    placeholder="Ciudad, País o Localización específica"
                    className="w-full bg-neutral-50 dark:bg-white/5 p-5 rounded-2xl font-bold border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[11px] font-black text-neutral-400 uppercase tracking-widest italic px-2">
                    <Calendar className="w-4 h-4 text-primary-600" /> Cronograma (Fecha y Hora)
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-50 dark:bg-white/5 p-5 rounded-2xl font-bold border border-neutral-100 dark:border-white/10 text-neutral-900 dark:text-white outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 text-[11px] font-black text-neutral-400 uppercase tracking-widest italic px-2">
                    <AlignLeft className="w-4 h-4 text-primary-600" /> Descripción Detallada
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Describe la importancia y los detalles de este evento..."
                    className="w-full bg-neutral-50 dark:bg-white/5 p-6 rounded-[2rem] font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-white/10 outline-none focus:ring-4 focus:ring-primary-500/10 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Safety & Action */}
            <div className="bg-primary-600/5 p-8 rounded-[3rem] border border-primary-600/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary-600/10 flex items-center justify-center text-primary-600">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-900 dark:text-white uppercase italic">Impacto Sincronizado</p>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Este evento será visible globalmente al guardar.</p>
                </div>
              </div>
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest text-[10px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 md:flex-none flex items-center justify-center gap-3 px-10 py-4 bg-primary-600 text-white rounded-2xl font-black uppercase italic tracking-widest text-[10px] shadow-2xl shadow-primary-600/20 hover:scale-105 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Guardar Evento Elite
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;
