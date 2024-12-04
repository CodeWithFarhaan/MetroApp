import mongoose from 'mongoose';

const connectDb = async  () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected Successfully !! DB Host ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}


export default connectDb;