import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  Server,
  Cloud,
  AlertCircle
} from 'lucide-react';

interface FirebaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseConfigModal: React.FC<FirebaseConfigModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-base text-slate-900">
              Integrasi Firebase & Firestore Storage
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start space-x-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-900">Storage Offline Local & Firebase Engine Active</p>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Sistem saat ini berjalan dengan local persistent state real-time dan siap di-sync langsung ke Firestore.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-slate-900">
              <Database className="w-4 h-4 text-blue-600" />
              <span>Koneksi Firestore Database Blueprint:</span>
            </div>

            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-[11px]">
              <li><strong className="text-slate-900">Collection salesTransactions:</strong> Menyimpan setiap unit sellout & insentif per staff</li>
              <li><strong className="text-slate-900">Collection focusProducts:</strong> Menyimpan rate insentif (Rp) & target unit per brand</li>
              <li><strong className="text-slate-900">Collection staff:</strong> Data staff & penempatan toko cabang</li>
              <li><strong className="text-slate-900">Collection branches:</strong> Data toko cabang vape store</li>
            </ul>
          </div>

          <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200 text-blue-900 text-[11px]">
            <strong>Petunjuk Deployment Cloud:</strong> Jika ingin menghubungkan project Firebase nyata, Anda dapat menggunakan tombol <em>Set Up Firebase</em> di AI Studio interface untuk provisioning otomatis Firestore database.
          </div>

        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition"
          >
            Tutup Informasi
          </button>
        </div>

      </div>
    </div>
  );
};
