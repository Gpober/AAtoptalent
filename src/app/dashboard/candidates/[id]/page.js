'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Briefcase,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';

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

const availabilityLabels = {
  immediate: 'Immediate',
  '2_weeks': '2 Weeks',
  '1_month': '1 Month',
  '2_months': '2+ Months'
};

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchCandidate();
  }, [params.id]);

  async function fetchCandidate() {
    try {
      const res = await fetch(`/api/candidates/${params.id}`);
      if (!res.ok) throw new Error('Candidate not found');
      const data = await res.json();
      setCandidate(data);
    } catch (error) {
      console.error('Error fetching candidate:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/candidates/${params.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard/candidates');
    } catch (error) {
      console.error('Error deleting candidate:', error);
      alert('Failed to delete candidate');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading candidate...</div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Candidate not found</h2>
        <Link href="/dashboard/candidates" className="text-blue-900 hover:text-blue-700">
          Back to candidates
        </Link>
      </div>
    );
  }

  const skills = candidate.skills ? candidate.skills.split(',').map(s => s.trim()) : [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Candidates
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[candidate.status]}`}>
                {statusLabels[candidate.status]}
              </span>
            </div>
            {candidate.currentTitle && (
              <p className="text-gray-600 mt-1">
                {candidate.currentTitle}
                {candidate.currentCompany && ` at ${candidate.currentCompany}`}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/candidates/${params.id}/edit`}
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
          {/* Contact Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <a href={`mailto:${candidate.email}`} className="hover:text-blue-900">
                  {candidate.email}
                </a>
              </div>
              {candidate.cellPhone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-gray-500 mr-2">Cell:</span>
                  <a href={`tel:${candidate.cellPhone}`} className="hover:text-blue-900">
                    {candidate.cellPhone}
                  </a>
                </div>
              )}
              {candidate.workPhone && (
                <div className="flex items-center text-gray-600">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-gray-500 mr-2">Work:</span>
                  <a href={`tel:${candidate.workPhone}`} className="hover:text-blue-900">
                    {candidate.workPhone}
                  </a>
                </div>
              )}
              {candidate.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {candidate.location}
                </div>
              )}
              {candidate.linkedinUrl && (
                <div className="flex items-center text-gray-600">
                  <Linkedin className="w-5 h-5 mr-3 text-gray-400" />
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-900"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Applications */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Applications</h2>
              <button className="text-sm text-blue-900 hover:text-blue-700 font-medium">
                + Add Application
              </button>
            </div>
            {candidate.applications && candidate.applications.length > 0 ? (
              <div className="space-y-3">
                {candidate.applications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{app.job.title}</p>
                      <p className="text-sm text-gray-600">{app.job.company?.name}</p>
                    </div>
                    <span className="text-sm text-gray-500 capitalize">{app.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No applications yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="font-medium text-gray-900">
                  {candidate.yearsExperience ? `${candidate.yearsExperience} years` : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Desired Role</p>
                <p className="font-medium text-gray-900">
                  {candidate.desiredRole || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Desired Salary</p>
                <p className="font-medium text-gray-900">
                  {candidate.desiredSalary || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Availability</p>
                <p className="font-medium text-gray-900">
                  {availabilityLabels[candidate.availability] || candidate.availability || 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Source</p>
                <p className="font-medium text-gray-900 capitalize">
                  {candidate.source?.replace('_', ' ') || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                Added: {new Date(candidate.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                Updated: {new Date(candidate.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
