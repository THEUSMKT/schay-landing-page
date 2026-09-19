import Hero from '../sections/Hero'
import Pillars from '../sections/Pillars'
import PropertiesShowcase from '../sections/PropertiesShowcase'
import BrokerStory from '../sections/BrokerStory'
import RealStories from '../sections/RealStories'
import CareSection from '../sections/CareSection'
import ContactForm from '../sections/ContactForm'

export default function Home() {
  return (
    <>
      <Hero />
      <Pillars />
      <PropertiesShowcase />
      <BrokerStory />
      <RealStories />
      <CareSection />
      <ContactForm />
    </>
  )
}
