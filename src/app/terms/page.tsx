import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import LegalLayout, { LegalSection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Best AI Tools',
  description: 'Read the terms and conditions for using Best AI Tools. Understand your rights and responsibilities when accessing our AI tools directory.',
  alternates: {
    canonical: '/terms',
  },
  openGraph: {
    title: 'Terms of Service | Best AI Tools',
    description: 'Read the terms and conditions for using Best AI Tools. Understand your rights and responsibilities when accessing our AI tools directory.',
    url: '/terms',
    type: 'website',
  },
  twitter: {
    title: 'Terms of Service | Best AI Tools',
    description: 'Read the terms and conditions for using Best AI Tools. Understand your rights and responsibilities when accessing our AI tools directory.',
  },
};

const sections: LegalSection[] = [
  {
    title: 'Acceptance of terms',
    blocks: [
      {
        p: 'By accessing and using Best AI Tools (“the Website”), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.',
      },
    ],
  },
  {
    title: 'Description of service',
    blocks: [
      {
        p: 'Best AI Tools is a directory and information platform that helps users discover, compare, and learn about AI tools. We provide:',
      },
      {
        ul: [
          'A searchable directory of AI tools',
          'Reviews and ratings of AI tools',
          'Guides and tutorials about AI tools',
          'A newsletter with AI tool updates',
        ],
      },
    ],
  },
  {
    title: 'User responsibilities',
    blocks: [
      { p: 'When using our website, you agree to:' },
      {
        ul: [
          'Provide accurate information when submitting tools or creating accounts',
          'Not engage in any activity that disrupts or interferes with our services',
          'Not attempt to gain unauthorized access to our systems',
          'Not use our content for unauthorized commercial purposes',
          'Comply with all applicable laws and regulations',
        ],
      },
    ],
  },
  {
    title: 'Tool listings',
    blocks: [
      { p: 'We strive to provide accurate and up-to-date information about AI tools. However:' },
      {
        ul: [
          'We do not guarantee the accuracy of tool information',
          'Tool features and pricing may change without notice',
          'We are not responsible for the quality or performance of listed tools',
          'Listings do not constitute endorsement of any tool',
        ],
      },
    ],
  },
  {
    title: 'Intellectual property',
    blocks: [
      {
        p: 'All content on Best AI Tools, including text, graphics, logos, and software, is owned by us or our licensors and is protected by copyright and other intellectual property laws. You may not:',
      },
      {
        ul: [
          'Copy or reproduce our content without permission',
          'Modify or create derivative works from our content',
          'Distribute or publicly display our content',
          'Use our trademarks without written consent',
        ],
      },
    ],
  },
  {
    title: 'User submissions',
    blocks: [
      { p: 'When you submit tools, reviews, or other content to our website, you:' },
      {
        ul: [
          'Grant us a non-exclusive license to use, display, and distribute your submission',
          'Confirm that you have the right to submit the content',
          'Acknowledge that we may edit or remove submissions at our discretion',
        ],
      },
    ],
  },
  {
    title: 'Disclaimer of warranties',
    blocks: [
      { p: 'Our website is provided “as is” without warranties of any kind. We do not guarantee that:' },
      {
        ul: [
          'The website will be available at all times',
          'The information will be accurate or complete',
          'The website will be free of errors or viruses',
        ],
      },
    ],
  },
  {
    title: 'Limitation of liability',
    blocks: [
      {
        p: 'To the maximum extent permitted by law, Best AI Tools shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the website or reliance on any information provided.',
      },
    ],
  },
  {
    title: 'Third-party links',
    blocks: [
      {
        p: 'Our website contains links to third-party websites and tools. We are not responsible for the content, privacy practices, or terms of these external sites.',
      },
    ],
  },
  {
    title: 'Changes to terms',
    blocks: [
      {
        p: 'We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the website constitutes acceptance of the modified terms.',
      },
    ],
  },
  {
    title: 'Termination',
    blocks: [
      {
        p: 'We may terminate or suspend your access to our website at any time, without prior notice, for any reason, including violation of these terms.',
      },
    ],
  },
  {
    title: 'Governing law',
    blocks: [
      {
        p: 'These Terms of Service are governed by and construed in accordance with the laws of California, USA, without regard to conflict of law principles.',
      },
    ],
  },
  {
    title: 'Contact information',
    blocks: [
      { p: 'For questions about these Terms of Service, please contact us at:' },
      { ul: ['Email: info@bestaitools4u.com', 'Address: San Francisco, CA, USA'] },
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'Terms of Service | Best AI Tools',
          description: 'Read the terms and conditions for using Best AI Tools and our AI tools directory.',
          url: '/terms',
        })}
      />
      <LegalLayout
        kicker="№ — Legal Record"
        title="Terms of"
        accent="service."
        updated="April 1, 2026"
        lede="Your rights and responsibilities when accessing the Best AI Tools directory."
        breadcrumb={{ label: 'Terms of Service', href: '/terms' }}
        sections={sections}
      />
    </>
  );
}
