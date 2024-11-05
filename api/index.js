require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.URI_MONGODB; // MongoDB URI from .env
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    const databaseName = process.env.DATABASENAME; // Database name from .env
    const collectionName = process.env.COLLECTION; // Collection name from .env
    const documents = req.body; // Get the documents from the request body

    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

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
};
