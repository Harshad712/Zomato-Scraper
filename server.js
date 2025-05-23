const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

app.get('/scrape', async (req, res) => {
  const { res_id, page } = req.query;

  if (!res_id || !page) {
    return res.status(400).json({ error: 'Missing res_id or page' });
  }

  const offset = (page - 1) * 5;
  const url = `https://www.zomato.com/webroutes/reviews/loadMore?res_id=${res_id}&limit=5&offset=${offset}&profile_action=fromRestaurantReview`;

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept': 'application/json, text/plain, */*',
        'Referer': `https://www.zomato.com/`,
      }
    });

    res.json(response.data);
  } catch (error) {
    const details = error.response?.status === 403
      ? 'Access Denied by Zomato (403)'
      : error.message;

    res.status(500).json({
      error: 'Scraping failed',
      details,
    });
  }
});

app.listen(3000, () => {
  console.log('✅ Server is running on port 3000');
});
