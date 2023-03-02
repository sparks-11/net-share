import express from "express";
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import path from 'path';
const __dirname = path.resolve();
// import writeMailToUser from "./services/mailService";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send({msg:'this is working'});
});

app.get("/form", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
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

app.listen(process.env.PORT, () => {
  console.log("app is up and runnig on port:" + process.env.PORT);
});
