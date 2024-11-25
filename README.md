# Webflow API Proxy

This is a proxy service for the Webflow API to handle CORS and provide data for the map implementation.

## Setup

1. Create a new project in Vercel
2. Connect it with this repository
3. Set up environment variables in Vercel:
   - `WEBFLOW_API_TOKEN`: Your Webflow API token
   - `COLLECTION_ID`: Your Webflow collection ID

## Environment Variables

Make sure to set these in your Vercel project:

- `WEBFLOW_API_TOKEN`
- `COLLECTION_ID`

## API Endpoints

- `GET /api/webflow-proxy`: Fetches items from Webflow collection
