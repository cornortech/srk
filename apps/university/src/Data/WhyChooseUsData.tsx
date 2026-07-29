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
    title: "Learn Practical Skills",
    titleHighlight: "That Matter",
    image: "/videos/131212Animation1.mp4",
    imageAlt: "Learning platform preview",
    features: [
      {
        text: "Study through a simple and modern learning platform designed for a better learning experience.",
        highlight: "",
      },
      {
        text: "Build valuable skills with step-by-step lessons and practical activities.",
        highlight: "",
      },
      {
        text: "Develop skills that support your career, business, and personal growth.",
        highlight: "",
      },
    ],
    icon: "/education.png", // String is still valid with React.ReactNode
  },
  {
    id: 2,
    title: "Join a Supportive",
    titleHighlight: "Learning Community",
    image: "/videos/131212Animation2.mp4",
    imageAlt: "Community preview",
    features: [
      {
        text: "Connect with learners who share your goals and interests.",
        highlight: "",
      },
      {
        text: "Learn together by sharing ideas, experiences, and knowledge.",
        highlight: "",
      },
      {
        text: "Build meaningful connections in a positive and encouraging environment.",
        highlight: "",
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
    title: "Learn from Experienced",
    titleHighlight: "Professionals",
    image: "/videos/131212Animation3.mp4",
    imageAlt: "Learning from experts preview",
    features: [
      {
        text: "Learn from instructors with real industry experience.",
        highlight: "",
      },
      {
        text: "Receive practical guidance throughout your learning journey.",
        highlight: "",
      },
      {
        text: "Explore proven methods and real-world knowledge that you can apply with confidence.",
        highlight: "",
      },
    ],
    icon: "/dollar.png",
  },
];
