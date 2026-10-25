import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qjpewzauoajlkqknyxev.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqcGV3emF1b2FqbGtxa255eGV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4OTk0MzgsImV4cCI6MjEwODQ3NTQzOH0.H4ca8uok6v1WapAnRhAF0gIugddSZJQMXbxxCl9FKUo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);