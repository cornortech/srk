import React from "react";
import { Card, CardBody, CardHeader, Link } from "@nextui-org/react";
import {
  Mail,
  Phone,
  Facebook,
  Twitter,
  LinkedinIcon as LinkedIn,
  Contact,
  MailIcon,
  Subtitles,
  MessageCircleDashed,
} from "lucide-react";
import { PrimaryButton } from "../components/ReusableComponents";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
    <div className="min-h-screen bg-bgPrimary text-textPrimary p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl pt-8 pb-6 font-bold mb-8 text-center text-textPrimary">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-bgSecondary text-textPrimary p-4">
            <CardHeader>
              <h2 className="text-2xl font-bold text-primary">Get in Touch</h2>
            </CardHeader>
            <CardBody>
              <form
                onSubmit={handleSubmit}
                className="w-full space-y-8 flex flex-col "
              >
                <div className="flex gap-2 items-center">
                  <Contact className="bg-transparent text-primary " size={30} />
                  <input
                    placeholder="Enter your name"
                    className="px-4 py-2 w-full bg-transparent text-textPrimary outline-none border-b-1"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <MailIcon
                    className="bg-transparent text-primary "
                    size={30}
                  />
                  <input
                    placeholder="Enter your Email"
                    className="px-4 py-2  bg-transparent w-full text-textPrimary outline-none border-b-1"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <Subtitles
                    className="bg-transparent text-primary "
                    size={30}
                  />
                  <input
                    placeholder="Enter Subject"
                    className="px-4 py-2  bg-transparent w-full text-textPrimary outline-none border-b-1"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <MessageCircleDashed
                    className="bg-transparent text-primary "
                    size={30}
                  />
                  <textarea
                    placeholder="Enter your Message"
                    className="px-4 py-2  bg-transparent w-full text-textPrimary outline-none border-b-1"
                  />
                </div>

                <PrimaryButton label="Send Message" />
              </form>
            </CardBody>
          </Card>

          <div className="space-y-6">
            <Card className="bg-bgSecondary text-textPrimary p-4">
              <CardHeader>
                <h2 className="text-2xl font-bold text-primary">
                  Contact Information
                </h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-2 text-primary" />
                    <Link
                      href="mailto:srkcaregroup@gmail.com"
                      className="text-textPrimary"
                    >
                      srkcaregroup@gmail.com
                    </Link>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-primary" />
                    <Link
                      href="tel:+9779769223013"
                      className="text-textPrimary"
                    >
                      +977 976-9223013
                    </Link>
                  </div>
                  {/* <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-primary" />
                    <span>Parbat Modi 2, Nepal</span>
                  </div> */}
                </div>
              </CardBody>
            </Card>

            <Card className="bg-bgSecondary text-textPrimary p-4">
              <CardHeader>
                <h2 className="text-2xl font-bold text-primary">Follow Us</h2>
              </CardHeader>
              <CardBody>
                <div className="flex space-x-4">
                  <Link href="#" aria-label="Facebook">
                    <Facebook className="w-6 h-6 text-primary hover:text-textPrimary transition-colors" />
                  </Link>
                  <Link href="#" aria-label="Twitter">
                    <Twitter className="w-6 h-6 text-primary hover:text-textPrimary transition-colors" />
                  </Link>
                  <Link href="#" aria-label="LinkedIn">
                    <LinkedIn className="w-6 h-6 text-primary hover:text-textPrimary transition-colors" />
                  </Link>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
