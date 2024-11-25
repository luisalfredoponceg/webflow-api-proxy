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

    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
    const COLLECTION_ID = process.env.COLLECTION_ID;

    // Log environment variables (sin mostrar el token completo)
    console.log('Environment check:', {
        hasToken: !!WEBFLOW_API_TOKEN,
        tokenStart: WEBFLOW_API_TOKEN ? `${WEBFLOW_API_TOKEN.substring(0, 5)}...` : 'missing',
        collectionId: COLLECTION_ID
    });

    try {
        const API_URL = `https://api.webflow.com/collections/${COLLECTION_ID}/items`;
        console.log('🚀 Making request to:', API_URL);
        
        const headers = {
            'accept-version': '1.0.0',
            'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
            'Content-Type': 'application/json'
        };
        
        console.log('Request headers:', {
            'accept-version': headers['accept-version'],
            'Content-Type': headers['Content-Type'],
            'Authorization': 'Bearer [hidden]'
        });

        const response = await fetch(API_URL, { headers });
        const responseText = await response.text();
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        console.log('Response text:', responseText);

        if (!response.ok) {
            throw new Error(`Webflow API call failed: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('✅ Success! Items count:', data.items?.length || 0);
        
        res.status(200).json(data);
    } catch (error) {
        console.error('💥 Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        res.status(500).json({ 
            error: 'Failed to fetch from Webflow API',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
