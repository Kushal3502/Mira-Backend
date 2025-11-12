import dotenv from 'dotenv';
import { connectDb } from './config/db';
import { app } from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is running on port :: ${PORT}`);
    }),
  )
  .catch(error => console.log('Error connecting to DB :: ', error));
