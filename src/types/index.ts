// Customer and Lead types
export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

// Quote and configuration types
export interface QuoteRequest {
  id: string;
  customerId?: string;
  
  // Property info
  address: Address;
  propertyType: 'single_family' | 'townhouse' | 'condo' | 'multi_family';
  propertySize: 'small' | 'medium' | 'large' | 'xlarge'; // <1500, 1500-2500, 2500-4000, >4000 sqft
  yearBuilt?: number;
  
  // Energy info
  hasSolar: boolean;
  solarSystemSize?: number; // kW
  averageMonthlyBill?: number;
  electricProvider?: string;
  
  // Backup needs
  backupPriority: BackupPriority;
  criticalLoads: CriticalLoad[];
  desiredBackupHours: number;
  
  // Configuration result
  recommendedConfig: BatteryConfiguration;
  estimatedPrice: PriceEstimate;
  
  status: QuoteStatus;
  createdAt: Date;
  expiresAt: Date;
}

export type BackupPriority = 'essentials' | 'partial_home' | 'whole_home';

export type CriticalLoad = 
  | 'refrigerator'
  | 'lights'
  | 'wifi_router'
  | 'medical_equipment'
  | 'hvac'
  | 'electric_vehicle'
  | 'pool_pump'
  | 'well_pump'
  | 'garage_door'
  | 'security_system';

export interface BatteryConfiguration {
  baseUnits: number; // Number of Powerwall 3 units (1 for now)
  extensionPacks: number; // 0, 1, or 2
  totalCapacity: number; // kWh
  totalPower: number; // kW continuous
  peakPower: number; // kW peak
  estimatedBackupHours: number;
}

export interface PriceEstimate {
  equipmentCost: number;
  installationCost: number;
  permitFees: number;
  subtotal: number;
  federalTaxCredit: number; // 30% ITC
  stateTaxCredit: number;
  utilityRebate: number;
  netCost: number;
  monthlyFinancing?: number; // if financed
}

export type QuoteStatus = 'draft' | 'pending' | 'sent' | 'accepted' | 'expired' | 'declined';

// Project and installation types
export interface Project {
  id: string;
  customerId: string;
  quoteId: string;
  
  status: ProjectStatus;
  currentStep: ProjectStep;
  
  // Deposits and payments
  depositPaid: boolean;
  depositAmount: number;
  depositPaidAt?: Date;
  
  // Site survey
  siteSurveyStatus: SiteSurveyStatus;
  siteSurveyDocuments: Document[];
  siteSurveyNotes?: string;
  siteSurveyCompletedAt?: Date;
  
  // Permitting
  permitStatus: PermitStatus;
  permitNumber?: string;
  permitSubmittedAt?: Date;
  permitApprovedAt?: Date;
  
  // Installation
  installationScheduledAt?: Date;
  installationCompletedAt?: Date;
  installerNotes?: string;
  
  // Interconnection
  interconnectionStatus: InterconnectionStatus;
  interconnectionSubmittedAt?: Date;
  interconnectionApprovedAt?: Date;
  
  // Final
  systemActivatedAt?: Date;
  warrantyStartDate?: Date;
  
  timeline: TimelineEvent[];
  invoices: Invoice[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectStatus = 
  | 'deposit_pending'
  | 'site_survey'
  | 'permitting'
  | 'installation_scheduled'
  | 'installation_complete'
  | 'interconnection'
  | 'active'
  | 'cancelled';

export type ProjectStep = 1 | 2 | 3 | 4 | 5;

export type SiteSurveyStatus = 'pending' | 'in_progress' | 'complete' | 'needs_revision';

export type PermitStatus = 'not_started' | 'preparing' | 'submitted' | 'in_review' | 'approved' | 'rejected';

export type InterconnectionStatus = 'not_started' | 'preparing' | 'submitted' | 'in_review' | 'approved';

export interface Document {
  id: string;
  type: DocumentType;
  name: string;
  url: string;
  uploadedAt: Date;
  status: 'pending_review' | 'approved' | 'rejected';
  notes?: string;
}

export type DocumentType = 
  | 'site_photo_main_panel'
  | 'site_photo_installation_location'
  | 'site_photo_exterior'
  | 'site_video_walkthrough'
  | 'utility_bill'
  | 'permit_document'
  | 'contract'
  | 'other';

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'status_change' | 'document_upload' | 'payment' | 'note' | 'email_sent' | 'milestone';
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

export interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  dueDate: Date;
  paidAt?: Date;
  description: string;
  lineItems: InvoiceLineItem[];
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// CRM types
export interface Lead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: Address;
  
  source: LeadSource;
  status: LeadStatus;
  score: number;
  
  quoteRequests: string[]; // Quote IDs
  
  assignedTo?: string; // Staff ID
  lastContactedAt?: Date;
  nextFollowUpAt?: Date;
  
  notes: LeadNote[];
  activities: LeadActivity[];
  
  createdAt: Date;
  updatedAt: Date;
}

export type LeadSource = 'website' | 'referral' | 'google' | 'facebook' | 'partner' | 'other';

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'quote_sent'
  | 'negotiating'
  | 'won'
  | 'lost'
  | 'dormant';

export interface LeadNote {
  id: string;
  content: string;
  createdBy: string;
  createdAt: Date;
}

export interface LeadActivity {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'quote' | 'site_visit' | 'other';
  title: string;
  description?: string;
  createdAt: Date;
  createdBy?: string;
}

// Email automation types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  trigger: EmailTrigger;
  delayHours: number;
  active: boolean;
}

export type EmailTrigger = 
  | 'quote_created'
  | 'deposit_paid'
  | 'site_survey_reminder'
  | 'site_survey_complete'
  | 'permit_submitted'
  | 'permit_approved'
  | 'installation_scheduled'
  | 'installation_complete'
  | 'interconnection_submitted'
  | 'system_active'
  | 'follow_up_7_days'
  | 'follow_up_30_days';

// Powerwall specifications
export const POWERWALL_3_SPECS = {
  capacity: 13.5, // kWh usable
  continuousPower: 11.5, // kW
  peakPower: 30, // kW (10 second)
  roundTripEfficiency: 0.975,
  warranty: 10, // years
  dimensions: {
    height: 43.25, // inches
    width: 24, // inches  
    depth: 7.6, // inches
  },
  weight: 287, // lbs
} as const;

export const EXTENSION_PACK_SPECS = {
  capacity: 13.5, // kWh usable
  dimensions: {
    height: 43.25,
    width: 24,
    depth: 7.6,
  },
  weight: 220, // lbs
} as const;

// Pricing constants (can be configured)
export const PRICING = {
  powerwall3Base: 9500, // Equipment only
  extensionPack: 6500, // Equipment only
  installationBase: 3000,
  installationPerExtension: 1500,
  permitFeeEstimate: 500,
  federalTaxCreditRate: 0.30, // 30% ITC
} as const;

// Average load estimates (kWh per hour)
export const LOAD_ESTIMATES: Record<CriticalLoad, number> = {
  refrigerator: 0.15,
  lights: 0.1,
  wifi_router: 0.02,
  medical_equipment: 0.5,
  hvac: 3.0,
  electric_vehicle: 7.5,
  pool_pump: 1.5,
  well_pump: 1.0,
  garage_door: 0.05,
  security_system: 0.05,
} as const;
