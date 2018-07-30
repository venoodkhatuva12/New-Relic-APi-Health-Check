const request = require("request");
const assert = require("assert");

const config = {
  cid: "xxxxXXXXxxxxx112134313",
  secret: "test",
  login: {
    method: "POST",
    url: "https://localhost:3000=client_credentials",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "authorization": "",
      "user_context": "XXXXXX-XXX-XXx-XXXX-0AEAE8A"
    }
  },
  permission: {
    method: 'POST',
    url: 'https://localhost:3000/email',
    headers: {
       'cache-control': 'no-cache',
       'gws-affectedmarkets': 'us',
       'gws-environment': 'ps',
       'content-type': 'application/json',
       'gws-version': '1',
       'gws-requestid': 'XXX-X-XX-XX-XXXXXXXXX',
       'authorization': ''
    },
    body: '[{"identifier":"admin@localhost.com"}]'
  }
}


config.login.headers.authorization = Buffer.from(`${config.cid}:${config.secret}`).toString('base64');

request(config.login, (err, response, body) => {
    if(err) {
      throw new Error(err)
    }

    const access_token = JSON.parse(body).access_token;
    if(access_token) {
      config.permission.headers.authorization = `Bearer ${access_token}`;

      request(config.permission, (err, response, body) => {
         if (err) {
           throw new Error(err)
         }

         console.log(JSON.stringify(JSON.parse(body), null, 4))
         assert.ok(response.statusCode == 200, 'Expected 200 OK response, actual:' + response.statusCode);
       });
    } else {
      console.log({ "error": "please pass valid access token."})
    }
  });
