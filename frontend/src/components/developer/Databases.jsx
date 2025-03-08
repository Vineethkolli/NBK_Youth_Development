import { useEffect, useState } from "react";
import { API_URL } from '../../utils/config';

const CollectionsList = () => {
    const [collections, setCollections] = useState([]);
    const [dbSizeFormatted, setDbSizeFormatted] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const response = await fetch(`${API_URL}/api/databases/collections`);
                const data = await response.json();

                if (!data.collections || !Array.isArray(data.collections)) {
                    throw new Error("Invalid response format");
                }

                setCollections(data.collections);
                setDbSizeFormatted(data.dbSizeFormatted);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching collections:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    return (
        <div>
            <h2>Database Collections & Sizes</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>Error: {error}</p>
            ) : (
                <>
                    <p>
                        <strong>Database Size:</strong> {dbSizeFormatted}
                    </p>
                    {collections.length === 0 ? (
                        <p>No collections found.</p>
                    ) : (
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Collection Name</th>
                                    <th>Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collections.map((collection) => (
                                    <tr key={collection.name}>
                                        <td>{collection.name}</td>
                                        <td>{collection.formattedSize}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default CollectionsList;
