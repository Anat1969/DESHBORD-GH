---
name: usage
description: >
  הנחיות צעד אחר צעד: איך להפעיל את דשבורד אשדוד בפועל.
  מהתחלה ראשונה, דרך סינכרוניזציה יומית, לדוחות שבועיים.
---

# הנחיות שימוש — דשבורד אשדוד

## 🚀 התחלה ראשונה (חד-פעמי)

### שלב 1: ריבית וקבצים בסיסיים

```bash
# 1. שכפל את הפרויקט
git clone <repository> ashdod-dashboard
cd ashdod-dashboard

# 2. התקן dependencies
npm install

# 3. הפעל את הממשק (development mode)
npm run dev
```

**פלט צפוי:**
```
Local: http://localhost:3000
```

### שלב 2: טעינת נתונים ראשוניים

```bash
# 1. הניח את Excel בתיקייה הנכונה
cp /path/to/ashdod-data.xlsx data/raw/

# 2. בדוק תקינות Excel
npm run validate

# 3. עיבוד וממיר JSON
npm run sync

# 4. בדוק דשבורד
# פתח http://localhost:3000 בדפדפן
```

**בדיקה:**
- KPI מופיעות?
- תרשימים טוענים?
- מסננים עובדים?

אם כל זה תקין → ✅ מוכן!

---

## 📅 דרך עבודה יומית

### בוקר (15 דקות)

```bash
# 1. עדכון נתונים
# העלה Excel חדש ב-9:00 בוקר
cp /path/to/ashdod-data-2024-06-08.xlsx data/raw/

# 2. סינכרוניזציה
npm run sync

# 3. בדיקה שגרתית
# פתח http://localhost:3000
# קרא את ashdod-dashboard-analyzer באופן ידני או:
npm run analyze
```

**צפוי בדוח:**
```
✓ נתונים עדכנים
✓ השוואה ליום קודם
✓ שינויים (אם היו)
✓ אזהרות (אם יש)
```

### חזר: בדיקת מסננים

- בחר שכונה מסוימת
- בחר קטגוריה
- ודא שתרשימים עדכנים

---

## 🔄 סינכרוניזציה Excel (יומית)

### שלבים:

```
1. משתמש העלה Excel חדש
   ↓
2. קול: npm run sync
   ↓
3. data-integration-engine (קורא + מנקה)
   ↓
4. JSON מעודכן בתיקייה processed/
   ↓
5. דשבורד מטעין JSON אוטומטי
   ↓
6. KPI ותרשימים מתעדכנים
```

### אם יש שגיאות:

```bash
# 1. בדוק logs
npm run sync -- --verbose

# 2. בדוק את Excel
npm run validate

# 3. קרא את ה-report
cat logs/sync-report.json

# 4. אם צריך — תקן Excel וחזור
```

---

## 📊 בדוח שבועי (דוח יום ראשון)

### סדר:

```bash
# 1. הרץ analyzer
npm run analyze

# 2. הרץ insights
npm run insights

# 3. בנה דוח
npm run report:weekly

# 4. שלח לרשות (אופציונלי)
npm run report:send
```

**דוח יכיל:**
```
📊 סיכום שבועי
├─ KPI יומיות
├─ גילויים
├─ סיכונים וסימנים אדומים
├─ הזדמנויות
└─ המלצות
```

---

## 🔍 ניתוח כלכלי עירוני (דוח חודשי)

### סדר:

```bash
# 1. איסוף נתונים חודשי
npm run collect:monthly

# 2. ניתוח כלכלי
npm run analyze:economics

# 3. דוח מלא
npm run report:monthly

# 4. PDF export
npm run export:pdf
```

**דוח יכיל:**
```
🏙️ ניתוח כלכלה עירונית
├─ משאבים (אנרגיה, תנועה, כסף)
├─ מרחב ציבורי (מה השתנה בעיר?)
├─ שאלות שוויוניות (מי הנהנה?)
├─ מדיניות כלכלית (מה לעשות?)
└─ תוכנית 3 חודשים
```

---

## 🎯 שימוש Six Hats (Advanced)

### אם רוצים ניתוח מלא:

```bash
# 1. Pre-build (תכנון שלם)
npm run six-hats pre-build "עדכון כל נתוני אשדוד"

# 2. Update (בדיקה יומית)
npm run six-hats during-build "קרא את דשבורד היום"

# 3. Crisis (אם משהו השתבש)
npm run six-hats crisis "ריקנות עלתה 5%!"
```

**סוכנים יריצו בסדר ויחזרו עם דוח**

---

## 📝 טיפול במצבים נפוצים

### מצב 1: Excel חדש עם שגיאות

```bash
# 1. בדוק עמודות
npm run validate

# 2. הדפס שגיאות מפורשות
npm run validate -- --detailed

# 3. תקן את Excel ידנית

# 4. חזור לשלב 1
```

### מצב 2: ריקנות עלתה פתאום

```bash
# 1. הרץ analyzer
npm run analyze

# 2. הרץ crisis mode
npm run six-hats crisis "ריקנות עלתה מ-15% ל-17%!"

# 3. תוצר: דוח פעולה מידית
```

### מצב 3: רוצה להשוות שבועות

```bash
# 1. בחר 2 תאריכים
npm run compare --from 2024-06-01 --to 2024-06-08

# 2. תוצר: דוח השוואה מפורט
```

---

## 🛠️ Troubleshooting

### בעיה: דשבורד לא מטעין

```
✗ בעיה: "Cannot read property of undefined"

פתרון:
1. בדוק אם JSON קיים: ls data/processed/
2. בדוק אם תקין: npm run validate-json
3. אם לא — הרץ sync: npm run sync
```

### בעיה: תרשימים ריקים

```
✗ בעיה: "No data to display"

פתרון:
1. בדוק אם Excel עלה בהצלחה
2. בדוק אם מסננים לא צרים יותר מדי
3. נסה לאפס מסננים: "הכל"
```

### בעיה: דיוק נתונים בעייתי

```
✗ בעיה: "Numbers don't add up"

פתרון:
1. הרץ validate:detailed
2. בדוק אם סה"כ תואם
3. בדוק אם שכונות וקטגוריות תואמות
```

---

## 📞 קבלת עזרה

### מה לעשות אם קודם:

```
1. בדוק את logs/:
   cat logs/latest.log

2. הרץ הערות:
   npm run debug

3. פתוח GitHub issue עם:
   - תיאור הבעיה
   - תוצאות npm run debug
   - דוגמה של ה-Excel

4. דבר עם Claude Code!
```

---

## ✅ Checklist לפני סיום יום

- [ ] האם Excel עדכן?
- [ ] האם sync רץ בהצלחה?
- [ ] האם דשבורד מטעין?
- [ ] האם יש אזהרות בלוג?
- [ ] האם תרשימים מעודכנים?
- [ ] האם פתחת את דוח ה-Insights?

**אם כל זה תקין → יום טוב!** ✨

---

## 📚 מקורות נוספים

- `CLAUDE.md` - Claude Code Integration
- `ARCHITECTURE.md` - תיעוד טכני
- `ASHDOD-DASHBOARD-CLAUDE.md` - קומפוזיציות שישה סוכנים
- `/docs/SKILLS/` - תיעוד מומחים בודדים

---

**אחרון עדכון:** יוני 2024  
**גרסה:** 1.0  
**שאלות?** תשאל את Claude Code! 🚀
