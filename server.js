const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/scrape', async (req, res) => {
  const { res_id, page } = req.query;

  if (!res_id || !page) {
    return res.status(400).json({ error: 'Missing res_id or page' });
  }

  const url = `https://www.zomato.com/webroutes/reviews/loadMore?sort=dd&filter=reviews-dd&res_id=${res_id}&page=${page}`;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const pageInstance = await browser.newPage();

    await pageInstance.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0'
    });

    await pageInstance.goto(url, { waitUntil: 'networkidle2' });
    const content = await pageInstance.evaluate(() => document.body.innerText);

    await browser.close();

    res.json(JSON.parse(content));
  } catch (err) {
    console.error('Scraping failed:', err);
    res.status(500).json({ error: 'Scraping failed', details: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Puppeteer scraping server running at http://localhost:${PORT}`);
});
