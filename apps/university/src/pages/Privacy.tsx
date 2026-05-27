
import React from "react";
import { Divider } from "@nextui-org/react";

const PrivacyEnrolmentPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Privacy Policy & Enrolment Policy
      </h1>

      <Divider className="my-4" />

      <h2 className="text-xl font-semibold">Privacy Policy</h2>
      <p>
        SRK Group Private Limited ("we", "us", or "our") operates
        TheSRKUniversity.com ("Site"). We are committed to protecting your
        privacy. This Privacy Policy outlines how we collect, use, and safeguard
        your personal information.
      </p>

      <h3 className="text-lg font-medium mt-4">Information We Collect</h3>
      <p>We may collect the following types of information:</p>
      <ul className="list-disc pl-5">
        <li>
          Personal Information: Name, email address, contact details,
          citizenship information, date of birth, live present photo or selfie
          for identity verification, payment information, and any other
          information you voluntarily provide to us.
        </li>
        <li>
          Usage Data: Information about how you use our website, including IP
          address, browser type, pages visited, and the time and date of your
          visit.
        </li>
        <li>
          Cookies and Tracking Technologies: We use cookies and similar tracking
          technologies to enhance your experience on our website and collect
          information about your browsing activities.
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4">How We Use Your Information</h3>
      <p>We use the collected information for the following purposes:</p>
      <ul className="list-disc pl-5">
        <li>
          To Provide and Improve Our Services: We use your information to
          deliver our courses, process enrolments, and improve our educational
          offerings.
        </li>
        <li>
          To Communicate with You: We may use your information to send you
          updates, newsletters, marketing materials, and other communications.
        </li>
        <li>
          To Enhance User Experience: We use cookies and tracking technologies
          to personalize your experience and understand your preferences.
        </li>
        <li>
          To Ensure Security: We implement security measures to protect your
          data from unauthorized access, disclosure, alteration, and
          destruction.
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4">Sharing Your Information</h3>
      <p>
        We do not sell or rent your personal information to third parties. We
        may share your information with:
      </p>
      <ul className="list-disc pl-5">
        <li>
          Service Providers: We may share your information with third-party
          service providers who assist us in operating our website and
          delivering our services.
        </li>
        <li>
          Legal Requirements: We may disclose your information if required by
          law or in response to legal requests.
        </li>
      </ul>

      <h3 className="text-lg font-medium mt-4">Your Rights</h3>
      <p>You have the right to:</p>
      <ul className="list-disc pl-5">
        <li>
          Access and Update Your Information: You can access and update your
          personal information through your account settings.
        </li>
        <li>
          Opt-Out of Communications: You can opt out of receiving marketing
          communications by following the unsubscribe link in our emails or
          contacting us.
        </li>
      </ul>

      <Divider className="my-4" />

      <h2 className="text-xl font-semibold">Enrolment Policy</h2>
      <p>
        All enrolments made through TheSRKUniversity.com are final. We
        encourage you to carefully review all course descriptions, curriculum
        details, and learning objectives before enrolling. This gives you a
        clear picture of the skills and knowledge each course is designed to
        develop. By completing your enrolment, you acknowledge that you have
        reviewed this information and are committed to engaging with the
        educational content provided.
      </p>

      <h3 className="text-lg font-medium mt-4">Exceptional Circumstances</h3>
      <p>
        In exceptional circumstances, such as a technical issue that prevents
        you from accessing the course content you enrolled in, you may contact
        our support team at [contact email] to request assistance. Each
        situation will be reviewed individually and resolved at the sole
        discretion of SRK Group Private Limited.
      </p>

      <h3 className="text-lg font-medium mt-4">Contact Us</h3>
      <p>
        If you have any questions or concerns about our Privacy Policy or
        Enrolment Policy, please contact us at [contact email]. Our support
        team is here to assist you and provide any necessary clarifications.
      </p>
    </div>
  );
};

export default PrivacyEnrolmentPolicy;
