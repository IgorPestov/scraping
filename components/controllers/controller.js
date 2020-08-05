// const fetchProductList = require("./amazon");
const ebay = require("./ebay");
const { fork } = require("child_process");

exports.send = async (req, res) => {
  
    const { postData } = req.body;
    // console.log(req.url);
    // const amazon = fork(__dirname + '/amazon')
    // const ebay = fork(__dirname + '/ebay')
    // let check1 = false;
    // let check2 = false;
    // let items = [];
    // amazon.on("message", (message) => {
    //   check1 = true;
    //   items = items.concat(message);

    //   if (check1 && check2) {
    //     res.send(items);
    //   }
    //   console.log(message.length, "controllerTest");
    // });
    // ebay.on("message", (message) => {
    //   check2 = true;
    //   items = items.concat(message);

    //   if (check1 && check2) {
    //     res.send(items);
    //   }
    //   console.log(message.length, "testtest");
    // });

    // amazon.send({
    //   // message: "START",
    //   data: postData,
    //   url: "https://www.amazon.com",
    // });
    // ebay.send({
    //   // message: "START",
    //   data: postData,
    //   url: "https://www.ebay.com/",
    // });
    //   const items = await fetchProductList("https://www.amazon.com", postData);
      const itemsss = await ebay("https://www.ebay.com/", postData);
    //   console.log(items.length);
      console.log(itemsss.length);
    //   if (items.length && itemsss.length) {
    //     const itemsPages = [...items, ...itemsss];

    //     console.log("work")
    //     itemsPages1 = itemsPages.concat(items);
    //     itemsPages2 = itemsPages1.concat(itemsss)

    //     res.status(200).send(itemsPages);
    //   }
  
};
