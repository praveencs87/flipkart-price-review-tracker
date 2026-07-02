# Flipkart Price and Review Tracker

**Extract product pricing, discounts, overall ratings, and top reviews directly from Flipkart product pages at high speeds.**

Tracking product performance on India's massive eCommerce platform can be difficult due to bot protections and constantly shifting HTML layouts. 

This actor utilizes a high-speed static scraper paired with advanced browser TLS fingerprinting to bypass anti-bot systems while remaining exceptionally fast. It parses Flipkart's Server-Side Rendered (SSR) data to cleanly extract the core details of any product.

## What can this Actor do?

- ✅ **Pricing & Discounts** - Extracts the current selling price, original MRP, and the discount percentage.
- ✅ **Ratings Data** - Grabs the overall star rating (e.g., 4.5), the total number of ratings, and the total number of reviews.
- ✅ **Top Reviews** - Extracts the top reviews immediately visible on the main product page (including reviewer name, rating, and review text) for quick sentiment analysis.
- ✅ **Lightning Fast** - Uses `CheerioCrawler` and `got-scraping` instead of a heavy headless browser.

## Why use this Actor?

- 🎯 **Competitor Tracking** - Monitor the pricing and discounts of your competitors on Flipkart.
- 🤝 **Brand Management** - Keep track of the top reviews and overall ratings for your own products to manage brand reputation.
- 📊 **Arbitrage & Dropshipping** - Track price drops in real-time.

## How to use it

1. Enter a list of Flipkart product URLs into the **Flipkart Product URLs** field.
2. Click Start!

## How much does it cost?

This actor uses a **Pay-Per-Event (PPE)** pricing model. You only pay for the products successfully scraped!
- **$1.00 per 1,000 products scraped.**

## Output Example

When a product is extracted, the actor pushes this data to your dataset:

```json
{
  "url": "https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4",
  "title": "Apple iPhone 15 (Black, 128 GB)",
  "currentPrice": "₹65,999",
  "originalPrice": "₹79,900",
  "discount": "17% off",
  "overallRating": "4.6",
  "totalRatings": "45,231",
  "totalReviews": "2,104",
  "topReviews": [
    {
      "author": "Praveen",
      "rating": "5",
      "text": "Amazing phone with great battery life and camera."
    }
  ],
  "scrapedAt": "2023-10-25T15:00:00.000Z"
}
```
