const axios = require("axios");
const cheerio = require("cheerio");

exports.send = async (req, res) => {
  const { postData } = req.body;
  const URL = `https://www.amazon.com/s?k=${postData}`;
  const itemsPage = await axios(URL)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const pagesNumber = $("li.a-disabled").text()
      console.log(pagesNumber.replace(/[^0-9\.]/g, ""));      
      const items = [];
      const Class =
        ".sg-col-4-of-24.sg-col-4-of-12.sg-col-4-of-36.s-result-item.s-asin.sg-col-4-of-28.sg-col-4-of-16.sg-col.sg-col-4-of-20.sg-col-4-of-32";
      const ClassHelp = ".s-result-item.s-asin";
      $(ClassHelp).each((i, elem) => {
        if ($(elem).find("img").attr("src") !== undefined) {
          const img = $(elem).find("img").attr("src");
          const url = `https://www.amazon.com/${$(elem)
            .find("a.a-link-normal.s-no-outline")
            .attr("href")}`;
          const title = $(elem)
            .find(".a-size-base-plus.a-color-base.a-text-normal")
            .text();
          const price = $(elem).find(".a-price-whole").text();
          const priceCent = $(elem).find(".a-price-fraction").text();
          items.push({
            title,
            url,
            img,
            price,
            priceCent,
          });
          console.log(items);
        }
      });

      return items;
    })
    .catch(console.error);
  res.status(200).send(itemsPage);
};
// const axios = require("axios");
// const cheerio = require("cheerio");

// exports.send = async (req, res) => {
//   const { postData } = req.body;
//   const URL = `https://www.amazon.com/s?k=${postData}`;
//   const items = parse(URL);
//   res.status(200).send(items);
// };
// const parse = async (URL) => {
//     const getHTML = async (url) => {
//     const { data } = await axios.get(url);
//     return cheerio.load(data);
//   };
//   const $ = await getHTML(URL);

//   const pagesNumber = $("li.a-disabled").text();
//   console.log(pagesNumber.replace(/[^0-9\.]/g, ""));
//   for (let i = 1; i < Number.pagesNumber; i++) {
//     console.log("work");
//     const selector = await getHTML(
//       `https://www.amazon.com/s?k=rolex&page=${pagesNumber}`
//     );
//     const items = [];
//     const Class =
//       ".sg-col-4-of-24.sg-col-4-of-12.sg-col-4-of-36.s-result-item.s-asin.sg-col-4-of-28.sg-col-4-of-16.sg-col.sg-col-4-of-20.sg-col-4-of-32";
//     const ClassHelp = ".s-result-item.s-asin";
//     selector(Class).each((i, elem) => {
//       if (selector(elem).find("img").attr("src") !== undefined) {
//         const img = selector(elem).find("img").attr("src");
//         const url = `https://www.amazon.com/${$(elem)
//           .find("a.a-link-normal.s-no-outline")
//           .attr("href")}`;
//         const title = selector(elem)
//           .find(".a-size-base-plus.a-color-base.a-text-normal")
//           .text();
//         const price = selector(elem).find(".a-price-whole").text();
//         const priceCent = selector(elem).find(".a-price-fraction").text();
//         items.push({
//           title,
//           url,
//           img,
//           price,
//           priceCent,
//         });
//         console.log(items);

//         return items;
//       }
//     });
//   }
// };
