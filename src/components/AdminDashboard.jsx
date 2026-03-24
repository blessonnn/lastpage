import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LogOut, Grid, List, Trash2, X, Check, Image as ImgIcon } from 'lucide-react';
import { getAllEntries, deleteEntry, updateEntry } from '../utils/firebaseService';
import { clearAdminSession } from '../utils/storage';

const AdminDashboard = ({ onLogout }) => {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('latest');
  const [filter, setFilter] = useState('all');
  const [view, setView] = useState('grid');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    const data = await getAllEntries();
    setEntries(data);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name}'s entry forever?`)) {
      await deleteEntry(id);
      refreshData();
      showToast("Entry removed");
      setSelectedEntry(null);
    }
  };



  const filteredEntries = entries
    .filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter(e => {
      if (filter === 'photo') return e.photo;
      if (filter === 'no-photo') return !e.photo;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'oldest') return new Date(a.submittedAt) - new Date(b.submittedAt);
      if (sort === 'az') return a.name.localeCompare(b.name);
      return new Date(b.submittedAt) - new Date(a.submittedAt);
    });

  return (
    <div className="min-h-screen bg-background font-sans text-ink pb-24">
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-neutral-200 px-8 py-4 flex justify-between items-center">
        <h1 className="font-serif text-2xl">Lastpage — Admin</h1>
        <div className="text-xs uppercase tracking-widest font-bold text-accent">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
        <button 
          onClick={onLogout}
          className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-ink transition-colors font-bold"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </header>

      {/* Toolbar */}
      <div className="sticky top-[65px] z-40 bg-background/50 backdrop-blur-sm border-b border-neutral-200 px-8 py-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-1 min-w-[300px] gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300" />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-neutral-200 pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent rounded-md"
            />
          </div>
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-accent rounded-md"
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">A–Z by name</option>
          </select>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-white border border-neutral-200 px-4 py-2 text-sm focus:outline-none focus:border-accent rounded-md"
          >
            <option value="all">All</option>
            <option value="photo">Has photo</option>
            <option value="no-photo">No photo</option>
          </select>
        </div>

        <div className="flex bg-white border border-neutral-200 rounded-md p-1">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded ${view === 'grid' ? 'bg-background text-ink shadow-sm' : 'text-neutral-300'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded ${view === 'list' ? 'bg-background text-ink shadow-sm' : 'text-neutral-300'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <main className="px-8 py-12">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-48">
            <p className="font-serif italic text-2xl text-neutral-300">
              {search ? `No entries matching "${search}"` : "No entries yet. Share the link and let the memories begin."}
            </p>
          </div>
        ) : view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEntries.map(entry => (
              <motion.div 
                key={entry.id}
                layoutId={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="admin-card p-8 cursor-pointer group relative overflow-hidden"
              >
                {/* Photo indicator */}
                {entry.photo && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-accent/20" />
                )}
                
                {entry.submittedAt && (Date.now() - new Date(entry.submittedAt).getTime() < 86400000) && (
                  <div className="absolute top-4 right-4 flex items-center gap-1">
                    <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="text-[8px] uppercase tracking-widest text-accent font-bold">New</span>
                  </div>
                )}

                <h3 className="font-serif text-2xl mb-4 text-ink">{entry.name}</h3>
                <p className="text-sm text-ink-muted line-clamp-2 md:line-clamp-3 mb-6 font-sans italic">
                  "{entry.message}"
                </p>
                
                {entry.photo && (
                  <div className="aspect-video bg-neutral-100 rounded-md overflow-hidden mb-6 flex items-center justify-center">
                    <img src={entry.photo} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt="" />
                  </div>
                )}

                <div className="flex justify-between items-center mt-auto pt-6 border-t border-neutral-50">
                  <span className="text-[9px] uppercase tracking-widest text-neutral-400">
                    {new Date(entry.submittedAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id, entry.name); }}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Message Preview</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Has Photo</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredEntries.map(entry => (
                  <tr 
                    key={entry.id} 
                    onClick={() => setSelectedEntry(entry)}
                    className="hover:bg-neutral-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-6 font-serif text-lg">{entry.name}</td>
                    <td className="px-6 py-6 text-neutral-500 italic max-w-md truncate">"{entry.message}"</td>
                    <td className="px-6 py-6 text-neutral-400 tracking-tighter">{new Date(entry.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-6">
                      {entry.photo && <span className="w-2 h-2 bg-accent rounded-full block" />}
                    </td>
                    <td className="px-6 py-6 text-right space-x-6">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(entry.id, entry.name); }}
                        className="text-neutral-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 md:p-24 backdrop-blur-3xl bg-background/90"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-4xl bg-white shadow-2xl relative paper-grain border border-neutral-200 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center px-12 py-8 border-b border-neutral-100">
                <span className="text-[10px] uppercase tracking-[0.4em] text-accent font-bold">
                  Entry Detail
                </span>
                <button 
                  onClick={() => { setSelectedEntry(null); }}
                  className="text-neutral-300 hover:text-ink transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="overflow-y-auto p-12 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div className="space-y-8">
                       <h2 className="font-serif text-6xl text-ink leading-tight">{selectedEntry.name}</h2>
                       <p className="font-sans text-xl text-ink-muted leading-relaxed italic border-l-4 border-accent/20 pl-8 py-2">
                         "{selectedEntry.message}"
                       </p>
                       <div className="text-[10px] uppercase tracking-widest text-neutral-300 space-y-2">
                         <p>ID: {selectedEntry.id}</p>
                         <p>Date: {new Date(selectedEntry.submittedAt).toLocaleString()}</p>
                       </div>
                       
                       <div className="flex gap-6 pt-12">
                         <button 
                          onClick={() => handleDelete(selectedEntry.id, selectedEntry.name)}
                          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-4 text-neutral-300 hover:text-red-500 hover:border-red-500 transition-all border border-transparent"
                         >
                            <Trash2 className="w-3 h-3" /> Delete
                         </button>
                       </div>
                    </div>
                    <div>
                      {selectedEntry.photo ? (
                        <div className="rounded-2xl overflow-hidden shadow-2xl group">
                           <img src={selectedEntry.photo} className="w-full h-auto grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000" alt="" />
                        </div>
                      ) : (
                        <div className="h-full min-h-[300px] border-2 border-dashed border-neutral-100 rounded-2xl flex flex-col items-center justify-center text-neutral-200">
                           <ImgIcon className="w-16 h-16 mb-4 opacity-20" />
                           <span className="text-[10px] uppercase tracking-widest font-bold">No photo attached</span>
                        </div>
                      )}
                    </div>
                  </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-12 right-12 bg-ink text-white px-8 py-4 rounded-full shadow-2xl z-[1000] flex items-center gap-4 text-xs font-bold uppercase tracking-widest"
          >
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
