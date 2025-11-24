"use client";

import React, { useEffect, useState } from "react";
import { cn } from "../../lib/utils";
import moment from "moment";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
  index,
}: {
  items: {
    quote: string;
    name: string;
    theme: string;
    date: string;
    title: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
  index: number;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
  }, []);

  const userImages = [
    "https://img.freepik.com/premium-vector/reddit-logo_578229-207.jpg",
    "https://static.vecteezy.com/system/resources/previews/019/493/250/non_2x/discord-logo-discord-icon-discord-symbol-free-free-vector.jpg",
  ];

  const getRandomUserImage = () => {
    const randomIndex = Math.floor(Math.random() * userImages.length);
    return userImages[randomIndex];
  };

  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };
  return (
    <div
      ref={containerRef}
      className={cn(
        " relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item) => (
          <li
            className="relative w-[350px] max-w-full shrink-0 rounded-2xl border border-b-0 border-zinc-200 bg-[linear-gradient(180deg,#fafafa,#f5f5f5)] px-8 py-6 md:w-[450px] dark:border-zinc-700 dark:bg-[linear-gradient(180deg,#27272a,#18181b)]"
            key={item.name}
          >
            <blockquote className="flex flex-col gap-y-2 items-start">
              <div className="relative z-20 mt-2 flex flex-row items-center">
                <div className="flex  items-start gap-x-2">
                  <img
                    className="w-[30px] h-[30px] rounded-full"
                    src={getRandomUserImage()}
                    alt=""
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                      {/* {item.name} */}
                    </span>{" "}
                    <span className="text-xs leading-[1.6] font-normal text-neutral-500 dark:text-gray-400">
                      {" "}
                      {/* At 20th May , 2023{" "} */}

                      {moment(item.date).format("LLL")}
                    </span>
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="user-select-none pointer-events-none absolute -top-0.5 -left-0.5 -z-1 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
              ></div>
              <span className="relative z-20   text-start text-md font-bold leading-[1.6]  text-neutral-800 dark:text-gray-100">
                {index == 1 ? "❤️" : "💥"} {item.theme}
              </span>
              <span className="relative z-20 text-start text-sm leading-[1.6] font-normal text-neutral-800 dark:text-gray-100">
                {item.quote}
              </span>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
