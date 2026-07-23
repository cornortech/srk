import { motion } from "framer-motion";

import React, { useState } from "react";

export const AnimationButton = ({
  label = "SIGN UP NOW",
  onClick,
}: {
  label?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-40 h-14 mx-auto"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={onClick}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.button
        className="absolute w-full h-full border-4 cursor-pointer border-[#b68938] text-[#b68938] font-bold rounded-lg flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          position: "absolute",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {label}
      </motion.button>

      <motion.button
        className="absolute w-full h-full bg-custom-gradient text-bgPrimary font-bold rounded-lg flex items-center justify-center"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          position: "absolute",
          transformStyle: "preserve-3d",
        }}
        animate={{ rotateX: isFlipped ? 0 : 180 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {label}
      </motion.button>
    </motion.div>
  );
};
