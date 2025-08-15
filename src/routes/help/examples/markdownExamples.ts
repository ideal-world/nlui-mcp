import type { NLUIMarkdownComponentProps } from '$lib/ui/components/markdown.types';

export function getMarkdownExamples(): NLUIMarkdownComponentProps[] {
  return [
    {
      title: 'Technical Documentation',
      content: `
# API Documentation

Welcome to our comprehensive API documentation. This guide will help you integrate with our services.

## Getting Started

Before you begin, make sure you have:

1. **API Key**: Register for an account to get your API key
2. **Base URL**: All requests should be made to \`https://api.example.com/v1\`
3. **Authentication**: Include your API key in the Authorization header

## Authentication

\`\`\`javascript
const response = await fetch('https://api.example.com/v1/users', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});
\`\`\`

## Endpoints

### Users

- **GET** \`/users\` - List all users
- **POST** \`/users\` - Create a new user
- **GET** \`/users/:id\` - Get user by ID
- **PUT** \`/users/:id\` - Update user
- **DELETE** \`/users/:id\` - Delete user

### Rate Limiting

> ⚠️ **Important**: Our API has rate limiting in place. You can make up to 1000 requests per hour.

For more information, visit our [developer portal](https://developer.example.com).
`
    },
    {
      title: 'Project README',
      content: `
# NLUI Framework

A modern Natural Language User Interface framework built with SvelteKit and TypeScript.

## Features

- 🎨 **Rich Components**: 11 powerful UI components ready to use
- 🌐 **Internationalization**: Built-in i18n support
- 📱 **Responsive**: Mobile-first design approach
- ⚡ **Performance**: Optimized for speed and efficiency
- 🔧 **Developer Friendly**: TypeScript, excellent tooling

## Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
\`\`\`

## License

MIT License - see [LICENSE](LICENSE) file for details.
`
    }
  ];
}
