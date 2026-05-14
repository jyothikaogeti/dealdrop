"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { deleteProduct } from "@/actions/product.actions";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import PriceChart from "./PriceChart";

export default function ProductCard({ product }) {
  const [showChart, setShowChart] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProduct = async () => {
    if (!confirm("Remove this Product from Tracking ?")) return;

    setIsDeleting(true);

    const result = await deleteProduct(product.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product Deleted Successfully");
    }

    setIsDeleting(false);
  };

  return (
    <Card clssName="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex gap-4">
          {product.image_url && (
            <div className="relative w-20 h-20">
              <Image
                src={product.image_url}
                alt={product.product_name}
                fill
                sizes="80px"
                className="object-cover border rounded-md"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 font-semibold line-clamp-2 mb-2">
              {product.product_name}
            </h3>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-orange-500 font-bold">
                {product.currency} {product.current_price}
              </span>

              <Badge variant="secondary" className="gap-1">
                <TrendingDown className="w-3 h-3" />
                Tracking
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1"
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Chart
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Chart
              </>
            )}
          </Button>

          <Button size="sm" variant="outline" className="gap-1" asChild>
            <Link
              href={product.product_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4" />
              View Product
            </Link>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
            onClick={handleDeleteProduct}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        </div>
      </CardContent>

      {showChart && (
        <CardFooter className="pt-0">
          <PriceChart productId={product.id} />
        </CardFooter>
      )}
    </Card>
  );
}
