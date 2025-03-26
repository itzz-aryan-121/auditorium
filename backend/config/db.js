import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI,)
        console.log('MongoDB Connection Success');
    } catch (error) {
        console.error('MongoDB Connection Failed');
        process.exit(1);
    }
};

export default connectDB;