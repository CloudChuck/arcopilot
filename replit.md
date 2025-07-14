# AR Copilot Application

## Overview

This is a Healthcare Revenue Cycle Management (RCM) application designed to assist Accounts Receivable (AR) callers when speaking with insurance representatives about multiple patient accounts in a single call. The application provides a structured interface for managing patient account information, denial codes, and AI-powered suggestions to help AR callers ask the right questions and collect necessary information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Hook Form for form state, TanStack Query for server state
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: RESTful API with Express routes
- **Storage**: In-memory storage implementation with interface for future database integration

### Key Components

1. **Three-Panel Layout**:
   - Left Panel: Tab-based navigation for multiple patient accounts
   - Center Panel: Form interface for patient account details
   - Right Panel: AI-powered suggestions and guidance

2. **Patient Account Management**:
   - Multi-tab interface for handling multiple accounts in one call
   - Form validation using Zod schemas
   - Real-time data persistence and retrieval

3. **Denial Code System**:
   - Predefined mapping of denial codes to descriptions
   - Context-aware questions and required fields
   - Smart suggestions based on selected denial codes

4. **AI Copilot Features**:
   - Dynamic question generation based on denial codes
   - Required field highlighting
   - Next steps guidance
   - Comment generation for RCM systems

## Data Flow

1. **Session Management**: Each call session is identified by a unique session ID
2. **Account Creation**: New patient accounts are created and associated with the session
3. **Form Synchronization**: Real-time updates to account data with optimistic UI updates
4. **Suggestion Engine**: Denial code selection triggers contextual AI suggestions
5. **Data Persistence**: All account information is stored and can be retrieved across sessions

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React 18 with TypeScript
- **Component Library**: Radix UI primitives with Shadcn/ui wrapper
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: TanStack Query for API communication
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Icons**: Lucide React icon library
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Runtime**: Node.js with ES modules
- **Web Framework**: Express.js
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Driver**: Neon Database serverless driver
- **Schema Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution

### Development Tools
- **Build Tool**: Vite with React plugin
- **Database Migration**: Drizzle Kit for schema management
- **Type Checking**: TypeScript compiler
- **CSS Processing**: PostCSS with Tailwind CSS

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds the React application to `dist/public`
2. **Backend Build**: ESBuild bundles the Express server to `dist/index.js`
3. **Database Setup**: Drizzle migrations are applied using `db:push` command

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: Uses tsx for hot reloading of TypeScript server code
- **Production**: Runs compiled JavaScript with Node.js

### Key Features
- **Session-based Architecture**: Multiple patient accounts per call session
- **Real-time Updates**: Optimistic UI updates with server synchronization
- **Intelligent Suggestions**: Context-aware guidance based on denial codes
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Type Safety**: Full TypeScript coverage from database to frontend
- **CSV Export**: Complete session data export with generated comments
- **New Call Functionality**: Easy session reset for new calls
- **Optimized Workflow**: Generate comment button positioned at form bottom

## Recent Changes (July 2025)

### Comment Generation Improvements
- Simplified comment format to be short and crisp for RCM systems
- Removed unnecessary timestamps and redundant information
- Enhanced professional language for healthcare context

### User Experience Enhancements
- Moved "Generate Comment" button to bottom of form for better workflow
- Added "New Call" button in header for quick session reset
- Improved CSV export to include generated comments as final column

### Denial Code Expansion
- Expanded from 15 to 23 denial codes covering comprehensive RCM scenarios
- Added new denial codes: CO-4, CO-6, CO-11, CO-15, CO-23, CO-31, CO-167, CO-170
- All denial codes now sorted alphabetically for easier navigation
- Enhanced AI suggestions for more accurate processing

### Date Format Implementation (July 14, 2025)
- Changed DOS (Date of Service) input to MM/DD/YYYY format with auto-formatting
- Added real-time validation for MM/DD/YYYY format on both DOS and Eligibility dates
- Added calendar popup buttons to both DOS and Eligibility date fields for easy date selection
- Maintains both manual entry with auto-formatting and visual calendar picker

### Insurance Selection Enhancement (July 14, 2025)
- Converted insurance dropdown to searchable combobox interface
- Added 10 new insurance options including Medicare, Medicaid, TRICARE, Oscar Health
- Insurance options now sorted alphabetically (A-Z) for improved usability
- Searchable interface allows typing to filter insurance options

### Copy From Tab Enhancement (July 14, 2025)
- Auto-copy functionality for rep name and call reference when adding new patient
- When clicking "+ Add Patient", rep name and call reference automatically copy from previous patient
- Streamlines workflow for calls handling multiple patients with same insurance representative
- Fixed data preservation issue where rep name and call reference were being cleared from first patient when adding new patient

### UI Layout Improvements (July 14, 2025)
- Fixed denial code column overlap issue in denial information section
- Denial code dropdown now shows only the code to prevent text overflow
- Moved denial description to full-width textarea below denial code for better readability
- Improved spacing and layout structure to prevent column overlap

### Export Functionality
- Changed from JSON to CSV format for better data analysis
- Included session metadata and account timestamps
- Added generated comments as exportable data column

The application is designed to be deployed on platforms that support Node.js applications with PostgreSQL databases, with Replit-specific configurations for development environment integration.