// Function to proxy requests to Webflow API
export default async function handler(req, res) {
    console.log('🔄 Proxy request received');

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Hardcoded values for testing
    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN || '1a0ea66abda8d10be13e7b9bb074fbd5bbefd6ea0114856361cf1bebb1662469';
    const COLLECTION_ID = process.env.COLLECTION_ID || '673f152e98cb1a6ed5e1f1ca';

    // Debug log
    console.log('Debug - Using values:', {
        collectionId: COLLECTION_ID,
        tokenLength: WEBFLOW_API_TOKEN.length
    });

    const API_URL = `https://api.webflow.com/collections/${COLLECTION_ID}/items`;
    console.log('Debug - API URL:', API_URL);

    try {
        console.log('Making request with token:', WEBFLOW_API_TOKEN.substring(0, 10) + '...');
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'accept-version': '1.0.0',
                'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response body:', responseText.substring(0, 200));

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('Success! Items count:', data.items?.length || 0);
        
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error in proxy:', error.message);
        return res.status(500).json({ 
            error: 'Failed to fetch from Webflow API',
            details: error.message,
            timestamp: new Date().toISOString(),
            url: API_URL
        });
    }
}
