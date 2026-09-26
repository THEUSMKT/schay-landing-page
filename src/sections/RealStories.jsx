import Reveal from '../components/Reveal'
import SectionEyebrow from '../components/SectionEyebrow'
import { SALES_STORIES } from '../data/stories'

export default function RealStories() {
  return (
    <section
      id="historias-reais"
      className="scroll-mt-24 bg-linear-to-b from-cream-100 from-75% to-paper-100 pt-10 pb-20 sm:pt-14 sm:pb-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionEyebrow tone="dark">Vendas realizadas</SectionEyebrow>
        </Reveal>

        <Reveal
          as="h2"
          delay={0.08}
          className="mt-4 max-w-xl font-display text-4xl font-semibold text-navy-950 sm:text-5xl"
        >
          Transformando <em className="font-medium text-accent-600 italic">histórias.</em>
        </Reveal>

        <Reveal delay={0.14} className="mt-3 max-w-xl text-navy-600">
          Cada novo endereço, uma nova história.
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SALES_STORIES.map((story, index) => (
            <Reveal key={story.id} delay={index * 0.12}>
              <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-navy-950/10 bg-white shadow-soft">
                <div className="relative aspect-[4/5] w-full">
                  <img
                    src={story.image.src}
                    alt={story.image.alt || ''}
                    loading="lazy"
                    style={{ objectPosition: story.image.position || 'center' }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  {/* Gradiente padronizado sobre as 3 fotos de prova real */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col px-6 py-6">
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
