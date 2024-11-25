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

    // Obtener valores directamente (sin template literals)
    const token = '1a0ea66abda8d10be13e7b9bb074fbd5bbefd6ea0114856361cf1bebb1662469';
    const collectionId = '673f152e98cb1a6ed5e1f1ca';
    
    try {
        // Construir URL directamente
        const apiUrl = 'https://api.webflow.com/collections/' + collectionId + '/items';
        console.log('🚀 Making request to:', apiUrl);

        const headers = {
            'accept-version': '1.0.0',
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        };

        console.log('Request headers:', {
            'accept-version': headers['accept-version'],
            'Content-Type': headers['Content-Type'],
            'Authorization': 'Bearer [hidden]'
        });

        const response = await fetch(apiUrl, { 
            method: 'GET',
            headers: headers
        });

        console.log('Response status:', response.status);
        const responseText = await response.text();
        console.log('Response text preview:', responseText.substring(0, 200));

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} - ${responseText}`);
        }

        const data = JSON.parse(responseText);
        console.log('✅ Success! Items count:', data.items?.length || 0);

        return res.status(200).json(data);
    } catch (error) {
        console.error('💥 Error in proxy:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch from Webflow API',
            details: error.message,
            timestamp: new Date().toISOString()
        });
    }
}
