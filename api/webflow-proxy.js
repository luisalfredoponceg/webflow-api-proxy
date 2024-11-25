// Function to proxy requests to Webflow API
export default async function handler(req, res) {
    console.log('🔄 Proxy request received');

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN || '';
    const COLLECTION_ID = process.env.COLLECTION_ID || '';

    // Verify environment variables
    if (!WEBFLOW_API_TOKEN || !COLLECTION_ID) {
        console.error('Missing environment variables:', {
            hasToken: !!WEBFLOW_API_TOKEN,
            hasCollectionId: !!COLLECTION_ID
        });
        return res.status(500).json({ 
            error: 'Server configuration error', 
            details: 'Missing required environment variables'
        });
    }

    // Log actual values for debugging
    console.log('Using configuration:', {
        collectionId: COLLECTION_ID,
        tokenPreview: WEBFLOW_API_TOKEN.substring(0, 5) + '...'
    });

    try {
        const API_URL = 'https://api.webflow.com/collections/' + COLLECTION_ID + '/items';
        console.log('🚀 Making request to:', API_URL);

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'accept-version': '1.0.0',
                'Authorization': 'Bearer ' + WEBFLOW_API_TOKEN,
                'Content-Type': 'application/json'
            }
        });

        const responseText = await response.text();
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Webflow API call failed: ${response.status} - ${responseText}`);
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Success! Items count:', data.items?.length || 0);
            return res.status(200).json(data);
        } catch (parseError) {
            throw new Error(`Failed to parse response: ${responseText}`);
        }

    } catch (error) {
        console.error('💥 Error in proxy:', error.message);
        return res.status(500).json({ 
            error: 'Failed to fetch from Webflow API',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
