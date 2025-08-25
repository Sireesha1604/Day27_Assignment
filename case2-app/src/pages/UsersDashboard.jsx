import { useEffect, useState } from "react";

export default function UsersDashboard() {
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [err, setErr] = useState(null);

  // Fetch users list on mount
  useEffect(() => {
    let alive = true;
    setLoadingList(true);
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((r) => { if (!r.ok) throw new Error("Failed to load users"); return r.json(); })
      .then((data) => { if (alive) setUsers(data); })
      .catch((e) => setErr(e.message))
      .finally(() => setLoadingList(false));
    return () => { alive = false; };
  }, []);

  // Fetch details when user is selected
  useEffect(() => {
    if (!selectedId) { setDetail(null); return; }
    const ctrl = new AbortController();
    setLoadingDetail(true);
    fetch(`https://jsonplaceholder.typicode.com/users/${selectedId}`, { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error("Failed to load user details"); return r.json(); })
      .then(setDetail)
      .catch((e) => { if (e.name !== "AbortError") setErr(e.message); })
      .finally(() => setLoadingDetail(false));
    return () => ctrl.abort();
  }, [selectedId]);

  if (loadingList) return <p style={{ padding: 16 }}>Loading users…</p>;
  if (err) return <p style={{ padding: 16, color: "crimson" }}>Error: {err}</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16, padding: 16 }}>
      <div>
        <h3>Users</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {users.map((u) => (
            <li key={u.id} style={{ marginBottom: 8 }}>
              <button onClick={() => setSelectedId(u.id)}>{u.name}</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Profile</h3>
        {loadingDetail && <p>Loading details…</p>}
        {!loadingDetail && detail && (
          <div>
            <p><strong>{detail.name}</strong></p>
            <p>{detail.email}</p>
            <p>{detail.phone}</p>
            <p>{detail.website}</p>
            {detail.address && (
              <p>
                {detail.address.suite}, {detail.address.street}, {detail.address.city} {detail.address.zipcode}
              </p>
            )}
            {detail.company && <p>Company: {detail.company.name}</p>}
          </div>
        )}
        {!loadingDetail && !detail && <p>Select a user.</p>}
      </div>
    </div>
  );
}
