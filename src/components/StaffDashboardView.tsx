import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatNumber, getMonthName } from '../utils/formatters';
import {
  DollarSign,
  Package,
  Trophy,
  PlusCircle,
  Receipt,
  User,
  Building,
  Crown,
  Medal,
  Award,
  Sparkles,
  Layers,
  ArrowUpRight,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

interface StaffDashboardViewProps {
  onNavigate: (tab: 'input_sales' | 'focus_products' | 'staff_matrix' | 'incentive_slips') => void;
  onOpenSlipForStaff: (staffId: string) => void;
}

export const StaffDashboardView: React.FC<StaffDashboardViewProps> = ({
  onNavigate,
  onOpenSlipForStaff,
}) => {
  const {
    currentUser,
    selectedPeriod,
    selectedBranchId,
    branches,
    focusProducts,
    filteredTransactions,
    staffIncentiveSummaries,
    staffList,
  } = useApp();

  // Find logged-in staff's summary
  const mySummary = useMemo(() => {
    return (
      staffIncentiveSummaries.find((s) => s.staffId === currentUser.id) || {
        staffId: currentUser.id,
        staffName: currentUser.name,
        branchName: currentUser.branchName,
        brandBreakdown: {},
        totalQuantity: 0,
        totalIncentive: 0,
        rank: staffIncentiveSummaries.length + 1,
      }
    );
  }, [staffIncentiveSummaries, currentUser]);

  // Compute Top Products by Qtty Sold
  const topProductsByQtty = useMemo(() => {
    const map: Record<
      string,
      { id: string; name: string; brand: string; category: string; qtty: number; totalIncentive: number; incentivePerUnit: number }
    > = {};

    filteredTransactions.forEach((tx) => {
      if (!map[tx.productId]) {
        map[tx.productId] = {
          id: tx.productId,
          name: tx.productName,
          brand: tx.brand,
          category: tx.category || 'Liquid',
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

  // Compute Brand Breakdown list for current staff
  const staffBrandList = useMemo(() => {
    // Unique brands from focus products
    const brandsSet = new Set(focusProducts.map((p) => p.brand));
    const list = Array.from(brandsSet).map((brandName) => {
      const brandProducts = focusProducts.filter((p) => p.brand === brandName);
      const myBrandTxs = filteredTransactions.filter(
        (t) => t.staffId === currentUser.id && t.brand === brandName
      );

      const qttySold = myBrandTxs.reduce((sum, t) => sum + t.quantitySold, 0);
      const totalIncentive = myBrandTxs.reduce((sum, t) => sum + t.totalIncentive, 0);
      const sampleProduct = brandProducts[0];
      const rate = sampleProduct ? sampleProduct.incentivePerUnit : 10000;

      return {
        brand: brandName,
        category: sampleProduct?.category || 'Liquid',
        rate,
        qttySold,
        totalIncentive,
      };
    });

    // Sort by totalIncentive descending
    return list.sort((a, b) => b.totalIncentive - a.totalIncentive);
  }, [focusProducts, filteredTransactions, currentUser.id]);

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner Personal Staff */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2E1065] rounded-3xl p-6 text-white border border-indigo-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-400/20 via-[#4318FF]/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-[#4318FF] to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg shadow-[#4318FF]/40">
                <User className="w-3.5 h-3.5 mr-1" />
                <span>Dashboard Staff Toko</span>
              </span>
              <span className="bg-[#181E3B] text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-indigo-500/40">
                {mySummary.branchName}
              </span>
              <span className="bg-[#4318FF]/30 text-cyan-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-[#4318FF]/40">
                Periode: {getMonthName(selectedPeriod)}
              </span>
            </div>

            <h2 className="text-2xl font-black mt-2.5 text-white tracking-tight flex items-center gap-2">
              <span>Halo, {currentUser.name}!</span>
            </h2>
            <p className="text-indigo-200/90 text-xs mt-1 max-w-xl font-medium">
              Berikut adalah ringkasan pendapatan insentif personal Anda, jumlah qtty terjual per brand, serta peringkat performa tim toko.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onOpenSlipForStaff(currentUser.id)}
              className="bg-[#181E3B] hover:bg-[#251B4E] text-white border border-indigo-500/40 font-bold text-xs px-4 py-2.5 rounded-2xl transition flex items-center space-x-2 cursor-pointer shadow-lg"
            >
              <Receipt className="w-4 h-4 text-emerald-400" />
              <span>Cetak Slip Insentif Saya</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Personal KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* KPI 1: Pendapatan Insentif Sesuai Nama */}
        <div className="bg-white rounded-2xl p-5 border-2 border-[#4318FF]/30 shadow-[0_4px_20px_0_rgba(67,24,255,0.1)] hover:shadow-xl transition relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#4318FF] uppercase tracking-wider">
              Pendapatan Insentif Anda
            </span>
            <div className="w-12 h-12 rounded-2xl bg-[#4318FF] text-white flex items-center justify-center font-bold shadow-lg shadow-[#4318FF]/30">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2B3674] mt-2">
            {formatRupiah(mySummary.totalIncentive)}
          </p>
          <div className="mt-2 text-[11px] font-semibold text-[#A3AED0] flex items-center justify-between">
            <span>Atas Nama: <strong className="text-[#2B3674]">{currentUser.name}</strong></span>
            <span className="text-emerald-600 font-bold">Terhitung</span>
          </div>
        </div>

        {/* KPI 2: Total Qtty Terjual oleh Staff */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider">
              Total Qtty Terjual
            </span>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2B3674] mt-2">
            {formatNumber(mySummary.totalQuantity)} <span className="text-sm font-semibold text-[#A3AED0]">Unit</span>
          </p>
          <p className="mt-2 text-[11px] text-emerald-600 font-bold flex items-center">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            <span>Produk fokus laku bulan ini</span>
          </p>
        </div>

        {/* KPI 3: Peringkat Performa Staff */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider">
              Posisi Peringkat Anda
            </span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Trophy className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2B3674] mt-2">
            Rank #{mySummary.rank} <span className="text-xs font-semibold text-[#A3AED0]">/ {staffIncentiveSummaries.length} Staff</span>
          </p>
          <p className="mt-2 text-[11px] text-amber-600 font-extrabold">
            {mySummary.rank === 1 ? '🥇 Top #1 Producer Team!' : 'Terus tingkatkan sell-out!'}
          </p>
        </div>

        {/* KPI 4: Varian Brand Laku */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#A3AED0] uppercase tracking-wider">
              Brand Berhasil Dijual
            </span>
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2B3674] mt-2">
            {Object.keys(mySummary.brandBreakdown).length} <span className="text-sm font-semibold text-[#A3AED0]">Brand</span>
          </p>
          <p className="mt-2 text-[11px] text-cyan-600 font-bold">
            Dari {focusProducts.length} Produk Fokus Aktif
          </p>
        </div>

      </div>

      {/* SECTION 2: JUMLAH QTTY PERBRAND YG SUDAH TERKUMPUL & NOMINAL INSENTIF */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] space-y-4">
        
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#4318FF]" />
            <h3 className="text-base font-bold text-[#2B3674]">
              Akumulasi Qtty Per-Brand & Nominal Insentif ({currentUser.name})
            </h3>
          </div>
          <p className="text-xs text-[#A3AED0] mt-0.5">
            Rincian jumlah unit (Qtty) produk fokus yang telah Anda jual dan nominal rupiah insentif per brand
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F4F7FE] border-b border-slate-200 text-[#A3AED0] font-bold text-[10px] uppercase">
                <th className="py-3 px-4">Nama Brand Produk Fokus</th>
                <th className="py-3 px-4 text-center">Rate Insentif / Unit</th>
                <th className="py-3 px-4 text-center text-[#2B3674] font-black">
                  Jumlah Qtty Terkumpul ({currentUser.name})
                </th>
                <th className="py-3 px-4 text-right text-[#4318FF] font-black">
                  Nominal Insentif Anda (Rp)
                </th>
                <th className="py-3 px-4 text-center">Status Keaktifan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
              {staffBrandList.map((item) => (
                <tr key={item.brand} className="hover:bg-[#F4F7FE]/60 transition">
                  <td className="py-3.5 px-4 font-bold text-sm text-[#2B3674]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4318FF]" />
                      <span>{item.brand}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#A3AED0] font-semibold">
                    {formatRupiah(item.rate)} / unit
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-black text-[#2B3674] bg-[#F4F7FE] px-3 py-1 rounded-xl border border-slate-200 text-sm">
                      {formatNumber(item.qttySold)} unit
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="font-black text-[#4318FF] text-sm bg-[#4318FF]/10 px-3 py-1 rounded-xl border border-[#4318FF]/20">
                      {formatRupiah(item.totalIncentive)}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {item.qttySold > 0 ? (
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center justify-center space-x-1 w-fit mx-auto">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Penjualan Aktif</span>
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Belum ada sell-out
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

            {/* Table Footer Totals */}
            <tfoot>
              <tr className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#2E1065] text-white font-black text-xs border-t border-indigo-500/30">
                <td className="py-3.5 px-4 rounded-l-xl">
                  TOTAL INSENTIF & QTTY PENDAPATAN SAYA
                </td>
                <td className="py-3.5 px-4 text-center text-indigo-300">
                  -
                </td>
                <td className="py-3.5 px-4 text-center text-cyan-300 font-black text-sm">
                  {formatNumber(mySummary.totalQuantity)} Unit
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-300 font-black text-base">
                  {formatRupiah(mySummary.totalIncentive)}
                </td>
                <td className="py-3.5 px-4 text-center rounded-r-xl text-amber-300 font-bold">
                  Hak Terbayar
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

      {/* SECTION 3: LEADERBOARD POSISI PRODUK & STAFF DENGAN PENDAPATAN QTTY TERTINGGI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEADERBOARD A: POSISI PRODUK DENGAN QTTY TERJUAL TERTINGGI */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Medal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B3674]">
                    Posisi Produk Fokus dengan Qtty Terjual Tertinggi
                  </h3>
                  <p className="text-[11px] text-[#A3AED0]">Peringkat produk paling laris terjual toko vape</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                Top Qtty
              </span>
            </div>

            <div className="space-y-3">
              {topProductsByQtty.length > 0 ? (
                topProductsByQtty.slice(0, 5).map((prod, idx) => (
                  <div
                    key={prod.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      idx === 0
                        ? 'bg-gradient-to-r from-amber-50/70 to-orange-50/40 border-amber-200 shadow-sm'
                        : 'border-slate-100 hover:bg-[#F4F7FE]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          idx === 0
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-800 text-amber-100'
                            : 'bg-[#F4F7FE] text-[#4318FF]'
                        }`}
                      >
                        #{idx + 1}
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#2B3674]">{prod.name}</p>
                        <div className="flex items-center space-x-2 text-[10px] text-[#A3AED0]">
                          <span className="font-bold text-[#4318FF]">{prod.brand}</span>
                          <span>•</span>
                          <span>Rate: {formatRupiah(prod.incentivePerUnit)}/u</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-[#2B3674] bg-[#F4F7FE] px-2.5 py-1 rounded-lg border border-slate-200">
                        {formatNumber(prod.qtty)} Unit
                      </p>
                      <p className="text-[10px] font-bold text-[#4318FF] mt-0.5">
                        {formatRupiah(prod.totalIncentive)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#A3AED0] text-center py-6">Belum ada data penjualan produk</p>
              )}
            </div>
          </div>
        </div>

        {/* LEADERBOARD B: POSISI STAFF DENGAN PENDAPATAN QTTY TERTINGGI */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-[#4318FF]/10 text-[#4318FF] flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#2B3674]">
                    Posisi Staff dengan Pendapatan Qtty Tertinggi
                  </h3>
                  <p className="text-[11px] text-[#A3AED0]">Peringkat sell-out terbanyak tim staff toko</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold bg-[#4318FF]/10 text-[#4318FF] border border-[#4318FF]/20 px-2 py-0.5 rounded-full">
                Team Ranking
              </span>
            </div>

            <div className="space-y-3">
              {staffIncentiveSummaries.map((st, idx) => {
                const isMe = st.staffId === currentUser.id;
                return (
                  <div
                    key={st.staffId}
                    className={`flex items-center justify-between p-3 rounded-xl border transition ${
                      isMe
                        ? 'bg-blue-50/80 border-[#4318FF] shadow-md shadow-[#4318FF]/10'
                        : idx === 0
                        ? 'bg-amber-50/50 border-amber-200'
                        : 'border-slate-100 hover:bg-[#F4F7FE]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                          idx === 0
                            ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                            : idx === 1
                            ? 'bg-slate-300 text-slate-800'
                            : idx === 2
                            ? 'bg-amber-800 text-amber-100'
                            : 'bg-[#F4F7FE] text-[#4318FF]'
                        }`}
                      >
                        #{st.rank}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="text-xs font-bold text-[#2B3674]">{st.staffName}</p>
                          {isMe && (
                            <span className="bg-[#4318FF] text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                              ★ Anda
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#A3AED0] truncate max-w-[140px]">
                          {st.branchName}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs font-extrabold text-[#4318FF]">
                        {formatRupiah(st.totalIncentive)}
                      </p>
                      <p className="text-[10px] font-bold text-[#2B3674]">
                        {formatNumber(st.totalQuantity)} Unit Sold
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
