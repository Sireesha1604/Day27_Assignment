import { Routes, Route, Link } from "react-router-dom";
import ProductCatalog from "./pages/ProductCatalog.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import UsersDashboard from "./pages/UsersDashboard.jsx";   // <-- add this
import PostsWithComments from "./pages/PostsWithComments.jsx";


export default function App() {
  return (
    <>
      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12 }}>
  <Link to="/">Catalog</Link>
  <Link to="/users">Users</Link>
  <Link to="/posts">Posts</Link>   {/* new */}
</header>

<Routes>
  <Route path="/" element={<ProductCatalog />} />
  <Route path="/product/:id" element={<ProductDetails />} />
  <Route path="/users" element={<UsersDashboard />} />
  <Route path="/posts" element={<PostsWithComments />} />  {/* new */}
</Routes>

    </>
  );
}

