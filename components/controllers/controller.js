const  fetchProductList  = require("./controllerTest");
const  fetchProductList1  = require("./testtest");
const run = require('../controllers/test')
exports.send = async (req, res) => {
  const { postData } = req.body;
 console.log(req.url)
 const items = await fetchProductList("https://www.amazon.com", postData)
 const itemss = await run(5)
 const itemsss = await fetchProductList1("https://www.amazon.com", 'watch')

  console.log(items.length)
  console.log(itemss.length)
  console.log(itemsss.length)

  // res.status(200).send(items);
};
