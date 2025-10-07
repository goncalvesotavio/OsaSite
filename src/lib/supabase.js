import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://otdjefkytvewwvwcaeog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90ZGplZmt5dHZld3d2d2NhZW9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDA0MjQsImV4cCI6MjA2MTcxNjQyNH0.v4JitHc3ZrUELeWeq-HcSUumEqCnYe5ssLB8CGbkgQM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 