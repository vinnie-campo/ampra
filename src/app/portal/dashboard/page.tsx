'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressTracker } from '@/components/ui/ProgressTracker';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Zap,
  Upload,
  Clock,
  AlertCircle,
  CheckCircle,
  Phone,
  MessageSquare,
  Calendar,
  Battery,
  Gauge,
  Shield,
} from 'lucide-react';

const mockProject = {
  id: 'proj_123',
  status: 'site_survey',
  currentStep: 1,
  customer: {
    firstName: 'John',
    lastName: 'Smith',
    address: '123 Main St, Austin, TX 78701',
  },
  configuration: {
    system: '1 Powerwall 3 + 1 Extension',
    capacity: '27 kWh',
    estimatedBackup: '24-48 hours',
  },
  pricing: {
    total: 20500,
    deposit: 500,
    depositPaid: true,
    remaining: 20000,
  },
  timeline: [
    { date: '2024-01-15', event: 'Quote accepted', completed: true },
    { date: '2024-01-15', event: 'Deposit paid ($500)', completed: true },
    { date: '2024-01-16', event: 'Site survey documents requested', completed: false },
  ],
  nextAction: {
    type: 'upload_photos',
    title: 'Complete Site Survey',
    description: 'Upload photos of your electrical panel and installation location to continue',
    dueDate: '2024-01-22',
  },
};

const progressSteps = [
  { id: 1, title: 'Site Survey', description: 'Upload photos & video' },
  { id: 2, title: 'Permitting', description: 'We handle paperwork' },
  { id: 3, title: 'Installation', description: 'Professional setup' },
  { id: 4, title: 'Interconnection', description: 'Utility approval' },
  { id: 5, title: 'Go Live!', description: 'System activated' },
];

export default function PortalDashboard() {
  const project = mockProject;

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900">
          Welcome back, {project.customer.firstName}! 👋
        </h1>
        <p className="text-sand-600 mt-1">Track your Powerwall installation progress below</p>
      </div>

      {/* Progress Tracker - Dominos Style */}
      <Card variant="elevated" className="mb-8 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4">
          <h2 className="text-lg font-display font-semibold text-white flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Installation Progress
          </h2>
        </div>
        <CardContent className="p-6 lg:p-8">
          <ProgressTracker steps={progressSteps} currentStep={project.currentStep} />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Required */}
          {project.nextAction && (
            <Card className="border-2 border-amber-300 bg-amber-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-slate-900 mb-1">
                      Action Required: {project.nextAction.title}
                    </h3>
                    <p className="text-sm text-sand-600 mb-4">{project.nextAction.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                      <Link href="/portal/documents">
                        <Button size="sm">
                          <Upload className="w-4 h-4" />
                          Upload Photos
                        </Button>
                      </Link>
                      <span className="text-sm text-sand-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due by {formatDate(project.nextAction.dueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* System Details */}
          <Card>
            <CardHeader>
              <CardTitle>Your System</CardTitle>
              <CardDescription>Configuration details for your installation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 bg-sand-50 rounded-xl">
                  <Battery className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-sand-500 mb-1">Configuration</p>
                  <p className="font-semibold text-slate-900 text-sm">{project.configuration.system}</p>
                </div>
                <div className="p-4 bg-sand-50 rounded-xl">
                  <Gauge className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-sand-500 mb-1">Total Capacity</p>
                  <p className="font-semibold text-slate-900">{project.configuration.capacity}</p>
                </div>
                <div className="p-4 bg-sand-50 rounded-xl">
                  <Shield className="w-5 h-5 text-primary-600 mb-2" />
                  <p className="text-sm text-sand-500 mb-1">Backup Duration</p>
                  <p className="font-semibold text-slate-900">{project.configuration.estimatedBackup}</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-700">Installation Address</p>
                    <p className="font-medium text-slate-900">{project.customer.address}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.completed ? 'bg-accent-100' : 'bg-sand-100'
                      }`}
                    >
                      {item.completed ? (
                        <CheckCircle className="w-4 h-4 text-accent-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-sand-400" />
                      )}
                    </div>
                    <div className="flex-1 pb-4 border-b border-sand-100 last:border-0 last:pb-0">
                      <p className="font-medium text-slate-900">{item.event}</p>
                      <p className="text-sm text-sand-500">{formatDate(item.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sand-600">Total Cost</span>
                  <span className="font-medium text-slate-900">{formatCurrency(project.pricing.total)}</span>
                </div>
                <div className="flex justify-between text-accent-600">
                  <span>Deposit Paid</span>
                  <span>-{formatCurrency(project.pricing.deposit)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-sand-200">
                  <span className="font-medium text-slate-900">Remaining</span>
                  <span className="font-bold text-slate-900">{formatCurrency(project.pricing.remaining)}</span>
                </div>
              </div>

              <Link href="/portal/payments" className="block mt-4">
                <Button variant="secondary" size="sm" className="w-full">
                  View Payment Schedule
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/portal/documents" className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50 transition-colors">
                <Upload className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-slate-900">Upload Documents</span>
              </Link>
              <Link href="/portal/schedule" className="flex items-center gap-3 p-3 rounded-xl hover:bg-sand-50 transition-colors">
                <Calendar className="w-5 h-5 text-primary-600" />
                <span className="text-sm font-medium text-slate-900">Schedule a Call</span>
              </Link>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-gradient-to-br from-primary-50 to-accent-50 border-0">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-display font-semibold text-slate-900 mb-2">Need Help?</h3>
              <p className="text-sm text-sand-600 mb-4">Our team is here to assist you</p>
              <div className="space-y-2">
                <a href="tel:1-800-555-0123" className="flex items-center justify-center gap-2 text-sm text-primary-700 hover:text-primary-800">
                  <Phone className="w-4 h-4" />
                  1-800-555-0123
                </a>
                <a href="mailto:support@powervault.com" className="text-sm text-primary-700 hover:text-primary-800">
                  support@powervault.com
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
