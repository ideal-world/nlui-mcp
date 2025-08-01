---
trigger: always_on
---


## Project Overview

This is a **Natural Language User Interface (NLUI)** framework built with **SvelteKit** and **TypeScript**, designed to simplify user interaction with computer systems through natural language communication. The project integrates with the **Model Context Protocol (MCP)** to provide intelligent UI components.

## Key Technologies & Architecture

- **Framework**: SvelteKit(Svelte5.x) with TypeScript
- **Styling**: TailwindCSS 4.x + FlyonUI components
- **Internationalization**: Inlang with Paraglide.js (支持中英文)
- **Package Manager**: pnpm
- **Testing**: Vitest with browser testing
- **Protocol**: Model Context Protocol (MCP) SDK

## Code Style & Conventions

### TypeScript & Svelte

- Use TypeScript for all new files
- Follow strict type checking
- Prefer composition over inheritance
- Use Svelte 5 syntax and features

### Styling Guidelines

- Use TailwindCSS classes for styling
- Leverage FlyonUI components when possible
- Follow responsive design principles
- Maintain consistent spacing and color schemes
- Try to use the class name defined by FlyonUI to avoid custom styles

### File Organization

- Place reusable components in `src/lib/components/`
- Server-side logic goes in `src/lib/server/`
- Client-side utilities in `src/lib/client/`
- Route components in `src/routes/`
- Shared types in appropriate `.d.ts` files

## MCP Integration Guidelines

### Server Development

- Extend MCP server functionality in `src/lib/server/mcp-server.ts`
- Use Zod for input validation
- Return proper `CallToolResult` types
- Follow MCP protocol specifications

## Development Practices

### Component Development

- Create small, focused, reusable components
- Use proper TypeScript interfaces for props
- Implement proper accessibility (a11y) attributes
- Add JSDoc comments for complex logic
- Use pnpm for package management to ensure dependency consistency

### Testing Strategy

- Write unit tests for utility functions
- Test component behavior with Vitest
- Use browser testing for integration tests
- Maintain high test coverage

### Performance Considerations

- Lazy load components when appropriate
- Optimize bundle size
- Use proper Svelte reactivity patterns
- Implement efficient data fetching

## Best Practices for AI Assistance

When working with this codebase:

1. **Always consider internationalization** - Add messages to both language files
2. **Use existing components** - Check FlyonUI and existing components before creating new ones
3. **Follow TypeScript strict mode** - Ensure proper typing
4. **Test responsive design** - Ensure components work on all screen sizes
5. **Maintain MCP compatibility** - Follow protocol specifications
6. **Consider accessibility** - Add proper ARIA attributes and semantic HTML
7. **Document complex logic** - Add comments for future maintainers

## Code Generation Prompts

When generating code for this project, always:

- Include proper TypeScript types
- Add internationalization for user-facing text
- Use TailwindCSS for styling
- Follow SvelteKit conventions
- Include error handling
- Add appropriate JSDoc comments
- Consider mobile responsiveness
- Implement proper accessibility

## Questions to Ask

Before implementing features, consider:

- Does this need internationalization?
- Should this be a reusable component?
- How does this integrate with MCP?
- What are the accessibility requirements?
- How will this work on mobile devices?
- What error states need handling?
