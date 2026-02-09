import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ProductForm from "../components/admin/ProductForm";
import TableProduct from "../components/admin/TableProduct";
import { API_BASE } from "../config/api";

interface Product {
  id: number;
  name: string;
  lineId: number;
  lineName?: string;
}

export default function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [lines, setLines] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const authFetch = async (url: string) => {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/signin";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    throw new Error("Error en la petición");
  }

  return res.json();
};

  const loadProducts = async () => {
  const data = await authFetch(`${API_BASE}/category`);
  setProducts(data);
};

const loadLines = async () => {
  const data = await authFetch(`${API_BASE}/line`);
  setLines(data);
};

  useEffect(() => {
    loadProducts();
    loadLines();
  }, []);

  return (
    <>
      <PageMeta title="Productos" description="Admin" />
      <PageBreadcrumb pageTitle="Productos" />

      <div className="mt-28 space-y-6 px-4 lg:p-6">
        <ProductForm
          selectedProduct={selectedProduct}
          clearSelection={() => setSelectedProduct(null)}
          reload={loadProducts}
          lines={lines}
        />

        <TableProduct
          products={products}
          onLoad={(p: Product) => setSelectedProduct(p)}
        />

      </div>
    </>
  );
}
