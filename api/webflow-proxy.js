// Function to proxy requests to Webflow API
export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const COLLECTION_ID = '673f152e98cb1a6ed5e1f1ca';
    const API_TOKEN = '1a0ea66abda8d10be13e7b9bb074fbd5bbefd6ea0114856361cf1bebb1662469';

    try {
        console.log('Starting request process...');

        // First, let's test if we can access the collection info
        const testUrl = `https://api.webflow.com/collections/${COLLECTION_ID}`;
        console.log('Testing collection access:', testUrl);

        const testResponse = await fetch(testUrl, {
            method: 'GET',
            headers: {
                'accept-version': '1.0.0',
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Test response status:', testResponse.status);
        const testText = await testResponse.text();
        console.log('Test response:', testText);

        // If we can access the collection, try to get items
        if (testResponse.ok) {
            const itemsUrl = `https://api.webflow.com/collections/${COLLECTION_ID}/items?limit=100`;
            console.log('Fetching items:', itemsUrl);

            const itemsResponse = await fetch(itemsUrl, {
                method: 'GET',
                headers: {
                    'accept-version': '1.0.0',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            const itemsText = await itemsResponse.text();
            console.log('Items response status:', itemsResponse.status);
            console.log('Items response preview:', itemsText.substring(0, 200));

            if (itemsResponse.ok) {
                const data = JSON.parse(itemsText);
                return res.status(200).json(data);
            } else {
                throw new Error(`Items request failed: ${itemsResponse.status} - ${itemsText}`);
            }
        } else {
            throw new Error(`Collection access failed: ${testResponse.status} - ${testText}`);
        }

    } catch (error) {
        console.error('Error in proxy:', error);
        return res.status(500).json({
            error: 'Failed to fetch from Webflow API',
            details: error.message,
            debug: {
                message: error.toString(),
                stack: error.stack
            },
            timestamp: new Date().toISOString()
        });
    }
}
