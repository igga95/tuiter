import mongoose from "mongoose";

const MONGO_DB_URI = process.env.MONGO_DB_URI;

mongoose
    .connect(MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected"))
    .catch((err) => console.log(`Error: ${err}`));
