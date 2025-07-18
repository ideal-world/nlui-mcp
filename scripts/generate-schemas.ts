#!/usr/bin/env tsx
/**
 * Schema generation script
 * Generates JSON Schema from TypeScript interfaces for NLUI components
 */

import * as TJS from 'typescript-json-schema';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TypeScript compiler settings
const settings: TJS.PartialArgs = {
	required: true,
	noExtraProps: false,
	propOrder: false,
	typeOfKeyword: false,
	titles: true, // Enable titles for better documentation
	defaultProps: true, // Include default values from JSDoc
	strictNullChecks: true,
	skipLibCheck: true,
	ignoreErrors: false,
	include: ['**/*'], // Include all files
	excludePrivate: false, // Include private members if documented
	topRef: false, // Disable top-level references to avoid duplication
	ref: true, // Include reference definitions
	aliasRef: false, // Disable alias references to reduce duplication
	validationKeywords: ['example'], // Custom JSDoc tags to include
	uniqueNames: false, 
	rejectDateType: false // Allow Date types
};

// TypeScript compiler options
const compilerOptions: TJS.CompilerOptions = {
	strictNullChecks: true,
	esModuleInterop: true,
	target: 99, // ES2023
	module: 99 // ESNext
};

/**
 * Remove duplicate examples from property references
 * Keeps examples only in the main type definitions, removes them from property references
 */
function removeDuplicateExamples(schemas: Record<string, any>): Record<string, any> {
	const processedSchemas = JSON.parse(JSON.stringify(schemas)); // Deep clone

	// First, collect all examples from main schemas to identify duplicates
	const mainExamples = new Map<string, string>();

	// Collect examples from top-level schemas
	Object.keys(processedSchemas).forEach((schemaKey) => {
		const schema = processedSchemas[schemaKey];
		if (schema.example) {
			// Extract base type name (remove hash if present)
			const baseTypeName = schemaKey.split('.')[0];
			if (!mainExamples.has(baseTypeName)) {
				mainExamples.set(baseTypeName, schema.example);
			}
		}
	});

	// Helper function to recursively remove duplicate examples
	function removeDuplicateExamplesFromObject(
		obj: any,
		isTopLevelSchema = false,
		schemaKey = '',
		path = ''
	): void {
		if (!obj || typeof obj !== 'object') return;

		// Check if this object has an example
		if (obj.example) {
			// Remove examples from properties (not top-level schemas)
			const isProperty = path.includes('.') && path !== schemaKey;

			// Also remove examples from hashed definitions if main schema exists
			const baseTypeName = schemaKey.split('.')[0];
			const hasMainExample = mainExamples.has(baseTypeName);
			const isHashedDefinition = !isTopLevelSchema && schemaKey.includes('.');

			if (isProperty || (isHashedDefinition && hasMainExample)) {
				delete obj.example;
			}
		}

		// Process nested objects
		if (obj.properties) {
			Object.entries(obj.properties).forEach(([propKey, prop]: [string, any]) => {
				const newPath = path ? `${path}.${propKey}` : propKey;
				removeDuplicateExamplesFromObject(prop, false, schemaKey, newPath);
			});
		}

		if (obj.definitions) {
			Object.entries(obj.definitions).forEach(([defKey, def]: [string, any]) => {
				const baseDefName = defKey.split('.')[0];
				const hasMainExample = mainExamples.has(baseDefName);

				// Remove examples from definition references if main schema has the same example
				removeDuplicateExamplesFromObject(def, !hasMainExample, defKey, path);
			});
		}

		if (obj.anyOf) {
			obj.anyOf.forEach((item: any, index: number) =>
				removeDuplicateExamplesFromObject(item, false, schemaKey, `${path}.anyOf[${index}]`)
			);
		}

		if (obj.allOf) {
			obj.allOf.forEach((item: any, index: number) =>
				removeDuplicateExamplesFromObject(item, false, schemaKey, `${path}.allOf[${index}]`)
			);
		}

		if (obj.oneOf) {
			obj.oneOf.forEach((item: any, index: number) =>
				removeDuplicateExamplesFromObject(item, false, schemaKey, `${path}.oneOf[${index}]`)
			);
		}

		// Handle $ref - don't modify $ref objects themselves
		if (obj.$ref) {
			return;
		}
	}

	// Process each schema
	Object.entries(processedSchemas).forEach(([schemaKey, schema]) => {
		const baseTypeName = schemaKey.split('.')[0];
		const isMainSchema = schemaKey === baseTypeName; // No hash suffix
		removeDuplicateExamplesFromObject(schema, isMainSchema, schemaKey, schemaKey);
	});

	return processedSchemas;
}

/**
 * Generate JSON Schema for NLUIProps and related types
 */
function generateSchemas() {
	const typesFilePath = path.resolve(__dirname, '../src/lib/ui/nluiProps.types.ts');
	const outputDir = path.resolve(__dirname, '../src/lib/server/generated');

	console.log('📄 Types file path:', typesFilePath);
	console.log('📁 Output directory:', outputDir);

	// Check if types file exists
	if (!fs.existsSync(typesFilePath)) {
		throw new Error(`Types file not found: ${typesFilePath}`);
	}

	// Ensure output directory exists
	if (!fs.existsSync(outputDir)) {
		console.log('📁 Creating output directory...');
		fs.mkdirSync(outputDir, { recursive: true });
	}

	console.log('🔧 Creating TypeScript program...');

	// Automatically scan for all component type files
	const componentsDir = path.resolve(__dirname, '../src/lib/ui/components');
	const commonDir = path.resolve(__dirname, '../src/lib/ui/common');

	// Find all *.types.ts files
	const typeFiles: string[] = [];

	// Scan components directory
	if (fs.existsSync(componentsDir)) {
		const componentFiles = fs
			.readdirSync(componentsDir)
			.filter((file) => file.endsWith('.types.ts'))
			.map((file) => path.join(componentsDir, file));
		typeFiles.push(...componentFiles);
	}

	// Scan common directory
	if (fs.existsSync(commonDir)) {
		const commonFiles = fs
			.readdirSync(commonDir)
			.filter((file) => file.endsWith('.types.ts'))
			.map((file) => path.join(commonDir, file));
		typeFiles.push(...commonFiles);
	}

	const allFiles = [typesFilePath, ...typeFiles];
	console.log(
		'📄 Including files:',
		allFiles.map((f) => path.basename(f))
	);

	// Create the program with all type files
	const program = TJS.getProgramFromFiles(allFiles, compilerOptions);

	// Function to extract exported interfaces from TypeScript files
	function extractExportedInterfaces(filePaths: string[]): string[] {
		const interfaces: string[] = [];

		for (const filePath of filePaths) {
			try {
				const content = fs.readFileSync(filePath, 'utf-8');
				// Match exported interfaces: export interface InterfaceName
				const interfaceMatches = content.match(/export\s+interface\s+([A-Za-z_][A-Za-z0-9_]*)/g);
				if (interfaceMatches) {
					const interfaceNames = interfaceMatches.map((match) =>
						match.replace(/export\s+interface\s+/, '')
					);
					interfaces.push(...interfaceNames);
				}

				// Match exported types: export type TypeName
				const typeMatches = content.match(/export\s+type\s+([A-Za-z_][A-Za-z0-9_]*)/g);
				if (typeMatches) {
					const typeNames = typeMatches.map((match) => match.replace(/export\s+type\s+/, ''));
					interfaces.push(...typeNames);
				}
			} catch (error) {
				console.warn(`⚠️ Failed to read file ${filePath}:`, error);
			}
		}

		return [...new Set(interfaces)]; // Remove duplicates
	}

	// Extract all exported interfaces and types
	const extractedTypes = extractExportedInterfaces(allFiles);
	console.log('🔍 Extracted types:', extractedTypes);

	// Combine with core types that must be included
	const coreTypes = ['NLUIProps', 'NLUIBlock', 'NLUIComponent', 'NLUIComponentKind'];

	const types = [...new Set([...coreTypes, ...extractedTypes])];

	const schemas: Record<string, any> = {};

	for (const typeName of types) {
		const schema = TJS.generateSchema(program, typeName, settings);
		if (schema) {
			schemas[typeName] = schema;
			console.log(`✅ Generated schema for ${typeName}`);
		} else {
			console.warn(`⚠️ Failed to generate schema for ${typeName}`);
		}
	}

	// Remove duplicate examples from property references
	console.log('🧹 Removing duplicate examples...');
	const cleanedSchemas = removeDuplicateExamples(schemas);

	// Write schemas to file
	const schemaContent = `/**
 * Auto-generated JSON Schemas for NLUI types
 * Generated on: ${new Date().toISOString()}
 * 
 * DO NOT EDIT THIS FILE MANUALLY
 * Run \`pnpm run generate:schemas\` to regenerate
 */

export const nluiSchemas = ${JSON.stringify(cleanedSchemas, null, 2)} as const;

export type GeneratedSchemas = typeof nluiSchemas;
`;

	const outputPath = path.join(outputDir, 'schemas.ts');
	fs.writeFileSync(outputPath, schemaContent);
	console.log(`📁 Schemas written to: ${outputPath}`);

	return cleanedSchemas;
}

// Main execution
const isMainModule =
	import.meta.url.startsWith('file:') && import.meta.url.includes('generate-schemas.ts');

console.log('🔍 Import meta URL:', import.meta.url);
console.log('🔍 Process argv[1]:', process.argv[1]);
console.log('🔍 Is main module:', isMainModule);

if (isMainModule) {
	try {
		console.log('🚀 Starting schema generation...');
		const schemas = generateSchemas();
		console.log('✅ Schema generation completed successfully!');
	} catch (error) {
		console.error('❌ Schema generation failed:', error);
		process.exit(1);
	}
}

export { generateSchemas };
