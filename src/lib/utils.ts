import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  BatteryConfiguration,
  PriceEstimate,
  CriticalLoad,
  BackupPriority,
  POWERWALL_3_SPECS,
  EXTENSION_PACK_SPECS,
  PRICING,
  LOAD_ESTIMATES,
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

// Calculate total hourly load from selected critical loads
export function calculateHourlyLoad(loads: CriticalLoad[]): number {
  return loads.reduce((total, load) => total + (LOAD_ESTIMATES[load] || 0), 0);
}

// Calculate recommended battery configuration
export function calculateBatteryConfig(
  criticalLoads: CriticalLoad[],
  desiredBackupHours: number,
  backupPriority: BackupPriority,
  hasSolar: boolean,
  solarSystemSize?: number
): BatteryConfiguration {
  const hourlyLoad = calculateHourlyLoad(criticalLoads);
  
  // Apply priority multiplier
  let loadMultiplier = 1;
  switch (backupPriority) {
    case "essentials":
      loadMultiplier = 1;
      break;
    case "partial_home":
      loadMultiplier = 1.5;
      break;
    case "whole_home":
      loadMultiplier = 2.5;
      break;
  }
  
  const adjustedHourlyLoad = hourlyLoad * loadMultiplier;
  const requiredCapacity = adjustedHourlyLoad * desiredBackupHours;
  
  // If they have solar, assume it can help during daytime (reduce required storage)
  const solarOffset = hasSolar && solarSystemSize 
    ? Math.min(solarSystemSize * 4, requiredCapacity * 0.3) // Assume 4 hours of usable production, max 30% offset
    : 0;
  
  const effectiveRequired = requiredCapacity - solarOffset;
  
  // Calculate number of extension packs needed
  // 1 Powerwall 3 = 13.5 kWh
  // Each extension pack = +13.5 kWh
  // Max config: 1 Powerwall 3 + 2 extension packs = 40.5 kWh
  
  let extensionPacks = 0;
  if (effectiveRequired > 27) { // Need 2 extensions
    extensionPacks = 2;
  } else if (effectiveRequired > 13.5) { // Need 1 extension
    extensionPacks = 1;
  }
  
  const totalCapacity = POWERWALL_3_SPECS.capacity + (extensionPacks * EXTENSION_PACK_SPECS.capacity);
  const estimatedBackupHours = totalCapacity / adjustedHourlyLoad;
  
  return {
    baseUnits: 1,
    extensionPacks,
    totalCapacity,
    totalPower: POWERWALL_3_SPECS.continuousPower, // Extensions don't add power
    peakPower: POWERWALL_3_SPECS.peakPower,
    estimatedBackupHours: Math.round(estimatedBackupHours * 10) / 10,
  };
}

// Calculate price estimate
export function calculatePrice(
  config: BatteryConfiguration,
  state: string = "TX"
): PriceEstimate {
  const equipmentCost = 
    PRICING.powerwall3Base + 
    (config.extensionPacks * PRICING.extensionPack);
  
  const installationCost = 
    PRICING.installationBase + 
    (config.extensionPacks * PRICING.installationPerExtension);
  
  const permitFees = PRICING.permitFeeEstimate;
  
  const subtotal = equipmentCost + installationCost + permitFees;
  
  // Federal 30% ITC
  const federalTaxCredit = Math.round(subtotal * PRICING.federalTaxCreditRate);
  
  // State incentives (varies by state - placeholder)
  const stateTaxCredit = 0;
  
  // Utility rebates (varies - placeholder)
  const utilityRebate = 0;
  
  const netCost = subtotal - federalTaxCredit - stateTaxCredit - utilityRebate;
  
  // Monthly financing estimate (10 years, 6.99% APR)
  const monthlyFinancing = calculateMonthlyPayment(netCost, 0.0699, 120);
  
  return {
    equipmentCost,
    installationCost,
    permitFees,
    subtotal,
    federalTaxCredit,
    stateTaxCredit,
    utilityRebate,
    netCost,
    monthlyFinancing,
  };
}

function calculateMonthlyPayment(principal: number, annualRate: number, months: number): number {
  const monthlyRate = annualRate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
    (Math.pow(1 + monthlyRate, months) - 1);
  return Math.round(payment);
}

// Property size to estimated load
export function getPropertyBaseLoad(size: string): CriticalLoad[] {
  const baseLoads: CriticalLoad[] = ["refrigerator", "lights", "wifi_router"];
  
  switch (size) {
    case "small":
      return baseLoads;
    case "medium":
      return [...baseLoads, "garage_door", "security_system"];
    case "large":
      return [...baseLoads, "garage_door", "security_system", "hvac"];
    case "xlarge":
      return [...baseLoads, "garage_door", "security_system", "hvac", "pool_pump"];
    default:
      return baseLoads;
  }
}

// Generate a simple ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\(\)\+]{10,}$/;
  return phoneRegex.test(phone);
}

// Format phone for display
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Get status color classes
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    // Project statuses
    deposit_pending: "bg-amber-100 text-amber-800",
    site_survey: "bg-blue-100 text-blue-800",
    permitting: "bg-purple-100 text-purple-800",
    installation_scheduled: "bg-indigo-100 text-indigo-800",
    installation_complete: "bg-teal-100 text-teal-800",
    interconnection: "bg-cyan-100 text-cyan-800",
    active: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    
    // Generic statuses
    pending: "bg-amber-100 text-amber-800",
    in_progress: "bg-blue-100 text-blue-800",
    complete: "bg-green-100 text-green-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    submitted: "bg-purple-100 text-purple-800",
    
    // Lead statuses
    new: "bg-blue-100 text-blue-800",
    contacted: "bg-amber-100 text-amber-800",
    qualified: "bg-purple-100 text-purple-800",
    quote_sent: "bg-indigo-100 text-indigo-800",
    negotiating: "bg-cyan-100 text-cyan-800",
    won: "bg-green-100 text-green-800",
    lost: "bg-red-100 text-red-800",
    dormant: "bg-gray-100 text-gray-800",
  };
  
  return colors[status] || "bg-gray-100 text-gray-800";
}

// Get step number from project status
export function getProjectStep(status: string): number {
  const steps: Record<string, number> = {
    deposit_pending: 1,
    site_survey: 1,
    permitting: 2,
    installation_scheduled: 3,
    installation_complete: 3,
    interconnection: 4,
    active: 5,
  };
  
  return steps[status] || 1;
}
