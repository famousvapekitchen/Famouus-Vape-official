import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Database, 
  Sparkles, 
  Layout, 
  Target,
  DollarSign
} from 'lucide-react';

export const PrdDocumentView: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyPRD = () => {
    const textToCopy = `
# NOTION PRD DOCUMENT: SISTEM INSENTIF PRODUK FOKUS TOKO VAPE

## 1. Product Overview
- **Product Name**: Mencatat Program Produk Fokus Bulanan Toko Vape
- **Product Type**: Web Application (Multi-Role: Staff, Admin, Owner)
- **Target Users**: Staff Toko, Admin Operasional, Store Owner
- **Industry**: Retail & Jasa Vape Shop
- **Primary Market**: Indonesia
- **Language**: Bahasa Indonesia
- **Currency**: IDR (Rupiah / Rp)
- **Team Size Target**: 10 Staff / Multi-Branch Store

### Mission:
Mempermudah pendataan insentif staff di tiap brand masing-masing program produk fokus, transparan, real-time, serta otomatisasi pembuatan slip insentif akhir bulan.

### Primary Problem Solved:
Pelacakan flow stock/sellout produk yang laku dan pembuatan laporan global insentif bulanan tanpa human error, serta pencetakan slip insentif resmi untuk mempercepat hitungan gajian akhir bulan.

### Main Value Proposition:
Bisa diakses online, diedit & divalidasi oleh Admin, serta dipantau secara real-time oleh Staff dan Owner.

---

## 2. Core Modules & Feature Breakdown
1. **Login & Role Authorization**:
   - Staff: Input sellout penjualan produk fokus, lihat progress insentif pribadi, lihat slip insentif.
   - Admin: Kelola data produk fokus & rate insentif per unit, validasi transaksi, kelola staff & cabang.
   - Owner: Executive dashboard, analisa biaya insentif per cabang, evaluasi pencapaian target brand.

2. **Dashboard & Real-time Metrics**:
   - Sell-out Terangkum Masing-masing Brand (Total Unit & Nominal Rp)
   - Target Berjalan & Target Kekurangan (Defisit unit ke ambang bonus)
   - Insentif Staff Tertinggi (Leaderboard)

3. **Data Produk Fokus (Master Catalog)**:
   - Nama Produk, Brand (FOOM, OXVA, Vaporesso, Emkay, Liquid XL), Kategori (Liquid, Device, Cartridge)
   - Rate Insentif per Unit (Rp)
   - Target Unit per Toko / Cabang

4. **Matriks Akumulasi Global Staff & Brand**:
   - Tabel matriks cross-tabulation: Nama Staff | Cabang | Brand A | Brand B | Brand C | Total Unit | Total Insentif (Rp)
   - Direct link cetak Slip Insentif

5. **Generator Slip Insentif Bulanan**:
   - Format slip resmi cetak/PDF dengan nomor slip unik, rincian produk, subtotal per brand, bonus target, dan kolom tanda tangan (Staff, Admin, Owner).

---

## 3. Screen Structure & UI Guidelines
- **Style**: Formal & Santai, Clean Modern Dashboard UI.
- **Primary Color**: Biru (#1e40af / #2563eb)
- **Secondary Accent**: Merah (#dc2626 untuk defisit target), Hitam/Slate (#0f172a)
- **Responsive Layout**: Mobile-first responsive, desktop-first precision with sticky header and sidebar navigation.

---

## 4. Technical Architecture (Firebase Firestore & React)
- **Firestore Collections**:
  - \`branches\`: id, name, code, address, managerName
  - \`staff\`: id, name, code, branchId, branchName, phone, role
  - \`focusProducts\`: id, name, brand, category, incentivePerUnit, targetUnitsPerStore, activePeriod
  - \`salesTransactions\`: id, date, monthPeriod, staffId, productId, quantitySold, totalIncentive, status
    `;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top PRD Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-extrabold text-slate-900">
              Dokumen Spesifikasi Produk (PRD Notion)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Format lengkap PRD dan pedoman arsitektur yang siap di-copy langsung ke Notion atau dokumentasi tim dev.
          </p>
        </div>

        <button
          id="btn-copy-prd"
          onClick={handleCopyPRD}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-md shadow-blue-600/30 cursor-pointer self-start md:self-auto"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Tercopy ke Clipboard!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Teks PRD Notion</span>
            </>
          )}
        </button>
      </div>

      {/* Notion Document Card Style */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-md space-y-8 font-sans text-slate-800">
        
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 mb-2">
            <span>📚 PRD Documentation</span>
            <span>•</span>
            <span>Notion Structured Format</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            PRD: Sistem Pencatatan Program Produk Fokus & Insentif Toko Vape
          </h1>
          <p className="text-xs text-slate-500 mt-2">
            Versi 2.6 • Ditulis oleh Senior Product Manager SaaS Toko Retail Vape Indonesia
          </p>
        </div>

        {/* Section 1: Product Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>1. Product Overview & Market Fit</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Product Name</span>
              <p className="font-bold text-slate-900">Mencatat Program Produk Fokus Bulanan Toko Vape</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Product Type</span>
              <p className="font-bold text-slate-900">Multi-Role Web Application (Staff, Admin, Owner)</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Market & Language</span>
              <p className="font-bold text-slate-900">Indonesia (IDR - Rupiah) • Bahasa Indonesia</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Target Team Size</span>
              <p className="font-bold text-slate-900">10 Staff & Multi-Branch Vape Stores</p>
            </div>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 text-xs space-y-2">
            <div>
              <strong className="text-blue-900 block font-bold">Misi Utama:</strong>
              <p className="text-slate-700">
                Mempermudah pendataan insentif staff di tiap brand masing-masing program produk fokus, memberikan visibilitas real-time untuk staff dan owner, serta mengotomatiskan penerbitan slip insentif gajian di akhir bulan.
              </p>
            </div>
            <div>
              <strong className="text-blue-900 block font-bold">Main Value Proposition:</strong>
              <p className="text-slate-700">
                Bisa diakses secara online, diedit oleh Admin, serta dipantau real-time oleh Staff dan Owner tanpa keterlambatan perhitungan manual Excel.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Core Modules & Features */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span>2. Modul Fitur Utama</span>
          </h2>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-sm font-bold text-slate-900 block">Modul 1: Login Multi-Role (Staff, Admin, Owner)</strong>
              <p className="text-slate-600 mt-1">
                Akses terkontrol dengan dashboard khusus per role. Staff fokus ke input transaksi dan slip insentif, Admin mengelola master data produk & staff, Owner melihat analitik finansial global.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-sm font-bold text-slate-900 block">Modul 2: Analytics & Metric Dashboard</strong>
              <p className="text-slate-600 mt-1">
                Menyajikan metrik utama: Sell-out terangkum masing-masing brand (Units & Rp), Target berjalan vs Actual, Target kekurangan (defisit), dan Peringkat Pendapatan Staff Tertinggi.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-sm font-bold text-slate-900 block">Modul 3: Master Data Produk Fokus (Brand & Rate Insentif)</strong>
              <p className="text-slate-600 mt-1">
                Pencatatan produk fokus bulanan per brand (misal FOOM, OXVA, Vaporesso, Emkay), penentuan nominal insentif per unit (Rp), dan target minimum toko.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-sm font-bold text-slate-900 block">Modul 4: Akumulasi Global Staff & Brand Matrix</strong>
              <p className="text-slate-600 mt-1">
                Matriks cross-tabulation yang merangkum jumlah unit laku dan total rupiah insentif masing-masing staff toko di tiap brand secara transparan.
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <strong className="text-sm font-bold text-slate-900 block">Modul 5: Pembuat Slip Insentif Bulanan (Printable / PDF)</strong>
              <p className="text-slate-600 mt-1">
                Fitur generate otomatis slip insentif resmi berformat kuitansi toko dengan rincian unit x rate, subtotal brand, bonus target, dan area tanda tangan sah.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Technical & Database Schema */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span>3. Technical Specification (Firebase Firestore & React)</span>
          </h2>

          <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl font-mono text-[11px] overflow-x-auto space-y-2">
            <p className="text-blue-400 font-bold">// Schema Collections Firestore Blueprint</p>
            <p className="text-slate-400">
              1. <strong className="text-amber-300">branches</strong>: &#123; id, name, code, address, managerName &#125;<br />
              2. <strong className="text-amber-300">staff</strong>: &#123; id, name, code, branchId, branchName, phone, role &#125;<br />
              3. <strong className="text-amber-300">focusProducts</strong>: &#123; id, name, brand, category, incentivePerUnit, targetUnitsPerStore, activePeriod &#125;<br />
              4. <strong className="text-amber-300">salesTransactions</strong>: &#123; id, date, monthPeriod, staffId, productId, quantitySold, totalIncentive, status &#125;
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
