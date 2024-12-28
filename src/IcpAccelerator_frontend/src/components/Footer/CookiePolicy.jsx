import React from 'react';
import { Link } from 'react-router-dom';
import logoWithText from '../../../assets/Logo/newLogo.png';

export default function CookiePolicy() {
  return (
    <>
      <div className='min-h-screen bg-white'>
        <nav className='border-b'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between h-16 items-center'>
              <div className='flex-shrink-0'>
                <Link to='/' className='flex items-center'>
                  <img
                    src={logoWithText}
                    alt='Your Logo'
                    width={120}
                    height={32}
                    className='h-8 w-auto'
                  />
                </Link>
              </div>
              <div className='hidden sm:flex sm:space-x-8'>
                <Link
                  to='/grants'
                  className='text-gray-900 hover:text-gray-600 px-3 py-2 text-xl  font-bold'
                >
                  Grants
                </Link>
                <Link
                  to='/hackathons'
                  className='text-gray-900 hover:text-gray-600 px-3 py-2 text-xl font-bold'
                >
                  Hackathons
                </Link>
                <Link
                  to='/events-news'
                  className='text-gray-900 hover:text-gray-600 px-3 py-2 text-xl font-bold'
                >
                  Events & News
                </Link>
                <Link
                  to='/jobs'
                  className='text-gray-900 hover:text-gray-600 px-3 py-2 text-xl font-bold'
                >
                  Jobs
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24'>
          <div className='text-center mb-16'>
            <h1 className='text-4xl sm:text-5xl font-bold text-[#0F1624] mb-4'>
              Cookies Policy
            </h1>
          </div>

          <div className='space-y-12'>
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                1. Introduction
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  This Cookie Policy explains how [Your Organization] (“we,”
                  “us,” or “our”) uses cookies and similar technologies to
                  recognize you when you visit our website [website URL]
                  (“Website”). It explains what these technologies are, why we
                  use them, and your rights to control their use.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                2. What Are Cookies?
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  Cookies are small data files that are placed on your computer
                  or mobile device when you visit a website. Cookies are widely
                  used by online service providers to facilitate and improve the
                  functionality of websites and services and provide reporting
                  information.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                3. Types of Cookies We Use
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>
                    <strong>Essential Cookies:</strong> These cookies are
                    necessary to provide you with services and features
                    available through our Website.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> These cookies collect
                    information about how visitors use our Website, such as
                    which pages are most visited.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> These cookies enable
                    the Website to remember choices you make and provide
                    enhanced functionality.
                  </li>
                  <li>
                    <strong>Targeting/Advertising Cookies:</strong> These
                    cookies are used to deliver advertisements relevant to you
                    and your interests.
                  </li>
                </ul>
                <p className='text-xl'>
                  If you do not agree to the terms of this policy, you must
                  refrain from using my websites and services.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                4. Why We Use Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                We use cookies to ensure our Website functions properly, provide
                a personalized experience, improve performance, and analyze
                usage to make informed improvements.
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                5. How We Use Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Cookies help us remember your preferences, enhance your user
                experience, and measure the effectiveness of our marketing
                campaigns. We may also use cookies to understand your behavior
                and deliver targeted advertisements.
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                6. Third-Party Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Some cookies on our Website are placed by third parties such as
                analytics providers and advertisers. These third parties may
                collect information about your online activities over time and
                across different websites.
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                7. Managing Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                You can manage or disable cookies through your browser settings.
                However, please note that disabling cookies may affect the
                functionality of our Website.
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                8. Analytics Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                We use analytics tools, such as Google Analytics, to collect and
                analyze statistical data about how visitors interact with our
                Website. This helps us improve performance and user experience.
              </div>
            </section>

            {/* Section 9: Advertising Cookies */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                9. Advertising Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Advertising cookies are used to show ads that are relevant to
                your interests. These cookies also limit the number of times you
                see an ad and measure the effectiveness of advertising
                campaigns.
              </div>
            </section>

            {/* Section 10: Cookies and Personal Data */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                10. Cookies and Personal Data
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Some cookies may collect personal data. Any personal data
                collected through cookies will be handled in accordance with our
                Privacy Policy.
              </div>
            </section>

            {/* Section 11: Cookie Retention Period */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                11. Cookie Retention Period
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Cookies are stored for varying lengths of time depending on
                their purpose. Session cookies expire when you close your
                browser, while persistent cookies remain until they expire or
                are deleted.
              </div>
            </section>

            {/* Section 12: Consent to Cookies */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                12. Consent to Cookies
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                By continuing to use our Website, you consent to the use of
                cookies in accordance with this policy. If you do not consent,
                please disable cookies in your browser settings.
              </div>
            </section>

            {/* Section 13: Updates to This Cookie Policy */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                13. Updates to This Cookie Policy
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                We may update this Cookie Policy from time to time. Please
                revisit this page regularly to stay informed about our use of
                cookies.
              </div>
            </section>

            {/* Section 14: Links to Other Websites */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                14. Links to Other Websites
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                Our Website may contain links to third-party websites. This
                Cookie Policy does not apply to third-party websites, and we are
                not responsible for their cookie practices.
              </div>
            </section>

            {/* Section 15: Contact Us */}
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                15. Contact Us
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                If you have any questions about this Cookie Policy, please
                contact us at{' '}
                <a
                  href='mailto:info@yourwebsite.com'
                  className='text-blue-600 underline'
                >
                  legalnotice@dfinity.org
                </a>
                .
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
