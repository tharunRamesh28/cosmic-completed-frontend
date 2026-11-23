import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ilqfbstfjamdpquqgtjo.supabase.co';
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_MxuY-T-7YKeFjDcn5a5D8Q_bjpiCoTN';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const AUTHORIZED_ADMIN_UUID = '3f50b8c1-ccfa-4da9-885d-c4e0f61430dc';
export const AUTHORIZED_ADMIN_EMAIL = 'zentechsolutionss@gmail.com';

export function isAuthorizedAdmin(user: { id?: string | null; email?: string | null } | null | undefined): boolean {
  if (!user) return false;
  if (user.id === AUTHORIZED_ADMIN_UUID) return true;
  if (user.email && user.email.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase()) return true;
  return false;
}

export interface ProjectSubmission {
  id: string;
  user_id?: string | null;
  client_name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_name: string;
  project_type: string;
  project_description: string;
  expected_timeline: string | null;
  status: 'new' | 'reviewing' | 'contacted' | 'in_progress' | 'completed' | 'rejected' | 'accepted';

  created_at: string;
}

export interface ProjectFile {
  id: string;
  submission_id: string;
  file_name: string;
  storage_path: string;
  file_size: number | null;
  file_type: string | null;
  created_at: string;
}

export interface ProjectMessage {
  id: string;
  project_id: string;
  sender_id?: string | null;
  sender_role: 'USER' | 'ADMIN' | 'SYSTEM';
  message: string;
  is_read: boolean;
  created_at: string;
  expires_at?: string;
}

export interface CustomerReview {
  id: string;
  customer_name: string;
  rating: number;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
