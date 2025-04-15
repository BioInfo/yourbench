# System Patterns

## Web Interface Architecture

### Component Structure
```
yourbench-web/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # Reusable React components
│   ├── lib/             # Shared utilities and types
│   └── styles/          # Global styles
```

### State Management Pattern
- Zustand store for global state
- Centralized API service layer
- Real-time status updates
- Document and pipeline tracking

### API Layer Organization
```typescript
// Centralized API service
api/
├── documents/     # Document management
├── pipeline/      # Pipeline execution
├── huggingface/   # HF integration
└── analysis/      # Results and metrics
```

### Component Patterns
1. Container Components
   - Handle state and logic
   - Use store and API services
   - Pass data to presentational components

2. Presentational Components
   - Focus on UI rendering
   - Accept props for data
   - Minimal direct state management

3. Layout Components
   - Handle page structure
   - Manage navigation
   - Control responsive behavior

### File Organization
```
components/
├── layout/       # Page layout components
├── upload/       # Document upload components
├── pipeline/     # Pipeline configuration and monitoring
└── analysis/     # Analysis and visualization
```

### Data Flow Pattern
1. User Action → Component
2. Component → Store Action
3. Store Action → API Call
4. API Response → Store Update
5. Store Update → Component Re-render

### Error Handling Pattern
1. API Layer
   - Try-catch blocks
   - Error response formatting
   - Status code handling

2. Store Layer
   - Error state management
   - Loading state tracking
   - Status updates

3. UI Layer
   - Error message display
   - Loading indicators
   - Status feedback

### File Storage Pattern
```
yourbench/
├── example/
│   ├── data/
│   │   ├── raw/        # Original uploaded files
│   │   └── processed/  # Converted markdown files
│   └── configs/        # Pipeline configurations
```

### Configuration Pattern
1. Environment Variables
   - API keys
   - Organization settings
   - Debug flags

2. Pipeline Configuration
   - YAML format
   - Stage configuration
   - Model settings

### Monitoring Pattern
1. Pipeline Status
   - Stage progress
   - Real-time updates
   - Log output

2. Document Status
   - Upload progress
   - Processing status
   - Error states

### Authentication Pattern
1. API Keys
   - OpenAI integration
   - Hugging Face access
   - Environment configuration

### Testing Pattern
1. Component Tests
   - Unit tests for utilities
   - Integration tests for API
   - UI component tests

### Documentation Pattern
1. Code Documentation
   - TypeScript interfaces
   - JSDoc comments
   - README files

2. User Documentation
   - Configuration guide
   - API documentation
   - Troubleshooting guide