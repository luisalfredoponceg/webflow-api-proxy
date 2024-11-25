export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const COLLECTION_ID = '673f152e98cb1a6ed5e1f1ca';
    const API_TOKEN = '1a0ea66abda8d10be13e7b9bb074fbd5bbefd6ea0114856361cf1bebb1662469';
    const BASE_URL = `https://api.webflow.com/collections/${COLLECTION_ID}/items`;
    const MAX_LIMIT = 100; // Límite de Webflow

    try {
        const allItems = [];
        let offset = 0;
        let moreItemsAvailable = true;

        while (moreItemsAvailable) {
            const response = await fetch(`${BASE_URL}?limit=${MAX_LIMIT}&offset=${offset}`, {
                method: 'GET',
                headers: {
                    'accept-version': '1.0.0',
                    'Authorization': `Bearer ${API_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.statusText}`);
            }

            const data = await response.json();
            allItems.push(...data.items);

            if (data.items.length < MAX_LIMIT) {
                moreItemsAvailable = false;
            } else {
                offset += MAX_LIMIT;
            }
        }

        console.log(`Fetched ${allItems.length} items in total`);
        res.status(200).json({ items: allItems });
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: error.message });
    }
}
