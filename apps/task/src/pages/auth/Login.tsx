import { Button } from '@nextui-org/react';

/**
 * Login Page for Task App
 * This page is shown when SSO fails or user tries to access directly
 */
export const Login = () => {
  const handleGoToUniversity = () => {
    // Redirect to university login
    window.location.href = 'http://localhost:4200/auth/login';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '3rem',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            marginBottom: '1rem',
            color: '#b68938',
          }}
        >
          🎯 SRK Task
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '2rem',
            lineHeight: '1.6',
          }}
        >
          To access SRK Task Program, please login through SRK University first.
          Your authentication will be automatically transferred.
        </p>

        <Button
          color="warning"
          size="lg"
          className="w-full"
          onClick={handleGoToUniversity}
        >
          Login via SRK University
        </Button>

        <p
          style={{
            marginTop: '1.5rem',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Multi-Domain SSO powered by SRK
        </p>
      </div>
    </div>
  );
};
