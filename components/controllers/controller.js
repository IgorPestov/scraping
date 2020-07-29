const axios = require("axios");
const cheerio = require("cheerio");

exports.send = async (req, res) => {
  const { postData } = req.body;
  const URL = `https://www.amazon.com/s?k=${postData}&ref=nb_sb_noss_1`;

  const itemsPage = await axios(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const items = [];
      $('.s-result-item'||".sg-col-4-of-12"||".sg-col-4-of-36").each((i, elem) => {
        if ($(elem).find("img").attr("src") !== undefined) {
          const img = $(elem).find("img").attr("src");
          const url = `https://www.amazon.com/${$(elem)
            .find("a.a-link-normal.s-no-outline")
            .attr("href")}`;
          const title = $(elem)
            .find("span.a-size-base-plus.a-color-base.a-text-normal")
            .text();
          const price = $(elem).find(".a-offscreen").text()
          console.log(price)
          items.push({
            title,
            url,
            img,
            price,
          });
        }
      });
      return items;
    })
    .catch(console.error);

  res.status(200).send(itemsPage);
};
