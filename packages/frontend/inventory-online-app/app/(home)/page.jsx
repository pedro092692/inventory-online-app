import { HeroTwo } from '@/app/ui/home/hero/heroSection2.jsx'
import { HowItWorks } from '@/app/ui/home/howItWorks/howItWorks.jsx'
import { WhatsappOrders } from '@/app/ui/home/whatsappOrders/whatsappOrders.jsx'
import { Pricing } from '@/app/ui/home/pricing/pricing.jsx'


export default function Home() {
  return (
    <>
      <HeroTwo />
      <HowItWorks />
      <WhatsappOrders />
      <Pricing />
    </>
  )
}
