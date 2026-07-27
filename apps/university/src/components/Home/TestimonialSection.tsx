// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { Card, CardBody, Avatar } from "@nextui-org/react";
// import { Star } from "lucide-react";
// import Slider from "react-slick";
// import { settings } from "./instructor";

// const testimonials = [
//   {
//     id: 1,
//     name: "Sarah Johnson",
//     role: "Marketing Manager",
//     avatar: "/placeholder.svg?height=100&width=100",
//     content:
//       "This product has revolutionized our marketing efforts. It's intuitive, powerful, and the results speak for themselves.",
//     rating: 5,
//   },
//   {
//     id: 2,
//     name: "Michael Chen",
//     role: "Software Engineer",
//     avatar: "/placeholder.svg?height=100&width=100",
//     content:
//       "As a developer, I appreciate the robust API and excellent documentation. It's made integration a breeze.",
//     rating: 4,
//   },
//   {
//     id: 3,
//     name: "Emily Rodriguez",
//     role: "Small Business Owner",
//     avatar: "/placeholder.svg?height=100&width=100",
//     content:
//       "This solution has helped my small business compete with larger companies. The customer support is also top-notch.",
//     rating: 5,
//   },
//   {
//     id: 4,
//     name: "David Kim",
//     role: "UX Designer",
//     avatar: "/placeholder.svg?height=100&width=100",
//     content:
//       "The user interface is sleek and intuitive. It's clear that a lot of thought went into the design and user experience.",
//     rating: 4,
//   },
//   {
//     id: 5,
//     name: "Anna Lee",
//     role: "Project Manager",
//     avatar: "/placeholder.svg?height=100&width=100",
//     content:
//       "This tool has significantly improved our team's productivity and collaboration.",
//     rating: 5,
//   },
// ];

// export function TestimonialCarousel() {
//   return (
//     <div className="w-full  mx-auto px-8 py-4 bg-bgSecondary my-12">
//       <div className="mb-8">
//         <h2
//           className="text-3xl font-bold text-center mb-2 text-textPrimary"
//           data-aos="fade-right"
//           data-aos-offset="300"
//           data-aos-easing="ease-in-sine"
//           date-aos-duration="12000"
//         >
//           What Our Customers Say
//         </h2>
//         <p>Voices of Success—See What Our Customers Have to Say!</p>
//       </div>
//       <Slider {...settings}>
//         {testimonials.map((testimonial) => (
//           <div key={testimonial.id} className="px-2">
//             {" "}
//             <Card className="h-64 p-4 bg-black/25   flex">
//               <CardBody className="py-2">
//                 <div className="flex flex-col h-full justify-between ">
//                   <div className="flex items-center ">
//                     <Avatar src={testimonial.avatar} className="w-16 h-16" />
//                     <div className="ml-4">
//                       <p className="font-semibold text-textPrimary">
//                         {testimonial.name}
//                       </p>
//                       <p className="text-sm text-textSecondary">
//                         {testimonial.role}
//                       </p>
//                       {/* Rating Section */}
//                       <div className="flex items-center mt-2">
//                         {[...Array(5)].map((_, starIndex) => (
//                           <Star
//                             key={starIndex}
//                             className={`w-5 h-5 ${
//                               starIndex < testimonial.rating
//                                 ? "text-yellow-400 fill-yellow-400"
//                                 : "text-gray-300"
//                             }`}
//                             aria-hidden="true"
//                           />
//                         ))}
//                         <span className="sr-only">
//                           {testimonial.rating} out of 5 stars
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-lg italic text-textPrimary">
//                     &ldquo;{testimonial.content}&rdquo;
//                   </p>
//                 </div>
//               </CardBody>
//             </Card>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// }

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
import { InfiniteMovingCardsDemo } from "./InfiniteCardDemo";

export function TestimonialCarousel() {
  return (
    <div
      className="w-full bg-bgTernary  mx-auto px-8 py-4  my-12"
      data-aos="fade-right"
      data-aos-duration="1200"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-textPrimary">
          Real Feedback from Our Learning Community
        </h2>
        <p>
          Discover how learners have strengthened their skills and achieved
          their goals through The SRK University.
        </p>
      </div>
      <InfiniteMovingCardsDemo />
    </div>
  );
}
