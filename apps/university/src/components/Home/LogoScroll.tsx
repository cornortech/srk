const LogoScroller = () => {
  // Self-hosted (previously hotlinked from 8 different third-party domains,
  // each costing a separate DNS/TCP/TLS handshake on top of bandwidth
  // contention with the hero image during the LCP window), and re-encoded
  // as WebP at 2x their 40px display height (originals were 60-150KB full
  // size logos rendered at 40px tall — ~93% smaller combined with no
  // visible quality loss at display size).
  // NOTE: "news24-duplicate.png" duplicates News24.png above (same brand,
  // both were in the original hotlinked list) and "pagodaLogo-unidentified.png"
  // came from a Google Image Search thumbnail cache with no clear source —
  // worth reviewing/replacing with a proper asset.
  const logos = [
    "/news/Annapurna.webp",
    "/news/onlineKhabar.webp",
    "/news/News24.webp",
    "/news/himalayanTimes.webp",
    "/news/ratopati.webp",
    "/news/sagarmathaTv.webp",
    "/news/atv.webp",
    "/news/ap1tv.webp",
    "/news/pagodaLogo-unidentified.webp",
    "/news/kathmanduPost.webp",
    "/news/news24-duplicate.webp",
  ];

  return (
    <div
      //   css={{
      //     overflow: "hidden",
      //     whiteSpace: "nowrap",
      //     background: "#000",
      //     padding: "20px 0",
      //       }}
      className="overflow-hidden whitespace-nowrap h-24 pb-6 items-center flex bg-black py-4"
    >
      <div className="scroller">
        {/* Render logos twice to create the infinite effect */}
        {[...logos, ...logos].map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Media partner ${(index % logos.length) + 1}`}
            width={120}
            height={40}
            loading="lazy"
            decoding="async"
            style={{
              height: "40px",
              width: "auto",
              margin: "0 20px",
              display: "inline-block",
              filter: "grayscale(100%) opacity(0.7)",
            }}
          />
        ))}
      </div>

      {/* CSS for the scrolling animation */}
      <style>{`
        .scroller {
          display: inline-block;
          animation: scroll 20s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(
              -50%
            ); /* Move to the left by half the total width (since we duplicated the logos) */
          }
        }

        /* Optional: Pause animation on hover */
        .scroller:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LogoScroller;
