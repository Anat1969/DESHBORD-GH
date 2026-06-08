---
name: ashdod-business-dashboard
description: >
  דשבורד עסקים עירוני לעיר אשדוד.
  מערכת שישה סוכנים + ארבעה skills מומחה לניתוח כלכלה עירונית, 
  חיבור נתונים, וייצור תובנות.
---

# דשבורד עסקים אשדוד — Claude Code Integration

## מערכת

### שישה סוכנים בסיס (Six Hats Company)
- אדום (red-vision): חזון ואסטרטגיה
- לבן (white-research): מחקר ונתונים
- שחור (black-quality): איכות וסיכונים
- ירוק (green-innovation): חדשנות ויצירתיות
- כחול (blue-process): תהליכים וארכיטקטורה
- צהוב (yellow-value): ערך ומשמעות

### ארבעה skills מומחה (חדשים)
- `urban-economics-expert`: ניתוח כלכלה עירונית
- `ashdod-dashboard-analyzer`: ניתוח דשבורד
- `data-integration-engine`: חיבור נתונים מ-Excel
- `insights-engine`: ייצור תובנות ממצאים

---

## שימוש מהיר

### קומפוזיציה שלמה (pre-build) — פרויקט חדש או רעיון כללי
```
claude-code dashboard pre-build "דרוש דשבורד לעסקים בעיר אשדוד"
```

**סדר סוכנים:** אדום → ירוק → לבן → שחור → כחול → צהוב

**תוצר:** 
- vision_output (למה צריך דשבורד?)
- innovation_output (אפשרויות עיצוב)
- research_output (אפילו דשבורדים בערים דומות עובדים?)
- quality_output (מה יכול להישבר?)
- process_output (אדריכלות טכנית)
- value_output (ROI צפוי)

---

### בדיקה עדכון נתונים (during-build) — יומית
```
claude-code dashboard update "העלינו Excel חדש של עסקים באשדוד"
```

**סדר:** כחול (סטטוס) → לבן (מטריקות) → שחור (בעיות) → ירוק (שיפורים)

**תוצר:**
- סטטוס עדכון
- השוואה לנתונים קודמים
- בעיות שנתגלו
- הצעות לשיפור

---

### ניתוח כלכלי עירוני (special) — חודשי
```
claude-code dashboard urban-economics "אנלוג כלכלה עירונית של נתוני אשדוד"
```

**סוכן:** urban-economics-expert + מטריקות מ-ashdod-dashboard-analyzer

**תוצר:**
- השפעה על משאבים עירוניים
- מיקום משתכנים חדשים
- הצעות לנהל מדיניות כלכלית

---

### סינכרוניזציה נתונים (data-flow) — בוקר כל יום
```
claude-code dashboard sync "תשדרג את נתוני Excel האחרונים"
```

**סוכנים:** data-integration-engine + ashdod-dashboard-analyzer

**תוצר:**
- Excel מנקה ומעודכן
- דוח שגיאות ותיקונים
- דשבורד מתעדכן ישירות

---

### תובנות שבועיות (insights) — כל ראשון
```
claude-code dashboard insights "מה אנחנו למדים מהשבוע הזה בדשבורד?"
```

**סוכנים:** ashdod-dashboard-analyzer + insights-engine

**תוצר:**
- גילויים חדשים
- הזדמנויות לפעולה
- סיכונים ליד
- המלצות מדויקות

---

## קומפוזיציות מלאות

| פקודה | מתי | סוכנים | תוצר |
|-------|-----|--------|------|
| `pre-build` | פרויקט חדש | אדום→ירוק→לבן→שחור→כחול→צהוב | תכנון שלם |
| `during-build` | עדכון יומי | כחול→לבן→שחור→ירוק | בדיקה סטטוס |
| `update` | נתונים חדשים | data-integration→ashdod-analyzer | סינכרוניזציה |
| `insights` | דוח שבועי | ashdod-analyzer→insights-engine | תובנות |
| `economic-analysis` | דוח חודשי | urban-economics→recommendations | כלכלה עירונית |

---

## סוכנים וקבצים

### Six Hats (בסיס)
```
skills/
├── orchestrator/SKILL.md              ← מתזמר ראשי
├── red-vision/SKILL.md               ← חזון
├── white-research/SKILL.md           ← מחקר
├── black-quality/SKILL.md            ← איכות
├── green-innovation/SKILL.md         ← חדשנות
├── blue-process/SKILL.md             ← תהליך
└── yellow-value/SKILL.md             ← ערך

agents/
├── red-vision.md                     ← Claude Code agents
├── white-research.md
├── black-quality.md
├── green-innovation.md
├── blue-process.md
└── yellow-value.md
```

### מומחים (חדש)
```
skills/
├── urban-economics-expert/SKILL.md   ← כלכלה עירונית
├── ashdod-dashboard-analyzer/SKILL.md ← ניתוח דשבורד
├── data-integration-engine/SKILL.md  ← חיבור נתונים
└── insights-engine/SKILL.md          ← תובנות
```

---

## זרימת נתונים

```
Excel (יומי)
    ↓
data-integration-engine (ניקוי וטיפול)
    ↓
ashdod-dashboard-analyzer (קריאה ודפוסים)
    ↓
Dashbaord (עדכון ישיר)
    ↓
insights-engine (מה זה אומר?)
    ↓
עיר אשדוד (החלטות ופעולות)
```

---

## כללי ברזל

1. **לא לדלג על סוכן**: אם קומפוזיציה אומרת 4 סוכנים — 4 בדיוק
2. **לא לערבב תפקידים**: אדום לא עושה מחקר, לבן לא עושה חזון
3. **Critical = חזרה אחורה**: אם שחור מזהה סיכון גדול — בחזרה לירוק
4. **תמיד סיכום**: כל קומפוזיציה מסתיימת בסיכום של מתזמר
5. **האדם מחליט**: הסוכנים ממליצים בלבד

---

## כלי עזר יומיים

### בוקר (15 דקות)
```
1. Sync נתונים חדשים
2. בדוק סטטוס (Blue + White + Black)
3. קרא את ashdod-dashboard-analyzer
4. אם משהו מעניין — שלח לירוק לחדשנות
```

### שבוע (שעה)
```
1. הרץ insights-engine
2. בדוק עם urban-economics-expert
3. הכן דוח לרשות
4. שלח המלצות לצהוב (ערך)
```

### חודש (2 שעות)
```
1. הרץ pre-build מחדש עם נתונים אחרונים
2. בדוק שינויים בתהליך (כחול)
3. בדוק ROI (צהוב)
4. רשם שיעור לשנה הקרובה (אדום)
```

---

## טיפ אחיר: הממשק

הממשק שלך (React/HTML) תמיד:
- RTL בעברית
- 4 KPI ראשיות
- 3 תרשימים (בר, עוגה, מפה)
- מסננים (שכונה, קטגוריה, זמן)

**ממלא נתונים מ:**
- Excel הנתונים
- או Google Sheets ישיר
- או API שחוברת

כשNotes משתנה = דשבורד משדרג מיידי.

---

## צפוי הבא

1. **אוטומציה יומית**: Cron job שמעלה Excel כל בוקר 7:00
2. **Slack integration**: דוחות ישירות לSLACK
3. **Notification**: אם ריקנות עולה > 16% — אזהרה מיידית
4. **Export PDF**: דוח חודשי לראש הרשות בפורמט מוכן

---

**גרסה:** 2.0  
**עדכון אחרון:** יוני 2024  
**סטטוס:** מתוחזק וגדל
