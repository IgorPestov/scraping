const puppeteer = require("puppeteer");
const userAgent = require("user-agents");

const amazon = async (url, searchTerm) => {

  let startTime = Date.now();
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // await page.setUserAgent(userAgent.toString());
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.waitFor('input[name="field-keywords"]');
  await page.evaluate(
    (val) =>
      (document.querySelector('input[name="field-keywords"]').value = val),
    searchTerm
  );
  await page.click("div.nav-search-submit.nav-sprite");
  await page.waitFor('div[data-cel-widget^="search_result_"]');
  await page.waitFor("li.a-disabled");
  const pages = await page.evaluate(() => {
    let lastPages = Array.from(document.querySelectorAll("li.a-disabled"));
    let currentPage = lastPages.map((el) => el.innerText);
    return currentPage[1];
  });
  return new Promise(async (resolve, reject) => {

    try {
      let currentPage = 1;
      let results = [];       
      while (currentPage <= pages) {
        await page.waitFor('div[data-cel-widget^="search_result_"]');
         await page.waitFor(600)
        const result = await page.evaluate(() => {
          let totalSearchResults = Array.from(
            document.querySelectorAll('div[data-cel-widget^="search_result_"]')
          ).length;

          let productsList = [];
         
          for (let i = 1; i < totalSearchResults - 1; i++) {
            let product = {
              product: "",
            };
            let emptyProductMeta = false;

            let productNodes = Array.from(
              document.querySelectorAll(
                `div[data-cel-widget="search_result_${i}"] span.a-size-base-plus.a-color-base`
              )
            );

            let productsDetails = productNodes.map((el) => el.innerText);
            if (!emptyProductMeta) {
              product.product = productsDetails[0];
            }

            let rawImage = document.querySelector(
              `div[data-cel-widget="search_result_${i}"] .s-image`
            );
            product.image = rawImage ? rawImage.src : "";

            let rawUrl = document.querySelector(
              `div[data-cel-widget="search_result_${i}"] a.a-link-normal`
            );
            product.url = rawUrl ? rawUrl.href : "";

            let rawPrice = document.querySelector(
              `div[data-cel-widget="search_result_${i}"] span.a-offscreen`
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
          if (currentPage < pages) {
            await Promise.all([
              await page.waitForSelector("li.a-last"),
              await page.click("li.a-last"),
              await page.waitFor(
                'div[data-cel-widget^="search_result_"]'
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
module.exports = amazon;
 process.on ('message' ,async (data)  => {
  console.log('Child process received START message');

  // if(data.message === "START")  {

    const test = await amazon(data.url, data.data)
    process.send(test)
    process.exit();
  // }
})