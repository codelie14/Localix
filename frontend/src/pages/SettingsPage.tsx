import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UserIcon,
  BellIcon,
  ShieldIcon,
  DatabaseIcon,
  KeyIcon,
  GlobeIcon,
  SaveIcon,
  RefreshCwIcon } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../ui/Input';
export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    critical: true,
    high: true,
    medium: false,
    low: false
  });
  const tabs = [
  {
    id: 'profile',
    label: 'Profile',
    icon: UserIcon
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: BellIcon
  },
  {
    id: 'security',
    label: 'Security',
    icon: ShieldIcon
  },
  {
    id: 'integrations',
    label: 'Integrations',
    icon: DatabaseIcon
  },
  {
    id: 'api',
    label: 'API Keys',
    icon: KeyIcon
  }];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-2">
        <span className="text-terminal-green">&gt;</span>
        <h1 className="text-xl font-semibold text-white">Settings</h1>
        <span className="text-gray-500 text-sm"> // system configuration</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <motion.div
          initial={{
            opacity: 0,
            x: -20
          }}
          animate={{
            opacity: 1,
            x: 0
          }}
          className="relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-4 neon-box-green h-fit">

          <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
            ┌
          </span>
          <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
            ┐
          </span>
          <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
            └
          </span>
          <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
            ┘
          </span>

          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${activeTab === tab.id ? 'bg-terminal-green/10 text-terminal-green' : 'text-gray-400 hover:text-terminal-green hover:bg-terminal-green/5'}`}>

                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <span className="ml-auto">●</span>}
                </button>);

            })}
          </nav>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="lg:col-span-3 relative bg-terminal-dark rounded-lg border border-terminal-green/30 p-6 neon-box-green">

          <span className="absolute -top-px -left-px text-terminal-green/60 text-xs">
            ┌
          </span>
          <span className="absolute -top-px -right-px text-terminal-green/60 text-xs">
            ┐
          </span>
          <span className="absolute -bottom-px -left-px text-terminal-green/60 text-xs">
            └
          </span>
          <span className="absolute -bottom-px -right-px text-terminal-green/60 text-xs">
            ┘
          </span>

          {/* Profile Tab */}
          {activeTab === 'profile' &&
          <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 text-xs">[</span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  User Profile
                </span>
                <span className="text-gray-500 text-xs">]</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Username" defaultValue="admin" />
                <Input
                label="Email"
                type="email"
                defaultValue="admin@localix.io" />

                <div>
                  <label className="block text-gray-400 text-xs mb-2">
                    [ROLE]
                  </label>
                  <select className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors">
                    <option>Administrator</option>
                    <option>Analyst</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs mb-2">
                    [TIMEZONE]
                  </label>
                  <select className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-xs mb-2">
                  [BIO]
                </label>
                <textarea
                rows={3}
                defaultValue="Security analyst focused on threat intelligence and vulnerability management."
                className="w-full px-4 py-2 rounded border border-terminal-green/30 bg-terminal-black text-gray-300 outline-none focus:border-terminal-green transition-colors resize-none" />

              </div>

              <div className="flex items-center gap-3 pt-4">
                <Button icon={<SaveIcon className="w-4 h-4" />}>
                  Save Changes
                </Button>
                <Button
                variant="secondary"
                icon={<RefreshCwIcon className="w-4 h-4" />}>

                  Reset
                </Button>
              </div>
            </div>
          }

          {/* Notifications Tab */}
          {activeTab === 'notifications' &&
          <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 text-xs">[</span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  Notification Preferences
                </span>
                <span className="text-gray-500 text-xs">]</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded border border-terminal-green/20 bg-terminal-black">
                  <div>
                    <p className="text-white">Email Notifications</p>
                    <p className="text-gray-500 text-xs">
                      Receive alerts via email
                    </p>
                  </div>
                  <button
                  onClick={() =>
                  setNotifications((n) => ({
                    ...n,
                    email: !n.email
                  }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? 'bg-terminal-green' : 'bg-gray-600'}`}>

                    <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-0.5'}`} />

                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded border border-terminal-green/20 bg-terminal-black">
                  <div>
                    <p className="text-white">Slack Integration</p>
                    <p className="text-gray-500 text-xs">
                      Send alerts to Slack channel
                    </p>
                  </div>
                  <button
                  onClick={() =>
                  setNotifications((n) => ({
                    ...n,
                    slack: !n.slack
                  }))
                  }
                  className={`w-12 h-6 rounded-full transition-colors ${notifications.slack ? 'bg-terminal-green' : 'bg-gray-600'}`}>

                    <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications.slack ? 'translate-x-6' : 'translate-x-0.5'}`} />

                  </button>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-gray-400 text-xs mb-4">[SEVERITY_FILTERS]</p>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 rounded border border-terminal-red/30 bg-terminal-black cursor-pointer">
                    <input
                    type="checkbox"
                    checked={notifications.critical}
                    onChange={(e) =>
                    setNotifications((n) => ({
                      ...n,
                      critical: e.target.checked
                    }))
                    }
                    className="accent-terminal-red" />

                    <span className="text-terminal-red">Critical</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded border border-terminal-amber/30 bg-terminal-black cursor-pointer">
                    <input
                    type="checkbox"
                    checked={notifications.high}
                    onChange={(e) =>
                    setNotifications((n) => ({
                      ...n,
                      high: e.target.checked
                    }))
                    }
                    className="accent-terminal-amber" />

                    <span className="text-terminal-amber">High</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded border border-terminal-green/30 bg-terminal-black cursor-pointer">
                    <input
                    type="checkbox"
                    checked={notifications.medium}
                    onChange={(e) =>
                    setNotifications((n) => ({
                      ...n,
                      medium: e.target.checked
                    }))
                    }
                    className="accent-terminal-green" />

                    <span className="text-terminal-green">Medium</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 rounded border border-gray-500/30 bg-terminal-black cursor-pointer">
                    <input
                    type="checkbox"
                    checked={notifications.low}
                    onChange={(e) =>
                    setNotifications((n) => ({
                      ...n,
                      low: e.target.checked
                    }))
                    }
                    className="accent-gray-400" />

                    <span className="text-gray-400">Low</span>
                  </label>
                </div>
              </div>
            </div>
          }

          {/* Security Tab */}
          {activeTab === 'security' &&
          <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 text-xs">[</span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  Security Settings
                </span>
                <span className="text-gray-500 text-xs">]</span>
              </div>

              <div className="space-y-4">
                <Input
                label="Current Password"
                type="password"
                placeholder="••••••••" />

                <Input
                label="New Password"
                type="password"
                placeholder="••••••••" />

                <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••" />

              </div>

              <div className="pt-4 border-t border-terminal-green/20">
                <p className="text-gray-400 text-xs mb-4">[TWO_FACTOR_AUTH]</p>
                <div className="flex items-center justify-between p-4 rounded border border-terminal-green/20 bg-terminal-black">
                  <div>
                    <p className="text-white">Enable 2FA</p>
                    <p className="text-gray-500 text-xs">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Button variant="ghost">Configure</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-terminal-green/20">
                <p className="text-gray-400 text-xs mb-4">[ACTIVE_SESSIONS]</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 rounded border border-terminal-green/20 bg-terminal-black">
                    <div className="flex items-center gap-3">
                      <GlobeIcon className="w-4 h-4 text-terminal-green" />
                      <div>
                        <p className="text-gray-300 text-sm">Chrome on macOS</p>
                        <p className="text-gray-500 text-xs">
                          192.168.1.1 • Current session
                        </p>
                      </div>
                    </div>
                    <span className="text-terminal-green text-xs">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded border border-terminal-green/20 bg-terminal-black">
                    <div className="flex items-center gap-3">
                      <GlobeIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-gray-300 text-sm">
                          Firefox on Windows
                        </p>
                        <p className="text-gray-500 text-xs">
                          10.0.0.50 • 2 days ago
                        </p>
                      </div>
                    </div>
                    <Button variant="danger" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* Integrations Tab */}
          {activeTab === 'integrations' &&
          <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-gray-500 text-xs">[</span>
                <span className="text-gray-400 text-xs uppercase tracking-wider">
                  Connected Services
                </span>
                <span className="text-gray-500 text-xs">]</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded border border-terminal-green/30 bg-terminal-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-terminal-green/10 flex items-center justify-center">
                      <span className="text-terminal-green font-bold">NVD</span>
                    </div>
                    <div>
                      <p className="text-white">
                        National Vulnerability Database
                      </p>
                      <p className="text-terminal-green text-xs">
                        Connected • Last sync: 5 min ago
                      </p>
                    </div>
                  </div>
                  <Button variant="danger" size="sm">
                    Disconnect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded border border-terminal-amber/30 bg-terminal-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-terminal-amber/10 flex items-center justify-center">
                      <span className="text-terminal-amber font-bold">VT</span>
                    </div>
                    <div>
                      <p className="text-white">VirusTotal</p>
                      <p className="text-terminal-amber text-xs">
                        API key required
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded border border-gray-500/30 bg-terminal-black">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gray-500/10 flex items-center justify-center">
                      <span className="text-gray-400 font-bold">ST</span>
                    </div>
                    <div>
                      <p className="text-white">Shodan</p>
                      <p className="text-gray-500 text-xs">Not connected</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          }

          {/* API Keys Tab */}
          {activeTab === 'api' &&
          <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 text-xs">[</span>
                  <span className="text-gray-400 text-xs uppercase tracking-wider">
                    API Keys
                  </span>
                  <span className="text-gray-500 text-xs">]</span>
                </div>
                <Button icon={<KeyIcon className="w-4 h-4" />}>
                  Generate New Key
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded border border-terminal-green/30 bg-terminal-black">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">Production API Key</p>
                    <span className="text-terminal-green text-xs">Active</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 px-3 py-2 rounded bg-terminal-dark text-gray-400 text-sm font-mono">
                      lx_prod_••••••••••••••••••••••••
                    </code>
                    <Button variant="ghost" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Created: Jan 1, 2024 • Last used: 2 hours ago
                  </p>
                </div>

                <div className="p-4 rounded border border-terminal-amber/30 bg-terminal-black">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">
                      Development API Key
                    </p>
                    <span className="text-terminal-amber text-xs">Limited</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="flex-1 px-3 py-2 rounded bg-terminal-dark text-gray-400 text-sm font-mono">
                      lx_dev_••••••••••••••••••••••••
                    </code>
                    <Button variant="ghost" size="sm">
                      Copy
                    </Button>
                  </div>
                  <p className="text-gray-500 text-xs">
                    Created: Dec 15, 2023 • Last used: 1 day ago
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-terminal-green/20">
                <p className="text-gray-400 text-xs mb-2">[RATE_LIMITS]</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Production</p>
                    <p className="text-terminal-green">10,000 requests/hour</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Development</p>
                    <p className="text-terminal-amber">1,000 requests/hour</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </motion.div>
      </div>
    </div>);

}