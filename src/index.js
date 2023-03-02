import express from "express";
const app = express();
import dotenv from "dotenv";
import bodyParser from "body-parser";
import writeMailToUser from "./services/mailService";

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
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

app.listen(process.env.PORT, () => {
  console.log("app is up and runnig on port:" + process.env.PORT);
});
