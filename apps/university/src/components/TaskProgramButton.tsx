import { Button } from '@nextui-org/react';
import { useTaskSSO } from '@srk/shared/hooks';
import { toast } from 'sonner';

interface TaskProgramButtonProps {
  className?: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button to redirect user to Task Program via SSO
 * Place this in the university dashboard where users can access the task app
 */
const TaskProgramButton = ({ 
  className = '', 
  variant = 'solid',
  size = 'md'
}: TaskProgramButtonProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_ROOT_URL || 'http://localhost:4000';
  
  const { redirectToTaskProgram, isLoading, error } = useTaskSSO({
    backendUrl,
  });

  const handleClick = async () => {
    try {
      await redirectToTaskProgram();
    } catch (err) {
      toast.error('Failed to redirect to Task Program');
    }
  };

  // Show error toast if there's an error
  if (error) {
    toast.error(error);
  }

  return (
    <Button
      color="warning"
      variant={variant}
      size={size}
      className={className}
      isLoading={isLoading}
      onClick={handleClick}
    >
      {isLoading ? 'Redirecting...' : '🎯 Go to Task Program'}
    </Button>
  );
};

export default TaskProgramButton;
