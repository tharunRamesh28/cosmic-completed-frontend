import React, { useState, useEffect, useRef } from 'react';
import { CursorGrid } from '../components/CursorGrid';
import {
  Shield,
  AlertCircle,
  ArrowLeft,
  Info
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useRouter } from '../router';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);

  const googleClientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    '831372281495-70ssitoaiqspddpmdba2eb8c7j2mnk81.apps.googleusercontent.com';

  const handleCredentialResponse = async (response: { credential: string }) => {
    if (!response || !response.credential) {
      setErrorMsg('No credential received from Google. Please try again.');
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      // Exchange verified Google ID token with Supabase Auth
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: response.credential,
      });

      if (error) {
        setErrorMsg(error.message || 'Google authentication failed with Supabase.');
        setLoading(false);
        return;
      }

      if (data?.user) {
        if (data.user.id === '9163b26d-c7b1-4a13-8688-62ca34233fd9') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred during Google sign-in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let checkInterval: any = null;

    const initGis = () => {
      if (typeof window !== 'undefined' && (window as any).google?.accounts?.id && googleClientId) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            (window as any).google.accounts.id.renderButton(
              googleBtnContainerRef.current,
              {
                type: 'standard',
                theme: 'outline',
                size: 'medium',
                text: 'continue_with',
                shape: 'pill',
                logo_alignment: 'left',
                width: 280,
              }
            );
          }
          return true;
        } catch (e) {
          console.error('Failed to initialize Google GIS:', e);
        }
      }
      return false;
    };

    if (!initGis()) {
      checkInterval = setInterval(() => {
        if (initGis()) {
          clearInterval(checkInterval);
        }
      }, 250);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [googleClientId]);

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#191c1b] relative overflow-hidden flex flex-col justify-between selection:bg-[#c8f179] selection:text-[#000000]">
      {/* Subtle Light Technical Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="tech-grid absolute inset-0 opacity-40 pointer-events-none" />
        <CursorGrid color="0, 0, 0" maxOpacity={0.25} />
      </div>

      {/* Subtle Light Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-20 -z-10"
        style={{
          background:
            'radial-gradient(circle, rgba(200, 241, 121, 0.4) 0%, rgba(200, 241, 121, 0.05) 50%, transparent 70%)',
        }}
      />

      {/* Top Header Identifier */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pt-8 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <span className="w-2.5 h-2.5 bg-[#c8f179] rounded-sm shadow-[0_0_10px_#c8f179] inline-block" />
          <span className="font-display-tech text-base font-extrabold tracking-tight text-black">
            Cosmic Circuit
          </span>
        </a>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] font-bold text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO HOME</span>
        </button>
      </div>

      {/* Center White Authentication Card */}
      <div className="relative z-20 w-full max-w-[460px] mx-auto px-4 my-8">
        <div className="bg-white border border-[#c4c7c7] rounded-2xl p-7 sm:p-9 shadow-md transition-all duration-300">
          
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-black text-[#c8f179] mb-4 shadow-xs">
              <Shield className="w-6 h-6" />
            </div>

            <h1 className="font-display-tech text-2xl sm:text-3xl font-black tracking-tight text-black">
              COSMIC CIRCUIT
            </h1>

            <div className="font-mono-tech text-[11px] font-bold text-[#476800] uppercase tracking-widest mt-1">
              AUTHENTICATION GATEWAY
            </div>

            <p className="font-display-tech text-xs text-[#444748] mt-3 leading-relaxed">
              Sign in with your Google account to access your Cosmic Circuit projects and client workspace.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono-tech flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In Action */}
          <div className="space-y-4">
            {loading && (
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-center gap-3">
                <span className="w-4 h-4 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                <span className="font-mono-tech text-xs tracking-wider text-neutral-800">
                  VERIFYING CREDENTIALS...
                </span>
              </div>
            )}

            {!googleClientId ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono-tech flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                <div>
                  <div className="font-bold mb-1">CONFIGURATION REQUIRED</div>
                  <div>Please set <code className="bg-amber-100 px-1 py-0.5 rounded text-black font-semibold">VITE_GOOGLE_CLIENT_ID</code> in your <code className="bg-amber-100 px-1 py-0.5 rounded text-black font-semibold">.env</code> file to enable Google Identity Services.</div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div
                  ref={googleBtnContainerRef}
                  id="google-gis-button-container"
                  className={`min-h-[44px] flex justify-center w-full ${loading ? 'opacity-50 pointer-events-none' : ''}`}
                />
              </div>
            )}

            <div className="pt-2 text-center">
              <span className="font-mono-tech text-[11px] text-neutral-400">
                OFFICIAL GOOGLE IDENTITY SERVICES
              </span>
            </div>
          </div>

          {/* Footer Card Note */}
          <div className="mt-8 pt-5 border-t border-[#c4c7c7]/30 text-center">
            <span className="font-mono-tech text-[10px] text-neutral-400">
              COSMIC CIRCUIT • HARDWARE &amp; EMBEDDED SYSTEMS STUDIO
            </span>
          </div>
        </div>
      </div>

      {/* Page Bottom Footer */}
      <div className="relative z-20 pb-6 text-center font-mono-tech text-[10px] text-neutral-400">
        CONFIDENTIAL • PROPRIETARY HARDWARE SPECIFICATION PORTAL &copy; 2026
      </div>
    </div>
  );
};
