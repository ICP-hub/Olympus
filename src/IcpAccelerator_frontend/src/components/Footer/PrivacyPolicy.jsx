import React from 'react';
import { Link } from 'react-router-dom';
import logoWithText from '../../../assets/Logo/newLogo.png';

export default function PrivacyPolicy() {
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
              Privacy Policy
            </h1>
          </div>

          <div className='space-y-12'>
            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                1. Overview
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  The security and protection of your personal data is one of my
                  top priorities. This Privacy Policy outlines how I collect,
                  process, and use your data to ensure transparency and trust.
                </p>
                <p>
                  This policy applies to all users accessing my websites,
                  subscribing to updates, registering for services or tools, or
                  interacting with me in any manner.
                </p>
                <p>
                  I handle your data in accordance with the Swiss Federal Data
                  Protection Act ("FADP"), the Swiss Ordinance on the Federal
                  Data Protection Act ("OFADP"), and the General Data Protection
                  Regulation ("GDPR").
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                2. Scope
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  This Privacy Policy describes my procedures regarding the
                  collection, processing, and disclosure of personal data. It
                  applies to information gathered through:
                </p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>Browsing my websites</li>
                  <li>Using my tools, services, or applications</li>
                  <li>
                    Registering for updates or becoming a member of my community
                  </li>
                  <li>Participating in my sponsored events or programs</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                3. Acceptance
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  By accessing my websites or using my services, you acknowledge
                  and agree to the terms of this Privacy Policy. Your consent is
                  explicitly provided by:
                </p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>Continuing to browse my website</li>
                  <li>Consenting to my use of cookies</li>
                  <li>
                    Providing personal data during registration or membership
                    processes
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
                4. Collection of Data
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>I collect the following types of data:</p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>
                    Automatically collected data: cookies, IP addresses, browser
                    details, and device identifiers
                  </li>
                  <li>
                    Data provided during registration: name, email address,
                    country, and user preferences
                  </li>
                  <li>
                    Data submitted for updates or services: email addresses and
                    consent for communications
                  </li>
                </ul>
                <p className='text-xl'>
                  For more details about cookies, please refer to my Cookie
                  Policy.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                5. Use of Data
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  Your data is used to enhance your experience, provide
                  requested services, and ensure compliance with legal
                  obligations. Specific uses include:
                </p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>Providing access to tools and services</li>
                  <li>
                    Sending updates, promotional materials, or technical support
                  </li>
                  <li>Improving website functionality and user experience</li>
                  <li>Preventing fraudulent or unauthorized activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                6. Third-Party Disclosure
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  I may share your data with third parties for purposes such as:
                </p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>Providing technical support or marketing services</li>
                  <li>Complying with legal requests or court orders</li>
                  <li>
                    Investigating illegal activities or enforcing my Terms of
                    Use
                  </li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                7. International Transfers
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  Your data may be transferred to countries outside of
                  Switzerland and the European Union. I ensure that all third
                  parties comply with GDPR-equivalent standards.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                8. Storage of Personal Data
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  Personal data is stored only for the period necessary to
                  fulfill the purposes for which it was collected. After this
                  period, data is securely deleted in accordance with legal
                  requirements.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                9. Your Rights
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>You have the following rights:</p>
                <ul className='list-disc pl-8 space-y-2 text-xl'>
                  <li>Right to access your personal data</li>
                  <li>Right to rectify inaccurate data</li>
                  <li>Right to request data deletion</li>
                  <li>Right to restrict or object to data processing</li>
                  <li>Right to data portability</li>
                  <li>Right to withdraw consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                10. Changes to Privacy Policy
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  I may modify this Privacy Policy periodically to reflect
                  updates in my practices or legal requirements. The latest
                  version will always be available on my website.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                11. Protection of Personal Data
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  I use industry-standard security measures to protect your
                  personal data from loss, misuse, or unauthorized access.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                12. Policy Toward Children
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  My websites and services are not intended for individuals
                  under the age of 18. If you believe I have collected data from
                  a minor, please contact me immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                13. Links
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  My website may contain links to third-party websites. I am not
                  responsible for the privacy practices or content of these
                  sites.
                </p>
              </div>
            </section>

            <section>
              <h2 className='text-4xl font-semibold text-[#0F1624] mb-4'>
                14. Contact
              </h2>
              <div className='space-y-4 text-gray-700 text-xl'>
                <p>
                  For questions about this Privacy Policy or your personal data,
                  please contact me at{' '}
                  <a
                    to='mailto:contact@example.com'
                    className='text-blue-600 hover:text-blue-800 underline'
                  >
                    contact@example.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
