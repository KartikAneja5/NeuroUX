import React from 'react';
export default function LivePreviewFrame({ code }) {
  return <iframe className="w-full h-64 border rounded bg-white" title="Live Preview" srcDoc={code} />;
}
