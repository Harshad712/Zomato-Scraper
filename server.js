const puppeteer = require('puppeteer');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
  const { res_id, page } = req.query;

  if (!res_id || !page) {
    return res.status(400).json({ error: 'Missing res_id or page' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pageObj = await browser.newPage();

    const targetUrl = `https://www.zomato.com/webroutes/reviews/loadMore?res_id=${res_id}&limit=5&offset=${(page - 1) * 5}&profile_action=fromRestaurantReview`;

    await pageObj.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
    });

    // Extract the raw JSON string from the page
    const rawBody = await pageObj.evaluate(() => document.body.innerText);

    // Safely parse JSON
    const json = JSON.parse(rawBody);

    await browser.close();
    res.json(json);
  } catch (error) {
    if (browser) await browser.close();
    res.status(500).json({
      error: 'Scraping failed',
      details: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
