import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { 
  UserCheck, 
  ShieldCheck, 
  Crown, 
  Building2, 
  Calendar, 
  RotateCcw,
  Sparkles,
  FileText,
  LogIn,
  Edit2,
  X,
  Upload,
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface HeaderProps {
  onOpenPRD: () => void;
  onOpenFirebase: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPRD, onOpenFirebase, onOpenLogin }) => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    selectedPeriod,
    setSelectedPeriod,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    storeLogoUrl,
    storeName,
    updateStoreLogo,
    resetToDefaultData,
  } = useApp();

  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [logoInput, setLogoInput] = useState(storeLogoUrl);
  const [nameInput, setNameInput] = useState(storeName);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleSaveLogo = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreLogo(logoInput, nameInput);
    setIsLogoModalOpen(false);
  };

  const handlePresetLogo = (url: string) => {
    setLogoInput(url);
  };

  const canEditLogo = currentRole === 'owner';

  return (
    <header id="main-header" className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2E1065] text-white border-b border-indigo-500/30 sticky top-0 z-30 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3 gap-3">
          
          {/* Logo & Brand Info */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => canEditLogo && setIsLogoModalOpen(true)}
              className={`relative group flex items-center justify-center shrink-0 ${canEditLogo ? 'cursor-pointer' : ''}`}
              title={canEditLogo ? 'Klik untuk merubah Logo Toko (Owner Only)' : storeName}
            >
              {storeLogoUrl ? (
                <img 
                  src={storeLogoUrl} 
                  alt={storeName} 
                  className="w-10 h-10 rounded-xl object-cover border border-[#4318FF]/60 shadow-lg shadow-[#4318FF]/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4318FF] to-cyan-400 flex items-center justify-center font-black text-xs shadow-lg shadow-[#4318FF]/30 text-white tracking-tighter shrink-0">
                  FVO
                </div>
              )}

              {canEditLogo && (
                <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>{storeName || 'FAMOUS VAPE OFFICIAL'}</span>
                </h1>
                {canEditLogo && (
                  <button
                    onClick={() => setIsLogoModalOpen(true)}
                    className="p-1 text-slate-300 hover:text-white bg-indigo-950/80 hover:bg-[#4318FF] rounded-lg transition border border-indigo-500/40"
                    title="Ubah Logo & Branding Toko"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                )}
              </div>
              <p className="text-xs text-indigo-200/80">System Insentif & Sell-out Produk Fokus Toko Vape</p>
            </div>
          </div>

          {/* Quick Filters: Branch & Period */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Branch Filter */}
            <div className="flex items-center bg-[#181E3B] border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs shadow-inner">
              <Building2 className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
              <select
                id="branch-select-filter"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none cursor-pointer font-medium text-xs pr-1"
              >
                <option value="all" className="bg-[#1E1B4B] text-slate-200">Semua Cabang Toko (Global)</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#1E1B4B] text-slate-200">
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Period Picker */}
            <div className="flex items-center bg-[#181E3B] border border-indigo-500/40 rounded-xl px-3 py-1.5 text-xs shadow-inner">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 mr-2 shrink-0" />
              <input
                id="month-period-picker"
                type="month"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent text-slate-100 focus:outline-none cursor-pointer font-medium text-xs"
              />
            </div>

            {/* PRD Document Button */}
            <button
              id="btn-open-prd"
              onClick={onOpenPRD}
              className="flex items-center space-x-1.5 bg-[#181E3B] hover:bg-[#251B4E] text-slate-100 border border-indigo-500/40 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
              title="Lihat Dokumen Spesifikasi PRD Notion"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Dokumen PRD</span>
            </button>

            {/* Firebase Status Modal Button */}
            <button
              id="btn-open-firebase"
              onClick={onOpenFirebase}
              className="flex items-center space-x-1.5 bg-[#181E3B] hover:bg-[#251B4E] text-cyan-200 border border-indigo-500/40 px-2.5 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer shadow-sm"
              title="Pengaturan Firebase Sync"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Firebase Status</span>
            </button>

            {/* Reset Data Button */}
            <button
              id="btn-reset-data"
              onClick={() => {
                if (confirm('Apakah Anda yakin ingin mengembalikan data sampel awal?')) {
                  resetToDefaultData();
                }
              }}
              className="p-1.5 text-indigo-300 hover:text-white hover:bg-[#251B4E] rounded-xl transition"
              title="Reset Data Sampel"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Role Switcher Pills & Login Button */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-open-login-modal"
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#4318FF] to-indigo-600 hover:from-[#3810E6] hover:to-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-lg shadow-[#4318FF]/30 cursor-pointer"
              title="Buka Dialog Login Staff, Admin (Perekap), dan Owner"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Ganti Role</span>
            </button>

            <div className="flex items-center bg-[#181E3B] p-1 rounded-xl border border-indigo-500/40">
              <span className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold px-2 hidden xl:inline">
                Role:
              </span>
              <button
                id="role-switch-staff"
                onClick={() => handleRoleChange('staff')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  currentRole === 'staff'
                    ? 'bg-[#4318FF] text-white shadow-md shadow-[#4318FF]/30 font-bold'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-950/60'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Staff</span>
              </button>

              <button
                id="role-switch-admin"
                onClick={() => handleRoleChange('admin')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-950/60'
                }`}
                title="Admin Operasional (Perekap Qtty Terjual)"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin</span>
              </button>

              <button
                id="role-switch-owner"
                onClick={() => handleRoleChange('owner')}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  currentRole === 'owner'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-600/30 font-bold'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-950/60'
                }`}
              >
                <Crown className="w-3.5 h-3.5 text-amber-300" />
                <span>Owner</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* EDIT LOGO MODAL (FOR ADMIN & OWNER) */}
      {isLogoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
          <div className="bg-gradient-to-b from-[#181335] to-[#0F172A] border border-indigo-500/40 text-white rounded-3xl max-w-md w-full shadow-[0_20px_60px_-15px_rgba(67,24,255,0.4)] overflow-hidden animate-fade-in relative">
            <div className="bg-[#1E1B4B]/80 p-5 border-b border-indigo-500/30 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Ubah Logo & Branding Toko FVO</h3>
              </div>
              <button
                onClick={() => setIsLogoModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-indigo-950/60 hover:bg-[#4318FF] rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLogo} className="p-6 space-y-4">
              
              {/* Preview Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-[#181E3B]/90 rounded-2xl border border-indigo-500/30">
                <p className="text-[10px] text-cyan-300 uppercase font-extrabold tracking-wider mb-2">Pratinjau Logo</p>
                {logoInput ? (
                  <img
                    src={logoInput}
                    alt="Preview Logo"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#4318FF] shadow-lg shadow-[#4318FF]/30"
                    onError={() => alert('URL Gambar tidak valid!')}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4318FF] to-cyan-400 flex items-center justify-center font-black text-lg text-white shadow-lg shadow-[#4318FF]/40">
                    FVO
                  </div>
                )}
                <span className="mt-2 text-xs font-bold text-white">{nameInput || 'FAMOUS VAPE OFFICIAL'}</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-200 mb-1">
                  Nama Toko / Brand Header *
                </label>
                <input
                  type="text"
                  required
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Contoh: FAMOUS VAPE OFFICIAL"
                  className="w-full bg-[#181E3B] border border-indigo-500/40 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-indigo-200 mb-1">
                  URL Gambar Logo Toko (PNG/JPG)
                </label>
                <input
                  type="url"
                  value={logoInput}
                  onChange={(e) => setLogoInput(e.target.value)}
                  placeholder="https://domain.com/logo.png"
                  className="w-full bg-[#181E3B] border border-indigo-500/40 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
                <p className="text-[10px] text-indigo-300/80 mt-1">
                  Masukkan link URL gambar logo atau kosongkan untuk memakai Badge Default FVO.
                </p>
              </div>

              {/* Sample Preset Logos */}
              <div>
                <label className="block text-[11px] font-bold text-indigo-300 mb-1.5">
                  Atau Pilih Preset Logo Sampel:
                </label>
                <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => handlePresetLogo('')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition ${
                      logoInput === '' ? 'bg-[#4318FF] border-[#4318FF] text-white shadow-md' : 'bg-[#181E3B] border-indigo-500/40 text-indigo-200'
                    }`}
                  >
                    Default Badge (FVO)
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLogo('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80')}
                    className="p-1 rounded-xl border border-indigo-500/40 hover:border-[#4318FF] bg-[#181E3B]"
                  >
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" alt="Preset 1" className="w-8 h-8 rounded-lg object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetLogo('https://images.unsplash.com/photo-1563089145-599997674d42?w=120&auto=format&fit=crop&q=80')}
                    className="p-1 rounded-xl border border-indigo-500/40 hover:border-[#4318FF] bg-[#181E3B]"
                  >
                    <img src="https://images.unsplash.com/photo-1563089145-599997674d42?w=120&auto=format&fit=crop&q=80" alt="Preset 2" className="w-8 h-8 rounded-lg object-cover" />
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsLogoModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#4318FF] hover:bg-[#3810E6] text-white rounded-2xl text-xs font-bold shadow-lg shadow-[#4318FF]/30 transition cursor-pointer"
                >
                  Simpan Logo Toko
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </header>
  );
};
