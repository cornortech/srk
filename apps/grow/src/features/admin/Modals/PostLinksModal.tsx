import { motion } from 'framer-motion';

interface PostLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  postLinks: string[];
  userName: string;
}

export const PostLinksModal: React.FC<PostLinksModalProps> = ({
  isOpen,
  onClose,
  postLinks,
  userName,
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
        className="max-w-2xl w-full rounded-2xl bg-gradient-to-br from-[#1a1410] to-[#0a0705] border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            Post Links - {userName}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span className="text-white">✕</span>
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {postLinks.map((link, index) => (
            <div
              key={index}
              className="p-4 bg-black/30 rounded-lg border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#b68938]/20 flex items-center justify-center text-[#e1ba73]">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 mb-1">
                      Post {index + 1}
                    </p>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline break-all"
                    >
                      {link}
                    </a>
                  </div>
                </div>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-white/5 text-white text-sm rounded-lg hover:bg-white/10 transition-colors"
                >
                  View
                </a>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
