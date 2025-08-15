/**
 * 返回完整的JSON Schema，包含所有级联的对象定义
 * Return complete JSON Schema with all cascaded object definitions
 */
export function formatSchemaAsDocumentation(typeName: string, schema: any): string {
  if (!schema) {
    return JSON.stringify({ error: `Schema for ${typeName} not found` }, null, 2);
  }

  try {
    // 如果schema有$ref和definitions，尝试解析引用
    if (schema.$ref && schema.definitions) {
      const resolvedSchema = resolveSchemaReferences(schema, schema.definitions);
      return JSON.stringify(resolvedSchema, null, 2);
    }

    // 如果没有引用，直接返回schema
    return JSON.stringify(schema, null, 2);
  } catch (error) {
    // 如果解析失败（比如循环引用太复杂），返回原始schema
    console.warn(`Failed to resolve schema for ${typeName}:`, error);
    return JSON.stringify(schema, null, 2);
  }
}

/**
 * 递归解析schema中的$ref引用，构建完整的schema对象
 * Recursively resolve $ref references in schema to build complete schema object
 */
function resolveSchemaReferences(schema: any, definitions: Record<string, any>, visited: Set<string> = new Set()): any {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  // 处理$ref引用
  if (schema.$ref) {
    const refPath = schema.$ref.replace('#/definitions/', '');

    // 防止循环引用
    if (visited.has(refPath)) {
      return { $ref: schema.$ref }; // 保持原引用，避免循环
    }

    const referencedSchema = definitions[refPath];
    if (referencedSchema) {
      // 标记当前引用为已访问
      const newVisited = new Set(visited);
      newVisited.add(refPath);

      // 递归解析引用的schema
      return resolveSchemaReferences(referencedSchema, definitions, newVisited);
    }
    return schema; // 如果找不到引用，返回原始schema
  }

  // 递归处理对象的所有属性
  const resolved: any = Array.isArray(schema) ? [] : {};

  for (const [key, value] of Object.entries(schema)) {
    if (key === 'properties' && typeof value === 'object') {
      // 特殊处理properties对象
      resolved[key] = {};
      for (const [propName, propDef] of Object.entries(value as Record<string, any>)) {
        resolved[key][propName] = resolveSchemaReferences(propDef, definitions, visited);
      }
    } else if (key === 'items' && typeof value === 'object') {
      // 处理数组items
      resolved[key] = resolveSchemaReferences(value, definitions, visited);
    } else if (key === 'anyOf' || key === 'oneOf' || key === 'allOf') {
      // 处理联合类型
      resolved[key] = (value as any[]).map((item) => resolveSchemaReferences(item, definitions, visited));
    } else if (typeof value === 'object' && value !== null) {
      // 递归处理其他对象属性
      resolved[key] = resolveSchemaReferences(value, definitions, visited);
    } else {
      // 直接复制基本类型值
      resolved[key] = value;
    }
  }

  return resolved;
}
