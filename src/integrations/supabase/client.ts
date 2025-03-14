
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://evxjgffblzrdwthgfjou.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2eGpnZmZibHpyZHd0aGdmam91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNTI0OTIsImV4cCI6MjA1NjgyODQ5Mn0.LTSWbl_OadObkDixmsYTLiGuHDEmrE_Odj5YlTJ_vRA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    realtime: {
      params: {
        eventsPerSecond: 20,  // Increased from 10 to handle more events
        fastStart: true       // For more responsive initial setup
      }
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    },
    db: {
      schema: 'public'
    },
    global: {
      fetch: (url, options) => {
        // Add retries for network resilience
        return fetch(url, options).catch(error => {
          console.error('Supabase fetch error:', error);
          // Try once more after short delay
          return new Promise(resolve => setTimeout(resolve, 1000))
            .then(() => fetch(url, options));
        });
      },
      headers: {
        'X-Client-Info': 'feelgroove-app'
      }
    }
  }
);
