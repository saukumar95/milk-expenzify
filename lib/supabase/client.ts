import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

let client: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!client) {
    // During static build, return a dummy client
    if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return {
        auth: {
          getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        },
      } as any
    }

    client = createClientComponentClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      isSingleton: true,
    })
  }
  return client
}
