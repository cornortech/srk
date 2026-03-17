'use client';

import { useState } from 'react';
import { ArrowLeft, QrCode, Camera, Share2 } from 'lucide-react';
import QrScan from '../../../components/payment/QrScan';
import QrShare from '../../../components/payment/QrShare';

export default function QRPage() {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
            >
              <QrCode className="w-6 h-6" style={{ color: '#b68938' }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">QR Payment</h2>
              <p className="text-gray-400">
                Scan or share QR codes for instant payments
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 shadow-2xl shadow-[#b68938]/10 overflow-hidden">
              {/* Header with Icon */}
              <div
                className="p-6"
                style={{ borderBottom: '1px solid rgba(182, 137, 56, 0.2)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(182, 137, 56, 0.1)' }}
                  >
                    <QrCode className="w-5 h-5" style={{ color: '#b68938' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">QR Payment</h3>
                    <p className="text-sm text-gray-400">
                      Quick and secure transactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-6">
                <div className="flex gap-2 p-1 rounded-2xl bg-black/50">
                  <button
                    onClick={() => setActiveTab('scan')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'scan'
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      background:
                        activeTab === 'scan'
                          ? 'linear-gradient(135deg, #e1ba73, #b68938)'
                          : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Camera className="w-4 h-4" />
                      Scan QR
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('share')}
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                      activeTab === 'share'
                        ? 'text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    style={{
                      background:
                        activeTab === 'share'
                          ? 'linear-gradient(135deg, #e1ba73, #b68938)'
                          : 'transparent',
                    }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Share2 className="w-4 h-4" />
                      Share QR
                    </div>
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'scan' ? <QrScan /> : <QrShare />}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recent QR Scans */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-[#b68938]/40 p-6">
              <h3 className="font-bold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { name: 'Coffee Shop', amount: 12.5, time: '2 hours ago' },
                  { name: 'Grocery Store', amount: 45.0, time: 'Yesterday' },
                  { name: 'Restaurant', amount: 28.75, time: '2 days ago' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-black/50 border border-[#b68938]/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-semibold text-sm">
                        {item.name}
                      </span>
                      <span className="text-red-400 font-semibold">
                        -${item.amount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{item.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div
              className="rounded-3xl p-6 text-white relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #2a2520, #1a1410)',
              }}
            >
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16"
                style={{
                  background:
                    'radial-gradient(circle, rgba(182, 137, 56, 0.2) 0%, transparent 70%)',
                }}
              ></div>
              <h3 className="text-lg font-bold mb-3 relative z-10">
                💡 Quick Tips
              </h3>
              <ul className="space-y-2 relative z-10">
                <li className="text-sm text-gray-300">
                  • QR payments are instant and secure
                </li>
                <li className="text-sm text-gray-300">
                  • No fees for QR transactions
                </li>
                <li className="text-sm text-gray-300">
                  • Works with any QR-enabled app
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
