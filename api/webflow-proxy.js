export default async function handler(req, res) {
  // Validar que sea POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Leer los datos enviados desde el frontend
  const { collectionId } = req.body;

  if (!collectionId) {
    return res.status(400).json({ error: "Collection ID is required" });
  }

  // Token de Webflow
  const webflowToken = "eae7d6695df7e062e72e2b4d37c6b8ebb51439146e5b48c63c373693ec5dd5a3";

  try {
    // Hacer la solicitud a la API de Webflow
    const response = await fetch(`https://api.webflow.com/collections/${collectionId}/items`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${webflowToken}`,
        "Content-Type": "application/json",
        "accept-version": "1.0.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Responder con los datos obtenidos de Webflow
    res.status(200).json(data);
  } catch (error) {
    // Manejar errores
    res.status(500).json({ error: `Error fetching data: ${error.message}` });
  }
}
