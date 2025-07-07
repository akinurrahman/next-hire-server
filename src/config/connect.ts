import mongoose from "mongoose";
import config from "config";
import logger from '../utils/logger'

const connect = async () => {
  const mongoURI = config.get<string>("MONGO_URI");
  const port= config.get<number>("PORT")
  try {
    const mongodbInstance = await mongoose.connect(mongoURI);
    logger.info(`MongoDB connected at port: ${port} \nDB Host: ${mongodbInstance.connection.host} `);
  } catch (error) {
    logger.error(`Mongodb connection failed : `, error);
    process.exit(1)
  }
};

export default connect;
