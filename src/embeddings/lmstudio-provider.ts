import { EmbeddingProvider } from './types.js';

export class LMStudioEmbeddingProvider implements EmbeddingProvider {
  private baseUrl: string;
  private dimension: number;
  
  constructor(baseUrl: string = 'http://localhost:1234/v1', dimension: number = 768) {
    this.baseUrl = baseUrl;
    this.dimension = dimension;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
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
        const errorText = await response.text();
        throw new Error(`LMStudio API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      
      if (!data.data?.[0]?.embedding || !Array.isArray(data.data[0].embedding)) {
        throw new Error('Invalid response format from LMStudio API');
      }

      const embedding = data.data[0].embedding;
      
      if (embedding.length !== this.dimension) {
        throw new Error(`Embedding dimension mismatch. Expected ${this.dimension}, got ${embedding.length}`);
      }

      return embedding;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`LMStudio embedding generation failed: ${error.message}`);
      }
      throw new Error('Unknown error during embedding generation');
    }
  }

  getDimension(): number {
    return this.dimension;
  }
}