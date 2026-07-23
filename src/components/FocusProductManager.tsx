import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FocusProduct, ProductCategory } from '../types';
import { formatRupiah, formatNumber } from '../utils/formatters';
import { 
  Target, 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  CheckCircle,
  XCircle,
  DollarSign,
  Award
} from 'lucide-react';

export const FocusProductManager: React.FC = () => {
  const {
    focusProducts,
    addFocusProduct,
    updateFocusProduct,
    deleteFocusProduct,
    currentRole,
    selectedPeriod,
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Liquid');
  const [incentivePerUnit, setIncentivePerUnit] = useState<number>(5000);
  const [targetUnitsPerStore, setTargetUnitsPerStore] = useState<number>(100);
  const [bonusThresholdUnits, setBonusThresholdUnits] = useState<number>(150);
  const [bonusAmountPerUnit, setBonusAmountPerUnit] = useState<number>(2000);

  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleOpenAddModal = () => {
    setEditingId(null);
    setName('');
    setBrand('');
    setCategory('Liquid');
    setIncentivePerUnit(5000);
    setTargetUnitsPerStore(100);
    setBonusThresholdUnits(150);
    setBonusAmountPerUnit(2000);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: FocusProduct) => {
    setEditingId(product.id);
    setName(product.name);
    setBrand(product.brand);
    setCategory(product.category);
    setIncentivePerUnit(product.incentivePerUnit);
    setTargetUnitsPerStore(product.targetUnitsPerStore);
    setBonusThresholdUnits(product.bonusThresholdUnits || 0);
    setBonusAmountPerUnit(product.bonusAmountPerUnit || 0);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand) {
      alert('Mohon isi nama produk dan nama brand.');
      return;
    }

    if (editingId) {
      updateFocusProduct(editingId, {
        name,
        brand,
        category,
        incentivePerUnit: Number(incentivePerUnit),
        targetUnitsPerStore: Number(targetUnitsPerStore),
        bonusThresholdUnits: Number(bonusThresholdUnits),
        bonusAmountPerUnit: Number(bonusAmountPerUnit),
      });
    } else {
      addFocusProduct({
        name,
        brand,
        category,
        incentivePerUnit: Number(incentivePerUnit),
        targetUnitsPerStore: Number(targetUnitsPerStore),
        bonusThresholdUnits: Number(bonusThresholdUnits),
        bonusAmountPerUnit: Number(bonusAmountPerUnit),
        activePeriod: selectedPeriod,
        status: 'active',
      });
    }

    setIsModalOpen(false);
  };

  // Filter products
  const brandsList: string[] = Array.from(new Set<string>(focusProducts.map((p) => p.brand)));

  const filteredProducts = focusProducts.filter((p) => {
    const matchesBrand = filterBrand === 'all' || p.brand === filterBrand;
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#4318FF]" />
            <h2 className="text-xl font-bold text-[#2B3674]">
              Master Data Produk Fokus Bulanan
            </h2>
          </div>
          <p className="text-xs text-[#A3AED0] mt-1">
            Atur produk fokus di setiap brand, besaran nominal insentif per unit (Rp), dan target minimum toko.
          </p>
        </div>

        {(currentRole === 'admin' || currentRole === 'owner') && (
          <button
            id="btn-add-focus-product"
            onClick={handleOpenAddModal}
            className="bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-[#4318FF]/30 flex items-center space-x-2 cursor-pointer self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk Fokus Baru</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)]">
        
        {/* Brand Selector Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-[#A3AED0]">Filter Brand:</span>
          <select
            id="filter-brand-select"
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="bg-[#F4F7FE] border border-slate-200 text-[#2B3674] text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          >
            <option value="all">Semua Brand</option>
            {brandsList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#A3AED0]" />
          <input
            id="search-focus-products"
            type="text"
            placeholder="Cari produk fokus..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          />
        </div>

      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#4318FF]/10 text-[#4318FF]">
                  Brand: {p.brand}
                </span>
                <span className="text-[10px] font-semibold text-[#A3AED0]">
                  {p.category}
                </span>
              </div>

              <h3 className="font-bold text-base text-[#2B3674] mt-3">{p.name}</h3>

              {/* Rate & Target Box */}
              <div className="mt-4 space-y-2 bg-[#F4F7FE] p-3 rounded-xl border border-slate-100 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#A3AED0]">Nominal Insentif:</span>
                  <span className="font-extrabold text-[#4318FF] text-sm">
                    {formatRupiah(p.incentivePerUnit)} <span className="text-[10px] text-[#A3AED0] font-normal">/ unit</span>
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-slate-200/60 pt-2">
                  <span className="text-[#A3AED0]">Target Minim Toko:</span>
                  <span className="font-bold text-[#2B3674]">{formatNumber(p.targetUnitsPerStore)} unit</span>
                </div>

                {p.bonusThresholdUnits && p.bonusAmountPerUnit ? (
                  <div className="flex justify-between items-center text-[11px] text-amber-700 font-medium">
                    <span>Bonus Ext Target ({p.bonusThresholdUnits}u):</span>
                    <span>+{formatRupiah(p.bonusAmountPerUnit)}/u</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Admin Controls */}
            {(currentRole === 'admin' || currentRole === 'owner') && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  id={`btn-edit-product-${p.id}`}
                  onClick={() => handleOpenEditModal(p)}
                  className="p-1.5 text-[#A3AED0] hover:text-[#4318FF] hover:bg-[#F4F7FE] rounded-lg transition cursor-pointer"
                  title="Edit Produk"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  id={`btn-delete-product-${p.id}`}
                  onClick={() => {
                    if (confirm(`Hapus produk fokus "${p.name}"?`)) {
                      deleteFocusProduct(p.id);
                    }
                  }}
                  className="p-1.5 text-[#A3AED0] hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title="Hapus Produk"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add / Edit Focus Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingId ? 'Edit Produk Fokus' : 'Tambah Produk Fokus Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Brand (E.g. FOOM, OXVA, Emkay)
                </label>
                <input
                  id="input-brand-name"
                  type="text"
                  required
                  placeholder="FOOM"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Produk Fokus
                </label>
                <input
                  id="input-product-name"
                  type="text"
                  required
                  placeholder="FOOM Pod X Special Edition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori
                </label>
                <select
                  id="select-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Liquid">Liquid</option>
                  <option value="Device Pod">Device Pod</option>
                  <option value="Coil / Cartridge">Coil / Cartridge</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Insentif Per Unit (Rp)
                  </label>
                  <input
                    id="input-incentive-rate"
                    type="number"
                    step="500"
                    min="0"
                    value={incentivePerUnit}
                    onChange={(e) => setIncentivePerUnit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-extrabold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Unit per Toko
                  </label>
                  <input
                    id="input-target-units"
                    type="number"
                    min="1"
                    value={targetUnitsPerStore}
                    onChange={(e) => setTargetUnitsPerStore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Ambang Bonus (Unit)
                  </label>
                  <input
                    id="input-bonus-threshold"
                    type="number"
                    value={bonusThresholdUnits}
                    onChange={(e) => setBonusThresholdUnits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Nominal Bonus Ext (Rp)
                  </label>
                  <input
                    id="input-bonus-amount"
                    type="number"
                    value={bonusAmountPerUnit}
                    onChange={(e) => setBonusAmountPerUnit(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  id="btn-save-focus-product"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-md transition"
                >
                  Simpan Produk Fokus
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
