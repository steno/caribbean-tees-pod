import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy - Costambar Tees',
  description: 'Privacy Policy for Costambar Tees',
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Costambar Tees (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name and contact information (email address, phone number, shipping address)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Order history and preferences</li>
            <li>Communication preferences</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Automatically Collected Information</h3>
          <p>When you visit our website, we automatically collect certain information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring website addresses</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Communicate with you about your orders and our services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Improve our website and customer experience</li>
            <li>Detect and prevent fraud</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Information Sharing</h2>
          <p>We share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Payment Processors:</strong> Stripe processes your payment information securely</li>
            <li><strong>Fulfillment Partners:</strong> Printify and their print partners to fulfill your orders</li>
            <li><strong>Shipping Providers:</strong> To deliver your orders</li>
            <li><strong>Service Providers:</strong> Companies that help us operate our business (hosting, analytics)</li>
          </ul>
          <p className="mt-4">We do not sell your personal information to third parties.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to processing of your information</li>
            <li>Data portability</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Children&apos;s Privacy</h2>
          <p>
            Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Costambar Tees</strong><br />
            Email: <a href="mailto:kidliquid@gmail.com" className="text-ocean-600 hover:text-ocean-700 underline">kidliquid@gmail.com</a><br />
            Website: <Link href="/" className="text-ocean-600 hover:text-ocean-700 underline">costambar-tees.netlify.app</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
