// Mock Supabase client for development without external dependencies
export function createClient() {
  const createQueryBuilder = (table: string) => {
    const queryBuilder = {
      select: (columns?: string) => queryBuilder,
      eq: (column: string, value: any) => queryBuilder,
      lt: (column: string, value: any) => queryBuilder,
      gt: (column: string, value: any) => queryBuilder,
      order: (column: string, options?: any) => queryBuilder,
      limit: (count: number) => queryBuilder,
      single: async () => ({ data: null, error: null }),
      then: async (resolve: any) => resolve({ data: [], error: null }),
      // Make it thenable so it works with async/await
      catch: (reject: any) => Promise.resolve({ data: [], error: null }),
    }
    return queryBuilder
  }

  return {
    auth: {
      signUp: async (credentials: any) => ({ data: null, error: null }),
      signInWithPassword: async (credentials: any) => ({ data: null, error: null }),
      signInWithOAuth: async (options: { provider: string; options?: any }) => {
        // Mock OAuth flow - in production this would redirect to provider
        console.log(`[v0] Mock OAuth login with ${options.provider}`)
        // Simulate successful OAuth by setting a mock cookie
        if (typeof document !== "undefined") {
          document.cookie = "sb-access-token=mock-token; path=/; max-age=3600"
        }
        return { data: null, error: null }
      },
      signOut: async () => {
        if (typeof document !== "undefined") {
          document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        }
        return { error: null }
      },
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: (table: string) => createQueryBuilder(table),
  }
}
