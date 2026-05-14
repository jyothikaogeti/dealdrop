"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { scrapeProduct } from "@/lib/firecrawl";

export async function addProduct(formData) {
  const url = formData.get("url");

  if (!url) {
    return { error: "URL is Required" };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "User Not Authenticated" };
    }

    const productData = await scrapeProduct(url);

    if (!productData?.productName || !productData?.currentPrice) {
      return { error: "Could not extract product information from this URL" };
    }

    const newPrice = parseFloat(productData.currentPrice);
    const currency = productData.currencyCode || "USD";

    const { data: existingProduct } = await supabase
      .from("products")
      .select("id, current_price")
      .eq("user_id", user.id)
      .eq("product_url", url)
      .single();

    const isUpdate = !!existingProduct;

    const { data: product, error: productError } = await supabase
      .from("products")
      .upsert(
        {
          user_id: user.id,
          product_url: url,
          product_name: productData.productName,
          current_price: newPrice,
          currency: currency,
          image_url: productData.productImageUrl,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,product_url",
          ignoreDuplicates: false,
        },
      )
      .select()
      .single();

    if (productError) {
      throw productError;
    }

    const shouldAddHistory =
      !isUpdate || existingProduct.current_price !== newPrice;

    if (shouldAddHistory) {
      const { error: historyError } = await supabase
        .from("price_history")
        .insert({
          product_id: product.id,
          price: newPrice,
          currency: currency,
        });

      if (historyError) {
        throw historyError;
      }
    }

    revalidatePath("/");

    return {
      success: true,
      product,
      message: isUpdate
        ? "Product Updated with Latest Price"
        : "Product Added Successfully",
    };
  } catch (error) {
    console.error("Add Product Error:", error);
    return { error: error?.message || "Failed to Add Product" };
  }
}

export async function deleteProduct(productId) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;

    revalidatePath("/");

    return {
      success: true,
      message: "Product Deleted Successfully",
    };
  } catch (error) {
    console.error("Delete Product Error:", error);
    return {
      error: error?.message || "Failed to Delete Product",
    };
  }
}

export async function getProducts() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get Products Error:", error);
    return {
      error: error?.message || "Failed to Get Products",
    };
  }
}

export async function getPriceHistory(productId) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("price_history")
      .select("*")
      .eq("product_id", productId)
      .order("checked_at", { ascending: true });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Get Price History Error:", error);
    return [];
  }
}
