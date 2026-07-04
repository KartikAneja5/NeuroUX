import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../api/authApi';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: false, message: '' });

  useEffect(() => {
    const performVerification = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus({ success: true, message: response.data.message || 'Your email has been successfully verified!' });
      } catch (err) {
        setStatus({ success: false, message: err.response?.data?.message || 'Verification link is invalid or has expired.' });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      performVerification();
    } else {
      setLoading(false);
      setStatus({ success: false, message: 'No verification token provided.' });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="mb-6">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            NeuroUX
          </span>
        </div>

        {loading ? (
          <div className="py-8">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400">Verifying your email address...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {status.success ? (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Verification Successful</h3>
                <p className="text-slate-300 text-sm">{status.message}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-full flex items-center justify-center mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-100">Verification Failed</h3>
                <p className="text-slate-300 text-sm">{status.message}</p>
              </div>
            )}

            <Link
              to="/login"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-3 text-sm font-semibold inline-block hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98] transition duration-200"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
