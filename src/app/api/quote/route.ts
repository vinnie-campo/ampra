import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Create lead record
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .insert({
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        street: data.address?.street,
        city: data.address?.city,
        state: data.address?.state || 'CA',
        zip_code: data.address?.zipCode,
        status: 'new',
        source: 'website',
        score: 70, // Default score for website leads
      })
      .select()
      .single();
    
    if (leadError) {
      console.error('Error creating lead:', leadError);
      return NextResponse.json(
        { error: 'Failed to save lead' },
        { status: 500 }
      );
    }
    
    // Create quote record
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        lead_id: lead.id,
        property_type: data.propertyType,
        property_size: data.propertySize,
        has_solar: data.hasSolar,
        solar_system_size: data.solarSystemSize,
        average_monthly_bill: data.averageMonthlyBill,
        electric_provider: data.electricProvider,
        backup_priority: data.backupPriority,
        critical_loads: data.criticalLoads || [],
        desired_backup_hours: data.desiredBackupHours,
        powerwall_count: data.configuration?.powerwallCount || 1,
        extension_pack_count: data.configuration?.extensionPackCount || 0,
        total_capacity: data.configuration?.totalCapacity,
        equipment_cost: data.pricing?.equipmentCost,
        installation_cost: data.pricing?.installationCost,
        permit_fees: data.pricing?.permitFees,
        subtotal: data.pricing?.subtotal,
        federal_tax_credit: data.pricing?.federalTaxCredit,
        net_cost: data.pricing?.netCost,
        status: 'sent',
      })
      .select()
      .single();
    
    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return NextResponse.json(
        { error: 'Failed to save quote' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      leadId: lead.id,
      quoteId: quote.id,
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
