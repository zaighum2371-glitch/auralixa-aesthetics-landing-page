'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  id: string
  question: string
  answer: string
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How long do the results last?',
    answer: 'Results vary depending on the treatment. Botox typically lasts 3-4 months, dermal fillers 6-18 months, and skincare treatments require maintenance every 4-6 weeks for optimal results. We\'ll provide specific guidance after your consultation.',
  },
  {
    id: 'faq-2',
    question: 'Is there any downtime after treatments?',
    answer: 'Most of our treatments have minimal downtime. Injectables may have slight redness for a few hours. Laser treatments may require 24-48 hours of sun protection. Skincare facials have no downtime. We\'ll provide detailed aftercare instructions.',
  },
  {
    id: 'faq-3',
    question: 'Are the treatments painful?',
    answer: 'No. We use topical numbing creams and the finest needles available to ensure comfort. Most clients describe the sensation as mild pressure. We prioritize your comfort throughout every procedure.',
  },
  {
    id: 'faq-4',
    question: 'Can I combine multiple treatments?',
    answer: 'Yes! Many clients benefit from combining treatments for enhanced results. During your consultation, our experts will recommend the best combination based on your goals and skin type.',
  },
  {
    id: 'faq-5',
    question: 'What should I do to prepare for my appointment?',
    answer: 'We recommend avoiding blood thinners 24 hours before, staying hydrated, and arriving with clean skin. Avoid sun exposure and strenuous exercise 24 hours before. Detailed pre-treatment instructions will be provided upon booking.',
  },
  {
    id: 'faq-6',
    question: 'How do I know which treatment is right for me?',
    answer: 'During your complimentary consultation, our practitioners will assess your skin, discuss your concerns, and recommend personalized treatments. We create custom plans tailored to your goals and budget.',
  },
  {
    id: 'faq-7',
    question: 'Are your products and equipment FDA-approved?',
    answer: 'Yes, absolutely. We exclusively use FDA-approved products and state-of-the-art equipment from leading manufacturers. Safety and efficacy are our top priorities.',
  },
  {
    id: 'faq-8',
    question: 'What if I\'m not satisfied with my results?',
    answer: 'Your satisfaction is guaranteed. If you\'re not happy with your results, we offer adjustments at no additional cost. We stand behind the quality of our work.',
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Have questions? We&apos;ve got answers. Let us help you understand our treatments better.
          </p>
        </div>

        {/* FAQ Accordion */}
        <Accordion className="space-y-2">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="border border-border rounded-lg px-4">
              <AccordionTrigger className="hover:text-accent">
                <span className="text-left font-medium text-foreground">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            Can&apos;t find the answer you&apos;re looking for?
          </p>
          <p className="text-sm text-foreground">
            Contact our team at <a href="tel:07448297154" className="text-accent font-medium hover:underline">07448 297154</a> or <a href="mailto:auralixax@gmail.com" className="text-accent font-medium hover:underline">auralixax@gmail.com</a>
          </p>
        </div>
      </div>
    </section>
  )
}
