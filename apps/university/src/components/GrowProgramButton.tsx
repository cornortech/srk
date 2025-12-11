import { Button } from '@nextui-org/react';
import { toast } from 'sonner';
import useGrowSSO from '../../../../libs/shared/hooks/src/lib/useGrowSSO'

interface GrowProgramButtonProps {
  className?: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button to redirect user to Grow Program via SSO
 * Place this in the university dashboard where users can access the Grow app
 */
const GrowProgramButton = ({ 
  className = '', 
  variant = 'solid',
  size = 'md'
}: GrowProgramButtonProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_ROOT_URL || 'http://localhost:4000';
  
  const { redirectToGrowProgram, isLoading, error } = useGrowSSO({
    backendUrl,
  });

  const handleClick = async () => {
    try {
      await redirectToGrowProgram();
    } catch (err) {
      toast.error('Failed to redirect to Grow Program');
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
      {isLoading ? 'Redirecting...' : '🎯 Go to Grow Program'}
    </Button>
  );
};

export default GrowProgramButton;
