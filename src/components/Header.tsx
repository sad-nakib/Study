import React, { useState, useRef } from 'react';
import { 
  GraduationCap, 
  Search, 
  Plus, 
  Youtube, 
  FileText, 
  BookOpen, 
  Download, 
  Upload, 
  RotateCcw, 
  FolderPlus,
  X,
  MoreVertical
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddResource: () => void;
  onOpenAddSubject: () => void;
  onExportData: () => void;
  onImportData: (jsonString: string) => void;
  onResetData: () => void;
  stats: {
    total: number;
    youtubeCount: number;
    driveCount: number;
    booksCount: number;
    completedCount: number;
    completionRate: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  onOpenAddResource,
  onOpenAddSubject,
  onExportData,
  onImportData,
  onResetData,
  stats,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportData(content);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setShowMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">StudyHub</span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                  Class Organizer
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                YouTube Classes • Drive Sheets • Books & PDFs
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search lectures, drive sheets, topics, textbooks, tags..."
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-800/90 text-slate-100 placeholder-slate-400 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="btn-add-resource"
              onClick={onOpenAddResource}
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 transition-colors active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Add Resource</span>
              <span className="md:hidden">Add</span>
            </button>

            <button
              id="btn-add-subject"
              onClick={onOpenAddSubject}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Add New Subject"
            >
              <FolderPlus className="w-4 h-4 text-indigo-400" />
              <span>New Subject</span>
            </button>

            {/* Menu Options (Export, Import, Reset) */}
            <div className="relative">
              <button
                id="btn-header-menu"
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
                title="Data & Backup Options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1.5 text-sm text-slate-200 divide-y divide-slate-700/60 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Study Hub Data
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {stats.total} total items • {stats.completionRate}% finished
                      </p>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onOpenAddSubject();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-700/80 flex items-center gap-2 text-slate-200"
                      >
                        <FolderPlus className="w-4 h-4 text-indigo-400" />
                        Create Subject
                      </button>
                      <button
                        onClick={() => {
                          onExportData();
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-700/80 flex items-center gap-2 text-slate-200"
                      >
                        <Download className="w-4 h-4 text-emerald-400" />
                        Export Backup (JSON)
                      </button>
                      <button
                        onClick={() => {
                          fileInputRef.current?.click();
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-slate-700/80 flex items-center gap-2 text-slate-200"
                      >
                        <Upload className="w-4 h-4 text-sky-400" />
                        Import Backup (JSON)
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          if (window.confirm('Reset all subjects and resources to default curriculum samples? Any custom items will be overwritten.')) {
                            onResetData();
                          }
                          setShowMenu(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-rose-900/30 text-rose-300 flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4 text-rose-400" />
                        Reset to Sample Curriculum
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>

        {/* Quick Quick Count Sub-bar */}
        <div className="flex items-center justify-between py-2 border-t border-slate-800/80 text-xs overflow-x-auto gap-4 scrollbar-none">
          <div className="flex items-center gap-4 text-slate-400">
            <div className="flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span><strong className="text-slate-200">{stats.youtubeCount}</strong> Classes</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span><strong className="text-slate-200">{stats.driveCount}</strong> Drive Sheets</span>
            </div>
            <span className="text-slate-700">•</span>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong className="text-slate-200">{stats.booksCount}</strong> Books & PDFs</span>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-max">
            <span className="text-slate-400">Study Progress:</span>
            <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/60">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
            <span className="text-slate-300 font-semibold">{stats.completedCount}/{stats.total} ({stats.completionRate}%)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
