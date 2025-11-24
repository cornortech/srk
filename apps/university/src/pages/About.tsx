import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { BookOpen, Users, Award, Globe } from "lucide-react";

// const teamMembers = [
//   {
//     name: "Dr. Jane Smith",
//     role: "Founder & CEO",
//     avatar: "/placeholder.svg?height=128&width=128",
//   },
//   {
//     name: "John Doe",
//     role: "Head of Curriculum",
//     avatar: "/placeholder.svg?height=128&width=128",
//   },
//   {
//     name: "Emily Johnson",
//     role: "Lead Instructor",
//     avatar: "/placeholder.svg?height=128&width=128",
//   },
//   {
//     name: "Michael Brown",
//     role: "Technology Director",
//     avatar: "/placeholder.svg?height=128&width=128",
//   },
// ];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-custom mx-auto sm:px-6 sm:py-10">
        <h1 className="text-4xl font-bold mb-8 pb-8 pt-4 text-center text-textPrimary">
          About SRK University
        </h1>

        <div className="flex flex-col md:flex-row items-start gap-8">
          <Card className="bg-bgSecondary text-textPrimary sm:py-6 sm:px-4 mb-8">
            <CardBody>
              <p className="text-lg mb-6">
                Welcome to SRK University, where the spark of an idea has
                ignited a revolution in learning. We are a dynamic EdTech
                platform dedicated to empowering dreamers, thinkers, and doers
                by delivering world-class learning experiences that transcend
                borders and backgrounds. Our mission is to weave quality
                education into the fabric of every life, proving that digital
                learning stands on nearly the same level as physical
                learning—equipping individuals to become self-dependent and
                thrive in today’s world of technology and innovation.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Diverse Courses</p>
                </div>
                <div>
                  <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Growing Community</p>
                </div>
                <div>
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Expert Instructors</p>
                </div>
                <div>
                  <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Global Reach</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-bgSecondary text-textPrimary py-6 px-4 mb-8">
            <CardHeader>
              <h2 className="text-2xl font-bold text-primary">Our Story</h2>
            </CardHeader>
            <CardBody className="flex flex-col gap-y-2">
              <p>
                Welcome to SRK University, where the spark of an idea has
                ignited a revolution in learning. Born on a visionary day in
                December 2023 under the stewardship of SRK Group Private
                Limited, our journey began with a singular, bold ambition: to
                weave quality education into the fabric of every life, no matter
                the distance or circumstance. From that seed of inspiration, we
                took our first official steps in April 2024, culminating in our
                grand launch as a dynamic EdTech platform on February 17, 2025.
              </p>
              <p>
                What started as a humble collection of coding tutorials has
                blossomed into a vibrant ecosystem of knowledge, offering a
                kaleidoscope of courses across diverse disciplines. At SRK
                University, we’re not just an educational platform. We’re a
                gateway to limitless possibilities. Our mission is to empower
                dreamers, thinkers, and doers by delivering world-class learning
                experiences that transcend borders and backgrounds.
              </p>
              <p>
                We are not just another random online university; we are here
                with a mission to prove to everyone that in today’s world of
                technology and innovation, one can learn online, become
                self-dependent, and even earn a living through freelancing
                .Regardless of whether they secure a traditional job. We aim to
                demonstrate that digital learning is in no way inferior to
                physical learning; it stands on nearly the same level.
              </p>{" "}
              <p>
                Backed by the innovative spirit of a forward-thinking corporate
                entity, we blend cutting-edge technology with a deep passion for
                education. Every lesson, every course, and every connection we
                foster is a step toward building a brighter, more inclusive
                future. Join us as we redefine what it means to learn, grow, and
                thrive. Because at SRK University, education isn’t just a
                privilege; it’s a promise.
              </p>
              <p>
                Note: We have just added Part 1 of our courses, out of a planned
                4 parts. The remaining parts will be launched based on the
                demand of our learners and customers. Stay tuned!
              </p>
            </CardBody>
          </Card>
        </div>
        <div className="flex justify-center items-center w-full">
          <div className="flex flex-col  items-center gap-2">
            <h3 className="text-2xl underline font-bold text-primary">
              {" "}
              www.srkuniversity.com{" "}
            </h3>
            <i className="text-xl font-bold text-white">Operated By</i>
            <h3 className="text-2xl font-bold text-primary mb-4">
              SRK Group Private Limited{" "}
            </h3>
          </div>
        </div>

        {/* <Card className="bg-bgSecondary text-textPrimary p-4">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Meet Our Team</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <div key={index} className="flex items-center">
                  <Avatar src={member.avatar} className="w-16 h-16 mr-4" />
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card> */}
      </div>
    </div>
  );
}
