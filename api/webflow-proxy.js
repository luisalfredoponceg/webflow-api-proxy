// Function to proxy requests to Webflow API
export default async function handler(req, res) {
    console.log('🔄 Proxy request received');

    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*'); // Temporalmente permitimos todos los orígenes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar la petición OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
    const COLLECTION_ID = process.env.COLLECTION_ID;

    console.log('📝 Using Collection ID:', COLLECTION_ID);

    try {
        console.log('🚀 Making request to Webflow API...');
        
        const response = await fetch(
            `https://api.webflow.com/collections/${COLLECTION_ID}/items`, 
            {
                headers: {
                    'accept-version': '1.0.0',
                    'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🔴 Webflow API Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`Webflow API call failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Webflow API response received:', {
            total: data.total,
            count: data.items?.length || 0
        });
        
        res.status(200).json(data);
    } catch (error) {
        console.error('💥 Error in proxy:', error);
        res.status(500).json({ 
            error: 'Failed to fetch from Webflow API',
            details: error.message
        });
    }
}
