# CLAUDE.md

## A&I logo button
The top bar holds only the app name (links home), content navigation, and ONE logo button "אד' ענת שטיבלמן A&I" (`<ai-menu>` from https://appofapp-gh.vercel.app/ai-menu.js). Every editing and development action (העתקת קישור, שיחת הפיתוח, פרויקט המחקר, התקנת האפליקציה, edit mode, add, delete) lives only inside it, never as loose buttons. Standard: https://github.com/Anat1969/AppOfApp-GH/blob/main/docs/ai-menu-standard.md

## כתבות (`#/articles`, 07.11.2026, לבקשת ענת)
- כתבת A4 לכל נושא, בפורמט לוח מצב (`report`): 8 נושאים (ידע, הבנה, יישום) ו-20 מקורות ל"יצירת כתבה". לכל כתבה: הורדה והדפסה, והעלאה לחדר `room-deshbord` במוזיאון (TAARUCHA).
- הכניסה: "כתבות" בסוף סרגל השלבים של הדשבורד. הרכיב המשותף `<app-creations>` נטען ב-`index.html` מ-GitHub Pages של AppOfApp-GH, ומ-Vercel כגיבוי.
- הנתונים: `public/creations.json`, נגזר ב-`node tools/creations.mjs` מ-`data/` ומהטקסטים שהדשבורד מציג (שורות ההסבר, "שאלה לתכנון", כללי התובנה). כל המספרים הם נתוני הדוגמה, וכל כתבה אומרת זאת. אחרי החלפת קובץ הנתונים מריצים שוב.
- בפורמט report המספרים הגדולים נלקחים מהתוויות (fromLabel, toLabel, כותרת התובנה והכותרת), ולכן בכל תווית מספר אחד ומילים אחריו.
- בדיקה: `npm run build && npx vite preview --port 4195 & node tests/creations.cjs` (הרכיב מוגש מ-`tests/fixtures/creations.js`).
