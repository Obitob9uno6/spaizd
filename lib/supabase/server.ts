// Mock server Supabase client for development
export function createClient() {
  const createQueryBuilder = () => {
    const queryBuilder = {
      data: [],
      error: null,
      eq: (column: string, value: any) => queryBuilder,
      lt: (column: string, value: any) => queryBuilder,
      gt: (column: string, value: any) => queryBuilder,
      order: (column: string, options?: any) => queryBuilder,
      limit: (count: number) => queryBuilder,
      single: async () => ({ data: null, error: null }),
      then: async (resolve: any) => resolve({ data: [], error: null }),
    }
    return queryBuilder
  }

  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: (table: string) => ({
      select: (columns?: string) => createQueryBuilder(),
      insert: (values: any) => ({
        select: () => createQueryBuilder(),
      }),
      update: (values: any) => ({
        eq: (column: string, value: any) => createQueryBuilder(),
      }),
      delete: () => ({
        eq: (column: string, value: any) => createQueryBuilder(),
      }),
    }),
  }
}
