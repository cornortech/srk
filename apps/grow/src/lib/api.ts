import { initClient } from '@ts-rest/core';
import { apiContract } from '@srk/shared/contracts';

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// ==========================================
// ts-rest Client Setup
// ==========================================
// 
// APPROACH 1 (CURRENT): Core Client Only
// ✓ Simple and straightforward
// ✓ Works with async/await
// ✓ Manual error handling
// ✓ No React Query overhead
//
// const api = initClient(apiContract, {...})
// const response = await api.package.getAllSrkGrowPackages()
//
// APPROACH 2 (RECOMMENDED FOR REACT QUERY):
// Use initQueryClient AFTER creating core client:
//
// import { initQueryClient } from '@ts-rest/react-query'
// import { QueryClient } from '@tanstack/react-query'
//
// const client = initClient(apiContract, {...})
// const queryClient = new QueryClient()
// const api = initQueryClient(client, { queryClient })
//
// Then use React Query hooks:
// const { data, isLoading } = api.package.getAllSrkGrowPackages.useQuery([])
//
// WHY IT FAILED BEFORE:
// - initQueryClient expects: (client, options) NOT (contract, options)
// - Must pass core client as first arg, NOT the contract directly
// - Second arg must be { queryClient }, NOT the QueryClient instance
//
// ==========================================

// Create the core client with proper fetch handler
export const api = initClient(apiContract, {
  baseUrl,
  baseHeaders: {},
  fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
    const response = await fetch(input, {
      ...init,
      credentials: 'include',
    });
    return response;
  },
});
