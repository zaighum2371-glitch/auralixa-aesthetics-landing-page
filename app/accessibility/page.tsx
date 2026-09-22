'use client'

import { Footer } from "@/components/footer"

export default function Accessibility() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Accessibility Statement</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="mb-4">
            Auralixa Aesthetics is committed to ensuring digital accessibility for people with disabilities. 
            We are continually improving the user experience for everyone and applying the relevant 
            accessibility standards.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Feedback</h2>
          <p className="mb-4">
            We welcome your feedback on the accessibility of our website. Please let us know if you 
            encounter accessibility barriers:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>E-mail: auralixax@gmail.com</li>
            <li>Phone: 07448 297154</li>
          </ul>
          <p className="mb-4">
            We try to respond to feedback within 2 business days.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Clinic Accessibility</h2>
          <p className="mb-4">
            For information regarding physical access to our clinic located at Castlemere Community Centre, 
            please contact us directly so we can accommodate your specific needs and ensure a comfortable visit.
          </p>
        </div>
      </main>
      <Footer onBookingClick={() => window.location.href = "/"} />
    </div>
  )
}
