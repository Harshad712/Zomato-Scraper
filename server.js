const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const SCRAPER_API_KEY = '57eda6a2bce736dff7b490cb45003b0c'; // Replace with your actual key

app.get('/scrape', async (req, res) => {
  const { res_id, page } = req.query;

  if (!res_id || !page) {
    return res.status(400).json({ error: 'Missing res_id or page' });
  }

  const offset = (page - 1) * 5;
  const targetUrl = `https://www.zomato.com/webroutes/reviews/loadMore?res_id=${res_id}&limit=5&offset=${offset}&profile_action=fromRestaurantReview`;

  try {
    const response = await axios.get('http://api.scraperapi.com', {
      params: {
        api_key: SCRAPER_API_KEY,
        url: targetUrl
      }
    });

    const data = JSON.parse(response.data.match(/{.*}/s)[0]); // In case wrapper HTML is present
    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Scraping failed',
      details: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
