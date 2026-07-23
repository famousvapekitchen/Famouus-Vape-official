import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { SalesEntryView } from './components/SalesEntryView';
import { FocusProductManager } from './components/FocusProductManager';
import { StaffBrandMatrixView } from './components/StaffBrandMatrixView';
import { IncentiveSlipModal } from './components/IncentiveSlipModal';
import { OwnerAnalyticsView } from './components/OwnerAnalyticsView';
import { PrdDocumentView } from './components/PrdDocumentView';
import { MasterManagementView } from './components/MasterManagementView';
import { FirebaseConfigModal } from './components/FirebaseConfigModal';
import { LoginModal } from './components/LoginModal';

function MainAppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { currentRole } = useApp();
  
  // Incentive Slip Modal state
  const [selectedStaffForSlip, setSelectedStaffForSlip] = useState<string | null>(null);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState<boolean>(false);

  // Firebase Config Modal state
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState<boolean>(false);

  // Login Modal state
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // Auto-switch away from input_sales if current role is staff or owner
  React.useEffect(() => {
    if (activeTab === 'input_sales' && currentRole !== 'admin') {
      setActiveTab('dashboard');
    }
  }, [currentRole, activeTab]);

  const handleOpenSlipForStaff = (staffId: string) => {
    setSelectedStaffForSlip(staffId);
    setIsSlipModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FE] font-sans text-[#2B3674] flex flex-col">
      
      {/* Top Header Navbar */}
      <Header
        onOpenPRD={() => setActiveTab('prd_document')}
        onOpenFirebase={() => setIsFirebaseModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Body with Sidebar + Tab View */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Navigation 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onOpenLogin={() => setIsLoginModalOpen(true)}
        />

        {/* Dynamic View Panel */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => {
                if (tab === 'input_sales') setActiveTab('input_sales');
                if (tab === 'focus_products') setActiveTab('focus_products');
                if (tab === 'staff_matrix') setActiveTab('staff_matrix');
                if (tab === 'incentive_slips') setActiveTab('incentive_slips');
              }}
              onOpenSlipForStaff={handleOpenSlipForStaff}
            />
          )}

          {activeTab === 'input_sales' && currentRole === 'admin' && <SalesEntryView />}

          {activeTab === 'focus_products' && <FocusProductManager />}

          {activeTab === 'staff_matrix' && (
            <StaffBrandMatrixView onOpenSlipForStaff={handleOpenSlipForStaff} />
          )}

          {activeTab === 'incentive_slips' && (
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Modul Slip Insentif Bulanan</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Pilih staff dari daftar di bawah ini untuk menampilkan dan mencetak slip insentif resmi.
                  </p>
                </div>
                <button
                  onClick={() => handleOpenSlipForStaff('')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Buka Viewer Slip
                </button>
              </div>

              <StaffBrandMatrixView onOpenSlipForStaff={handleOpenSlipForStaff} />
            </div>
          )}

          {activeTab === 'master_settings' && <MasterManagementView />}

          {activeTab === 'owner_analytics' && <OwnerAnalyticsView />}

          {activeTab === 'prd_document' && <PrdDocumentView />}

        </main>
      </div>

      {/* Slip Insentif Modal */}
      {isSlipModalOpen && (
        <IncentiveSlipModal
          staffId={selectedStaffForSlip}
          onClose={() => {
            setIsSlipModalOpen(false);
            setSelectedStaffForSlip(null);
          }}
        />
      )}

      {/* Firebase Status Modal */}
      <FirebaseConfigModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />

      {/* Login & Role Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
