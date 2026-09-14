import { HeartHandshake } from 'lucide-react'
import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import PlaceholderPhoto from '../components/PlaceholderPhoto'
import { SALES_STORIES } from '../data/stories'

const VARIANT_GRADIENTS = {
  1: 'from-navy-700 via-navy-800 to-navy-950',
  2: 'from-navy-800 via-navy-700 to-navy-950',
}

export default function RealStories() {
  return (
    <section id="historias-reais" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow tone="dark">Vendas realizadas</SectionEyebrow>
        </Reveal>

        <Reveal as="h2" delay={0.08} className="mt-4 max-w-xl font-display text-4xl font-semibold text-navy-950 sm:text-5xl">
          Cada novo endereço,
          <br />
          <em className="font-medium text-accent-600 italic">uma nova história.</em>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {SALES_STORIES.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.12}>
              <article className="overflow-hidden rounded-2xl border border-navy-950/10 bg-white shadow-soft">
                <PlaceholderPhoto
                  icon={HeartHandshake}
                  gradientClassName={VARIANT_GRADIENTS[story.image.variant] || VARIANT_GRADIENTS[1]}
                  iconClassName="h-28 w-28"
                  label="Foto do fechamento"
                  className="aspect-[16/10] w-full"
                />
                <div className="px-6 py-6">
                  <p className="text-xs font-semibold tracking-[0.15em] text-accent-700 uppercase">
                    {story.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-xl font-semibold text-navy-950">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-navy-950/60">{story.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
