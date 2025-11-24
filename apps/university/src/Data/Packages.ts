// interface PackageFeature {
//   name: string;
//   included: boolean;
// }

export interface PackageFeature {
  name: string;
  included: boolean;
  strikethrough?: boolean;
}

export interface IPackage {
  id: string;
  name: string;
  price: number | string;
  buttonText: string;
  features: PackageFeature[];
}

export const packages: IPackage[] = [
  {
    id: "basic",
    name: "SRK Basic",
    price: "RS.2143/month",
    buttonText: "Choose Basic",
    features: [
      { name: "Access to 3 courses", included: true },
      { name: "Course completion certificate", included: true },
      { name: "3+ Pro tips and mentorship", included: true },
      {
        name: "Complimentary access to advanced training systems",
        included: false,
        strikethrough: true,
      },
      {
        name: "24/7 exclusive, dedicated support system",
        included: false,
        strikethrough: true,
      },
      {
        name: "Personalized coaching sessions by distinguished, certified coaches",
        included: false,
        strikethrough: true,
      },
      { name: "Live Session", included: false, strikethrough: true },
      {
        name: "Access to all items from the Ultimate SRK VIP collection",
        included: false,
        strikethrough: true,
      },
    ],
  },
  {
    id: "standard",
    name: "SRK Standard",
    price: "RS.4286/month",
    buttonText: "Choose Standard",
    features: [
      { name: "Access to 5 courses", included: true },
      { name: "Course completion certificate", included: true },
      { name: "24/7 exclusive, dedicated support system", included: true },
      { name: "5+ Pro tips and mentorship", included: true },
      {
        name: "Complimentary access to advanced training systems",
        included: true,
      },
      {
        name: "Personalized coaching sessions by distinguished, certified coaches",
        included: false,
        strikethrough: true,
      },
      { name: "Live Session", included: false, strikethrough: true },
      {
        name: "Access to all items from the Ultimate SRK VIP collection",
        included: false,
        strikethrough: true,
      },
    ],
  },
  {
    id: "premium",
    name: "SRK Premium",
    price: "RS.7143/month",
    buttonText: "Choose Premium",
    features: [
      { name: "Access to 7 courses", included: true },
      { name: "Course completion certificate", included: true },
      {
        name: "Complimentary access to advanced training systems",
        included: true,
      },
      { name: "24/7 exclusive, dedicated support system", included: true },
      {
        name: "Personalized coaching sessions by distinguished, certified coaches",
        included: true,
      },

      {
        name: "7+ Pro tips and mentorship",
        included: true,
      },
      { name: "Live Session", included: false, strikethrough: true },
      {
        name: "Access to all items from the Ultimate SRK VIP collection",
        included: false,
        strikethrough: true,
      },
    ],
  },
  {
    id: "pro",
    name: "SRK PRO",
    price: "RS.10,000/month",
    buttonText: "Choose PRO",
    features: [
      { name: "Access to 10 courses", included: true },
      { name: "Course completion certificate", included: true },
      {
        name: "Complimentary access to advanced training systems",
        included: true,
      },
      { name: "24/7 exclusive, dedicated support system", included: true },
      { name: "10+ Pro tips and mentorship", included: true },
      {
        name: "Personalized coaching sessions by distinguished, certified coaches",
        included: true,
      },
      { name: "Live Session", included: true },
      {
        name: "Access to all items from the Ultimate SRK VIP collection",
        included: true,
      },
    ],
  },
];
