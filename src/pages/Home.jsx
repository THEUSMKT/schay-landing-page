import Hero from "../sections/Hero";
import PropertySearch from "../sections/PropertySearch";
import PropertiesShowcase from "../sections/PropertiesShowcase";
import HowItWorks from "../sections/HowItWorks";
import BrokerStory from "../sections/BrokerStory";
import RealStories from "../sections/RealStories";
import Faq from "../sections/Faq";
import ContactForm from "../sections/ContactForm";
import SectionFade from "../components/SectionFade";
import useDocumentTitle from "../hooks/useDocumentTitle";

export default function Home() {
  useDocumentTitle(
    "Schay Corretora | Imóveis à venda em São Leopoldo e região",
  );

  // As passagens claro→claro (busca → vitrine → como funciona, vendas →
  // dúvidas) são resolvidas no próprio fundo de cada seção; aqui ficam só
  // as passagens entre fundo escuro e claro, que pedem mais distância.
  return (
    <>
      <Hero />
      <SectionFade variant="navy-to-white" className="h-8 sm:h-12" />
      <PropertySearch />
      <PropertiesShowcase />
      <RealStories />
      <HowItWorks />
      <SectionFade variant="white-to-navy" className="h-8 sm:h-12" />
      <BrokerStory />
      <SectionFade variant="navy-to-cream" className="h-8 sm:h-12" />
      <Faq />
      <ContactForm />
      <SectionFade variant="paper-to-navy" className="h-8 sm:h-12" />
    </>
  );
}
