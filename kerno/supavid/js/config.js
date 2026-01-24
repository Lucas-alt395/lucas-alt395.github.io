// js/config.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// Replace these with your actual project details from:
// Settings -> API in your Supabase Dashboard
const supabaseUrl = 'https://xnvhixwirbpofdkyhtvf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhudmhpeHdpcmJwb2Zka3lodHZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyMzE0NzgsImV4cCI6MjA4MzgwNzQ3OH0.gg6cLfx1PrGTNKztWSqDy3U9W66mNCu6ln5WDDLpyVo';

// This is the "bridge" instance of Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
