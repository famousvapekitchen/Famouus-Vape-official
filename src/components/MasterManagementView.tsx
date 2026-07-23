import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Branch, Staff, FocusProduct } from '../types';
import { formatRupiah, formatNumber } from '../utils/formatters';
import {
  Building,
  Users,
  Target,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  X,
  Search,
  Sliders,
  DollarSign,
  ShieldCheck,
  Crown,
  Info
} from 'lucide-react';

export const MasterManagementView: React.FC = () => {
  const {
    currentRole,
    branches,
    staffList,
    focusProducts,
    addBranch,
    updateBranch,
    deleteBranch,
    addStaff,
    updateStaff,
    deleteStaff,
    addFocusProduct,
    updateFocusProduct,
    deleteFocusProduct,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'branches' | 'staff' | 'incentives'>('branches');
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Modals state
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isAddBranchOpen, setIsAddBranchOpen] = useState(false);

  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<FocusProduct | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Form States for Branch
  const [branchForm, setBranchForm] = useState({ name: '', code: '', address: '', managerName: '' });
  // Form States for Staff
  const [staffForm, setStaffForm] = useState({ name: '', code: '', branchId: branches[0]?.id || '', phone: '', role: 'staff' as 'staff' | 'lead_staff', activeStatus: true });
  // Form States for Product / Incentive
  const [productForm, setProductForm] = useState({
    name: '',
    brand: '',
    category: 'Liquid' as any,
    incentivePerUnit: 10000,
    targetUnitsPerStore: 50,
    activePeriod: '2026-07',
    status: 'active' as const
  });

  const triggerNotification = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // ----------------------------------------------------
  // BRANCH HANDLERS
  // ----------------------------------------------------
  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.name.trim()) return;

    if (editingBranch) {
      updateBranch(editingBranch.id, branchForm);
      triggerNotification(`Nama cabang store berhasil diubah menjadi "${branchForm.name}"!`);
      setEditingBranch(null);
    } else {
      addBranch(branchForm);
      triggerNotification(`Cabang store baru "${branchForm.name}" berhasil ditambahkan!`);
      setIsAddBranchOpen(false);
    }
  };

  const openEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setBranchForm({ name: b.name, code: b.code, address: b.address, managerName: b.managerName });
  };

  const openAddBranch = () => {
    setEditingBranch(null);
    setBranchForm({ name: '', code: `BR-0${branches.length + 1}`, address: 'Jl. Utama Vape Store', managerName: 'Manager Toko' });
    setIsAddBranchOpen(true);
  };

  // ----------------------------------------------------
  // STAFF HANDLERS
  // ----------------------------------------------------
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffForm.name.trim()) return;

    const selectedBranch = branches.find((b) => b.id === staffForm.branchId) || branches[0];

    if (editingStaff) {
      updateStaff(editingStaff.id, {
        name: staffForm.name,
        code: staffForm.code,
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
        phone: staffForm.phone,
        role: staffForm.role,
        activeStatus: staffForm.activeStatus,
      });
      triggerNotification(`Nama staff berhasil diubah menjadi "${staffForm.name}"!`);
      setEditingStaff(null);
    } else {
      addStaff({
        name: staffForm.name,
        code: staffForm.code,
        branchId: selectedBranch.id,
        branchName: selectedBranch.name,
        phone: staffForm.phone,
        role: staffForm.role,
        activeStatus: staffForm.activeStatus,
      });
      triggerNotification(`Staff baru "${staffForm.name}" berhasil ditambahkan!`);
      setIsAddStaffOpen(false);
    }
  };

  const openEditStaff = (st: Staff) => {
    setEditingStaff(st);
    setStaffForm({
      name: st.name,
      code: st.code,
      branchId: st.branchId,
      phone: st.phone,
      role: st.role,
      activeStatus: st.activeStatus,
    });
  };

  const openAddStaff = () => {
    setEditingStaff(null);
    setStaffForm({
      name: '',
      code: `ST-0${staffList.length + 1}`,
      branchId: branches[0]?.id || 'br-1',
      phone: '081234567890',
      role: 'staff',
      activeStatus: true,
    });
    setIsAddStaffOpen(true);
  };

  // ----------------------------------------------------
  // INCENTIVE RATE HANDLERS
  // ----------------------------------------------------
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.brand.trim()) return;

    if (editingProduct) {
      updateFocusProduct(editingProduct.id, productForm);
      triggerNotification(`Nilai insentif produk "${productForm.name}" berhasil diubah menjadi ${formatRupiah(productForm.incentivePerUnit)}/unit!`);
      setEditingProduct(null);
    } else {
      addFocusProduct(productForm);
      triggerNotification(`Produk & Nilai insentif baru "${productForm.name}" berhasil ditambahkan!`);
      setIsAddProductOpen(false);
    }
  };

  const openEditProduct = (p: FocusProduct) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      brand: p.brand,
      category: p.category,
      incentivePerUnit: p.incentivePerUnit,
      targetUnitsPerStore: p.targetUnitsPerStore,
      activePeriod: p.activePeriod,
      status: p.status,
    });
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      brand: 'Foost Liquid',
      category: 'Liquid',
      incentivePerUnit: 15000,
      targetUnitsPerStore: 50,
      activePeriod: '2026-07',
      status: 'active',
    });
    setIsAddProductOpen(true);
  };

  // ----------------------------------------------------
  // DELETE HANDLERS
  // ----------------------------------------------------
  const handleDeleteBranch = (b: Branch) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Cabang Store "${b.name}"? Data staff dan transaksi terkait akan disesuaikan.`)) {
      deleteBranch(b.id);
      triggerNotification(`Cabang store "${b.name}" telah dihapus.`);
    }
  };

  const handleDeleteStaff = (st: Staff) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Staff Toko "${st.name}"? (Staff keluar/resign dari team)`)) {
      deleteStaff(st.id);
      triggerNotification(`Staff toko "${st.name}" telah dihapus dari sistem.`);
    }
  };

  const handleDeleteProduct = (p: FocusProduct) => {
    if (confirm(`Apakah Anda yakin ingin menghapus Produk Fokus "${p.name}" (Brand: ${p.brand})?`)) {
      deleteFocusProduct(p.id);
      triggerNotification(`Produk fokus "${p.name}" telah dihapus.`);
    }
  };
  // Filters
  const filteredBranches = branches.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.managerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStaff = staffList.filter((st) =>
    st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    st.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProducts = focusProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-[#4318FF]" />
            <h2 className="text-xl font-bold text-[#2B3674]">
              Pengaturan Master Data & Akses Edit (Admin & Owner)
            </h2>
          </div>
          <p className="text-xs text-[#A3AED0] mt-1">
            Gunakan panel ini untuk merubah Nama Cabang Store, Nama Staff Toko, dan Nilai Nominal Insentif Per Unit.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentRole === 'owner' ? (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 font-extrabold text-xs border border-amber-200 flex items-center space-x-1.5">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Akses Penuh Owner</span>
            </span>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-[#4318FF]/10 text-[#4318FF] font-extrabold text-xs border border-[#4318FF]/20 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Akses Admin Operasional</span>
            </span>
          )}
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Main Tab Controls & Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Management Tabs */}
        <div className="flex items-center space-x-2 bg-[#F4F7FE] p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('branches')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-[#4318FF] text-white shadow-md shadow-[#4318FF]/30'
                : 'text-[#A3AED0] hover:text-[#2B3674]'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>1. Nama Cabang Store ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-[#4318FF] text-white shadow-md shadow-[#4318FF]/30'
                : 'text-[#A3AED0] hover:text-[#2B3674]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Nama Staff Toko ({staffList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('incentives')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'incentives'
                ? 'bg-[#4318FF] text-white shadow-md shadow-[#4318FF]/30'
                : 'text-[#A3AED0] hover:text-[#2B3674]'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>3. Nilai Insentif / Brand ({focusProducts.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#A3AED0]" />
          <input
            type="text"
            placeholder="Cari data master..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7FE] border border-slate-200 rounded-xl text-xs font-semibold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
          />
        </div>

      </div>

      {/* TAB 1: KELOLA CABANG STORE */}
      {activeTab === 'branches' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2B3674]">Daftar Master Cabang Store</h3>
              <p className="text-xs text-[#A3AED0]">Klik tombol edit pada baris cabang untuk merubah Nama Cabang Store</p>
            </div>
            <button
              onClick={openAddBranch}
              className="bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md shadow-[#4318FF]/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Cabang Store</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE] border-b border-slate-200 text-[#A3AED0] font-bold text-[10px] uppercase">
                  <th className="py-3 px-4">Kode Cabang</th>
                  <th className="py-3 px-4">Nama Cabang Store (Dapat Diubah)</th>
                  <th className="py-3 px-4">Lokasi / Alamat</th>
                  <th className="py-3 px-4">Manager Toko</th>
                  <th className="py-3 px-4 text-center">Jumlah Staff</th>
                  <th className="py-3 px-4 text-center">Aksi (Ubah / Hapus)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {filteredBranches.map((b) => {
                  const staffCount = staffList.filter((s) => s.branchId === b.id).length;
                  return (
                    <tr key={b.id} className="hover:bg-[#F4F7FE]/60 transition">
                      <td className="py-3.5 px-4 font-bold text-[#4318FF]">{b.code}</td>
                      <td className="py-3.5 px-4 font-bold text-sm text-[#2B3674]">
                        <div className="flex items-center space-x-2">
                          <Building className="w-4 h-4 text-[#4318FF]" />
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#A3AED0]">{b.address}</td>
                      <td className="py-3.5 px-4 font-semibold text-[#2B3674]">{b.managerName}</td>
                      <td className="py-3.5 px-4 text-center font-bold text-[#2B3674]">
                        <span className="bg-[#4318FF]/10 text-[#4318FF] px-2.5 py-0.5 rounded-full text-xs">
                          {staffCount} Orang
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => openEditBranch(b)}
                            className="px-2.5 py-1.5 bg-[#F4F7FE] hover:bg-[#4318FF] text-[#4318FF] hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                            title="Ubah nama/data cabang"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(b)}
                            className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                            title="Hapus cabang store"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: KELOLA NAMA STAFF TOKO */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2B3674]">Daftar Master Staff Toko</h3>
              <p className="text-xs text-[#A3AED0]">Gunakan tombol Edit/Hapus untuk memperbarui nama staff atau menghapus staff yang sudah tidak bergabung ke team</p>
            </div>
            <button
              onClick={openAddStaff}
              className="bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md shadow-[#4318FF]/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Staff Toko</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE] border-b border-slate-200 text-[#A3AED0] font-bold text-[10px] uppercase">
                  <th className="py-3 px-4">ID Staff</th>
                  <th className="py-3 px-4">Nama Staff Toko (Dapat Diubah)</th>
                  <th className="py-3 px-4">Penempatan Cabang Store</th>
                  <th className="py-3 px-4">No. WhatsApp</th>
                  <th className="py-3 px-4 text-center">Jabatan</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Aksi (Ubah / Hapus)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {filteredStaff.map((st) => (
                  <tr key={st.id} className="hover:bg-[#F4F7FE]/60 transition">
                    <td className="py-3.5 px-4 font-bold text-[#4318FF]">{st.code}</td>
                    <td className="py-3.5 px-4 font-bold text-sm text-[#2B3674]">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-[#4318FF]" />
                        <span>{st.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-[#2B3674]">{st.branchName}</td>
                    <td className="py-3.5 px-4 text-[#A3AED0]">{st.phone}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-bold">
                        {st.role === 'lead_staff' ? 'Head Staff' : 'Store Staff'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {st.activeStatus ? (
                        <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          Aktif
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-400 px-2 py-0.5 rounded text-[10px] font-bold">
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditStaff(st)}
                          className="px-2.5 py-1.5 bg-[#F4F7FE] hover:bg-[#4318FF] text-[#4318FF] hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                          title="Ubah nama/data staff"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(st)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                          title="Hapus staff yang tidak bergabung ke team"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: KELOLA NILAI INSENTIF PER BRAND */}
      {activeTab === 'incentives' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_0_rgba(112,144,176,0.08)] space-y-4">
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#2B3674]">Master Nilai Insentif & Brand Produk Fokus (Rp / Unit)</h3>
              <p className="text-xs text-[#A3AED0]">Ubah nama brand/produk, nominal insentif per unit, atau hapus produk fokus yang sudah tidak dijual</p>
            </div>
            <button
              onClick={openAddProduct}
              className="bg-[#4318FF] hover:bg-[#3810E6] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-md shadow-[#4318FF]/20 flex items-center space-x-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk & Rate Insentif</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F4F7FE] border-b border-slate-200 text-[#A3AED0] font-bold text-[10px] uppercase">
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Nama Produk Fokus</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-right text-[#4318FF] font-black">Nilai Insentif / Unit (Rp)</th>
                  <th className="py-3 px-4 text-center">Target Minim Store</th>
                  <th className="py-3 px-4 text-center">Aksi (Ubah / Hapus)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-[#2B3674]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#F4F7FE]/60 transition">
                    <td className="py-3.5 px-4 font-bold text-[#4318FF]">
                      <span className="bg-[#4318FF]/10 text-[#4318FF] px-2.5 py-1 rounded-lg">
                        {p.brand}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-sm text-[#2B3674]">{p.name}</td>
                    <td className="py-3.5 px-4 text-[#A3AED0]">{p.category}</td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-[#4318FF] text-sm bg-[#4318FF]/5 px-2.5 py-1 rounded-lg border border-[#4318FF]/20">
                        {formatRupiah(p.incentivePerUnit)} / unit
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#2B3674]">
                      {formatNumber(p.targetUnitsPerStore)} unit
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => openEditProduct(p)}
                          className="px-2.5 py-1.5 bg-[#F4F7FE] hover:bg-[#4318FF] text-[#4318FF] hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                          title="Ubah nilai insentif / brand"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-bold rounded-lg text-xs transition cursor-pointer inline-flex items-center space-x-1"
                          title="Hapus produk fokus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / ADD MODAL CABANG STORE */}
      {/* ---------------------------------------------------- */}
      {(editingBranch || isAddBranchOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0B1437] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingBranch ? 'Ubah Nama Cabang Store' : 'Tambah Cabang Store Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingBranch(null);
                  setIsAddBranchOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Nama Cabang Store *
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  placeholder="Contoh: Vape Store Central - Jakarta Pusat"
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Kode Cabang Store
                </label>
                <input
                  type="text"
                  required
                  value={branchForm.code}
                  onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Alamat / Lokasi Store
                </label>
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Manager Toko
                </label>
                <input
                  type="text"
                  value={branchForm.managerName}
                  onChange={(e) => setBranchForm({ ...branchForm, managerName: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBranch(null);
                    setIsAddBranchOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-xl text-xs font-bold hover:bg-[#3810E6] shadow-md shadow-[#4318FF]/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / ADD MODAL STAFF TOKO */}
      {/* ---------------------------------------------------- */}
      {(editingStaff || isAddStaffOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0B1437] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingStaff ? 'Ubah Nama Staff Toko' : 'Tambah Staff Toko Baru'}
              </h3>
              <button
                onClick={() => {
                  setEditingStaff(null);
                  setIsAddStaffOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Nama Lengkap Staff Toko *
                </label>
                <input
                  type="text"
                  required
                  value={staffForm.name}
                  onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                  placeholder="Contoh: Ahmad Rizky"
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Penempatan Cabang Store *
                </label>
                <select
                  value={staffForm.branchId}
                  onChange={(e) => setStaffForm({ ...staffForm, branchId: e.target.value })}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                    ID / Kode Staff
                  </label>
                  <input
                    type="text"
                    required
                    value={staffForm.code}
                    onChange={(e) => setStaffForm({ ...staffForm, code: e.target.value })}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                    No. WhatsApp
                  </label>
                  <input
                    type="text"
                    value={staffForm.phone}
                    onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                    className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingStaff(null);
                    setIsAddStaffOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-xl text-xs font-bold hover:bg-[#3810E6] shadow-md shadow-[#4318FF]/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* EDIT / ADD MODAL INSENTIF RATE */}
      {/* ---------------------------------------------------- */}
      {(editingProduct || isAddProductOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-[#0B1437] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingProduct ? 'Ubah Nilai Insentif Produk Fokus' : 'Tambah Produk Fokus & Rate Insentif'}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Nama Brand *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.brand}
                  onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                  placeholder="Contoh: Foost Liquid"
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Nama Produk Fokus *
                </label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Contoh: Foost Saltnic 30ml - Mango Freeze"
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4318FF] mb-1">
                  Nilai Nominal Insentif Per Unit (Rp) *
                </label>
                <input
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={productForm.incentivePerUnit}
                  onChange={(e) => setProductForm({ ...productForm, incentivePerUnit: parseInt(e.target.value) || 0 })}
                  className="w-full bg-[#F4F7FE] border-2 border-[#4318FF]/40 rounded-xl px-3 py-2 text-sm font-black text-[#4318FF] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2B3674] mb-1">
                  Target Minim Penjualan Per Store (Unit)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={productForm.targetUnitsPerStore}
                  onChange={(e) => setProductForm({ ...productForm, targetUnitsPerStore: parseInt(e.target.value) || 1 })}
                  className="w-full bg-[#F4F7FE] border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-[#2B3674] focus:outline-none focus:ring-2 focus:ring-[#4318FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsAddProductOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#4318FF] text-white rounded-xl text-xs font-bold hover:bg-[#3810E6] shadow-md shadow-[#4318FF]/20"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
