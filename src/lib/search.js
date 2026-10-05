export const PRICE_BANDS = [
  { value: "", label: "Qualquer faixa de preço", min: 0, max: Infinity },
  { value: "ate-300", label: "Até R$ 300 mil", min: 0, max: 300000 },
  {
    value: "300-600",
    label: "Acima de R$ 300 mil até R$ 600 mil",
    min: 300000,
    max: 600000,
  },
  {
    value: "acima-600",
    label: "Acima de R$ 600 mil",
    min: 600000,
    max: Infinity,
  },
];
export const normalize = (text = "") =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function filterProperties(
  properties,
  { type = "", location = "", priceBand = "" },
) {
  const band = PRICE_BANDS.find((b) => b.value === priceBand) || PRICE_BANDS[0];
  return properties
    .filter((p) => {
      if (p.isExample || (type && p.category !== type)) return false;
      if (
        !normalize(`${p.neighborhood || ""} ${p.city || ""}`).includes(
          normalize(location.trim()),
        )
      )
        return false;
      if (
        priceBand &&
        (p.price == null ||
          p.price > band.max ||
          (band.min > 0 ? p.price <= band.min : p.price < 0))
      )
        return false;
      return true;
    })
    .sort(
      (a, b) =>
        Number(b.city?.includes("São Leopoldo")) -
        Number(a.city?.includes("São Leopoldo")),
    );
}
