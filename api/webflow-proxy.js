// Function to proxy requests to Webflow API
export default async function handler(req, res) {
    // Configurar CORS para tu dominio de Webflow
    res.setHeader('Access-Control-Allow-Origin', 'https://menta-test-web.webflow.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Manejar la petición OPTIONS para CORS
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const WEBFLOW_API_TOKEN = process.env.WEBFLOW_API_TOKEN;
    const COLLECTION_ID = process.env.COLLECTION_ID;

    try {
        // Log para debugging
        console.log('Fetching from Webflow API...');
        console.log('Collection ID:', COLLECTION_ID);

        const response = await fetch(
            `https://api.webflow.com/collections/${COLLECTION_ID}/items`, 
            {
                headers: {
                    'accept-version': '1.0.0',
                    'Authorization': `Bearer ${WEBFLOW_API_TOKEN}`,
                }
            }
        );

        const data = await response.json();
        
        // Log para debugging
        console.log(`Fetched ${data.items?.length || 0} items`);
        
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching from Webflow:', error);
        res.status(500).json({ error: 'Failed to fetch from Webflow API' });
    }
}
