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
                type: "string",
              },
              currencyCode: {
                type: "string",
              },
              productImageUrl: {
                type: "string",
              },
            },
          },
          prompt:
            "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
        },
      ],
    });

    console.log("FULL FIRECRAWL RESPONSE:", JSON.stringify(result, null, 2));

    const extractedData = result?.json || result?.data || result?.data?.json;

    if (!extractedData || !extractedData.productName) {
      throw new Error("No Product Data Extracted from URL");
    }

    return extractedData;
  } catch (error) {
    console.error("Firecrawl Scrape Error:", error);
    throw new Error(
      `Failed to Scrape Product: ${error?.message || String(error)}`,
    );
  }
}
