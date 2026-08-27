import { Button } from '@nextui-org/react';
import { useGrowSSO } from '@srk/shared/hooks';
import { toast } from 'sonner';

interface TaskSocialMediaButtonProps {
  className?: string;
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Button to redirect user to Task SocialMedia via SSO
 * Place this in the university dashboard where users can access the task app
 */
const GrowSocialMediaProgramButton = ({ 
  className = '', 
  variant = 'solid',
  size = 'md'
}: TaskSocialMediaButtonProps) => {
  const backendUrl = import.meta.env.VITE_BACKEND_ROOT_URL || 'http://localhost:4000';
  
  const { redirectToGrowSocialMediaProgram, isLoading, error } = useGrowSSO({
    backendUrl,
  });

  const handleClick = async () => {
    try {
      await redirectToGrowSocialMediaProgram();
    } catch (err) {
      toast.error('Failed to redirect to Grow SocialMedia');
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
      {isLoading ? 'Redirecting...' : '🎯 Go to Grow SocialMedia'}
    </Button>
  );
};

export default GrowSocialMediaProgramButton;
