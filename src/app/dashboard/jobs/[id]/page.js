'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  Clock,
  Users,
  Mail
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

const applicationStatusColors = {
  submitted: 'bg-gray-100 text-gray-800',
  screening: 'bg-yellow-100 text-yellow-800',
  interview: 'bg-blue-100 text-blue-800',
  offer: 'bg-purple-100 text-purple-800',
  rejected: 'bg-red-100 text-red-800',
  withdrawn: 'bg-gray-100 text-gray-600'
};

function formatSalary(min, max) {
  if (!min && !max) return 'Not specified';
  const format = (num) => `$${num.toLocaleString()}`;
  if (min && max) return `${format(min)} - ${format(max)}`;
  if (min) return `${format(min)}+`;
  return `Up to ${format(max)}`;
}

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  async function fetchJob() {
    try {
      const res = await fetch(`/api/jobs/${params.id}`);
      if (!res.ok) throw new Error('Job not found');
      const data = await res.json();
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this job?')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/jobs/${params.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard/jobs');
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading job...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Job not found</h2>
        <Link href="/dashboard/jobs" className="text-blue-900 hover:text-blue-700">
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/jobs"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Jobs
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
                {statusLabels[job.status]}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <Link
                href={`/dashboard/companies/${job.company?.id}`}
                className="flex items-center hover:text-blue-900"
              >
                <Building2 className="w-4 h-4 mr-1" />
                {job.company?.name}
              </Link>
              {job.location && (
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </span>
              )}
              <span>{typeLabels[job.type] || job.type}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/jobs/${params.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h2>
            {job.description ? (
              <p className="text-gray-600 whitespace-pre-wrap">{job.description}</p>
            ) : (
              <p className="text-gray-400 italic">No description provided</p>
            )}
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{job.requirements}</p>
            </div>
          )}

          {/* Candidate Submissions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Candidate Submissions ({job.applications?.length || 0})
              </h2>
            </div>
            {job.applications && job.applications.length > 0 ? (
              <div className="overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-100 rounded-t-lg text-sm font-medium text-gray-600">
                  <div className="col-span-5">Candidate Name</div>
                  <div className="col-span-3">Date Submitted</div>
                  <div className="col-span-2">Title</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                {/* Table Rows */}
                <div className="divide-y divide-gray-100">
                  {job.applications.map((app) => (
                    <Link
                      key={app.id}
                      href={`/dashboard/candidates/${app.candidate.id}`}
                      className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center"
                    >
                      <div className="col-span-5 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-medium flex-shrink-0">
                          {app.candidate.firstName[0]}{app.candidate.lastName[0]}
                        </div>
                        <p className="font-medium text-gray-900">
                          {app.candidate.firstName} {app.candidate.lastName}
                        </p>
                      </div>
                      <div className="col-span-3 text-sm text-gray-600">
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>
                      <div className="col-span-2 text-sm text-gray-500 truncate">
                        {app.candidate.currentTitle || '-'}
                      </div>
                      <div className="col-span-2 text-right">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${applicationStatusColors[app.status] || applicationStatusColors.submitted}`}>
                          {app.status}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No candidates submitted yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Salary Range</p>
                <p className="font-medium text-gray-900 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Employment Type</p>
                <p className="font-medium text-gray-900">
                  {typeLabels[job.type] || job.type}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">
                  {job.location || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[job.status]}`}>
                  {statusLabels[job.status]}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                Posted: {new Date(job.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                Updated: {new Date(job.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Mail className="w-4 h-4 mr-2" />
                Share Job Posting
              </button>
              <Link
                href={`/dashboard/companies/${job.company?.id}`}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <Building2 className="w-4 h-4 mr-2" />
                View Company
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
