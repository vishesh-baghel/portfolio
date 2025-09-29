import React from 'react';

const Footer = () => {
  const websiteUrl = "https://alanagoyal.com";
  const twitterUrl = "https://x.com/alanaagoyal";

  return (
    <footer className="mx-auto px-2 py-10 text-center font-mono">
      <div className="flex justify-center space-x-1">
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center p-1 text-xs text-muted-foreground no-underline hover:text-foreground"
        >
          [w] website
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center p-1 text-xs text-muted-foreground no-underline hover:text-foreground"
        >
          [t] twitter
        </a>
      </div>
    </footer>
  );
};

export default Footer;