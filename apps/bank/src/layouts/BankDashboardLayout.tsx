import { Link, Outlet } from 'react-router-dom';

export function BankDashboardLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl px-8 sm:px-14 lg:px-20 xl:px-24 py-2">
          <Link to="/dashboard">
            <h1 className="text-2xl font-bold text-gray-900">Bank Dashboard</h1>
          </Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
