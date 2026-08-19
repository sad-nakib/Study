import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface PasswordPromptModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PasswordPromptModal: React.FC<PasswordPromptModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setError(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === '16726') {
      setError(false);
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (num: string) => {
    setError(false);
    if (password.length < 10) {
      setPassword(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPassword(prev => prev.slice(0, -1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div 
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto border border-indigo-200 dark:border-indigo-800 shadow-md">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Editor Login
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter passcode to manage classes and subjects
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type={showPassword ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              value={password}
              onChange={(e) => {
                setError(false);
                setPassword(e.target.value);
              }}
              placeholder="Enter passcode"
              className={`w-full pl-10 pr-10 py-3 text-center text-lg tracking-widest font-mono bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border ${
                error 
                  ? 'border-rose-500 ring-2 ring-rose-500/30' 
                  : 'border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500'
              } rounded-2xl focus:outline-none transition-all`}
            />
            <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400 animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect passcode. Please try again.</span>
            </div>
          )}

          {/* Quick On-Screen Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-800 dark:text-slate-200 font-bold text-base transition-colors cursor-pointer active:scale-95"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPassword('')}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 text-slate-800 dark:text-slate-200 font-bold text-base transition-colors cursor-pointer active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold text-sm shadow-md shadow-indigo-600/30 transition-all cursor-pointer mt-2"
          >
            Unlock Editor
          </button>
        </form>
      </div>
    </div>
  );
};
