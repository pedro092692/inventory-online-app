import { Navbar } from './ui/home/navbar/navbar.jsx'
import { Hero } from './ui/home/hero/heroSection.jsx'
import { Benefits } from './ui/home/benefits/benefits.jsx'
import { Customer } from './ui/home/customers/customers.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Benefits /> 
      <Customer />
    </>
  )
}
