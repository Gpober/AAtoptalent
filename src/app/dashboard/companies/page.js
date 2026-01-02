'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Building2,
  MapPin,
  Globe,
  Users,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Upload,
  X
} from 'lucide-react';
import CSVUpload from '@/components/CSVUpload';

const statusColors = {
  active: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-800',
  prospect: 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  active: 'Active',
  inactive: 'Inactive',
  prospect: 'Prospect'
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [showUpload, setShowUpload] = useState(false);
  const limit = 10;

  useEffect(() => {
    fetchCompanies();
  }, [page, statusFilter]);

  async function fetchCompanies() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit)
      });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/companies?${params}`);
      const data = await res.json();
      setCompanies(data.companies || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    fetchCompanies();
  }

  function handleUploadComplete() {
    setShowUpload(false);
    fetchCompanies();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Companies</h1>
            <p className="text-sm text-gray-600">Manage your client companies</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/companies/new"
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
        <CSVUpload type="companies" onUploadComplete={handleUploadComplete} />
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
              placeholder="Search by name, industry..."
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
              <option value="prospect">Prospect</option>
              <option value="inactive">Inactive</option>
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

      {/* Companies Grid */}
      <div>
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            Loading companies...
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No companies found</p>
            <Link
              href="/dashboard/companies/new"
              className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first company
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {companies.map((company) => (
                <Link
                  key={company.id}
                  href={`/dashboard/companies/${company.id}`}
                  className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-md active:bg-gray-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-900" />
                    </div>
                    <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[company.status] || statusColors.active}`}>
                      {statusLabels[company.status] || company.status}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-0.5 line-clamp-1">{company.name}</h3>
                  {company.industry && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">{company.industry}</p>
                  )}

                  <div className="space-y-1.5 text-sm text-gray-500">
                    {company.location && (
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span className="line-clamp-1">{company.location}</span>
                      </div>
                    )}
                    {company.website && (
                      <div className="flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                        <span className="line-clamp-1">{company.website.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="w-3.5 h-3.5 mr-1" />
                      {company._count?.contacts || 0}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="w-3.5 h-3.5 mr-1" />
                      {company._count?.jobs || 0}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
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
