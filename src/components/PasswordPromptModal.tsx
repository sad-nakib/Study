import React, { useState, useEffect, useRef } from 'react';
import { Lock, KeyRound, Eye, EyeOff, AlertCircle, X } from 'lucide-react';

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
      setPassword((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPassword((prev) => prev.slice(0, -1));
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onCancel}
    >
      <div 
        className="w-full max-w-sm bg-[#FFFBFE] rounded-[36px] border border-[#CAC4D0]/50 p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute right-5 top-5 w-9 h-9 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] flex items-center justify-center text-[#49454F] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Lock Header */}
        <div className="text-center space-y-2 pt-1">
          <div className="w-14 h-14 rounded-full bg-[#EADDFF] text-[#21005D] flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#1C1B1F]">
              Editor Access
            </h2>
            <p className="text-xs text-[#49454F] mt-1">
              Enter passcode to manage classes and subjects
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* M3 Filled Input */}
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
              placeholder="•••••"
              className={`w-full pl-11 pr-11 h-14 text-center text-xl tracking-widest font-mono bg-[#E7E0EC] text-[#1C1B1F] rounded-t-xl rounded-b-none border-b-2 ${
                error 
                  ? 'border-[#B3261E] bg-[#F9DEDC]' 
                  : 'border-[#79747E] focus:border-[#6750A4]'
              } focus:outline-none transition-colors duration-200`}
            />
            <KeyRound className="w-5 h-5 text-[#79747E] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#79747E] hover:text-[#1C1B1F] p-1 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-[#B3261E] animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              <span>Incorrect passcode. Please try again.</span>
            </div>
          )}

          {/* Material 3 On-Screen Keypad */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeyPress(digit)}
                className="h-12 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] text-[#1C1B1F] font-medium text-lg active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
              >
                {digit}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPassword('')}
              className="h-12 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] text-[#49454F] text-xs font-medium active:scale-95 transition-all duration-150 cursor-pointer"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => handleKeyPress('0')}
              className="h-12 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] text-[#1C1B1F] font-medium text-lg active:scale-95 transition-all duration-150 cursor-pointer shadow-xs"
            >
              0
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="h-12 rounded-full bg-[#F3EDF7] hover:bg-[#E8DEF8] text-[#49454F] text-xs font-medium active:scale-95 transition-all duration-150 cursor-pointer"
            >
              ⌫
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-full bg-[#6750A4] hover:bg-[#593E96] active:scale-95 text-white font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mt-2"
          >
            Unlock Editor
          </button>
        </form>
      </div>
    </div>
  );
};
