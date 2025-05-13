require("dotenv").config();
const express = require("express");
const { connectMongoDb } = require("./connection");
const URL = require("./models/url");
const urlRoute = require("./routes/url");


const PORT = process.env.PORT;
const app = express();


//Connection
connectMongoDb(process.env.MONGO_URL)
    .then(() => console.log("Mongodb connected"));


//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/url", urlRoute);


app.get("/:shortId", async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },
        {
            $push: {
                visitHistory: {
                    timeStamp: Date.now()
                }
            }
        }
    );
    res.redirect(entry.redirectURL);
});


app.listen(PORT, () => console.log(`Server started at port : ${PORT}`));