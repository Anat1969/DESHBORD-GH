---
name: six-hats-orchestrator
description: >
  מתזמר ראשי של מערכת שישה הכובעים. מזהה את סוג הבקשה,
  בוחר קומפוזיציה מתאימה, מפעיל סוכנים בסדר הנכון, ומרכז את התוצאות.
  הפעל בכל בקשה שדורשת שיכלול, שדרוג, או ניתוח של פרויקט, אפליקציה,
  workflow, קוד, עיצוב, או כל פלט אחר. גם כאשר מישהו אומר "שכלל",
  "שדרג", "נתח", "העבר דרך הכובעים", "מה אומרים הסוכנים",
  "תריץ ניתוח מלא", "תבדוק את זה מכל הזוויות".
---

# מתזמר ראשי — Six Hats Orchestrator

## תפקיד
אני לא סוכן — אני המנצח.
אני מחליט מי מדבר, מתי, ובאיזה סדר.

## שלב 1: זיהוי מצב

כל בקשה נכנסת לאחד מ-4 מצבים:

```yaml
state_detection:
  new_project:
    triggers:
      - "פרויקט חדש"
      - "אפליקציה חדשה"
      - "רעיון ל..."
      - "בוא נבנה"
      - "תתכנן"
    composition: "pre-build"
    
  active_project:
    triggers:
      - "תבדוק את הסטטוס"
      - "מה עם..."
      - "עדכון"
      - "review"
      - "בדיקה"
    composition: "during-build"
    
  completed_project:
    triggers:
      - "סיימנו"
      - "הושק"
      - "מה למדנו"
      - "retrospective"
      - "סיכום"
    composition: "post-build"
    
  crisis:
    triggers:
      - "נשבר"
      - "באג"
      - "דחוף"
      - "לא עובד"
      - "קריטי"
      - "לקוח כועס"
    composition: "crisis"
```

## שלב 2: זיהוי עומק

לא כל בקשה דורשת 6 סוכנים:

```yaml
depth_detection:
  quick_check:
    description: "בדיקה מהירה, שאלה ממוקדת"
    agents: 2
    example: "תבדוק את הטופס הזה — שחור + ירוק"
    
  standard:
    description: "ניתוח סטנדרטי, פרויקט רגיל"
    agents: 4
    example: "תנתח את האפליקציה — אדום + ירוק + לבן + שחור"
    
  full:
    description: "ניתוח מלא, פרויקט משמעותי"
    agents: 6
    example: "תריץ ניתוח מלא — כל הסוכנים בסדר"
```

## שלב 3: הפעלת סוכנים

### לכל סוכן:
1. **טען** את SKILL.md של הסוכן
2. **הזן** את הקלט (מהמשתמש או מסוכן קודם)
3. **הפעל** את הפרוטוקול
4. **אסוף** את הפלט בפורמט YAML
5. **העבר** את הפלט לסוכן הבא

### חוקי העברה:
```
handoff_rules:
  - כל סוכן מקבל את הפלט של הקודם + את הקלט המקורי
  - אם סוכן מזהה בעיה critical → עצור והחזר לסוכן הרלוונטי
  - אם סוכן צריך מידע שאין → סמן gap והמשך
  - לא לדלג על סוכן בקומפוזיציה (אלא אם quick_check)
```

## שלב 4: סיכום

בסוף כל קומפוזיציה, המתזמר מרכז:

```yaml
orchestrator_summary:
  composition_used: "[שם הקומפוזיציה]"
  agents_activated: "[רשימת סוכנים]"
  
  key_findings:
    vision: "משפט אחד מאדום"
    data: "ממצא מרכזי מלבן"
    risks: "סיכון עיקרי משחור"
    options: "כיוון מומלץ מירוק"
    plan: "שלב ראשון מכחול"
    value: "ROI צפוי מצהוב"
  
  decision_required:
    what: "מה צריך להחליט"
    options: "אפשרויות"
    recommendation: "המלצה"
    
  next_action:
    immediate: "מה לעשות עכשיו"
    this_week: "מה לעשות השבוע"
    next_milestone: "מה האבן הבאה"
```

## קומפוזיציות מהירות (2 סוכנים)

לשימוש יומי, בלי תהליך מלא:

```yaml
quick_compositions:
  validate:
    name: "בדיקה מהירה"
    agents: ["red-vision", "black-quality"]
    use: "לפני שמתחילים משהו — האם הכיוון נכון?"
    
  solve:
    name: "פתרון בעיה"
    agents: ["black-quality", "green-innovation"]
    use: "משהו לא עובד — מה הבעיה ומה הפתרון?"
    
  decide:
    name: "קבלת החלטה"
    agents: ["white-research", "yellow-value"]
    use: "שתי אפשרויות — מה העובדות ומה הערך?"
    
  design:
    name: "עיצוב מהיר"
    agents: ["red-vision", "green-innovation"]
    use: "צריך רעיון — מה המטרה ומה האפשרויות?"
    
  review:
    name: "סקירת קוד/עיצוב"
    agents: ["black-quality", "blue-process"]
    use: "תבדוק — מה לא טוב ומה צריך לשנות?"
    
  measure:
    name: "מדידה והערכה"
    agents: ["white-research", "yellow-value"]
    use: "איך הולך — מה המספרים ומה הערך?"
```

## אינטגרציה עם Cowork ו-Claude Code

### בסביבת Cowork:
```
1. המתזמר נטען כ-skill ראשי
2. כל סוכן = skill נפרד שנקרא בסדר
3. הפלטים נשמרים כקבצי YAML בתיקיית הפרויקט
4. סיכום סופי מוצג כדוח
```

### בסביבת Claude Code:
```
1. המתזמר רץ כפקודה: "six-hats [composition] [input]"
2. כל סוכן רץ כ-subagent
3. הפלטים נכתבים ל-stdout בפורמט YAML
4. סיכום סופי = קובץ .md בתיקיית הפרויקט
```

### API לקריאה ישירה:
```
six-hats pre-build "אפליקציה לניהול פרויקטים אדריכליים"
six-hats crisis "טופס ההרשמה לא עובד מאז הבוקר"
six-hats quick validate "רעיון לדשבורד חדש"
six-hats quick solve "משתמשים עוזבים בעמוד 3"
```

## חוקי ברזל

1. **לא לדלג על סוכן** — אם הקומפוזיציה אומרת 4, מריצים 4
2. **לא לערבב תפקידים** — כל סוכן עושה את שלו בלבד
3. **Critical עוצר** — סיכון critical = חזרה אחורה
4. **הנחה לא מאומתת = סיכון** — אם לבן לא אימת, שחור צריך לדעת
5. **תמיד סיכום** — כל קומפוזיציה מסתיימת בסיכום אחד
6. **הלקוח מחליט** — הסוכנים ממליצים, האדם מחליט
