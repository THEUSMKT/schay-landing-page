import PropertyCard from "./PropertyCard";
export default function PropertyGrid({
  properties,
  heading,
  headingId,
  className = "md:grid-cols-2 xl:grid-cols-3",
}) {
  return (
    <div>
      {heading}
      <div
        aria-labelledby={headingId}
        className={`mt-6 grid gap-6 ${className}`}
      >
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
