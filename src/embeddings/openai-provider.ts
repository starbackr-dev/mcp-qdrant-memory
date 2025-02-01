import OpenAI from 'openai';
import { EmbeddingProvider } from './types.js';

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
    return 1536; // OpenAI's text-embedding-ada-002 dimension
  }
}