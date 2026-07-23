import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserRole,
  UserProfile,
  Branch,
  Staff,
  FocusProduct,
  SalesTransaction,
  BrandTargetSummary,
  StaffIncentiveSummary,
  IncentiveSlipData,
} from '../types';
import {
  INITIAL_BRANCHES,
  INITIAL_STAFF,
  INITIAL_FOCUS_PRODUCTS,
  INITIAL_TRANSACTIONS,
} from '../data/mockData';
import { getCurrentMonthKey, getMonthName } from '../utils/formatters';

interface AppContextType {
  // User & Auth Role State
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;

  // Filters
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  selectedBranchId: string; // 'all' or specific branchId
  setSelectedBranchId: (branchId: string) => void;

  // Store Logo Branding State
  storeLogoUrl: string;
  storeName: string;
  updateStoreLogo: (logoUrl: string, name?: string) => void;

  // Master Data
  branches: Branch[];
  staffList: Staff[];
  focusProducts: FocusProduct[];
  transactions: SalesTransaction[];

  // CRUD Operations
  addFocusProduct: (product: Omit<FocusProduct, 'id'>) => void;
  updateFocusProduct: (id: string, product: Partial<FocusProduct>) => void;
  deleteFocusProduct: (id: string) => void;

  addSalesTransaction: (transaction: Omit<SalesTransaction, 'id' | 'createdAt' | 'totalIncentive' | 'monthPeriod'>) => void;
  deleteSalesTransaction: (id: string) => void;
  verifySalesTransaction: (id: string) => void;

  addStaff: (staff: Omit<Staff, 'id'>) => void;
  updateStaff: (id: string, updated: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;

  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, updated: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;

  // Computed Analytics & Metrics
  filteredTransactions: SalesTransaction[];
  brandTargetSummaries: BrandTargetSummary[];
  staffIncentiveSummaries: StaffIncentiveSummary[];
  totalGlobalIncentive: number;
  totalGlobalUnitsSold: number;
  topEarningStaff: StaffIncentiveSummary | null;

  // Slip Insentif Generator
  generateIncentiveSlip: (staffId: string, monthKey?: string) => IncentiveSlipData | null;

  // System Controls
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vapestore_focus_incentive_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('staff');
  const [selectedPeriod, setSelectedPeriod] = useState<string>(getCurrentMonthKey());
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');

  // Master States
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_branches`);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_staff`);
    return saved ? JSON.parse(saved) : INITIAL_STAFF;
  });

  const [focusProducts, setFocusProducts] = useState<FocusProduct[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_products`);
    return saved ? JSON.parse(saved) : INITIAL_FOCUS_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<SalesTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  // Store Branding & Logo
  const [storeLogoUrl, setStoreLogoUrl] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_logo_url`) || '';
  });

  const [storeName, setStoreName] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_KEY}_store_name`) || 'FAMOUS VAPE OFFICIAL';
  });

  const updateStoreLogo = (logoUrl: string, newName?: string) => {
    setStoreLogoUrl(logoUrl);
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_logo_url`, logoUrl);
    if (newName && newName.trim()) {
      setStoreName(newName);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_store_name`, newName);
    }
  };

  // Current active logged-in user profile
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'st-1',
    name: 'Budi Santoso',
    role: 'staff',
    branchId: 'br-1',
    branchName: 'Vape Store Central - Jakarta Pusat',
    email: 'budi@vapestore.co.id',
  });

  // Automatically sync user role state
  useEffect(() => {
    if (currentRole === 'staff') {
      const staffUser = staffList[0] || INITIAL_STAFF[0];
      setCurrentUser({
        id: staffUser.id,
        name: staffUser.name,
        role: 'staff',
        branchId: staffUser.branchId,
        branchName: staffUser.branchName,
        email: `${staffUser.name.toLowerCase().replace(/\s+/g, '')}@vapestore.co.id`,
      });
    } else if (currentRole === 'admin') {
      setCurrentUser({
        id: 'admin-01',
        name: 'Siti Admin Operasional',
        role: 'admin',
        branchId: 'all',
        branchName: 'Headquarter Store Admin',
        email: 'admin@vapestore.co.id',
      });
    } else if (currentRole === 'owner') {
      setCurrentUser({
        id: 'owner-01',
        name: 'H. Hendra (Store Owner)',
        role: 'owner',
        branchId: 'all',
        branchName: 'Holding Group Vape Store',
        email: 'owner@vapestore.co.id',
      });
    }
  }, [currentRole, staffList]);

  // Save to LocalStorage whenever master data changes
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_branches`, JSON.stringify(branches));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_staff`, JSON.stringify(staffList));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_products`, JSON.stringify(focusProducts));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
  }, [branches, staffList, focusProducts, transactions]);

  // Filter transactions based on selectedPeriod and selectedBranchId
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchMonth = tx.monthPeriod === selectedPeriod;
      const matchBranch = selectedBranchId === 'all' || tx.branchId === selectedBranchId;
      return matchMonth && matchBranch;
    });
  }, [transactions, selectedPeriod, selectedBranchId]);

  // Computed Brand Summaries
  const brandTargetSummaries = useMemo<BrandTargetSummary[]>(() => {
    // Collect all unique brands from products & transactions
    const brandsSet = new Set<string>();
    focusProducts.forEach((p) => brandsSet.add(p.brand));
    filteredTransactions.forEach((t) => brandsSet.add(t.brand));

    const brandList = Array.from(brandsSet);

    return brandList.map((brand) => {
      // Total Quantity & Incentive from filtered transactions
      const brandTxs = filteredTransactions.filter((t) => t.brand === brand);
      const totalQuantitySold = brandTxs.reduce((sum, t) => sum + t.quantitySold, 0);
      const totalIncentivePaid = brandTxs.reduce((sum, t) => sum + t.totalIncentive, 0);

      // Target from active focus products for this month
      const productsOfBrand = focusProducts.filter(
        (p) => p.brand === brand && p.activePeriod === selectedPeriod
      );
      
      const numBranches = selectedBranchId === 'all' ? branches.length : 1;
      const targetQuantity = productsOfBrand.reduce(
        (sum, p) => sum + p.targetUnitsPerStore * numBranches,
        0
      );

      const shortfallQuantity = Math.max(0, targetQuantity - totalQuantitySold);
      const achievementPercentage =
        targetQuantity > 0 ? Math.min(100, Math.round((totalQuantitySold / targetQuantity) * 100)) : 100;

      return {
        brand,
        totalQuantitySold,
        totalIncentivePaid,
        targetQuantity,
        shortfallQuantity,
        achievementPercentage,
      };
    });
  }, [focusProducts, filteredTransactions, selectedPeriod, selectedBranchId, branches]);

  // Computed Staff Incentive Summaries
  const staffIncentiveSummaries = useMemo<StaffIncentiveSummary[]>(() => {
    const applicableStaff = staffList.filter(
      (st) => selectedBranchId === 'all' || st.branchId === selectedBranchId
    );

    const summaries = applicableStaff.map((staff) => {
      const staffTxs = filteredTransactions.filter((t) => t.staffId === staff.id);
      const brandBreakdown: Record<string, { quantity: number; incentive: number }> = {};

      staffTxs.forEach((tx) => {
        if (!brandBreakdown[tx.brand]) {
          brandBreakdown[tx.brand] = { quantity: 0, incentive: 0 };
        }
        brandBreakdown[tx.brand].quantity += tx.quantitySold;
        brandBreakdown[tx.brand].incentive += tx.totalIncentive;
      });

      const totalQuantity = staffTxs.reduce((sum, t) => sum + t.quantitySold, 0);
      const totalIncentive = staffTxs.reduce((sum, t) => sum + t.totalIncentive, 0);

      return {
        staffId: staff.id,
        staffName: staff.name,
        branchName: staff.branchName,
        brandBreakdown,
        totalQuantity,
        totalIncentive,
        rank: 0,
      };
    });

    // Sort by totalIncentive descending and assign rank
    summaries.sort((a, b) => b.totalIncentive - a.totalIncentive);
    summaries.forEach((s, i) => {
      s.rank = i + 1;
    });

    return summaries;
  }, [staffList, filteredTransactions, selectedBranchId]);

  // Overall Global Numbers
  const totalGlobalIncentive = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.totalIncentive, 0);
  }, [filteredTransactions]);

  const totalGlobalUnitsSold = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.quantitySold, 0);
  }, [filteredTransactions]);

  const topEarningStaff = useMemo(() => {
    return staffIncentiveSummaries.length > 0 ? staffIncentiveSummaries[0] : null;
  }, [staffIncentiveSummaries]);

  // CRUD actions
  const addFocusProduct = (product: Omit<FocusProduct, 'id'>) => {
    const newProduct: FocusProduct = {
      ...product,
      id: `fp-${Date.now()}`,
    };
    setFocusProducts((prev) => [newProduct, ...prev]);
  };

  const updateFocusProduct = (id: string, updated: Partial<FocusProduct>) => {
    setFocusProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
  };

  const deleteFocusProduct = (id: string) => {
    setFocusProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const addSalesTransaction = (
    txData: Omit<SalesTransaction, 'id' | 'createdAt' | 'totalIncentive' | 'monthPeriod'>
  ) => {
    const monthPeriod = txData.date.substring(0, 7); // YYYY-MM
    const totalIncentive = txData.quantitySold * txData.incentivePerUnit;

    const newTx: SalesTransaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      monthPeriod,
      totalIncentive,
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteSalesTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const verifySalesTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'verified' } : t))
    );
  };

  const addStaff = (staffData: Omit<Staff, 'id'>) => {
    const newStaff: Staff = {
      ...staffData,
      id: `st-${Date.now()}`,
    };
    setStaffList((prev) => [...prev, newStaff]);
  };

  const updateStaff = (id: string, updated: Partial<Staff>) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    // If staff name updated, sync transactions
    if (updated.name) {
      setTransactions((prev) =>
        prev.map((t) => (t.staffId === id ? { ...t, staffName: updated.name! } : t))
      );
    }
  };

  const deleteStaff = (id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  const addBranch = (branchData: Omit<Branch, 'id'>) => {
    const newBranch: Branch = {
      ...branchData,
      id: `br-${Date.now()}`,
    };
    setBranches((prev) => [...prev, newBranch]);
  };

  const updateBranch = (id: string, updated: Partial<Branch>) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
    );
    // If branch name updated, sync staff list and transactions
    if (updated.name) {
      setStaffList((prev) =>
        prev.map((s) => (s.branchId === id ? { ...s, branchName: updated.name! } : s))
      );
      setTransactions((prev) =>
        prev.map((t) => (t.branchId === id ? { ...t, branchName: updated.name! } : t))
      );
    }
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  const resetToDefaultData = () => {
    setBranches(INITIAL_BRANCHES);
    setStaffList(INITIAL_STAFF);
    setFocusProducts(INITIAL_FOCUS_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_branches`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_staff`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_products`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_transactions`);
  };

  // Generator Slip Insentif
  const generateIncentiveSlip = (staffId: string, monthKey: string = selectedPeriod): IncentiveSlipData | null => {
    const staff = staffList.find((s) => s.id === staffId);
    if (!staff) return null;

    const staffTxs = transactions.filter(
      (t) => t.staffId === staffId && t.monthPeriod === monthKey
    );

    const items = staffTxs.map((t) => ({
      brand: t.brand,
      productName: t.productName,
      quantity: t.quantitySold,
      ratePerUnit: t.incentivePerUnit,
      subtotal: t.totalIncentive,
    }));

    // Grouping by brand
    const brandMap = new Map<string, { totalUnits: number; totalAmount: number }>();
    items.forEach((item) => {
      const existing = brandMap.get(item.brand) || { totalUnits: 0, totalAmount: 0 };
      brandMap.set(item.brand, {
        totalUnits: existing.totalUnits + item.quantity,
        totalAmount: existing.totalAmount + item.subtotal,
      });
    });

    const summaryByBrand = Array.from(brandMap.entries()).map(([brand, data]) => ({
      brand,
      totalUnits: data.totalUnits,
      totalAmount: data.totalAmount,
    }));

    const baseIncentive = items.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate bonus if staff exceeded 100 focus units overall
    const totalUnitsSold = items.reduce((sum, item) => sum + item.quantity, 0);
    const bonusAchievement = totalUnitsSold >= 100 ? 50000 : 0; // Bonus Rp 50.000 for top sellers
    const deductions = 0;
    const totalIncentiveNet = baseIncentive + bonusAchievement - deductions;

    const slipNumber = `SLIP/${monthKey.replace('-', '')}/${staff.code}`;

    return {
      slipNumber,
      period: getMonthName(monthKey),
      monthKey,
      issueDate: new Date().toISOString().substring(0, 10),
      staff: {
        id: staff.id,
        name: staff.name,
        branchName: staff.branchName,
        code: staff.code,
      },
      items,
      summaryByBrand,
      baseIncentive,
      bonusAchievement,
      totalIncentiveGross: baseIncentive + bonusAchievement,
      deductions,
      totalIncentiveNet,
      status: 'approved',
    };
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        selectedPeriod,
        setSelectedPeriod,
        selectedBranchId,
        setSelectedBranchId,
        storeLogoUrl,
        storeName,
        updateStoreLogo,
        branches,
        staffList,
        focusProducts,
        transactions,
        addFocusProduct,
        updateFocusProduct,
        deleteFocusProduct,
        addSalesTransaction,
        deleteSalesTransaction,
        verifySalesTransaction,
        addStaff,
        updateStaff,
        deleteStaff,
        addBranch,
        updateBranch,
        deleteBranch,
        filteredTransactions,
        brandTargetSummaries,
        staffIncentiveSummaries,
        totalGlobalIncentive,
        totalGlobalUnitsSold,
        topEarningStaff,
        generateIncentiveSlip,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
