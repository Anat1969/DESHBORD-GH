# Six Hats Company — Claude Code Integration

## מערכת
6 סוכנים מומחים שפועלים בקומפוזיציות לשיכלול כל פלט.

## שימוש מהיר

### ניתוח מלא (pre-build):
```
six-hats pre-build "תיאור הפרויקט"
```
→ מריץ: אדום → ירוק → לבן → שחור → כחול → צהוב

### בדיקה מהירה (2 סוכנים):
```
six-hats quick validate "הכיוון הזה נכון?"
six-hats quick solve "משתמשים עוזבים בעמוד 3"
six-hats quick decide "React או Vue?"
six-hats quick design "דשבורד לניהול"
six-hats quick review "תבדוק את הקוד"
six-hats quick measure "איך הולך הפרויקט?"
```

### סוכן בודד:
```
six-hats red "מה החזון?"
six-hats black "מה יכול להישבר?"
six-hats green "מה האפשרויות?"
```

## קומפוזיציות

| פקודה | מתי | סוכנים |
|-------|-----|--------|
| `pre-build` | פרויקט חדש | אדום→ירוק→לבן→שחור→כחול→צהוב |
| `during-build` | בזמן פיתוח | כחול→לבן→שחור→ירוק |
| `post-build` | אחרי השקה | צהוב→לבן→שחור→כחול→אדום→ירוק |
| `crisis` | חירום | שחור→לבן→ירוק→כחול |

## סוכנים

| סוכן | קובץ | תפקיד |
|------|-------|--------|
| אדום | `agents/red-vision.md` | חזון ואסטרטגיה |
| לבן | `agents/white-research.md` | מחקר ונתונים |
| שחור | `agents/black-quality.md` | איכות וסיכונים |
| ירוק | `agents/green-innovation.md` | חדשנות ויצירתיות |
| כחול | `agents/blue-process.md` | תהליכים וארכיטקטורה |
| צהוב | `agents/yellow-value.md` | ערך ומשמעות |

## כללי ברזל
1. לא לדלג על סוכן בקומפוזיציה
2. לא לערבב תפקידים
3. Critical = חזרה אחורה
4. תמיד סיכום בסוף
5. האדם מחליט — הסוכנים ממליצים
