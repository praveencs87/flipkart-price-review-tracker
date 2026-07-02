import { Actor } from 'apify';
import { CheerioCrawler, log } from 'crawlee';

await Actor.init();

try {
    const input = await Actor.getInput();
    if (!input || !input.productUrls || input.productUrls.length === 0) {
        throw new Error('productUrls input is required!');
    }

    const { productUrls } = input;

    let totalProductsExtracted = 0;

    const crawler = new CheerioCrawler({
        maxConcurrency: 10,
        
        async requestHandler({ request, $, log }) {
            const url = request.url;
            log.info(`Scraping Flipkart Product: ${url}`);
            
            // Flipkart often embeds a huge JSON blob in a script tag with id="is_script" or similar.
            // But we can also fallback to scraping the HTML DOM which is SSR'd.

            let title = $('span.B_NuCI').text().trim() || $('span.VU-Tz5').text().trim() || $('h1').text().trim();
            
            // Current Price
            let currentPrice = $('div._30jeq3._16Jk6d').text().trim() || $('div.Nx9bqj.CxhGGd').text().trim();
            
            // Original Price
            let originalPrice = $('div._3I9_wc._2p6lqe').text().trim() || $('div.yRaY8j.A60-Kd').text().trim();
            
            // Discount
            let discount = $('div._3Ay6Sb._31Dcoz > span').text().trim() || $('div.UkUFwK.WW8yVX > span').text().trim();

            // Ratings
            let overallRating = $('div._3LWZlK').first().text().trim() || $('div.XQDdHH').first().text().trim();
            
            let ratingsAndReviewsText = $('span._2_R_DZ').first().text().trim() || $('span.Wphh3N').first().text().trim();
            let totalRatings = null;
            let totalReviews = null;
            
            if (ratingsAndReviewsText) {
                // Usually looks like "45,231 Ratings & 2,104 Reviews"
                const parts = ratingsAndReviewsText.split('&');
                if (parts.length > 0) {
                    totalRatings = parts[0].replace('Ratings', '').trim();
                }
                if (parts.length > 1) {
                    totalReviews = parts[1].replace('Reviews', '').trim();
                }
            }

            // Top Reviews (Flipkart changes classes often, so we use common structural patterns)
            const topReviews = [];
            
            // Trying multiple known class patterns for review blocks
            const reviewBlocks = $('div.col._2wzgFH, div.col.EPCmJX, div.RcXBOT').toArray();
            
            for (const block of reviewBlocks) {
                const el = $(block);
                
                // Rating inside the block
                const rating = el.find('div._3LWZlK, div.XQDdHH').text().trim();
                
                // Review Text
                const text = el.find('div.t-ZTKy > div > div, div.Zmyq-m').text().trim() || el.find('div.t-ZTKy').text().trim();
                
                // Author
                const author = el.find('p._2sc7ZR._2V5E20, p._2NsDsF.AwS1CA').first().text().trim();
                
                if (rating && text) {
                    topReviews.push({
                        author: author || 'Anonymous',
                        rating,
                        text: text.replace(/READ MORE$/, '').trim()
                    });
                }
            }

            // Check if we successfully got the title (if not, it might be a bot block or layout change)
            if (!title) {
                log.warning(`Could not find product title on ${url}. The layout might have changed or a bot challenge occurred.`);
            }

            const output = {
                url,
                title,
                currentPrice,
                originalPrice,
                discount,
                overallRating,
                totalRatings,
                totalReviews,
                topReviews,
                scrapedAt: new Date().toISOString()
            };

            await Actor.pushData(output);
            
            totalProductsExtracted++;
            
            // PPE Monetization
            await Actor.charge({ eventName: 'product-scraped', count: 1 });
            
            log.info(`✅ Extracted data for: ${title.substring(0, 30)}...`);
        },
        
        async failedRequestHandler({ request, log }) {
            log.error(`Failed to scrape ${request.url} after multiple retries.`);
        },
    });

    log.info(`Starting Flipkart crawler for ${productUrls.length} products...`);
    
    await crawler.addRequests(productUrls);
    await crawler.run();

    log.info(`🎉 Finished! Extracted data for ${totalProductsExtracted} products.`);
} catch (error) {
    log.error('Actor failed:', error);
    throw error;
}

await Actor.exit();
