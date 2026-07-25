import React, { useState } from 'react';
import { FiMaximize2, FiMinimize2, FiRefreshCw, FiCopy, FiCheck } from 'react-icons/fi';

export default function LivePreviewFrame({ code, title = "Live Component Preview", height = "400px" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const handleCopy = () => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedSrcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body {
            background-color: #080712;
            color: #ffffff;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 1.5rem;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        ${code || '<div style="color: #71717a; text-align: center;">No preview code available</div>'}
      </body>
    </html>
  `;

  return (
    <div className={`relative rounded-2xl border border-white/10 overflow-hidden bg-[#0a0918] shadow-2xl transition-all ${isFullscreen ? 'fixed inset-4 z-50 flex flex-col' : ''}`}>
      {/* Frame Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0c22] border-b border-white/8 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-zinc-400 ml-2 truncate max-w-[200px] sm:max-w-none">{title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setReloadKey(prev => prev + 1)}
            title="Reload preview"
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            <FiRefreshCw size={14} />
          </button>
          {code && (
            <button
              onClick={handleCopy}
              title="Copy source code"
              className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-medium rounded-lg border border-white/5 transition"
            >
              {copied ? <FiCheck size={13} className="text-emerald-400" /> : <FiCopy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen preview"}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition"
          >
            {isFullscreen ? <FiMinimize2 size={14} /> : <FiMaximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Frame Viewport */}
      <div className={`w-full relative ${isFullscreen ? 'flex-1' : ''}`} style={{ height: isFullscreen ? '100%' : height }}>
        <iframe
          key={reloadKey}
          className="w-full h-full border-0 bg-[#080712]"
          title={title}
          sandbox="allow-scripts allow-modals"
          srcDoc={formattedSrcDoc}
        />
      </div>
    </div>
  );
}
