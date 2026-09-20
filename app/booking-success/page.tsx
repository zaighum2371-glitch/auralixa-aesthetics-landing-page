import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const bookingId = resolvedSearchParams.booking_id as string

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm text-center border border-border">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
          Payment Successful!
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Thank you for your booking. Your appointment request has been received securely. You will receive a confirmation email shortly.
        </p>

        {bookingId && (
          <p className="text-sm text-muted-foreground mb-8 bg-muted p-3 rounded-lg">
            Booking ID: <span className="font-mono text-foreground">{bookingId}</span>
          </p>
        )}

        <Link href="/">
          <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  )
}
