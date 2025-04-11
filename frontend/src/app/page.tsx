"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price_per_day: number;
  available: boolean;
  photo: string;
  description: string;
}

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch("http://localhost:3030/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        // Get the first 3 products as featured
        setFeaturedProducts(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Rent Quality Sports Equipment
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Access top-quality sports equipment for your activities without
              the commitment of buying. From tennis rackets to camping gear,
              we've got you covered.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/products"
                className="bg-white text-indigo-700 px-6 py-3 rounded-md font-medium hover:bg-indigo-50 transition"
              >
                Browse Products
              </Link>
              <Link
                href="/register"
                className="bg-indigo-500 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-400 transition"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Featured Products
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                Loading featured products...
              </p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No products available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white overflow-hidden shadow rounded-lg"
                >
                  {product.photo && (
                    <div className="h-48 w-full overflow-hidden">
                      <img
                        src={product.photo}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="text-lg font-bold text-indigo-600">
                        ${product.price_per_day}/day
                      </span>
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          product.available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.available ? "Available" : "Not Available"}
                      </span>
                    </div>
                    <div className="mt-4">
                      <Link
                        href={`/products/${product.id}`}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Affordable Prices</h3>
              <p className="text-gray-500">
                Rent high-quality equipment at fraction of the purchase cost.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Quality Guaranteed</h3>
              <p className="text-gray-500">
                All equipment is regularly maintained and inspected.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Fast & Easy</h3>
              <p className="text-gray-500">
                Simple booking process with quick delivery and pickup options.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
