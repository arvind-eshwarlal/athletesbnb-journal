import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajhjoquhvaobmgrgldeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGpvcXVodmFvYm1ncmdsZGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzU2MzMsImV4cCI6MjA5MzMxMTYzM30.TKOsPqUN2chINB95_UQbMBhqa9YucUdNGkeNW0riTAw';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);