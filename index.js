const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
// require('dotenv').config()

const app = express();
const port = 3000; // You can change the port if needed

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MongoDB URI and client
const uri = "mongodb+srv://natsakornls:natsakorn1234@nesty.xe10f.mongodb.net/?retryWrites=true&w=majority&appName=nesty";
const client = new MongoClient(uri);

// API endpoint to receive POST requests
app.post('/add', async (req, res) => {
    const databaseName = "bfarm"; // Replace with your database name
    const collectionName = "bfarm_usage"; // Replace with your collection name
    const documents = req.body; // Get the documents from the request body

    try {
        // Connect the client to the server
        await client.connect();

        // Access the database and collection
        const database = client.db(databaseName);
        const collection = database.collection(collectionName);

        // Insert the documents
        const result = await collection.insertMany(Array.isArray(documents) ? documents : [documents]);
        res.status(201).send(`${result.insertedCount} documents were inserted`);
    } catch (error) {
        console.error('Error inserting documents:', error);
        res.status(500).send('Error inserting documents');
    } finally {
        // Close the connection
        await client.close();
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
