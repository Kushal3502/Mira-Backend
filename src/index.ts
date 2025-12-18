import dotenv from "dotenv";
import { app } from "./app";
import { connectDb } from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`
      ====================================
      🚀 Server Status : RUNNING
      🌐 Port          : ${PORT}
      ====================================
      `);
    }),
  )
  .catch((error) => console.log("Error connecting to DB :: ", error));
