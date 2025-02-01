import { EmbeddingProvider } from './types.js';
import { OpenAIEmbeddingProvider } from './openai-provider.js';
import { LMStudioEmbeddingProvider } from './lmstudio-provider.js';
import {
  EMBEDDING_PROVIDER,
  OPENAI_API_KEY,
  LMSTUDIO_URL,
  LMSTUDIO_DIMENSION
} from '../config.js';

export class EmbeddingProviderFactory {
  static createProvider(): EmbeddingProvider {
    switch (EMBEDDING_PROVIDER.toLowerCase()) {
      case 'openai':
        if (!OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is required for OpenAI embedding provider');
        }
        return new OpenAIEmbeddingProvider(OPENAI_API_KEY);
      
      case 'lmstudio':
        return new LMStudioEmbeddingProvider(LMSTUDIO_URL, LMSTUDIO_DIMENSION);
      
      default:
        throw new Error(`Unknown embedding provider: ${EMBEDDING_PROVIDER}`);
    }
  }
}