import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service - Costambar Tees',
  description: 'Terms of Service for Costambar Tees',
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

      <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
          <p>
            By accessing or using the Costambar Tees website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials on Costambar Tees' website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Modify or copy the materials</li>
            <li>Use the materials for any commercial purpose or for any public display</li>
            <li>Attempt to reverse engineer any software contained on the website</li>
            <li>Remove any copyright or other proprietary notations from the materials</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Products and Services</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Product Descriptions</h3>
          <p>
            We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Print-on-Demand</h3>
          <p>
            All products are printed on-demand when you place an order. This means your order is custom-made specifically for you, which may result in longer processing times compared to pre-printed items.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Pricing</h3>
          <p>
            All prices are in USD and are subject to change without notice. We reserve the right to modify prices at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Orders and Payment</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Order Acceptance</h3>
          <p>
            Your order is an offer to purchase products from us. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or fraud prevention.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Payment</h3>
          <p>
            Payment is processed securely through Stripe. By providing payment information, you represent and warrant that you have the legal right to use the payment method provided.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Order Confirmation</h3>
          <p>
            You will receive an email confirmation when your order is placed. This confirmation does not constitute acceptance of your order, but rather confirms receipt of your order request.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Shipping and Delivery</h2>
          <p>
            We use third-party fulfillment partners (Printify) to print and ship your orders. Shipping times and costs are provided at checkout and may vary based on your location and the product ordered. We are not responsible for delays caused by shipping carriers or fulfillment partners.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Returns and Refunds</h2>
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Return Policy</h3>
          <p>
            Due to the custom nature of our print-on-demand products, we generally do not accept returns unless the product is defective or significantly different from what was ordered. If you receive a defective product, please contact us within 30 days of delivery.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Refunds</h3>
          <p>
            Refunds, if approved, will be processed to the original payment method within 5-10 business days. Shipping costs are non-refundable unless the return is due to our error.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Intellectual Property</h2>
          <p>
            All content on this website, including designs, text, graphics, logos, and images, is the property of Costambar Tees or its content suppliers and is protected by copyright and trademark laws. You may not use our content without our express written permission.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. User Accounts</h2>
          <p>
            If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Prohibited Uses</h2>
          <p>You may not use our website:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
            <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
            <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
            <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
            <li>To submit false or misleading information</li>
            <li>To upload or transmit viruses or any other type of malicious code</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Disclaimer</h2>
          <p>
            The materials on Costambar Tees' website are provided on an 'as is' basis. Costambar Tees makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Limitation of Liability</h2>
          <p>
            In no event shall Costambar Tees or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Costambar Tees' website, even if Costambar Tees or a Costambar Tees authorized representative has been notified orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">12. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of [Your State/Country] and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right to revise these Terms of Service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">14. Contact Information</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
          </p>
          <p className="mt-2">
            <strong>Costambar Tees</strong><br />
            Email: <a href="mailto:stefan.asemota@gmail.com" className="text-ocean-600 hover:text-ocean-700 underline">stefan.asemota@gmail.com</a><br />
            Website: <Link href="/" className="text-ocean-600 hover:text-ocean-700 underline">costambar-tees.netlify.app</Link>
          </p>
        </section>
      </div>
    </div>
  )
}
