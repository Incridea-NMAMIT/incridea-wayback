export default function EventDetails({ details }: { details: string }) {

    if (!details) return null;

    const styles = `
      .description-preview ul {
          list-style-type: disc !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
      }
      .description-preview ol {
          list-style-type: decimal !important;
          padding-left: 1.5rem !important;
          margin-top: 0.5rem !important;
          margin-bottom: 0.5rem !important;
      }
      .description-preview li {
          margin-bottom: 0.25rem !important;
      }
      /* Header base styles */
      .description-preview h1, 
      .description-preview h2, 
      .description-preview h3, 
      .description-preview h4, 
      .description-preview h5, 
      .description-preview h6,
      .description-preview h7 {
          font-weight: 700 !important;
          color: #f1f5f9 !important; /* slate-100 */
          margin-top: 1.5em !important;
          margin-bottom: 0.5em !important;
          line-height: 1.3 !important;
      }

      /* Specific header sizes - apply to tag and children to override inline styles */
      .description-preview h1, .description-preview h1 * { font-size: 1.5rem !important; }
      .description-preview h2, .description-preview h2 * { font-size: 1.25rem !important; }
      .description-preview h3, .description-preview h3 * { font-size: 1.125rem !important; }
      .description-preview h4, .description-preview h4 * { font-size: 1rem !important; }
      .description-preview h5, .description-preview h5 * { font-size: 0.875rem !important; }
      .description-preview h6, .description-preview h6 * { font-size: 0.75rem !important; }
      
      @media (min-width: 640px) {
        .description-preview h1, .description-preview h1 * { font-size: 2.25rem !important; }
        .description-preview h2, .description-preview h2 * { font-size: 1.875rem !important; }
        .description-preview h3, .description-preview h3 * { font-size: 1.5rem !important; }
        .description-preview h4, .description-preview h4 * { font-size: 1.25rem !important; }
        .description-preview h5, .description-preview h5 * { font-size: 1.125rem !important; }
        .description-preview h6, .description-preview h6 * { font-size: 1rem !important; }
      }

      /* Additional styles for specific headers */
      .description-preview h2 { border-bottom: 1px solid #334155; padding-bottom: 0.3em; }
      .description-preview h6 { text-transform: uppercase !important; letter-spacing: 0.05em !important; color: #cbd5e1 !important; /* slate-300 */ }
      .description-preview h7 { display: block !important; text-transform: uppercase !important; letter-spacing: 0.05em !important; color: #94a3b8 !important; /* slate-400 */ }
      
      .description-preview p {
          margin-bottom: 1em !important;
          line-height: 1.6 !important;
      }
      
      .description-preview strong, 
      .description-preview b,
      .description-preview strong *, 
      .description-preview b * {
          font-weight: 700 !important;
          color: #f8fafc !important; /* slate-50 */
      }
      
      .description-preview blockquote {
          border-left: 4px solid #64748b !important; /* slate-500 */
          padding-left: 1em !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          font-style: italic !important;
          color: #cbd5e1 !important; /* slate-300 */
      }
      
      .description-preview pre {
          background-color: #1e293b !important; /* slate-800 */
          border: 1px solid #334155 !important; /* slate-700 */
          border-radius: 0.375rem !important;
          padding: 1em !important;
          overflow-x: auto !important;
          margin-top: 1em !important;
          margin-bottom: 1em !important;
      }
      
      .description-preview code {
          font-family: monospace !important;
          font-size: 0.9em !important;
          background-color: #1e293b !important;
          padding: 0.2em 0.4em !important;
          border-radius: 0.25rem !important;
          color: #e2e8f0 !important;
      }
      
      .description-preview pre code {
          background-color: transparent !important;
          padding: 0 !important;
          color: inherit !important;
          font-size: inherit !important;
      }

      .description-preview * {
          color: inherit !important;
          background-color: transparent !important;
      }

      .description-preview a {
          color: #38bdf8 !important; /* sky-400 */
          text-decoration: underline !important;
          text-underline-offset: 4px !important;
      }
  `;

    return (
        <div className="w-full">
            <style>{styles}</style>
            <div
                className="description-preview prose prose-invert prose-slate max-w-none text-white dark:prose-p:text-slate-300 prose-p:text-base sm:prose-p:text-sm prose-li:text-base sm:prose-li:text-sm prose-headings:text-slate-200"
                style={{ fontFamily: "'OutfitRegular', sans-serif" }}
                dangerouslySetInnerHTML={{ __html: details }}
            />
        </div>
    );
}
