
import React, { useState, useEffect } from 'react';
import { User, Mail, Building, Globe, Key, Bell, Shield, Trash2, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface UserSettings {
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  website: string;
  username: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  browser_notifications: boolean;
  weekly_reports: boolean;
  marketing_emails: boolean;
}

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [userSettings, setUserSettings] = useState<UserSettings>({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
    website: '',
    username: ''
  });
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    browser_notifications: true,
    weekly_reports: true,
    marketing_emails: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUserSettings((prev: UserSettings) => ({
        ...prev,
        email: user.email || '',
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        company: user.user_metadata?.company || ''
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Update user metadata
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: userSettings.first_name,
          last_name: userSettings.last_name,
          company: userSettings.company,
          website: userSettings.website
        }
      });

      if (error) throw error;
      
      // You would also update the users table here if needed
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you'd call an API to delete the account
        console.log('Account deletion requested');
      } catch (error) {
        console.error('Error deleting account:', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <User className="w-8 h-8 mr-3 text-blue-600" />
          Settings
        </h1>
        <p className="text-gray-600 text-lg">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={userSettings.first_name}
                  onChange={(e) => setUserSettings((prev: UserSettings) => ({ ...prev, first_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={userSettings.last_name}
                  onChange={(e) => setUserSettings((prev: UserSettings) => ({ ...prev, last_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={userSettings.email}
                  onChange={(e) => setUserSettings((prev: UserSettings) => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <div className="relative">
                  <Building className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={userSettings.company}
                    onChange={(e) => setUserSettings((prev: UserSettings) => ({ ...prev, company: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    value={userSettings.website}
                    onChange={(e) => setUserSettings((prev: UserSettings) => ({ ...prev, website: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <Bell className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                  <p className="text-sm text-gray-500">Receive notifications about new testimonials</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email_notifications}
                  onChange={(e) => setNotifications((prev: NotificationSettings) => ({ ...prev, email_notifications: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Browser Notifications</h3>
                  <p className="text-sm text-gray-500">Show desktop notifications</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.browser_notifications}
                  onChange={(e) => setNotifications((prev: NotificationSettings) => ({ ...prev, browser_notifications: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                  <p className="text-sm text-gray-500">Get weekly analytics summaries</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weekly_reports}
                  onChange={(e) => setNotifications((prev: NotificationSettings) => ({ ...prev, weekly_reports: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                  <p className="text-sm text-gray-500">Receive product updates and tips</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.marketing_emails}
                  onChange={(e) => setNotifications((prev: NotificationSettings) => ({ ...prev, marketing_emails: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Security */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <Key className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Change Password</span>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-red-200">
            <div className="flex items-center space-x-3 mb-4">
              <Trash2 className="w-5 h-5 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Danger Zone</h3>
            </div>
            <p className="text-sm text-red-600 mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
