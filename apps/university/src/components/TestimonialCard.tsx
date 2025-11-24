"use client";

import { Card, CardBody, CardFooter, Avatar, Divider } from "@nextui-org/react";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  avatarSrc: string;
  name: string;
  testimonial: string;
  rating: number;
}

export default function TestimonialCard({
  avatarSrc,
  name,
  testimonial,
  rating,
}: TestimonialCardProps) {
  return (
    <Card className="max-w-md">
      <CardBody className="gap-4">
        <div className="flex gap-4 items-center">
          <Avatar src={avatarSrc} size="lg" />
          <div>
            <p className="text-lg font-semibold">{name}</p>
          </div>
        </div>
        <p className="text-gray-700 italic">"{testimonial}"</p>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex items-center">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-5 h-5 ${
                index < rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              aria-hidden="true"
            />
          ))}
          <span className="sr-only">{rating} out of 5 stars</span>
        </div>
      </CardFooter>
    </Card>
  );
}
