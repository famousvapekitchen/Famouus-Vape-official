export type UserRole = 'staff' | 'admin' | 'owner';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  branchId: string;
  branchName: string;
  email: string;
  avatarUrl?: string;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  managerName: string;
}

export interface Staff {
  id: string;
  name: string;
  code: string;
  branchId: string;
  branchName: string;
  phone: string;
  role: 'staff' | 'lead_staff';
  activeStatus: boolean;
}

export type ProductCategory = 'Liquid' | 'Device Pod' | 'Coil / Cartridge' | 'Accessories';

export interface FocusProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  incentivePerUnit: number; // in IDR (Rp)
  targetUnitsPerStore: number; // Store monthly target
  bonusThresholdUnits?: number; // Extra bonus if reached
  bonusAmountPerUnit?: number; // Extra bonus Rp
  activePeriod: string; // YYYY-MM
  status: 'active' | 'inactive';
}

export interface SalesTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  monthPeriod: string; // YYYY-MM
  staffId: string;
  staffName: string;
  branchId: string;
  branchName: string;
  productId: string;
  productName: string;
  brand: string;
  category: ProductCategory;
  quantitySold: number;
  incentivePerUnit: number;
  totalIncentive: number; // quantitySold * incentivePerUnit
  notes?: string;
  status: 'verified' | 'pending';
  createdAt: string;
}

export interface BrandTargetSummary {
  brand: string;
  totalQuantitySold: number;
  totalIncentivePaid: number;
  targetQuantity: number;
  shortfallQuantity: number;
  achievementPercentage: number;
}

export interface StaffIncentiveSummary {
  staffId: string;
  staffName: string;
  branchName: string;
  brandBreakdown: Record<string, { quantity: number; incentive: number }>;
  totalQuantity: number;
  totalIncentive: number;
  rank: number;
}

export interface IncentiveSlipData {
  slipNumber: string;
  period: string; // e.g. "Juli 2026"
  monthKey: string; // "2026-07"
  issueDate: string;
  staff: {
    id: string;
    name: string;
    branchName: string;
    code: string;
  };
  items: {
    brand: string;
    productName: string;
    quantity: number;
    ratePerUnit: number;
    subtotal: number;
  }[];
  summaryByBrand: {
    brand: string;
    totalUnits: number;
    totalAmount: number;
  }[];
  baseIncentive: number;
  bonusAchievement: number;
  totalIncentiveGross: number;
  deductions: number;
  totalIncentiveNet: number;
  status: 'draft' | 'approved' | 'paid';
}
