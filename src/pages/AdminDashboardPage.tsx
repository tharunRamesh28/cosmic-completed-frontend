import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Shield,
  LogOut,
  Search,
  RefreshCw,
  FileText,
  Download,
  ExternalLink,
  X,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Calendar,
  Layers,
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  LayoutDashboard,
  FolderKanban,
  Settings as SettingsIcon,
  Menu,
  Star,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react';
import { supabase, ProjectSubmission, ProjectFile, CustomerReview } from '../lib/supabase';
import { useAdminAuth } from '../lib/useAdminAuth';
import { Link, useRouter } from '../router';

const STATUS_LABELS: Record<string, string> = {
  new: 'NEW',
  in_progress: 'IN PROGRESS',
  completed: 'COMPLETED',
  reviewing: 'REVIEWING',
  contacted: 'CONTACTED',
  rejected: 'REJECTED',
  accepted: 'ACCEPTED',
};

const STATUS_BADGE_CLASSES: Record<string, string> = {
  new: 'bg-[#daf396] text-[#365000] border border-[#bce866] font-bold shadow-[0_0_10px_rgba(200,241,121,0.3)]',
  in_progress: 'bg-neutral-900 text-white border border-neutral-700 font-bold',
  completed: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
  reviewing: 'bg-amber-50 text-amber-800 border border-amber-200',
  contacted: 'bg-sky-50 text-sky-800 border border-sky-200',
  rejected: 'bg-rose-50 text-rose-600 border border-rose-300 font-bold',
  accepted: 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold',
};

function formatFileSize(bytes: number | null): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}


        export const AdminDashboardPage: React.FC = () => {
  const { navigate } = useRouter();
  const { loading: authLoading, isAdmin, adminUser, signOut } = useAdminAuth(true);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'reviews' | 'messages' | 'settings'>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Submissions State
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Customer Reviews State
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);
  const [reviewFilterStatus, setReviewFilterStatus] = useState<'ALL' | 'pending' | 'approved' | 'rejected'>('ALL');
  const [reviewSearchQuery, setReviewSearchQuery] = useState<string>('');
  const [reviewActionLoading, setReviewActionLoading] = useState<string | null>(null);
  const [reviewActionMsg, setReviewActionMsg] = useState<string | null>(null);
  const [reviewActionError, setReviewActionError] = useState<string | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<CustomerReview | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Selected Project for Details Modal / Panel
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [loadingFiles, setLoadingFiles] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [editStatus, setEditStatus] = useState<string>('new');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // New Modals State
  const [projectToAccept, setProjectToAccept] = useState<ProjectSubmission | null>(null);
  const [projectToReject, setProjectToReject] = useState<ProjectSubmission | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectSubmission | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);


  // Fetch Submissions from Supabase
  const fetchSubmissions = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingData(true);
    setFetchError(null);

    try {
      const { data, error } = await supabase
        .from('project_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setFetchError(`Unable to sync project submissions: ${error.message}`);
      } else {
        setSubmissions((data as ProjectSubmission[]) || []);
      }
    } catch {
      setFetchError('Unexpected connection issue while syncing from Supabase.');
    } finally {
      setLoadingData(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin, fetchSubmissions]);

  // Fetch Customer Reviews from Supabase
  const fetchReviews = useCallback(async () => {
    if (!isAdmin) return;
    setLoadingReviews(true);
    setReviewsError(null);

    try {
      const { data, error } = await supabase
        .from('customer_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setReviewsError(`Unable to sync customer reviews: ${error.message}`);
      } else {
        setReviews((data as CustomerReview[]) || []);
      }
    } catch {
      setReviewsError('Unexpected connection issue while syncing customer reviews.');
    } finally {
      setLoadingReviews(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) {
      fetchReviews();
    }
  }, [isAdmin, fetchReviews]);

  // Customer Reviews Statistics
  const reviewStats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === 'pending').length;
    const approved = reviews.filter((r) => r.status === 'approved').length;
    const rejected = reviews.filter((r) => r.status === 'rejected').length;
    return {
      total,
      pending,
      approved,
      rejected,
    };
  }, [reviews]);

  // Review Actions
  const handleApproveReview = async (reviewId: string) => {
    setReviewActionLoading(reviewId);
    setReviewActionMsg(null);
    setReviewActionError(null);
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ status: 'approved' })
        .eq('id', reviewId);

      if (error) {
        setReviewActionError(`Failed to approve review: ${error.message}`);
      } else {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status: 'approved' } : r))
        );
        setReviewActionMsg('Review approved and published successfully.');
      }
    } catch (err: any) {
      setReviewActionError(`Error updating review status: ${err?.message || 'Connection error'}`);
    } finally {
      setReviewActionLoading(null);
    }
  };

  const handleRejectReview = async (reviewId: string) => {
    setReviewActionLoading(reviewId);
    setReviewActionMsg(null);
    setReviewActionError(null);
    try {
      const { error } = await supabase
        .from('customer_reviews')
        .update({ status: 'rejected' })
        .eq('id', reviewId);

      if (error) {
        setReviewActionError(`Failed to reject review: ${error.message}`);
      } else {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status: 'rejected' } : r))
        );
        setReviewActionMsg('Review marked as rejected.');
      }
    } catch (err: any) {
      setReviewActionError(`Error updating review status: ${err?.message || 'Connection error'}`);
    } finally {
      setReviewActionLoading(null);
    }
  };

  const handleDeleteReview = async () => {
    if (!reviewToDelete) return;
    const targetId = reviewToDelete.id;
    setReviewActionLoading(targetId);
    setReviewActionMsg(null);
    setReviewActionError(null);

    try {
      // Delete ONLY the selected review from the database using its unique review ID
      const { error } = await supabase
        .from('customer_reviews')
        .delete()
        .eq('id', targetId);

      if (error) {
        // Keep the review visible and display an appropriate error message
        setReviewActionError(`Failed to delete review: ${error.message}`);
      } else {
        // Immediately remove that review from the admin dashboard without refreshing the entire page
        setReviews((prev) => prev.filter((r) => r.id !== targetId));
        setReviewActionMsg('Review was permanently deleted successfully.');
      }
    } catch (err: any) {
      setReviewActionError(
        `Unexpected error while deleting review: ${err?.message || 'Please check your connection'}`
      );
    } finally {
      setReviewToDelete(null);
      setReviewActionLoading(null);
    }
  };

  // Filtered Customer Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      if (reviewFilterStatus !== 'ALL' && item.status !== reviewFilterStatus) {
        return false;
      }
      if (reviewSearchQuery.trim() !== '') {
        const query = reviewSearchQuery.toLowerCase();
        const matchesName = item.customer_name?.toLowerCase().includes(query);
        const matchesText = item.review_text?.toLowerCase().includes(query);
        if (!matchesName && !matchesText) {
          return false;
        }
      }
      return true;
    });
  }, [reviews, reviewFilterStatus, reviewSearchQuery]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = submissions.length;
    const newCount = submissions.filter((s) => s.status === 'new').length;
    const inProgressCount = submissions.filter(
      (s) => s.status === 'in_progress' || s.status === 'reviewing' || s.status === 'contacted'
    ).length;
    const completedCount = submissions.filter((s) => s.status === 'completed').length;
    return {
      total,
      new: newCount,
      inProgress: inProgressCount,
      completed: completedCount,
    };
  }, [submissions]);

  // Fetch Files for Selected Project
  const fetchProjectFiles = useCallback(async (submissionId: string) => {
    setLoadingFiles(true);
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('submission_id', submissionId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setProjectFiles(data as ProjectFile[]);
      } else {
        setProjectFiles([]);
      }
    } catch {
      setProjectFiles([]);
    } finally {
      setLoadingFiles(false);
    }
  }, []);

  const openProjectDetails = (project: ProjectSubmission) => {
    setSelectedProject(project);
    setEditStatus(project.status || 'new');
    setActionMessage(null);
    fetchProjectFiles(project.id);
  };

  const closeProjectDetails = () => {
    setSelectedProject(null);
    setProjectFiles([]);
    setActionMessage(null);
  };

  // Action Handlers
  const handleAcceptProject = async () => {
    if (!projectToAccept) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ status: 'accepted' })
        .eq('id', projectToAccept.id);
      if (!error) {
        setSubmissions(prev => prev.map(p => p.id === projectToAccept.id ? { ...p, status: 'accepted' as any } : p));
        setProjectToAccept(null);
      } else {
        alert('Failed to accept project: ' + error.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectProject = async () => {
    if (!projectToReject) return;
    setActionLoading(true);
    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ status: 'rejected' })
        .eq('id', projectToReject.id);
      if (!error) {
        setSubmissions(prev => prev.map(p => p.id === projectToReject.id ? { ...p, status: 'rejected' as any } : p));
        setProjectToReject(null);
        setRejectionReason('');
      } else {
        alert('Failed to reject project: ' + error.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    setActionLoading(true);
    try {
      // Step 3 & 4: Call Secure RPC for deletion
      const { data, error } = await supabase.rpc('admin_delete_rejected_project', {
        p_project_id: projectToDelete.id
      });
      
      if (error) {
        console.error('Supabase RPC Error:', error);
        alert('Unable to permanently delete the project.\n' + error.message);
      } else {
        // Evaluate RPC response
        if (data.success === true) {
          // Step 6 & 7: Verify deletion by refetching from the real database
          await fetchSubmissions();
          setProjectToDelete(null);
          alert(data.message || 'Project deleted successfully.');
        } else {
          // It failed safely on the backend for a specific reason
          console.warn('Backend rejected deletion:', data.error, data.message);
          alert(data.message || 'Unable to permanently delete the project.');
        }
      }
    } catch (err: any) {
      console.error('Unexpected Delete Error:', err);
      alert('An unexpected error occurred during deletion.');
    } finally {
      setActionLoading(false);
    }
  };


  // Status Updater
  const handleStatusChange = async () => {
    if (!selectedProject) return;
    setUpdatingStatus(true);
    setActionMessage(null);

    try {
      const { error } = await supabase
        .from('project_submissions')
        .update({ status: editStatus })
        .eq('id', selectedProject.id);

      if (error) {
        setActionMessage(`Error updating status: ${error.message}`);
      } else {
        const updated = { ...selectedProject, status: editStatus as any };
        setSelectedProject(updated);
        setSubmissions((prev) =>
          prev.map((item) => (item.id === selectedProject.id ? updated : item))
        );
        setActionMessage(`Status successfully updated to "${STATUS_LABELS[editStatus] || editStatus}".`);
      }
    } catch {
      setActionMessage('Failed to connect and update status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Secure File Download via signed URL (valid 5 min)
  const handleDownloadFile = async (file: ProjectFile) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .createSignedUrl(file.storage_path, 300);

      if (error || !data?.signedUrl) {
        alert(`Failed to create secure download link: ${error?.message || 'Access denied'}`);
        return;
      }

      window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
    } catch {
      alert('Error initiating file download.');
    }
  };

  // Filtered Submissions
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((item) => {
      if (filterType !== 'ALL' && item.project_type !== filterType) {
        return false;
      }
      if (filterStatus !== 'ALL') {
        if (filterStatus === 'new' && item.status !== 'new') return false;
        if (filterStatus === 'in_progress' && item.status !== 'in_progress' && item.status !== 'reviewing' && item.status !== 'contacted') return false;
        if (filterStatus === 'completed' && item.status !== 'completed') return false;
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesProject = item.project_name?.toLowerCase().includes(query);
        const matchesClient = item.client_name?.toLowerCase().includes(query);
        const matchesEmail = item.email?.toLowerCase().includes(query);
        const matchesCompany = item.company?.toLowerCase().includes(query);

        if (!matchesProject && !matchesClient && !matchesEmail && !matchesCompany) {
          return false;
        }
      }
      return true;
    });
  }, [submissions, filterType, filterStatus, searchQuery]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono-tech text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span>INITIALIZING ADMIN ACCESS...</span>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f9faf7] text-[#191c1b] selection:bg-[#c8f179] selection:text-[#000000] flex font-display-tech">
      {/* =========================================================================
          LEFT SIDEBAR (DESKTOP)
         ========================================================================= */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-[#c4c7c7]/60 flex-col justify-between shrink-0 sticky top-0 h-screen z-30 shadow-xs">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-[#c4c7c7]/40 flex items-center gap-2.5">
            <Link to="/" className="flex items-center gap-2 hover:opacity-85">
              <img 
                src="/zen_tech_icon.jpg" 
                alt="Zen Tech Solutions" 
                className="w-7 h-7 object-contain rounded-md shrink-0"
              />
              <img
                src="/zen_tech_wordmark.png"
                alt="ZEN TECH SOLUTIONS"
                className="h-6 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 font-mono-tech text-xs">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                closeProjectDetails();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#f3f4f1]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#c8f179]" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('projects');
                closeProjectDetails();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#f3f4f1]'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderKanban className="w-4 h-4 text-[#c8f179]" />
                <span>Projects</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#daf396] text-[#365000] font-bold">
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('reviews');
                closeProjectDetails();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#f3f4f1]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Star className="w-4 h-4 text-[#c8f179]" />
                <span>Customer Reviews</span>
              </div>
              {reviewStats.pending > 0 ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold border border-amber-300">
                  {reviewStats.pending}
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#f3f4f1] text-neutral-600 font-bold">
                  {reviews.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('messages');
                closeProjectDetails();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#f3f4f1]'
              }`}
            >
              <FolderKanban className="w-4 h-4 text-neutral-400" />
              <span>Messages / Inquiries</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                closeProjectDetails();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-bold transition-all text-left cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-600 hover:text-black hover:bg-[#f3f4f1]'
              }`}
            >
              <SettingsIcon className="w-4 h-4 text-neutral-400" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Admin Profile & Sign Out */}
        <div className="p-4 border-t border-[#c4c7c7]/50 space-y-3 bg-[#fbfcf9]">
          <div className="flex items-center gap-3">
            {adminUser?.user_metadata?.avatar_url ? (
              <img
                src={adminUser.user_metadata.avatar_url}
                alt="Admin Avatar"
                className="w-9 h-9 rounded-lg border border-[#c8f179]/70 object-cover shadow-2xs"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg border border-[#c4c7c7] bg-white text-black font-bold flex items-center justify-center font-mono-tech text-xs">
                A
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-bold text-xs text-black truncate">
                {adminUser?.user_metadata?.full_name || 'Administrator'}
              </div>
              <div className="font-mono-tech text-[10px] text-neutral-400 truncate">
                {adminUser?.email || 'admin@zentechsolutions.com'}
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#c4c7c7] bg-white hover:border-black text-neutral-700 hover:text-black font-mono-tech text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>SIGN OUT</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          MOBILE SIDEBAR OVERLAY
         ========================================================================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-64 bg-white border-r border-[#c4c7c7] flex flex-col justify-between p-4 z-10 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#c4c7c7]/50 mb-4">
                <div className="flex items-center gap-2">
                  <img 
                    src="/zen_tech_icon.jpg" 
                    alt="Zen Tech Solutions" 
                    className="w-6 h-6 object-contain rounded-md shrink-0"
                  />
                  <img
                    src="/zen_tech_wordmark.png"
                    alt="ZEN TECH SOLUTIONS"
                    className="h-5 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 rounded-md text-neutral-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 font-mono-tech text-xs">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setIsMobileSidebarOpen(false);
                    closeProjectDetails();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-left ${
                    activeTab === 'dashboard' ? 'bg-black text-white' : 'text-neutral-600'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-[#c8f179]" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setIsMobileSidebarOpen(false);
                    closeProjectDetails();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-left ${
                    activeTab === 'projects' ? 'bg-black text-white' : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-4 h-4 text-[#c8f179]" />
                    <span>Projects</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#daf396] text-[#365000] font-bold">
                    {submissions.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('reviews');
                    setIsMobileSidebarOpen(false);
                    closeProjectDetails();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold text-left ${
                    activeTab === 'reviews' ? 'bg-black text-white' : 'text-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-[#c8f179]" />
                    <span>Customer Reviews</span>
                  </div>
                  {reviewStats.pending > 0 ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                      {reviewStats.pending}
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#daf396] text-[#365000] font-bold">
                      {reviews.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('messages');
                    setIsMobileSidebarOpen(false);
                    closeProjectDetails();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-left ${
                    activeTab === 'messages' ? 'bg-black text-white' : 'text-neutral-600'
                  }`}
                >
                  <FolderKanban className="w-4 h-4" />
                  <span>Messages</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsMobileSidebarOpen(false);
                    closeProjectDetails();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-bold text-left ${
                    activeTab === 'settings' ? 'bg-black text-white' : 'text-neutral-600'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#c4c7c7]/50 space-y-3">
              <button
                onClick={signOut}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-black bg-black text-white font-mono-tech text-xs font-bold"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>SIGN OUT</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN APPLICATION AREA
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP HEADER */}
        <header className="bg-white border-b border-[#c4c7c7]/60 sticky top-0 z-20 shadow-2xs">
          <div className="px-4 sm:px-8 py-3.5 flex items-center justify-between">
            {/* Left: Mobile Toggle & Header Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg border border-[#c4c7c7] text-neutral-700 hover:text-black cursor-pointer"
                aria-label="Open sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-black">
                    ADMIN CONTROL CENTER
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f4fbe9] border border-[#c8f179] text-[#2e4700] font-mono-tech text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#476800] animate-pulse" />
                    <span>ADMIN ACCESS</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Site link, Refresh, Profile Avatar & Sign Out */}
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="font-mono-tech text-xs text-neutral-600 hover:text-black transition-colors hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-[#f3f4f1]"
              >
                <span>MAIN WEBSITE</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                onClick={() => {
                  fetchSubmissions();
                  fetchReviews();
                }}
                disabled={loadingData || loadingReviews}
                title="Sync submissions and reviews"
                className="p-2 rounded-lg border border-[#c4c7c7] text-neutral-600 hover:text-black hover:border-black transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData || loadingReviews ? 'animate-spin' : ''}`} />
              </button>

              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[#c4c7c7]/40">
                {adminUser?.user_metadata?.avatar_url ? (
                  <img
                    src={adminUser.user_metadata.avatar_url}
                    alt="Admin"
                    className="w-7 h-7 rounded-md border border-[#c8f179]/80 object-cover shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-md border border-[#c4c7c7] bg-[#f9faf7] text-black font-bold flex items-center justify-center font-mono-tech text-[10px]">
                    A
                  </div>
                )}
                <span className="font-mono-tech text-xs font-semibold text-neutral-700 max-w-[140px] truncate">
                  {adminUser?.user_metadata?.full_name || adminUser?.email || 'Admin'}
                </span>
              </div>

              <button
                onClick={signOut}
                title="Sign out of Admin Control Center"
                className="p-2 rounded-lg border border-[#c4c7c7] bg-white hover:border-black text-neutral-700 hover:text-black transition-all cursor-pointer shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* MAIN BODY CONTENT */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {/* Error Banner if any */}
          {fetchError && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono-tech flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{fetchError}</span>
              </div>
              <button
                onClick={fetchSubmissions}
                className="underline font-bold hover:text-red-900 cursor-pointer"
              >
                Retry Sync
              </button>
            </div>
          )}

          {/* =====================================================================
              VIEW 1: DASHBOARD OVERVIEW (STATISTICS & RECENT ACTIVITY)
          {/* =====================================================================
              VIEW 4: SETTINGS (PLACEHOLDER)
             ===================================================================== */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Header greeting */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c4c7c7]/50 pb-5">
                <div>
                  <div className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-wider">
                    SYSTEM OVERVIEW
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
                    CONTROL CENTER
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Real-time operational telemetry and client project submissions for Zen Tech Solutions.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className="inline-flex items-center gap-2 bg-[#f4fbe9] border border-[#c8f179] hover:bg-[#daf396] text-[#2e4700] font-mono-tech text-xs font-bold py-2.5 px-3.5 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <Star className="w-3.5 h-3.5 fill-[#476800] text-[#476800]" />
                    <span>REVIEWS ({reviewStats.pending} PENDING)</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="inline-flex items-center gap-2 bg-black text-white hover:bg-neutral-800 font-mono-tech text-xs font-bold py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-xs"
                  >
                    <span>VIEW ALL PROJECTS</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 Premium Statistic Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. TOTAL PROJECTS */}
                <div className="bg-white border border-[#c4c7c7] rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-black transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      TOTAL PROJECTS
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#c8f179] shadow-[0_0_8px_#c8f179]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {stats.total}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                    <span className="text-[#476800] font-bold">●</span>
                    <span>lifetime submissions</span>
                  </div>
                </div>

                {/* 2. NEW PROJECTS */}
                <div className="bg-white border border-[#c4c7c7] rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-[#c8f179] transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-wider">
                      NEW PROJECTS
                    </span>
                    <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-[#daf396] text-[#365000] font-bold">
                      ACTION
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {stats.new}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1">
                    awaiting engineering review
                  </div>
                </div>

                {/* 3. IN PROGRESS */}
                <div className="bg-white border border-[#c4c7c7] rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-black transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      IN PROGRESS
                    </span>
                    <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {stats.inProgress}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1">
                    active development pipeline
                  </div>
                </div>

                {/* 4. COMPLETED */}
                <div className="bg-white border border-[#c4c7c7] rounded-xl p-5 shadow-xs relative overflow-hidden group hover:border-black transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      COMPLETED
                    </span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#476800]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {stats.completed}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1">
                    delivered hardware systems
                  </div>
                </div>
              </div>

              {/* Quick Summary Section: Latest 5 Projects */}
              <div className="bg-white border border-[#c4c7c7] rounded-xl shadow-xs overflow-hidden">
                <div className="p-5 border-b border-[#c4c7c7]/50 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-black">
                      RECENT PROJECT INTAKES
                    </h3>
                    <p className="font-mono-tech text-[11px] text-neutral-400 mt-0.5">
                      Latest incoming client specifications
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('projects')}
                    className="font-mono-tech text-xs font-bold text-[#476800] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                {loadingData ? (
                  <div className="p-12 text-center font-mono-tech text-xs text-neutral-400">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
                    <span>SYNCING RECENT INTAKES...</span>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="p-12 text-center font-mono-tech text-xs text-neutral-400">
                    No client submissions recorded yet.
                  </div>
                ) : (
                  <div className="divide-y divide-[#c4c7c7]/30">
                    {submissions.slice(0, 5).map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => openProjectDetails(sub)}
                        className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-[#f9faf7] transition-colors cursor-pointer group"
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm text-black truncate group-hover:text-[#476800] transition-colors">
                            {sub.project_name}
                          </div>
                          <div className="font-mono-tech text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                            <span>{sub.client_name}</span>
                            <span>•</span>
                            <span className="uppercase">{sub.project_type}</span>
                            <span>•</span>
                            <span>
                              {new Date(sub.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            className={`font-mono-tech text-[9px] uppercase px-2 py-0.5 rounded-md ${
                              STATUS_BADGE_CLASSES[sub.status] || STATUS_BADGE_CLASSES.new
                            }`}
                          >
                            {STATUS_LABELS[sub.status] || sub.status}
                          </span>
                          <span className="font-mono-tech text-xs font-bold text-black hidden sm:inline-block">
                            View →
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              VIEW 2: PROJECT MANAGEMENT (FULL TABLE & FILTERING)
          {/* =====================================================================
              VIEW 4: SETTINGS (PLACEHOLDER)
             ===================================================================== */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {/* Header Title with project counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c4c7c7]/50 pb-5">
                <div>
                  <div className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-wider">
                    PROJECT SUBMISSIONS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
                    MANAGE SUBMISSIONS
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Manage and review technology projects submitted through Zen Tech Solutions.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto font-mono-tech text-xs">
                  <span className="px-3 py-1.5 bg-white border border-[#c4c7c7] rounded-lg text-neutral-700 shadow-2xs">
                    <strong className="text-black font-bold">{filteredSubmissions.length}</strong> project
                    {filteredSubmissions.length === 1 ? '' : 's'} found
                  </span>
                </div>
              </div>

              {/* Search & Filtering Toolbar */}
              <div className="bg-white border border-[#c4c7c7] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                {/* Search projects... */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by name, client, email, or company..."
                    className="w-full bg-[#f9faf7] border border-[#c4c7c7] rounded-lg pl-10 pr-4 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-tech">
                  {/* Status Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400 uppercase text-[10px]">Status:</span>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[#f9faf7] border border-[#c4c7c7] rounded-lg px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  {/* Project Type Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-neutral-400 uppercase text-[10px]">Type:</span>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="bg-[#f9faf7] border border-[#c4c7c7] rounded-lg px-2.5 py-1.5 text-xs text-black focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option value="ALL">All Types</option>
                      <option value="Embedded Systems">Embedded Systems</option>
                      <option value="IoT">IoT</option>
                      <option value="CAD Design">CAD Design</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Complete Product">Complete Product</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {(filterType !== 'ALL' || filterStatus !== 'ALL' || searchQuery) && (
                    <button
                      onClick={() => {
                        setFilterType('ALL');
                        setFilterStatus('ALL');
                        setSearchQuery('');
                      }}
                      className="font-mono-tech text-[10px] text-neutral-600 hover:text-black uppercase underline ml-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Responsive Project Table / Cards */}
              <div className="bg-white border border-[#c4c7c7] rounded-xl shadow-xs overflow-hidden">
                {loadingData ? (
                  <div className="p-20 text-center font-mono-tech text-xs text-neutral-400">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
                    <span>FETCHING PROJECT SUBMISSIONS...</span>
                  </div>
                ) : filteredSubmissions.length === 0 ? (
                  <div className="p-20 text-center space-y-2">
                    <Inbox className="w-10 h-10 text-neutral-300 mx-auto" />
                    <div className="font-mono-tech text-xs font-bold text-neutral-700 uppercase">
                      No project submissions found
                    </div>
                    <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                      {submissions.length === 0
                        ? 'No project submissions have been received from users yet.'
                        : 'No submissions match your current search and filter settings.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#f9faf7] border-b border-[#c4c7c7]/70 font-mono-tech text-[10px] text-neutral-500 uppercase tracking-wider">
                            <th className="py-3.5 px-6 font-semibold">PROJECT</th>
                            <th className="py-3.5 px-6 font-semibold">CLIENT</th>
                            <th className="py-3.5 px-6 font-semibold">TYPE</th>
                            <th className="py-3.5 px-6 font-semibold">TIMELINE</th>
                            <th className="py-3.5 px-6 font-semibold">STATUS</th>
                            <th className="py-3.5 px-6 font-semibold">DATE</th>
                            <th className="py-3.5 px-6 font-semibold text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#c4c7c7]/30">
                          {filteredSubmissions.map((sub) => {
                            const dateFormatted = new Date(sub.created_at).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                            });

                            return (
                              <tr
                                key={sub.id}
                                onClick={() => openProjectDetails(sub)}
                                className="hover:bg-[#f9faf7] transition-colors cursor-pointer group"
                              >
                                <td className="py-4 px-6 font-bold text-black max-w-[200px] truncate group-hover:text-[#476800] transition-colors">
                                  {sub.project_name}
                                </td>
                                <td className="py-4 px-6 text-neutral-700">
                                  <div className="font-medium text-black">{sub.client_name}</div>
                                  <div className="font-mono-tech text-[10px] text-neutral-400 truncate max-w-[160px]">
                                    {sub.email}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span className="font-mono-tech text-[10px] uppercase px-2 py-0.5 rounded bg-[#f3f4f1] border border-[#c4c7c7]/60 text-neutral-700">
                                    {sub.project_type}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-neutral-600 font-mono-tech text-[11px]">
                                  {sub.expected_timeline || '4–8 Weeks'}
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`font-mono-tech text-[10px] uppercase px-2.5 py-1 rounded-md inline-block whitespace-nowrap ${
                                      STATUS_BADGE_CLASSES[sub.status] || STATUS_BADGE_CLASSES.new
                                    }`}
                                  >
                                    {STATUS_LABELS[sub.status] || sub.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 font-mono-tech text-[11px] text-neutral-500 whitespace-nowrap">
                                  {dateFormatted}
                                </td>
                                <td className="py-4 px-6 text-right font-mono-tech text-xs font-bold">
                                  <div className="flex items-center justify-end gap-2">
                                    {sub.status === 'new' && (
                                      <>
                                        <button onClick={(e) => { e.stopPropagation(); setProjectToAccept(sub); }} className="px-2 py-1 bg-black text-[#c8f179] rounded hover:bg-neutral-800 transition-colors">ACCEPT</button>
                                        <button onClick={(e) => { e.stopPropagation(); setProjectToReject(sub); }} className="px-2 py-1 border border-[#c4c7c7] text-neutral-600 hover:text-black rounded transition-colors">REJECT</button>
                                      </>
                                    )}
                                    <button onClick={(e) => { e.stopPropagation(); openProjectDetails(sub); }} className="px-2 py-1 text-black underline hover:text-[#476800] transition-colors">VIEW</button>
                                    {sub.status === 'rejected' && (
                                      <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(sub); }} className="px-2 py-1 text-red-600 hover:text-red-800 rounded transition-colors">DELETE</button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Cards View */}
                    <div className="md:hidden divide-y divide-[#c4c7c7]/40">
                      {filteredSubmissions.map((sub) => {
                        const dateFormatted = new Date(sub.created_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                        });

                        return (
                          <div
                            key={sub.id}
                            onClick={() => openProjectDetails(sub)}
                            className="p-4 space-y-3 hover:bg-[#f9faf7] transition-colors cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="font-bold text-sm text-black">
                                  {sub.project_name}
                                </div>
                                <div className="text-xs text-neutral-600 mt-0.5">
                                  {sub.client_name} {sub.company ? `• ${sub.company}` : ''}
                                </div>
                              </div>
                              <span
                                className={`font-mono-tech text-[9px] uppercase px-2 py-0.5 rounded-md ${
                                  STATUS_BADGE_CLASSES[sub.status] || STATUS_BADGE_CLASSES.new
                                }`}
                              >
                                {STATUS_LABELS[sub.status] || sub.status}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 font-mono-tech text-[10px] text-neutral-500">
                              <span className="px-1.5 py-0.5 bg-[#f3f4f1] border border-[#c4c7c7]/60 rounded">
                                {sub.project_type}
                              </span>
                              <span>•</span>
                              <span>{sub.expected_timeline || '4–8 Weeks'}</span>
                              <span>•</span>
                              <span>{dateFormatted}</span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <span className="font-mono-tech text-[10px] text-neutral-400 truncate max-w-[180px]">
                                {sub.email}
                              </span>
                              <span className="font-mono-tech text-[11px] font-bold text-black underline">
                                View →
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          

          {/* =====================================================================
              VIEW 3: CUSTOMER REVIEWS (FEEDBACK MODERATION & MANAGEMENT)
          {/* =====================================================================
              VIEW 4: SETTINGS (PLACEHOLDER)
             ===================================================================== */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Header Title with review counter */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c4c7c7]/50 pb-5">
                <div>
                  <div className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-wider">
                    FEEDBACK & TESTIMONIALS
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-0.5">
                    CUSTOMER REVIEWS
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1">
                    Moderate client reviews and manage testimonials published to the live ZenTech website.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto font-mono-tech text-xs">
                  <button
                    onClick={fetchReviews}
                    disabled={loadingReviews}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#c4c7c7] hover:border-black rounded-lg text-neutral-700 hover:text-black shadow-2xs transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingReviews ? 'animate-spin' : ''}`} />
                    <span>SYNC REVIEWS</span>
                  </button>
                  <span className="px-3 py-1.5 bg-white border border-[#c4c7c7] rounded-lg text-neutral-700 shadow-2xs">
                    <strong className="text-black font-bold">{filteredReviews.length}</strong> review
                    {filteredReviews.length === 1 ? '' : 's'} displayed
                  </span>
                </div>
              </div>

              {/* Action Feedback Message */}
              {reviewActionMsg && (
                <div className="p-3.5 rounded-xl bg-[#f4fbe9] border border-[#c8f179] text-[#2b4000] font-mono-tech text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-[#476800]" />
                    <span>{reviewActionMsg}</span>
                  </div>
                  <button
                    onClick={() => setReviewActionMsg(null)}
                    className="text-neutral-500 hover:text-black cursor-pointer font-bold ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Action Error Feedback Message */}
              {reviewActionError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 font-mono-tech text-xs flex items-center justify-between animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{reviewActionError}</span>
                  </div>
                  <button
                    onClick={() => setReviewActionError(null)}
                    className="text-neutral-500 hover:text-black cursor-pointer font-bold ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Error Message */}
              {reviewsError && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono-tech flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{reviewsError}</span>
                  </div>
                  <button
                    onClick={fetchReviews}
                    className="underline font-bold hover:text-red-900 cursor-pointer"
                  >
                    Retry Sync
                  </button>
                </div>
              )}

              {/* 4 Summary Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* 1. TOTAL REVIEWS */}
                <div
                  onClick={() => setReviewFilterStatus('ALL')}
                  className={`bg-white border rounded-xl p-5 shadow-xs relative overflow-hidden group cursor-pointer transition-all ${
                    reviewFilterStatus === 'ALL'
                      ? 'border-black ring-2 ring-black/10'
                      : 'border-[#c4c7c7] hover:border-black'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                      TOTAL REVIEWS
                    </span>
                    <MessageSquare className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {reviewStats.total}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                    <span className="text-[#476800] font-bold">●</span>
                    <span>all submissions</span>
                  </div>
                </div>

                {/* 2. PENDING REVIEWS */}
                <div
                  onClick={() => setReviewFilterStatus('pending')}
                  className={`bg-white border rounded-xl p-5 shadow-xs relative overflow-hidden group cursor-pointer transition-all ${
                    reviewFilterStatus === 'pending'
                      ? 'border-amber-400 ring-2 ring-amber-300/40 bg-amber-50/20'
                      : 'border-[#c4c7c7] hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      PENDING REVIEWS
                    </span>
                    <span className="font-mono-tech text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300">
                      ACTION
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-amber-900 tracking-tight">
                    {reviewStats.pending}
                  </div>
                  <div className="font-mono-tech text-[11px] text-amber-700/80 mt-1">
                    awaiting admin approval
                  </div>
                </div>

                {/* 3. APPROVED REVIEWS */}
                <div
                  onClick={() => setReviewFilterStatus('approved')}
                  className={`bg-white border rounded-xl p-5 shadow-xs relative overflow-hidden group cursor-pointer transition-all ${
                    reviewFilterStatus === 'approved'
                      ? 'border-[#c8f179] ring-2 ring-[#c8f179]/50 bg-[#f4fbe9]/30'
                      : 'border-[#c4c7c7] hover:border-[#c8f179]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-wider">
                      APPROVED REVIEWS
                    </span>
                    <CheckCircle2 className="w-4 h-4 text-[#476800]" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                    {reviewStats.approved}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1">
                    published on live website
                  </div>
                </div>

                {/* 4. REJECTED REVIEWS */}
                <div
                  onClick={() => setReviewFilterStatus('rejected')}
                  className={`bg-white border rounded-xl p-5 shadow-xs relative overflow-hidden group cursor-pointer transition-all ${
                    reviewFilterStatus === 'rejected'
                      ? 'border-rose-400 ring-2 ring-rose-200 bg-rose-50/20'
                      : 'border-[#c4c7c7] hover:border-rose-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono-tech text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                      REJECTED REVIEWS
                    </span>
                    <ThumbsDown className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-neutral-800 tracking-tight">
                    {reviewStats.rejected}
                  </div>
                  <div className="font-mono-tech text-[11px] text-neutral-400 mt-1">
                    declined & hidden from site
                  </div>
                </div>
              </div>

              {/* Filtering & Search Toolbar */}
              <div className="bg-white border border-[#c4c7c7] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
                {/* Search reviews... */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={reviewSearchQuery}
                    onChange={(e) => setReviewSearchQuery(e.target.value)}
                    placeholder="Search reviews by customer name or written feedback..."
                    className="w-full bg-[#f9faf7] border border-[#c4c7c7] rounded-lg pl-10 pr-4 py-2 text-xs text-black placeholder-neutral-400 focus:outline-none focus:border-black transition-colors"
                  />
                  {reviewSearchQuery && (
                    <button
                      onClick={() => setReviewSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono-tech">
                  <button
                    onClick={() => setReviewFilterStatus('ALL')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs ${
                      reviewFilterStatus === 'ALL'
                        ? 'bg-black text-white'
                        : 'bg-[#f9faf7] border border-[#c4c7c7] text-neutral-600 hover:text-black'
                    }`}
                  >
                    All Reviews ({reviewStats.total})
                  </button>

                  <button
                    onClick={() => setReviewFilterStatus('pending')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                      reviewFilterStatus === 'pending'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'bg-[#f9faf7] border border-[#c4c7c7] text-amber-800 hover:border-amber-400'
                    }`}
                  >
                    <span>Pending</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {reviewStats.pending}
                    </span>
                  </button>

                  <button
                    onClick={() => setReviewFilterStatus('approved')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                      reviewFilterStatus === 'approved'
                        ? 'bg-[#476800] text-white shadow-xs'
                        : 'bg-[#f9faf7] border border-[#c4c7c7] text-[#476800] hover:border-[#c8f179]'
                    }`}
                  >
                    <span>Approved</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {reviewStats.approved}
                    </span>
                  </button>

                  <button
                    onClick={() => setReviewFilterStatus('rejected')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer text-xs flex items-center gap-1.5 ${
                      reviewFilterStatus === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-[#f9faf7] border border-[#c4c7c7] text-rose-700 hover:border-rose-400'
                    }`}
                  >
                    <span>Rejected</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20">
                      {reviewStats.rejected}
                    </span>
                  </button>

                  {(reviewFilterStatus !== 'ALL' || reviewSearchQuery) && (
                    <button
                      onClick={() => {
                        setReviewFilterStatus('ALL');
                        setReviewSearchQuery('');
                      }}
                      className="font-mono-tech text-[10px] text-neutral-600 hover:text-black uppercase underline ml-1 cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {loadingReviews ? (
                  <div className="bg-white border border-[#c4c7c7] rounded-xl p-16 text-center">
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-3" />
                    <span className="font-mono-tech text-xs text-neutral-500 uppercase">
                      SYNCING REVIEWS FROM SUPABASE...
                    </span>
                  </div>
                ) : filteredReviews.length === 0 ? (
                  <div className="bg-white border border-[#c4c7c7] rounded-xl p-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-[#f9faf7] border border-[#c4c7c7] text-neutral-400 mx-auto flex items-center justify-center">
                      <Star className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-base text-black">NO REVIEWS FOUND</h3>
                    <p className="font-mono-tech text-xs text-neutral-500 max-w-sm mx-auto">
                      {reviewSearchQuery || reviewFilterStatus !== 'ALL'
                        ? 'No customer reviews match your active filter or search query.'
                        : 'No customer reviews have been submitted yet.'}
                    </p>
                    {(reviewFilterStatus !== 'ALL' || reviewSearchQuery) && (
                      <button
                        onClick={() => {
                          setReviewFilterStatus('ALL');
                          setReviewSearchQuery('');
                        }}
                        className="font-mono-tech text-xs font-bold text-[#476800] hover:underline cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredReviews.map((rev) => {
                    const formattedDate = new Date(rev.created_at).toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={rev.id}
                        className="bg-white border border-[#c4c7c7] rounded-xl p-5 sm:p-6 shadow-xs hover:border-black/60 transition-all space-y-4"
                      >
                        {/* Header: Customer, Stars, Status Badge, Date */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c4c7c7]/30 pb-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-black text-[#c8f179] font-mono-tech font-bold text-sm flex items-center justify-center shrink-0">
                              {rev.customer_name ? rev.customer_name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-base text-black">{rev.customer_name}</h4>
                                <span className="font-mono-tech text-[11px] text-neutral-400">
                                  ({rev.rating}.0 / 5)
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mt-0.5">
                                {[1, 2, 3, 4, 5].map((starNum) => (
                                  <Star
                                    key={starNum}
                                    className={`w-3.5 h-3.5 ${
                                      starNum <= rev.rating
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-neutral-200'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            {/* Status Badge */}
                            {rev.status === 'pending' && (
                              <span className="font-mono-tech text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                <span>PENDING APPROVAL</span>
                              </span>
                            )}
                            {rev.status === 'approved' && (
                              <span className="font-mono-tech text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>APPROVED & LIVE</span>
                              </span>
                            )}
                            {rev.status === 'rejected' && (
                              <span className="font-mono-tech text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-300 flex items-center gap-1.5">
                                <X className="w-3.5 h-3.5 text-rose-600" />
                                <span>REJECTED</span>
                              </span>
                            )}

                            <span className="font-mono-tech text-[10px] text-neutral-400">
                              {formattedDate}
                            </span>

                            {/* Small Red Trash Icon Button beside review header */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReviewToDelete(rev);
                              }}
                              disabled={reviewActionLoading === rev.id}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all cursor-pointer shadow-2xs shrink-0 disabled:opacity-50"
                              title="Delete this review"
                              aria-label={`Delete review from ${rev.customer_name}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Review Content */}
                        <div className="bg-[#f9faf7] border border-[#c4c7c7]/50 rounded-lg p-4">
                          <p className="text-neutral-800 text-sm leading-relaxed italic font-sans">
                            "{rev.review_text}"
                          </p>
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => handleApproveReview(rev.id)}
                                disabled={reviewActionLoading === rev.id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-black text-[#c8f179] hover:bg-neutral-800 font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                              >
                                {reviewActionLoading === rev.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <ThumbsUp className="w-3.5 h-3.5" />
                                )}
                                <span>APPROVE REVIEW</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => handleRejectReview(rev.id)}
                                disabled={reviewActionLoading === rev.id}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#c4c7c7] text-neutral-700 hover:text-rose-600 hover:border-rose-400 font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50"
                              >
                                {reviewActionLoading === rev.id ? (
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <ThumbsDown className="w-3.5 h-3.5" />
                                )}
                                <span>REJECT</span>
                              </button>
                            )}
                          </div>

                          {/* Delete Review Button - Small red trash icon button */}
                          <button
                            onClick={() => setReviewToDelete(rev)}
                            disabled={reviewActionLoading === rev.id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 font-mono-tech text-xs font-bold transition-all cursor-pointer shadow-2xs disabled:opacity-50 shrink-0"
                            title="Delete this review"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Review</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
          {/* =====================================================================
              VIEW 4: SETTINGS (PLACEHOLDER)
             ===================================================================== */}
          {activeTab === 'settings' && (
            <div className="bg-white border border-[#c4c7c7] rounded-xl p-8 sm:p-12 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-black text-[#c8f179] mx-auto flex items-center justify-center mb-2">
                <SettingsIcon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-xl text-black">CONTROL CENTER SETTINGS</h3>
              <p className="font-mono-tech text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                Studio telemetry, notification webhooks, and Supabase RLS security policies configuration.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* =========================================================================
          PROJECT DETAILS PANEL / MODAL
         ========================================================================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white border border-[#c4c7c7] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#c4c7c7]/50 flex items-center justify-between bg-[#f9faf7]">
              <div>
                <span className="font-mono-tech text-[10px] text-[#476800] uppercase font-bold tracking-wider block">
                  PROJECT SPECIFICATION PANEL
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight mt-0.5">
                  {selectedProject.project_name}
                </h2>
              </div>
              <button
                onClick={closeProjectDetails}
                className="p-2 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Action Message Feedback */}
              {actionMessage && (
                <div className="p-3.5 rounded-lg bg-[#f4fbe9] border border-[#c8f179] text-[#2b4000] font-mono-tech text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#476800]" />
                  <span>{actionMessage}</span>
                </div>
              )}

              {/* Status Management Bar */}
              <div className="bg-[#f9faf7] border border-[#c4c7c7] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="font-mono-tech text-[10px] text-neutral-500 uppercase font-bold block mb-1">
                    STATUS MANAGEMENT
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-mono-tech text-[10px] uppercase px-2.5 py-1 rounded-md ${
                        STATUS_BADGE_CLASSES[selectedProject.status] || STATUS_BADGE_CLASSES.new
                      }`}
                    >
                      {STATUS_LABELS[selectedProject.status] || selectedProject.status}
                    </span>
                    <span className="font-mono-tech text-[10px] text-neutral-400">
                      (Supabase public.project_submissions)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    disabled={updatingStatus}
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="bg-white border border-[#c4c7c7] rounded-lg px-3 py-2 text-xs font-mono-tech text-black focus:outline-none focus:border-black cursor-pointer font-semibold"
                  >
                    <option value="new">NEW</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="completed">COMPLETED</option>
                  </select>

                  <button
                    onClick={handleStatusChange}
                    disabled={updatingStatus || editStatus === selectedProject.status}
                    className="bg-black text-white hover:bg-neutral-800 disabled:opacity-50 font-mono-tech text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    {updatingStatus ? 'UPDATING...' : 'UPDATE STATUS'}
                  </button>
                </div>
              </div>

              {/* 2-Column: Project Info & Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PROJECT INFORMATION */}
                <div className="border border-[#c4c7c7]/70 rounded-xl p-5 space-y-3 bg-white">
                  <span className="font-mono-tech text-[10px] text-neutral-400 uppercase font-bold tracking-wider block border-b border-[#c4c7c7]/30 pb-2">
                    PROJECT INFORMATION
                  </span>

                  <div className="space-y-2.5">
                    <div>
                      <span className="text-neutral-400 text-[10px] block">Project Name</span>
                      <span className="font-bold text-black text-sm">{selectedProject.project_name}</span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] block">Project Type</span>
                      <span className="font-mono-tech text-xs font-bold text-black uppercase">
                        {selectedProject.project_type}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] block">Expected Timeline</span>
                      <span className="text-black font-medium">
                        {selectedProject.expected_timeline || 'Standard Timeline'}
                      </span>
                    </div>

                    <div>
                      <span className="text-neutral-400 text-[10px] block">Created Date</span>
                      <span className="font-mono-tech text-neutral-600">
                        {new Date(selectedProject.created_at).toLocaleString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CLIENT INFORMATION */}
                <div className="border border-[#c4c7c7]/70 rounded-xl p-5 space-y-3 bg-white">
                  <span className="font-mono-tech text-[10px] text-neutral-400 uppercase font-bold tracking-wider block border-b border-[#c4c7c7]/30 pb-2">
                    CLIENT INFORMATION
                  </span>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5">
                      <User className="w-4 h-4 text-[#476800] shrink-0" />
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Client Name</span>
                        <span className="font-bold text-black text-sm">{selectedProject.client_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Mail className="w-4 h-4 text-[#476800] shrink-0" />
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Email</span>
                        <a
                          href={`mailto:${selectedProject.email}`}
                          className="font-mono-tech text-black underline hover:text-[#476800]"
                        >
                          {selectedProject.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#476800] shrink-0" />
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Phone</span>
                        <span className="font-mono-tech text-black">
                          {selectedProject.phone || 'Not provided'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Building className="w-4 h-4 text-[#476800] shrink-0" />
                      <div>
                        <span className="text-neutral-400 text-[10px] block">Company / Organization</span>
                        <span className="text-black font-medium">
                          {selectedProject.company || 'Not Specified'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PROJECT DESCRIPTION */}
              <div className="border border-[#c4c7c7]/70 rounded-xl p-5 bg-white space-y-2">
                <span className="font-mono-tech text-[10px] text-neutral-400 uppercase font-bold tracking-wider block border-b border-[#c4c7c7]/30 pb-2">
                  PROJECT DESCRIPTION
                </span>
                <div className="text-neutral-800 text-sm whitespace-pre-wrap leading-relaxed pt-1 font-sans">
                  {selectedProject.project_description || 'No detailed description provided.'}
                </div>
              </div>

              {/* FILES */}
              <div className="border border-[#c4c7c7]/70 rounded-xl p-5 bg-white space-y-3">
                <div className="flex items-center justify-between border-b border-[#c4c7c7]/30 pb-2">
                  <span className="font-mono-tech text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
                    UPLOADED PROJECT FILES
                  </span>
                  <span className="font-mono-tech text-[10px] text-neutral-400">
                    {projectFiles.length} file{projectFiles.length === 1 ? '' : 's'}
                  </span>
                </div>

                {loadingFiles ? (
                  <div className="p-6 text-center font-mono-tech text-xs text-neutral-400">
                    SYNCING ATTACHMENTS...
                  </div>
                ) : projectFiles.length === 0 ? (
                  <div className="p-6 text-center font-mono-tech text-xs text-neutral-500 bg-[#f9faf7] rounded-lg">
                    No files were uploaded with this project.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projectFiles.map((file) => (
                      <div
                        key={file.id}
                        className="bg-[#f9faf7] border border-[#c4c7c7]/70 rounded-lg p-3.5 flex items-center justify-between gap-4 hover:border-black transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="px-2 py-1 bg-black text-[#c8f179] font-mono-tech text-[10px] font-bold rounded">
                            {file.file_type?.toUpperCase() || 'FILE'}
                          </span>
                          <div className="min-w-0">
                            <div className="font-bold text-black truncate text-xs">
                              {file.file_name}
                            </div>
                            <div className="font-mono-tech text-[10px] text-neutral-400 flex items-center gap-2 mt-0.5">
                              <span>{formatFileSize(file.file_size)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadFile(file)}
                          className="inline-flex items-center gap-1.5 bg-black text-white hover:bg-neutral-800 font-mono-tech text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>DOWNLOAD</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[#c4c7c7]/50 bg-[#f9faf7] flex justify-end">
              <button
                onClick={closeProjectDetails}
                className="bg-black text-white font-mono-tech text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ACTION MODALS
         ========================================================================= */}
      {projectToAccept && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl">Accept Project?</h3>
            <p className="text-sm text-neutral-600">This will move "{projectToAccept.project_name}" to ACCEPTED status and enable chat.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setProjectToAccept(null)} disabled={actionLoading} className="px-4 py-2 text-neutral-600 font-bold text-xs cursor-pointer hover:bg-neutral-100 rounded-lg transition-colors">CANCEL</button>
              <button onClick={handleAcceptProject} disabled={actionLoading} className="px-4 py-2 bg-black text-[#c8f179] rounded-lg font-bold text-xs cursor-pointer hover:bg-neutral-800 transition-colors">{actionLoading ? 'ACCEPTING...' : 'ACCEPT PROJECT'}</button>
            </div>
          </div>
        </div>
      )}

      {projectToReject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl">Reject Project</h3>
            <p className="text-sm text-neutral-600">Rejecting "{projectToReject.project_name}". Optional reason:</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full border border-[#c4c7c7] rounded-lg p-3 text-sm focus:border-black outline-none transition-colors"
              rows={3}
              placeholder="e.g., We currently do not support this technology stack..."
            />
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setProjectToReject(null); setRejectionReason(''); }} disabled={actionLoading} className="px-4 py-2 text-neutral-600 font-bold text-xs cursor-pointer hover:bg-neutral-100 rounded-lg transition-colors">CANCEL</button>
              <button onClick={handleRejectProject} disabled={actionLoading} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-rose-700 transition-colors">{actionLoading ? 'REJECTING...' : 'REJECT PROJECT'}</button>
            </div>
          </div>
        </div>
      )}

      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="font-bold text-xl text-rose-600">DELETE REJECTED PROJECT?</h3>
            <p className="text-sm text-neutral-600">This will permanently remove this rejected project "{projectToDelete.project_name}" and its related project data. This action cannot be undone.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setProjectToDelete(null)} disabled={actionLoading} className="px-4 py-2 text-neutral-600 font-bold text-xs cursor-pointer hover:bg-neutral-100 rounded-lg transition-colors">CANCEL</button>
              <button onClick={handleDeleteProject} disabled={actionLoading} className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold text-xs cursor-pointer hover:bg-rose-700 transition-colors">{actionLoading ? 'DELETING...' : 'DELETE PROJECT'}</button>
            </div>
          </div>
        </div>
      )}

      {reviewToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-[#c4c7c7]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-black">Delete Review</h3>
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to permanently delete this review? This action cannot be undone.
            </p>

            <div className="bg-[#f9faf7] border border-[#c4c7c7]/60 rounded-lg p-3 text-xs space-y-1">
              <div className="flex items-center justify-between font-bold text-black">
                <span>{reviewToDelete.customer_name}</span>
                <span className="font-mono-tech text-amber-600">★ {reviewToDelete.rating}.0 / 5</span>
              </div>
              <p className="text-neutral-500 line-clamp-2 italic font-sans text-[11px]">
                "{reviewToDelete.review_text}"
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2 font-mono-tech text-xs">
              <button
                onClick={() => setReviewToDelete(null)}
                disabled={reviewActionLoading !== null}
                className="px-4 py-2 border border-[#c4c7c7] text-neutral-700 font-bold cursor-pointer hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                disabled={reviewActionLoading !== null}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg font-bold cursor-pointer hover:bg-rose-700 transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {reviewActionLoading === reviewToDelete.id ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
