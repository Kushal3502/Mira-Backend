import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/Mira`);
  } catch (error) {
    console.log('MongoDB connection error :: ', error);
    process.exit(1);
  }
};
