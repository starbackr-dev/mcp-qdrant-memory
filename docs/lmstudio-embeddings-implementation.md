# LMStudio Embeddings Implementation Plan

## Overview
Currently, the system uses OpenAI's text-embedding-ada-002 model exclusively for generating embeddings. This implementation plan outlines the steps to add support for local embeddings via LMStudio while maintaining backward compatibility with OpenAI embeddings.

## Current Architecture
- Embeddings are generated in `QdrantPersistence.generateEmbedding()`
- Fixed embedding dimension of 1536 (OpenAI's dimension)
- OpenAI client initialized in constructor
- Configuration via environment variables

## Implementation Steps

### 1. Create Embedding Provider Interface
Create a new abstraction for embedding providers:

```typescript
// src/embeddings/types.ts
export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  getDimension(): number;
}
```

### 2. Implement Providers

#### OpenAI Provider
```typescript
// src/embeddings/openai-provider.ts
export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private client: OpenAI;
  
  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-ada-002',
      input: text
    });
    return response.data[0].embedding;
  }

  getDimension(): number {
    return 1536;
  }
}
```

#### LMStudio Provider
```typescript
// src/embeddings/lmstudio-provider.ts
export class LMStudioEmbeddingProvider implements EmbeddingProvider {
  private baseUrl: string;
  
  constructor(baseUrl: string = 'http://localhost:1234/v1') {
    this.baseUrl = baseUrl;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await fetch(`${this.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'embedding-model' // LMStudio uses this generic model name
      })
    });

    if (!response.ok) {
      throw new Error(`LMStudio API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }

  getDimension(): number {
    // This will depend on the specific model being used in LMStudio
    // Common dimensions are 384, 768, or 1024
    return 768; // Example dimension, should be configurable
  }
}
```

### 3. Update Configuration
Add new environment variables for embedding configuration:

```typescript
// src/config.ts
export const EMBEDDING_PROVIDER = process.env.EMBEDDING_PROVIDER || 'openai';
export const LMSTUDIO_URL = process.env.LMSTUDIO_URL || 'http://localhost:1234/v1';
export const LMSTUDIO_DIMENSION = parseInt(process.env.LMSTUDIO_DIMENSION || '768', 10);
```

### 4. Update QdrantPersistence Class
Modify the QdrantPersistence class to use the provider abstraction:

```typescript
// src/persistence/qdrant.ts
export class QdrantPersistence {
  private client: QdrantClient;
  private embeddingProvider: EmbeddingProvider;
  private initialized: boolean = false;

  constructor() {
    // Initialize Qdrant client...

    // Initialize embedding provider based on configuration
    if (EMBEDDING_PROVIDER === 'lmstudio') {
      this.embeddingProvider = new LMStudioEmbeddingProvider(LMSTUDIO_URL);
    } else {
      this.embeddingProvider = new OpenAIEmbeddingProvider(OPENAI_API_KEY);
    }
  }

  async initialize(): Promise<void> {
    await this.connect();

    try {
      await this.client.getCollection(COLLECTION_NAME);
    } catch {
      // Collection doesn't exist, create it with dynamic dimension
      try {
        await this.client.createCollection(COLLECTION_NAME, {
          vectors: {
            size: this.embeddingProvider.getDimension(),
            distance: 'Cosine'
          }
        });
      } catch (error) {
        console.error('Error creating collection:', error);
        throw error;
      }
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    return this.embeddingProvider.generateEmbedding(text);
  }
}
```

## Migration Considerations

1. **Collection Dimension**: When switching embedding providers, a new collection may need to be created if the vector dimensions differ. The system should handle this gracefully:
   - Check existing collection dimension
   - If different, create new collection with suffix (e.g., _lmstudio)
   - Provide migration utility for re-embedding existing data

2. **Performance Monitoring**: Add logging to track:
   - Embedding generation time
   - Success/failure rates
   - Vector dimensions used

3. **Error Handling**: Implement robust error handling for LMStudio API:
   - Connection failures
   - Invalid responses
   - Dimension mismatches

## Testing Plan

1. Unit Tests:
   - Test both embedding providers
   - Test provider selection logic
   - Test dimension handling

2. Integration Tests:
   - Test with actual LMStudio instance
   - Test collection creation
   - Test vector search with different dimensions

3. Migration Tests:
   - Test switching between providers
   - Test data migration between different dimensions

## Documentation Updates Needed

1. Update README with:
   - LMStudio setup instructions
   - New environment variables
   - Migration procedures

2. Add troubleshooting guide for common issues:
   - LMStudio connection problems
   - Dimension mismatch errors
   - Migration failures

## Implementation Phases

### Phase 1: Core Implementation
- Create provider interface
- Implement both providers
- Update configuration
- Basic error handling

### Phase 2: Migration Support
- Add collection dimension checking
- Implement migration utilities
- Add performance monitoring

### Phase 3: Testing & Documentation
- Implement test suites
- Update documentation
- Create migration guide

## Future Considerations

1. Support for additional embedding providers
2. Dynamic dimension detection from LMStudio
3. Automatic migration utilities
4. Performance optimization strategies
5. Caching layer for frequently used embeddings