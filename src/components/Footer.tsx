const SEAL_FONT =
  'Bahnschrift SemiCondensed, Bahnschrift, Barlow Condensed, Arial Narrow, sans-serif';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <svg className="seal" viewBox="0 0 200 200" role="img" aria-label="Brolympics seal">
          <defs>
            <path id="seal-arc-top" d="M 30 100 A 70 70 0 0 1 170 100" fill="none" />
            <path id="seal-arc-bot" d="M 16 100 A 84 84 0 0 0 184 100" fill="none" />
          </defs>
          <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <text
            fontFamily={SEAL_FONT}
            fontWeight="700"
            fontSize="22"
            letterSpacing="7"
            fill="currentColor"
          >
            <textPath href="#seal-arc-top" startOffset="50%" textAnchor="middle">
              BROLYMPICS
            </textPath>
          </text>
          <text
            fontFamily={SEAL_FONT}
            fontWeight="600"
            fontSize="15"
            letterSpacing="6"
            fill="currentColor"
          >
            <textPath href="#seal-arc-bot" startOffset="50%" textAnchor="middle">
              EST. 2026
            </textPath>
          </text>
          <circle cx="21" cy="100" r="3" fill="#D7322B" />
          <circle cx="179" cy="100" r="3" fill="#D7322B" />
          <text
            x="100"
            y="124"
            textAnchor="middle"
            fontFamily="Georgia, Gelasio, serif"
            fontWeight="700"
            fontStyle="italic"
            fontSize="72"
            fill="currentColor"
          >
            B
          </text>
          <rect x="72" y="134" width="56" height="5" fill="#D7322B" />
        </svg>
        <div className="site-footer__text">
          <span className="label">Issued by the Committee</span>
          <p className="body">
            Rulings are final. Footage is reviewed when the Committee decides footage should be
            reviewed.
          </p>
          <p className="site-footer__fine">
            Team names, colours and every figure on this page are placeholders until draft night.
            The prize is still being decided.
          </p>
        </div>
      </div>
    </footer>
  );
}
