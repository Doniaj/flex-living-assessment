# Flex Living – Reviews Dashboard
Developer Assessment Submission

**Live Demo** (fully working)  
https://flex-living-assessment-two.vercel.app

**Critical API Route**
https://flex-living-backend-wheat.vercel.app/api/reviews/hostaway

**Repository**  
https://github.com/Doniaj/flex-living-assessment.git
---

### Scope of Work – All Core Requirements Delivered

| Requirement                                      | Status    | Implementation |
|--------------------------------------------------|-----------|----------------|
| Mocked Hostaway API integration                  | Done      | `GET /api/reviews/hostaway` returns normalized data |
| Parse & normalize real-world JSON                | Done      | Handles `rating: null` → calculates overall from categories |
| Manager Dashboard with filters, sort, trends    | Done      | Property view, rating/date filters, search, charts |
| Toggle reviews for public display                | Done      | Manager can select/deselect individual reviews |
| Public Property Page shows only selected reviews | Done      | Matches current Flex Living design exactly |
| Clean, modern, product-minded UI                 | Done      | Fully responsive + branded |
| Full-stack deployed on Vercel                    | Done      | Frontend + backend live and connected |

**Bonus – Google Reviews**  
Implemented real Google Reviews using Outscraper API (no billing, no place_id needed)

---

### Tech Stack

**Frontend** (`/frontend`)
- React + Vite
- Tailwind CSS
- Axios
- React Router
- Lucide icons
- Recharts

**Backend** (`/backend`)
- Node.js + Express
- CORS properly configured
- Clean normalization logic
- Real Outscraper Google Reviews integration

---

### Key Engineering Decisions

- **Smart rating calculation**: When `rating` is `null` → average of cleanliness, communication, respect_house_rules
- **Normalized structure** includes: `overallRating`, `isSelected` flag, clean `date`, `source`
- **Review selection** works instantly in the UI (in-memory state)  
- **Real Google Reviews** via Outscraper API  
  → Graceful fallback to mock data if key missing  
  → No Google Cloud billing or place_id required

---

### API Route – GET /api/reviews/hostaway

**Live & working**:  
https://flex-living-backend-wheat.vercel.app/api/reviews/hostaway

**Normalized Response Example**:
```json
{
  "id": 7453,
  "listingName": "2B N1 A - 29 Shoreditch Heights",
  "guestName": "Shane Finkelstein",
  "type": "host-to-guest",
  "overallRating": 10,
  "reviewText": "Shane and family are wonderful! Would definitely host again :)",
  "categoryRatings": {
    "cleanliness": 10,
    "communication": 10,
    "respect_house_rules": 10
  },
  "date": "2020-08-21",
  "isSelected": false
}