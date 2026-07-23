import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatIndonesianDate, getMonthName } from '../utils/formatters';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  Building, 
  Receipt, 
  User, 
  Calendar, 
  Award,
  Download
} from 'lucide-react';

interface IncentiveSlipModalProps {
  staffId: string | null;
  onClose: () => void;
}

export const IncentiveSlipModal: React.FC<IncentiveSlipModalProps> = ({
  staffId,
  onClose,
}) => {
  const { generateIncentiveSlip, selectedPeriod, staffList } = useApp();

  const [activeStaffId, setActiveStaffId] = useState<string>(
    staffId || staffList[0]?.id || ''
  );

  const slipData = generateIncentiveSlip(activeStaffId, selectedPeriod);

  if (!staffId && !activeStaffId) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full my-8 shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Top Modal Controls (Hidden when printing) */}
        <div className="bg-[#0B1437] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center space-x-3">
            <Receipt className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-sm text-white">Slip Insentif Produk Fokus Staff</h3>
              <p className="text-[11px] text-[#A3AED0]">Pilih staff dan cetak dokumen resmi akhir bulan</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Staff Selector dropdown */}
            <select
              value={activeStaffId}
              onChange={(e) => setActiveStaffId(e.target.value)}
              className="bg-[#111C44] border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.branchName})
                </option>
              ))}
            </select>

            <button
              id="btn-print-slip"
              onClick={handlePrint}
              className="bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer shadow-md shadow-[#4318FF]/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#A3AED0] hover:text-white rounded-lg transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP CONTENT AREA */}
        {slipData ? (
          <div id="printable-slip-area" className="p-8 text-slate-800 space-y-6 print:p-0 print:m-0 bg-white">
            
            {/* Slip Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-5">
              <div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                    VF
                  </div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">
                    VAPE STORE INDONESIA
                  </h1>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1">
                  System Insentif Program Produk Fokus Bulanan
                </p>
                <p className="text-[11px] text-slate-500">{slipData.staff.branchName}</p>
              </div>

              <div className="text-right">
                <span className="inline-block bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1 rounded uppercase tracking-wider mb-1">
                  SLIP INSENTIF STAFF
                </span>
                <p className="text-xs font-bold text-slate-900">{slipData.slipNumber}</p>
                <p className="text-[11px] text-slate-500">
                  Periode: <strong className="text-slate-800">{slipData.period}</strong>
                </p>
                <p className="text-[11px] text-slate-500">Tanggal Cetak: {slipData.issueDate}</p>
              </div>
            </div>

            {/* Staff Bio Meta */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Nama Penerima (Staff)
                </span>
                <p className="font-extrabold text-sm text-slate-900">{slipData.staff.name}</p>
                <p className="text-slate-600">ID Kode: {slipData.staff.code}</p>
              </div>

              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                  Cabang Penempatan
                </span>
                <p className="font-bold text-xs text-slate-900">{slipData.staff.branchName}</p>
                <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded mt-1">
                  Status: VERIFIED & APPROVED
                </span>
              </div>
            </div>

            {/* Detailed Products Breakdown Table */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Rincian Laku Produk Fokus & Nominal Insentif:
              </h4>

              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-300 text-slate-700 font-bold uppercase text-[10px] bg-slate-100">
                    <th className="py-2 px-3">No</th>
                    <th className="py-2 px-3">Brand</th>
                    <th className="py-2 px-3">Nama Produk Fokus</th>
                    <th className="py-2 px-3 text-center">Qty Laku</th>
                    <th className="py-2 px-3 text-right">Rate / Unit</th>
                    <th className="py-2 px-3 text-right">Subtotal Insentif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                  {slipData.items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-400 italic">
                        Belum ada transaksi produk fokus untuk staff ini di periode dipilih.
                      </td>
                    </tr>
                  ) : (
                    slipData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-3 font-semibold text-slate-500">{idx + 1}</td>
                        <td className="py-2 px-3">
                          <span className="font-bold text-slate-900">{item.brand}</span>
                        </td>
                        <td className="py-2 px-3">{item.productName}</td>
                        <td className="py-2 px-3 text-center font-bold">{item.quantity} unit</td>
                        <td className="py-2 px-3 text-right text-slate-600">
                          {formatRupiah(item.ratePerUnit)}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-blue-700">
                          {formatRupiah(item.subtotal)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Brand Summary Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <p className="font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">
                  Akumulasi Total Per Brand:
                </p>
                <div className="space-y-1.5">
                  {slipData.summaryByBrand.map((sb) => (
                    <div key={sb.brand} className="flex justify-between text-slate-700">
                      <span>Brand <strong>{sb.brand}</strong> ({sb.totalUnits} unit)</span>
                      <span className="font-bold">{formatRupiah(sb.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="bg-blue-50/80 p-4 rounded-xl border border-blue-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal Insentif Penjualan:</span>
                  <span className="font-bold">{formatRupiah(slipData.baseIncentive)}</span>
                </div>

                {slipData.bonusAchievement > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Bonus Pencapaian Target ({'>'}100 unit):</span>
                    <span>+{formatRupiah(slipData.bonusAchievement)}</span>
                  </div>
                )}

                <div className="border-t border-blue-200 pt-2 flex justify-between items-center text-sm">
                  <span className="font-extrabold text-slate-900">TOTAL DITERIMA (NET):</span>
                  <span className="font-extrabold text-blue-700 text-base">
                    {formatRupiah(slipData.totalIncentiveNet)}
                  </span>
                </div>
              </div>
            </div>

            {/* Signatures Area */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-3 gap-4 text-center text-xs">
              <div className="space-y-12">
                <p className="font-semibold text-slate-600">Penerima (Staff)</p>
                <div>
                  <p className="font-bold text-slate-900 underline">{slipData.staff.name}</p>
                  <p className="text-[10px] text-slate-500">Staff Toko</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-semibold text-slate-600">Disetujui Oleh (Admin)</p>
                <div>
                  <p className="font-bold text-slate-900 underline">Siti Admin Store</p>
                  <p className="text-[10px] text-slate-500">Head Admin Store</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="font-semibold text-slate-600">Diketahui Oleh (Owner)</p>
                <div>
                  <p className="font-bold text-slate-900 underline">H. Hendra</p>
                  <p className="text-[10px] text-slate-500">Store Owner</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">Data slip tidak ditemukan.</div>
        )}

      </div>
    </div>
  );
};
