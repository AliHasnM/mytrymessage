import { log } from "console"; // Importing the log function to print messages to the console
import mongoose from "mongoose"; // Importing mongoose for database connection

// Defining the type for the connection object
type ConnectionObject = {
    isConnected?: number; // Optional property to track the connection state
}

// Initializing the connection object
const connection: ConnectionObject = {};

// Function to connect to the MongoDB database
async function dbConnect(): Promise<void> {
    // If there is already an active connection, use it
    if (connection.isConnected) {
        log("Using existing connection"); // Log message for existing connection
        return; // Exit the function as no new connection is needed
    }
    try {
        // Attempt to connect to MongoDB using the URI from environment variables
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
        // Store the connection state (0: disconnected, 1: connected)
        connection.isConnected = db.connections[0].readyState;
        log("New connection created"); // Log message when a new connection is established
    } catch (error) {
        // If an error occurs while connecting, log the error and stop the process
        log("Error creating connection", error);
        process.exit(1); // Exit the process with an error code
    }
}
 
export default dbConnect; // Exporting the dbConnect function for use in other parts of the application
