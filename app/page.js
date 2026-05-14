import Image from "next/image";
import { TrendingDown } from "lucide-react";

import { getProducts } from "@/actions/product.actions";
import { createClient } from "@/lib/supabase/server";
import { FEATURES } from "@/lib/data";
import AuthButton from "@/components/AuthButton";
import AddProductForm from "@/components/AddProductForm";
import ProductCard from "@/components/ProductCard";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const products = user ? await getProducts() : [];

  return (
    <main className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/80 border-b border-gray-200 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/dealdrop-logo.png"
              alt="DealDrop Logo"
              width={600}
              height={200}
              className="w-auto h-10"
            />
          </div>

          <AuthButton user={user} />
        </div>
      </header>

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="bg-orange-100 text-orange-700 text-sm font-medium rounded-full inline-flex items-center gap-2 px-6 py-2 mb-6">
            Made with ❤️ by Jyothika
          </div>

          <h2 className="text-5xl text-gray-900 font-bold tracking-tight mb-4">
            Never Miss a Price Drop
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Track prices from any e-commerce site. Get instant alerts when
            prices drops. Save money effortlessly.
          </p>

          <AddProductForm user={user} />

          {products.length === 0 && (
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-white border border-gray-200 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex justify-center items-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>

                  <h3 className="text-gray-900 font-semibold mb-2">{title}</h3>

                  <p className="text-gray-600 text-sm">{description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {user && products.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl text-gray-900 font-bold">
              Your Tracked Products
            </h3>

            <span className="text-gray-500 text-sm">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 items-start">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {user && products.length === 0 && (
        <section className="max-w-2xl mx-auto text-center px-4 pb-20">
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12">
            <TrendingDown className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h3 className="text-xl text-gray-900 font-semibold mb-2">
              No Products Yet
            </h3>

            <p className="text-gray-600">
              Add your first product above to start tracking prices!
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
