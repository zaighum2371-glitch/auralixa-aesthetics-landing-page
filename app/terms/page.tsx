'use client'

import { Footer } from "@/components/footer"

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-grow container mx-auto px-4 py-16 max-w-4xl">
        <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Agreement to Terms</h2>
          <p className="mb-4">
            By accessing our website and booking our services, you agree to be bound by these 
            Terms of Service and all applicable laws and regulations.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Appointments and Cancellations</h2>
          <p className="mb-4">
            We require at least 48 hours notice for cancellations or rescheduling. Late cancellations 
            or no-shows may result in a fee or the loss of your booking deposit. Please arrive on time 
            for your appointment to ensure you receive your full treatment time.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Medical Disclaimer</h2>
          <p className="mb-4">
            All treatments are subject to a consultation to assess suitability. We reserve the right 
            to refuse treatment if it is deemed unsuitable or unsafe for the client. The information 
            provided on this website is for educational purposes and does not constitute medical advice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Payments</h2>
          <p className="mb-4">
            Payment for services is due at the time of treatment unless otherwise specified. 
            We accept major credit cards and other secure payment methods.
          </p>
        </div>
      </main>
      <Footer onBookingClick={() => window.location.href = "/"} />
    </div>
  )
}
