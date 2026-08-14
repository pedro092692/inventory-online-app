import { Hero } from '@/app/ui/home/hero/heroSection.jsx'
import { HeroTwo } from '@/app/ui/home/hero/heroSection2.jsx'
import { Benefits } from '@/app/ui/home/benefits/benefits.jsx'
import { Customer } from '@/app/ui/home/customers/customers.jsx'
import { CallToAction } from '@/app/ui/home/callToAction/callToAction.jsx'


export default function Home() {
  return (
    <>
      <HeroTwo />
      <Benefits /> 
      <Customer />
      <CallToAction />
    </>
  )
}
