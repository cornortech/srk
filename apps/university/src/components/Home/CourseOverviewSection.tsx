export const CourseOverviewSection = () => (
  <section id="overview" className="py-20 px-6 bg-bgPrimary">
    <div className="max-w-custom mx-auto px-6">
      <h2 className="text-3xl font-bold mb-12 text-center">Course Overview</h2>
      <div className="flex items-center justify-center w-full h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-44 gap-y-8">
          {[
            "Introduction to core concepts",
            "Practical learning activities",
            "Advanced techniques and strategies",
            "Real-world projects and case studies",
            "Ongoing support and guidance",
            "Certificate after successful completion",
          ].map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="bg-primary rounded-full p-2 mr-4">
                <svg
                  className="w-6 h-6 text-bgPrimary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
