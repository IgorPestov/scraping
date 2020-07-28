const axios = require("axios");
const cheerio = require("cheerio");

exports.send = async (req, res) => {
  const { postData } = req.body;
  const URL = `https://www.amazon.com/s?k=${postData}&ref=nb_sb_noss_1`;
  const items = [];
  const itemsPage = await axios(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $(".a-link-normal.s-no-outline").each((i, header) => {
        const url = `https://www.amazon.com/${$(header).attr("href")}`;
        items.push({
          url,
        });
      });
      return items;
    })
    .catch(console.error);

  console.log('========',itemsPage);
};
//  const getItem = async(url) => {
//   const URL = `https://www.amazon.com/s?k=${postData}&ref=nb_sb_noss_1`;
//   const items = [];
//   axios(URL)
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       $(".a-link-normal.s-no-outline").each((i, header) => {
//         const url = `https://www.amazon.com/${$(header).attr("href")}`;
//         items.push({
//           url,
//         });
//       });
//       return items
//     })
//     .catch(console.error);
// }
