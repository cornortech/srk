import { motion } from 'framer-motion';
import { getGrowAssetUrl } from '../../../lib/cdn';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  // title: string;
  documentUrl?: string;
  // profilePhoto?: string;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  // title,
  documentUrl,
  // profilePhoto,
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl w-full rounded-2xl bg-gradient-to-br from-[#1a1410] to-[#0a0705] border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          {/* <h3 className="text-xl font-bold text-white">{title}</h3> */}
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="text-white">✕</span>
          </button>
        </div>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* {profilePhoto && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                Profile Photo
              </h4>
              <div className="relative w-48 h-48 rounded-lg overflow-hidden border border-white/10">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )} */}

          {documentUrl && (
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">
                KYC Document
              </h4>
              <div className="border border-white/10 rounded-lg p-4 bg-black/30">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white">Document Preview</p>
                    <p className="text-sm text-gray-400">
                      Click to view full document
                    </p>
                  </div>
                  {/* <a
                    href={getGrowAssetUrl(documentUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#b68938]/20 text-[#e1ba73] rounded-lg hover:bg-[#b68938]/30 transition-colors"
                  >
                    View Full Document
                  </a> */}

                  <img
                    src={getGrowAssetUrl(documentUrl)}
                    alt="Profile"
                    className="w-full h-[100vh] object-cover"
                  />
                </div>
                <div className="border border-white/10 rounded p-4 bg-black/50">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📄</div>
                    <p>KYC Document Preview</p>
                    <p className="text-sm mt-1">
                      Click "View Full Document" to see complete details
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
