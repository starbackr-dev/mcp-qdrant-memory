# MCP Qdrant Memory Server

An MCP server that enables named memory graphs to be persisted to a Qdrant instance, with support for both OpenAI and local LMStudio embeddings.

## Features

- Store and manage entities and relations in a knowledge graph
- Persist data using Qdrant vector database
- Semantic search across entities and relations
- Support for multiple embedding providers:
  - OpenAI's text-embedding-ada-002
  - Local embeddings via LMStudio

## Installation

```bash
npm install @delorenj/mcp-qdrant-memory
```

## Configuration

The server requires the following environment variables:

### Required
- `QDRANT_URL`: URL of your Qdrant instance (e.g., "http://localhost:6333")
- `QDRANT_COLLECTION_NAME`: Name of the collection to use in Qdrant

### Optional
- `QDRANT_API_KEY`: API key for Qdrant (if authentication is enabled)
- `EMBEDDING_PROVIDER`: Choose the embedding provider ('openai' or 'lmstudio', defaults to 'openai')

### Provider-Specific Configuration

#### OpenAI (Default)
Required when using OpenAI embeddings (`EMBEDDING_PROVIDER=openai`):
- `OPENAI_API_KEY`: Your OpenAI API key

#### LMStudio
Optional when using LMStudio embeddings (`EMBEDDING_PROVIDER=lmstudio`):
- `LMSTUDIO_URL`: URL of your LMStudio instance (defaults to "http://localhost:1234/v1")
- `LMSTUDIO_DIMENSION`: Dimension of the embeddings from your LMStudio model (defaults to 768)

## Setup with LMStudio

1. Download and install LMStudio from [https://lmstudio.ai/](https://lmstudio.ai/)

2. In LMStudio:
   - Select or download an embedding model (e.g., BAAI/bge-small-en)
   - Start the local server with the selected model
   - Note the server URL (default: http://localhost:1234)

3. Configure the MCP server:
   ```bash
   export EMBEDDING_PROVIDER=lmstudio
   export LMSTUDIO_URL=http://localhost:1234/v1  # Or your custom URL
   export LMSTUDIO_DIMENSION=768  # Match your model's dimension
   export QDRANT_URL=http://localhost:6333
   export QDRANT_COLLECTION_NAME=your_collection
   ```

## Usage

### Starting the Server

```bash
npx mcp-server-memory
```

### MCP Tools

The server provides the following tools:

1. `create_entities`: Create multiple new entities in the knowledge graph
2. `create_relations`: Create multiple new relations between entities
3. `add_observations`: Add new observations to existing entities
4. `delete_entities`: Delete multiple entities and their relations
5. `delete_observations`: Delete specific observations from entities
6. `delete_relations`: Delete multiple relations
7. `read_graph`: Read the entire knowledge graph
8. `search_similar`: Search for similar entities and relations using semantic search

## Example Usage

```typescript
// Create entities
await client.callTool("create_entities", {
  entities: [{
    name: "John",
    entityType: "person",
    observations: ["Likes coffee", "Works as developer"]
  }]
});

// Create relations
await client.callTool("create_relations", {
  relations: [{
    from: "John",
    to: "Coffee",
    relationType: "likes"
  }]
});

// Search similar
const results = await client.callTool("search_similar", {
  query: "Who likes beverages?",
  limit: 5
});
```

## Migration Between Embedding Providers

When switching embedding providers, you'll need to recreate your vectors due to different embedding dimensions:

1. Back up your data using `read_graph`
2. Delete the existing Qdrant collection
3. Update your environment variables for the new provider
4. Restart the MCP server (it will create a new collection with the correct dimensions)
5. Restore your data using `create_entities` and `create_relations`

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start
```

## License

MIT