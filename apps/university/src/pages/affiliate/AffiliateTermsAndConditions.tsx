import { Card, CardBody, Divider } from "@nextui-org/react";

const AffiliateTerms = () => {
  return (
    <div className="flex justify-center p-6  text-white min-h-screen">
      <Card className="max-w-3xl w-full p-6 bg-transparent">
        <CardBody>
          <h1 className="text-2xl font-bold mb-4">
            Affiliate Program Terms and Conditions
          </h1>

          <h2 className="text-xl font-semibold mt-4">Eligibility</h2>
          <Divider className="my-2" />
          <p>Affiliates must be at least 18 years old.</p>
          <p>
            Affiliates must have purchased a package before joining the
            affiliate program.
          </p>

          <h2 className="text-xl font-semibold mt-4">Commission Structure</h2>
          <Divider className="my-2" />
          <p>
            Commission is offered based on the package purchased by the referred
            user. For each package, the commission amount is different.
          </p>
          <p>Commissions are calculated within the purchase.</p>
          <p>The minimum payout threshold is NPR 500.</p>

          <h2 className="text-xl font-semibold mt-4">Referral Process</h2>
          <Divider className="my-2" />
          <p>
            Affiliates must use their unique referral link for tracking
            purposes.
          </p>

          <h2 className="text-xl font-semibold mt-4">Payment Terms</h2>
          <Divider className="my-2" />
          <p>
            Payments are processed via bank transfer only after 24 to 48 hours
            of the referred purchase, after examining all activities of the
            affiliate promoter.
          </p>
          <p>
            Affiliates are responsible for providing accurate payment
            information, including bank account details.
          </p>
          <p>We have a 15% TDS amount deduction policy.</p>

          <h2 className="text-xl font-semibold mt-4">
            Refunds and Cancellations
          </h2>
          <Divider className="my-2" />
          <p>
            We have no refund policy. The user should be clear about all
            information before joining.
          </p>

          <h2 className="text-xl font-semibold mt-4">Marketing Guidelines</h2>
          <Divider className="my-2" />
          <p>
            Affiliates must comply with all applicable laws and regulations,
            including data protection, privacy laws, and the Advertisement
            (Regulation) Act, 2019.
          </p>
          <p>
            Misleading or false advertising is strictly prohibited and may
            result in immediate termination from the program.
          </p>
          <p>
            Spam, unsolicited emails, or any form of unethical marketing
            practices are not allowed.
          </p>
          <p>
            Affiliates must provide truthful and clear information, including
            experience disclosures, to avoid misleading potential customers.
          </p>

          <h2 className="text-xl font-semibold mt-4">Intellectual Property</h2>
          <Divider className="my-2" />
          <p>
            Affiliates may use approved marketing materials provided by the
            company.
          </p>
          <p>
            Any use of the company’s logos, trademarks, or copyrighted material
            must be pre-approved in writing.
          </p>
          <p>Copyrighting the courses isn't allowed.</p>

          <h2 className="text-xl font-semibold mt-4">Term and Termination</h2>
          <Divider className="my-2" />
          <p>
            The affiliate agreement is ongoing until terminated by either party
            with a 15-day written notice.
          </p>
          <p>
            The company reserves the right to terminate any affiliate for
            violation of these terms without prior notice.
          </p>

          <h2 className="text-xl font-semibold mt-4">Confidentiality</h2>
          <Divider className="my-2" />
          <p>
            Affiliates must maintain the confidentiality of any proprietary
            information shared by the company.
          </p>
          <p>
            This includes, but is not limited to, sales data, marketing
            strategies, and customer information.
          </p>

          <h2 className="text-xl font-semibold mt-4">Liability</h2>
          <Divider className="my-2" />
          <p>
            The company is not liable for any losses or damages resulting from
            affiliate activities.
          </p>
          <p>
            Affiliates agree to indemnify the company against any claims arising
            from their marketing activities.
          </p>

          <h2 className="text-xl font-semibold mt-4">Modifications</h2>
          <Divider className="my-2" />
          <p>
            The company reserves the right to modify these terms and conditions
            at any time.
          </p>
          <p>
            Affiliates will need to visit affiliate terms and conditions timely
            because we have no notification policy to notify about the change in
            the affiliate terms and services.
          </p>
          <p>
            Continued participation in the program after notification of changes
            constitutes acceptance of the new terms.
          </p>

          <h2 className="text-xl font-semibold mt-4">Reporting</h2>
          <Divider className="my-2" />
          <p>
            Affiliates will have access to a dashboard showing their referrals,
            commissions, and payout history.
          </p>
          <p>
            Any discrepancies in reporting must be brought to the attention of
            the affiliate management team within 24 hours.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default AffiliateTerms;
