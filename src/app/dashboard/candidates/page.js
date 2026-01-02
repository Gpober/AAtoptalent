'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
  Briefcase
} from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  placed: 'bg-blue-100 text-blue-800',
  inactive: 'bg-gray-100 text-gray-800',
  do_not_contact: 'bg-red-100 text-red-800'
};

const statusLabels = {
  active: 'Active',
  placed: 'Placed',
  inactive: 'Inactive',
  do_not_contact: 'Do Not Contact'
};

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchCandidates();
  }, [page, statusFilter]);

  async function fetchCandidates() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit)
      });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/candidates?${params}`);
      const data = await res.json();
      setCandidates(data.candidates || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    fetchCandidates();
  }

  function handleUploadComplete() {
    setShowUpload(false);
    fetchCandidates();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Candidates</h1>
            <p className="text-sm text-gray-600">Manage your candidate pipeline</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/candidates/new"
            className="inline-flex items-center justify-center px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add
          </Link>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className={`inline-flex items-center justify-center px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              showUpload
                ? 'bg-gray-200 text-gray-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {showUpload ? <X className="w-4 h-4 mr-1.5" /> : <Upload className="w-4 h-4 mr-1.5" />}
            {showUpload ? 'Close' : 'Bulk Import'}
          </button>
        </div>
      </div>

      {/* CSV Upload */}
      {showUpload && (
        <CSVUpload type="candidates" onUploadComplete={handleUploadComplete} />
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, skills..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="flex-1 sm:flex-none px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
              <option value="do_not_contact">Do Not Contact</option>
            </select>
            <button
              type="submit"
              className="px-3 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Candidates List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading candidates...</div>
        ) : candidates.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No candidates found</p>
            <Link
              href="/dashboard/candidates/new"
              className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first candidate
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block sm:hidden divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/dashboard/candidates/${candidate.id}`}
                  className="block p-4 hover:bg-gray-50 active:bg-gray-100"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {candidate.firstName} {candidate.lastName}
                      </p>
                      {candidate.currentTitle && (
                        <p className="text-sm text-gray-600">{candidate.currentTitle}</p>
                      )}
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[candidate.status] || statusColors.active}`}>
                      {statusLabels[candidate.status] || candidate.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-2" />
                      {candidate.email}
                    </p>
                    {candidate.location && (
                      <p className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-2" />
                        {candidate.location}
                      </p>
                    )}
                    {candidate.yearsExperience && (
                      <p className="flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-2" />
                        {candidate.yearsExperience} years experience
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Current Role
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {candidates.map((candidate) => (
                    <tr key={candidate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/dashboard/candidates/${candidate.id}`} className="block">
                          <p className="font-medium text-gray-900 hover:text-blue-900">
                            {candidate.firstName} {candidate.lastName}
                          </p>
                          {candidate.location && (
                            <p className="text-xs text-gray-500 flex items-center mt-0.5">
                              <MapPin className="w-3 h-3 mr-1" />
                              {candidate.location}
                            </p>
                          )}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{candidate.email}</p>
                        {candidate.phone && (
                          <p className="text-xs text-gray-500">{candidate.phone}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {candidate.currentTitle ? (
                          <div>
                            <p className="text-sm text-gray-900">{candidate.currentTitle}</p>
                            {candidate.currentCompany && (
                              <p className="text-xs text-gray-500">{candidate.currentCompany}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[candidate.status] || statusColors.active}`}>
                          {statusLabels[candidate.status] || candidate.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/dashboard/candidates/${candidate.id}`}
                          className="text-blue-900 hover:text-blue-700 font-medium text-sm"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-600 order-2 sm:order-1">
                  {page * limit + 1}-{Math.min((page + 1) * limit, total)} of {total}
                </p>
                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 min-w-[80px] text-center">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
