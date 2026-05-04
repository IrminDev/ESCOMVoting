import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { Stats } from './components/Stats'
import { CtaSection } from './components/CtaSection'
import { ClosedElectionsSection } from './components/ClosedElectionsSection'

export function HomePage() {
  return (
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <ClosedElectionsSection />
      <CtaSection />
    </main>
  )
}
