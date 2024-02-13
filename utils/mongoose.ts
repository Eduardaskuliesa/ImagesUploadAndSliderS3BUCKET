import mongosee from 'mongoose';

const isConnected = false;

const connectToDB = async () => {
  mongosee.set('strictQuery', true);
  if (!process.env.MONGODB_URL) return console.log('MONGODB_URL not found');
  if (isConnected) return console.log('Already connected to MongoDB');

  try {
    await mongosee.connect(process.env.MONGODB_URL);

    console.log('Connected to MonngoDB');
  } catch (error) {
    console.log('Unable to connect to MonngoDB!!!!');
    console.log(error);
  }
};

export default connectToDB;