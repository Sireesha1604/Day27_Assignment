import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams(); // /product/:id
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const ctrl = new AbortController();
    setLoading(true);
    setErr(null);

    fetch(`https://fakestoreapi.com/products/${id}`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch product");
        return r.json();
      })
      .then(setProduct)
      .catch((e) => {
        if (e.name !== "AbortError") setErr(e.message);
      })
      .finally(() => setLoading(false));

    return () => ctrl.abort();
  }, [id]);

  if (loading) return <p style={{ padding: 16 }}>Loading…</p>;
  if (err) return <p style={{ padding: 16, color: "crimson" }}>Error: {err}</p>;
  if (!product) return null;

  return (
    <div
      style={{
        padding: 16,
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: 24,
      }}
    >
      <div>
        <img
          src={product.image}
          alt={product.title}
          style={{ width: "100%", maxWidth: 360, height: 360, objectFit: "contain" }}
        />
      </div>
      <div>
        <h2 style={{ marginTop: 0 }}>{product.title}</h2>
        <p>{product.description}</p>
        <p>Category: <em>{product.category}</em></p>
        <p>Rating: {product?.rating?.rate} ({product?.rating?.count})</p>
        <h3>${product.price}</h3>
        <Link to="/">← Back to catalog</Link>
      </div>
    </div>
  );
}
