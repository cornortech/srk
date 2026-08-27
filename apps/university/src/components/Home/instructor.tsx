import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Card, CardBody } from "@nextui-org/react";
import Slider from "react-slick";

// Sample instructor data
const instructors = [
  {
    id: 1,
    name: "Dr. Emily Carter",
    faculty: "Computer Science",
    img: "/instructor.webp",
  },
  {
    id: 2,
    name: "Prof. James Wilson",
    faculty: "Business Administration",
    img: "/instructor.webp",
  },
  {
    id: 3,
    name: "Dr. Olivia Brown",
    faculty: "Data Science",
    img: "/instructor.webp",
  },
  {
    id: 4,
    name: "Mr. David Johnson",
    faculty: "Graphic Design",
    img: "/instructor.webp",
  },
  {
    id: 5,
    name: "Ms. Sophia Taylor",
    faculty: "Marketing",
    img: "/instructor.webp",
  },
];

export const settings = {
  dots: true, // Show dots for navigation
  infinite: false, // Stop sliding when all items are shown
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  initialSlide: 0,
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        arrows: true,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      },
    },
  ],
};
export function InstructorCarousel() {
  return (
    <div className="w-full max-w-custom mx-auto px-8 py-12 my-10">
      <div className="mb-8">
        <div data-aos="fade-down">
          {" "}
          <h2
            className="text-3xl font-bold text-center mb-2 text-textPrimary"
            data-aos="fade-right"
            data-aos-duration="1200"
          >
            Meet Our Instructors
          </h2>
          <p className="text-gray-100">
            Learn from the Best—Meet Our Expert Instructors and Master Your
            Skills!
          </p>
        </div>
      </div>
      <Slider {...settings}>
        {instructors.map((instructor) => (
          <div key={instructor.id}>
            <Card className="p-4 bg-bgSecondary text-center flex flex-col items-center">
              <div
                className="w-full h-64 bg-no-repeat bg-cover "
                style={{
                  backgroundImage: `url(${instructor.img})`,
                }}
              ></div>
              <CardBody>
                <p className="text-lg font-semibold text-textPrimary">
                  {instructor.name}
                </p>
                <p className="text-sm text-textSecondary">
                  {instructor.faculty}
                </p>
              </CardBody>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
}
