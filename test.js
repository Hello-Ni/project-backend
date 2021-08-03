var axios = require("axios");
var FormData = require("form-data");
var fs = require("fs");
var data = new FormData();
data.append("image", fs.createReadStream("/D:/User/Downloads/釘選ICON.png"));

var config = {
  method: "post",
  url: "https://api.imgur.com/3/image",
  headers: {
    Authorization: "Client-ID 75409f5c4cdc919",
    Cookie:
      "IMGURSESSION=3c0eaca83d09762067bc8f90ae319e3e; _nc=1; UPSERVERID=upload.i-0d16a2423a58f0ab9.production",
    ...data.getHeaders(),
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log("dick");
    //console.log(error);
  });
