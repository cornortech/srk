import { Card, CardBody, Divider } from "@nextui-org/react";

const AffiliateTerms = () => {
  return (
    <div className="flex justify-center p-6  text-white min-h-screen">
      <Card className="max-w-3xl w-full p-6 bg-transparent">
        <CardBody>
          <h1 className="text-2xl font-bold mb-4">
            Partner Programme Terms and Conditions
          </h1>

          <h2 className="text-xl font-semibold mt-4">Eligibility</h2>
          <Divider className="my-2" />
          <p>Partners must be at least 18 years old.</p>
          <p>
            Partners must have enrolled in a course before joining the partner
            programme. This ensures that recommendations are made from genuine
            first-hand experience of the educational content.
          </p>

          <h2 className="text-xl font-semibold mt-4">Referral Benefit Structure</h2>
          <Divider className="my-2" />
          <p>
            Referral benefits are allocated based on the course that the
            referred student enrols in. The benefit amount varies by course.
          </p>
          <p>Referral credits are calculated at the point of verified enrolment.</p>
          <p>The minimum credit transfer threshold is NPR 500.</p>

          <h2 className="text-xl font-semibold mt-4">Referral Process</h2>
          <Divider className="my-2" />
          <p>
            Partners must use their unique referral link for tracking purposes.
          </p>

          <h2 className="text-xl font-semibold mt-4">Credit Transfer Terms</h2>
          <Divider className="my-2" />
          <p>
            Credit transfers are processed via bank transfer only after 24 to
            48 hours following a verified referred enrolment, after examining
            all activities of the referring partner.
          </p>
          <p>
            Partners are responsible for providing accurate bank account
            details for credit transfers.
          </p>
          <p>A 15% TDS deduction applies on all credit transfers.</p>

          <h2 className="text-xl font-semibold mt-4">
            Enrolment and Cancellations
          </h2>
          <Divider className="my-2" />
          <p>
            All enrolments are final. Participants should review all programme
            information carefully before joining to ensure they understand the
            commitment involved.
          </p>

          <h2 className="text-xl font-semibold mt-4">Promotion Guidelines</h2>
          <Divider className="my-2" />
          <p>
            Partners must comply with all applicable laws and regulations,
            including data protection, privacy laws, and the Advertisement
            (Regulation) Act, 2019.
          </p>
          <p>
            Misleading or false promotion is strictly prohibited and may result
            in immediate removal from the programme.
          </p>
          <p>
            Spam, unsolicited messages, or any form of unethical promotional
            practices are not permitted.
          </p>
          <p>
            Partners must provide truthful and accurate information about the
            educational content and what students can expect to learn. Misleading
            claims about learning outcomes are not permitted.
          </p>

          <h2 className="text-xl font-semibold mt-4">Intellectual Property</h2>
          <Divider className="my-2" />
          <p>
            Partners may use approved promotional materials provided by the
            company.
          </p>
          <p>
            Any use of the company's logos, trademarks, or copyrighted material
            must be pre-approved in writing.
          </p>
          <p>Reproducing or distributing course content is not permitted.</p>

          <h2 className="text-xl font-semibold mt-4">Term and Termination</h2>
          <Divider className="my-2" />
          <p>
            The partner agreement is ongoing until terminated by either party
            with a 15-day written notice.
          </p>
          <p>
            The company reserves the right to remove any partner for violation
            of these terms without prior notice.
          </p>

          <h2 className="text-xl font-semibold mt-4">Confidentiality</h2>
          <Divider className="my-2" />
          <p>
            Partners must maintain the confidentiality of any proprietary
            information shared by the company.
          </p>
          <p>
            This includes, but is not limited to, enrolment data, promotional
            strategies, and student information.
          </p>

          <h2 className="text-xl font-semibold mt-4">Liability</h2>
          <Divider className="my-2" />
          <p>
            The company is not liable for any outcomes resulting from partner
            activities.
          </p>
          <p>
            Partners agree to indemnify the company against any claims arising
            from their promotional activities.
          </p>

          <h2 className="text-xl font-semibold mt-4">Modifications</h2>
          <Divider className="my-2" />
          <p>
            The company reserves the right to modify these terms and conditions
            at any time.
          </p>
          <p>
            Partners should review the partner terms periodically as there is
            no separate notification policy for changes to programme terms.
          </p>
          <p>
            Continued participation in the programme after any changes
            constitutes acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-semibold mt-4">Reporting</h2>
          <Divider className="my-2" />
          <p>
            Partners will have access to a dashboard showing their referral
            activity, accumulated credits, and credit transfer history.
          </p>
          <p>
            Any discrepancies in reporting must be raised with the partner
            management team within 24 hours of being identified.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default AffiliateTerms;
