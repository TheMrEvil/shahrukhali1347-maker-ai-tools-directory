import { Metadata } from 'next';
import StructuredData from '@/components/seo/StructuredData';
import { generateWebPageSchema } from '@/lib/schema';
import LegalLayout, { LegalSection } from '@/components/legal/LegalLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Best AI Tools',
  description: 'Learn how Best AI Tools collects, uses, and protects your personal information. Read our data privacy practices and your rights.',
  alternates: {
    canonical: '/privacy',
  },
  openGraph: {
    title: 'Privacy Policy | Best AI Tools',
    description: 'Learn how Best AI Tools collects, uses, and protects your personal information. Read our data privacy practices and your rights.',
    url: '/privacy',
    type: 'website',
  },
  twitter: {
    title: 'Privacy Policy | Best AI Tools',
    description: 'Learn how Best AI Tools collects, uses, and protects your personal information. Read our data privacy practices and your rights.',
  },
};

const sections: LegalSection[] = [
  {
    title: 'Introduction',
    blocks: [
      {
        p: 'Welcome to Best AI Tools (“we,” “our,” or “us”). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.',
      },
    ],
  },
  {
    title: 'Information we collect',
    blocks: [
      { h3: 'Information you provide' },
      {
        ul: [
          'Name and email address when subscribing to our newsletter',
          'Contact information when submitting tools or contacting us',
          'Account information if you create an account',
          'Any other information you choose to provide',
        ],
      },
      { h3: 'Information automatically collected' },
      {
        ul: [
          'Device information (browser type, operating system)',
          'IP address and general location',
          'Pages visited and time spent on our site',
          'Referring website addresses',
        ],
      },
    ],
  },
  {
    title: 'How we use your information',
    blocks: [
      { p: 'We use the information we collect to:' },
      {
        ul: [
          'Provide and maintain our services',
          'Send you our newsletter (if subscribed)',
          'Respond to your inquiries and support requests',
          'Analyze website usage and improve our content',
          'Detect and prevent fraud or abuse',
        ],
      },
    ],
  },
  {
    title: 'Cookies and tracking',
    blocks: [
      {
        p: 'We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.',
      },
    ],
  },
  {
    title: 'Third-party services',
    blocks: [
      {
        p: 'We may use third-party services such as analytics providers and advertising partners. These third parties may have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.',
      },
    ],
  },
  {
    title: 'Data security',
    blocks: [
      {
        p: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
      },
    ],
  },
  {
    title: 'Your rights',
    blocks: [
      { p: 'Depending on your location, you may have the right to:' },
      {
        ul: [
          'Access the personal information we have about you',
          'Request correction of inaccurate information',
          'Request deletion of your information',
          'Object to processing of your information',
          'Request data portability',
        ],
      },
    ],
  },
  {
    title: 'Children’s privacy',
    blocks: [
      {
        p: 'Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.',
      },
    ],
  },
  {
    title: 'Changes to this policy',
    blocks: [
      {
        p: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the “Last updated” date.',
      },
    ],
  },
  {
    title: 'Contact us',
    blocks: [
      { p: 'If you have questions about this Privacy Policy, please contact us at:' },
      { ul: ['Email: info@bestaitools4u.com', 'Address: San Francisco, CA, USA'] },
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <StructuredData
        data={generateWebPageSchema({
          name: 'Privacy Policy | Best AI Tools',
          description: 'Learn how Best AI Tools collects, uses, and protects your personal information.',
          url: '/privacy',
        })}
      />
      <LegalLayout
        kicker="№ — Legal Record"
        title="Privacy"
        accent="policy."
        updated="April 1, 2026"
        lede="How we collect, use, and protect your information when you use Best AI Tools."
        breadcrumb={{ label: 'Privacy Policy', href: '/privacy' }}
        sections={sections}
      />
    </>
  );
}
