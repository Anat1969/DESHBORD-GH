---
name: architecture
description: >
  תיעוד טכני של דשבורד אשדוד.
  זרימת נתונים, מבנה ממשק, ותיקיות קבצים.
---

# ארכיטקטורה דשבורד אשדוד

## מבנה תיקיות

```
ashdod-dashboard/
│
├── .claude-plugin/
│   └── plugin.json                  ← מניפסט Cowork
│
├── skills/                          ← מומחים וסוכנים
│   ├── orchestrator/                ← מתזמר ראשי
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── agents.md
│   │       └── compositions.md
│   │
│   ├── red-vision/SKILL.md          ← Six Hats
│   ├── white-research/SKILL.md
│   ├── black-quality/SKILL.md
│   ├── green-innovation/SKILL.md
│   ├── blue-process/SKILL.md
│   ├── yellow-value/SKILL.md
│   │
│   └── [מומחים חדשים]              ← אשדוד
│       ├── urban-economics-expert/SKILL.md
│       ├── ashdod-dashboard-analyzer/SKILL.md
│       ├── data-integration-engine/SKILL.md
│       └── insights-engine/SKILL.md
│
├── agents/                          ← Claude Code agents
│   ├── red-vision.md
│   ├── white-research.md
│   ├── black-quality.md
│   ├── green-innovation.md
│   ├── blue-process.md
│   └── yellow-value.md
│
├── app/                             ← פרונט-אנד React
│   ├── dashboard.jsx                ← הממשק הראשי
│   ├── components/
│   │   ├── KPICards.jsx
│   │   ├── BarChart.jsx
│   │   ├── DoughnutChart.jsx
│   │   ├── GeoMap.jsx
│   │   └── Sidebar.jsx
│   │
│   └── styles/
│       └── dashboard.css
│
├── data/                            ← נתונים וחוקים
│   ├── neighborhoods.json           ← רשימת שכונות מוכרות
│   ├── categories.json              ← קטגוריות עסקים
│   ├── raw/
│   │   └── ashdod-data-[date].xlsx  ← Excel גולמי
│   │
│   └── processed/
│       └── ashdod-data-[date].json  ← נתונים מעובדים
│
├── scripts/
│   ├── sync-daily.js                ← סינכרוניזציה יומית
│   ├── validate-excel.js            ← בדיקת תקינות Excel
│   └── export-report.js             ← ייצור דוחות PDF
│
├── docs/                            ← תיעוד
│   ├── ARCHITECTURE.md              ← קובץ זה
│   ├── CLAUDE.md                    ← Claude Code Integration
│   ├── API.md                       ← תיעוד API
│   └── USAGE.md                     ← הנחיות שימוש
│
├── tests/                           ← בדיקות
│   ├── data-validation.test.js
│   ├── dashboard-components.test.js
│   └── integration.test.js
│
├── README.md                        ← קובץ בסיס
├── ASHDOD-DASHBOARD-CLAUDE.md       ← Integration מלא
└── package.json                     ← Dependencies
```

---

## זרימת נתונים (Data Flow)

### 1. קלט: Excel (יומי)

**מקור:** משתמש מעלה `ashdod-data-2024-06-08.xlsx`

**מבנה Excel:**
```
Sheet "נתונים עסקים":
┌─────────────────────────────────────────────────┐
│ שכונה | קטגוריה | כמות עסקים | הכנסות | מצב      │
├─────────────────────────────────────────────────┤
│ מרכז | סחורות | 350 | 95 | פעיל             │
│ דרום | מזון | 120 | 45 | פעיל             │
│ ...  | ...   | ... | .. | ...              │
└─────────────────────────────────────────────────┘

Sheet "הנחיות":
- שרשור עדכון
- סימונים עבור טיפול במחדשים
```

**Validation (data-integration-engine):**
- בדוק עמודות חיוביות
- בדוק שכונות בתוך רשימה מוכרת
- בדוק קטגוריות בתוך רשימה מוכרת
- בדוק שמספרים הם numeric
- בדוק שמצב הוא "פעיל" או "בריקנות"

### 2. עיבוד: Transformation

**Input → Data Integration → Processed JSON**

```javascript
// raw input
{
  neighborhood: "מרכז עיר",
  category: "סחורות כללי",
  business_count: 350,
  income: 95,
  status: "פעיל"
}

// processed output
{
  timestamp: "2024-06-08T07:00:00Z",
  neighborhood: {
    id: "merkaz",
    name: "מרכז עיר",
    coords: [31.8533, 34.6532] // [lat, lon] of Ashdod
  },
  category: {
    id: "general",
    name: "סחורות כללי"
  },
  metrics: {
    business_count: 350,
    income_thousands: 95,
    status: "active",
    vacancy_rate: 0.15
  }
}
```

### 3. אחסון: JSON נקי

**`data/processed/ashdod-data-2024-06-08.json`**

```json
{
  "meta": {
    "version": "2.0",
    "generated": "2024-06-08T07:00:00Z",
    "source": "ashdod-data-2024-06-08.xlsx",
    "data_quality": "validated"
  },
  "summary": {
    "total_businesses": 6103,
    "total_income": 428,
    "avg_vacancy": 0.1583,
    "neighborhoods_count": 6,
    "categories_count": 5,
    "last_updated": "2024-06-08"
  },
  "neighborhoods": [
    {
      "id": "merkaz",
      "name": "מרכז עיר",
      "businesses": 1200,
      "income": 95,
      "vacancy": 0.12,
      "categories": [...]
    }
  ],
  "categories": [
    {
      "id": "general",
      "name": "סחורות כללי",
      "total_count": 1850,
      "by_neighborhood": {...}
    }
  ]
}
```

### 4. תצוגה: React Dashboard

**Dashboard.jsx** קורא את `processed JSON` ומציג:
- KPI cards (סה"כ עסקים, דירוג, הכנסות, ריקנות)
- Bar chart (עסקים לשכונה)
- Doughnut chart (חלוקה קטגוריה)
- Geo map (התפוצה בעיר)
- Sidebar (מסננים)

### 5. ניתוח: Insights

**ashdod-dashboard-analyzer → insights-engine**

```
Processed JSON + Trends + Context
         ↓
     מציאת דפוסים
         ↓
     יצירת תובנות
         ↓
     Insights JSON
```

---

## קבצים חיוניים

### 1. neighborhoods.json
```json
{
  "neighborhoods": [
    {
      "id": "merkaz",
      "name": "מרכז עיר",
      "hebrew_name": "מרכז עיר",
      "coordinates": [31.8533, 34.6532],
      "population_estimate": 45000,
      "area_sqm": 2500000
    },
    {
      "id": "south",
      "name": "דרום עיר",
      "coordinates": [31.8400, 34.6500],
      "population_estimate": 38000,
      "area_sqm": 2200000
    }
  ]
}
```

### 2. categories.json
```json
{
  "categories": [
    {
      "id": "general",
      "name": "סחורות כללי",
      "color": "#FF6B6B",
      "description": "חנויות כלליות"
    },
    {
      "id": "food",
      "name": "מזון ומשקה",
      "color": "#4ECDC4",
      "description": "מסעדות, קפים, חנויות"
    }
  ]
}
```

---

## API endpoints (אם צריך)

### GET /api/data/latest
```json
{
  "timestamp": "2024-06-08T07:00:00Z",
  "data": { ... // processed JSON
}
```

### GET /api/data/compare
```json
{
  "current": { ... },
  "previous": { ... },
  "delta": { ... }
}
```

### POST /api/data/upload
```
body: FormData with Excel file
returns: { status, errors, warnings }
```

---

## בנייה וריצה

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# דשבורד פתוח ב-http://localhost:3000
```

### Sync Daily
```bash
npm run sync
# מריץ את data-integration-engine
```

### Build Production
```bash
npm run build
# בנייה ל-dist/
```

---

## כללי עדכון

### יומי
1. Excel חדש מעלים → `data/raw/`
2. Script `sync-daily.js` רץ
3. JSON מעודכן → `data/processed/`
4. Dashboard מטעין נתונים חדשים

### שבועי
1. `ashdod-dashboard-analyzer` קורא את הנתונים
2. `insights-engine` יוצר תובנות
3. דוח Markdown נשמר ב-`docs/reports/`

### חודשי
1. `urban-economics-expert` עושה ניתוח עמוק
2. מדיניות כלכלית עדכנית (אם צריך)
3. תוכנית ל-3 חודשים הקרובים

---

## ניקוי מטמון

```bash
# מחק נתונים מטומנים (במידת הצורך)
npm run clean-cache

# שדרג מחדש את כל הנתונים
npm run rebuild-data
```

---

## דוגמה: זרימה שלמה

```
9:00   משתמש העלה Excel חדש
       ↓
9:05   sync-daily.js רץ
       • ניקוי נתונים
       • בדיקת תקינות
       • JSON עדכן
       ↓
9:10   Dashboard מתעדכן
       • KPI חדשות
       • תרשימים חדשים
       ↓
9:15   ashdod-dashboard-analyzer קורא
       • מזהה דפוסים
       • משווה לאתמול
       ↓
9:20   insights-engine יוצר דוח
       • 3 גילויים
       • 2 סיכונים
       • 5 הזדמנויות
       ↓
9:25   דוח מוכן
       מוכן לשליחה לרשות
```

---

**תאריך עדכון:** יוני 2024  
**גרסה:** 2.0  
**סטטוס:** טי.טי.מ (Test Thoroughly, Monitor)
