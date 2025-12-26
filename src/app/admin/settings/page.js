'use client';

import React, { useState } from 'react';
import {
  Save,
  Database,
  Mail,
  Shield,
  Bell,
  Globe,
  Key,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'A&A Top Talent',
    siteUrl: 'https://aatoptalent.com',
    adminEmail: 'admin@aatoptalent.com',
    emailNotifications: true,
    applicationAlerts: true,
    weeklyReports: true,
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: false,
    sessionTimeout: '24',
    maxLoginAttempts: '5'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">System Settings</h1>
          <p className="text-gray-400 mt-1">Configure your application settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">General Settings</h2>
            <p className="text-sm text-gray-500">Basic application configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Site URL</label>
            <input
              type="url"
              name="siteUrl"
              value={settings.siteUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Admin Email</label>
            <input
              type="email"
              name="adminEmail"
              value={settings.adminEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-green-600/20 flex items-center justify-center">
            <Bell className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            <p className="text-sm text-gray-500">Configure email and alert settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-xs text-gray-500">Receive email notifications for important events</p>
            </div>
            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Application Alerts</p>
              <p className="text-xs text-gray-500">Get notified when new applications are received</p>
            </div>
            <input
              type="checkbox"
              name="applicationAlerts"
              checked={settings.applicationAlerts}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Weekly Reports</p>
              <p className="text-xs text-gray-500">Receive weekly summary reports via email</p>
            </div>
            <input
              type="checkbox"
              name="weeklyReports"
              checked={settings.weeklyReports}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
            />
          </label>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-600/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Security</h2>
            <p className="text-sm text-gray-500">Security and access control settings</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Allow User Registration</p>
              <p className="text-xs text-gray-500">Allow new users to register on the platform</p>
            </div>
            <input
              type="checkbox"
              name="allowRegistration"
              checked={settings.allowRegistration}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
            />
          </label>

          <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
            <div>
              <p className="text-sm font-medium text-white">Require Email Verification</p>
              <p className="text-xs text-gray-500">Users must verify email before accessing the system</p>
            </div>
            <input
              type="checkbox"
              name="requireEmailVerification"
              checked={settings.requireEmailVerification}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Session Timeout (hours)</label>
              <input
                type="number"
                name="sessionTimeout"
                value={settings.sessionTimeout}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Max Login Attempts</label>
              <input
                type="number"
                name="maxLoginAttempts"
                value={settings.maxLoginAttempts}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-yellow-600/20 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Maintenance</h2>
            <p className="text-sm text-gray-500">System maintenance options</p>
          </div>
        </div>

        <label className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800">
          <div>
            <p className="text-sm font-medium text-white">Maintenance Mode</p>
            <p className="text-xs text-gray-500">Enable maintenance mode to prevent user access during updates</p>
          </div>
          <input
            type="checkbox"
            name="maintenanceMode"
            checked={settings.maintenanceMode}
            onChange={handleChange}
            className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-red-600 focus:ring-red-500"
          />
        </label>

        {settings.maintenanceMode && (
          <div className="mt-4 p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <p className="text-sm text-yellow-500">
              ⚠️ Maintenance mode is enabled. Regular users cannot access the system.
            </p>
          </div>
        )}
      </div>

      {/* Database Info */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Database</h2>
            <p className="text-sm text-gray-500">Database connection information</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-500">Provider</p>
            <p className="text-white font-medium">PostgreSQL (Supabase)</p>
          </div>
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <p className="text-gray-500">Status</p>
            <p className="text-green-500 font-medium flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              Connected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
