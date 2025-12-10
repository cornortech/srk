import React, { useState, useRef, useEffect } from 'react';
import {
  Check,
  CheckCircle,
  Clock,
  Coins,
  Info,
  Pause,
  Play,
  Send,
  ShieldCheck,
  X,
  Youtube,
} from 'lucide-react';

import { Task } from '../../types';
import { DashboardGlassCard } from '../ui/DashboardGlassCard';
import MagneticButton from '../ui/DashboardMagneticButton';

interface VideoPlayerModalProps {
  task: Task;
  onClose: () => void;
  addNotification: (
    message: string,
    type: 'success' | 'error' | 'info'
  ) => void;
  completeTask: (taskId: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  task,
  onClose,
  addNotification,
  completeTask,
}) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [selectedTimestamps, setSelectedTimestamps] = useState<number[]>([]);
  const progressInterval = useRef<any | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // YouTube API initialization
  useEffect(() => {
    if (task.platform === 'youtube' && task.embedId) {
      // Load YouTube IFrame API if not already loaded
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Function to initialize player once API is ready

      // If API is already loaded, create player immediately
      if (window.YT && window.YT.Player) {
        console.log('YT API already loaded, creating player...');
        window.onYouTubeIframeAPIReady();
      }
    }

    return () => {
      stopProgressTracking();
      if (player) {
        try {
          player.destroy();
        } catch (error) {
          console.error('Error destroying player:', error);
        }
      }
    };
  }, []);

  const startProgressTracking = () => {
    console.log('Starting progress tracking...');

    // Clear any existing interval
    stopProgressTracking();

    progressInterval.current = setInterval(() => {
      try {
        if (task.platform === 'youtube' && player) {
          const currentTime = player.getCurrentTime();
          const duration = player.getDuration();
          if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            console.log(
              'YouTube progress:',
              currentTime,
              '/',
              duration,
              '=',
              progressPercent + '%'
            );

            setProgress(progressPercent);
            setWatchTime(Math.floor(currentTime));
            if (progressPercent >= 100) {
              setIsComplete(true);
              setProgress(100);
              stopProgressTracking();
            }
          }
        } else if (task.platform !== 'youtube' && videoRef.current) {
          const video = videoRef.current;
          const currentTime = video.currentTime;
          const duration = video.duration;

          if (duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            console.log(
              'HTML5 video progress:',
              currentTime,
              '/',
              duration,
              '=',
              progressPercent + '%'
            );
            setProgress(progressPercent);
            setWatchTime(Math.floor(currentTime));
            if (progressPercent >= 100) {
              setIsComplete(true);
              setProgress(100);
              stopProgressTracking();
            }
          }
        }
      } catch (error) {
        console.error('Error in progress tracking:', error);
        stopProgressTracking();
      }
    }, 500); // Update every 500ms for smoother progress
  };

  const stopProgressTracking = () => {
    console.log('Stopping progress tracking...');
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const handlePlay = () => {
    console.log('Play button clicked');
    if (task.platform === 'youtube' && player) {
      player.playVideo();
      setIsPlaying(true);
    } else if (task.platform !== 'youtube' && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    console.log('Pause button clicked');
    if (task.platform === 'youtube' && player) {
      player.pauseVideo();
      setIsPlaying(false);
    } else if (task.platform !== 'youtube' && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendTimestamps = () => {
    console.log('Send timestamps clicked');

    setShowTimestampModal(true);
  };

  const handleSubmitTimestamps = () => {
    // Calculate video length and create timestamp report
    const reportData = {
      taskId: task.id,
      taskTitle: task.title,
      platform: task.platform,
      videoLength: totalDuration,
      progressPercentage: progress,
      selectedTimestamps: selectedTimestamps,
      totalDuration: totalDuration,
      watchTime: watchTime,
      submittedAt: new Date().toISOString(),
    };

    console.log('Submitting timestamps to admin:', reportData);

    // Show success notification
    addNotification(
      'Timestamps sent to admin successfully! Request submitted.',
      'success'
    );

    // Close modal and complete task
    setShowTimestampModal(false);
    completeTask(task.id);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const toggleTimestamp = (timestamp: number) => {
    setSelectedTimestamps((prev) => {
      if (prev.includes(timestamp)) {
        return prev.filter((t) => t !== timestamp);
      } else {
        return [...prev, timestamp];
      }
    });
  };

  // Generate timestamp options based on video length
  const generateTimestamps = () => {
    if (totalDuration === 0) return [];

    const timestamps = [];
    const interval = Math.ceil(totalDuration / 10); // Divide video into 10 parts

    for (let i = interval; i < totalDuration; i += interval) {
      timestamps.push(Math.min(i, totalDuration - 1));
    }

    return timestamps.slice(0, 8); // Return max 8 timestamps
  };

  // Handle HTML5 video events
  const handleVideoPlay = () => {
    console.log('HTML5 video playing');
    setIsPlaying(true);
    startProgressTracking();
  };
  const handleVideoPause = () => {
    console.log('HTML5 video paused');
    setIsPlaying(false);
    stopProgressTracking();
  };

  const handleVideoEnded = () => {
    console.log('HTML5 video ended');
    setIsPlaying(false);
    setIsComplete(true);
    setProgress(100);
    stopProgressTracking();
  };

  const handleVideoLoadedMetadata = (
    e: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = e.target as HTMLVideoElement;
    console.log('HTML5 video metadata loaded:', video.duration);
    setTotalDuration(video.duration);
  };

  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.target as HTMLVideoElement;
    if (video.duration > 0) {
      const progressPercent = (video.currentTime / video.duration) * 100;
      setProgress(progressPercent);
      setWatchTime(Math.floor(video.currentTime));
    }
  };

  // Timestamp Modal Inner Component
  const TimestampModal = () => (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
      <DashboardGlassCard className="w-full max-w-md p-8 relative">
        <button
          onClick={() => setShowTimestampModal(false)}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-div-to-r from-amber-500/20 to-yellow-500/20 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Submit Timestamps
          </h2>
          <p className="text-zinc-400">Select timestamps from the video</p>
        </div>

        <div className="space-y-6">
          <DashboardGlassCard className="p-6">
            <h4 className="font-bold text-white mb-4">Video Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-zinc-400">Video Length:</span>
                <span className="text-white font-medium">
                  {formatTime(totalDuration)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Watched:</span>
                <span className="text-white font-medium">
                  {formatTime(watchTime)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Completion:</span>
                <span className="text-amber-400 font-bold">
                  {progress.toFixed(1)}%
                </span>
              </div>
            </div>
          </DashboardGlassCard>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-4">
              Select timestamps (optional):
            </label>
            <div className="grid grid-cols-2 gap-3">
              {generateTimestamps().map((timestamp, index) => (
                <button
                  key={index}
                  onClick={() => toggleTimestamp(timestamp)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedTimestamps.includes(timestamp)
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {formatTime(timestamp)}
                    </div>
                    <div className="text-xs text-zinc-400 mt-1">
                      {Math.round((timestamp / totalDuration) * 100)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setShowTimestampModal(false)}
              className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <MagneticButton onClick={handleSubmitTimestamps} className="flex-1">
              <Send size={16} /> Send Timestamps
            </MagneticButton>
          </div>
        </div>
      </DashboardGlassCard>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm">
      <DashboardGlassCard className="w-full max-w-4xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-lg z-10"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            {task.platform === 'youtube' && (
              <Youtube size={24} className="text-red-600" />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {task.title}
              </h2>
              <p className="text-zinc-400">{task.desc}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Coins size={20} className="text-amber-400" />
              <span className="text-xl font-bold text-amber-400">
                +{task.coins}
              </span>
            </div>
          </div>
        </div>

        <div className="aspect-video bg-black rounded-xl mb-6 overflow-hidden relative">
          {task.platform === 'youtube' ? (
            <div
              id="youtube-player"
              className="w-full h-full"
              style={{ minHeight: '400px' }}
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                id="html5-video-player"
                className="w-full h-full object-cover"
                controls={false}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoadedMetadata}
                onTimeUpdate={handleVideoTimeUpdate}
              >
                <source
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                  type="video/mp4"
                />
              </video>
              {!isPlaying && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <button
                    onClick={handlePlay}
                    className="w-20 h-20 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play size={32} className="text-white ml-2" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Custom Controls */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-4">
              <button
                onClick={isPlaying ? handlePause : handlePlay}
                className="w-12 h-12 rounded-full bg-div-to-r from-amber-500 to-yellow-500 flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-white" />
                ) : (
                  <Play size={20} className="text-white ml-1" />
                )}
              </button>
              <div className="flex-1">
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <span>{formatTime(watchTime)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-div-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress and Controls */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-zinc-400">Watch Progress</span>
              <span className="text-sm text-zinc-500">
                {formatTime(watchTime)} /{' '}
                {totalDuration > 0 ? formatTime(totalDuration) : '0:00'}
              </span>
            </div>
            <span className="text-2xl font-bold text-amber-400">
              {progress.toFixed(1)}%
            </span>
          </div>

          {/* Control buttons */}
          <div className="flex gap-4">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={task.platform === 'youtube' && !player}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                isPlaying
                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause size={16} /> Pause Video
                </>
              ) : (
                <>
                  <Play size={16} /> Play Video
                </>
              )}
            </button>
            <div className="flex-1" />

            {/* Send Timestamps Button - Only when video is 100% complete */}
            {isComplete ? (
              <MagneticButton onClick={handleSendTimestamps} className="px-8!">
                <span className="flex items-center gap-2">
                  <Send size={16} /> Send Timestamps
                </span>
              </MagneticButton>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-zinc-800 text-zinc-600 rounded-xl font-medium cursor-not-allowed"
              >
                Complete ({progress.toFixed(0)}%)
              </button>
            )}
          </div>

          {/* Status Messages */}
          {progress > 0 && !isComplete && (
            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-amber-400" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">
                    Video in progress
                  </p>
                  <p className="text-xs text-zinc-400">
                    Watch the video completely to earn {task.coins} coins.
                    {progress < 50 ? ' Keep watching!' : ' Almost there!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-emerald-400" />
                <div>
                  <p className="text-sm text-emerald-300 font-medium">
                    Video watched completely!
                  </p>
                  <p className="text-xs text-zinc-400">
                    Click "Send Timestamps" to submit your watch report and
                    claim {task.coins} coins.
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Instructions */}
          <div className="p-4 bg-white/5 rounded-xl">
            <h4 className="font-medium text-white mb-2 flex items-center gap-2">
              <Info size={16} className="text-blue-400" />
              How to earn coins:
            </h4>
            <ul className="text-sm text-zinc-400 space-y-1">
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Click "Play Video" button to start watching
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Watch the video completely until progress reaches 100%
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Once 100% complete, "Send Timestamps" button will appear
              </li>
              <li className="flex items-center gap-2">
                <Check size={12} className="text-green-400" />
                Click "Send Timestamps" to submit watch report and claim coins
              </li>
            </ul>
          </div>
        </div>
      </DashboardGlassCard>
      {showTimestampModal && <TimestampModal />}
    </div>
  );
};
