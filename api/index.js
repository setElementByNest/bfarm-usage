require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');

const uri = process.env.URI_MONGODB; // MongoDB URI from .env
const client = new MongoClient(uri);
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

let isConnected = false; // Track connection status

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri);
    }

    if (!isConnected) {
        await client.connect();
        isConnected = true; // Set connection status to true
    }

    return client;
}
app.get('/', async (req, res) => {
    const databaseName = process.env.DATABASENAME; // Database name from .env
    const collectionName = process.env.COLLECTION; // Collection name from .env

    try {
        // Connect to the database
        const client = await connectToDatabase();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        // Retrieve data from the collection
        const data = await collection.find({}).toArray(); // Adjust query as needed

        // Format data to return
        const formattedData = data.map(item => ({
            id: item._id, // Assuming chip_id is available in the item
            name: item.name,
            ip: item.ip,
            time: item.time
        }));

        res.status(200).json(formattedData); // Send back formatted data as JSON
    } catch (error) {
        console.error('Error retrieving documents:', error);
        res.status(500).send('Error retrieving documents');
    }
});

// Define the POST route
app.post('/add', async (req, res) => {
    const databaseName = process.env.DATABASENAME; // Database name from .env
    const collectionName = process.env.COLLECTION; // Collection name from .env
    const documents = req.body; // Get the documents from the request body

    try {
        // Connect to the database
        const client = await connectToDatabase();
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        // Insert the documents
        const result = await collection.insertMany(Array.isArray(documents) ? documents : [documents]);
        res.status(201).send(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error('Error inserting documents:', error);
        res.status(500).send('Error inserting documents');
    }
});

// Vercel export function
module.exports = app;
