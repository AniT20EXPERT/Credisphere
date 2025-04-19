import mongoose from 'mongoose';
import { BureauAlpha, BureauBeta, BureauGamma } from './Schema'; // Import your models

// MongoDB connection options
interface ConnectionOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
  serverSelectionTimeoutMS: number;
  maxPoolSize: number;
}

// MongoDB connection URI 
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/credit_bureaus';

// Connection options
const options: ConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s default
  maxPoolSize: 10 // Maintain up to 10 socket connections
};


export async function connectToDatabase(): Promise<typeof mongoose> {
  try {
    console.log('Connecting to MongoDB with URI:', MONGODB_URI);
    const connection = await mongoose.connect(MONGODB_URI, options);
    console.log('Successfully connected to MongoDB');

    // Drop duplicate indexes if they exist
    try {
      await BureauAlpha.collection.dropIndex("phone_1");
      await BureauBeta.collection.dropIndex("phone_1");
      await BureauGamma.collection.dropIndex("phone_1");
      console.log("Dropped duplicate indexes on phone field.");
    } catch (err: any) {
      if (err.codeName === "IndexNotFound") {
        console.log("Indexes do not exist, skipping...");
      } else {
        console.error("Error dropping indexes:", err);
      }
    }

    // Log available collections
    if (mongoose.connection && mongoose.connection.db) {
      console.log('Available collections:');
      const collections = await mongoose.connection.db.collections();
      collections.forEach((collection) => {
        console.log(`- ${collection.collectionName}`);
      });
    } else {
      console.error('Database connection not established.');
    }

    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}
// Function to close the connection
export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
}

// Sample usage in your application
async function initializeDatabase() {
  try {
    await connectToDatabase();
    
    // Now you can use your models to query data
    const alphaCount = await BureauAlpha.countDocuments();
    const betaCount = await BureauBeta.countDocuments();
    const gammaCount = await BureauGamma.countDocuments();
    
    console.log(`Bureau counts - Alpha: ${alphaCount}, Beta: ${betaCount}, Gamma: ${gammaCount}`);
    
    // When your application shuts down:
    // await disconnectFromDatabase();
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// You can export this to be called from your main application file
export { initializeDatabase };