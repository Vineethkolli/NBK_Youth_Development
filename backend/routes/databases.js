import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Helper function to format bytes into a human-readable string
function formatBytes(bytes) {
    if (bytes < 1024) {
        return `${bytes} Bytes`;
    } else if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(2)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
}

router.get("/collections", async (req, res) => {
    try {
        if (!mongoose.connection.readyState) {
            return res.status(500).json({ error: "Database not connected" });
        }

        const db = mongoose.connection.db;

        // Get overall database stats
        const dbStats = await db.stats();
        // Format the overall database size into a human-readable string
        const dbSizeFormatted = formatBytes(dbStats.dataSize);

        // Get the list of collections
        const collections = await db.listCollections().toArray();

        // Get stats for each collection using the collStats command
        const collectionsWithSize = await Promise.all(
            collections.map(async (collection) => {
                try {
                    const stats = await db.command({ collStats: collection.name });
                    return {
                        name: collection.name,
                        size: stats.size, // raw bytes (optional)
                        formattedSize: formatBytes(stats.size), // formatted value (KB, MB, etc.)
                    };
                } catch (err) {
                    console.error(`Failed to get stats for collection: ${collection.name}`, err);
                    return { name: collection.name, size: null, formattedSize: "N/A" };
                }
            })
        );

        // Return overall database size and collection stats
        res.json({
            dbSize: dbStats.dataSize, // raw bytes (optional)
            dbSizeFormatted,
            collections: collectionsWithSize,
        });
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
