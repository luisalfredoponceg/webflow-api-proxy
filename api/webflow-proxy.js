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

    // Using site ID instead of collection ID
    const SITE_ID = '64864b182dab4d8c36699250';
    const COLLECTION_ID = '673f152e98cb1a6ed5e1f1ca';
    
    try {
        // Using the public API endpoint
        const apiUrl = `https://${SITE_ID}.webflow.io/api/v1/collection/${COLLECTION_ID}/items?limit=1000`;
        console.log('🚀 Making request to:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        
        if (!response.ok) {
            console.error('Response error:', responseText);
            throw new Error(`API call failed: ${response.status} - ${responseText}`);
        }

        try {
            const data = JSON.parse(responseText);
            console.log('✅ Success! Items count:', data.items?.length || 0);
            return res.status(200).json(data);
        } catch (parseError) {
            console.error('Parse error:', parseError);
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
