import { Button, Spinner } from '@nextui-org/react';
import { useTaskAuthStore } from '../../store/useTaskAuthStore';
import TaskCard from '../../components/ui/TaskCard';

/**
 * Task Dashboard Page
 * Main dashboard after successful SSO authentication
 */
export const MainDashboardPage = () => {
  const { user, isLoading } = useTaskAuthStore();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spinner size="lg" color="warning" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          gap: '1rem',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>You are not logged in.</p>
        <Button
          color="warning"
          onClick={() => (window.location.href = 'http://localhost:4200')}
        >
          Go to University to Login
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '100vh',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#b68938',
          }}
        >
          🎯 SRK Task Program
        </h1>
        <Button
          color="warning"
          variant="flat"
          onClick={() => {
            // Clear auth and redirect
            window.location.href = 'http://localhost:4200';
          }}
        >
          Back to University
        </Button>
      </header>

      <main>
        {/* User Info Card */}
        <div
          style={{
            background:
              'linear-gradient(135deg, rgba(182, 137, 56, 0.2), rgba(182, 137, 56, 0.05))',
            border: '1px solid rgba(182, 137, 56, 0.4)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #b68938, #d4a84b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#000',
            }}
          >
            {user?.firstName?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() ||
              '?'}
          </div>
          <div>
            <h2
              style={{
                fontSize: '1.5rem',
                marginBottom: '0.3rem',
                color: '#fff',
              }}
            >
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.firstName || 'User'}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '1rem',
                marginBottom: '0.3rem',
              }}
            >
              📧 {user?.email || 'No email'}
            </p>
            <p style={{ color: '#b68938', fontSize: '0.9rem' }}>
              🎭 Role: {user?.role || 'Unknown'}
            </p>
          </div>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <h2 style={{ marginBottom: '1rem', fontSize: '1.4rem' }}>
            Welcome to SRK Task Program! 🎉
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            You have been successfully authenticated via SSO from SRK
            University. This page demonstrates the multi-domain Single Sign-On
            working correctly.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <TaskCard
            title="📋 My Tasks"
            count={12}
            description="View and manage your assigned tasks"
          />
          <TaskCard
            title="✅ Completed"
            count={8}
            description="Tasks you've successfully completed"
          />
          <TaskCard
            title="⏳ Pending"
            count={4}
            description="Tasks waiting for your attention"
          />
          <TaskCard
            title="🏆 Rewards"
            count={150}
            description="Points earned from completed tasks"
          />
        </div>
      </main>
    </div>
  );
};
