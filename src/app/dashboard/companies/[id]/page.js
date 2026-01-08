'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Globe,
  MapPin,
  Users,
  Building2,
  Briefcase,
  Calendar,
  Clock,
  Plus,
  Mail,
  Phone,
  X,
  Save
} from 'lucide-react';

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

export default function CompanyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    title: '',
    isPrimary: false
  });

  useEffect(() => {
    fetchCompany();
  }, [params.id]);

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    setContactData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetContactForm = () => {
    setContactData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      title: '',
      isPrimary: false
    });
    setShowContactForm(false);
  };

  async function handleAddContact(e) {
    e.preventDefault();
    if (!contactData.firstName || !contactData.lastName) {
      alert('Please enter first and last name');
      return;
    }

    setSavingContact(true);
    try {
      const res = await fetch(`/api/companies/${params.id}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add contact');
      }

      // Refresh company data to show new contact
      await fetchCompany();
      resetContactForm();
    } catch (error) {
      console.error('Error adding contact:', error);
      alert('Failed to add contact');
    } finally {
      setSavingContact(false);
    }
  }

  async function fetchCompany() {
    try {
      const res = await fetch(`/api/companies/${params.id}`);
      if (!res.ok) throw new Error('Company not found');
      const data = await res.json();
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this company? This will also delete all associated jobs.')) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/companies/${params.id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete');
      router.push('/dashboard/companies');
    } catch (error) {
      console.error('Error deleting company:', error);
      alert('Failed to delete company');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading company...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Company not found</h2>
        <Link href="/dashboard/companies" className="text-blue-900 hover:text-blue-700">
          Back to companies
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/companies"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Companies
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-8 h-8 text-blue-900" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${statusColors[company.status]}`}>
                  {statusLabels[company.status]}
                </span>
              </div>
              {company.industry && (
                <p className="text-gray-600 mt-1">{company.industry}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/companies/${params.id}/edit`}
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
          {/* Company Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="space-y-3">
              {company.email && (
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  <a href={`mailto:${company.email}`} className="hover:text-blue-900">
                    {company.email}
                  </a>
                </div>
              )}
              {company.website && (
                <div className="flex items-center text-gray-600">
                  <Globe className="w-5 h-5 mr-3 text-gray-400" />
                  <a
                    href={company.website.match(/^https?:\/\//i) ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-900"
                  >
                    {company.website}
                  </a>
                </div>
              )}
              {company.location && (
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {company.location}
                </div>
              )}
              {company.size && (
                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-3 text-gray-400" />
                  {company.size} employees
                </div>
              )}
            </div>
            {company.description && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-gray-600">{company.description}</p>
              </div>
            )}
          </div>

          {/* Contacts */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Contacts</h2>
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className={`inline-flex items-center text-sm font-medium ${
                  showContactForm
                    ? 'text-red-700 hover:text-red-600'
                    : 'text-blue-900 hover:text-blue-700'
                }`}
              >
                {showContactForm ? (
                  <>
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Contact
                  </>
                )}
              </button>
            </div>

            {/* Add Contact Form */}
            {showContactForm && (
              <form onSubmit={handleAddContact} className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={contactData.firstName}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={contactData.lastName}
                      onChange={handleContactChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={contactData.title}
                    onChange={handleContactChange}
                    placeholder="e.g., HR Manager"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      placeholder="contact@company.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={contactData.phone}
                      onChange={handleContactChange}
                      placeholder="(555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    name="isPrimary"
                    id="isPrimary"
                    checked={contactData.isPrimary}
                    onChange={handleContactChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPrimary" className="ml-2 text-sm text-gray-700">
                    Set as primary contact
                  </label>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={savingContact}
                    className="inline-flex items-center px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    {savingContact ? 'Saving...' : 'Save Contact'}
                  </button>
                </div>
              </form>
            )}

            {company.contacts && company.contacts.length > 0 ? (
              <div className="space-y-3">
                {company.contacts.map((contact) => (
                  <div key={contact.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {contact.firstName} {contact.lastName}
                        </p>
                        {contact.isPrimary && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      {contact.title && (
                        <p className="text-sm text-gray-600">{contact.title}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        {contact.email && (
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No contacts added yet</p>
            )}
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Open Positions</h2>
              <Link
                href={`/dashboard/jobs/new?companyId=${company.id}`}
                className="inline-flex items-center text-sm text-blue-900 hover:text-blue-700 font-medium"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Job
              </Link>
            </div>
            {company.jobs && company.jobs.length > 0 ? (
              <div className="space-y-3">
                {company.jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/dashboard/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{job.title}</p>
                      <p className="text-sm text-gray-500">
                        {job.location || 'Location not specified'} • {job.type?.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        {job._count?.applications || 0} applicants
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No jobs posted yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Open Jobs</span>
                <span className="font-semibold text-gray-900">{company.jobs?.filter(j => j.status === 'open').length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Total Contacts</span>
                <span className="font-semibold text-gray-900">{company.contacts?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Placements</span>
                <span className="font-semibold text-gray-900">{company.placements?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                Added: {new Date(company.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                Updated: {new Date(company.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
