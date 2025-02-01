export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>;
  getDimension(): number;
}