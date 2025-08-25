import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setErr(null);

    fetch("https://fakestoreapi.com/products", { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load products");
        return r.json();
      })
      .then(setProducts)
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, []);

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (err) return <p style={{ padding: 16, color: "crimson" }}>Error: {err}</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Catalog</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {products.map((p) => (
          <article
            key={p.id}
            style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}
          >
            <Link
              to={`/product/${p.id}`}
              style={{ color: "inherit", textDecoration: "none" }}
            >
              <img
                src={p.image}
                alt={p.title}
                style={{ width: "100%", height: 160, objectFit: "contain" }}
              />
              <h3 style={{ fontSize: 14, lineHeight: 1.3 }}>{p.title}</h3>
              <strong>${p.price}</strong>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
