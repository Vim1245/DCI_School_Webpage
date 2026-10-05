import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/mockData';
import { Image, ZoomIn, X, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Campus', 'Classrooms', 'Students', 'Sports', 'Events', 'Activities'];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-700 text-xs font-bold uppercase tracking-wider">
            <Image className="w-3.5 h-3.5" /> Visual Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Photo Gallery
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Moments of discovery, athletic achievement, artistic expression, and joyful camaraderie across our campus.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Responsive Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/80 cursor-pointer bg-slate-100 aspect-[4/3]"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider mb-1">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold line-clamp-1">{item.title}</h4>
                {item.caption && (
                  <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">{item.caption}</p>
                )}
                <div className="mt-2 flex items-center gap-1 text-[10px] text-white/80">
                  <ZoomIn className="w-3.5 h-3.5" /> Click to enlarge
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {lightboxItem && (
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[75vh] bg-slate-900 flex items-center justify-center">
                <img
                  src={lightboxItem.image}
                  alt={lightboxItem.title}
                  className="max-h-[75vh] w-auto max-w-full object-contain"
                />
                <button
                  onClick={() => setLightboxItem(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-900/70 text-white flex items-center justify-center hover:bg-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 bg-white flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                    {lightboxItem.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{lightboxItem.title}</h3>
                  {lightboxItem.caption && (
                    <p className="text-slate-500 text-xs mt-1">{lightboxItem.caption}</p>
                  )}
                </div>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
