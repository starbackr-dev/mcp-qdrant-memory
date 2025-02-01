import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { Entity, Relation } from './types.js';

interface CreateEntitiesRequest {
  entities: Entity[];
}

interface CreateRelationsRequest {
  relations: Relation[];
}

interface AddObservationsRequest {
  observations: Array<{
    entityName: string;
    contents: string[];
  }>;
}

interface DeleteEntitiesRequest {
  entityNames: string[];
}

interface DeleteObservationsRequest {
  deletions: Array<{
    entityName: string;
    observations: string[];
  }>;
}

interface DeleteRelationsRequest {
  relations: Relation[];
}

interface SearchSimilarRequest {
  query: string;
  limit?: number;
}

export function validateCreateEntitiesRequest(args: Record<string, unknown>): CreateEntitiesRequest {
  if (!Array.isArray(args.entities)) {
    throw new McpError(ErrorCode.InvalidParams, 'entities must be an array');
  }

  for (const entity of args.entities) {
    if (typeof entity !== 'object' || entity === null) {
      throw new McpError(ErrorCode.InvalidParams, 'each entity must be an object');
    }

    if (typeof (entity as Entity).name !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'entity name must be a string');
    }

    if (typeof (entity as Entity).entityType !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'entity type must be a string');
    }

    if (!Array.isArray((entity as Entity).observations)) {
      throw new McpError(ErrorCode.InvalidParams, 'entity observations must be an array');
    }

    if (!(entity as Entity).observations.every((obs: unknown) => typeof obs === 'string')) {
      throw new McpError(ErrorCode.InvalidParams, 'all observations must be strings');
    }
  }

  return { entities: args.entities as Entity[] };
}

export function validateCreateRelationsRequest(args: Record<string, unknown>): CreateRelationsRequest {
  if (!Array.isArray(args.relations)) {
    throw new McpError(ErrorCode.InvalidParams, 'relations must be an array');
  }

  for (const relation of args.relations) {
    if (typeof relation !== 'object' || relation === null) {
      throw new McpError(ErrorCode.InvalidParams, 'each relation must be an object');
    }

    if (typeof (relation as Relation).from !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation from must be a string');
    }

    if (typeof (relation as Relation).to !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation to must be a string');
    }

    if (typeof (relation as Relation).relationType !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation type must be a string');
    }
  }

  return { relations: args.relations as Relation[] };
}

export function validateAddObservationsRequest(args: Record<string, unknown>): AddObservationsRequest {
  if (!Array.isArray(args.observations)) {
    throw new McpError(ErrorCode.InvalidParams, 'observations must be an array');
  }

  for (const obs of args.observations) {
    if (typeof obs !== 'object' || obs === null) {
      throw new McpError(ErrorCode.InvalidParams, 'each observation must be an object');
    }

    if (typeof (obs as { entityName: unknown }).entityName !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'entityName must be a string');
    }

    if (!Array.isArray((obs as { contents: unknown }).contents)) {
      throw new McpError(ErrorCode.InvalidParams, 'contents must be an array');
    }

    if (!((obs as { contents: unknown[] }).contents).every((content: unknown) => typeof content === 'string')) {
      throw new McpError(ErrorCode.InvalidParams, 'all contents must be strings');
    }
  }

  return {
    observations: args.observations as Array<{
      entityName: string;
      contents: string[];
    }>
  };
}

export function validateDeleteEntitiesRequest(args: Record<string, unknown>): DeleteEntitiesRequest {
  if (!Array.isArray(args.entityNames)) {
    throw new McpError(ErrorCode.InvalidParams, 'entityNames must be an array');
  }

  if (!args.entityNames.every((name: unknown) => typeof name === 'string')) {
    throw new McpError(ErrorCode.InvalidParams, 'all entity names must be strings');
  }

  return { entityNames: args.entityNames as string[] };
}

export function validateDeleteObservationsRequest(args: Record<string, unknown>): DeleteObservationsRequest {
  if (!Array.isArray(args.deletions)) {
    throw new McpError(ErrorCode.InvalidParams, 'deletions must be an array');
  }

  for (const deletion of args.deletions) {
    if (typeof deletion !== 'object' || deletion === null) {
      throw new McpError(ErrorCode.InvalidParams, 'each deletion must be an object');
    }

    if (typeof (deletion as { entityName: unknown }).entityName !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'entityName must be a string');
    }

    if (!Array.isArray((deletion as { observations: unknown }).observations)) {
      throw new McpError(ErrorCode.InvalidParams, 'observations must be an array');
    }

    if (!((deletion as { observations: unknown[] }).observations).every((obs: unknown) => typeof obs === 'string')) {
      throw new McpError(ErrorCode.InvalidParams, 'all observations must be strings');
    }
  }

  return {
    deletions: args.deletions as Array<{
      entityName: string;
      observations: string[];
    }>
  };
}

export function validateDeleteRelationsRequest(args: Record<string, unknown>): DeleteRelationsRequest {
  if (!Array.isArray(args.relations)) {
    throw new McpError(ErrorCode.InvalidParams, 'relations must be an array');
  }

  for (const relation of args.relations) {
    if (typeof relation !== 'object' || relation === null) {
      throw new McpError(ErrorCode.InvalidParams, 'each relation must be an object');
    }

    if (typeof (relation as Relation).from !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation from must be a string');
    }

    if (typeof (relation as Relation).to !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation to must be a string');
    }

    if (typeof (relation as Relation).relationType !== 'string') {
      throw new McpError(ErrorCode.InvalidParams, 'relation type must be a string');
    }
  }

  return { relations: args.relations as Relation[] };
}

export function validateSearchSimilarRequest(args: Record<string, unknown>): SearchSimilarRequest {
  if (typeof args.query !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'query must be a string');
  }

  if (args.limit !== undefined && typeof args.limit !== 'number') {
    throw new McpError(ErrorCode.InvalidParams, 'limit must be a number if provided');
  }

  return {
    query: args.query,
    limit: args.limit as number | undefined
  };
}