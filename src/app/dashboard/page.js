'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  UserPlus,
  Calendar
} from 'lucide-react';

const stats = [
  {
    name: 'Total Candidates',
    value: '0',
    change: '+12%',
    changeType: 'positive',
    icon: Users,
    href: '/dashboard/candidates'
  },
  {
    name: 'Active Companies',
    value: '0',
    change: '+4%',
    changeType: 'positive',
    icon: Building2,
    href: '/dashboard/companies'
  },
  {
    name: 'Open Positions',
    value: '0',
    change: '-2%',
    changeType: 'negative',
    icon: Briefcase,
    href: '/dashboard/jobs'
  },
  {
    name: 'Placements (MTD)',
    value: '0',
    change: '+8%',
    changeType: 'positive',
    icon: TrendingUp,
    href: '/dashboard/placements'
  },
];

const recentActivity = [
  { id: 1, type: 'candidate', action: 'New candidate added', name: 'John Developer', time: '2 hours ago', icon: UserPlus },
  { id: 2, type: 'application', action: 'Application submitted', name: 'Emily Finance → Financial Analyst', time: '4 hours ago', icon: Clock },
  { id: 3, type: 'placement', action: 'Placement confirmed', name: 'David Health at HealthFirst', time: '1 day ago', icon: CheckCircle },
  { id: 4, type: 'job', action: 'New job posted', name: 'Senior Software Engineer at TechCorp', time: '2 days ago', icon: Briefcase },
];

const upcomingInterviews = [
  { id: 1, candidate: 'John Developer', company: 'TechCorp Solutions', position: 'Senior Software Engineer', date: 'Today, 2:00 PM' },
  { id: 2, candidate: 'Emily Finance', company: 'Global Financial', position: 'Financial Analyst', date: 'Tomorrow, 10:00 AM' },
  { id: 3, candidate: 'David Health', company: 'HealthFirst Medical', position: 'IT Specialist', date: 'Dec 28, 3:00 PM' },
];

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState(stats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [candidatesRes, companiesRes, jobsRes] = await Promise.all([
          fetch('/api/candidates?limit=1'),
          fetch('/api/companies?limit=1'),
          fetch('/api/jobs?status=open&limit=1')
        ]);

        const [candidatesData, companiesData, jobsData] = await Promise.all([
          candidatesRes.json(),
          companiesRes.json(),
          jobsRes.json()
        ]);

        setDashboardStats(prev => prev.map(stat => {
          if (stat.name === 'Total Candidates') {
            return { ...stat, value: String(candidatesData.total || 0) };
          }
          if (stat.name === 'Active Companies') {
            return { ...stat, value: String(companiesData.total || 0) };
          }
          if (stat.name === 'Open Positions') {
            return { ...stat, value: String(jobsData.total || 0) };
          }
          return stat;
        }));
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's an overview of your recruiting pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                  {stat.changeType === 'positive' ? (
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 ml-1" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  {loading ? '-' : stat.value}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{stat.name}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <Link href="/dashboard/activity" className="text-sm text-blue-900 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600 truncate">{activity.name}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{activity.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h2>
            <Link href="/dashboard/calendar" className="text-sm text-blue-900 hover:text-blue-700 font-medium">
              View calendar
            </Link>
          </div>
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-blue-900" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{interview.candidate}</p>
                  <p className="text-sm text-gray-600">{interview.position}</p>
                  <p className="text-xs text-gray-500">{interview.company}</p>
                </div>
                <span className="text-xs font-medium text-blue-900 whitespace-nowrap">{interview.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/candidates/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Candidate</span>
          </Link>
          <Link
            href="/dashboard/companies/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Building2 className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Company</span>
          </Link>
          <Link
            href="/dashboard/jobs/new"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Briefcase className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Post Job</span>
          </Link>
          <Link
            href="/dashboard/applications"
            className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Clock className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-700">Review Applications</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
