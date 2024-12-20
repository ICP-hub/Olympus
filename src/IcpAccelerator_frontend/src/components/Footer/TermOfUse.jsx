// import React from 'react';

// const TermsOfUse = () => {
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Terms of Use</h1>
//       <p>Here are the terms of use for our website and services...</p>
//       {/* Add more content here */}
//     </div>
//   );
// };

// export default TermsOfUse;

import React from 'react';
import { useState } from 'react';

const TermsOfUse = () => {
  return (
    <div className='min-h-screen bg-white'>
      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <h1 className='text-4xl font-bold text-gray-900 mb-12'>Terms of Use</h1>

        <div className='space-y-8'>
          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              1. Introduction
            </h2>
            <div className='prose prose-gray max-w-none'>
              <p>
                These Terms of Use ("Terms") are entered into by and between you
                and the DFINITY Foundation and its affiliates ("Foundation",
                "we" or "us"). These Terms govern your access to and use of
                current and future online and mobile websites, platforms,
                services, applications, content, functionality, and networks
                owned and operated by the Foundation, including without
                limitation, dfinity.org, sdk.dfinity.org, thereboot.com,
                motoko.org (collectively, the "Website").
              </p>
              <p>
                By using the Website, accessing content, or subscribing to our
                information updates, you acknowledge that you have read and
                understood these Terms and agree to be bound by them and to
                comply with these Terms.
              </p>
              <p>
                If you do not agree with these Terms, you must not use or access
                the Website.
              </p>
              <p>
                By giving your consent, you confirm that your level of English
                is sufficient to understand the meaning of the terms contained
                in the English version of the Terms as well as all the
                commitments, warranties, waivers, and obligations contained in
                the English version of the Terms.
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              2. Changes To These Terms
            </h2>
            <div className='prose prose-gray max-w-none'>
              <p>
                We may make changes to these Terms from time to time, and any
                modifications, additions, or deletions will be effective
                immediately upon posting from time to time. Your continued use
                of the Website after any such changes, with or without having
                explicitly accepted the new Terms, shall constitute your
                acceptance of such changes.
              </p>
              <p>
                You are responsible for verifying regularly these Terms in their
                current and in effect version from time to time.
              </p>
            </div>
          </section>

          <section>
            <h2 className='text-2xl font-semibold text-gray-900 mb-4'>
              3. The Website
            </h2>
            <div className='prose prose-gray max-w-none'>
              {/* Additional content would go here */}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
