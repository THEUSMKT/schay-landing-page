import { useEffect, useState } from "react";
import Cta from "../components/Cta";
import PropertyGrid from "../components/PropertyGrid";
import { CATEGORY_LIST, PROPERTIES } from "../data/properties";
import { buildWhatsAppLink } from "../data/site";
import { PRICE_BANDS, filterProperties } from "../lib/search";
import { trackEvent } from "../lib/analytics";

const initial = { type: "", location: "", priceBand: "" };
const fieldClass =
  "mt-2 w-full rounded-xl border border-navy-950/20 bg-white px-3 py-3 text-base text-navy-950";
const locations = [
  ...new Set(
    PROPERTIES.filter((p) => !p.isExample)
      .flatMap((p) => [p.city, p.neighborhood])
      .filter(Boolean),
  ),
].sort();
export default function PropertySearch() {
  const [filters, setFilters] = useState(initial);
  const touched = Object.values(filters).some(Boolean);
  const results = filterProperties(PROPERTIES, filters);
  const category = CATEGORY_LIST.find((c) => c.slug === filters.type);
  const band = PRICE_BANDS.find((b) => b.value === filters.priceBand);
  const summary = [
    category?.navLabel,
    filters.location.trim(),
    filters.priceBand ? band?.label : "",
  ]
    .filter(Boolean)
    .join(" · ");
  useEffect(() => {
    window.schaySearchSummary = summary;
    window.dispatchEvent(new Event("schay-search-change"));
    if (!touched) return;
    const timer = setTimeout(() => {
      trackEvent("property_search", {
        category: filters.type,
        price_band: filters.priceBand,
        result_count: results.length,
      });
      if (!results.length)
        trackEvent("search_no_results", {
          category: filters.type,
          price_band: filters.priceBand,
          result_count: 0,
        });
    }, 600);
    return () => clearTimeout(timer);
  }, [summary, filters.type, filters.priceBand, results.length, touched]);
  const update = (key) => (event) =>
    setFilters((current) => ({ ...current, [key]: event.target.value }));
  return (
    <section id="busca" className="scroll-mt-24 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="text-3xl text-navy-950">O que você está buscando?</h2>
        <p className="mt-3 text-navy-600">
          Filtre os imóveis ou envie suas preferências diretamente para a Schay.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <label className="text-sm font-medium">
            Tipo de imóvel
            <select
              value={filters.type}
              onChange={update("type")}
              className={fieldClass}
            >
              <option value="">Qualquer tipo</option>
              {CATEGORY_LIST.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.navLabel}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium">
            Cidade ou bairro
            <input
              list="localizacoes"
              value={filters.location}
              onChange={update("location")}
              placeholder="Ex.: São Leopoldo ou Campestre"
              className={fieldClass}
            />
            <datalist id="localizacoes">
              {locations.map((location) => (
                <option value={location} key={location} />
              ))}
            </datalist>
          </label>
          <label className="text-sm font-medium">
            Faixa de preço
            <select
              value={filters.priceBand}
              onChange={update("priceBand")}
              className={fieldClass}
            >
              {PRICE_BANDS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Cta
            href={buildWhatsAppLink(
              `Olá, Schay! Estou procurando um imóvel${summary ? ": " + summary : " em São Leopoldo"}. Pode me ajudar a encontrar opções?`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="search"
            data-category={filters.type}
          >
            Enviar minha busca no WhatsApp
          </Cta>
          {touched && (
            <button
              onClick={() => setFilters(initial)}
              className="rounded-lg px-3 py-3 text-sm font-semibold underline underline-offset-4"
            >
              Limpar filtros
            </button>
          )}
        </div>
        {filters.priceBand && (
          <p className="mt-3 text-sm text-navy-600">
            Esta seleção inclui apenas imóveis com preço informado.
          </p>
        )}
        {touched && (
          <div className="mt-8">
            <h3
              aria-live="polite"
              id="resultados-da-busca"
              className="text-xl text-navy-950"
            >
              {results.length
                ? `${results.length} ${results.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`
                : "Não encontramos imóveis com esses filtros no site."}
            </h3>
            {results.length ? (
              <PropertyGrid
                properties={results}
                headingId="resultados-da-busca"
              />
            ) : (
              <p className="mt-3 text-navy-600">
                Conte o que você procura para a Schay consultar outras
                possibilidades. Use o botão acima para enviar sua busca.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
