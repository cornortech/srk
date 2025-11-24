import React from 'react';

interface TestimonialCardProps {
  name: string;
  testimonial: string;
  image?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, testimonial, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {image && <img src={image} alt={name} className="w-16 h-16 rounded-full mb-4" />}
      <p className="text-gray-600 mb-4">"{testimonial}"</p>
      <p className="font-semibold">{name}</p>
    </div>
  );
};
