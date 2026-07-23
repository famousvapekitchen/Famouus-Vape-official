import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, UserProfile } from '../types';
import {
  UserCheck,
  ShieldCheck,
  Crown,
  KeyRound,
  LogIn,
  X,
  CheckCircle2,
  Building,
  Info,
  Layers,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentRole, setCurrentUser, staffList, storeLogoUrl, storeName } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('staff');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || 'st-1');
  const [passcode, setPasscode] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!passcode.trim()) {
      setErrorMsg('Silakan masukkan Kode Akses / PIN Keamanan.');
      return;
    }

    const inputLower = passcode.trim().toLowerCase();

    if (selectedRole === 'staff') {
      if (passcode.trim().length < 4) {
        setErrorMsg('PIN Staff minimal 4 digit.');
        return;
      }
      const staffObj = staffList.find((s) => s.id === selectedStaffId) || staffList[0];
      const newUser: UserProfile = {
        id: staffObj.id,
        name: staffObj.name,
        role: 'staff',
        branchId: staffObj.branchId,
        branchName: staffObj.branchName,
        email: `${staffObj.name.toLowerCase().replace(/\s+/g, '')}@vapestore.co.id`,
      };
      setCurrentRole('staff');
      setCurrentUser(newUser);
    } else if (selectedRole === 'admin') {
      // Validate secret admin passcode (not displayed on screen)
      if (inputLower !== 'admin123' && inputLower !== '1234' && inputLower !== 'admin') {
        setErrorMsg('Kode akses Admin Operasional tidak valid! Silakan periksa kembali.');
        return;
      }
      const newUser: UserProfile = {
        id: 'admin-01',
        name: 'Siti Admin Operasional',
        role: 'admin',
        branchId: 'all',
        branchName: 'Headquarter Store Admin',
        email: 'admin@vapestore.co.id',
      };
      setCurrentRole('admin');
      setCurrentUser(newUser);
    } else if (selectedRole === 'owner') {
      // Validate secret owner passcode (not displayed on screen)
      if (inputLower !== 'owner123' && inputLower !== '1234' && inputLower !== 'owner' && inputLower !== '8888') {
        setErrorMsg('Kode otorisasi Store Owner tidak valid! Silakan periksa kembali.');
        return;
      }
      const newUser: UserProfile = {
        id: 'owner-01',
        name: 'H. Hendra (Store Owner)',
        role: 'owner',
        branchId: 'all',
        branchName: 'Holding Group Vape Store',
        email: 'owner@vapestore.co.id',
      };
      setCurrentRole('owner');
      setCurrentUser(newUser);
    }

    setSuccessMsg(`Otentikasi Berhasil! Selamat datang sebagai ${selectedRole.toUpperCase()}`);
    setTimeout(() => {
      setSuccessMsg('');
      setPasscode('');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="bg-gradient-to-b from-[#181335] via-[#120E2E] to-[#0F172A] text-white rounded-3xl max-w-md w-full shadow-[0_20px_60px_-15px_rgba(67,24,255,0.4)] border border-indigo-500/40 overflow-hidden my-8 relative transform transition-all">
        
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#4318FF]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-slate-400 hover:text-white bg-indigo-950/60 hover:bg-[#4318FF] p-2 rounded-xl transition cursor-pointer border border-indigo-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="p-6 pb-4 border-b border-indigo-500/30 text-center relative z-10">
          <div className="mx-auto mb-3 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1E1B4B] via-[#2E1065] to-[#4318FF] p-1 flex items-center justify-center shadow-xl shadow-[#4318FF]/30 border border-[#4318FF]/50">
            {storeLogoUrl ? (
              <img
                src={storeLogoUrl}
                alt={storeName}
                className="w-full h-full rounded-xl object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-xl bg-gradient-to-tr from-[#4318FF] to-cyan-400 flex items-center justify-center font-black text-lg text-white tracking-tighter">
                FVO
              </div>
            )}
          </div>

          <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{storeName || 'FAMOUS VAPE OFFICIAL'}</span>
          </h2>
          <p className="text-xs text-indigo-200/80 mt-1 font-medium">
            Sistem Autentikasi & Hak Akses Insentif Toko
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleLogin} className="p-6 space-y-5 relative z-10">
          
          {successMsg && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 rounded-2xl text-xs font-bold flex items-center space-x-2.5 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 bg-red-950/80 border border-red-500/50 text-red-200 rounded-2xl text-xs font-bold flex items-center space-x-2.5">
              <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Role Selection Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Pilih Hak Akses Peran
              </label>
              <span className="text-[10px] text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded-full">
                Otentikasi Terproteksi
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              
              {/* Staff Card */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('staff');
                  setErrorMsg('');
                  setPasscode('');
                }}
                className={`p-3 rounded-2xl border text-left transition relative cursor-pointer overflow-hidden ${
                  selectedRole === 'staff'
                    ? 'border-[#4318FF] bg-[#4318FF]/30 shadow-lg shadow-[#4318FF]/30 text-white'
                    : 'border-indigo-500/30 bg-[#181E3B]/90 text-indigo-200 hover:bg-[#251B4E] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <UserCheck className={`w-4 h-4 ${selectedRole === 'staff' ? 'text-cyan-300' : 'text-indigo-400'}`} />
                  {selectedRole === 'staff' && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white">Staff Toko</div>
                <div className="text-[10px] text-indigo-300/80 font-medium">Input Sell-out</div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMsg('');
                  setPasscode('');
                }}
                className={`p-3 rounded-2xl border text-left transition relative cursor-pointer overflow-hidden ${
                  selectedRole === 'admin'
                    ? 'border-indigo-500 bg-indigo-500/30 shadow-lg shadow-indigo-500/30 text-white'
                    : 'border-indigo-500/30 bg-[#181E3B]/90 text-indigo-200 hover:bg-[#251B4E] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-indigo-300' : 'text-indigo-400'}`} />
                  {selectedRole === 'admin' && (
                    <span className="w-2 h-2 rounded-full bg-indigo-300 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white">Admin Toko</div>
                <div className="text-[10px] text-indigo-300/80 font-medium">Perekap Qtty</div>
              </button>

              {/* Owner Card */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('owner');
                  setErrorMsg('');
                  setPasscode('');
                }}
                className={`p-3 rounded-2xl border text-left transition relative cursor-pointer overflow-hidden ${
                  selectedRole === 'owner'
                    ? 'border-amber-500 bg-amber-500/30 shadow-lg shadow-amber-500/30 text-white'
                    : 'border-indigo-500/30 bg-[#181E3B]/90 text-indigo-200 hover:bg-[#251B4E] hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Crown className={`w-4 h-4 ${selectedRole === 'owner' ? 'text-amber-300' : 'text-indigo-400'}`} />
                  {selectedRole === 'owner' && (
                    <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                  )}
                </div>
                <div className="text-xs font-bold text-white">Owner Store</div>
                <div className="text-[10px] text-indigo-300/80 font-medium">Executive</div>
              </button>

            </div>
          </div>

          {/* Account Selection if Staff */}
          {selectedRole === 'staff' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-indigo-200">
                Pilih Nama Staff Toko:
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full bg-[#181E3B] border border-indigo-500/40 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-[#4318FF] cursor-pointer"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.id} className="bg-[#1E1B4B] text-white">
                    {st.name} — ({st.branchName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Admin / Owner Account Summary Badge */}
          {selectedRole === 'admin' && (
            <div className="p-3.5 bg-[#181E3B]/90 rounded-2xl border border-indigo-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-cyan-300 uppercase font-extrabold tracking-wider">Otoritas Akses:</span>
                <p className="font-bold text-white">Siti Admin Operasional</p>
                <p className="text-[11px] text-indigo-200/80">Headquarter Store Admin & Perekap Data</p>
              </div>
              <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-xl text-[10px] font-extrabold shadow-md">
                Admin HQ
              </span>
            </div>
          )}

          {selectedRole === 'owner' && (
            <div className="p-3.5 bg-[#181E3B]/90 rounded-2xl border border-amber-500/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-extrabold tracking-wider">Otoritas Akses:</span>
                <p className="font-bold text-white">H. Hendra (Store Owner)</p>
                <p className="text-[11px] text-indigo-200/80">Holding Group Owner & Branding Control</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-600 text-white rounded-xl text-[10px] font-extrabold shadow-md">
                Owner
              </span>
            </div>
          )}

          {/* Passcode / PIN Input Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-indigo-200">
                {selectedRole === 'staff'
                  ? 'PIN Keamanan Staff'
                  : selectedRole === 'admin'
                  ? 'Kode Akses Rahasia Admin'
                  : 'Kode Akses Master Owner'}
              </label>
              
              {/* Protected Badge - NO PASSCODE TEXT LEAKED */}
              <span className="text-[10px] text-indigo-300/80 flex items-center space-x-1 font-semibold">
                <Lock className="w-3 h-3 text-amber-400" />
                <span>Terproteksi Kerahasiaan</span>
              </span>
            </div>

            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-indigo-300" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={
                  selectedRole === 'staff'
                    ? 'Masukkan PIN Staff (e.g. 1234)'
                    : selectedRole === 'admin'
                    ? 'Masukkan Kode Akses Admin...'
                    : 'Masukkan Kode Master Owner...'
                }
                className="w-full pl-10 pr-10 py-2.5 bg-[#181E3B] border border-indigo-500/40 rounded-2xl text-xs font-bold text-white placeholder-indigo-300/50 tracking-wider focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-indigo-300 hover:text-white transition cursor-pointer"
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Responsibilities Brief */}
          <div className="p-3 bg-[#181E3B]/60 rounded-2xl border border-indigo-500/30 text-[11px] text-indigo-200/90 space-y-1">
            <div className="flex items-center space-x-1.5 text-indigo-100 font-bold">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                Cakupan Otoritas {selectedRole === 'staff' ? 'Staff' : selectedRole === 'admin' ? 'Admin' : 'Owner'}:
              </span>
            </div>
            <p className="leading-relaxed pl-5 text-[10px] text-indigo-200/80">
              {selectedRole === 'staff' && 'Input sell-out harian, pantau akumulasi qtty per brand & insentif personal, cetak slip insentif.'}
              {selectedRole === 'admin' && 'Perekap akumulasi qtty toko global, kelola data master cabang, staff, dan nominal insentif produk.'}
              {selectedRole === 'owner' && 'Akses penuh executive dashboard, analisis profitabilitas, serta pengubahan Logo & Branding Toko.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full font-bold text-xs py-3 rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center space-x-2 ${
              selectedRole === 'owner'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-600/30'
                : selectedRole === 'admin'
                ? 'bg-gradient-to-r from-indigo-600 to-[#4318FF] hover:from-indigo-500 hover:to-[#3810E6] text-white shadow-indigo-600/30'
                : 'bg-[#4318FF] hover:bg-[#3810E6] text-white shadow-[#4318FF]/30'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>
              Masuk Sebagai {selectedRole === 'staff' ? 'Staff Toko' : selectedRole === 'admin' ? 'Admin Operasional' : 'Store Owner'}
            </span>
          </button>

        </form>

      </div>
    </div>
  );
};

