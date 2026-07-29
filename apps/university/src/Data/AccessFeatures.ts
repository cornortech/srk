interface IAccessFeature {
  title: string;
  description: string;
  image: string;
  points: string[];
}

export const accessFeatures: IAccessFeature[] = [
  {
    title: "WELL-STRUCTURED LEARNING PROGRAMS",
    description:
      "Access a growing library of courses, tutorials, and learning resources designed to help you build practical skills and stay updated with modern industry practices.",
    image: "/videos/LightBlackAnimation1.mp4",
    points: [
      "Easy-to-follow learning modules",
      "Practical skills for career and business growth",
      "Flexible online learning anytime, anywhere",
    ],
  },
  {
    title: "INTERACTIVE LIVE LEARNING SESSIONS",
    description:
      "Join live sessions with experienced instructors, ask questions, receive practical guidance, and learn through real discussions that make every lesson more valuable.",
    image: "/videos/LightBlackAnimation2.mp4",
    points: [],
  },
  {
    title: "A COMMUNITY THAT GROWS TOGETHER",
    description: "",
    image: "/videos/LightBlackAnimation3.mp4",

    points: [
      "Connect with learners from different backgrounds.",
      "Share ideas, experiences, and practical knowledge.",
      "Learn in a supportive community that encourages continuous growth.",
    ],
  },
];
