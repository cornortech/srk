import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock, DollarSign, CheckCircle, X } from 'lucide-react';
import { TaskVerification } from '../types';
import { RejectionModal } from '../components/modals/RejectionModal';
import { GoldButton } from '../components/ui/GoldButton';
import { CARD_BG, GOLD_PRIMARY } from '../constants/theme';

interface TaskVerificationContentProps {
  initialData: TaskVerification[];
}

export const TaskVerificationContent: React.FC<
  TaskVerificationContentProps
> = ({ initialData }) => {
  const [pendingTasks, setPendingTasks] =
    useState<TaskVerification[]>(initialData);
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    taskId: number | null;
    taskName: string;
    username: string;
  }>({
    isOpen: false,
    taskId: null,
    taskName: '',
    username: '',
  });

  const handleVerify = useCallback(
    (taskId: number, status: 'Approved' | 'Rejected') => {
      if (status === 'Approved') {
        console.log(`Task ID ${taskId} Approved. Points granted.`);
        setPendingTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
      } else {
        const taskToReject = pendingTasks.find((task) => task.id === taskId);
        if (taskToReject) {
          setRejectionModal({
            isOpen: true,
            taskId,
            taskName: taskToReject.taskName,
            username: taskToReject.username,
          });
        }
      }
    },
    [pendingTasks]
  );

  const handleConfirmRejection = useCallback(
    (reason: string) => {
      if (rejectionModal.taskId) {
        console.log(
          `Task ID ${rejectionModal.taskId} Rejected. Reason: ${reason}`
        );
        setPendingTasks((prevTasks) =>
          prevTasks.filter((task) => task.id !== rejectionModal.taskId)
        );

        const rejectedTask = initialData.find(
          (task) => task.id === rejectionModal.taskId
        );
        if (rejectedTask) {
          console.log('Rejection Details:', {
            taskId: rejectedTask.id,
            userId: rejectedTask.userId,
            username: rejectedTask.username,
            taskName: rejectedTask.taskName,
            points: rejectedTask.points,
            rejectionReason: reason,
            rejectedAt: new Date().toISOString(),
          });
        }
      }

      setRejectionModal({
        isOpen: false,
        taskId: null,
        taskName: '',
        username: '',
      });
    },
    [rejectionModal.taskId, initialData]
  );

  const handleCloseRejectionModal = useCallback(() => {
    setRejectionModal({
      isOpen: false,
      taskId: null,
      taskName: '',
      username: '',
    });
  }, []);

  if (pendingTasks.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        All task submissions have been verified.
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white border-b border-[#E1BA73]/30 pb-2 flex items-center gap-2">
          <Clock size={24} className="text-[#E1BA73]" /> Pending Task Reviews (
          {pendingTasks.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-xl border border-gray-700/50 shadow-xl"
              style={{ background: CARD_BG }}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {task.taskName}
                  </h3>
                  <p className="text-sm text-gray-400">
                    Submitted by:{' '}
                    <span className="font-semibold text-[#E1BA73]">
                      {task.username}
                    </span>
                  </p>
                </div>
                <span
                  className="text-xl font-extrabold flex items-center gap-1"
                  style={{ color: GOLD_PRIMARY }}
                >
                  <DollarSign size={18} /> {task.points}
                </span>
              </div>

              <div className="text-xs text-gray-500 mb-4 space-y-2">
                <p>
                  Submission Time:{' '}
                  <span className="text-white">{task.submittedAt}</span>
                </p>
                <a
                  href={task.proofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline font-medium"
                >
                  View Submitted Proof (Link/Screenshot)
                </a>
              </div>

              <div className="flex gap-4 mt-4">
                <GoldButton
                  onClick={() => handleVerify(task.id, 'Approved')}
                  className="flex-1 px-4 py-2 text-sm uppercase"
                >
                  <CheckCircle size={16} className="inline mr-2" /> Approve
                </GoldButton>
                <motion.button
                  onClick={() => handleVerify(task.id, 'Rejected')}
                  className="flex-1 px-4 py-2 text-sm uppercase rounded-xl bg-red-800/50 text-red-400 font-bold hover:bg-red-800/70 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <X size={16} /> Reject
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <RejectionModal
        isOpen={rejectionModal.isOpen}
        onClose={handleCloseRejectionModal}
        onConfirm={handleConfirmRejection}
        taskName={rejectionModal.taskName}
        username={rejectionModal.username}
      />
    </>
  );
};
