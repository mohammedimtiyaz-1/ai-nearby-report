# Development Progress

# Nearby Business Feasibility & Location Intelligence Platform

## Document Control

| Field | Value |
| --- | --- |
| Document type | Development Progress Tracker |
| Product name | Nearby Business Feasibility & Location Intelligence Platform |
| Short name | Nearby Report |
| Version | 1.0 |
| Status | Active Development Tracker |
| Purpose | AI coding agent roadmap for implementation continuity |
| Last updated | 2026-05-16 |

---

## Overall Progress Status

- **Current Phase**: Day 1 - Foundation (Not Started)
- **Overall Completion**: 0%
- **MVP Target**: 3 days (72 hours)
- **Active Milestone**: Day 1 - Project Setup & Core Infrastructure
- **Strategy**: AI Agent Accelerated - Focus on MVP essentials only, defer all enhancements

---

## Day 1: Foundation & External APIs (8-10 hours)

**Target Completion**: Day 1  
**Status**: Not Started  
**Priority**: Critical

### Phase 1.1: Quick Project Setup (2 hours)

**Status**: Not Started

#### Feature 1.1.1: Initialize Project

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create Next.js project**
   - Run: `npx create-next-app@latest nearby-report --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"`
   - Accept all defaults

2. **Install core dependencies**
   - Run: `npm install @prisma/client prisma openai @react-pdf/renderer zod react-hook-form @hookform/resolvers`
   - Run: `npm install -D @types/node @types/bcryptjs`
   - Note: Using @react-pdf/renderer instead of Puppeteer for serverless compatibility

3. **Configure environment variables**
   - Create `.env.local` with: DATABASE_URL, GOOGLE_MAPS_API_KEY, GOOGLE_PLACES_API_KEY, OPENAI_API_KEY, NEXTAUTH_SECRET, NEXTAUTH_URL
   - Generate NEXTAUTH_SECRET: Run `openssl rand -base64 32`

4. **Initialize Prisma**
   - Run: `npx prisma init`
   - Create schema with following models:
     ```prisma
     model User {
       id        String   @id @default(cuid())
       email     String   @unique
       name      String?
       password  String
       createdAt DateTime @default(now())
       reports   Report[]
     }

     model BusinessCategory {
       id          String   @id @default(cuid())
       name        String   @unique
       slug        String   @unique
       description String
       competitorMappings Json // { cafe: ["cafe", "coffee_shop"], ... }
       demandSignalMappings Json // { cafe: ["college", "office"], ... }
       scoringWeights Json // { demand: 0.4, competition: 0.3, accessibility: 0.3 }
       createdAt   DateTime @default(now())
       reports     Report[]
     }

     model Report {
       id              String        @id @default(cuid())
       userId          String
       user            User         @relation(fields: [userId], references: [id])
       businessCategoryId String
       businessCategory BusinessCategory @relation(fields: [businessCategoryId], references: [id])
       locationName    String
       latitude         Float
       longitude        Float
       radiusMeters     Int
       status           String        @default("DRAFT") // DRAFT, COLLECTING_DATA, CLASSIFYING, SCORING, GENERATING_SUMMARY, COMPLETED
       finalScore       Int?
       competitionScore Int?
       demandScore      Int?
       accessibilityScore Int?
       aiSummary        Json? // { executiveSummary, opportunities, risks, finalRecommendation }
       createdAt        DateTime      @default(now())
       updatedAt        DateTime      @updatedAt
       pois            ReportPOI[]

       @@index([userId])
       @@index([businessCategoryId])
       @@index([status])
     }

     model POI {
       id             String   @id @default(cuid())
       source         String   // "google_places"
       sourcePlaceId   String   @unique
       name           String
       normalizedCategory String?
       latitude       Float
       longitude      Float
       distanceMeters Float?
       rating         Float?
       reviewCount    Int?
       types          String[]
       address        String?
       createdAt      DateTime @default(now())
       reportPois     ReportPOI[]
     }

     model ReportPOI {
       id              String   @id @default(cuid())
       reportId        String
       report          Report   @relation(fields: [reportId], references: [id])
       poiId           String
       poi             POI      @relation(fields: [poiId], references: [id])
       classification  String?  // COMPETITOR, DEMAND_SIGNAL, ACCESSIBILITY_SIGNAL, NON_COMPETITOR
       threatLevel     String?  // LOW, MEDIUM, HIGH
       signalType      String?  // For demand/accessibility signals
       createdAt       DateTime @default(now())

       @@unique([reportId, poiId])
     }
     ```
   - Run: `npx prisma migrate dev --name init`
   - Run: `npx prisma generate`

5. **Seed business categories**
   - Create `prisma/seed.ts` with Cafe, Pharmacy, Salon data
   - Include competitorMappings and demandSignalMappings for each category
   - Include scoringWeights for each category
   - Run: `npx prisma db seed`

#### Feature 1.1.2: Basic Directory Structure

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create minimal structure**
   - Create: `src/app/api/v1/` for API routes
   - Create: `src/lib/services/` for service classes
   - Create: `src/lib/types.ts` for TypeScript interfaces
   - Create: `src/components/` for React components

2. **Create basic types**
   - Define core interfaces: Report, POI, LocationResult
   - Create environment variable validation in `src/lib/config/env.ts`
   - Validate required env vars on app startup

3. **Configure CORS**
   - Update `next.config.js` to add CORS configuration
   - Allow requests from frontend domain

### Phase 1.2: Google Maps Integration (2 hours)

**Status**: Not Started

#### Feature 1.2.1: Location Service

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create LocationService**
   - Create `src/lib/services/LocationService.ts`
   - Implement geocode() calling Google Maps API
   - Implement reverseGeocode()
   - Return LocationResult interface

2. **Create location API**
   - Create `src/app/api/v1/locations/search/route.ts`
   - Add Zod validation for input parameters
   - Call LocationService.geocode()
   - Return result

3. **Test with real address**
   - Verify geocoding works
   - Verify reverse geocoding works

### Phase 1.3: Google Places Integration (3 hours)

**Status**: Not Started

#### Feature 1.3.1: POI Service

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create POIService**
   - Create `src/lib/services/POIService.ts`
   - Implement searchNearby() calling Google Places API
   - Implement getPlaceDetails()
   - Implement category normalization (simple mapping)

2. **Create category mappings**
   - Create `src/lib/config/categoryMappings.ts`
   - Define mappings for Cafe, Pharmacy, Salon (competitors and demand signals)

3. **Create POI collection API**
   - Create `src/app/api/v1/reports/[id]/collect-pois/route.ts`
   - Call POIService.searchNearby()
   - Store POIs in database
   - Create ReportPOI records

4. **Test POI collection**
   - Test for each business category
   - Verify data storage

### Phase 1.4: Basic Authentication & Reports API (2 hours)

**Status**: Not Started

#### Feature 1.4.1: Simple Auth

**Status**: Not Started

**Technical Implementation Steps**:

1. **Install NextAuth**
   - Run: `npm install next-auth @next-auth/prisma-adapter bcryptjs`

2. **Configure NextAuth**
   - Create `src/app/api/auth/[...nextauth]/route.ts`
   - Set up Credentials provider with password hashing (bcryptjs)
   - Add password hashing in registration: `bcryptjs.hash(password, 10)`
   - Add password verification in login: `bcryptjs.compare(password, hashedPassword)`
   - Add User model to Prisma schema (already included in schema above)
   - Run migration

3. **Create authentication middleware**
   - Create `src/lib/auth/middleware.ts`
   - Protect all /api/v1 routes with authentication check
   - Return 401 if not authenticated

4. **Create simple login page**
   - Create `src/app/login/page.tsx`
   - Basic email/password form
   - No complex UI for MVP

5. **Test authentication**
   - Register user with password hashing
   - Login with password verification
   - Verify session
   - Test API route protection

#### Feature 1.4.2: Create Reports API Endpoint

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create reports API route**
   - Create `src/app/api/v1/reports/route.ts`
   - Implement POST endpoint for creating report
   - Validate input with Zod (businessCategoryId, location, radius)
   - Apply authentication middleware
   - Accept businessModel and optional financial inputs; document scoring impact
   - Create Report record in database
   - Return created report

2. **Create GET endpoint for listing**
   - Implement GET endpoint to list user's reports
   - Add authentication check
   - Add pagination (limit, offset parameters)
   - Return report list

3. **Create GET endpoint for individual report**
   - Create `src/app/api/v1/reports/[id]/route.ts`
   - Implement GET endpoint to fetch single report
   - Add authentication check
   - Verify user owns the report
   - Return report with all related data
    - Include scores (competition, demand, accessibility, area fit, financial pressure, confidence) and survey checklist

4. **Create report generation placeholder**
   - Create `src/app/api/v1/reports/[id]/generate/route.ts`
   - Placeholder endpoint (will be updated in Day 2)
   - Add authentication check

---

## Day 2: Core Business Logic & AI Integration (8-10 hours)

**Target Completion**: Day 2  
**Status**: Not Started  
**Priority**: Critical  
**Dependencies**: Day 1 complete

### Phase 2.1: Classification Engine (2 hours)

**Status**: Not Started

#### Feature 2.1.1: Simple Classification

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create ClassificationService**
   - Create `src/lib/services/ClassificationService.ts`
   - Implement classifyCompetitors() - use category mappings
   - Implement classifyDemandSignals() - use category mappings
   - Simple rule-based classification (no complex threat calculation for MVP)
   - Add basic error handling with try-catch blocks

2. **Create classification API**
   - Create `src/app/api/v1/reports/[id]/classify/route.ts`
   - Load ReportPOIs
   - Call ClassificationService
   - Update ReportPOI records with classification
   - Handle errors gracefully

3. **Test classification**
   - Test with sample POIs
   - Verify classifications are correct
   - Test error handling

### Phase 2.2: Scoring Engine (3 hours)

**Status**: Not Started

#### Feature 2.2.1: Basic Scoring

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create ScoringService**
   - Create `src/lib/services/ScoringService.ts`
   - Implement calculateCompetitionScore() - simple count-based scoring
   - Implement calculateDemandScore() - simple count-based scoring
   - Implement calculateAccessibilityScore() - basic transport proximity
   - Implement calculateFinalScore() - weighted average using category weights
   - Skip complex financial pressure for MVP
   - Add basic error handling with try-catch blocks
   - Add score range validation (clamp to 0-100)

2. **Define scoring weights**
   - Cafe: demand (0.4), competition (0.3), accessibility (0.3)
   - Pharmacy: healthcare (0.4), residential (0.3), accessibility (0.3)
   - Salon: residential (0.4), competition (0.3), accessibility (0.3)

3. **Create scoring API**
   - Create `src/app/api/v1/reports/[id]/score/route.ts`
   - Call all scoring methods
   - Store scores in Report record
   - Update report status
   - Handle errors gracefully

4. **Test scoring**
   - Test with each business category
   - Verify scores are within 0-100 range
   - Test error handling
   - Test edge cases (no POIs, all POIs, etc.)

### Phase 2.3: AI Integration (2 hours)

**Status**: Not Started

#### Feature 2.3.1: OpenAI Integration

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create AIService**
   - Create `src/lib/services/AIService.ts`
   - Use OpenAI SDK
   - Implement generateReportSummary() with GPT-4o Mini
   - Use simple system prompt (focus on structured data only)
   - Add timeout handling (30 second timeout for API call)
   - Add error handling with try-catch blocks
   - Add basic cost tracking (log input/output tokens)

2. **Create AI prompt**
   - Define simple prompt template
   - Include critical rules: no invented facts, no guarantees
   - Request JSON output with: executiveSummary, opportunities, risks, finalRecommendation

3. **Create AI generation API**
   - Create `src/app/api/v1/reports/[id]/generate-ai-summary/route.ts`
   - Build analysis data from report
   - Call AIService
   - Store result in Report.aiSummary
   - Handle API failures gracefully (use template fallback if AI fails)

4. **Test AI generation**
   - Test with complete report data
   - Verify output is structured
   - Verify no hallucinations
   - Test error handling

### Phase 2.4: Report Pipeline (1 hour)

**Status**: Not Started

#### Feature 2.4.1: Orchestration

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create ReportService**
   - Create `src/lib/services/ReportService.ts`
   - Implement generateReport() - synchronous pipeline
   - Order: collect POIs → classify → score → AI summary
   - Handle errors gracefully (continue with partial data)
   - Add timeout handling (45 second total timeout)
   - Add progress tracking (update status after each step)

2. **Create report generation API**
   - Update `src/app/api/v1/reports/[id]/generate/route.ts`
   - Call ReportService.generateReport()
   - Return completed report
   - Handle timeout gracefully (return current status if timeout)

3. **Test full pipeline**
   - End-to-end test with real location
   - Verify all steps complete
   - Test timeout scenario

---

## Day 3: Frontend, PDF & Deployment (8-10 hours)

**Target Completion**: Day 3  
**Status**: Not Started  
**Priority**: Critical  
**Dependencies**: Day 2 complete

### Phase 3.1: Basic Frontend (4 hours)

**Status**: Not Started

#### Feature 3.1.1: Report Creation Page

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create report creation page**
   - Create `src/app/reports/new/page.tsx`
   - Simple form: business category select, location input, radius select
   - Use basic Tailwind styling (no shadcn for speed)
   - Add business model select that loads category-specific models and feeds into scoring
   - Add Zod validation schema for form inputs
   - Add form validation with react-hook-form
   - Add loading state during form submission
   - Add error display for validation errors
   - Allow manual map pin adjustment after location search and reflect coordinates in the form
   - Add optional financial inputs (rent, shop size, setup budget, staff cost, inventory cost) with inline hints and allow skipping
   - Call report creation API
   - Redirect to report detail on success

2. **Create business category select**
   - Load categories from API
   - Display as simple dropdown
   - Add loading state while loading categories

3. **Add business model & financial inputs**
   - After category selected, replace placeholder text with category-specific models (Cafe, Pharmacy, Salon)
   - Add optional financial input group (rent, shop size, setup budget, staff cost, inventory, investment range)
   - Show helper text explaining manual validation when inputs skipped

3. **Create location input**
   - Text input for address
   - Call location search API
   - Add loading state during search
   - Display selected location
   - Add error display if search fails

4. **Create radius select**
   - Simple dropdown: 500m, 1km, 2km, 3km

5. **Test report creation**
   - Create test report
   - Verify redirect works
   - Test form validation
   - Test loading states
   - Test error handling

#### Feature 3.1.2: Report Detail Page

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create report detail page**
   - Create `src/app/reports/[id]/page.tsx`
   - Load report data from API
   - Add loading state while loading report
   - Add error display if report not found
   - Display sections in simple layout

2. **Create score display**
   - Show final score prominently
   - Show individual scores (competition, demand, accessibility)

3. **Create competitor table**
   - Simple table with: name, type, distance, threat level
   - Add loading state while loading competitors

4. **Create demand signals display**
   - Simple list grouped by type

5. **Create AI content display**
   - Show executive summary
   - Show opportunities (bullet points)
   - Show risks (bullet points)
   - Show final recommendation
   - Surface confidence level and explain missing data or low-confidence cues
   - Render survey checklist tasks with manual validation prompts

6. **Test report detail**
   - View completed report
   - Verify all sections display
   - Test loading states
   - Test error handling

7. **Survey checklist QA**
   - Ensure survey checklist appears across dashboard, detail, and PDF
   - Verify manual tasks are verifiable and carry actionable hints for on-ground checks

#### Feature 3.1.3: Dashboard Page

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create dashboard**
   - Create `src/app/dashboard/page.tsx`
   - List user's reports
   - Add loading state while loading reports
   - Add error display if load fails
   - Show: business type, location, score, date
   - Add link to create new report
   - Add link to view report

2. **Test dashboard**
   - View report list
   - Navigate to reports
   - Test loading states
   - Test error handling

3. **Create Error Boundary component**
   - Create `src/components/ErrorBoundary.tsx`
   - Wrap app in error boundary
   - Add user-friendly error display

### Phase 3.2: PDF Generation (2 hours)

**Status**: Not Started

#### Feature 3.2.1: Simple PDF

**Status**: Not Started

**Technical Implementation Steps**:

1. **Create PDFService**
   - Create `src/lib/services/PDFService.ts`
   - Use @react-pdf/renderer (serverless-compatible)
   - Create simple PDF document with report data
   - Include: executive summary, scores, competitors, demand signals, AI content, disclaimer
   - Note: @react-pdf/renderer works on Vercel serverless functions

2. **Create PDF generation API**
   - Create `src/app/api/v1/reports/[id]/pdf/route.ts`
   - Call PDFService
   - Return PDF buffer with appropriate headers

3. **Add download button**
   - Add download button to report detail page
   - Call PDF API
   - Trigger browser download

4. **Test PDF**
   - Generate PDF for sample report
   - Verify content is complete
   - Verify formatting is readable
   - Test on Vercel (critical - Puppeteer would fail here)

### Phase 3.3: Testing & Bug Fixes (2 hours)

**Status**: Not Started

#### Feature 3.3.1: Manual Testing

**Status**: Not Started

**Technical Implementation Steps**:

1. **End-to-end testing**
   - Test complete flow: register → login → create report → view report → download PDF
   - Test for each business category (Cafe, Pharmacy, Salon)
   - Test with different locations

2. **Bug fixes**
   - Fix any issues found during testing
   - Ensure error handling works
   - Verify edge cases

3. **Performance check**
   - Verify report generation completes in reasonable time (<45 seconds to match timeout)
   - Check API response times

### Phase 3.4: Deployment (2 hours)

**Status**: Not Started

#### Feature 3.4.1: Deploy to Vercel

**Status**: Not Started

**Technical Implementation Steps**:

1. **Prepare for deployment**
   - Set production environment variables in Vercel
   - Set up production database on Supabase (faster setup than Railway/Render)
     - Create Supabase project (free tier available)
     - Get connection string from Supabase dashboard
     - Set DATABASE_URL in Vercel environment variables
   - Run migrations on production database

2. **Deploy**
   - Connect GitHub repo to Vercel
   - Deploy main branch
   - Verify deployment succeeds

3. **Post-deployment testing**
   - Test deployed application
   - Verify all APIs work
   - Test report generation on production (check for timeout issues)
   - Verify PDF generation works (@react-pdf/renderer is serverless-compatible)

4. **Final verification**
   - Create test report on production
   - Download PDF
   - Verify MVP acceptance criteria met

---

## Post-MVP Enhancements (Deferred)

**Status**: Not Started  
**Priority**: Low  
**Timeline**: After MVP validation

### Deferred Features

The following features are deferred to post-MVP to meet 3-day timeline:

- Advanced authentication (social login, 2FA)
- shadcn/ui component library (use basic Tailwind for MVP)
- Comprehensive error handling and logging
- Unit and integration tests (manual testing for MVP)
- CI/CD pipeline (manual deployment for MVP)
- Map visualization (simplified to text/table for MVP)
- Advanced scoring (financial pressure, competitor quality gap)
- Survey checklist functionality
- Report history and management
- Multi-location comparison
- Review sentiment analysis
- Financial feasibility calculator
- Consultant features and white-labeling
- B2B team features and API access
- Performance optimization and caching
- Monitoring and analytics

### Future Implementation Priority

1. **High Priority** (after MVP validation):
   - Map visualization with POI markers
   - Comprehensive error handling
   - Basic unit tests

2. **Medium Priority**:
   - Survey checklist functionality
   - Report history and management
   - Performance optimization

3. **Low Priority**:
   - Advanced authentication
   - Consultant features
   - B2B features

---

## Progress Tracking Legend

- **Not Started**: Feature has not been implemented yet
- **In Progress**: Feature is currently being implemented
- **Completed**: Feature has been implemented and tested
- **Blocked**: Feature is blocked by dependencies or issues
- **Deferred**: Feature is postponed to future phase

## Notes for AI Coding Agents (3-Day Accelerated Plan)

1. **Focus on MVP essentials only**: Skip all deferred features listed in Post-MVP section
2. **Use basic implementations**: No shadcn/ui, use basic Tailwind; no complex caching; no comprehensive error handling
3. **Simplified database schema**: Only essential models (User, BusinessCategory, Report, POI, ReportPOI)
4. **Manual testing only**: Skip unit/integration/E2E tests for MVP
5. **Direct deployment**: Skip CI/CD, deploy manually to Vercel
6. **Time-box each phase**: Stick to the hour estimates, move on if time exceeded
7. **Prioritize working features**: A simple working feature is better than a complex broken one
8. **Handle errors gracefully**: Basic try-catch blocks, no sophisticated error handling
9. **Use synchronous operations**: No queues/async processing for MVP
10. **Test as you go**: Manual testing after each feature completion

## Current Blockers

None at this time.

## Technical Risks & Mitigations

### Critical Issues (Must Address)

1. **Puppeteer on Vercel Serverless Functions**
   - **Issue**: Puppeteer requires Chrome/Chromium binaries which are not available on Vercel's serverless environment
   - **Impact**: PDF generation will fail during deployment
   - **Mitigation**: Use alternative PDF generation approach:
     - Option A: Use `@react-pdf/renderer` (client-side PDF generation)
     - Option B: Use `jsPDF` library (lightweight, no browser required)
     - Option C: Use external PDF API service (e.g., HTML to PDF API)
   - **Recommendation**: Switch to `@react-pdf/renderer` for MVP - it's serverless-friendly and doesn't require browser

2. **Synchronous Report Generation Timeout**
   - **Issue**: Report generation involves multiple API calls (Google Maps, Google Places, OpenAI) which can take 30+ seconds. Vercel has 60-second timeout for serverless functions.
   - **Impact**: Report generation will timeout and fail
   - **Mitigation**:
     - Implement as async with status polling (more complex)
     - OR use Vercel Edge Functions (15-second limit, not enough)
     - OR simplify to reduce API calls (use cached data where possible)
     - OR move to long-running process (not viable for 3-day MVP)
   - **Recommendation**: Keep synchronous but add progress indication, if timeout occurs, allow user to retry. For MVP, aim for <45 seconds total.

3. **Missing Prisma Schema Definition**
   - **Issue**: Plan mentions "simplified schema" but doesn't provide actual Prisma schema code
   - **Impact**: AI agent cannot implement database without schema
   - **Mitigation**: Add complete Prisma schema with all required models and fields
   - **Recommendation**: Add schema definition in Phase 1.1

### Medium Priority Issues

4. **Missing Report Creation API Endpoint**
   - **Issue**: Plan references "Call report creation API" but doesn't specify creating POST /api/v1/reports endpoint
   - **Impact**: Frontend cannot create reports
   - **Mitigation**: Add API endpoint creation step
   - **Recommendation**: Add to Day 1, Phase 1.4

5. **Google Maps/Places API Quota Limits**
   - **Issue**: No mention of API quotas or rate limiting
   - **Impact**: Could hit quota limits during testing or production use
   - **Mitigation**: Add rate limiting, use caching, monitor usage
   - **Recommendation**: Add basic rate limiting and in-memory caching for MVP

6. **Database Setup Time Underestimated**
   - **Issue**: Setting up Railway/Render database, configuring, running migrations takes more than 2 hours
   - **Impact**: Deployment phase may exceed time budget
   - **Mitigation**: Use existing database or simpler setup (Supabase, Neon)
   - **Recommendation**: Use Supabase for faster setup (free tier available)

### Low Priority Issues

7. **NEXTAUTH_SECRET Generation**
   - **Issue**: No instruction on how to generate the secret
   - **Impact**: Authentication may fail
   - **Mitigation**: Add command to generate secret
   - **Recommendation**: Add to Phase 1.4

8. **External API Error Handling**
   - **Issue**: No error handling for Google Maps, Google Places, or OpenAI API failures
   - **Impact**: App breaks if external APIs fail
   - **Mitigation**: Add try-catch blocks, fallback logic
   - **Recommendation**: Add basic error handling in service classes

9. **OpenAI API Cost**
   - **Issue**: No cost tracking or budget considerations
   - **Impact**: Could exceed budget during testing
   - **Mitigation**: Monitor token usage, set limits
   - **Recommendation**: Add cost tracking note for AI agent

### Recommended Changes to Plan

**Day 1 Changes:**
- Add complete Prisma schema definition
- Add POST /api/v1/reports endpoint creation
- Add NEXTAUTH_SECRET generation command
- Use Supabase instead of Railway/Render for faster database setup
- Add @types/bcryptjs for TypeScript compatibility
- Add password hashing implementation (bcryptjs) for security
- Add authentication middleware for API route protection

**Day 2 Changes:**
- Add basic in-memory caching for API responses
- Add error handling for external API calls
- Add timeout handling for report generation
- Add GET /api/v1/reports/[id] endpoint (currently missing)
- Add database indexes for performance optimization
- Add input validation on all API endpoints

**Day 3 Changes:**
- Replace Puppeteer with `@react-pdf/renderer` for PDF generation
- Add progress indication for long-running operations
- Reduce testing scope to critical paths only
- Add form validation for user inputs
- Add loading states for all API calls
- Add user-friendly error messages

---

## QA Quality Analysis Findings

### Critical Security Issues (Must Fix Before Implementation)

1. **Password Storage in Plain Text**
   - **Issue**: User model stores password as plain string without hashing
   - **Impact**: Catastrophic security vulnerability - if database is compromised, all passwords are exposed
   - **Fix Required**: Add password hashing with bcryptjs in registration flow
   - **Implementation Step**: Add to Phase 1.4 - "Implement password hashing using bcryptjs.hash() before storing"

2. **No API Authentication Middleware**
   - **Issue**: No authentication checks mentioned on API routes
   - **Impact**: Anyone can access any user's reports and data without authentication
   - **Fix Required**: Add authentication middleware to all API routes
   - **Implementation Step**: Add to Day 1 - "Create authentication middleware and apply to all /api/v1 routes"

3. **No Input Validation on Location API**
   - **Issue**: Location search API has no input validation mentioned
   - **Impact**: API abuse, potential injection attacks, unexpected behavior
   - **Fix Required**: Add Zod validation on all API inputs
   - **Implementation Step**: Add to Phase 1.2 - "Add Zod schema validation for location inputs"

### Critical Implementation Gaps

4. **Missing GET /api/v1/reports/[id] Endpoint**
   - **Issue**: Report detail page needs to fetch individual report, but only POST and GET list endpoints are defined
   - **Impact**: Frontend cannot display report details
   - **Fix Required**: Add GET endpoint for individual report retrieval
   - **Implementation Step**: Add to Phase 1.4 - "Create GET /api/v1/reports/[id] endpoint with authentication check"

5. **Missing TypeScript Type Definitions**
   - **Issue**: @types/bcryptjs and @types/react-pdf not mentioned
   - **Impact**: TypeScript compilation errors
   - **Fix Required**: Add type definitions
   - **Implementation Step**: Add to Phase 1.1 - "Run: npm install -D @types/bcryptjs"

6. **Missing Seed Script Implementation**
   - **Issue**: Seed business categories mentioned but no implementation details
   - **Impact**: AI agent cannot implement without guidance
   - **Fix Required**: Add seed script with actual category data
   - **Implementation Step**: Add to Phase 1.1 - "Create prisma/seed.ts with Cafe, Pharmacy, Salon data including mappings"

### Logical Inconsistencies

7. **Performance Check Contradiction**
   - **Issue**: Performance check requires <30 seconds but report generation timeout is 45 seconds
   - **Impact**: Confusing acceptance criteria
   - **Fix Required**: Align performance requirements
   - **Recommendation**: Change performance check to <45 seconds to match timeout

8. **Missing Report Generation API Creation**
   - **Issue**: Phase 2.4 says "Update /api/v1/reports/[id]/generate/route.ts" but it was never created
   - **Impact**: API endpoint doesn't exist to update
   - **Fix Required**: Create the endpoint first, then update
   - **Implementation Step**: Add to Phase 1.4 - "Create POST /api/v1/reports/[id]/generate/route.ts placeholder"

### Data Integrity Issues

9. **No Database Indexes**
   - **Issue**: No indexes mentioned for frequently queried fields (userId, businessCategoryId, status)
   - **Impact**: Poor query performance as data grows
   - **Fix Required**: Add indexes to Prisma schema
   - **Implementation Step**: Add to Phase 1.1 - "Add @@index on userId, businessCategoryId, status in Report model"

10. **No Score Range Validation**
    - **Issue**: No validation that scores are within 0-100 range in database or API
    - **Impact**: Invalid scores could corrupt calculations
    - **Fix Required**: Add validation in scoring service and database constraints
    - **Implementation Step**: Add to Phase 2.2 - "Add validation to ensure scores are clamped to 0-100 range"

### Performance Bottlenecks

11. **No API Response Caching**
    - **Issue**: Google Maps/Places API calls not cached
    - **Impact**: Repeated calls for same location waste quota and money
    - **Fix Required**: Add in-memory caching with TTL
    - **Implementation Step**: Add to Day 2 - "Implement simple Map-based cache for API responses with 5-minute TTL"

12. **No Pagination on Report List**
    - **Issue**: GET /api/v1/reports has no pagination
    - **Impact**: Performance degrades as user creates more reports
    - **Fix Required**: Add pagination parameters
    - **Implementation Step**: Add to Phase 1.4 - "Add pagination (limit, offset) to GET /api/v1/reports"

### User Experience Gaps

13. **No Form Validation**
    - **Issue**: No client-side or server-side form validation mentioned
    - **Impact**: Poor UX, invalid data submission
    - **Fix Required**: Add form validation with react-hook-form + Zod
    - **Implementation Step**: Add to Phase 3.1 - "Add Zod validation schema for report creation form"

14. **No Loading States**
    - **Issue**: No loading states mentioned for API calls
    - **Impact**: Poor UX, users don't know what's happening
    - **Fix Required**: Add loading indicators for all async operations
    - **Implementation Step**: Add to Phase 3.1 - "Add loading spinners for all API calls"

15. **No User-Friendly Error Messages**
    - **Issue**: No error message handling mentioned for frontend
    - **Impact**: Poor UX, users see generic errors
    - **Fix Required**: Add error boundaries and user-friendly error messages
    - **Implementation Step**: Add to Phase 3.1 - "Add error display components with user-friendly messages"

### Technical Debt Risks

16. **No Environment Variable Validation**
    - **Issue**: No validation that required env vars are set on startup
    - **Impact**: Runtime errors when env vars are missing
    - **Fix Required**: Add env var validation in app initialization
    - **Implementation Step**: Add to Phase 1.1 - "Create lib/config/env.ts to validate required env vars"

17. **No Error Boundary for Frontend**
    - **Issue**: No React error boundary mentioned
    - **Impact**: Unhandled errors crash entire app
    - **Fix Required**: Add error boundary component
    - **Implementation Step**: Add to Phase 3.1 - "Create ErrorBoundary component and wrap app"

18. **No CORS Configuration**
    - **Issue**: No CORS configuration mentioned
    - **Impact**: Could have cross-origin issues in production
    - **Fix Required**: Configure CORS in Next.js config
    - **Implementation Step**: Add to Phase 1.1 - "Configure CORS in next.config.js"

### Updated Implementation Priority

**Must Fix Before Starting (Blocking Issues):**
1. Add password hashing (security critical)
2. Add authentication middleware (security critical)
3. Add missing GET /api/v1/reports/[id] endpoint
4. Add TypeScript type definitions
5. Add seed script implementation details

**Should Fix During Implementation (High Priority):**
6. Add input validation on all APIs
7. Add database indexes
8. Add score range validation
9. Add form validation
10. Add loading states

**Nice to Have (Medium Priority):**
11. Add API response caching
12. Add pagination
13. Add error boundaries
14. Add env var validation
15. Add CORS configuration

## Recent Changes

- Restructured entire plan from 12-week timeline to 3-day accelerated timeline
- Simplified all features to MVP essentials only
- Deferred all enhancements to post-MVP
- Removed complex features: shadcn/ui, comprehensive testing, CI/CD, advanced scoring
- Focused on core functionality: report creation, POI collection, classification, scoring, AI generation, PDF export
- **Critical Technical Fixes Applied**:
  - Replaced Puppeteer with @react-pdf/renderer for serverless compatibility on Vercel
  - Added complete Prisma schema definition with all required models
  - Added NEXTAUTH_SECRET generation command
  - Added POST /api/v1/reports endpoint creation step
  - Changed database setup from Railway/Render to Supabase for faster deployment
  - Added timeout handling for AI service (30s) and report generation (45s)
  - Added basic error handling with try-catch blocks to all services
  - Added cost tracking for OpenAI API usage
  - Added progress tracking for report generation pipeline
  - Added progress indication note for frontend report creation
- **QA Quality Analysis Fixes Applied**:
  - Added @types/bcryptjs for TypeScript compatibility
  - Added password hashing implementation (bcryptjs) for security
  - Added authentication middleware for API route protection
  - Added database indexes on userId, businessCategoryId, status for performance
  - Added seed script implementation details with mappings
  - Added Zod validation to location API inputs
  - Added GET /api/v1/reports/[id] endpoint for individual report retrieval
  - Added pagination (limit, offset) to report list endpoint
  - Added score range validation (clamp to 0-100)
  - Added form validation with Zod schema for report creation
  - Added loading states to all frontend pages
  - Added error display components for user-friendly error messages
  - Added Error Boundary component for React error handling
  - Added environment variable validation on startup
  - Added CORS configuration in next.config.js
  - Fixed performance check contradiction (<30s to <45s to match timeout)
  - Added comprehensive "QA Quality Analysis Findings" section with 18 identified issues

## Next Immediate Steps

1. Start Day 1, Phase 1.1: Quick Project Setup
2. Initialize Next.js project with TypeScript
3. Set up Prisma with simplified schema
4. Configure Google Maps integration

## MVP Acceptance Criteria (3-Day Plan)

The 3-day MVP is considered complete when:

1. User can register and login
2. User can create a report for Cafe, Pharmacy, or Salon
3. System collects nearby POIs from Google Places
4. System classifies competitors and demand signals
5. System calculates basic feasibility scores
6. System generates AI-powered report summary
7. User can view report detail page with all sections
8. User can download PDF report
9. Application is deployed to Vercel and functional
10. Basic disclaimer is included in reports

---

*Last Updated: 2026-05-16*
*Updated By: Technical Architect*
*Plan Type: 3-Day AI Agent Accelerated MVP*  
