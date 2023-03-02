import express from "express";
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
// import path from 'path';
// const __dirname = path.resolve();
// import writeMailToUser from "./services/mailService";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.type('html').send(html)
});

app.get("/test", function (req, res) {
  res.send("this is working");
});


app.post("/sendMail", async (req, res) => {
  const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const { body, username, sendto } = req.body;
  try {
    if (sendto.match(mailformat)) {
      const result = await writeMailToUser({ body, username, sendto });
      res.send(result);
    } else {
      throw new Error("the requested email id is not valid");
    }
  } catch (err) {
    res.sendStatus(400).send(err);
  }
});

async function writeMailToUser(options) {
  const { body, username, sendto } = options;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.USER_MAIL,
      pass: process.env.USER_SALT,
    },
  });

  try {
    await transporter.sendMail({
      from: '"netShare" <godgamergg560@gmail.com>',
      to: sendto,
      subject: `Hello from ${username}`,
      text: `These are the details attached by the sender please take a look at it.`,
      html: `<strong>${body}</strong>`,
      headers: { "x-myheader": "test header" },
    });
    return "message send successfully";
  } catch (error) {
    return "something went wrong" + error;
  }
}


const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Note mailer!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Sparks!
    </section>
    <section>
    <form action="/sendMail" method="post">
      <input
        id="sender"
        type="text"
        name="username"
        value=""
        placeholder="please enter you name"
      />
      <input
        id="team_name"
        type="text"
        name="body"
        value=""
        placeholder="please enter the details"
      />
      <input
        id="team_name"
        type="text"
        name="sendto"
        value=""
        placeholder="please enter the sendto"
      />
      <input type="submit" value="send" />
    </form>
    </section>
  </body>
</html>
`

app.listen(process.env.PORT, () => {
  console.log("app is up and runnig on port:" + process.env.PORT);
});
