const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const ebay = async (url, searchTerm) => {
  let startTime = Date.now();
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitFor('input[name="_nkw"]');

  await page.evaluate(
    (val) => (document.querySelector('input[name="_nkw"]').value = val),
    searchTerm
  );
  await page.click('input[type="submit"]');


  await page.waitFor('a[class^="pagination__item"]');
  await page.click('svg[aria-labelledby="s0-13-11-6-3-SEARCH_PAGINATION_MODEL_V2-answer-21-3-3-button-2-7-text"')
  await page.click('svg[aria-labelledby="s0-13-11-6-3-SEARCH_PAGINATION_MODEL_V2-answer-21-3-3-content-5[2]-text"] ')
  await page.waitFor('li[data-view^="mi:1686|iid:"]');
  const pages = await page.evaluate(() => {
    let lastPages = Array.from(document.querySelectorAll('button[class^="fake-menu-button__button expand-btn expand-btn--small expand-btn--secondary"]'));
    let currentPage = lastPages.map((el) => el);
    return currentPage[5];
  });
  console.log(pages)
  return new Promise(async (resolve, reject) => {
    try {
      let currentPage = 1;
      const pages = 2;
      let results = [];
      while (!!await page.waitFor('a[class^="pagination__item"]')) {
        await page.waitForSelector('li[data-view^="mi:1686|iid:"]');
        const result = await page.evaluate(() => {
          let totalSearchResults = Array.from(
            document.querySelectorAll('li[data-view^="mi:1686|iid:"]')
          ).length;

          let productsList = [];

          for (let i = 1; i < totalSearchResults - 1; i++) {
            let product = {
              product: "",
            };
      
            let rawProduct = document.querySelector(
              `li[data-view="mi:1686|iid:${i}"] h3.s-item__title`
            );
            product.product = rawProduct ? rawProduct.innerText : "";
            let rawImage = document.querySelector(
              `li[data-view="mi:1686|iid:${i}"] img.s-item__image-img`
            );
            product.image = rawImage ? rawImage.src : "";

            let rawUrl = document.querySelector(
              `li[data-view="mi:1686|iid:${i}"] a.s-item__link`
            );
            product.url = rawUrl ? rawUrl.href : "";

            let rawPrice = document.querySelector(
              `li[data-view="mi:1686|iid:${i}"] span.s-item__price`
            );
            product.price = rawPrice ? rawPrice.innerText : "";

            if (typeof product.product !== "undefined") {
              !product.product.trim()
                ? null
                : (productsList = productsList.concat(product));
            }
          }

          return productsList;
        });
        results = results.concat(result);

        if (!!await page.waitFor('a[class^="pagination__item"]')) {
          await Promise.all([
            await page.waitForSelector("a.pagination__next"),
            await page.click("a.pagination__next"),
            await page.waitForSelector(
              'li[data-view^="mi:1686|iid:"]'
            ),
          ]);
        }

        currentPage++;
      }
      browser.close();
      console.log("Time: ", (Date.now() - startTime) / 1000, "s");
      return resolve(results);
    } catch (e) {
      return reject(e);
    }
  });
};
module.exports = ebay;
process.on('message' ,async (data)=> {
  console.log('Child process received START message');

  // if(data.message === "START") {
    const test = await ebay(data.url, data.data)
    process.send(test)
    process.exit();
  // }
})
