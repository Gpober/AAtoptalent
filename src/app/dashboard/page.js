'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  Briefcase,
  TrendingUp,
  Clock,
  UserPlus,
  Calendar,
  Plus,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    candidates: 0,
    companies: 0,
    jobs: 0,
    placements: 0
  });
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [recentCompanies, setRecentCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [candidatesRes, companiesRes, jobsRes] = await Promise.all([
          fetch('/api/candidates?limit=5'),
          fetch('/api/companies?limit=5'),
          fetch('/api/jobs?status=open&limit=5')
        ]);

        const [candidatesData, companiesData, jobsData] = await Promise.all([
          candidatesRes.json(),
          companiesRes.json(),
          jobsRes.json()
        ]);

        setStats({
          candidates: candidatesData.total || 0,
          companies: companiesData.total || 0,
          jobs: jobsData.total || 0,
          placements: 0
        });

        setRecentCandidates(candidatesData.candidates || []);
        setRecentCompanies(companiesData.companies || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const statCards = [
    { name: 'Total Candidates', value: stats.candidates, icon: Users, href: '/dashboard/candidates', color: 'bg-blue-50 text-blue-900' },
    { name: 'Active Companies', value: stats.companies, icon: Building2, href: '/dashboard/companies', color: 'bg-green-50 text-green-900' },
    { name: 'Open Positions', value: stats.jobs, icon: Briefcase, href: '/dashboard/jobs', color: 'bg-purple-50 text-purple-900' },
    { name: 'Placements', value: stats.placements, icon: TrendingUp, href: '/dashboard/applications', color: 'bg-orange-50 text-orange-900' },
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome back! Here's an overview of your recruiting pipeline.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {loading ? '-' : stat.value}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600">{stat.name}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link
            href="/dashboard/candidates/new"
            className="flex flex-col items-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <UserPlus className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Add Candidate</span>
          </Link>
          <Link
            href="/dashboard/companies/new"
            className="flex flex-col items-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Building2 className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Add Company</span>
          </Link>
          <Link
            href="/dashboard/jobs/new"
            className="flex flex-col items-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <Briefcase className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Post Job</span>
          </Link>
          <Link
            href="/dashboard/applications"
            className="flex flex-col items-center p-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <FileText className="w-6 h-6 text-gray-400 mb-1" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">Applications</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Candidates */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Candidates</h2>
            <Link href="/dashboard/candidates" className="text-xs sm:text-sm text-blue-900 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : recentCandidates.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">No candidates yet</p>
              <Link
                href="/dashboard/candidates/new"
                className="inline-flex items-center text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add your first candidate
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCandidates.slice(0, 5).map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/dashboard/candidates/${candidate.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium text-blue-900">
                      {candidate.firstName?.[0]}{candidate.lastName?.[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {candidate.currentTitle || candidate.email}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Companies */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Recent Companies</h2>
            <Link href="/dashboard/companies" className="text-xs sm:text-sm text-blue-900 hover:text-blue-700 font-medium">
              View all
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
          ) : recentCompanies.length === 0 ? (
            <div className="text-center py-6">
              <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-3">No companies yet</p>
              <Link
                href="/dashboard/companies/new"
                className="inline-flex items-center text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add your first company
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCompanies.slice(0, 5).map((company) => (
                <Link
                  key={company.id}
                  href={`/dashboard/companies/${company.id}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-green-900" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {company.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {company.industry || company.location || 'No details'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
