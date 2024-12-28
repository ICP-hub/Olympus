import React from 'react';
import { Link } from 'react-router-dom';
import logoWithText from '../../../assets/Logo/newLogo.png';

export default function TermsOfUse() {
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
              Terms of Use
            </h1>
            <p>
              {' '}
              These Terms of Use (“Terms”) govern your access to and use of our
              websites, platforms, and services provided by [Your Organization]
              (“we,” “us,” or “our”). By accessing or using these services, you
              agree to abide by these Terms. If you disagree with any part of
              these Terms, you must immediately discontinue use of the services.
            </p>
          </div>

          <div className='space-y-8'>
            {/* Section 1: Introduction */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                1. Introduction
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                These Terms of Use (“Terms”) are a legal agreement between you
                and [Your Organization] (“we,” “us,” or “our”). By accessing,
                browsing, or using our website(s) and services, you agree to be
                bound by these Terms. These Terms apply to all visitors, users,
                and others who access or use our services. If you do not agree
                with these Terms, you must not use our services.
              </p>
            </section>

            {/* Section 2: Eligibility */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                2. Eligibility
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                To use our website and services, you must be at least 18 years
                old or the legal age of majority in your jurisdiction. By using
                our services, you represent and warrant that you meet these
                requirements. If you are under 18, you may use the services only
                with the consent of a parent or legal guardian.
              </p>
            </section>

            {/* Section 3: Acceptance */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                3. Acceptance
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                By using or accessing our website or services, you acknowledge
                that you have read, understood, and agree to be bound by these
                Terms. You also agree to comply with all applicable laws and
                regulations when using our services.
              </p>
            </section>

            {/* Section 4: Changes to the Terms */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                4. Changes to the Terms
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                We reserve the right to modify these Terms at any time. Changes
                will be effective immediately upon posting. It is your
                responsibility to review the Terms periodically for updates.
                Continued use of our services constitutes acceptance of the
                updated Terms.
              </p>
            </section>

            {/* Section 5: Use of the Website */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                5. Use of the Website
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                You are granted a limited, non-exclusive, and revocable license
                to access and use our website and services for personal,
                non-commercial purposes. You agree not to:
              </p>
              <ul className='list-disc ml-4 text-xl'>
                <li>Use the website for unlawful purposes</li>
                <li>Interfere with the website’s functionality</li>
                <li>
                  Copy, modify, or distribute website content without
                  authorization
                </li>
              </ul>
            </section>

            {/* Section 6: Account Registration */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                6. Account Registration
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                To access certain features, you may be required to create an
                account. You are responsible for maintaining the confidentiality
                of your account credentials and for all activities that occur
                under your account.
              </p>
            </section>

            {/* Section 7: Privacy Policy */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                7. Privacy Policy
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                Your privacy is important to us. Please review our Privacy
                Policy to understand how we collect, use, and protect your
                personal data. By using our services, you consent to our data
                practices as described in the Privacy Policy.
              </p>
            </section>

            {/* Section 8: Prohibited Activities */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                5. Prohibited Uses
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                You agree not to use the Website for any unlawful or
                unauthorized purposes, including but not limited to:
              </p>
              <ul className='list-disc ml-6 text-xl'>
                <li>Violating any applicable laws or regulations.</li>
                <li>Engaging in fraudulent or deceptive activities.</li>
                <li>
                  Introducing harmful software such as viruses or malware.
                </li>
                <li>
                  Interfering with the Website's functionality or security.
                </li>
                <li>Harassing, abusing, or harming others.</li>
              </ul>
            </section>

            {/* Section 9: User-Generated Content */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                9. User-Generated Content
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                You may submit content such as comments or reviews. By doing so,
                you grant us a license to use, modify, and distribute your
                content. You are responsible for ensuring your content complies
                with these Terms and applicable laws.
              </p>
            </section>

            {/* Section 10: Intellectual Property */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                10. Intellectual Property
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                All content on our website, including text, images, and code, is
                protected by intellectual property laws. You may not use,
                reproduce, or distribute our content without prior written
                consent.
              </p>
            </section>

            {/* Section 11: Links to Third-Party Websites */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                11. Links to Third-Party Websites
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                Our website may contain links to third-party websites. We are
                not responsible for the content, policies, or practices of these
                websites.
              </p>
            </section>

            {/* Section 12: Limitation of Liability */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                12. Limitation of Liability
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                To the fullest extent permitted by law, we are not liable for
                any direct, indirect, or consequential damages arising from your
                use of our website or services.
              </p>
            </section>

            {/* Section 13: Disclaimer of Warranties */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                13. Disclaimer of Warranties
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                Our website and services are provided “as is” and “as available”
                without any warranties. We do not guarantee that the website
                will be error-free or uninterrupted.
              </p>
            </section>

            {/* Section 14: Termination */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                14. Termination
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                We may terminate or suspend your access to our website or
                services at any time for any reason, including violations of
                these Terms.
              </p>
            </section>

            {/* Section 15: Governing Law */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                15. Governing Law
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                These Terms are governed by the laws of [Your Jurisdiction]. Any
                disputes will be resolved in the courts of [Your Jurisdiction].
              </p>
            </section>

            {/* Section 16: Force Majeure */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                16. Force Majeure
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                We are not liable for delays or failures caused by events beyond
                our control, including natural disasters, acts of war, or
                internet outages.
              </p>
            </section>

            {/* Section 17: Severability */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                17. Severability
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                If any part of these Terms is found to be unenforceable, the
                remaining provisions will remain in full force and effect.
              </p>
            </section>

            {/* Section 18: Entire Agreement */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                18. Entire Agreement
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                These Terms constitute the entire agreement between you and us,
                superseding any prior agreements.
              </p>
            </section>

            {/* Section 19: Assignment */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                19. Assignment
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                You may not assign these Terms without our prior written
                consent. We may assign these Terms without notice or consent.
              </p>
            </section>

            {/* Section 20: Waiver */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                20. Waiver
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                Our failure to enforce any provision of these Terms does not
                constitute a waiver of that provision.
              </p>
            </section>

            {/* Section 21: Contact Information */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                21. Contact Information
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                If you have questions about these Terms, please contact us at{' '}
                <a
                  href='mailto:support@yourwebsite.com'
                  className='text-blue-600 underline'
                >
                  support@yourwebsite.com
                </a>
                .
              </p>
            </section>

            {/* Section 22: Updates */}
            <section>
              <h2 className='text-3xl font-semibold text-gray-900 mb-4'>
                22. Updates
              </h2>
              <p className='space-y-4 text-gray-700 text-xl'>
                We may update these Terms periodically. The most recent version
                will always be posted on our website.
              </p>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
