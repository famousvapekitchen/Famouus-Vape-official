import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StaffDashboardView } from './StaffDashboardView';
import { formatRupiah, formatNumber, getMonthName } from '../utils/formatters';
import { 
  DollarSign, 
  Package, 
  AlertTriangle, 
  Trophy, 
  TrendingUp, 
  ArrowUpRight, 
  Search,
  PlusCircle,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: 'input_sales' | 'focus_products' | 'staff_matrix' | 'incentive_slips') => void;
  onOpenSlipForStaff: (staffId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenSlipForStaff,
}) => {
  const {
    selectedPeriod,
    selectedBranchId,
    branches,
    filteredTransactions,
    brandTargetSummaries,
    staffIncentiveSummaries,
    totalGlobalIncentive,
    totalGlobalUnitsSold,
    topEarningStaff,
    currentRole,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Compute Top Products by Qtty
  const topProductsByQtty = React.useMemo(() => {
    const map: Record<
      string,
      { id: string; name: string; brand: string; qtty: number; totalIncentive: number; incentivePerUnit: number }
    > = {};

    filteredTransactions.forEach((tx) => {
      if (!map[tx.productId]) {
        map[tx.productId] = {
          id: tx.productId,
          name: tx.productName,
          brand: tx.brand,
          qtty: 0,
          totalIncentive: 0,
          incentivePerUnit: tx.incentivePerUnit,
        };
      }
      map[tx.productId].qtty += tx.quantitySold;
      map[tx.productId].totalIncentive += tx.totalIncentive;
    });

    return Object.values(map).sort((a, b) => b.qtty - a.qtty);
  }, [filteredTransactions]);

  // If current role is staff, render dedicated Staff Dashboard View
  if (currentRole === 'staff') {
    return (
      <StaffDashboardView
        onNavigate={onNavigate}
        onOpenSlipForStaff={onOpenSlipForStaff}
      />
    );
  }

  // Calculate total deficit units across brands
  const totalTargetShortfall = brandTargetSummaries.reduce(
    (sum, b) => sum + b.shortfallQuantity,
    0
  );

  const totalTargetUnits = brandTargetSummaries.reduce(
    (sum, b) => sum + b.targetQuantity,
    0
  );

  const overallAchievementPercent =
    totalTargetUnits > 0
      ? Math.min(100, Math.round((totalGlobalUnitsSold / totalTargetUnits) * 100))
      : 100;

  // Filtered recent transactions list
  const searchedTransactions = filteredTransactions.filter((tx) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.staffName.toLowerCase().includes(searchLower) ||
      tx.productName.toLowerCase().includes(searchLower) ||
      tx.brand.toLowerCase().includes(searchLower) ||
      tx.branchName.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2E1065] rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-[#4318FF]/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#4318FF]/30 text-cyan-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-[#4318FF]/40">
                Periode: {getMonthName(selectedPeriod)}
              </span>
              <span className="bg-[#181E3B] text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-500/40">
                {selectedBranchId === 'all'
                  ? 'Semua Cabang Toko'
                  : branches.find((b) => b.id === selectedBranchId)?.name}
              </span>
            </div>
            <h2 className="text-2xl font-black mt-2.5 text-white tracking-tight">
              Ringkasan Insentif Produk Fokus Vape Store
            </h2>
            <p className="text-indigo-200/90 text-xs mt-1 max-w-2xl font-medium">
              Pantau real-time sell-out produk fokus, akumulasi insentif per brand, kekurangan target berjalan, dan slip insentif staff.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(currentRole === 'staff' || currentRole === 'admin') && (
              <button
                id="btn-quick-add-sales"
                onClick={() => onNavigate('input_sales')}
                className="bg-gradient-to-r from-[#4318FF] to-indigo-600 hover:from-[#3810E6] hover:to-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center space-x-2 shadow-lg shadow-[#4318FF]/30 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Input Sell-out Penjualan</span>
              </button>
            )}

            <button
              id="btn-quick-view-matrix"
              onClick={() => onNavigate('staff_matrix')}
              className="bg-[#181E3B] hover:bg-[#251B4E] text-slate-100 border border-indigo-500/40 font-bold text-xs px-3.5 py-2.5 rounded-2xl transition flex items-center space-x-1.5 cursor-pointer shadow-md"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Matriks Staff & Brand</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metric Cards (Professional Polish Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Total Global Insentif */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
              Total Insentif Terkumpul
            </span>
            <div className="w-12 h-12 rounded-full bg-[#F4F7FE] text-[#4318FF] flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B3674] mt-2">
            {formatRupiah(totalGlobalIncentive)}
          </p>
          <div className="mt-2 flex items-center text-xs text-[#A3AED0]">
            <span className="text-emerald-600 font-bold flex items-center mr-1">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              {totalGlobalUnitsSold} unit
            </span>
            <span>sell-out bulan ini</span>
          </div>
        </div>

        {/* KPI 2: Target Berjalan vs Actual */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
              Target Unit Berjalan
            </span>
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B3674] mt-2">
            {formatNumber(totalGlobalUnitsSold)} <span className="text-sm font-medium text-[#A3AED0]">/ {formatNumber(totalTargetUnits)} unit</span>
          </p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="w-full bg-[#E9EDF7] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#4318FF] h-full rounded-full"
                style={{ width: `${overallAchievementPercent}%` }}
              />
            </div>
            <span className="text-xs font-bold text-[#4318FF] shrink-0">
              {overallAchievementPercent}%
            </span>
          </div>
        </div>

        {/* KPI 3: Target Kekurangan / Defisit (Red Accent) */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
              Kekurangan Target Brand
            </span>
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#2B3674] mt-2">
            {formatNumber(totalTargetShortfall)} <span className="text-sm font-medium text-[#A3AED0]">unit</span>
          </p>
          <p className="mt-2 text-xs text-red-500 font-semibold">
            {totalTargetShortfall === 0
              ? '🎉 Semua target brand telah tercapai!'
              : 'Butuh dorongan sell-out untuk bonus full'}
          </p>
        </div>

        {/* KPI 4: Top Earning Staff */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#A3AED0] uppercase tracking-wider">
              Insentif Staff Tertinggi
            </span>
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          {topEarningStaff ? (
            <div>
              <p className="text-lg font-bold text-[#2B3674] mt-2 truncate">
                {topEarningStaff.staffName}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-[#A3AED0]">{topEarningStaff.branchName}</span>
                <span className="text-sm font-extrabold text-[#4318FF]">
                  {formatRupiah(topEarningStaff.totalIncentive)}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#A3AED0] mt-2">Belum ada data</p>
          )}
        </div>

      </div>

      {/* Brand Progress Matrix & Staff Ranking Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Brand Target Summaries & Incentive Value Table (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#2B3674]">
                  Rekapitulasi Nilai Insentif Per Brand (Admin & Owner)
                </h3>
                <span className="px-2 py-0.5 rounded bg-[#4318FF]/10 text-[#4318FF] font-extrabold text-[10px]">
                  {brandTargetSummaries.length} Brand Active
                </span>
              </div>
              <p className="text-xs text-[#A3AED0] mt-0.5">
                Rincian akumulasi unit laku (Qtty) dan total nilai insentif terbayar per brand produk fokus
              </p>
            </div>
            <button
              id="btn-goto-focus-products"
              onClick={() => onNavigate('focus_products')}
              className="text-xs font-bold text-[#4318FF] hover:text-[#3810E6] flex items-center cursor-pointer shrink-0"
            >
              <span>Kelola Master Brand</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[#A3AED0] uppercase tracking-wider font-bold text-[10px] bg-[#F4F7FE]">
                  <th className="py-3 px-3 rounded-l-xl">Nama Brand</th>
                  <th className="py-3 px-3 text-center">Target (Unit)</th>
                  <th className="py-3 px-3 text-center">Qtty Terjual</th>
                  <th className="py-3 px-3 text-right text-[#4318FF] font-black">Nilai Insentif / Brand</th>
                  <th className="py-3 px-3 text-center">Pencapaian</th>
                  <th className="py-3 px-3 text-center rounded-r-xl">Status Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {brandTargetSummaries.map((b) => (
                  <tr key={b.brand} className="hover:bg-[#F4F7FE]/60 transition">
                    
                    {/* Nama Brand */}
                    <td className="py-3.5 px-3 font-bold text-[#2B3674]">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 rounded-full bg-[#4318FF]" />
                        <span className="text-sm">{b.brand}</span>
                      </div>
                    </td>

                    {/* Target Unit */}
                    <td className="py-3.5 px-3 text-center text-[#A3AED0] font-semibold">
                      {formatNumber(b.targetQuantity)} u
                    </td>

                    {/* Qtty Terjual */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold text-[#2B3674] bg-[#F4F7FE] px-2.5 py-1 rounded-lg border border-slate-200/80">
                        {formatNumber(b.totalQuantitySold)} unit
                      </span>
                    </td>

                    {/* Nilai Insentif / Brand */}
                    <td className="py-3.5 px-3 text-right">
                      <span className="font-black text-[#4318FF] text-sm bg-[#4318FF]/5 px-2.5 py-1 rounded-lg border border-[#4318FF]/20">
                        {formatRupiah(b.totalIncentivePaid)}
                      </span>
                    </td>

                    {/* Progress Percentage */}
                    <td className="py-3.5 px-3 text-center">
                      <div className="flex items-center space-x-2 justify-center">
                        <div className="w-16 bg-[#E9EDF7] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              b.achievementPercentage >= 100
                                ? 'bg-emerald-500'
                                : b.achievementPercentage >= 60
                                ? 'bg-[#4318FF]'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, b.achievementPercentage)}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-[#2B3674]">
                          {b.achievementPercentage}%
                        </span>
                      </div>
                    </td>

                    {/* Status Target */}
                    <td className="py-3.5 px-3 text-center">
                      {b.shortfallQuantity > 0 ? (
                        <span className="text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded text-[10px] border border-red-200">
                          Defisit {b.shortfallQuantity} u
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          Tercapai!
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
              
              {/* Table Footer Totals */}
              <tfoot>
                <tr className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2E1065] text-white font-black text-xs border-t border-indigo-500/30">
                  <td className="py-3 px-3 rounded-l-xl">
                    TOTAL KESELURUHAN BRAND
                  </td>
                  <td className="py-3 px-3 text-center text-indigo-200">
                    {formatNumber(totalTargetUnits)} u
                  </td>
                  <td className="py-3 px-3 text-center text-cyan-300 font-bold">
                    {formatNumber(totalGlobalUnitsSold)} unit
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-300 font-black text-sm">
                    {formatRupiah(totalGlobalIncentive)}
                  </td>
                  <td className="py-3 px-3 text-center text-blue-200">
                    {overallAchievementPercent}%
                  </td>
                  <td className="py-3 px-3 text-center rounded-r-xl text-amber-300">
                    {totalTargetShortfall === 0 ? 'Full Achievement' : `${totalTargetShortfall} u Defisit`}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Top Staff Leaderboard List & Top Products (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Top Staff Leaderboard */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-[#2B3674]">
                    Peringkat Staff (Pendapatan Qtty Tertinggi)
                  </h3>
                  <p className="text-[11px] text-[#A3AED0]">Ranking staff berdasar akumulasi unit laku</p>
                </div>
                <span className="text-xs font-bold text-[#4318FF] bg-[#4318FF]/10 px-2 py-0.5 rounded-full">Top Staff</span>
              </div>

              <div className="space-y-3">
                {staffIncentiveSummaries.slice(0, 4).map((staff, idx) => (
                  <div
                    key={staff.staffId}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-[#F4F7FE] transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold ${
                          idx === 0
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                            ? 'bg-amber-900/10 text-amber-800'
                            : 'bg-[#F4F7FE] text-[#4318FF]'
                        }`}
                      >
                        #{staff.rank}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#2B3674]">{staff.staffName}</p>
                        <p className="text-[11px] text-[#A3AED0] truncate max-w-[130px]">
                          {staff.branchName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-extrabold text-[#4318FF]">
                        {formatRupiah(staff.totalIncentive)}
                      </p>
                      <p className="text-[10px] text-[#2B3674] font-bold">{staff.totalQuantity} unit sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              id="btn-goto-staff-matrix"
              onClick={() => onNavigate('staff_matrix')}
              className="w-full mt-4 text-center py-2 text-xs font-bold text-[#4318FF] hover:text-white bg-[#4318FF]/10 hover:bg-[#4318FF] rounded-xl transition cursor-pointer"
            >
              Lihat Detail Akumulasi Staff & Brand →
            </button>
          </div>

          {/* Top Focus Products by Qtty */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#2B3674]">
                  Top Produk Fokus (Qtty Terjual)
                </h3>
                <p className="text-[11px] text-[#A3AED0]">Produk paling laku terjual toko vape</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Terlaris</span>
            </div>

            <div className="space-y-3">
              {topProductsByQtty.slice(0, 4).map((prod, idx) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-[#F4F7FE] transition"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-extrabold ${
                        idx === 0
                          ? 'bg-amber-500 text-white'
                          : 'bg-[#F4F7FE] text-[#2B3674]'
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2B3674]">{prod.name}</p>
                      <p className="text-[10px] font-semibold text-[#4318FF]">{prod.brand}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-black text-[#2B3674] bg-[#F4F7FE] px-2 py-1 rounded-lg border border-slate-200">
                      {formatNumber(prod.qtty)} Unit
                    </span>
                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">
                      {formatRupiah(prod.totalIncentive)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Recent Transactions Feed */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#2B3674]">
              Riwayat Transaksi Sell-out Terbaru
            </h3>
            <p className="text-xs text-[#A3AED0]">
              Daftar pencatatan penjualan produk fokus oleh staff di toko
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#A3AED0]" />
            <input
              id="input-search-recent-transactions"
              type="text"
              placeholder="Cari staff, produk, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
            />
          </div>
        </div>

        {searchedTransactions.length === 0 ? (
          <div className="text-center py-8 text-[#A3AED0] text-xs">
            Belum ada data transaksi untuk filter yang dipilih.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[#A3AED0] uppercase tracking-wider font-semibold text-[10px] bg-[#F4F7FE]/60">
                  <th className="py-3 px-3">Tanggal</th>
                  <th className="py-3 px-3">Staff</th>
                  <th className="py-3 px-3">Cabang Store</th>
                  <th className="py-3 px-3">Produk Fokus</th>
                  <th className="py-3 px-3">Brand</th>
                  <th className="py-3 px-3 text-center">Jumlah (Unit)</th>
                  <th className="py-3 px-3 text-right">Nominal Insentif</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-3 text-center">Aksi Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {searchedTransactions.slice(0, 10).map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F4F7FE]/60 transition">
                    <td className="py-3 px-3 whitespace-nowrap text-[#A3AED0]">{tx.date}</td>
                    <td className="py-3 px-3 font-semibold text-[#2B3674]">{tx.staffName}</td>
                    <td className="py-3 px-3 text-[#A3AED0] truncate max-w-[150px]">{tx.branchName}</td>
                    <td className="py-3 px-3 font-medium text-[#2B3674]">{tx.productName}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-[#4318FF]/10 text-[#4318FF] font-bold text-[10px]">
                        {tx.brand}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#2B3674]">{tx.quantitySold}</td>
                    <td className="py-3 px-3 text-right font-bold text-[#4318FF]">
                      {formatRupiah(tx.totalIncentive)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        id={`btn-slip-tx-${tx.id}`}
                        onClick={() => onOpenSlipForStaff(tx.staffId)}
                        className="text-[#4318FF] hover:text-[#3810E6] font-semibold text-[11px] underline cursor-pointer"
                      >
                        Cetak Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
