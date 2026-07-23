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
  Layers
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentRole, setCurrentUser, staffList, branches } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || 'st-1');
  const [pin, setPin] = useState<string>('1234');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (pin.trim().length < 4) {
      setErrorMsg('PIN keamanan minimal 4 digit (Gunakan default: 1234)');
      return;
    }

    if (selectedRole === 'staff') {
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

    setSuccessMsg(`Berhasil login sebagai ${selectedRole.toUpperCase()}!`);
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all">
        
        {/* Header */}
        <div className="bg-[#0B1437] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#4318FF] flex items-center justify-center font-bold text-white shadow-lg shadow-[#4318FF]/40">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">Login & Autentikasi Role</h2>
              <p className="text-xs text-[#A3AED0]">Pilih peran pengguna untuk masuk ke sistem Famous Vape Official</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-5">
          
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Role Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-[#2B3674] uppercase tracking-wider mb-2">
              Pilih Peran Akses (Role)
            </label>
            <div className="grid grid-cols-3 gap-2">
              
              {/* Staff Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('staff');
                  setErrorMsg('');
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'staff'
                    ? 'border-[#4318FF] bg-[#4318FF]/5 ring-2 ring-[#4318FF]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <UserCheck className={`w-4 h-4 ${selectedRole === 'staff' ? 'text-[#4318FF]' : 'text-slate-400'}`} />
                  {selectedRole === 'staff' && <CheckCircle2 className="w-3.5 h-3.5 text-[#4318FF]" />}
                </div>
                <div className="mt-2">
                  <div className={`text-xs font-bold ${selectedRole === 'staff' ? 'text-[#4318FF]' : 'text-slate-700'}`}>
                    Staff Toko
                  </div>
                  <div className="text-[10px] text-[#A3AED0]">Input Sell-out</div>
                </div>
              </button>

              {/* Admin Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('admin');
                  setErrorMsg('');
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-[#4318FF] bg-[#4318FF]/5 ring-2 ring-[#4318FF]/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <ShieldCheck className={`w-4 h-4 ${selectedRole === 'admin' ? 'text-[#4318FF]' : 'text-slate-400'}`} />
                  {selectedRole === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-[#4318FF]" />}
                </div>
                <div className="mt-2">
                  <div className={`text-xs font-bold ${selectedRole === 'admin' ? 'text-[#4318FF]' : 'text-slate-700'}`}>
                    Admin Operasional
                  </div>
                  <div className="text-[10px] text-[#A3AED0]">Perekap Qtty Terjual</div>
                </div>
              </button>

              {/* Owner Button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('owner');
                  setErrorMsg('');
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'owner'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Crown className={`w-4 h-4 ${selectedRole === 'owner' ? 'text-amber-600' : 'text-slate-400'}`} />
                  {selectedRole === 'owner' && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <div className="mt-2">
                  <div className={`text-xs font-bold ${selectedRole === 'owner' ? 'text-amber-700' : 'text-slate-700'}`}>
                    Store Owner
                  </div>
                  <div className="text-[10px] text-[#A3AED0]">Executive Dashboard</div>
                </div>
              </button>

            </div>
          </div>

          {/* Role Responsibility Information Box */}
          <div className="bg-[#F4F7FE] rounded-xl p-3.5 border border-slate-200/80 text-xs space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-[#2B3674]">
              <Info className="w-4 h-4 text-[#4318FF] shrink-0" />
              <span>
                Tugas Utama {selectedRole === 'staff' ? 'Staff' : selectedRole === 'admin' ? 'Admin (Perekap)' : 'Owner'}:
              </span>
            </div>
            <p className="text-[#A3AED0] text-[11px] leading-relaxed pl-5">
              {selectedRole === 'staff' && (
                'Melakukan pencatatan harian penjualan produk fokus (sell-out quantity) di toko dan memantau estimasi insentif serta mencetak slip pribadi.'
              )}
              {selectedRole === 'admin' && (
                'Mengumpulkan & merekapitulasi akumulasi quantity (qtty) produk fokus terjual dari seluruh cabang store, mengelola master produk fokus, dan memverifikasi data transaksi.'
              )}
              {selectedRole === 'owner' && (
                'Memantau performa keuangan store, total akumulasi liabilitas insentif per cabang, melihat peringkat staff terbaik, dan menyetujui pencairan insentif akhir bulan.'
              )}
            </p>
          </div>

          {/* Account Selection if Staff */}
          {selectedRole === 'staff' && (
            <div>
              <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                Pilih Akun Staff Toko:
              </label>
              <select
                value={selectedStaffId}
                onChange={(e) => setSelectedStaffId(e.target.value)}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              >
                {staffList.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name} — ({st.branchName})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Default Account Preset Preview for Admin / Owner */}
          {selectedRole === 'admin' && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">Akun Logged In:</span>
                <p className="font-bold text-[#2B3674]">Siti Admin Operasional</p>
                <p className="text-[11px] text-[#A3AED0]">Perekap Data Qtty & Manager Cabang</p>
              </div>
              <span className="px-2 py-1 bg-[#4318FF] text-white rounded-md text-[10px] font-bold">HQ Admin</span>
            </div>
          )}

          {selectedRole === 'owner' && (
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-amber-600 uppercase font-bold tracking-wider">Akun Logged In:</span>
                <p className="font-bold text-slate-900">H. Hendra (Store Owner)</p>
                <p className="text-[11px] text-[#A3AED0]">Holding Group Owner & Finance Approval</p>
              </div>
              <span className="px-2 py-1 bg-amber-600 text-white rounded-md text-[10px] font-bold">Owner</span>
            </div>
          )}

          {/* PIN Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-[#2B3674]">
                PIN Keamanan / Password
              </label>
              <span className="text-[10px] text-[#4318FF] font-semibold">PIN Default Demo: 1234</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-[#A3AED0]" />
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN (e.g. 1234)"
                className="w-full pl-9 pr-3 py-2 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs font-bold text-[#2B3674] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-[#4318FF]/30 transition cursor-pointer flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk Sebagai {selectedRole === 'staff' ? 'Staff' : selectedRole === 'admin' ? 'Admin (Perekap Qtty)' : 'Owner'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
