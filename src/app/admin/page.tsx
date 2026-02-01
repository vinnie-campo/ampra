'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import {
  Users,
  FolderKanban,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  ChevronRight,
} from 'lucide-react';

const stats = [
  {
    title: 'Total Leads',
    value: '247',
    change: '+12%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Projects',
    value: '34',
    change: '+8%',
    trend: 'up',
    icon: FolderKanban,
  },
  {
    title: 'Monthly Revenue',
    value: '$412,500',
    change: '+23%',
    trend: 'up',
    icon: DollarSign,
  },
  {
    title: 'Conversion Rate',
    value: '18.4%',
    change: '-2%',
    trend: 'down',
    icon: TrendingUp,
  },
];

const recentLeads = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@email.com',
    status: 'new',
    source: 'Website',
    date: '2024-01-20',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'mchen@email.com',
    status: 'contacted',
    source: 'Referral',
    date: '2024-01-20',
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    status: 'qualified',
    source: 'Google Ads',
    date: '2024-01-19',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'dkim@email.com',
    status: 'quote_sent',
    source: 'Website',
    date: '2024-01-19',
  },
];

const activeProjects = [
  {
    id: 1,
    customer: 'John Smith',
    address: '123 Main St, Austin',
    status: 'site_survey',
    step: 1,
    daysInStatus: 2,
  },
  {
    id: 2,
    customer: 'Lisa Wang',
    address: '456 Oak Ave, Houston',
    status: 'permitting',
    step: 2,
    daysInStatus: 5,
  },
  {
    id: 3,
    customer: 'Robert Brown',
    address: '789 Pine Rd, Dallas',
    status: 'installation_scheduled',
    step: 3,
    daysInStatus: 1,
  },
  {
    id: 4,
    customer: 'Maria Garcia',
    address: '321 Elm St, San Antonio',
    status: 'interconnection',
    step: 4,
    daysInStatus: 8,
  },
];

const upcomingTasks = [
  {
    id: 1,
    title: 'Review site survey photos',
    customer: 'John Smith',
    due: 'Today',
    priority: 'high',
  },
  {
    id: 2,
    title: 'Submit permit application',
    customer: 'Lisa Wang',
    due: 'Tomorrow',
    priority: 'medium',
  },
  {
    id: 3,
    title: 'Confirm installation date',
    customer: 'Robert Brown',
    due: 'Jan 22',
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Follow up on quote',
    customer: 'Emily Rodriguez',
    due: 'Jan 23',
    priority: 'low',
  },
];

const formatStatus = (status: string) => {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

export default function AdminDashboard() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-600" />
                </div>
                <span
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-display font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500 mt-1">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Leads */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Leads</CardTitle>
            <Link href="/admin/leads">
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-medium">Name</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Source</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-3">
                        <div>
                          <p className="font-medium text-slate-900">{lead.name}</p>
                          <p className="text-sm text-slate-500">{lead.email}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                          {formatStatus(lead.status)}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-slate-600">{lead.source}</td>
                      <td className="py-3 text-sm text-slate-500">{lead.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      task.priority === 'high'
                        ? 'bg-red-500'
                        : task.priority === 'medium'
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{task.title}</p>
                    <p className="text-xs text-slate-500">{task.customer}</p>
                  </div>
                  <span className="text-xs text-slate-500 whitespace-nowrap">{task.due}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500 border-b border-slate-200">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Address</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Progress</th>
                  <th className="pb-3 font-medium">Days in Status</th>
                </tr>
              </thead>
              <tbody>
                {activeProjects.map((project) => (
                  <tr key={project.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-4 font-medium text-slate-900">{project.customer}</td>
                    <td className="py-4 text-sm text-slate-600">{project.address}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {formatStatus(project.status)}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500 rounded-full"
                            style={{ width: `${(project.step / 5) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{project.step}/5</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`text-sm ${
                          project.daysInStatus > 5 ? 'text-amber-600 font-medium' : 'text-slate-500'
                        }`}
                      >
                        {project.daysInStatus} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
