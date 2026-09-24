import Hero from '../sections/Hero'
import PropertySearch from '../sections/PropertySearch'
import PropertiesShowcase from '../sections/PropertiesShowcase'
import HowItWorks from '../sections/HowItWorks'
import BrokerStory from '../sections/BrokerStory'
import RealStories from '../sections/RealStories'
import Faq from '../sections/Faq'
import ContactForm from '../sections/ContactForm'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function Home() {
  useDocumentTitle('Schay Corretora | Imóveis à venda em São Leopoldo e região')

  return (
    <>
      <Hero />
      <PropertySearch />
      <PropertiesShowcase />
      <HowItWorks />
      <BrokerStory />
      <RealStories />
      <Faq />
      <ContactForm />
    </>
  )
}
