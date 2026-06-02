/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { DB } from '../db';

interface PasswordLockScreenProps {
  onUnlock: () => void;
}

export const PasswordLockScreen: React.FC<PasswordLockScreenProps> = ({ onUnlock }) => {
  const [isSetupMode, setIsSetupMode] = useState(!DB.getPassword());
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSetup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.trim().length < 4) {
      setError('Password kam se kam 4 characters ka hona chahiye!');
      return;
    }

    if (password !== confirmPassword) {
      setError('Dono password aapas me match nahi ho rahe!');
      return;
    }

    DB.setPassword(password.trim());
    setSuccess('Password kamyabi se set ho gaya hai! App unlock ho rahi hai...');
    setTimeout(() => {
      onUnlock();
    }, 1500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const savedPassword = DB.getPassword();
    if (password.trim() === savedPassword) {
      onUnlock();
    } else {
      setError('Ghalat password! Dobara koshish karein.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Top Logo / Icon */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
            {isSetupMode ? (
              <KeyRound className="w-7 h-7 animate-pulse" />
            ) : (
              <Lock className="w-7 h-7" />
            )}
          </div>
          <div className="space-y-1">
            <h1 className="font-display font-bold text-2xl text-white">🏏 CricStat Pro</h1>
            <p className="text-xs text-slate-400">
              {isSetupMode 
                ? 'App ko mahfooz karne ke liye password set karein' 
                : 'Apna password enter karke score ko unlock karein'}
            </p>
          </div>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-xs py-3 px-4 rounded-xl flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span className="font-medium">{success}</span>
          </div>
        )}

        {/* Forms */}
        {isSetupMode ? (
          <form onSubmit={handleSetup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Naya Password Set Karein
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-white font-semibold transition-all outline-none"
                  placeholder="Password likhein..."
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Password Dobara Confirm Karein
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-white font-semibold transition-all outline-none"
                placeholder="Dobara password likhein..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" /> Password Enable Karein
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 border-none">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Apna App Password Likhein
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500/80 rounded-xl px-4 py-3 text-sm text-white font-semibold tracking-wide transition-all outline-none"
                  placeholder="Password enter karein..."
                  autoFocus
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-emerald-600/15 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" /> Unlock CricStat
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-[11px] text-slate-500">
          CricStat Pro Score Board local storage me safe data rakhta hai.
        </div>
      </div>
    </div>
  );
};
