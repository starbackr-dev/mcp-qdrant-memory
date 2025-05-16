// Check for required environment variables
import dotenv from 'dotenv';
dotenv.config();

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
if (!OLLAMA_API_URL) {
  console.error("Error: OLLAMA_API_URL environment variable is required");
  process.exit(1);
}

const QDRANT_URL = process.env.QDRANT_URL;
if (!QDRANT_URL) {
  console.error("Error: QDRANT_URL environment variable is required");
  process.exit(1);
}

const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME;
if (!COLLECTION_NAME) {
  console.error("Error: QDRANT_COLLECTION_NAME environment variable is required");
  process.exit(1);
}

const QDRANT_API_KEY = process.env.QDRANT_API_KEY;
// Note: QDRANT_API_KEY is optional, so we don't check if it exists

export { OLLAMA_API_URL, QDRANT_URL, COLLECTION_NAME, QDRANT_API_KEY };
