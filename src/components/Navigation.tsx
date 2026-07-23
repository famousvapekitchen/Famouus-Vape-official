import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Target, 
  Users, 
  Receipt, 
  BarChart3, 
  FileCode,
  User,
  Building,
  Sliders
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'input_sales' 
  | 'focus_products' 
  | 'staff_matrix' 
  | 'master_settings'
  | 'incentive_slips' 
  | 'owner_analytics' 
  | 'prd_document';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  onOpenLogin?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const { currentRole, currentUser } = useApp();

  const navItems = [
    {
      id: 'dashboard' as TabType,
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      roles: ['staff', 'admin', 'owner'],
      badge: 'Real-time',
    },
    {
      id: 'input_sales' as TabType,
      label: 'Input Transaksi Sell-out',
      icon: PlusCircle,
      roles: ['staff', 'admin'],
      badge: 'Staff Direct',
    },
    {
      id: 'focus_products' as TabType,
      label: 'Data Produk Fokus',
      icon: Target,
      roles: ['admin', 'owner'],
      badge: 'Nominal Insentif',
    },
    {
      id: 'staff_matrix' as TabType,
      label: 'Akumulasi Staff & Brand',
      icon: Users,
      roles: ['staff', 'admin', 'owner'],
      badge: 'Global Matrix',
    },
    {
      id: 'master_settings' as TabType,
      label: 'Kelola Cabang, Staff & Insentif',
      icon: Sliders,
      roles: ['admin', 'owner'],
      badge: 'Akses Admin',
    },
    {
      id: 'incentive_slips' as TabType,
      label: 'Slip Insentif Bulanan',
      icon: Receipt,
      roles: ['staff', 'admin', 'owner'],
      badge: 'Cetak Slip',
    },
    {
      id: 'owner_analytics' as TabType,
      label: 'Laporan Executive Owner',
      icon: BarChart3,
      roles: ['admin', 'owner'],
      badge: 'Executive',
    },
    {
      id: 'prd_document' as TabType,
      label: 'Dokumen PRD & SLA',
      icon: FileCode,
      roles: ['staff', 'admin', 'owner'],
      badge: 'Notion Format',
    },
  ];

  const visibleItems = navItems.filter((item) => item.roles.includes(currentRole));

  return (
    <aside className="w-full md:w-64 bg-gradient-to-b from-[#0F172A] via-[#1E1B4B] to-[#1E1B4B] border-r border-indigo-500/30 shrink-0 flex flex-col justify-between py-5 px-3">
      {/* Active User Card */}
      <div 
        onClick={onOpenLogin}
        className="mb-5 bg-[#181E3B]/90 hover:bg-[#251B4E] rounded-2xl p-3.5 border border-indigo-500/30 shadow-md cursor-pointer transition group"
        title="Klik untuk Ganti Akun / Mode Login Role"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#4318FF] to-cyan-400 text-white border-2 border-white/20 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition">{currentUser.name}</p>
              <span className="text-[10px] text-cyan-400 font-bold group-hover:underline">Login</span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                currentRole === 'owner' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : currentRole === 'admin'
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentRole === 'admin' ? 'Admin (Perekap Qtty)' : `Role: ${currentRole}`}
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 truncate mt-1 flex items-center font-medium">
              <Building className="w-3 h-3 mr-1 inline shrink-0 text-cyan-400" />
              {currentUser.branchName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-extrabold tracking-widest text-indigo-300/80">
          Main Menu
        </div>
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition cursor-pointer text-left ${
                isActive
                  ? 'bg-[#4318FF] text-white font-extrabold shadow-lg shadow-[#4318FF]/30 border-l-4 border-cyan-400'
                  : 'text-indigo-200 hover:bg-[#251B4E] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-indigo-300'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-md font-bold shrink-0 ml-1 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#181E3B] text-indigo-300 border border-indigo-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="mt-6 pt-3 border-t border-indigo-500/30 text-[11px] text-indigo-300/60 px-2 space-y-1">
        <p className="font-semibold text-indigo-200">Famous Vape Official</p>
        <p className="text-indigo-300/50">Vibrant Incentive Engine</p>
      </div>
    </aside>
  );
};
