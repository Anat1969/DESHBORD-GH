/* כתבות: כתבת A4 לכל נושא שעולה מהדשבורד (ידע, הבנה, יישום), יצירת כתבה מהמאגר, הורדה והדפסה, והעלאה לחדר במוזיאון.
 * הרכיב המשותף <app-creations> (AppOfApp-GH/public/creations.js) נטען ב-index.html.
 * הנתונים: public/creations.json, נגזר מ-data/ ב-tools/creations.mjs. כל המספרים הם נתוני הדוגמה של הדשבורד. */
export default function ArticlesPage() {
  return (
    <div className="articles-page">
      <header className="landing-top-bar">
        <a className="landing-app-name" href="#/">דשבורד עסקים — אשדוד</a>
        <ai-menu></ai-menu>
      </header>
      <main className="articles-main">
        <app-creations src="./creations.json" heading="מה הדשבורד מלמד על המסחר בעיר"></app-creations>
      </main>
    </div>
  )
}
