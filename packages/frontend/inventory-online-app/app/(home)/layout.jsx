import { Manrope, IBM_Plex_Mono } from 'next/font/google'
import { Navbar } from '../ui/home/navbar/navbar'
import { Footer } from '../ui/home/footer/footer'

// Fuentes del rediseño (Claude Design), cargadas solo dentro del grupo de
// rutas (home) -- el resto de la app (dashboard, login) sigue usando la
// fuente sfui del layout raíz sin cambios.
const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
})

export default function Layout({ children }) {
  return (
    <div
      className={`${manrope.variable} ${ibmPlexMono.variable}`}
      style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, width: '100%' }}
    >
      <Navbar />
      <div style={{flexGrow: '1'}}>
        {children}
      </div>
      <Footer />
    </div>
  )
}
