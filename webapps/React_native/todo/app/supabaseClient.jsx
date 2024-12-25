import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://dxykkpwmbsrnydmwjhqy.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4eWtrcHdtYnNybnlkbXdqaHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NDE1NzksImV4cCI6MjA0OTExNzU3OX0.tBtlm23lhr7iA9Vzfs2wcVBIX4QDtjBvQd6ibkIYv0E",
{
  auth: {
    persistSession: true,
  },
});
export default supabase;