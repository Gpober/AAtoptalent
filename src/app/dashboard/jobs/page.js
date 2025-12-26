'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  Building2,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const statusColors = {
  open: 'bg-green-100 text-green-800',
  filled: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  open: 'Open',
  filled: 'Filled',
  on_hold: 'On Hold',
  closed: 'Closed'
};

const typeLabels = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  temp_to_hire: 'Temp to Hire'
};

function formatSalary(min, max) {
  if (!min && !max) return null;
  const format = (num) => `$${(num / 1000).toFixed(0)}k`;
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return `Up to ${format(max)}`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(page * limit)
      });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);

      const res = await fetch(`/api/jobs?${params}`);
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
          <p className="text-gray-600 mt-1">Manage open positions and job postings</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Post New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs by title, description, or location..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
              <option value="on_hold">On Hold</option>
              <option value="closed">Closed</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Jobs List */}
      <div>
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No jobs found</p>
            <Link
              href="/dashboard/jobs/new"
              className="inline-flex items-center text-blue-900 hover:text-blue-700 font-medium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Post your first job
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/dashboard/jobs/${job.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status] || statusColors.open}`}>
                          {statusLabels[job.status] || job.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <span className="flex items-center">
                          <Building2 className="w-4 h-4 mr-1 text-gray-400" />
                          {job.company?.name || 'Unknown Company'}
                        </span>
                        {job.location && (
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                            {job.location}
                          </span>
                        )}
                        <span className="text-gray-500">
                          {typeLabels[job.type] || job.type}
                        </span>
                      </div>

                      {job.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {formatSalary(job.salaryMin, job.salaryMax) && (
                        <span className="flex items-center text-sm font-medium text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                      )}
                      <span className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {job._count?.applications || 0} applicants
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {page * limit + 1} to {Math.min((page + 1) * limit, total)} of {total} jobs
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(0, p - 1))}
                    disabled={page === 0}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page + 1} of {totalPages}
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
