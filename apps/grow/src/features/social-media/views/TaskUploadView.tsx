import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Youtube } from 'lucide-react';

export const TaskUploadView: React.FC = () => {
  const [taskType, setTaskType] = useState<'post' | 'video'>('post');
  const [postUrl, setPostUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Mock data for package limits and tasks
  const [packageLimits, setPackageLimits] = useState({
    posts: { used: 1, total: 5 },
    videos: { used: 0, total: 3 },
  });

  const [userTasks, setUserTasks] = useState({
    posts: [
      {
        id: '1',
        url: 'https://facebook.com/post/123',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ],
    videos: [] as any[],
  });

  const handleAddTask = () => {
    if (taskType === 'post' && postUrl.trim()) {
      if (packageLimits.posts.used >= packageLimits.posts.total) {
        alert('You have reached your post limit!');
        return;
      }
      const newPost = {
        id: Date.now().toString(),
        url: postUrl,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setUserTasks((prev) => ({
        ...prev,
        posts: [...prev.posts, newPost],
      }));
      setPackageLimits((prev) => ({
        ...prev,
        posts: { ...prev.posts, used: prev.posts.used + 1 },
      }));
      setPostUrl('');
    } else if (taskType === 'video' && videoUrl.trim()) {
      if (packageLimits.videos.used >= packageLimits.videos.total) {
        alert('You have reached your video limit!');
        return;
      }

      setPackageLimits((prev) => ({
        ...prev,
        videos: { ...prev.videos, used: prev.videos.used + 1 },
      }));
      setVideoUrl('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 relative z-10"
    >
      {/* Package Limits Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Post Tasks</h3>
              <p className="text-sm text-gray-400">Facebook, Instagram Posts</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#e1ba73]">
                {packageLimits.posts.used}/{packageLimits.posts.total}
              </div>
              <p className="text-xs text-gray-500">Used/Total</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (packageLimits.posts.used / packageLimits.posts.total) * 100
                }%`,
              }}
              className="h-full bg-gradient-to-r from-[#b68938] to-[#e1ba73]"
            />
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Video Tasks</h3>
              <p className="text-sm text-gray-400">YouTube, TikTok Videos</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-[#e1ba73]">
                {packageLimits.videos.used}/{packageLimits.videos.total}
              </div>
              <p className="text-xs text-gray-500">Used/Total</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${
                  (packageLimits.videos.used / packageLimits.videos.total) * 100
                }%`,
              }}
              className="h-full bg-gradient-to-r from-red-500 to-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Task Type Selector */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setTaskType('post')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              taskType === 'post'
                ? 'bg-[#b68938] text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Share2 className="inline mr-2" size={20} />
            Watch & Post/Share
          </button>
          <button
            onClick={() => setTaskType('video')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
              taskType === 'video'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            <Youtube className="inline mr-2" size={20} />
            Watch Video
          </button>
        </div>

        {/* Add Task Form */}
        {taskType === 'post' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Post URL
              </label>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://facebook.com/post/..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#b68938] transition-all"
              />
            </div>
            <button
              onClick={handleAddTask}
              disabled={packageLimits.posts.used >= packageLimits.posts.total}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                packageLimits.posts.used >= packageLimits.posts.total
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#b68938] text-white hover:bg-[#e1ba73] shadow-lg hover:shadow-[0_0_30px_rgba(182,137,56,0.4)]'
              }`}
            >
              {packageLimits.posts.used >= packageLimits.posts.total
                ? 'Post Limit Reached'
                : 'Add Post Task'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all"
              />
            </div>
            <button
              onClick={handleAddTask}
              disabled={packageLimits.videos.used >= packageLimits.videos.total}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                packageLimits.videos.used >= packageLimits.videos.total
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]'
              }`}
            >
              {packageLimits.videos.used >= packageLimits.videos.total
                ? 'Video Limit Reached'
                : 'Add Video Task'}
            </button>
          </div>
        )}
      </div>

      {/* Task Lists */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Posts List */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Share2 size={20} className="text-[#b68938]" />
            Your Post Tasks ({userTasks.posts.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {userTasks.posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Share2 size={48} className="mx-auto mb-4 opacity-20" />
                <p>No post tasks yet. Add your first one!</p>
              </div>
            ) : (
              userTasks.posts.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#b68938]/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-[#b68938]">
                      POST #{index + 1}
                    </span>
                    <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                      {task.status}
                    </span>
                  </div>
                  <p className="text-sm text-white mb-2 break-all">
                    {task.url}
                  </p>
                  <p className="text-xs text-gray-500">
                    Added: {new Date(task.createdAt).toLocaleDateString()}
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
