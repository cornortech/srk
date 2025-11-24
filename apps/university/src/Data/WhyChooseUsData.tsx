// sections.tsx
import React from "react";

export interface Feature {
  text: string;
  highlight: string;
}

export interface IWhyChooseUsSection {
  id: number;
  title: string;
  titleHighlight: string;
  image: string;
  imageAlt: string;
  features: Feature[];
  reverse?: boolean;
  icon: React.ReactNode; // Supports JSX or strings
}

export const whyChooseUsData: IWhyChooseUsSection[] = [
  {
    id: 1,
    title: "Uncover",
    titleHighlight: "Essential Lessons",
    image: "/videos/131212Animation1.mp4",
    imageAlt: "Learning platform preview",
    features: [
      {
        text: "Experience a tailored,",
        highlight: "state-of-the-art learning platform.",
      },
      {
        text: "Ascend to become ultimately ",
        highlight: " skilled faster than you ever dreamed of.",
      },
      {
        text: "Master skills",
        highlight: "to achieve financial independence.",
      },
    ],
    icon: "/education.png", // String is still valid with React.ReactNode
  },
  {
    id: 2,
    title: "Join an",
    titleHighlight: "EXCLUSIVE COMMUNITY",
    image: "/videos/131212Animation2.mp4",
    imageAlt: "Community preview",
    features: [
      {
        text: "Share your achievements with",
        highlight: "those who genuinely understand.",
      },
      {
        text: "Forge valuable ",
        highlight: "connections with driven, like-minded individuals.",
      },
      {
        text: "Network with a vibrant",
        highlight: "community of numerous members.",
      },
    ],
    reverse: true,
    icon: (
      <svg
        className="w-8 h-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "LEARN FROM THE",
    titleHighlight: "Pinnacle of the Industry",
    image: "/videos/131212Animation3.mp4",
    imageAlt: "Learning from experts preview",
    features: [
      {
        text: "Gain direct access to industry giants",
        highlight: "who have achieved unparalleled triumph.",
      },
      {
        text: "Receive comprehensive",
        highlight: "mentorship meticulously tailored to your growth.",
      },
      {
        text: "Unlock exclusive, bespoke strategies",
        highlight: "from seasoned experts who’ve conquered the field.",
      },
    ],
    icon: "/dollar.png",
  },
];
