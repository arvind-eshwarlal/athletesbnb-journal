import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ajhjoquhvaobmgrgldeg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGpvcXVodmFvYm1ncmdsZWciLCJyb2xlIjoiYW5vbiIsImlhdCI6MTcyNzMxNTk3NywiZXhwIjoxNzI3NDAwMDI3fQ.F2sNNc1-VzWRPxBzNfDdz5c_OsLDSKM8wbMVkFc_3w4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);