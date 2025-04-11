import React, { useEffect, useState } from "react";

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || "An error occurred while fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return <div>{/* Render your products component here */}</div>;
};

export default ProductsPage;
