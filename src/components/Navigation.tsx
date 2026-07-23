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
      roles: ['staff', 'admin', 'owner'],
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
    <aside className="w-full md:w-64 bg-[#0B1437] border-r border-slate-800/80 shrink-0 flex flex-col justify-between py-5 px-3">
      {/* Active User Card */}
      <div 
        onClick={onOpenLogin}
        className="mb-5 bg-[#111C44] hover:bg-[#1A2654] rounded-2xl p-3.5 border border-slate-700/60 shadow-sm cursor-pointer transition group"
        title="Klik untuk Ganti Akun / Mode Login Role"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#4318FF] text-white border-2 border-white/20 flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div className="overflow-hidden flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition">{currentUser.name}</p>
              <span className="text-[10px] text-blue-400 group-hover:underline">Login</span>
            </div>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                currentRole === 'owner' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                  : currentRole === 'admin'
                  ? 'bg-[#4318FF]/30 text-blue-300 border border-[#4318FF]/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {currentRole === 'admin' ? 'Admin (Perekap Qtty)' : `Role: ${currentRole}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-1 flex items-center">
              <Building className="w-3 h-3 mr-1 inline shrink-0 text-[#4318FF]" />
              {currentUser.branchName}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Menu Items */}
      <nav className="space-y-1.5 flex-1">
        <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-widest text-slate-400">
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
                  ? 'bg-white/10 text-white font-bold border-l-4 border-[#4318FF] shadow-sm'
                  : 'text-slate-300 hover:bg-[#111C44] hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#4318FF]' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-md font-semibold shrink-0 ml-1 ${
                    isActive
                      ? 'bg-[#4318FF] text-white'
                      : 'bg-[#111C44] text-slate-400'
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
      <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 px-2 space-y-1">
        <p className="font-semibold text-slate-300">VapePro Focus Dashboard</p>
        <p className="text-slate-500">Professional Polish Theme</p>
      </div>
    </aside>
  );
};
