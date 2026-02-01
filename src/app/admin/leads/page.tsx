'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { cn, formatDate, getStatusColor, formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  Send,
  User,
  Clock,
  FileText,
  X,
} from 'lucide-react';

const mockLeads = [
  {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah@example.com',
    phone: '(512) 555-0123',
    address: '123 Oak St, Austin, TX 78701',
    status: 'new',
    source: 'website',
    score: 85,
    createdAt: '2024-01-20',
    lastContact: null,
    quoteAmount: null,
    notes: [],
  },
  {
    id: '2',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'mchen@example.com',
    phone: '(713) 555-0456',
    address: '456 Elm Ave, Houston, TX 77001',
    status: 'contacted',
    source: 'referral',
    score: 72,
    createdAt: '2024-01-19',
    lastContact: '2024-01-20',
    quoteAmount: null,
    notes: ['Interested in whole-home backup', 'Has existing solar 8kW'],
  },
  {
    id: '3',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.r@example.com',
    phone: '(214) 555-0789',
    address: '789 Pine Rd, Dallas, TX 75201',
    status: 'qualified',
    source: 'google',
    score: 91,
    createdAt: '2024-01-18',
    lastContact: '2024-01-19',
    quoteAmount: 20500,
    notes: ['Experienced outage last month', 'Budget: $15-25k'],
  },
  {
    id: '4',
    firstName: 'David',
    lastName: 'Kim',
    email: 'dkim@example.com',
    phone: '(210) 555-0321',
    address: '321 Cedar Blvd, San Antonio, TX 78201',
    status: 'quote_sent',
    source: 'website',
    score: 88,
    createdAt: '2024-01-17',
    lastContact: '2024-01-18',
    quoteAmount: 28500,
    notes: ['Large home 4000+ sqft', 'Wants 2 extension packs'],
  },
  {
    id: '5',
    firstName: 'Jennifer',
    lastName: 'Martinez',
    email: 'jmartinez@example.com',
    phone: '(512) 555-0654',
    address: '654 Maple Dr, Austin, TX 78702',
    status: 'negotiating',
    source: 'facebook',
    score: 95,
    createdAt: '2024-01-15',
    lastContact: '2024-01-20',
    quoteAmount: 20500,
    notes: ['Comparing with competitor', 'Follow up re: financing options'],
  },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'quote_sent', label: 'Quote Sent' },
  { value: 'negotiating', label: 'Negotiating' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
];

const sourceOptions = [
  { value: '', label: 'All Sources' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'google', label: 'Google Ads' },
  { value: 'facebook', label: 'Facebook' },
];

export default function LeadsPage() {
  const [leads] = useState(mockLeads);
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      `${lead.firstName} ${lead.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    const matchesSource = sourceFilter === '' || lead.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Leads</h1>
          <p className="text-slate-600">Manage and track your sales pipeline</p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          Add Lead
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Select
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40"
            />
            <Select
              options={sourceOptions}
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full sm:w-40"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Leads Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                      <th className="px-6 py-4 font-medium">Lead</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Score</th>
                      <th className="px-6 py-4 font-medium">Source</th>
                      <th className="px-6 py-4 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={cn(
                          'border-b border-slate-100 cursor-pointer transition-colors',
                          selectedLead?.id === lead.id ? 'bg-primary-50' : 'hover:bg-slate-50'
                        )}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-slate-900">
                              {lead.firstName} {lead.lastName}
                            </p>
                            <p className="text-sm text-slate-500">{lead.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {formatStatus(lead.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  lead.score >= 80
                                    ? 'bg-green-500'
                                    : lead.score >= 60
                                    ? 'bg-amber-500'
                                    : 'bg-red-500'
                                }`}
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-sm text-slate-600">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">{lead.source}</td>
                        <td className="px-6 py-4">
                          <button className="p-1 hover:bg-slate-100 rounded">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Detail Panel */}
        <div>
          {selectedLead ? (
            <Card className="sticky top-24">
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>
                    {selectedLead.firstName} {selectedLead.lastName}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedLead.status)}`}>
                    {formatStatus(selectedLead.status)}
                  </span>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-1 hover:bg-slate-100 rounded">
                  <X className="w-4 h-4" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-2">
                    <a
                      href={`mailto:${selectedLead.email}`}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-sm"
                    >
                      <Mail className="w-4 h-4 text-slate-400" />
                      {selectedLead.email}
                    </a>
                    <a
                      href={`tel:${selectedLead.phone}`}
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg text-sm"
                    >
                      <Phone className="w-4 h-4 text-slate-400" />
                      {selectedLead.phone}
                    </a>
                    <div className="flex items-center gap-3 p-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {selectedLead.address}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">{selectedLead.score}</p>
                      <p className="text-xs text-slate-500">Lead Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-900">
                        {selectedLead.quoteAmount ? formatCurrency(selectedLead.quoteAmount) : '—'}
                      </p>
                      <p className="text-xs text-slate-500">Quote Amount</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <p className="text-sm font-medium text-slate-900 mb-2">Activity</p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">Created: {formatDate(selectedLead.createdAt)}</span>
                      </div>
                      {selectedLead.lastContact && (
                        <div className="flex items-center gap-3 text-sm">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">Last contact: {formatDate(selectedLead.lastContact)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedLead.notes.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-slate-900 mb-2">Notes</p>
                      <div className="space-y-2">
                        {selectedLead.notes.map((note, i) => (
                          <div key={i} className="p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                            {note}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="flex-1">
                      <Send className="w-4 h-4" />
                      Send Quote
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1">
                      <Phone className="w-4 h-4" />
                      Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="p-8 text-center">
                <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">Select a lead to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
