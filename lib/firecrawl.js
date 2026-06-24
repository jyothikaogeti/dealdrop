import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({ apiKey: process.env.FIRECRAWL_API_KEY });

export async function scrapeProduct(url) {
  try {
    console.log("Starting Firecrawl scrape for:", url);

    const result = await firecrawl.scrape(url, {
      formats: [
        {
          type: "json",
          schema: {
            type: "object",
            required: ["productName", "currentPrice"],
            properties: {
              productName: {
                type: "string",
              },
              currentPrice: {
                type: "number",
              },
              currencyCode: {
                type: "string",
              },
              productImageUrl: {
                type: "string",
              },
            },
          },
          prompt: `
            Extract the following product information:
              - Product name as "productName"
              - Current product price as NUMBER in "currentPrice"
              - Currency code like USD, INR, EUR as "currencyCode"
              - Main product image URL as "productImageUrl"

            Rules:
              - currentPrice must be numeric only
              - Do not include currency symbols or commas
              - Do not return text for currentPrice
              - If price is unavailable, return null
              - Use the actual product image URL
              - Avoid placeholder or transparent images
          `,
        },
      ],
    });

    console.log("FULL FIRECRAWL RESPONSE:", JSON.stringify(result, null, 2));

    const extractedData = result?.json || result?.data?.json || result?.data;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No Product Data Extracted from URL");
    }

    // Price Validation
    let currentPrice = extractedData.currentPrice;

    if (typeof currentPrice === "string") {
      currentPrice = Number(currentPrice.replace(/[^0-9.]/g, ""));
    }

    currentPrice = Number(currentPrice);

    if (
      currentPrice === null ||
      currentPrice === undefined ||
      isNaN(currentPrice) ||
      currentPrice <= 0
    ) {
      throw new Error("Invalid Product Price Extracted");
    }

    // Image Validation
    let imageUrl = extractedData.productImageUrl;

    if (
      !imageUrl ||
      imageUrl.includes("transparent-background") ||
      imageUrl.includes("placeholder")
    ) {
      imageUrl =
        result?.metadata?.["og:image"] || result?.metadata?.ogImage || null;
    }

    return {
      productName: extractedData.productName,
      currentPrice,
      currencyCode: extractedData.currencyCode || "USD",
      productImageUrl: imageUrl,
    };
  } catch (error) {
    console.error("Firecrawl Scrape Error:", error);
    throw new Error(
      `Failed to Scrape Product: ${error?.message || String(error)}`,
    );
  }
}
