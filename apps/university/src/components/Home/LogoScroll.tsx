const LogoScroller = () => {
  // Array of logo URLs or paths (you can replace these with your actual logo paths)
  const logos = [
    "/news/Annapurna.png",
    "/news/onlineKhabar.png",
    "/news/News24.png",
    "https://connect.poscraft.co.uk/images/1419/Company/7948756c267c47c98831ed141f51775a.png",
    "https://english.ratopati.com/build/img/logo-rp.png",
    "https://play-lh.googleusercontent.com/hPKWXwjSL-hmYLaDGXz6UZzAtcsx1YbvRKcdcB182IxLbjV42BKMaa-J5Lknt8DFOPcu",
    "https://res.cloudinary.com/dpqvbxdpf/image/upload/h_720,c_scale,f_auto/v1643280266/uploads/CoverPic/egpfm32kxt6glzigfmun.png",
    "https://upload.wikimedia.org/wikipedia/en/c/c6/AP1_TV_LOGO.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSp8A1bfZfwSBPzBydtfxBA9mj41kYk10QkpsZdF2cddt-g24HNLSqxwFNQ587-_5VOGM&usqp=CAU",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyQb61Qa_X0EUlfVpUgSTGm3P8W2s4ncwVGA&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6IZGRsGD1TzNWmhI_meR5ypo4BmF6CpMr3OKiv7aYvsQyEc6ShmOvXHUoubof0atqNcY&usqp=CAU",
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
