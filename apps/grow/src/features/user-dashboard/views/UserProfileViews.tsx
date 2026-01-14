import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { TGetSrkGrowProfileResponse } from '@srk/shared/contracts';

interface UserProfileViewProps {
  user: TGetSrkGrowProfileResponse['userDetails'];
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-r from-[#b68938] to-[#e1ba73] flex items-center justify-center text-4xl font-bold text-black flex-shrink-0">
            {user.fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              {user.fullName}
            </h2>
            <p className="text-gray-400 text-lg mb-4">{user.email}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-sm font-bold uppercase">
              <CheckCircle size={16} /> KYC{' '}
              {user.status === 'portalActivated' ? 'Verified' : 'Pending'}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
              Account ID
            </label>
            <div className="p-4 bg-white/5 rounded-2xl text-white font-mono text-sm border border-white/10">
              {user._id}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
              Join Date
            </label>
            <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10">
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
              Country
            </label>
            <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10">
              {user.country || 'Not specified'}
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2 font-bold">
              Phone
            </label>
            <div className="p-4 bg-white/5 rounded-2xl text-white text-sm border border-white/10">
              {user.phone || 'Not specified'}
            </div>
          </div>
        </div>

        {/* KYC Documents Section */}
        {/* {((user.kycDocuments && user.kycDocuments.length > 0) ||
          (user.kycURL && user.kycURL.length > 0)) && (
          <div className="mt-8 pt-8 border-t border-white/10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              KYC Documents
            </h3>
            <div className="grid md:grid-cols-2 gap-4"> */}
        {/* Prioritize kycDocuments if available, else use kycURL array */}
        {/* {user.kycDocuments && user.kycDocuments.length > 0
                ? user.kycDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-white/5 border border-white/10 rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{doc.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-bold ${
                            doc.status === 'portalActivated'
                              ? 'bg-green-500/20 text-green-400'
                              : doc.status === 'verificationPending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#b68938] hover:underline flex items-center gap-1 mt-2"
                        >
                          View Document
                        </a>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Submitted:{' '}
                        {new Date(doc.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                : (Array.isArray(user.kycURL) ? user.kycURL : [user.kycURL])
                    .filter((url): url is string => !!url)
                    .map((url, index) => (
                      <div
                        key={index}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#b68938]/10 flex items-center justify-center text-[#b68938]">
                            <CheckCircle size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">
                              Document {index + 1}
                            </p>
                            <a
                              href={url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-gray-400 hover:text-[#b68938] transition-colors"
                            >
                              Click to view
                            </a>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 uppercase">
                            {user.status === 'portalActivated'
                              ? 'Verified'
                              : 'Attached'}
                          </span>
                        </div>
                      </div>
                    ))}
            </div>
          </div>
        )} */}
      </div>
    </motion.div>
  );
};
