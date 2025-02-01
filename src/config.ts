// Check for required environment variables
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;
const QDRANT_URL = process.env.QDRANT_URL!;
const COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME!;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// Embedding provider configuration
const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'openai';
const LMSTUDIO_URL = process.env.LMSTUDIO_URL || 'http://localhost:1234/v1';
const LMSTUDIO_DIMENSION = parseInt(process.env.LMSTUDIO_DIMENSION || '768', 10);

// Validate required environment variables
if (EMBEDDING_PROVIDER === 'openai' && !OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY environment variable is required when using OpenAI embeddings");
  process.exit(1);
}

if (!QDRANT_URL) {
  console.error("Error: QDRANT_URL environment variable is required");
  process.exit(1);
}

if (!COLLECTION_NAME) {
  console.error("Error: QDRANT_COLLECTION_NAME environment variable is required");
  process.exit(1);
}

export {
  OPENAI_API_KEY,
  QDRANT_URL,
  COLLECTION_NAME,
  QDRANT_API_KEY,
  EMBEDDING_PROVIDER,
  LMSTUDIO_URL,
  LMSTUDIO_DIMENSION
};