import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Image, Upload, Trash2, Copy, Search, Grid, List } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const AdminMedia = () => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const fileInputRef = useRef(null);

  useEffect(() => { loadMedia(); }, []);

  const loadMedia = async () => {
    try {
      const { data } = await adminAPI.getMedia();
      setMedia(data.media || []);
    } catch (err) {
      toast.error('Failed to load media');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    try {
      for (const file of files) {
        await adminAPI.uploadImage(file);
      }
      toast.success('Upload successful');
      loadMedia();
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      fileInputRef.current.value = '';
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await adminAPI.deleteMedia(id);
      toast.success('Image deleted');
      loadMedia();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <>
      <Helmet><title>Media Library - Admin - Magnetic Clouds</title></Helmet>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-white">Media Library</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'text-gray-400'}`}><Grid className="w-4 h-4" /></button>
              <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'text-gray-400'}`}><List className="w-4 h-4" /></button>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*" multiple className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-gradient">
              {uploading ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Uploading...</span> : <span className="flex items-center gap-2"><Upload className="w-4 h-4" />Upload</span>}
            </button>
          </div>
        </div>

        <p className="text-gray-400 text-sm">Images are automatically converted to WebP format for optimal performance.</p>

        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-3 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" /></div>
        ) : media.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No Media Yet</h3>
            <p className="text-gray-400 mb-6">Upload images to your media library</p>
            <button onClick={() => fileInputRef.current?.click()} className="btn-gradient inline-flex"><Upload className="w-4 h-4 mr-2" /><span>Upload Images</span></button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((item, index) => (
              <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className="glass-card p-2 group">
                <div className="aspect-square rounded-lg overflow-hidden bg-black/20 mb-2">
                  <img src={item.thumbnail_url || item.url} alt={item.filename} className="w-full h-full object-cover" />
                </div>
                <p className="text-white text-xs truncate mb-2">{item.filename}</p>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyUrl(item.url)} className="p-1.5 rounded bg-white/10 text-gray-400 hover:text-white"><Copy className="w-3 h-3" /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded bg-white/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="divide-y divide-white/10">
              {media.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-white/5">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/20 flex-shrink-0">
                    <img src={item.thumbnail_url || item.url} alt={item.filename} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{item.filename}</p>
                    <p className="text-gray-500 text-sm">{item.mime_type} • {(item.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => copyUrl(item.url)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"><Copy className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMedia;
