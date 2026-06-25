"use client";

import { motion } from "framer-motion";

export default function GEDDownloadPage() {
  // Client-side download handle
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/ged_social_studies_practice_blueprint.pdf";
    link.download = "ged_social_studies_practice_blueprint.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="relative min-h-screen bg-[#030712] flex flex-col items-center justify-center px-4 py-20 overflow-hidden font-sans antialiased text-slate-200">
      {/* Background Decorative Mesh Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />

      {/* Main Content Animation Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-xl z-10 flex flex-col items-center"
      >
        {/* Success badge & Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-950/40 backdrop-blur-md border border-blue-500/30 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          >
            <svg
              className="w-10 h-10 text-blue-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>

          <span className="block text-xs font-bold tracking-widest text-blue-400 uppercase mb-3">
            Access Granted
          </span>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tight bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400">
            Your Practice Blueprint is Ready
          </h1>

          <p className="text-slate-400 text-base max-w-sm mx-auto font-medium leading-relaxed">
            GED Labs Diagnostic Series — Ultimate Master Blueprint
          </p>
        </div>

        {/* Download Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group overflow-hidden"
        >
          {/* Subtle top border accent ring */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

          {/* File Information Layout */}
          <div className="flex items-center gap-4 bg-slate-950/50 border border-slate-800/60 rounded-xl p-4 mb-6 transition-all duration-200 group-hover:border-slate-800">
            <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20 text-red-400 flex-shrink-0">
              <svg
                className="w-8 h-8"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17.5h-1V14h1.8c.9 0 1.4.5 1.4 1.25S10 16.5 9.3 16.5H8.5v1zm0-2h.7c.4 0 .7-.2.7-.75s-.3-.75-.7-.75H8.5v1.5zm4.3 2h-1.2V14H13c1.1 0 1.8.7 1.8 1.75S14.1 17.5 12.8 17.5zm-.2-2.5v1.5h.2c.5 0 .8-.3.8-.75s-.3-.75-.8-.75h-.2zm3.4 0v.75h1.3v.75H16v1h-1V14h2.5v.75H16z" />
              </svg>
            </div>

            <div className="text-left overflow-hidden">
              <p className="text-white font-semibold text-sm truncate">
                ged_social_studies_practice_blueprint.pdf
              </p>
              <p className="text-slate-400 text-xs font-medium mt-0.5">
                45 Authentic Items · 15 Pages[cite: 1]
              </p>
            </div>
          </div>

          {/* Download Action Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleDownload}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-600/30 transition-all duration-200 text-sm flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <svg 
              className="w-4 h-4 animate-bounce" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth={2.5} 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16v1a3 3 0 003 3h12a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download Master Blueprint</span>
          </motion.button>

          {/* Secondary Footer Info */}
          <p className="mt-5 text-slate-500 text-xs text-center font-medium">
            Your document will download automatically. You can safely access or save it on any mobile or desktop workspace.
          </p>
        </motion.div>
      </motion.div>
    </main>
  );
}