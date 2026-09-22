'use client'

import { Footer } from "@/components/footer"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">
            We collect information you provide directly to us when you book an appointment, 
            fill out a consultation form, or communicate with us. This may include your name, 
            contact information, and relevant medical history necessary for your treatments.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            process your bookings, send you confirmations and reminders, and communicate with 
            you about your treatments and our services.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to maintain the safety 
            of your personal information and protect it against unauthorized access, alteration, 
            disclosure, or destruction.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at auralixax@gmail.com.
          </p>
        </div>
      </main>
      <Footer onBookingClick={() => window.location.href = "/"} />
    </div>
  )
}
