import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Address,
  BackupPriority,
  CriticalLoad,
  BatteryConfiguration,
  PriceEstimate,
} from '@/types';
import { calculateBatteryConfig, calculatePrice, getPropertyBaseLoad } from './utils';

interface QuoteState {
  // Current step
  currentStep: number;
  
  // Step 1: Contact info
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  
  // Step 2: Property info
  address: Address;
  propertyType: 'single_family' | 'townhouse' | 'condo' | 'multi_family';
  propertySize: 'small' | 'medium' | 'large' | 'xlarge';
  
  // Step 3: Energy info
  hasSolar: boolean;
  solarSystemSize: number;
  averageMonthlyBill: number;
  
  // Step 4: Backup needs
  backupPriority: BackupPriority;
  criticalLoads: CriticalLoad[];
  desiredBackupHours: number;
  
  // Calculated results
  configuration: BatteryConfiguration | null;
  priceEstimate: PriceEstimate | null;
  
  // Actions
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  
  setContactInfo: (data: { email: string; firstName: string; lastName: string; phone: string }) => void;
  setAddress: (address: Address) => void;
  setPropertyInfo: (data: { propertyType: 'single_family' | 'townhouse' | 'condo' | 'multi_family'; propertySize: 'small' | 'medium' | 'large' | 'xlarge' }) => void;
  setEnergyInfo: (data: { hasSolar: boolean; solarSystemSize: number; averageMonthlyBill: number }) => void;
  setBackupNeeds: (data: { backupPriority: BackupPriority; criticalLoads: CriticalLoad[]; desiredBackupHours: number }) => void;
  
  calculateQuote: () => void;
  resetQuote: () => void;
}

const initialState = {
  currentStep: 1,
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: {
    street: '',
    city: '',
    state: 'CA',
    zipCode: '',
  },
  propertyType: 'single_family' as const,
  propertySize: 'medium' as const,
  hasSolar: false,
  solarSystemSize: 0,
  averageMonthlyBill: 150,
  backupPriority: 'partial_home' as BackupPriority,
  criticalLoads: ['refrigerator', 'lights', 'wifi_router'] as CriticalLoad[],
  desiredBackupHours: 12,
  configuration: null,
  priceEstimate: null,
};

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setStep: (step) => set({ currentStep: step }),
      
      nextStep: () => set((state) => ({ 
        currentStep: Math.min(state.currentStep + 1, 6) 
      })),
      
      prevStep: () => set((state) => ({ 
        currentStep: Math.max(state.currentStep - 1, 1) 
      })),
      
      setContactInfo: (data) => set(data),
      
      setAddress: (address) => set({ address }),
      
      setPropertyInfo: ({ propertyType, propertySize }) => {
        const baseLoads = getPropertyBaseLoad(propertySize);
        set({ 
          propertyType, 
          propertySize,
          criticalLoads: baseLoads,
        });
      },
      
      setEnergyInfo: (data) => set(data),
      
      setBackupNeeds: (data) => set(data),
      
      calculateQuote: () => {
        const state = get();
        
        const configuration = calculateBatteryConfig(
          state.criticalLoads,
          state.desiredBackupHours,
          state.backupPriority,
          state.hasSolar,
          state.solarSystemSize
        );
        
        const priceEstimate = calculatePrice(configuration, state.address.state);
        
        set({ configuration, priceEstimate });
      },
      
      resetQuote: () => set(initialState),
    }),
    {
      name: 'quote-storage',
    }
  )
);

// Customer portal state
interface PortalState {
  isAuthenticated: boolean;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  } | null;
  projectId: string | null;
  
  setAuth: (customer: PortalState['customer']) => void;
  setProject: (projectId: string) => void;
  logout: () => void;
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      customer: null,
      projectId: null,
      
      setAuth: (customer) => set({ 
        isAuthenticated: !!customer, 
        customer 
      }),
      
      setProject: (projectId) => set({ projectId }),
      
      logout: () => set({ 
        isAuthenticated: false, 
        customer: null, 
        projectId: null 
      }),
    }),
    {
      name: 'portal-storage',
    }
  )
);

// Admin CRM state
interface AdminState {
  isAuthenticated: boolean;
  currentView: 'dashboard' | 'leads' | 'projects' | 'customers' | 'settings';
  selectedLeadId: string | null;
  selectedProjectId: string | null;
  filters: {
    status: string[];
    dateRange: { start: Date | null; end: Date | null };
    search: string;
  };
  
  setView: (view: AdminState['currentView']) => void;
  selectLead: (id: string | null) => void;
  selectProject: (id: string | null) => void;
  setFilters: (filters: Partial<AdminState['filters']>) => void;
  setAuth: (authenticated: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  currentView: 'dashboard',
  selectedLeadId: null,
  selectedProjectId: null,
  filters: {
    status: [],
    dateRange: { start: null, end: null },
    search: '',
  },
  
  setView: (view) => set({ currentView: view }),
  selectLead: (id) => set({ selectedLeadId: id }),
  selectProject: (id) => set({ selectedProjectId: id }),
  setFilters: (filters) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  setAuth: (authenticated) => set({ isAuthenticated: authenticated }),
}));
