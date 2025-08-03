# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` (runs on port 8080)
- **Build for production**: `npm run build`
- **Build for development**: `npm run build:dev`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Architecture Overview

This is a React-based AI chat application built with Vite, TypeScript, and shadcn/ui components. The application features a modern chat interface with a collapsible sidebar for managing conversation history.

### Key Architecture Components

**Application Structure**:
- `src/App.tsx` - Main app wrapper with providers (React Query, Theme, Tooltips, Router)
- `src/pages/Index.tsx` - Main page component managing chat state and sidebar integration
- `src/components/chat-interface.tsx` - Core chat functionality with message handling
- `src/components/app-sidebar.tsx` - Collapsible sidebar with chat history and user controls

**State Management**:
- Local React state for chat messages and history
- React Query for async state management
- Theme state managed via next-themes

**UI Framework**:
- Built on shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling with custom sidebar theming
- Framer Motion for animations
- Lucide React for icons

**Chat Implementation**:
- Mock AI responses with simulated typing delays
- Message persistence in component state (not persisted between sessions)
- Chat history management with create/delete operations
- Responsive design with sidebar collapse states

### Component Architecture

The app uses a provider pattern wrapping the main content:
```
App (Providers) → Index (Layout + State) → ChatInterface + AppSidebar
```

**ChatInterface** (`src/components/chat-interface.tsx`):
- Manages message state and AI response simulation
- Handles scroll-to-bottom behavior
- Responsive input positioning based on sidebar state

**AppSidebar** (`src/components/app-sidebar.tsx`):
- Manages chat history display and navigation
- Theme toggle functionality
- User profile dropdown (placeholder)
- Responsive collapse/expand behavior

### Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **Styling**: Tailwind CSS with shadcn/ui
- **Routing**: React Router DOM
- **State**: React Query + local state
- **Theme**: next-themes for dark/light mode
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Development Notes

- ESLint configuration includes React hooks and TypeScript rules
- `@typescript-eslint/no-unused-vars` is disabled in eslint config
- Vite dev server configured to run on `::` (all interfaces) port 8080
- Path alias `@` maps to `./src` directory
- Lovable-tagger plugin enabled in development mode for component tracking

### File Organization

- `/src/components/ui/` - shadcn/ui component library
- `/src/components/` - Application-specific components
- `/src/pages/` - Route components
- `/src/hooks/` - Custom React hooks
- `/src/lib/` - Utility functions