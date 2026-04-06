// composables/useWhatsApp.ts
import type { CarListing } from '~/types'

export const useWhatsApp = () => {
  const config = useRuntimeConfig()
  const number = config.public.whatsappNumber as string

  const buildInquiryLink = (listing: CarListing): string => {
    const message = encodeURIComponent(
      `Hello BRIM Automotive! I am interested in the *${listing.year} ${listing.make} ${listing.model}* listed at *KES ${new Intl.NumberFormat('en-KE').format(listing.price)}*.\n\nListing ID: ${listing.id}\n\nPlease share more details.`
    )
    return `https://wa.me/${number}?text=${message}`
  }

  const buildGeneralLink = (message?: string): string => {
    const text = encodeURIComponent(message ?? 'Hello BRIM Automotive! I have an inquiry about your cars.')
    return `https://wa.me/${number}?text=${text}`
  }

  const openWhatsApp = (listing: CarListing) => {
    if (typeof window !== 'undefined') {
      window.open(buildInquiryLink(listing), '_blank', 'noopener')
    }
  }

  return { buildInquiryLink, buildGeneralLink, openWhatsApp }
}