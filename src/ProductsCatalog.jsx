import { useEffect, useState } from "react";

/**
 * Case Study 1: Product Catalog with Categories
 * - Fetch categories on mount (one time).
 * - Fetch products on mount and whenever category changes.
 * - Show loading and error states.
 * Notes:
 * API [Application Programming Interface] used: https://fakestoreapi.com/
 */
export default function ProductCatalog() {
  const [categories, setCategories] = useState(["all"]);
  const [category, setCategory] = useState("all");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);     // for products
  const [err, setErr] = useState(null);

  // Load categories once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products/categories");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json(); // array of strings
        if (alive) setCategories(["all", ...data]);
      } catch {
        // If categories fail, we still keep the default ["all"]
      }
    })();
    return () => { alive = false; };
  }, []);

  // Load products whenever category changes
  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setErr(null);

    const url =
      category === "all"
        ? "https://fakestoreapi.com/products"
        : `https://fakestoreapi.com/products/category/${encodeURIComponent(category)}`;

    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load products");
        return r.json();
      })
      .then((data) => setProducts(data))
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message);
      })
      .finally(() => setLoading(false));

    // Cleanup to avoid setting state after unmount
    return () => ctrl.abort();
  }, [category]);

  // UI [User Interface]
  return (
    <div style={{ padding: 16 }}>
      <h2>Catalog</h2>

      <label>
        Category:&nbsp;
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </label>

      {loading && <p style={{ marginTop: 16 }}>Loading…</p>}
      {err && (
        <div style={{ marginTop: 16, color: "crimson" }}>
          Error: {err} &nbsp;
          <button onClick={() => setCategory((c) => c)}>Retry</button>
        </div>
      )}

      {!loading && !err && (
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
              <img
                src={p.image}
                alt={p.title}
                style={{ width: "100%", height: 160, objectFit: "contain" }}
              />
              <h3 style={{ fontSize: 14, lineHeight: 1.3 }}>{p.title}</h3>
              <strong>${p.price}</strong>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
