"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { addProduct } from "@/actions/product.actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import AuthModal from "./AuthModal";

export default function AddProductForm({ user }) {
  const [url, setUrl] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("url", url);

    const result = await addProduct(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product Tracked Successfully");
      setUrl("");
    }

    setIsLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste Product URL (Amazon, Myntra, etc.)"
            className="text-base h-12"
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}
