# Software Requirements Specification

# Nearby Business Feasibility & Location Intelligence Platform

## Document control

| Field | Value |
| --- | --- |
| Document type | Software Requirements Specification |
| Product name | Nearby Business Feasibility & Location Intelligence Platform |
| Short name | Nearby Report |
| Version | 1.0 |
| Status | Initial implementation-ready specification |
| Primary audience | Product managers, designers, engineers, AI coding agents, QA, future stakeholders |
| MVP scope | Single-location feasibility reports for Cafe, Pharmacy, and Salon |

---

## 1. Executive summary

Nearby Report is a location intelligence and feasibility report platform for offline business planning.

The system allows a user to select a business type, choose a location, define an analysis radius, optionally provide business and financial context, and generate a structured feasibility report. The report analyzes nearby competitors, demand signals, accessibility indicators, business-category fit, risks, opportunities, and confidence level.

The product is a decision-support report engine. It must not claim to predict business success, revenue, profit, exact footfall, legal suitability, or guaranteed outcomes.

### Core MVP promise

```txt
Business type + location + radius → competitors + demand signals + explainable scores + risks + opportunities + survey checklist + PDF report
```

### Product positioning

Preferred positioning:

```txt
Know the market before you open your shop.
```

Alternative positioning:

```txt
Analyze nearby competition, demand, and risks before investing in a physical business location.
```

Do not position the product as:

```txt
AI predicts your business success.
```

---

## 2. Product goals

## 2.1 Primary goals

- Help users evaluate whether a selected location is suitable for a selected offline business type.
- Provide an explainable, data-backed feasibility report.
- Reduce location-selection risk by identifying competition, demand signals, accessibility issues, and missing validation items.
- Generate professional reports that users can save, download, and share.
- Build a configurable report engine that supports future categories and advanced analysis.

## 2.2 MVP goals

The MVP must answer one main question:

```txt
Is this selected location suitable for this selected business type based on available signals?
```

The MVP must support:

- Cafe
- Pharmacy
- Salon

The MVP must focus on:

- Serious first-time business owners
- Small business consultants

## 2.3 Non-goals for MVP

The MVP must not include:

- Exact revenue prediction
- Guaranteed success/failure prediction
- Exact footfall count
- Legal approval or licensing guidance
- Loan, investment, or financial advice
- Complex machine learning model
- Full consultant dashboard
- Franchise-specific suitability engine
- City-wide heatmaps
- Real-time footfall tracking
- Full B2B analytics dashboard

---

## 3. User personas

## 3.1 First-time business owner

A person planning to open a physical business for the first time.

### Examples

- Cafe
- Pharmacy
- Salon
- Grocery store
- Bakery
- Gym
- Mobile accessories shop

### Primary question

```txt
Is this location good for my business?
```

### Needs

- Simple report language
- Clear score
- Risks and opportunities
- Physical survey checklist
- Shareable PDF

## 3.2 Small business consultant

A person who advises clients opening shops or local businesses.

### Primary question

```txt
Can I generate a professional location report for my client?
```

### Needs

- Multiple reports
- Professional PDF
- Saved report history
- Repeat usage
- Future white-label support

## 3.3 Franchise buyer

A person considering a franchise investment.

### Primary question

```txt
Is this location suitable for this franchise model?
```

### MVP status

Future persona. The MVP should not build franchise-specific workflows, but architecture should not block future support.

## 3.4 Real estate broker

A person trying to show business suitability of a property.

### MVP status

Future persona. The MVP may be useful to brokers but should not optimize specifically for broker workflows.

## 3.5 Retail brand or expansion team

A team evaluating multiple locations for expansion.

### MVP status

Future B2B persona. Requires multi-location comparison, dashboards, exports, and collaboration.

---

## 4. Scope

## 4.1 MVP in scope

The MVP must include:

- User account basics
- Business category selection
- Business model selection/input
- Location search
- Map pin selection or adjustment
- Radius selection
- Optional financial inputs
- Nearby POI discovery
- POI normalization
- Competitor classification
- Demand signal classification
- Category-specific rule-based scoring
- Final feasibility score
- Risk score or risk level
- Confidence score or confidence level
- AI-generated report summary grounded in structured data
- Opportunity analysis
- Risk analysis
- Recommended next steps
- Physical survey checklist
- Report dashboard
- Report history
- PDF export
- Disclaimer

## 4.2 MVP out of scope

The MVP must not include:

- Exact sales, profit, or revenue predictions
- Guaranteed recommendation to open or not open
- Exact rent estimation from external sources
- Exact customer footfall measurement
- Review sentiment analysis
- Multi-location comparison
- Reverse business recommendation
- Full consultant dashboard
- White-label reports
- Payment or subscription system unless separately prioritized
- Manual survey score recalculation unless separately prioritized
- Franchise package
- B2B dashboard

## 4.3 Future scope

Future phases may include:

- Competitor review sentiment analysis
- Multi-location comparison
- Financial feasibility scenario calculator
- Manual survey assistant
- Reverse business recommendation
- Consultant dashboard
- Franchise suitability report
- B2B location intelligence platform
- White-label reports
- Shareable public report links
- Local-language reports

---

## 5. Key definitions

| Term | Definition |
| --- | --- |
| Business category | A supported business type such as Cafe, Pharmacy, or Salon. |
| Business model | The operating model selected by the user, such as takeaway cafe or premium salon. |
| POI | Point of Interest. Any nearby place returned from a location data source. |
| Direct competitor | A nearby business that closely matches the selected business category. |
| Indirect competitor | A nearby business that partially overlaps with customer need or category. |
| Substitute competitor | A nearby business that can satisfy a similar customer intent through a different format. |
| Demand signal | A nearby place or area type that may generate relevant customer demand. |
| Accessibility signal | A nearby indicator related to ease of reaching the location. |
| Score parameter | An explainable scoring factor used to calculate report scores. |
| Confidence level | System estimate of how reliable the report is based on data availability and completeness. |
| Feasibility score | Final 0 to 100 decision-support score based on weighted parameters. |

---

## 6. High-level user journey

1. User signs in or continues through the allowed MVP account flow.
2. User selects a business category.
3. User enters or searches a location.
4. User selects or adjusts a map pin.
5. User selects radius.
6. User selects business model.
7. User optionally enters financial and operational context.
8. System resolves location into structured geospatial data.
9. System collects nearby POIs from configured data sources.
10. System normalizes POIs into internal categories.
11. System classifies POIs into competitors, demand signals, accessibility signals, supporting ecosystem, and irrelevant places.
12. System calculates category-specific explainable scores.
13. System generates risks, opportunities, recommendation wording, and survey checklist.
14. AI generates business-friendly report text using only structured analysis data.
15. User views dashboard.
16. User downloads PDF.
17. User can view saved report later.

---

## 7. System architecture

## 7.1 Conceptual architecture

```txt
Frontend Application
        ↓
User Input Service
        ↓
Location Resolver
        ↓
POI Data Collector
        ↓
POI Normalization Service
        ↓
Category Mapping Engine
        ↓
Competitor Classification Engine
        ↓
Demand Signal Engine
        ↓
Scoring Engine
        ↓
AI Report Generator
        ↓
Report Storage
        ↓
Dashboard + PDF Export
```

## 7.2 Recommended implementation architecture

The system should be built as a modular report engine.

### Recommended stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS
- Backend: Next.js API routes or separate Node.js service
- Database: PostgreSQL with PostGIS
- ORM: Prisma or Drizzle
- Maps: Google Maps, Mapbox, or equivalent provider
- POI data: Google Places, OpenStreetMap, Foursquare, or equivalent provider
- Charts: Recharts or equivalent
- PDF generation: Server-side or browser-safe PDF generation library
- Queue: Redis-backed queue for long-running report generation if needed
- AI: LLM API using structured JSON input and strict output constraints

### Architecture requirement

Business-category mapping, scoring weights, competitor classifications, demand signal mappings, and checklist rules must be configurable. They must not be hardcoded throughout UI components.

---

## 8. Core modules

## 8.1 User Input Module

### Responsibility

Collect user-provided report inputs.

### Required fields

- Business category
- Location
- Radius

### Optional fields

- Business model
- Expected rent
- Shop size
- Setup budget
- Monthly staff cost
- Inventory cost
- Investment range
- Target audience
- Preferred customer segment

### Output

A validated report creation request.

## 8.2 Location Resolver

### Responsibility

Convert a user-entered location or map pin into structured geospatial data.

### Output fields

- Latitude
- Longitude
- Formatted address
- Locality
- City
- State
- Country
- Postal code, if available
- Source provider
- Source confidence, if available

### Requirements

- Must support address search.
- Must support landmark or area search where provider supports it.
- Must support manual pin adjustment.
- Must store final selected coordinates.

## 8.3 POI Data Collector

### Responsibility

Fetch nearby places within selected radius based on category-specific query configuration.

### POI fields to collect when available

- Source
- Source place ID
- Name
- Original category/types
- Latitude
- Longitude
- Address
- Rating
- Review count
- Opening status
- Price level, if available
- Website, if available
- Phone number, if available
- Metadata

### Requirements

- Must support partial data.
- Must not fail full report if one POI query fails.
- Must record provider/source for traceability.
- Must avoid duplicate POIs where possible.

## 8.4 POI Normalization Service

### Responsibility

Convert provider-specific place types into internal normalized categories.

### Example

```txt
Provider type: beauty_salon
Normalized category: salon
```

### Requirements

- Must preserve original provider category.
- Must store normalized category.
- Must allow future category mapping updates.

## 8.5 Category Mapping Engine

### Responsibility

Map supported business categories to external API query categories, competitor rules, demand-signal rules, and scoring rules.

### MVP category configuration

#### Cafe

External categories may include:

- cafe
- coffee_shop
- bakery
- restaurant
- dessert_shop
- tea_shop

Demand signal categories may include:

- college
- university
- office
- coworking_space
- hostel
- shopping_mall
- transit_station
- bus_station
- commercial_area

#### Pharmacy

External categories may include:

- pharmacy
- drugstore
- clinic
- hospital
- doctor

Demand signal categories may include:

- hospital
- clinic
- diagnostic_lab
- doctor
- residential_area
- nursing_home
- elderly_care

#### Salon

External categories may include:

- beauty_salon
- hair_care
- spa
- barber_shop

Demand signal categories may include:

- apartment
- residential_area
- premium_residential_area
- hostel
- shopping_area
- gym

## 8.6 Competitor Classification Engine

### Responsibility

Classify relevant POIs as:

- Direct competitor
- Indirect competitor
- Substitute competitor
- Non-competitor

### Example for cafe

| Place type | Classification |
| --- | --- |
| Coffee shop | Direct competitor |
| Cafe | Direct competitor |
| Bakery | Indirect competitor |
| Restaurant | Substitute competitor |
| Pharmacy | Non-competitor |

### Requirements

- Must use category-specific rules.
- Must store classification reason.
- Must calculate threat level for every competitor.

## 8.7 Competitor Threat Engine

### Responsibility

Calculate competitor threat level.

### Threat levels

- Low
- Medium
- High

### Factors

- Distance from selected location
- Directness of category
- Rating
- Review count
- Brand/franchise signal if available
- Opening status if available

### Example rule

A direct competitor within 200 meters with rating above 4.4 and more than 500 reviews should usually be marked high threat.

### Requirement

Threat labels must be explainable and traceable to input factors.

## 8.8 Demand Signal Engine

### Responsibility

Identify nearby demand generators relevant to the selected business category.

### Requirements

- Must count demand signals by category.
- Must calculate distance from selected location.
- Must store explanation for why each signal matters.
- Must support category-specific demand signal weights.

## 8.9 Accessibility Analysis Engine

### Responsibility

Analyze accessibility indicators using available POI/location signals.

### Potential indicators

- Public transport proximity
- Main road proximity if available
- Commercial area density
- Nearby landmark density
- Walkability proxy
- Parking requirement manual check
- Visibility manual check

### MVP limitation

Parking, visibility, actual road quality, and actual walk-in footfall usually require physical verification. The report must clearly mark these as manual survey items unless reliable data exists.

## 8.10 Scoring Engine

### Responsibility

Calculate explainable scores.

### Required scores

- Competition score
- Demand score
- Accessibility score
- Area fit score
- Financial pressure score when financial data is provided
- Risk score or risk level
- Confidence score or confidence level
- Final feasibility score

### Requirement

Scores must be rule-based for MVP and traceable to score parameters.

## 8.11 AI Report Generator

### Responsibility

Convert structured analysis data into business-friendly report text.

### Critical AI rule

```txt
Use only the structured data provided. If any data is missing or uncertain, clearly mention that manual validation is required. Do not invent facts, numbers, competitors, rent values, footfall, revenue, or guaranteed outcomes.
```

### AI can generate

- Executive summary
- Risk explanation
- Opportunity explanation
- Business model recommendation
- Survey checklist explanation
- Final recommendation wording
- PDF-friendly section text

### AI must not generate

- Fake competitor names
- Fake rent values
- Exact revenue predictions
- Exact footfall numbers
- Guaranteed success claims
- Legal approval claims
- Investment advice

## 8.12 Report Dashboard

### Responsibility

Display report results in the web application.

### Dashboard sections

- Executive summary
- Final feasibility score
- Score cards
- Score breakdown
- Map view
- Competitor table
- Demand signal table
- Accessibility analysis
- Opportunities
- Risks
- Recommended business model
- Confidence level
- Missing data warnings
- Survey checklist
- Disclaimer

## 8.13 PDF Report Generator

### Responsibility

Generate downloadable report PDF.

### Required PDF sections

1. Cover page
2. Executive summary
3. Selected business and location
4. Final feasibility score
5. Score breakdown
6. Competitor analysis
7. Demand signal analysis
8. Accessibility analysis
9. Risks
10. Opportunities
11. Recommended business model
12. Manual survey checklist
13. Disclaimer

### PDF metadata

- Report ID
- Generated date
- Business category
- Location
- Radius

---

## 9. Functional requirements

## FR-001 Business category selection

The system shall allow the user to select one supported business category.

### MVP categories

- Cafe
- Pharmacy
- Salon

### Acceptance criteria

- User can select exactly one category.
- System loads category-specific business models.
- System loads category-specific competitor mapping.
- System loads category-specific demand signal mapping.
- System loads category-specific scoring weights.

## FR-002 Business model selection

The system shall allow the user to select or enter a business model.

### Cafe models

- Takeaway
- Dine-in
- Premium cafe
- Budget cafe
- Kiosk
- Cloud kitchen

### Pharmacy models

- Regular pharmacy
- 24/7 pharmacy
- Pharmacy plus medical supplies
- Pharmacy near clinic or hospital

### Salon models

- Budget salon
- Premium salon
- Unisex salon
- Women-only salon
- Barber shop

### Acceptance criteria

- User can select a model from category-specific options.
- Report considers selected model in risks and recommendations.
- If the selected model appears risky based on available signals, report explains why.

## FR-003 Location search and selection

The system shall allow the user to search and select a location.

### Supported methods

- Area search
- Address search
- Landmark search
- Map pin selection
- Manual pin adjustment

### Acceptance criteria

- User can search and select a location.
- User can adjust selected pin.
- System stores final latitude and longitude.
- System displays selected location on a map.
- Report displays formatted address or selected location label.

## FR-004 Radius selection

The system shall allow the user to select analysis radius.

### MVP radius options

- 500 meters
- 1 km
- 2 km
- 3 km

### Acceptance criteria

- User can select one radius.
- System fetches data within selected radius.
- Report clearly shows selected radius.
- Scores are calculated using selected radius.

## FR-005 Optional financial inputs

The system shall allow users to enter optional financial information.

### Optional fields

- Expected rent
- Shop size
- Setup budget
- Monthly staff cost
- Inventory cost
- Expected investment range

### Acceptance criteria

- User can skip all financial fields.
- If financial fields are skipped, report states financial feasibility requires manual validation.
- If financial fields are provided, report includes basic financial pressure analysis.
- System must not generate exact profitability claims.

## FR-006 Report creation

The system shall create a report record after valid required inputs are submitted.

### Acceptance criteria

- Report has a unique ID.
- Report stores input parameters.
- Report status is tracked.
- User can return to the report later.

## FR-007 Nearby POI discovery

The system shall fetch nearby POIs related to the selected category and demand-signal configuration.

### Acceptance criteria

- System fetches competitor POIs.
- System fetches demand-signal POIs.
- System stores source provider.
- System stores distance from selected location.
- System handles missing rating/review data.
- System supports partial results when provider data is incomplete.

## FR-008 Competitor classification

The system shall classify relevant POIs into competitor classifications.

### Acceptance criteria

- System identifies direct competitors.
- System identifies indirect competitors.
- System identifies substitute competitors where rules exist.
- System excludes or marks non-competitors.
- Every classification includes a classification reason.

## FR-009 Competitor threat level

The system shall calculate threat level for each competitor.

### Acceptance criteria

- Every direct, indirect, and substitute competitor has a threat level.
- Threat level is Low, Medium, or High.
- Threat level explanation is stored.
- Report summarizes high-threat competitors.

## FR-010 Demand signal discovery

The system shall identify demand generators near the selected location.

### Acceptance criteria

- System identifies demand signals relevant to the selected category.
- System shows signal count by type.
- System shows distance where available.
- Report explains why each signal type matters.

## FR-011 Accessibility analysis

The system shall analyze accessibility indicators from available data.

### Acceptance criteria

- Report includes accessibility score.
- Report identifies which accessibility signals were inferred.
- Report marks parking and visibility as manual checks unless reliable data exists.
- Survey checklist includes accessibility validation tasks.

## FR-012 Scoring engine

The system shall calculate score parameters and aggregate scores.

### Acceptance criteria

- Competition score is calculated.
- Demand score is calculated.
- Accessibility score is calculated.
- Area fit score is calculated.
- Financial pressure score is calculated when applicable.
- Risk score or risk level is calculated.
- Confidence score or confidence level is calculated.
- Final feasibility score is calculated.
- Every score has a stored explanation.

## FR-013 Final feasibility score

The system shall calculate a final score from 0 to 100.

### Interpretation

| Score range | Meaning | Allowed wording |
| --- | --- | --- |
| 80-100 | Strong potential | Strong potential based on available signals |
| 65-79 | Good potential with some risks | Potentially suitable with some risks |
| 50-64 | Mixed potential | Needs deeper validation |
| 35-49 | Risky location | High risk based on available signals |
| 0-34 | Weak fit | Not recommended based on available signals |

### Acceptance criteria

- Final score is visible in dashboard.
- Final score appears in PDF.
- Recommendation is carefully worded.
- Disclaimer appears near or within report.

## FR-014 Confidence score

The system shall calculate report confidence.

### Confidence levels

- Low
- Medium
- High

### Confidence factors

- Number of POIs found
- Number of relevant competitors found
- Availability of rating and review data
- Location resolution quality
- Availability of demand signals
- Availability of financial inputs
- API/provider data completeness
- Manual survey completion status, when available

### Acceptance criteria

- Every report shows confidence level.
- Report explains confidence level.
- Missing or weak data is clearly highlighted.

## FR-015 AI-generated report summary

The system shall generate human-friendly report sections using structured analysis data.

### Acceptance criteria

- AI output is based only on provided structured data.
- Missing data is explicitly mentioned.
- AI does not invent names, numbers, rent, footfall, revenue, or facts.
- AI does not make guaranteed success claims.
- AI output uses simple business-friendly language.

## FR-016 Opportunity analysis

The system shall generate opportunities from structured signals.

### Acceptance criteria

- Opportunities are tied to demand signals, competitor gaps, accessibility, or business model fit.
- Each opportunity is explainable.
- AI may phrase opportunities but must not invent supporting data.

## FR-017 Risk analysis

The system shall generate risks from structured signals.

### Acceptance criteria

- Risks include competition, low demand, poor accessibility, low confidence, or missing validation where relevant.
- Risks are explainable.
- Report clearly distinguishes known risk from unverified risk.

## FR-018 Survey checklist

The system shall generate a physical survey checklist.

### Required checklist areas

- Visit at different times of day
- Count approximate pedestrian movement manually
- Observe competitor crowd
- Check parking
- Check visibility
- Verify rent and deposit
- Speak to nearby shop owners where appropriate
- Validate delivery activity if relevant
- Validate public transport and access

### Acceptance criteria

- Checklist is category-aware.
- Checklist appears in dashboard.
- Checklist appears in PDF.

## FR-019 Report dashboard

The system shall display completed reports in a dashboard view.

### Acceptance criteria

- Dashboard shows input summary.
- Dashboard shows score summary.
- Dashboard shows competitor analysis.
- Dashboard shows demand signal analysis.
- Dashboard shows risks and opportunities.
- Dashboard shows survey checklist.
- Dashboard shows disclaimer.

## FR-020 PDF export

The system shall allow the user to download a PDF report.

### Acceptance criteria

- User can download PDF.
- PDF includes report ID and generated date.
- PDF includes required report sections.
- PDF is readable for non-technical users.
- PDF includes disclaimer.

## FR-021 Report history

The system shall allow users to view saved reports.

### Acceptance criteria

- User can see previously generated reports.
- User can open report detail page.
- User can download PDF again if available.
- Users cannot access other users' private reports.

## FR-022 Basic user account

The system shall support basic user accounts.

### Acceptance criteria

- User can sign up or sign in.
- Reports are associated with user account.
- User data is protected.

---

## 10. Scoring requirements

## 10.1 Score parameter format

Every score parameter must follow this structure.

```json
{
  "key": "direct_competitor_density",
  "label": "Direct Competitor Density",
  "rawValue": "14 direct competitors within 1 km",
  "score": 58,
  "weight": 0.25,
  "impact": "negative",
  "confidence": "medium",
  "explanation": "There are many direct competitors nearby, which increases customer acquisition difficulty."
}
```

### Required fields

- key
- label
- rawValue
- score
- weight
- impact
- confidence
- explanation

### Field rules

- `score` must be 0 to 100.
- `weight` must be 0 to 1.
- `impact` must be positive, negative, or neutral.
- `confidence` must be low, medium, or high.
- `explanation` must be human-readable.

## 10.2 Aggregation rule

Each category score should be calculated as a weighted average of score parameters.

```txt
weightedScore = sum(parameter.score * parameter.weight) / sum(parameter.weight)
```

Final feasibility score should be calculated from major score groups using category-specific weights.

## 10.3 Risk score rule

Risk should be represented as Low, Medium, or High. Internally, a numeric risk score may be used.

Suggested mapping:

| Numeric risk score | Risk level |
| --- | --- |
| 0-34 | Low |
| 35-64 | Medium |
| 65-100 | High |

Risk score direction must be clear: higher risk score means more risk.

## 10.4 Confidence rule

Confidence may be numeric internally but must be displayed as Low, Medium, or High.

Suggested mapping:

| Confidence score | Confidence level |
| --- | --- |
| 0-49 | Low |
| 50-74 | Medium |
| 75-100 | High |

## 10.5 Cafe scoring model

| Parameter group | Weight |
| --- | ---: |
| Demand generators | 0.30 |
| Competition density | 0.25 |
| Accessibility | 0.20 |
| Competitor quality gap | 0.15 |
| Financial pressure | 0.10 |

### Important cafe signals

- Colleges
- Offices
- PG hostels
- Coworking spaces
- Existing cafes
- Bakeries
- Restaurants
- Transport access
- Evening crowd potential
- Takeaway or delivery potential

## 10.6 Pharmacy scoring model

| Parameter group | Weight |
| --- | ---: |
| Healthcare proximity | 0.30 |
| Residential demand | 0.25 |
| Competition density | 0.20 |
| Accessibility | 0.15 |
| Financial pressure | 0.10 |

### Important pharmacy signals

- Hospitals
- Clinics
- Diagnostic labs
- Residential areas
- Elderly-care centers
- Existing pharmacies
- Main road access
- 24/7 demand possibility

## 10.7 Salon scoring model

| Parameter group | Weight |
| --- | ---: |
| Residential demand | 0.30 |
| Competitor quality gap | 0.25 |
| Competition density | 0.20 |
| Accessibility | 0.15 |
| Financial pressure | 0.10 |

### Important salon signals

- Apartments
- Residential clusters
- Premium localities
- Existing salons
- Reviews and ratings
- Repeat customer potential
- Parking and accessibility
- Customer profile fit

## 10.8 Missing financial data rule

If financial data is not provided:

- Financial pressure score should not pretend to be precise.
- The scoring engine may assign a neutral score with low confidence or exclude financial pressure and re-normalize weights.
- The report must state financial feasibility requires manual validation.

Recommended MVP approach:

```txt
If financial inputs are missing, exclude financial pressure from final weighted score and lower confidence.
```

---

## 11. Report structure

Every completed report must follow this structure.

## 11.1 Executive summary

Briefly explain:

- Business type
- Location
- Radius
- Overall feasibility
- Main opportunity
- Main risk
- Recommended next step

## 11.2 Input summary

Show:

- Business type
- Location
- Radius
- Business model
- Optional financial inputs if provided
- Report generated date

## 11.3 Score summary

Show:

| Score type | Example |
| --- | ---: |
| Final feasibility | 72/100 |
| Demand | 82/100 |
| Competition | 58/100 |
| Accessibility | 76/100 |
| Area fit | 74/100 |
| Risk | Medium |
| Confidence | Medium |

## 11.4 Competitor analysis

Show:

- Total direct competitors
- Total indirect competitors
- Total substitute competitors
- High-threat competitors
- Average rating where available
- Average review count where available
- Closest competitors
- Competitor density

## 11.5 Demand signal analysis

Show demand signals relevant to selected category, such as:

- Offices
- Colleges
- Hospitals
- Clinics
- Apartments
- Residential clusters
- Transport points
- Commercial activity indicators

## 11.6 Accessibility analysis

Show:

- Transport access
- Main road proximity if available
- Walkability proxy if available
- Parking needs manual check
- Visibility needs manual check

## 11.7 Opportunity analysis

Explain opportunities supported by structured data.

## 11.8 Risk analysis

Explain risks supported by structured data or missing-data warnings.

## 11.9 Recommended business model

Show:

- Recommended model options
- Less suitable model options
- Reasoning

## 11.10 Survey checklist

Show physical validation tasks.

## 11.11 Disclaimer

Required wording:

```txt
This report is based on available location and nearby place data. It is intended for decision support only and does not guarantee business success, revenue, profitability, footfall, legal approval, or investment outcomes. Users should conduct physical surveys, financial planning, and professional consultation before making investment decisions.
```

---

## 12. Data model requirements

## 12.1 User

Stores user account details.

### Fields

- id
- name
- email
- role
- plan
- createdAt
- updatedAt

## 12.2 BusinessCategory

Stores supported business types and configuration.

### Fields

- id
- name
- description
- supportedModels
- scoringConfig
- competitorMappings
- demandSignalMappings
- surveyChecklistConfig
- createdAt
- updatedAt

## 12.3 Report

Stores generated reports.

### Fields

- id
- userId
- businessCategoryId
- locationName
- formattedAddress
- latitude
- longitude
- radiusMeters
- businessModel
- inputParameters
- status
- finalScore
- riskLevel
- confidenceLevel
- recommendation
- generatedAt
- createdAt
- updatedAt

## 12.4 POI

Stores normalized nearby place data.

### Fields

- id
- source
- sourcePlaceId
- name
- originalCategory
- normalizedCategory
- latitude
- longitude
- address
- rating
- reviewCount
- openingStatus
- priceLevel
- metadata
- createdAt
- updatedAt

## 12.5 ReportPOI

Connects POIs to reports.

### Fields

- id
- reportId
- poiId
- distanceMeters
- classification
- threatLevel
- relevanceScore
- classificationReason
- threatReason
- createdAt

## 12.6 ScoreParameter

Stores report scoring breakdown.

### Fields

- id
- reportId
- scoreGroup
- key
- label
- rawValue
- score
- weight
- impact
- confidence
- explanation
- createdAt

## 12.7 ReportSection

Stores generated report content.

### Fields

- id
- reportId
- sectionType
- title
- content
- order
- generationSource
- createdAt

## 12.8 SurveyChecklist

Stores generated survey steps.

### Fields

- id
- reportId
- checklistItems
- createdAt
- updatedAt

## 12.9 SurveyResponse

Stores user physical survey answers for future versions.

### Fields

- id
- reportId
- responses
- updatedScore
- notes
- createdAt
- updatedAt

---

## 13. API and service requirements

## 13.1 Suggested API endpoints

These endpoint names are recommendations and may be adjusted to match framework conventions.

### Authentication

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/me`

### Business categories

- `GET /api/business-categories`
- `GET /api/business-categories/:id`

### Location

- `GET /api/locations/search?query=`
- `GET /api/locations/reverse-geocode?lat=&lng=`

### Reports

- `POST /api/reports`
- `GET /api/reports`
- `GET /api/reports/:id`
- `POST /api/reports/:id/generate`
- `GET /api/reports/:id/pdf`

### Internal report pipeline

- `POST /api/reports/:id/collect-pois`
- `POST /api/reports/:id/classify`
- `POST /api/reports/:id/score`
- `POST /api/reports/:id/generate-ai-summary`

## 13.2 Report status lifecycle

A report should use clear statuses.

Suggested statuses:

- draft
- collecting_data
- classifying
- scoring
- generating_summary
- completed
- completed_with_warnings
- failed

## 13.3 Error handling requirements

- If location resolution fails, user must choose another location or adjust pin.
- If POI provider fails, report may continue with partial data if at least one source succeeds.
- If AI generation fails, raw scores and structured analysis must still be available.
- If PDF generation fails, report dashboard must still be available.
- All partial reports must show clear warnings.

---

## 14. AI behavior specification

## 14.1 AI input

AI must receive structured JSON containing only verified or computed data.

Example AI input categories:

- User inputs
- Location details
- Radius
- Competitor summary
- Demand signal summary
- Scores
- Score parameters
- Risks
- Opportunities
- Missing data
- Confidence explanation

## 14.2 AI output

AI should return structured JSON, not free-form unstructured text.

Recommended sections:

```json
{
  "executiveSummary": "...",
  "opportunities": ["..."],
  "risks": ["..."],
  "recommendedBusinessModel": {
    "recommended": ["..."],
    "lessSuitable": ["..."],
    "explanation": "..."
  },
  "surveyChecklistExplanation": "...",
  "finalRecommendation": "..."
}
```

## 14.3 AI guardrails

The AI must not:

- Invent POIs
- Invent ratings or reviews
- Invent rent data
- Invent revenue, profit, or footfall
- Claim legal approval
- Claim guaranteed success
- Make investment advice
- Hide missing data

## 14.4 AI validation

The application should validate AI output before saving.

Validation should check:

- Required fields exist.
- Text does not contain prohibited guarantee language.
- Output is parseable.
- Output references only available data where possible.

---

## 15. Non-functional requirements

## 15.1 Performance

- Location search should feel interactive.
- Basic report generation should complete within an acceptable user wait time.
- Long-running report generation should support background processing.
- Cached provider results should be used where allowed by provider terms.
- Map interactions should remain smooth.

## 15.2 Reliability

- Optional data missing must not crash report generation.
- AI failure must not block raw score display.
- PDF failure must not delete or corrupt report.
- External API failure must produce clear warnings.

## 15.3 Security

- API keys must be stored securely in environment variables or secret manager.
- User reports must not be publicly accessible unless a share feature is explicitly implemented.
- Users must not access reports owned by other users.
- Payment data, if added later, must be handled by a trusted payment provider.
- Sensitive logs must not expose API keys or private user data.

## 15.4 Privacy

- Location/report data should be treated as user data.
- The system should clearly define whether reports are private by default.
- If analytics are used, they should avoid storing unnecessary sensitive personal data.

## 15.5 Scalability

- POI data should be normalized.
- Database should support geospatial queries.
- Report generation pipeline should be modular.
- Queue-based processing should be introduced if synchronous generation becomes slow.
- Caching should reduce repeated API calls.

## 15.6 Explainability

- Every score must have explanation.
- Every recommendation must be traceable to data.
- Missing data must be visible.
- Confidence level must be explained.

## 15.7 Legal safety

- Report must include disclaimer.
- Product language must avoid guarantees.
- Financial calculations must be framed as estimates or scenarios.
- Users must be encouraged to conduct physical survey and professional consultation.

## 15.8 Accessibility

- UI should be usable with keyboard navigation.
- Score colors should not be the only way to communicate status.
- PDF should use readable fonts and adequate contrast.

---

## 16. Data source requirements and assumptions

## 16.1 Supported data source types

The MVP may use one or more of:

- Google Places
- OpenStreetMap
- Mapbox
- Foursquare
- Internal normalized POI database

## 16.2 Data source constraints

The system must account for:

- Rate limits
- Cost per request
- Terms of service
- Data caching limitations
- Incomplete POI metadata
- Duplicate places across sources
- Inconsistent category names

## 16.3 Required source transparency

Report must show data source or source confidence at least internally. User-facing report should include a clear note such as:

```txt
Analysis is based on available nearby place data from configured location data sources. Some places may be missing or outdated.
```

---

## 17. Validation and QA requirements

## 17.1 Functional QA

Test cases must cover:

- Each MVP business category
- Each radius option
- Location search success
- Location search failure
- Manual pin adjustment
- Missing financial inputs
- Partial POI data
- No competitor found
- High competitor density
- No demand signals found
- AI failure fallback
- PDF generation success
- Report history access
- Unauthorized report access prevention

## 17.2 AI QA

AI output must be tested for:

- No invented competitors
- No invented rent values
- No exact revenue predictions
- No guaranteed success claims
- Proper missing-data disclosure
- Simple business-friendly wording

## 17.3 Scoring QA

Scoring tests must verify:

- Scores remain within 0 to 100.
- Weights aggregate correctly.
- Missing optional data is handled correctly.
- Risk direction is not inverted.
- Confidence decreases when data is weak.

---

## 18. MVP acceptance criteria

The MVP is complete when:

1. User can create an account or use the defined basic account flow.
2. User can select Cafe, Pharmacy, or Salon.
3. User can select a location using search or map pin.
4. User can select radius.
5. User can optionally enter business model and financial context.
6. System creates a report record.
7. System fetches nearby POIs.
8. System normalizes POIs.
9. System classifies competitors and demand signals.
10. System calculates explainable scores.
11. System generates final feasibility score.
12. System generates risk level.
13. System generates confidence level.
14. System generates AI-written business report grounded in structured data.
15. System shows competitor analysis.
16. System shows demand signal analysis.
17. System shows risks and opportunities.
18. System shows physical survey checklist.
19. System includes disclaimer.
20. User can download PDF report.
21. User can view saved reports.

---

## 19. Success metrics

## 19.1 MVP business metrics

- Number of reports generated
- Report flow completion rate
- PDF download rate
- Repeat report generation rate
- Willingness to pay
- Paid conversion if payment is added
- Consultant interest
- Feedback score on report usefulness

## 19.2 Product quality metrics

- Report generation success rate
- External API failure rate
- Average report confidence score
- AI hallucination incidents
- User-reported data accuracy issues
- Average time to generate report
- PDF generation success rate

---

## 20. Development plan

## Sprint 1: Product foundation

### Build

- Business category configuration
- Location search
- Radius selection
- Basic report creation flow
- Database schema

### Deliverable

User can create an empty report with selected business, location, and radius.

## Sprint 2: POI collection and classification

### Build

- Nearby POI fetching
- Category normalization
- Competitor classification
- Demand signal classification

### Deliverable

System can show competitors and demand signals for selected location.

## Sprint 3: Scoring engine

### Build

- Competition score
- Demand score
- Accessibility score
- Confidence score
- Final score

### Deliverable

System can calculate explainable feasibility score.

## Sprint 4: Report dashboard

### Build

- Score cards
- Competitor table
- Demand signal table
- Risk and opportunity sections
- Map visualization

### Deliverable

User can view a complete report dashboard.

## Sprint 5: AI report generation

### Build

- Structured AI prompt
- AI summary generation
- Risk explanation
- Opportunity explanation
- Business model recommendation
- Survey checklist text

### Deliverable

User gets a business-friendly report summary.

## Sprint 6: PDF export and saved reports

### Build

- PDF export
- Report history
- Report detail page
- Disclaimer section

### Deliverable

User can save and download the report.

---

## 21. Identified gaps and corrections added to original requirements

This SRS adds or clarifies the following missing or ambiguous areas from the original PRD.

## 21.1 Authentication boundary

The original PRD required basic user accounts but did not define account behavior. This SRS clarifies that reports must be associated with users and protected from unauthorized access.

## 21.2 Report status lifecycle

The original PRD described a pipeline but did not define report generation states. This SRS adds statuses such as collecting data, scoring, completed, completed with warnings, and failed.

## 21.3 AI output validation

The original PRD specified AI guardrails but did not define output validation. This SRS adds parseable structured output and validation requirements.

## 21.4 Missing financial data behavior

The original PRD made financial fields optional but did not define how scoring should handle missing financial data. This SRS recommends excluding financial pressure from final weighted score and lowering confidence.

## 21.5 Risk score direction

The original PRD listed risk score but did not define whether higher means better or worse. This SRS clarifies that higher risk score means more risk.

## 21.6 Partial failure handling

The original PRD mentioned reliability but did not define concrete behavior. This SRS states that AI, PDF, or POI source failures should not necessarily block the full report.

## 21.7 Data source limitations

The original PRD listed possible sources but did not explicitly require handling rate limits, terms, duplicate POIs, or incomplete metadata. This SRS adds these requirements.

## 21.8 Privacy and authorization

The original PRD included security generally. This SRS explicitly states that reports are private by default and users must not access other users' reports.

## 21.9 QA requirements

The original PRD had acceptance criteria but not a QA checklist. This SRS adds functional, AI, and scoring QA requirements.

## 21.10 Accessibility requirement

The original PRD did not address UI accessibility. This SRS adds baseline accessibility expectations.

## 21.11 Configurability requirement

The original PRD said mappings should be configurable. This SRS makes configurability a system architecture requirement and applies it to scoring, mappings, demand signals, and checklist rules.

---

## 22. Open questions before implementation

These questions should be resolved before or during Sprint 1.

1. Which map and POI provider will be used first?
2. Will the MVP require paid authentication or only basic accounts?
3. Should reports generate synchronously or through a background job?
4. Should PDF generation happen server-side or client-side?
5. Should OpenStreetMap be used as a fallback data source?
6. What countries/cities should the MVP support first?
7. What API usage budget is acceptable per report?
8. Should users be allowed to regenerate reports?
9. Should users manually edit POI classifications in MVP?
10. Should consultant-specific branding be postponed completely or partially included?

---

## 23. Final requirement statement

The product is a location intelligence and feasibility report platform for offline businesses. It allows users to select a business type, location, radius, and optional business context. The system collects nearby place data, classifies direct and indirect competitors, identifies demand signals, calculates category-specific feasibility scores, and generates an AI-assisted report with risks, opportunities, confidence level, and recommended next steps. The MVP will support Cafe, Pharmacy, and Salon categories and will focus on single-location feasibility reports. The system will be designed as a configurable report engine so future features such as multi-location comparison, review sentiment analysis, rent pressure, financial feasibility, manual survey validation, consultant dashboards, franchise suitability, and reverse business recommendations can be added later.
