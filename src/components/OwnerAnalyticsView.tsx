import React from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatNumber, getMonthName } from '../utils/formatters';
import { 
  BarChart3, 
  TrendingUp, 
  Crown, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  DollarSign, 
  Download,
  Users
} from 'lucide-react';

export const OwnerAnalyticsView: React.FC = () => {
  const {
    branches,
    staffList,
    filteredTransactions,
    brandTargetSummaries,
    totalGlobalIncentive,
    totalGlobalUnitsSold,
    selectedPeriod,
  } = useApp();

  // Branch Performance Analysis
  const branchPerformance = branches.map((b) => {
    const branchTxs = filteredTransactions.filter((t) => t.branchId === b.id);
    const branchUnits = branchTxs.reduce((sum, t) => sum + t.quantitySold, 0);
    const branchIncentive = branchTxs.reduce((sum, t) => sum + t.totalIncentive, 0);
    const staffCount = staffList.filter((s) => s.branchId === b.id).length;

    return {
      branch: b,
      unitsSold: branchUnits,
      incentivePaid: branchIncentive,
      staffCount,
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Executive Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-900 rounded-2xl p-6 text-white border border-amber-800/40 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Executive Owner Dashboard
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-white mt-1">
              Laporan Kinerja & Beban Insentif Store
            </h2>
            <p className="text-slate-300 text-xs mt-1">
              Pantau total biaya insentif, kontribusi penjualan per cabang, serta evaluasi program produk fokus {getMonthName(selectedPeriod)}.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-amber-600/30 cursor-pointer self-start md:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Cetak Laporan Owner</span>
          </button>
        </div>
      </div>

      {/* Top 3 Executive Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Liabilitas Insentif Staff
          </span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {formatRupiah(totalGlobalIncentive)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Dicairkan pada akhir bulan {getMonthName(selectedPeriod)}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Total Unit Produk Fokus Laku
          </span>
          <p className="text-2xl font-black text-blue-600 mt-2">
            {formatNumber(totalGlobalUnitsSold)} <span className="text-sm font-medium text-slate-500">unit</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Di seluruh toko cabang
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Rata-rata Insentif / Staff
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-2">
            {staffList.length > 0 ? formatRupiah(Math.round(totalGlobalIncentive / staffList.length)) : 'Rp 0'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Dari {staffList.length} staff aktif
          </p>
        </div>

      </div>

      {/* Branch Comparison Matrix */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
        <h3 className="font-bold text-base text-slate-900 mb-1">
          Analisis Perbandingan Kinerja Cabang Store
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Perbandingan total sell-out produk fokus dan alokasi insentif di masing-masing cabang
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {branchPerformance.map((bp) => (
            <div
              key={bp.branch.id}
              className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span>{bp.branch.name}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{bp.branch.address}</p>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Jumlah Staff Active:</span>
                    <span className="font-bold text-slate-900">{bp.staffCount} orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Unit Fokus Laku:</span>
                    <span className="font-bold text-blue-600">{bp.unitsSold} unit</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total Insentif Cabang:</span>
                    <span className="font-extrabold text-slate-900">{formatRupiah(bp.incentivePaid)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Manajer: {bp.branch.managerName}</span>
                <span className="font-bold text-blue-600">Code: {bp.branch.code}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Contribution Breakdown Matrix Table for Owner & Admin */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-base text-[#2B3674] flex items-center space-x-2">
              <span>Rincian Nilai Insentif / Brand & Kinerja Target (Owner Executive)</span>
            </h3>
            <p className="text-xs text-[#A3AED0] mt-0.5">
              Tabel evaluasi beban insentif per brand dan pencapaian target sell-out seluruh jaringan store
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold self-start sm:self-auto">
            Audit Insentif Brand
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[#A3AED0] uppercase tracking-wider font-bold text-[10px] bg-[#F4F7FE]">
                <th className="py-3.5 px-4 rounded-l-xl">Nama Brand</th>
                <th className="py-3.5 px-4 text-center">Target Store (Unit)</th>
                <th className="py-3.5 px-4 text-center">Qtty Terjual</th>
                <th className="py-3.5 px-4 text-right text-[#4318FF] font-black">Nilai Insentif / Brand</th>
                <th className="py-3.5 px-4 text-center">Porsi Beban (%)</th>
                <th className="py-3.5 px-4 text-center rounded-r-xl">Status Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
              {brandTargetSummaries.map((b) => {
                const shareOfTotalIncentive = totalGlobalIncentive > 0
                  ? Math.round((b.totalIncentivePaid / totalGlobalIncentive) * 100)
                  : 0;

                return (
                  <tr key={b.brand} className="hover:bg-[#F4F7FE]/60 transition">
                    
                    {/* Nama Brand */}
                    <td className="py-4 px-4 font-bold text-sm text-[#2B3674]">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#4318FF] shrink-0" />
                        <span className="text-sm font-extrabold">{b.brand}</span>
                      </div>
                    </td>

                    {/* Target Store */}
                    <td className="py-4 px-4 text-center font-semibold text-[#A3AED0]">
                      {formatNumber(b.targetQuantity)} unit
                    </td>

                    {/* Qtty Terjual */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-extrabold text-[#2B3674] bg-[#F4F7FE] px-3 py-1 rounded-xl border border-slate-200/80">
                        {formatNumber(b.totalQuantitySold)} unit
                      </span>
                    </td>

                    {/* Nilai Insentif / Brand */}
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-[#4318FF] text-base bg-[#4318FF]/5 px-3 py-1 rounded-xl border border-[#4318FF]/20 shadow-xs">
                        {formatRupiah(b.totalIncentivePaid)}
                      </span>
                    </td>

                    {/* Porsi Beban */}
                    <td className="py-4 px-4 text-center font-bold text-[#2B3674]">
                      <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                        {shareOfTotalIncentive}% dari Total
                      </span>
                    </td>

                    {/* Status Program */}
                    <td className="py-4 px-4 text-center">
                      {b.shortfallQuantity > 0 ? (
                        <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-lg text-xs border border-red-200 inline-block">
                          Defisit {b.shortfallQuantity} u
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg text-xs border border-emerald-200 inline-block">
                          ✓ 100% Target
                        </span>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>

            {/* Table Footer */}
            <tfoot>
              <tr className="bg-[#0B1437] text-white font-extrabold text-xs">
                <td className="py-3.5 px-4 rounded-l-xl">
                  TOTAL BIAYA LIABILITAS INSENTIF BRAND
                </td>
                <td className="py-3.5 px-4 text-center text-slate-300">
                  {formatNumber(brandTargetSummaries.reduce((acc, curr) => acc + curr.targetQuantity, 0))} u
                </td>
                <td className="py-3.5 px-4 text-center text-blue-300 font-bold">
                  {formatNumber(totalGlobalUnitsSold)} unit
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-300 font-black text-base">
                  {formatRupiah(totalGlobalIncentive)}
                </td>
                <td className="py-3.5 px-4 text-center text-blue-200">
                  100% Total
                </td>
                <td className="py-3.5 px-4 text-center rounded-r-xl text-amber-300">
                  Audit Verifikasi Verified
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

    </div>
  );
};
