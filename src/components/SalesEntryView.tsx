import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatRupiah, getCurrentMonthKey } from '../utils/formatters';
import { 
  PlusCircle, 
  CheckCircle2, 
  Trash2, 
  Search, 
  AlertCircle,
  ShoppingBag,
  Building,
  User,
  Calendar
} from 'lucide-react';

export const SalesEntryView: React.FC = () => {
  const {
    staffList,
    branches,
    focusProducts,
    filteredTransactions,
    addSalesTransaction,
    deleteSalesTransaction,
    verifySalesTransaction,
    currentRole,
    currentUser,
    selectedPeriod,
  } = useApp();

  // Form State
  const [selectedStaffId, setSelectedStaffId] = useState<string>(
    currentRole === 'staff' ? currentUser.id : staffList[0]?.id || ''
  );
  const [selectedProductId, setSelectedProductId] = useState<string>(
    focusProducts[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [saleDate, setSaleDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [notes, setNotes] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search in table
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected Product details
  const activeProduct = focusProducts.find((p) => p.id === selectedProductId);
  const activeStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const estimatedIncentive = activeProduct ? quantity * activeProduct.incentivePerUnit : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !activeStaff) return;
    if (quantity <= 0) {
      alert('Jumlah penjualan harus minimal 1 unit');
      return;
    }

    addSalesTransaction({
      date: saleDate,
      staffId: activeStaff.id,
      staffName: activeStaff.name,
      branchId: activeStaff.branchId,
      branchName: activeStaff.branchName,
      productId: activeProduct.id,
      productName: activeProduct.name,
      brand: activeProduct.brand,
      category: activeProduct.category,
      quantitySold: Number(quantity),
      incentivePerUnit: activeProduct.incentivePerUnit,
      notes,
      status: 'verified',
    });

    setSuccessMessage(
      `Berhasil mencatat penjualan ${quantity} unit ${activeProduct.name} (+${formatRupiah(estimatedIncentive)} insentif)`
    );
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset quantity & notes
    setQuantity(1);
    setNotes('');
  };

  const displayTransactions = filteredTransactions.filter((tx) => {
    const q = searchQuery.toLowerCase();
    return (
      tx.staffName.toLowerCase().includes(q) ||
      tx.productName.toLowerCase().includes(q) ||
      tx.brand.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2B3674]">
            Form Input Penjualan Produk Fokus (Sell-Out)
          </h2>
          <p className="text-xs text-[#A3AED0] mt-1">
            Catat setiap unit produk fokus yang terjual untuk otomatis terhitung ke dalam slip insentif staff.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, Log Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Form Column (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] self-start">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
            <PlusCircle className="w-5 h-5 text-[#4318FF]" />
            <h3 className="font-bold text-sm text-[#2B3674]">Tambah Catatan Transaksi</h3>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Staff Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                Pilih Staff Toko
              </label>
              <div className="relative">
                <select
                  id="select-staff-id"
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  disabled={currentRole === 'staff'} // Lock to self if logged in as staff
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF] disabled:opacity-75"
                >
                  {staffList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.branchName})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Focus Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                Pilih Produk Fokus (Program Bulanan)
              </label>
              <select
                id="select-focus-product-id"
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              >
                {focusProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.brand}] {p.name} — Insentif: {formatRupiah(p.incentivePerUnit)} / unit
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity & Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Jumlah Terjual (Unit)
                </label>
                <input
                  id="input-quantity-sold"
                  type="number"
                  min="1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Tanggal Transaksi
                </label>
                <input
                  id="input-transaction-date"
                  type="date"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>
            </div>

            {/* Catatan / Referensi Customer */}
            <div>
              <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                Catatan Transaksi / Pembeli (Opsional)
              </label>
              <input
                id="input-transaction-notes"
                type="text"
                placeholder="Contoh: Member VIP, Penjualan Bundel Promo"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              />
            </div>

            {/* Calculation Preview Box */}
            {activeProduct && (
              <div className="bg-[#F4F7FE] border border-[#4318FF]/20 p-3.5 rounded-xl space-y-1">
                <div className="flex justify-between text-xs text-[#A3AED0]">
                  <span>Rate Insentif per Unit:</span>
                  <span className="font-bold text-[#2B3674]">{formatRupiah(activeProduct.incentivePerUnit)}</span>
                </div>
                <div className="flex justify-between text-xs text-[#A3AED0]">
                  <span>Jumlah Unit Laku:</span>
                  <span className="font-bold text-[#2B3674]">{quantity} unit</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between items-center">
                  <span className="text-xs font-bold text-[#2B3674]">Total Hak Insentif:</span>
                  <span className="text-sm font-extrabold text-[#4318FF]">
                    {formatRupiah(estimatedIncentive)}
                  </span>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              id="btn-submit-sales-transaction"
              type="submit"
              className="w-full bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-[#4318FF]/30 transition cursor-pointer flex items-center justify-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Simpan Catatan Insentif</span>
            </button>

          </form>
        </div>

        {/* Transactions Table Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-sm text-[#2B3674]">Daftar Terkumpul Periode Ini</h3>
              <p className="text-xs text-[#A3AED0]">Transkrip pencatatan sell-out di database store</p>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A3AED0]" />
              <input
                id="search-transactions-list"
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-[#F4F7FE] border-b border-slate-200 text-[#A3AED0] font-bold text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Tanggal / Staff</th>
                  <th className="py-2.5 px-3">Produk & Brand</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Total Insentif</th>
                  <th className="py-2.5 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {displayTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F4F7FE]/60 transition">
                    <td className="py-3 px-3">
                      <div className="font-bold text-[#2B3674]">{tx.staffName}</div>
                      <div className="text-[10px] text-[#A3AED0]">{tx.date} • {tx.branchName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#2B3674]">{tx.productName}</div>
                      <span className="text-[10px] bg-[#4318FF]/10 text-[#4318FF] px-1.5 py-0.2 rounded font-bold">
                        {tx.brand}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#2B3674]">
                      {tx.quantitySold}
                    </td>
                    <td className="py-3 px-3 text-right font-extrabold text-[#4318FF]">
                      {formatRupiah(tx.totalIncentive)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {(currentRole === 'admin' || currentRole === 'owner') && (
                        <button
                          id={`btn-delete-tx-${tx.id}`}
                          onClick={() => {
                            if (confirm('Hapus pencatatan transaksi ini?')) {
                              deleteSalesTransaction(tx.id);
                            }
                          }}
                          className="p-1 text-[#A3AED0] hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
