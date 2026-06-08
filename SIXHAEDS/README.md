# Six Hats Company

מערכת שישה סוכנים מומחים לשיכלול ושדרוג כל פלט — אפליקציות, עיצוב, קוד, תהליכים ותוכן.

## מה זה

חברה וירטואלית של 6 סוכני AI. כל סוכן = כובע חשיבה ייחודי עם מומחיות בלתי חופפת. הם עובדים בקומפוזיציות משתנות — סדר שונה לכל סוג משימה.

## הסוכנים

| כובע | סוכן | תפקיד | שאלת מפתח |
|------|-------|--------|-----------|
| אדום | red-vision | חזון ואסטרטגיה | "למה זה קיים?" |
| לבן | white-research | מחקר ונתונים | "מה העובדות?" |
| שחור | black-quality | איכות וסיכונים | "מה יכול להישבר?" |
| ירוק | green-innovation | חדשנות ויצירתיות | "מה עוד אפשר?" |
| כחול | blue-process | תהליכים וארכיטקטורה | "איך בונים?" |
| צהוב | yellow-value | ערך ומשמעות | "מה הערך?" |

## קומפוזיציות

### לפני בנייה (pre-build)
אדום → ירוק → לבן → שחור → כחול → צהוב

### בזמן בנייה (during-build)
כחול → לבן → שחור → ירוק

### אחרי מסירה (post-build)
צהוב → לבן → שחור → כחול → אדום → ירוק

### חירום (crisis)
שחור → לבן → ירוק → כחול (25 דקות מקסימום)

### מהיר (quick — 2 סוכנים)
- validate: אדום + שחור
- solve: שחור + ירוק
- decide: לבן + צהוב
- design: אדום + ירוק
- review: שחור + כחול
- measure: לבן + צהוב

## התקנה

### Cowork
התקן את קובץ ה-`.plugin` דרך ממשק Cowork.

### Claude Code
הוסף לתיקיית הפרויקט. Claude Code יזהה את CLAUDE.md והסוכנים אוטומטית.

## מבנה

```
six-hats-company/
├── .claude-plugin/plugin.json     ← מניפסט
├── skills/                        ← 6 סוכנים + מתזמר
│   ├── orchestrator/              ← מנוע ראשי
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── agents.md
│   │       └── compositions.md
│   ├── red-vision/SKILL.md
│   ├── white-research/SKILL.md
│   ├── black-quality/SKILL.md
│   ├── green-innovation/SKILL.md
│   ├── blue-process/SKILL.md
│   └── yellow-value/SKILL.md
├── agents/                        ← Claude Code subagents
│   ├── red-vision.md
│   ├── white-research.md
│   ├── black-quality.md
│   ├── green-innovation.md
│   ├── blue-process.md
│   └── yellow-value.md
├── CLAUDE.md                      ← Claude Code integration
└── README.md                      ← אתה כאן
```

## עקרון מנחה

כל סוכן יודע בדיוק מה הוא לא.
הכוח נמצא בהרכב, לא ביחיד.
