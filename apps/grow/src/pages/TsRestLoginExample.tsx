import React, { useState } from 'react';
import { api } from '../lib/api';

export const TsRestLoginExample = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Define the mutation using the ts-rest client
  // 'auth' matches the contract group, 'login' matches the endpoint name
  const loginMutation = api.auth.login.useMutation();

  // 2. Example of a query (fetching current user)
  // The query key is automatically managed, but you can provide additional keys if needed
  const { data: userData, isLoading: isUserLoading, refetch } = api.auth.getMe.useQuery(
    ['getMe'], // Query Key
    { 
      retry: false,
      enabled: false // Don't run immediately for this example
    },
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 3. Execute the mutation
      // The 'body' is fully typed based on your Zod schema!
      const result = await loginMutation.mutateAsync({
        body: {
          email,
          password,
        },
      });

      // 4. Handle the response based on status code
      if (result.status === 200) {
        alert(`Login Successful! Welcome ${result.body.user.email}`);
        console.log('User Data:', result.body.user);
        
        // Refresh user data
        refetch();
      } else {
        // Handle known error statuses (401, 404, etc.)
        alert(`Login Failed: ${result.body.message}`);
      }
    } catch (error) {
      // Handle network errors or unexpected exceptions
      console.error('Network error:', error);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-900 text-white rounded-lg mt-10">
      <h2 className="text-2xl mb-4 font-bold text-[#b68938]">TS-Rest Login Example</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-[#b68938] outline-none"
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700 focus:border-[#b68938] outline-none"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-[#b68938] hover:bg-[#9a732f] text-white p-2 rounded transition-colors disabled:opacity-50"
        >
          {loginMutation.isPending ? 'Logging in...' : 'Login'}
        </button>

        {/* Error Message Display */}
        {loginMutation.error && (
          <div className="text-red-500 text-sm mt-2">
            Error: {loginMutation.error.message}
          </div>
        )}
      </form>

      {/* Display User Data if Logged In */}
      {userData?.status === 200 && (
        <div className="mt-8 p-4 bg-gray-800 rounded">
          <h3 className="text-lg font-semibold mb-2">Current User Session:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(userData.body, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
