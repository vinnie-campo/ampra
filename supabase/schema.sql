-- Ampra Database Schema for Supabase
-- Run this in your Supabase SQL Editor (Database > SQL Editor)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- CUSTOMERS TABLE
-- ============================================
create table public.customers (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  first_name text not null,
  last_name text not null,
  phone text,
  
  -- Address
  street text,
  city text,
  state text default 'CA',
  zip_code text,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- LEADS TABLE (CRM)
-- ============================================
create table public.leads (
  id uuid default uuid_generate_v4() primary key,
  
  -- Contact info
  email text not null,
  first_name text,
  last_name text,
  phone text,
  
  -- Address
  street text,
  city text,
  state text default 'CA',
  zip_code text,
  
  -- Lead tracking
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'quote_sent', 'negotiating', 'won', 'lost', 'dormant')),
  source text check (source in ('website', 'referral', 'google', 'facebook', 'instagram', 'partner', 'other')),
  score integer default 50,
  
  -- Assignment
  assigned_to uuid references auth.users(id),
  last_contacted_at timestamp with time zone,
  next_follow_up_at timestamp with time zone,
  
  -- Metadata
  notes jsonb default '[]'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- QUOTES TABLE
-- ============================================
create table public.quotes (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id),
  customer_id uuid references public.customers(id),
  
  -- Property info
  property_type text check (property_type in ('single_family', 'townhouse', 'condo', 'multi_family')),
  property_size text check (property_size in ('small', 'medium', 'large', 'xlarge')),
  
  -- Energy info
  has_solar boolean default false,
  solar_system_size numeric,
  average_monthly_bill numeric,
  electric_provider text,
  
  -- Backup configuration
  backup_priority text check (backup_priority in ('essentials', 'partial_home', 'whole_home')),
  critical_loads jsonb default '[]'::jsonb,
  desired_backup_hours integer,
  
  -- Recommended system
  powerwall_count integer default 1,
  extension_pack_count integer default 0,
  total_capacity numeric,
  
  -- Pricing
  equipment_cost numeric,
  installation_cost numeric,
  permit_fees numeric,
  subtotal numeric,
  federal_tax_credit numeric,
  state_incentives numeric default 0,
  utility_rebate numeric default 0,
  net_cost numeric,
  
  -- Status
  status text default 'draft' check (status in ('draft', 'sent', 'viewed', 'accepted', 'expired', 'declined')),
  expires_at timestamp with time zone,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- PROJECTS TABLE
-- ============================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  customer_id uuid references public.customers(id) not null,
  quote_id uuid references public.quotes(id),
  
  -- Status tracking
  status text default 'deposit_pending' check (status in (
    'deposit_pending', 
    'site_survey', 
    'permitting', 
    'installation_scheduled',
    'installation_complete',
    'interconnection',
    'active',
    'cancelled'
  )),
  current_step integer default 1,
  
  -- Installation address (may differ from customer address)
  install_street text,
  install_city text,
  install_state text default 'CA',
  install_zip_code text,
  
  -- System configuration
  powerwall_count integer default 1,
  extension_pack_count integer default 0,
  
  -- Deposit
  deposit_amount numeric default 500,
  deposit_paid boolean default false,
  deposit_paid_at timestamp with time zone,
  stripe_payment_intent_id text,
  
  -- Site survey
  site_survey_status text default 'pending' check (site_survey_status in ('pending', 'in_progress', 'complete', 'needs_revision')),
  site_survey_completed_at timestamp with time zone,
  site_survey_notes text,
  
  -- Permitting
  permit_status text default 'not_started' check (permit_status in ('not_started', 'preparing', 'submitted', 'in_review', 'approved', 'rejected')),
  permit_number text,
  permit_submitted_at timestamp with time zone,
  permit_approved_at timestamp with time zone,
  
  -- Installation
  installation_scheduled_at timestamp with time zone,
  installation_completed_at timestamp with time zone,
  installer_id uuid,
  installer_notes text,
  
  -- Interconnection
  interconnection_status text default 'not_started' check (interconnection_status in ('not_started', 'preparing', 'submitted', 'in_review', 'approved')),
  interconnection_submitted_at timestamp with time zone,
  interconnection_approved_at timestamp with time zone,
  utility_provider text,
  
  -- Completion
  system_activated_at timestamp with time zone,
  warranty_start_date date,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) not null,
  
  -- Document info
  type text not null check (type in (
    'site_photo_main_panel',
    'site_photo_panel_label', 
    'site_photo_installation_location',
    'site_photo_utility_meter',
    'site_video_walkthrough',
    'utility_bill',
    'permit_document',
    'contract',
    'invoice',
    'other'
  )),
  name text not null,
  file_path text not null, -- Supabase storage path
  file_size integer,
  mime_type text,
  
  -- Review status
  status text default 'pending_review' check (status in ('pending_review', 'approved', 'rejected')),
  reviewer_notes text,
  reviewed_at timestamp with time zone,
  reviewed_by uuid references auth.users(id),
  
  -- Metadata
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- TIMELINE EVENTS TABLE
-- ============================================
create table public.timeline_events (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) not null,
  
  -- Event info
  event_type text not null check (event_type in (
    'status_change',
    'document_upload',
    'document_approved',
    'document_rejected',
    'payment_received',
    'note_added',
    'email_sent',
    'milestone'
  )),
  title text not null,
  description text,
  metadata jsonb,
  
  -- Who triggered it
  triggered_by uuid references auth.users(id),
  is_system_event boolean default false,
  
  -- Timestamp
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INVOICES TABLE
-- ============================================
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) not null,
  
  -- Invoice details
  invoice_number text unique not null,
  description text,
  
  -- Amounts
  subtotal numeric not null,
  tax numeric default 0,
  total numeric not null,
  
  -- Line items stored as JSON
  line_items jsonb not null default '[]'::jsonb,
  
  -- Status
  status text default 'pending' check (status in ('draft', 'pending', 'paid', 'overdue', 'cancelled')),
  due_date date not null,
  paid_at timestamp with time zone,
  
  -- Stripe
  stripe_invoice_id text,
  stripe_payment_intent_id text,
  
  -- Metadata
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- EMAIL LOG TABLE (for automation tracking)
-- ============================================
create table public.email_logs (
  id uuid default uuid_generate_v4() primary key,
  
  -- Recipient
  to_email text not null,
  customer_id uuid references public.customers(id),
  lead_id uuid references public.leads(id),
  project_id uuid references public.projects(id),
  
  -- Email details
  template_name text not null,
  subject text not null,
  
  -- Status
  status text default 'sent' check (status in ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  
  -- Provider info
  resend_id text,
  
  -- Metadata
  sent_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ============================================
-- INDEXES
-- ============================================
create index idx_leads_status on public.leads(status);
create index idx_leads_email on public.leads(email);
create index idx_leads_created_at on public.leads(created_at desc);

create index idx_quotes_lead_id on public.quotes(lead_id);
create index idx_quotes_customer_id on public.quotes(customer_id);
create index idx_quotes_status on public.quotes(status);

create index idx_projects_customer_id on public.projects(customer_id);
create index idx_projects_status on public.projects(status);
create index idx_projects_created_at on public.projects(created_at desc);

create index idx_documents_project_id on public.documents(project_id);
create index idx_documents_type on public.documents(type);

create index idx_timeline_project_id on public.timeline_events(project_id);
create index idx_timeline_created_at on public.timeline_events(created_at desc);

create index idx_invoices_project_id on public.invoices(project_id);
create index idx_invoices_status on public.invoices(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
alter table public.customers enable row level security;
alter table public.leads enable row level security;
alter table public.quotes enable row level security;
alter table public.projects enable row level security;
alter table public.documents enable row level security;
alter table public.timeline_events enable row level security;
alter table public.invoices enable row level security;
alter table public.email_logs enable row level security;

-- Customers can read their own data
create policy "Customers can view own data" on public.customers
  for select using (auth.uid()::text = id::text);

-- Projects: customers can view their own projects
create policy "Customers can view own projects" on public.projects
  for select using (
    customer_id in (
      select id from public.customers where auth.uid()::text = id::text
    )
  );

-- Documents: customers can view/insert their own project documents  
create policy "Customers can view own documents" on public.documents
  for select using (
    project_id in (
      select id from public.projects where customer_id in (
        select id from public.customers where auth.uid()::text = id::text
      )
    )
  );

create policy "Customers can upload documents" on public.documents
  for insert with check (
    project_id in (
      select id from public.projects where customer_id in (
        select id from public.customers where auth.uid()::text = id::text
      )
    )
  );

-- Timeline: customers can view their own project timeline
create policy "Customers can view own timeline" on public.timeline_events
  for select using (
    project_id in (
      select id from public.projects where customer_id in (
        select id from public.customers where auth.uid()::text = id::text
      )
    )
  );

-- Invoices: customers can view their own invoices
create policy "Customers can view own invoices" on public.invoices
  for select using (
    project_id in (
      select id from public.projects where customer_id in (
        select id from public.customers where auth.uid()::text = id::text
      )
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply updated_at trigger to relevant tables
create trigger handle_customers_updated_at
  before update on public.customers
  for each row execute function public.handle_updated_at();

create trigger handle_leads_updated_at
  before update on public.leads
  for each row execute function public.handle_updated_at();

create trigger handle_quotes_updated_at
  before update on public.quotes
  for each row execute function public.handle_updated_at();

create trigger handle_projects_updated_at
  before update on public.projects
  for each row execute function public.handle_updated_at();

create trigger handle_invoices_updated_at
  before update on public.invoices
  for each row execute function public.handle_updated_at();

-- Function to generate invoice number
create or replace function public.generate_invoice_number()
returns trigger as $$
begin
  new.invoice_number := 'INV-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('invoice_number_seq')::text, 4, '0');
  return new;
end;
$$ language plpgsql;

-- Create sequence for invoice numbers
create sequence if not exists invoice_number_seq start 1;

create trigger set_invoice_number
  before insert on public.invoices
  for each row execute function public.generate_invoice_number();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Run these in the Supabase Dashboard under Storage

-- Create bucket for project documents (do this in the UI):
-- Bucket name: project-documents
-- Public: No
-- File size limit: 50MB
-- Allowed MIME types: image/*, video/*, application/pdf

-- ============================================
-- DONE!
-- ============================================
