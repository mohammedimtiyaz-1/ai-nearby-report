# Technical Specification

# Nearby Business Feasibility & Location Intelligence Platform

## Document control

| Field | Value |
| --- | --- |
| Document type | Technical Specification |
| Product name | Nearby Business Feasibility & Location Intelligence Platform |
| Short name | Nearby Report |
| Version | 1.0 |
| Status | Implementation-ready technical specification |
| Primary audience | CTO, engineering leads, architects, DevOps, data engineers, AI engineers |
| Focus area | End-to-end technical implementation with MCP-based third-party API integration |

---

## 1. Executive summary

This technical specification defines the architecture, tech stack, data models, services, and implementation strategy for the Nearby Report MVP. The system is designed as a cost-optimized, monolithic application with direct API integrations for MVP, enabling rapid development while keeping costs minimal.

### Key technical decisions for MVP

- **Monolithic architecture**: Single Next.js application with API routes for simplicity and cost efficiency.
- **Direct API integration**: Direct calls to external APIs (Google Maps, OpenAI) instead of separate MCP servers to reduce infrastructure overhead.
- **Type-safe full stack**: TypeScript across frontend and backend.
- **PostgreSQL + PostGIS**: Geospatial queries and relational data in a single database.
- **Synchronous report generation**: For MVP, reports generate synchronously to avoid queue infrastructure costs.
- **Configurable scoring engine**: JSON-based configuration for business categories, scoring weights, and mappings.
- **Minimal infrastructure**: Single server deployment without Kubernetes, Redis, or complex orchestration.

---

## 2. System architecture

## 2.1 High-level architecture

```txt
┌─────────────────────────────────────────────────────────────────┐
│              Next.js Application (Frontend + Backend)            │
│     React + TypeScript + Tailwind + API Routes + Prisma         │
└────────────────────────┬────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┬─────────────────────┐
        ↓                ↓                ↓                     ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Google Maps │  │  Google      │  │  OpenAI      │  │  PDF         │
│  API         │  │  Places API  │  │  API         │  │  Generation  │
│  (Geocoding) │  │  (POI Data)  │  │  (AI Report) │  │  (Puppeteer) │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              PostgreSQL + PostGIS Database                       │
└─────────────────────────────────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────────┐
│              Local File Storage (PDFs)                          │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Direct API integration strategy (MVP)

### Why direct API integration for MVP

- **Lower infrastructure cost**: No need for separate MCP server processes
- **Simpler deployment**: Single monolithic application
- **Faster development**: Direct integration reduces abstraction layers
- **Reduced operational complexity**: No need to manage multiple services
- **Adequate for MVP**: Single provider per service is sufficient for initial launch

### External API integrations

| Service | Provider | Purpose |
| --- | --- | --- |
| Location | Google Maps Geocoding API | Geocoding, reverse geocoding, autocomplete |
| POI Data | Google Places API | Nearby POI discovery, place details |
| Maps | Google Maps JavaScript API | Interactive maps, markers |
| AI Report | OpenAI GPT-4o Mini | Report text generation (cost-optimized) |
| PDF | Puppeteer (server-side) | PDF generation from HTML templates |

### API service layer

Each external API will have a dedicated service class:

```typescript
// Example: LocationService
class LocationService {
  private apiKey: string;
  
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  }
  
  async geocode(address: string): Promise<LocationResult> {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
    );
    const data = await response.json();
    return this.parseGeocodeResponse(data);
  }
  
  // ... other methods
}
```

---

## 3. Tech stack

## 3.1 Frontend

| Component | Technology | Rationale |
| --- | --- | --- |
| Framework | Next.js 14+ (App Router) | React framework with SSR, API routes, built-in optimization |
| Language | TypeScript 5+ | Type safety across full stack |
| Styling | Tailwind CSS 4+ | Utility-first CSS, rapid development, small bundle |
| UI Components | shadcn/ui | Accessible, customizable, no runtime overhead |
| Maps | Mapbox GL JS or Google Maps JavaScript API | Rich map features, POI markers, clustering |
| Charts | Recharts | React-friendly, SVG-based, customizable |
| Forms | React Hook Form + Zod | Type-safe form validation |
| State Management | React Query + Zustand | Server state + client state separation |
| PDF Preview | react-pdf or custom preview | Client-side PDF preview before download |
| Icons | Lucide React | Tree-shakeable, consistent icon set |

## 3.2 Backend

| Component | Technology | Rationale |
| --- | --- | --- |
| Runtime | Node.js 20+ LTS | Stable, widely supported |
| Framework | Next.js 14+ (App Router) | Full-stack framework with API routes, SSR |
| Language | TypeScript 5+ | Type safety across full stack |
| ORM | Prisma 5+ | Type-safe database access, migrations, PostGIS support |
| Database | PostgreSQL 16+ with PostGIS | Geospatial queries, relational data |
| Validation | Zod | Runtime type validation, shared with frontend |
| Authentication | NextAuth.js | Simple auth for MVP, email/password |
| Password Hashing | bcryptjs | Password hashing with cost factor 10 |
| PDF Generation | @react-pdf/renderer | Serverless-compatible PDF generation (replaced Puppeteer) |

## 3.3 External API Services

| Service | Provider | Cost (MVP estimate) |
| --- | --- | ---: |
| Google Maps Geocoding | $200/50k requests | ~$40/month (10k requests) |
| Google Places API | $350/50k requests | ~$70/month (10k requests) |
| Google Maps JS API | $200/28k loads | ~$40/month (5.6k loads) |
| OpenAI GPT-4o Mini | $0.15/1M input, $0.60/1M output | ~$50/month (100k reports) |
| **Total APIs** | | **~$200/month** |

## 3.4 Infrastructure (MVP)

| Component | Technology | Rationale |
| --- | --- | --- |
| Cloud Provider | Railway, Render, or Vercel | Simple PaaS, no DevOps overhead |
| Deployment | Docker container | Single container deployment |
| CI/CD | GitHub Actions | Free tier sufficient |
| Monitoring | Console logs + basic metrics | No external monitoring cost |
| Logging | Console + file logs | Simple, no ELK stack |
| Secrets | Environment variables | Platform-provided secret management |
| Storage | Local filesystem | PDFs stored locally, served via app |
| CDN | Platform-provided | Built-in static asset delivery |

---

## 4. Database schema

## 4.1 ER Diagram

```txt
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    User      │─────│    Report    │─────│ ReportPOI    │
└──────────────┘     └──────────────┘     └──────────────┘
                           │                     │
                           ↓                     ↓
                    ┌──────────────┐     ┌──────────────┐
                    │ScoreParameter│─────│     POI      │
                    └──────────────┘     └──────────────┘
                           │
                           ↓
                    ┌──────────────┐
                    │ReportSection │
                    └──────────────┘

┌──────────────┐
│BusinessCategory│
└──────────────┘
```

## 4.2 Prisma schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ReportStatus {
  DRAFT
  COLLECTING_DATA
  CLASSIFYING
  SCORING
  GENERATING_SUMMARY
  COMPLETED
  COMPLETED_WITH_WARNINGS
  FAILED
}

enum RiskLevel {
  LOW
  MEDIUM
  HIGH
}

enum ConfidenceLevel {
  LOW
  MEDIUM
  HIGH
}

enum Impact {
  POSITIVE
  NEGATIVE
  NEUTRAL
}

enum POIClassification {
  DIRECT_COMPETITOR
  INDIRECT_COMPETITOR
  SUBSTITUTE_COMPETITOR
  NON_COMPETITOR
  DEMAND_SIGNAL
  ACCESSIBILITY_SIGNAL
  SUPPORTING_ECOSYSTEM
  IRRELEVANT
}

enum ThreatLevel {
  LOW
  MEDIUM
  HIGH
}

model User {
  id                String   @id @default(cuid())
  email             String   @unique
  name              String?
  password          String   // Hashed with bcryptjs
  role              String   @default("user")
  plan              String   @default("free")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  reports           Report[]
}

model BusinessCategory {
  id                    String   @id @default(cuid())
  name                  String   @unique
  slug                  String   @unique
  description           String
  supportedModels       Json     // Array of business model strings
  scoringConfig         Json     // Category-specific scoring weights
  competitorMappings    Json     // Category -> external type mappings
  demandSignalMappings  Json     // Demand signal type mappings
  surveyChecklistConfig Json     // Checklist items by category
  isActive              Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  reports               Report[]
}

model Report {
  id                  String           @id @default(cuid())
  userId              String
  businessCategoryId String
  locationName        String
  formattedAddress    String?
  latitude            Float
  longitude           Float
  radiusMeters        Int
  businessModel       String?
  
  // Optional inputs
  inputParameters     Json?            // { rent, shopSize, budget, etc. }
  
  status              ReportStatus     @default(DRAFT)
  finalScore          Int?
  riskLevel           RiskLevel?
  confidenceLevel     ConfidenceLevel?
  recommendation      String?
  
  // AI-generated content
  aiSummary           Json?            // { executiveSummary, opportunities, risks, ... }
  
  generatedAt         DateTime?
  createdAt           DateTime         @default(now())
  updatedAt           DateTime         @updatedAt
  
  user                User             @relation(fields: [userId], references: [id])
  businessCategory    BusinessCategory @relation(fields: [businessCategoryId], references: [id])
  pois                ReportPOI[]
  scoreParameters     ScoreParameter[]
  reportSections      ReportSection[]
  surveyChecklist     SurveyChecklist?
  
  @@index([userId])
  @@index([businessCategoryId])
  @@index([status])
  @@index([createdAt])
}

model POI {
  id                String   @id @default(cuid())
  source            String   // "google_places", "foursquare", "osm"
  sourcePlaceId      String   // Provider's place ID
  name              String
  originalCategory  String   // Provider's category
  normalizedCategory String  // Internal normalized category
  latitude          Float
  longitude         Float
  address           String?
  rating            Float?
  reviewCount       Int?
  openingStatus     String?  // "open", "closed", "unknown"
  priceLevel         String?  // 1-4 or "$"-"$$$$"
  website           String?
  phone             String?
  metadata          Json?    // Additional provider-specific data
  
  // Geospatial index
  location          Unsupported("location")? // PostGIS geometry point
  
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  reportPOIs         ReportPOI[]
  
  @@unique([source, sourcePlaceId])
  @@index([normalizedCategory])
}

model ReportPOI {
  id                String          @id @default(cuid())
  reportId          String
  poiId             String
  distanceMeters    Float
  classification    POIClassification
  threatLevel       ThreatLevel?
  relevanceScore    Float?          // 0-1 relevance to selected business
  classificationReason String?
  threatReason      String?
  
  createdAt         DateTime        @default(now())
  
  report            Report          @relation(fields: [reportId], references: [id], onDelete: Cascade)
  poi               POI             @relation(fields: [poiId], references: [id])
  
  @@index([reportId])
  @@index([poiId])
  @@index([classification])
}

model ScoreParameter {
  id             String   @id @default(cuid())
  reportId       String
  scoreGroup     String   // "competition", "demand", "accessibility", etc.
  key            String   // "direct_competitor_density"
  label          String   // "Direct Competitor Density"
  rawValue       String   // "14 direct competitors within 1 km"
  score          Int      // 0-100
  weight         Float   // 0-1
  impact         Impact
  confidence     String   // "low", "medium", "high"
  explanation    String
  
  createdAt      DateTime @default(now())
  
  report         Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  
  @@index([reportId])
  @@index([scoreGroup])
}

model ReportSection {
  id              String   @id @default(cuid())
  reportId        String
  sectionType     String   // "executive_summary", "opportunities", etc.
  title           String
  content         String   // Markdown or HTML
  order           Int
  generationSource String // "ai", "template", "manual"
  
  createdAt       DateTime @default(now())
  
  report          Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
  
  @@index([reportId])
}

model SurveyChecklist {
  id              String   @id @default(cuid())
  reportId        String   @unique
  checklistItems  Json     // Array of checklist item objects
  completed       Boolean  @default(false)
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  report          Report   @relation(fields: [reportId], references: [id], onDelete: Cascade)
}

model SurveyResponse {
  id              String   @id @default(cuid())
  reportId        String
  responses       Json     // User's survey answers
  updatedScore    Int?
  notes           String?
  
  createdAt       DateTime @default(now())
  
  @@index([reportId])
}
```

## 4.3 PostGIS extensions

```sql
-- Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create geospatial index on POI table
CREATE INDEX idx_poi_location ON poi USING GIST (location);

-- Function to calculate distance
CREATE OR REPLACE FUNCTION calculate_distance(
  lat1 FLOAT, 
  lon1 FLOAT, 
  lat2 FLOAT, 
  lon2 FLOAT
) RETURNS FLOAT AS $$
BEGIN
  RETURN ST_DistanceSphere(
    ST_MakePoint(lon1, lat1)::geography,
    ST_MakePoint(lon2, lat2)::geography
  );
END;
$$ LANGUAGE plpgsql;
```

---

## 5. API design

## 5.1 API architecture

- RESTful API design
- OpenAPI/Swagger documentation
- Request/response validation with Zod
- Rate limiting per user and per endpoint
- CORS configuration (configure in next.config.js for frontend domain)
- Error handling with consistent error responses
- **Authentication middleware**: All /api/v1 routes protected with authentication check
- **Pagination**: Report list endpoint supports limit and offset parameters

## 5.2 API endpoints

### Authentication

```typescript
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
POST   /api/v1/auth/refresh
```

### Business Categories

```typescript
GET    /api/v1/business-categories
GET    /api/v1/business-categories/:id
GET    /api/v1/business-categories/:slug
```

### Location

```typescript
GET    /api/v1/locations/search          // Query: q, region
GET    /api/v1/locations/reverse-geocode // Query: lat, lng
GET    /api/v1/locations/autocomplete    // Query: q
```

### Reports

```typescript
POST   /api/v1/reports                    // Create report
GET    /api/v1/reports                    // List user's reports (with pagination: limit, offset)
GET    /api/v1/reports/:id                // Get report details
PATCH  /api/v1/reports/:id                // Update report (status, etc.)
DELETE /api/v1/reports/:id                // Delete report
POST   /api/v1/reports/:id/generate       // Trigger report generation
GET    /api/v1/reports/:id/status         // Get generation status
GET    /api/v1/reports/:id/pdf            // Download PDF
GET    /api/v1/reports/:id/competitors    // Get competitor data
GET    /api/v1/reports/:id/demand-signals // Get demand signals
GET    /api/v1/reports/:id/scores         // Get score breakdown
GET    /api/v1/reports/:id/checklist      // Get survey checklist
POST   /api/v1/reports/:id/checklist      // Submit survey response
```

### Admin (protected)

```typescript
GET    /api/v1/admin/reports        // Defer to post-MVP
GET    /api/v1/admin/users          // Defer to post-MVP
POST   /api/v1/admin/business-categories // Defer to post-MVP
```

## 5.3 Request/response examples

### Create report

```typescript
// POST /api/v1/reports
Request {
  businessCategoryId: string;
  location: {
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  radiusMeters: number;
  businessModel?: string;
  inputParameters?: {
    expectedRent?: number;
    shopSize?: number;
    setupBudget?: number;
    monthlyStaffCost?: number;
    inventoryCost?: number;
    investmentRange?: string;
  };
}

Response {
  id: string;
  status: "DRAFT";
  userId: string;
  businessCategoryId: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  createdAt: string;
}
```

### Get report details

```typescript
// GET /api/v1/reports/:id
Response {
  id: string;
  status: ReportStatus;
  userId: string;
  businessCategoryId: string;
  businessCategory: {
    name: string;
    slug: string;
  };
  locationName: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  businessModel?: string;
  inputParameters?: Record<string, any>;
  finalScore?: number;
  riskLevel?: RiskLevel;
  confidenceLevel?: ConfidenceLevel;
  recommendation?: string;
  aiSummary?: {
    executiveSummary: string;
    opportunities: string[];
    risks: string[];
    recommendedBusinessModel: {
      recommended: string[];
      lessSuitable: string[];
      explanation: string;
    };
    finalRecommendation: string;
  };
  generatedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 6. External API service specifications (MVP)

## 6.1 Location Service (Google Maps)

### Purpose

Geocoding, reverse geocoding, place search, and address autocomplete.

### Methods

```typescript
class LocationService {
  async geocode(address: string, region?: string): Promise<LocationResult>
  async reverseGeocode(lat: number, lng: number): Promise<LocationResult>
  async autocomplete(query: string, region?: string): Promise<AutocompleteResult[]>
}
```

### Response structure

```typescript
interface LocationResult {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  components: {
    streetNumber?: string;
    streetName?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  confidence: number;
}

interface AutocompleteResult {
  placeId: string;
  description: string;
}
```

## 6.2 POI Service (Google Places)

### Purpose

Discover nearby places of interest, fetch place details.

### Methods

```typescript
class POIService {
  async searchNearby(params: SearchNearbyParams): Promise<POI[]>
  async getPlaceDetails(placeId: string): Promise<POIDetail>
  normalizeCategory(providerCategory: string): string
}
```

### Category normalization

```typescript
const categoryMappings: Record<string, string> = {
  "cafe": "cafe",
  "coffee_shop": "cafe",
  "bakery": "bakery",
  "restaurant": "restaurant",
  "beauty_salon": "salon",
  "hair_care": "salon",
  "pharmacy": "pharmacy",
  "drugstore": "pharmacy",
  "hospital": "hospital",
  "doctor": "clinic",
  "transit_station": "transport",
  "bus_station": "transport",
  "university": "college",
  "school": "school",
  "shopping_mall": "mall",
};
```

## 6.3 AI Service (OpenAI GPT-4o Mini)

### Purpose

Generate business-friendly report text from structured analysis data.

### Method

```typescript
class AIService {
  async generateReportSummary(analysisData: AnalysisData): Promise<AISummary>
}
```

### System prompt

```typescript
const systemPrompt = `You are a business location intelligence assistant. Generate a location feasibility report based ONLY on the structured data provided.

CRITICAL RULES:
1. Use ONLY the data provided.
2. DO NOT invent facts, numbers, competitor names, rent values, footfall, or revenue.
3. DO NOT guarantee business success or failure.
4. If data is missing, state that manual validation is required.
5. Use simple, business-friendly language.
6. Always include the disclaimer.

Generate: executive summary, opportunities, risks, recommended business model, survey checklist explanation, final recommendation, disclaimer.`;
```

## 6.4 PDF Service (Puppeteer)

### Purpose

Generate PDF reports from HTML templates.

### Method

```typescript
class PDFService {
  async generateReportPDF(reportData: ReportData): Promise<Buffer>
}
```

### Template

- HTML + Tailwind CSS
- Handlebars for templating
- Server-side rendering with Puppeteer
    competitors: {
      total: number;
      direct: number;
      indirect: number;
      highThreat: number;
      averageRating?: number;
      closest: Array<{ name: string; distanceMeters: number; threatLevel: string }>;
    };
    demandSignals: {
      total: number;
      byType: Record<string, number>;
      closest: Array<{ type: string; count: number; distanceMeters: number }>;
    };
    accessibility: {
      score: number;
      signals: string[];
      manualChecks: string[];
    };
    scores: {
      final: number;
      competition: number;
      demand: number;
      accessibility: number;
      areaFit: number;
      financialPressure?: number;
    };
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    confidenceLevel: "LOW" | "MEDIUM" | "HIGH";
    missingData: string[];
  };
  language?: string; // Default: "en"
}

Output: {
  executiveSummary: string;
  opportunities: string[];
  risks: string[];
  recommendedBusinessModel: {
    recommended: string[];
    lessSuitable: string[];
    explanation: string;
  };
  surveyChecklistExplanation: string;
  finalRecommendation: string;
  usedDataPoints: string[];
  disclaimer: string;
}
```

#### `generateSection`

Generate a specific report section.

```typescript
Input: {
  sectionType: "executive_summary" | "opportunities" | "risks" | "recommendation";
  // ... same analysis data as generateReportSummary
}

Output: {
  content: string;
}
```

### Provider implementations

- **Primary**: OpenAI GPT-4 Turbo (for best quality)
- **Alternative**: Anthropic Claude 3 Opus
- **Cost optimization**: GPT-4 for final reports, GPT-3.5 for drafts
- **Local option**: Ollama with Mistral/Llama 3 for cost-sensitive deployments

### Prompt engineering

The AI MCP server will use structured prompts with clear guardrails:

```typescript
const systemPrompt = `You are a business location intelligence assistant. Your task is to generate a location feasibility report based ONLY on the structured data provided.

CRITICAL RULES:
1. Use ONLY the data provided in the analysis object.
2. DO NOT invent any facts, numbers, competitor names, rent values, footfall counts, or revenue predictions.
3. DO NOT guarantee business success or failure.
4. If data is missing, clearly state that manual validation is required.
5. Frame all recommendations as decision-support, not guarantees.
6. Use simple, business-friendly language.
7. Always include the disclaimer.

Report sections to generate:
- Executive summary (2-3 paragraphs)
- Opportunities (3-5 bullet points)
- Risks (3-5 bullet points)
- Recommended business model with explanation
- Survey checklist explanation (2-3 paragraphs)
- Final recommendation (1 paragraph)
- Disclaimer`;
```

### Output validation

The AI MCP server will validate output:

```typescript
const validateAIOutput = (output: any): boolean => {
  const requiredFields = [
    "executiveSummary",
    "opportunities",
    "risks",
    "recommendedBusinessModel",
    "finalRecommendation",
    "disclaimer"
  ];
  
  for (const field of requiredFields) {
    if (!output[field]) return false;
  }
  
  // Check for prohibited phrases
  const prohibitedPhrases = [
    "guarantee",
    "will succeed",
    "will fail",
    "certain profit",
    "exact revenue"
  ];
  
  const text = JSON.stringify(output).toLowerCase();
  for (const phrase of prohibitedPhrases) {
    if (text.includes(phrase)) return false;
  }
  
  return true;
};
```

## 6.5 PDF MCP Server

### Purpose

Generate professional PDF reports from templates.

### Tools

#### `generateReportPDF`

```typescript
Input: {
  reportId: string;
  reportData: {
    // All report data needed for PDF
    executiveSummary: string;
    inputSummary: Record<string, any>;
    scoreSummary: Record<string, number>;
    competitorAnalysis: Record<string, any>;
    demandSignalAnalysis: Record<string, any>;
    accessibilityAnalysis: Record<string, any>;
    opportunities: string[];
    risks: string[];
    recommendedBusinessModel: Record<string, any>;
    surveyChecklist: string[];
    disclaimer: string;
  };
  template?: "standard" | "consultant" | "minimal";
  branding?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}

Output: {
  pdfUrl: string;
  pages: number;
  expiresAt: string;
}
```

### Provider implementations

- **Primary**: Puppeteer with HTML template
- **Alternative**: specialized PDF API (like PDFShift or CloudConvert)

### Template design

PDF templates will use:

- HTML + Tailwind CSS for styling
- Handlebars or similar for templating
- Responsive layout
- Professional typography
- Charts rendered as SVG or images
- Page breaks at logical sections

---

## 7. Service layer architecture (MVP)

## 7.1 Service modules

### ReportService

Orchestrates the entire report generation pipeline (synchronous for MVP).

```typescript
class ReportService {
  async createReport(input: CreateReportInput): Promise<Report>
  async generateReport(reportId: string): Promise<Report> // Synchronous
  async getReport(reportId: string): Promise<ReportDetail>
  async listReports(userId: string): Promise<Report[]>
  async deleteReport(reportId: string): Promise<void>
}
```

### LocationService

```typescript
class LocationService {
  async geocode(address: string, region?: string): Promise<LocationResult>
  async reverseGeocode(lat: number, lng: number): Promise<LocationResult>
  async autocomplete(query: string, region?: string): Promise<AutocompleteResult[]>
}
```

### POIService

```typescript
class POIService {
  async searchNearby(params: SearchNearbyParams): Promise<POI[]>
  async getPlaceDetails(placeId: string): Promise<POIDetail>
  normalizeCategory(providerCategory: string): string
}
```

### ClassificationService

```typescript
class ClassificationService {
  classifyCompetitors(pois: POI[], businessCategory: string): ClassifiedPOI[]
  classifyDemandSignals(pois: POI[], businessCategory: string): ClassifiedPOI[]
  calculateThreatLevel(poi: POI, location: Location): ThreatLevel
}
```

### ScoringService

```typescript
class ScoringService {
  calculateCompetitionScore(report: Report): ScoreResult
  calculateDemandScore(report: Report): ScoreResult
  calculateAccessibilityScore(report: Report): ScoreResult
  calculateAreaFitScore(report: Report): ScoreResult
  calculateFinancialPressureScore(report: Report): ScoreResult
  calculateRiskScore(report: Report): ScoreResult
  calculateConfidenceScore(report: Report): ScoreResult
  calculateFinalScore(report: Report): ScoreResult
}
```

### AIService

```typescript
class AIService {
  async generateReportSummary(analysisData: AnalysisData): Promise<AISummary>
}
```

### PDFService

```typescript
class PDFService {
  async generateReportPDF(reportData: ReportData): Promise<Buffer>
}
```

---

## 8. Frontend architecture

## 8.1 Component structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── reports/
│   │   ├── new/
│   │   │   └── page.tsx
│   │   ├── [id]/
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── ReportHeader.tsx
│   │   │       ├── ScoreCards.tsx
│   │   │       ├── CompetitorTable.tsx
│   │   │       ├── DemandSignals.tsx
│   │   │       ├── MapView.tsx
│   │   │       ├── Opportunities.tsx
│   │   │       ├── Risks.tsx
│   │   │       ├── SurveyChecklist.tsx
│   │   │       └── PDFDownload.tsx
│   │   └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── forms/
│   │   ├── BusinessCategorySelect.tsx
│   │   ├── LocationSearch.tsx
│   │   ├── RadiusSelect.tsx
│   │   └── FinancialInputs.tsx
│   ├── maps/
│   │   ├── MapPicker.tsx
│   │   ├── POIMap.tsx
│   │   └── MapMarkers.tsx
│   └── charts/
│       ├── ScoreChart.tsx
│       └── ComparisonChart.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── reports.ts
│   │   ├── locations.ts
│   │   └── auth.ts
│   ├── hooks/
│   │   ├── useReport.ts
│   │   ├── useLocation.ts
│   │   └── useAuth.ts
│   ├── stores/
│   │   ├── reportStore.ts
│   │   └── authStore.ts
│   ├── mcp/
│   │   └── client.ts
│   └── utils/
│       └── validation.ts
└── types/
    └── index.ts
```

## 8.2 State management strategy

- **Server state**: React Query for API data (reports, categories, locations)
- **Client state**: Zustand for UI state (form progress, map selection, modals)
- **Form state**: React Hook Form with Zod validation
- **Loading states**: All API calls must have loading indicators (spinners, skeletons)
- **Error handling**: User-friendly error messages displayed for all API failures
- **Error boundaries**: React Error Boundary component to catch and display errors gracefully

## 8.3 Map integration

```typescript
// MapPicker component
interface MapPickerProps {
  initialLocation?: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number; address: string }) => void;
}

// POIMap component
interface POIMapProps {
  center: { lat: number; lng: number };
  pois: Array<{
    id: string;
    name: string;
    category: string;
    lat: number;
    lng: number;
    classification: string;
    threatLevel?: string;
  }>;
  radius: number;
  onPOIClick?: (poi: POI) => void;
}
```

---

## 9. Configuration management

## 9.1 Environment variables

```bash
# Database
DATABASE_URL=
DATABASE_POOL_SIZE=10

# Redis
REDIS_URL=
REDIS_PASSWORD=

# MCP Servers
LOCATION_MCP_URL=
POI_MCP_URL=
MAPS_MCP_URL=
AI_MCP_URL=
PDF_MCP_URL=

# API Keys (for MCP servers)
GOOGLE_MAPS_API_KEY=
GOOGLE_PLACES_API_KEY=
FOURSQUARE_API_KEY=
MAPBOX_ACCESS_TOKEN=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Application
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_MAP_PROVIDER=mapbox # or google
NEXT_PUBLIC_DEFAULT_RADIUS=1000

# Authentication
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Queue
QUEUE_CONCURRENCY=5
JOB_RETRY_ATTEMPTS=3
JOB_RETRY_DELAY=5000

# PDF
PDF_TEMPLATE_PATH=

# Storage
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
```

**Environment variable validation**: All required environment variables must be validated on application startup. Create `src/lib/config/env.ts` to validate presence of required variables.

## 9.2 Category configuration

Business category configuration stored in database, loaded at startup.

```typescript
interface BusinessCategoryConfig {
  name: string;
  slug: string;
  supportedModels: string[];
  scoringConfig: {
    weights: {
      demand: number;
      competition: number;
      accessibility: number;
      areaFit: number;
      competitorQualityGap: number;
      financialPressure: number;
    };
  };
  competitorMappings: {
    direct: string[];
    indirect: string[];
    substitute: string[];
  };
  demandSignalMappings: {
    [signalType: string]: string[];
  };
  surveyChecklistConfig: string[];
}
```

---

## 10. Security

## 10.1 Authentication & authorization

- JWT-based authentication
- Role-based access control (RBAC)
- API rate limiting per user
- Report ownership validation
- **Password hashing**: All passwords hashed with bcryptjs (cost factor 10)
- **Authentication middleware**: All /api/v1 routes protected with authentication middleware
- **Password verification**: bcryptjs.compare() for login validation

## 10.2 API key security

- All API keys stored in environment variables or secret manager
- API keys never exposed to client
- MCP servers handle their own API keys
- API key rotation strategy

## 10.3 Data encryption

- TLS 1.3 for all external communication
- Database encryption at rest (provider-managed)
- Sensitive user data hashed where appropriate

## 10.4 Input validation

- Zod schemas for all API inputs
- SQL injection prevention via parameterized queries (Prisma)
- XSS prevention via React escaping
- CSRF protection for state-changing operations
- **Score range validation**: All scores must be clamped to 0-100 range
- **Location API validation**: Zod validation for all location search parameters
- **Form validation**: React Hook Form + Zod for all frontend forms

---

## 11. Performance optimization

## 11.1 Database optimization

- Proper indexing on frequently queried columns
- PostGIS geospatial indexes for location queries
- Connection pooling (Prisma connection pool)
- Query optimization and N+1 prevention

## 11.2 Caching strategy

- Redis cache for:
  - Location geocoding results
  - POI data (with TTL)
  - Business category configurations
  - User session data
- CDN cache for static assets and PDFs

## 11.3 API rate limiting

- Per-user rate limits:
  - Location search: 60/minute
  - Report creation: 10/hour
  - Report generation: 5/hour
- Per-IP rate limits for anonymous requests

## 11.4 Lazy loading

- Map tiles loaded on demand
- POI markers clustered and loaded progressively
- Large tables paginated

---

## 12. Monitoring & observability

## 12.1 Logging

- Structured logging with Pino
- Log levels: error, warn, info, debug
- Log aggregation to centralized service
- Sensitive data redaction

## 12.2 Metrics

Track key metrics:

- Report generation success rate
- Report generation time (p50, p95, p99)
- MCP server response times
- API error rates
- Database query performance
- Queue job processing time
- User engagement metrics

## 12.3 Tracing

- Distributed tracing for request flows
- Trace report generation pipeline end-to-end
- Identify bottlenecks in MCP server calls

## 12.4 Error tracking

- Error aggregation to Sentry or similar
- Alert on critical errors
- Error rate monitoring

---

## 13. Deployment strategy

## 13.1 Infrastructure as code

- Terraform or AWS CDK for infrastructure
- Kubernetes manifests or Helm charts
- Environment-specific configurations

## 13.2 CI/CD pipeline

```yaml
# GitHub Actions example
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test
      - run: npm run lint
      - run: npm run type-check

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: docker build -t nearby-report .
      - run: docker push registry/nearby-report:${{ github.sha }}

  deploy:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: kubectl set image deployment/nearby-report nearby-report=registry/nearby-report:${{ github.sha }}
```

## 13.3 Environments

- **Development**: Local development with Docker Compose
- **Staging**: Mirror production with smaller scale
- **Production**: Full-scale deployment with auto-scaling

## 13.4 MCP server deployment

MCP servers deployed as separate services:

- Independent scaling based on load
- Separate monitoring per server
- Can be updated independently
- Can use different infrastructure (e.g., GPU for AI server)

---

## 14. Testing strategy

## 14.1 Unit tests

- Service layer logic
- Scoring calculations
- Classification rules
- Utility functions
- Test coverage target: 80%

## 14.2 Integration tests

- API endpoint tests
- Database integration
- MCP server integration (with mocks)
- Report generation pipeline

## 14.3 E2E tests

- Playwright for critical user flows:
  - Report creation
  - Location search
  - Report viewing
  - PDF download

## 14.4 MCP server tests

- Mock external API responses
- Test rate limiting
- Test error handling
- Test fallback logic

## 14.5 Load testing

- k6 or Artillery for load testing
- Test concurrent report generation
- Identify bottlenecks
- Validate auto-scaling

---

## 15. Implementation roadmap (MVP - 12 weeks)

## 15.1 Phase 1: Foundation (Weeks 1-3)

### Week 1: Project setup
- Initialize Next.js project with TypeScript
- Configure Tailwind CSS, shadcn/ui
- Set up Prisma with PostgreSQL + PostGIS
- Implement database schema
- Set up environment variables

### Week 2: Authentication
- Configure NextAuth.js with email/password
- Create user registration/login pages
- Implement protected routes

### Week 3: Basic API structure
- Create API route structure
- Implement business categories API
- Seed database with MVP categories (Cafe, Pharmacy, Salon)

## 15.2 Phase 2: External API integration (Weeks 4-6)

### Week 4: Google Maps integration
- Implement LocationService (geocoding, autocomplete)
- Create location search API endpoint
- Implement location search UI component

### Week 5: Google Places integration
- Implement POIService (nearby search, place details)
- Create category normalization logic
- Implement POI API endpoints

### Week 6: OpenAI integration
- Implement AIService for report generation
- Create AI prompt templates
- Test AI output validation

## 15.3 Phase 3: Core business logic (Weeks 7-9)

### Week 7: Classification & scoring
- Implement ClassificationService
- Implement ScoringService with category-specific rules
- Create scoring configuration JSON files

### Week 8: Report generation pipeline
- Implement ReportService
- Create report generation API endpoint
- Implement synchronous report generation

### Week 9: PDF generation
- Set up Puppeteer for PDF generation
- Create HTML PDF templates
- Implement PDF download endpoint

## 15.4 Phase 4: Frontend (Weeks 10-11)

### Week 10: Report UI
- Implement report creation form
- Implement report dashboard
- Implement report detail page
- Add Google Maps integration with markers

### Week 11: Polish & UX
- Implement loading states
- Add error handling
- Implement PDF preview
- UI/UX improvements

## 15.5 Phase 5: Testing & deployment (Week 12)

### Week 12: Final integration
- End-to-end testing
- Deploy to production (Railway/Render)
- Performance testing
- Bug fixes
- Documentation

---

## 16. Cost estimation (MVP)

## 16.1 Infrastructure costs (monthly estimates)

| Service | Tier | Cost (USD) |
| --- | --- | ---: |
| PostgreSQL (Railway/Render) | Basic tier | ~$20 |
| Application container | 1GB RAM, 1 vCPU | ~$25 |
| Storage/CDN | Included in platform | $0 |
| **Total infrastructure** | | **~$45/month** |

## 16.2 API costs (monthly estimates - MVP usage)

| API | Usage | Cost (USD) |
| --- | --- | ---: |
| Google Maps Geocoding | 10,000 calls | ~$40 |
| Google Places API | 10,000 calls | ~$70 |
| Google Maps JS API | 5,600 loads | ~$40 |
| OpenAI GPT-4o Mini | 100 reports | ~$50 |
| **Total APIs** | | **~$200/month** |

## 16.3 Total monthly cost (MVP)

- **Infrastructure**: ~$45/month
- **API usage**: ~$200/month
- **Total**: **~$245/month**

This is a **78% cost reduction** from the enterprise architecture estimate.

## 16.4 Cost optimization strategies

- Use GPT-4o Mini instead of GPT-4 for AI reports (90% cost reduction)
- Implement aggressive caching for geocoding results
- Use free Google Maps JS API quota (up to 28,000 loads/month)
- Store POI data in database with 30-day TTL to reduce API calls
- Generate PDFs on-demand instead of pre-generating

---

## 17. Risk mitigation (MVP)

## 17.1 Technical risks

| Risk | Mitigation |
| --- | --- |
| API rate limits | Implement caching, usage tracking, graceful degradation |
| Database performance | Proper indexing, connection pooling |
| AI cost overruns | Use GPT-4o Mini, implement per-user limits, cost tracking |
| PDF generation failures | Retry logic, fallback to plain HTML view |
| Single point of failure | Regular backups, simple rollback process |

## 17.2 Business risks

| Risk | Mitigation |
| --- | --- |
| Low report quality | Manual testing with real locations, user feedback |
| Data inaccuracy | Use Google as primary (reliable), confidence scoring |
| Legal issues | Clear disclaimers, terms of service review |
| Cost overruns | Monitor API usage daily, set budget alerts |

---

## 18. Finalized technical decisions (MVP)

The following decisions have been finalized for implementation:

### Technical stack decisions
1. **PaaS provider**: Vercel
2. **AI model**: GPT-4o Mini
3. **PDF generation**: @react-pdf/renderer (serverless-compatible, replaced Puppeteer)
4. **Testing framework**: Vitest
5. **CI/CD**: GitHub Actions
6. **Password hashing**: bcryptjs with cost factor 10
7. **Authentication middleware**: All /api/v1 routes protected

### Product decisions
6. **Target geography**: Karnataka/Bangalore, India
7. **Expected initial volume**: 100 reports/month
8. **Authentication**: NextAuth.js (email/password)
9. **API credits**: Fresh start (no existing Google Maps credits)

### Implementation plan
10. **Start date**: Immediately
11. **Team**: Single developer with AI coding agent assistance

---

## 19. Success criteria (MVP)

The technical implementation is successful when:

1. All MVP functional requirements are met
2. Report generation completes within 45 seconds for standard reports (updated from 30s to match timeout)
3. API success rate > 95%
4. External API response time < 3 seconds (p95)
5. Database query time < 500ms (p95)
6. Frontend page load time < 2 seconds
7. Basic E2E test suite passes (happy path)
8. Can handle 10 concurrent report generations
9. Basic logging is operational
10. Documentation is complete and accurate

---

## 20. Conclusion (MVP)

This technical specification provides a cost-optimized blueprint for implementing the Nearby Report MVP. The monolithic architecture with direct API integrations enables rapid development while keeping monthly costs at approximately $245/month (78% reduction from enterprise architecture).

The 12-week implementation roadmap provides a clear path from project setup to production deployment. By using GPT-4o Mini, PaaS deployment, and synchronous report generation, the MVP can be launched with minimal infrastructure complexity.

This MVP approach allows for rapid validation of the core product value proposition before investing in more complex architecture patterns like MCP servers, queues, and Kubernetes. Once product-market fit is validated, the system can be refactored into a more scalable architecture as needed.

---

## 21. QA Quality Analysis Findings

### Overview

This section documents the QA findings and subsequent updates made to the technical specification based on comprehensive quality analysis. These changes ensure security, data integrity, user experience, and technical feasibility for the 3-day accelerated MVP implementation.

### Critical Security Issues Addressed

1. **Password Storage Security**
   - **Issue**: User model lacked password field, no hashing mechanism specified
   - **Fix Applied**: Added `password` field to User model with bcryptjs hashing (cost factor 10)
   - **Implementation**: Passwords hashed using `bcryptjs.hash(password, 10)` during registration, verified using `bcryptjs.compare()` during login

2. **API Route Protection**
   - **Issue**: No authentication middleware specified for API routes
   - **Fix Applied**: Added authentication middleware requirement for all /api/v1 routes
   - **Implementation**: Create `src/lib/auth/middleware.ts` to protect API endpoints, return 401 if not authenticated

3. **Input Validation**
   - **Issue**: No specific validation requirements for location API inputs
   - **Fix Applied**: Added Zod validation requirement for all location search parameters
   - **Implementation**: All API inputs must use Zod schemas for runtime validation

### Critical Implementation Gaps Addressed

4. **Database Schema Enhancements**
   - **Issue**: Missing password field in User model
   - **Fix Applied**: Added password field with bcryptjs hashing requirement
   - **Status**: Schema updated in Section 4.2

5. **API Endpoint Completeness**
   - **Issue**: Pagination not specified for report list endpoint
   - **Fix Applied**: Added pagination (limit, offset) parameters to GET /api/v1/reports
   - **Status**: API endpoints updated in Section 5.2

6. **TypeScript Type Definitions**
   - **Issue**: @types/bcryptjs not specified in dependencies
   - **Fix Applied**: Added @types/bcryptjs to development dependencies
   - **Status**: Noted for implementation in dependency installation

### Logical Inconsistencies Resolved

7. **Performance Requirement Alignment**
   - **Issue**: Report generation required <30 seconds but timeout set to 45 seconds
   - **Fix Applied**: Updated performance requirement to <45 seconds to match timeout
   - **Status**: Success criteria updated in Section 19

8. **PDF Generation Serverless Compatibility**
   - **Issue**: Puppeteer not compatible with Vercel serverless functions
   - **Fix Applied**: Replaced Puppeteer with @react-pdf/renderer for serverless compatibility
   - **Status**: Tech stack updated in Section 3.2 and finalized decisions in Section 18

### Data Integrity Enhancements

9. **Score Range Validation**
   - **Issue**: No validation that scores remain within 0-100 range
   - **Fix Applied**: Added score range validation requirement (clamp to 0-100)
   - **Status**: Input validation section updated in Section 10.4

10. **Database Indexes**
    - **Issue**: Indexes present but not explicitly documented for all frequently queried fields
    - **Fix Applied**: Confirmed indexes on userId, businessCategoryId, status in Report model
    - **Status**: Schema already includes indexes in Section 4.2

### User Experience Improvements

11. **Loading States**
    - **Issue**: No loading state requirements specified
    - **Fix Applied**: Added loading states requirement for all API calls
    - **Status**: Frontend architecture updated in Section 8.2

12. **Error Handling**
    - **Issue**: No user-friendly error message requirements
    - **Fix Applied**: Added error handling requirement with user-friendly messages
    - **Status**: Frontend architecture updated in Section 8.2

13. **Error Boundaries**
    - **Issue**: No error boundary component specified
    - **Fix Applied**: Added React Error Boundary component requirement
    - **Status**: Frontend architecture updated in Section 8.2

14. **Form Validation**
    - **Issue**: Form validation requirements not explicitly stated
    - **Fix Applied**: Added React Hook Form + Zod validation requirement
    - **Status**: Input validation section updated in Section 10.4

### Technical Debt Prevention

15. **Environment Variable Validation**
    - **Issue**: No validation for required environment variables
    - **Fix Applied**: Added environment variable validation requirement on startup
    - **Status**: Configuration section updated in Section 9.1

16. **CORS Configuration**
    - **Issue**: CORS configuration not explicitly specified
    - **Fix Applied**: Added CORS configuration requirement in next.config.js
    - **Status**: API architecture updated in Section 5.1

17. **Authentication Environment Variables**
    - **Issue**: NEXTAUTH_SECRET and NEXTAUTH_URL not in environment variables list
    - **Fix Applied**: Added NEXTAUTH_SECRET and NEXTAUTH_URL to environment variables
    - **Status**: Configuration section updated in Section 9.1

### Updated Implementation Priority

**Must Implement (Blocking Issues):**
1. Password hashing with bcryptjs
2. Authentication middleware for all /api/v1 routes
3. Zod validation for all API inputs
4. Score range validation (0-100)
5. Environment variable validation
6. CORS configuration

**Should Implement (High Priority):**
7. Loading states for all API calls
8. User-friendly error messages
9. Error Boundary component
10. Form validation with React Hook Form + Zod
11. Pagination for report list

**Nice to Have (Medium Priority):**
12. API response caching (deferred to post-MVP)
13. Advanced error boundaries (deferred to post-MVP)
14. Comprehensive monitoring (deferred to post-MVP)

### Document Synchronization

Both `technical-specification.md` and `development-progress.md` have been updated to reflect these QA findings. The development progress document includes detailed implementation steps for each fix, while this technical specification document includes the architectural requirements and design decisions.

### QA Analysis Date

QA analysis completed: 2026-05-16
QA analysis by: Senior Technical Architect
QA review scope: Security, implementation gaps, data integrity, user experience, technical debt
