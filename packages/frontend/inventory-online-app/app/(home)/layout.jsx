import { Navbar } from '../ui/home/navbar/navbar'
import { Footer } from '../ui/home/footer/footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div style={{flexGrow: '1'}}>
        {children}
      </div>
      <Footer />
    </>
  )
}