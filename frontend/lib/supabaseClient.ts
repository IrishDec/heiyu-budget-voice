import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfayditefoslmyqoukun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmYXlkaXRlZm9zbG15cW91a3VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTgyNjAsImV4cCI6MjA3OTQ3NDI2MH0.M3c_zhd8XPhRAo09nqiOQRBq1z3ywnv3Y5R2lqDPYxY';

export const supabase = createClient(supabaseUrl, supabaseKey);