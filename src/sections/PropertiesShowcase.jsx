import { Link } from "react-router-dom";
import PropertyGrid from "../components/PropertyGrid";
import { CATEGORY_LIST, PROPERTIES } from "../data/properties";

export default function PropertiesShowcase() {
  const local = PROPERTIES.filter(
    (p) => !p.isExample && p.city?.includes("São Leopoldo"),
  );
  const featured = CATEGORY_LIST.flatMap((category) =>
    local.filter((p) => p.category === category.slug).slice(0, 2),
  );
  return (
    <section id="imoveis" className="scroll-mt-24 bg-paper-100 py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
          Encontre seu próximo endereço
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl text-navy-950 sm:text-4xl">
          Imóveis disponíveis em São Leopoldo e região
        </h2>
        <p className="mt-4 text-navy-600">
          Explore opções reais e consulte a disponibilidade diretamente com a
          Schay.
        </p>
        <nav
          aria-label="Categorias de imóveis"
          className="my-6 flex flex-wrap gap-3"
        >
          {CATEGORY_LIST.map((c) => (
            <Link
              key={c.slug}
              to={c.path}
              className="rounded-full border border-navy-950/20 bg-white px-5 py-3 text-sm font-semibold text-navy-950 hover:bg-paper-200"
            >
              {c.navLabel}
            </Link>
          ))}
        </nav>
        <PropertyGrid properties={featured} />
        <p className="mt-6 text-sm text-navy-600">
          Seleção de imóveis em São Leopoldo. Consulte cada categoria para ver
          também as opções da região.
        </p>
      </div>
    </section>
  );
}
