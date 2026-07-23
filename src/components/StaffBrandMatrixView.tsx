import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { 
  Users, 
  Search, 
  Receipt, 
  Building, 
  Download,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface StaffBrandMatrixViewProps {
  onOpenSlipForStaff: (staffId: string) => void;
}

export const StaffBrandMatrixView: React.FC<StaffBrandMatrixViewProps> = ({
  onOpenSlipForStaff,
}) => {
  const {
    staffIncentiveSummaries,
    focusProducts,
    selectedBranchId,
    setSelectedBranchId,
    branches,
    selectedPeriod,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');

  // Extract list of all active brands
  const allBrands: string[] = Array.from(new Set<string>(focusProducts.map((p) => p.brand)));

  // Filtered staff list
  const filteredStaff = staffIncentiveSummaries.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.staffName.toLowerCase().includes(q) ||
      s.branchName.toLowerCase().includes(q)
    );
  });

  // Calculate totals for matrix bottom row
  const grandTotalUnits = filteredStaff.reduce((sum, s) => sum + s.totalQuantity, 0);
  const grandTotalIncentive = filteredStaff.reduce((sum, s) => sum + s.totalIncentive, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#4318FF]" />
            <h2 className="text-xl font-bold text-[#2B3674]">
              Matriks Akumulasi Staff & Brand (Global)
            </h2>
          </div>
          <p className="text-xs text-[#A3AED0] mt-1">
            Rekapitulasi angka terkumpul dan nominal insentif masing-masing staff toko per brand selama 1 bulan.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="bg-[#0B1437] hover:bg-[#111C44] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-300" />
            <span>Cetak Rekap Matriks</span>
          </button>
        </div>
      </div>

      {/* Search & Branch Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
        
        {/* Branch Filter */}
        <div className="flex items-center space-x-2">
          <Building className="w-4 h-4 text-[#A3AED0]" />
          <span className="text-xs font-semibold text-[#A3AED0]">Filter Cabang:</span>
          <select
            id="matrix-branch-filter"
            value={selectedBranchId}
            onChange={(e) => setSelectedBranchId(e.target.value)}
            className="bg-[#F4F7FE] border border-slate-200 text-[#2B3674] text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          >
            <option value="all">Semua Cabang Toko</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A3AED0]" />
          <input
            id="search-staff-matrix"
            type="text"
            placeholder="Cari nama staff / cabang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          />
        </div>

      </div>

      {/* Main Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1437] text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3.5 px-4 sticky left-0 bg-[#0B1437] z-10">Peringkat & Staff</th>
                <th className="py-3.5 px-4">Cabang Store</th>
                {allBrands.map((brand) => (
                  <th key={brand} className="py-3.5 px-4 text-center border-l border-slate-800 min-w-[120px]">
                    {brand}
                  </th>
                ))}
                <th className="py-3.5 px-4 text-center border-l border-slate-800 bg-[#111C44] font-extrabold text-blue-300">
                  Total Unit
                </th>
                <th className="py-3.5 px-4 text-right border-l border-slate-800 bg-[#111C44] font-extrabold text-emerald-300">
                  Total Insentif (Rp)
                </th>
                <th className="py-3.5 px-4 text-center border-l border-slate-800">Aksi Slip</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
              {filteredStaff.map((staff) => (
                <tr key={staff.staffId} className="hover:bg-[#F4F7FE]/60 transition">
                  
                  {/* Rank & Name */}
                  <td className="py-3 px-4 font-bold text-[#2B3674] sticky left-0 bg-white z-10 shadow-xs flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-[#4318FF]/10 text-[#4318FF] text-[10px] flex items-center justify-center font-extrabold">
                      #{staff.rank}
                    </span>
                    <span>{staff.staffName}</span>
                  </td>

                  {/* Branch Name */}
                  <td className="py-3 px-4 text-[#A3AED0]">{staff.branchName}</td>

                  {/* Per Brand Columns */}
                  {allBrands.map((brand) => {
                    const brandData = staff.brandBreakdown[brand];
                    return (
                      <td key={brand} className="py-3 px-4 text-center border-l border-slate-100">
                        {brandData ? (
                          <div>
                            <span className="font-bold text-[#2B3674]">{brandData.quantity} u</span>
                            <div className="text-[10px] text-[#4318FF] font-bold">
                              {formatRupiah(brandData.incentive)}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-300 text-[10px]">-</span>
                        )}
                      </td>
                    );
                  })}

                  {/* Total Units */}
                  <td className="py-3 px-4 text-center font-extrabold text-[#2B3674] bg-[#F4F7FE]/60 border-l border-slate-100">
                    {formatNumber(staff.totalQuantity)} unit
                  </td>

                  {/* Total Incentive */}
                  <td className="py-3 px-4 text-right font-extrabold text-[#4318FF] bg-[#4318FF]/5 border-l border-slate-100">
                    {formatRupiah(staff.totalIncentive)}
                  </td>

                  {/* Action Button */}
                  <td className="py-3 px-4 text-center border-l border-slate-100">
                    <button
                      id={`btn-open-slip-staff-${staff.staffId}`}
                      onClick={() => onOpenSlipForStaff(staff.staffId)}
                      className="inline-flex items-center space-x-1 bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-[11px] px-2.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Slip Insentif</span>
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

            {/* Matrix Footer Totals */}
            <tfoot>
              <tr className="bg-[#0B1437] text-white font-extrabold text-xs">
                <td className="py-3.5 px-4 sticky left-0 bg-[#0B1437] z-10" colSpan={2}>
                  TOTAL GLOBAL REKAPITULASI
                </td>
                {allBrands.map((brand) => {
                  const brandTotalUnits = filteredStaff.reduce(
                    (sum, s) => sum + (s.brandBreakdown[brand]?.quantity || 0),
                    0
                  );
                  const brandTotalIncentive = filteredStaff.reduce(
                    (sum, s) => sum + (s.brandBreakdown[brand]?.incentive || 0),
                    0
                  );
                  return (
                    <td key={brand} className="py-3.5 px-4 text-center border-l border-slate-800">
                      <div>{brandTotalUnits} u</div>
                      <div className="text-[10px] text-cyan-300 font-semibold">
                        {formatRupiah(brandTotalIncentive)}
                      </div>
                    </td>
                  );
                })}
                <td className="py-3.5 px-4 text-center border-l border-slate-800 text-cyan-300 font-black">
                  {formatNumber(grandTotalUnits)} u
                </td>
                <td className="py-3.5 px-4 text-right border-l border-slate-800 text-emerald-300 font-black">
                  {formatRupiah(grandTotalIncentive)}
                </td>
                <td className="py-3.5 px-4 border-l border-slate-800"></td>
              </tr>
            </tfoot>

          </table>
        </div>
      </div>

    </div>
  );
};
