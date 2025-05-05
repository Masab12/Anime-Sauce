import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-20 py-8 text-center border-t border-surface">
      <p className="text-muted text-sm">
        Built with 🔥 by <a href="https://github.com/masab12" target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:text-primary-light transition-colors font-medium">Masab Farooque</a>
      </p>
      <p className="text-muted text-xs mt-2">
        Utilizes the incredible <a href="https://trace.moe/" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-primary-light transition-colors">trace.moe API</a>. This project is not affiliated with trace.moe.
      </p>
    </footer>
  );
};

export default Footer;