// כתבות של "דשבורד עסקים — אשדוד": נגזרות מנתוני הדשבורד (data/processed/sample-data.json, data/neighborhoods.json,
// data/categories.json) ומהטקסטים שהדשבורד עצמו מציג (שורות ההסבר, "שאלה לתכנון", ארבעת השלבים, כללי התובנה בגרפים).
// הרכיב המשותף <app-creations> (AppOfApp-GH/public/creations.js) מציג אותן: כתבת A4 לכל נושא, יצירת כתבה מהמאגר,
// הורדה והדפסה, והעלאה לחדר של האפליקציה במוזיאון (TAARUCHA).
// הרצה: node tools/creations.mjs  → public/creations.json. מריצים שוב אחרי כל החלפה של קובץ הנתונים.
// כללים: הנתונים הם נתוני דוגמה, וכל כתבה אומרת זאת. אין מספר שלא נגזר מהקבצים. הכללים לתובנה זהים לאלה שבגרפים.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')
const J = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'))
const DATA = J('data/processed/sample-data.json')
const GEO = Object.fromEntries(J('data/neighborhoods.json').neighborhoods.map((n) => [n.id, n]))
const CAT = Object.fromEntries(J('data/categories.json').categories.map((c) => [c.id, c]))
const warn = []

// ---------- הטקסטים שהדשבורד מציג (app/dashboard.jsx, app/components/LandingPage.jsx) ----------
const GUIDE = {
  overview: 'ארבעה מספרים שמסכמים את הפעילות העסקית בעיר. שימו לב לאחוז הריקנות — מעל 15% מצביע על ירידה בביקוש שדורשת בחינה.',
  neighborhoods: 'כל נקודה היא רובע. הפער בין הגדול לקטן מראה את עוצמת הריכוזיות — רובע חלש הוא הזדמנות לתכנון.',
  categories: 'כשענף אחד שולט — הרובע פגיע. גיוון ענפי מגן על הכלכלה המקומית מפני ירידה בענף בודד.',
  map: 'גודל העיגול = מספר עסקים. עיגול קטן עם ריקנות גבוהה הוא אזור שדורש תשומת לב בתכנון.',
}
const QUESTION = {
  overview: 'האם ההכנסות מחולקות באופן שווה בין הרובעים, או שיש ריכוז גבוה ברובע אחד?',
  neighborhoods: 'מה גורם לרובעים החלשים להישאר חלשים? תשתית, נגישות, סוג דיור, או חוסר שטחי מסחר?',
  categories: 'האם אפשר לעודד ענפים חסרים ברובעים ספציפיים דרך הקלות או ייעוד שטחים?',
  map: 'האם מיקום השטחים המסחריים מתאים לצרכי האוכלוסייה ברובע, או שתושבים צריכים לנסוע לרובע אחר?',
}
const STEPS = [
  { id: 'step-overview', title: 'תמונת מצב', desc: 'כמה עסקים פעילים, כמה הכנסות, כמה ריקנות — המספרים הגדולים שמסכמים את העיר.' },
  { id: 'step-neighborhoods', title: 'השוואת רובעים', desc: 'איפה יש ריכוז עסקי ואיפה יש חולשה. הפערים בין הרובעים הם נקודת המוצא לתכנון.' },
  { id: 'step-categories', title: 'הרכב ענפי', desc: 'האם רובע מסוים תלוי בענף אחד? גיוון ענפי מגן על הכלכלה המקומית.' },
  { id: 'step-map', title: 'מפה', desc: 'תפוסה גיאוגרפית — לראות את הנתונים על פני השטח ולזהות אזורים שדורשים תשומת לב.' },
]
const HERO = { title: 'תכנון מסחר עירוני', sub: 'הכנסות העיר ממסחר תלויות בתכנון נכון של הרובעים.' }
// כלל הריקנות של כרטיס "ריקנות ממוצעת" (app/components/KPICards.jsx)
const vacancyRule = (v) => (v <= 0.12 ? 'ריקנות נמוכה — ביקוש גבוה לשטחי מסחר' : v <= 0.16 ? 'ריקנות בטווח סביר — שוק מאוזן בין היצע לביקוש' : v <= 0.2 ? 'ריקנות מעל הממוצע — ייתכנו שכונות עם ירידה בביקוש' : 'ריקנות גבוהה — ירידה בביקוש באזורים מסוימים')

// ---------- עזרים ----------
const fmt = (n) => Number(n).toLocaleString('en-US')
const pct = (x, d = 0) => (x * 100).toFixed(d)
const words = (t) => (t || '').replace(/[*=]/g, '').split(/\s+/).filter(Boolean).length
const DEMO = 'נתוני דוגמה'
const SRC = 'הדשבורד, נתוני דוגמה'
const S = DATA.summary
const NB = DATA.neighborhoods
const CATS = DATA.categories
const byBiz = [...NB].sort((a, b) => b.businesses - a.businesses)
const byVac = [...NB].sort((a, b) => a.vacancy - b.vacancy)
const catSorted = [...CATS].sort((a, b) => b.total_count - a.total_count)
const catTotal = CATS.reduce((s, c) => s + c.total_count, 0)
const per1000 = (n) => (GEO[n.id]?.population_estimate ? (n.businesses / GEO[n.id].population_estimate) * 1000 : null)
const top = byBiz[0], bottom = byBiz[byBiz.length - 1]
const lowVac = NB.filter((n) => n.vacancy <= 0.12), highVac = NB.filter((n) => n.vacancy > 0.17)
const lead = (n) => [...n.categories].sort((a, b) => b.count - a.count)[0]
const share = (n) => lead(n).count / n.businesses

// ---------- נושאים ----------
// בפורמט report המספרים הגדולים נלקחים מהתוויות: fromLabel, toLabel, כותרת התובנה וכותרת הכתבה.
// לכן בכל תווית כזו מספר אחד ומילים אחריו (אחוז במילה, כדי שהתווית תישאר קריאה).
const resid = NB.filter((n) => per1000(n) != null && n.id !== 'industrial').sort((a, b) => per1000(b) - per1000(a))
const ind = NB.find((n) => n.id === 'industrial')
const weak = [...NB].filter((n) => n.id !== 'industrial').sort((a, b) => b.vacancy - a.vacancy)[0]
const mono = [...NB].sort((a, b) => share(b) - share(a))[0]
const catLast = catSorted[catSorted.length - 1]
const topics = [
  // ידע: עובדה עם מקור
  {
    id: 'overview', zone: 'ידע', title: `תמונת מצב: ${fmt(S.total_businesses)} עסקים`,
    sub: `**${fmt(S.total_businesses)}** עסקים ב-**${S.neighborhoods_count}** רובעים, הכנסות של **${S.total_income}** מלש״ח, וריקנות ממוצעת של **${pct(S.avg_vacancy, 1)}%**. ${DEMO}, ${S.last_updated}.`,
    creations: [
      { id: 'g', style: 'gradient', title: HERO.title, text: HERO.sub },
      { id: 'i', style: 'insight', title: `${pct(S.avg_vacancy, 1)} אחוז ריקנות ממוצעת`, text: `==${vacancyRule(S.avg_vacancy)}==.` },
      { id: 'q', style: 'quote', quote: QUESTION.overview, who: 'שאלה לתכנון · תמונת מצב', cite: SRC },
      { id: 'f', style: 'fromto', title: 'איפה ההכנסות', fromLabel: `${top.income} מלש״ח ב${top.name}`, from: `הכי הרבה: **${pct(top.income / S.total_income)}%** מהכנסות העיר`, toLabel: bottom.name, to: `**${bottom.income}** מלש״ח, הכי מעט`, text: `ממוצע **${Math.round(S.total_income / S.neighborhoods_count)}** מלש״ח לשכונה.` },
      { id: 'e', style: 'essay', title: 'ארבעה מספרים', text: GUIDE.overview.split('. ')[0] + '.', body: [GUIDE.overview.split('. ')[0] + '.', `**${fmt(S.total_businesses)}** עסקים פעילים ב-**${S.neighborhoods_count}** רובעים.`, `**${S.total_income}** מלש״ח הכנסות כולל.`, `ריקנות ממוצעת **${pct(S.avg_vacancy, 1)}%**. ${GUIDE.overview.split('. ')[1]}`] },
    ],
  },
  {
    id: 'categories', zone: 'ידע', title: `${catSorted[0].name}: ${pct(catSorted[0].total_count / catTotal)} אחוז מהעסקים`,
    sub: `חמישה ענפים. ${catSorted[0].name} ו${catSorted[1].name} מרכזים יחד **${pct((catSorted[0].total_count + catSorted[1].total_count) / catTotal)}%** מהפעילות העסקית. ${DEMO}.`,
    creations: [
      { id: 'i', style: 'insight', title: `${pct(catLast.total_count / catTotal)} אחוז בלבד ל${catLast.name}`, text: `==ריכוזיות שכדאי לשים לב אליה==.` },
      { id: 'q', style: 'quote', quote: GUIDE.categories, who: 'הרכב ענפי', cite: SRC },
      { id: 'f', style: 'fromto', title: 'מהענף הגדול לקטן', fromLabel: `${fmt(catSorted[0].total_count)} עסקים ב${catSorted[0].name}`, from: CAT[catSorted[0].id].description, toLabel: catLast.name, to: `**${fmt(catLast.total_count)}** עסקים: ${CAT[catLast.id].description}`, text: `**${fmt(catTotal)}** עסקים בחמישה ענפים.` },
      { id: 'p', style: 'post', title: 'העסקים לפי ענף', text: catSorted.map((c) => `${c.name}: **${fmt(c.total_count)}** עסקים, **${pct(c.total_count / catTotal)}%**`).join('\n'), tags: ['ענפים', 'אשדוד', DEMO] },
    ],
  },
  {
    id: 'merkaz', zone: 'ידע', title: `${top.name}: ${fmt(top.businesses)} עסקים`,
    sub: `הלב העסקי של העיר: **${pct(top.businesses / S.total_businesses)}%** מהעסקים, **${top.income}** מלש״ח הכנסות וריקנות של **${pct(top.vacancy)}%**. ${DEMO}.`,
    creations: [
      { id: 'g', style: 'gradient', title: `${fmt(top.businesses)} עסקים במרכז`, text: `**${pct(top.businesses / S.total_businesses)}%** מכל העסקים בעיר.` },
      { id: 'i', style: 'insight', title: `${pct(top.vacancy)} אחוז ריקנות ב${top.name}`, text: `==${vacancyRule(top.vacancy)}==.` },
      { id: 'q', style: 'quote', quote: QUESTION.overview, who: 'שאלה לתכנון', cite: SRC },
      { id: 'f', style: 'fromto', title: 'עסקים מול תושבים', fromLabel: `${per1000(top).toFixed(0)} עסקים לכל אלף תושבים`, from: `**${fmt(top.businesses)}** עסקים`, toLabel: 'תושבים (הערכה)', to: `**${fmt(GEO[top.id].population_estimate)}** תושבים`, text: 'האוכלוסייה היא הערכה מקובץ השכונות.' },
      { id: 'p', style: 'post', title: `${top.name} לפי ענף`, text: [...top.categories].sort((a, b) => b.count - a.count).map((c) => `${c.name}: **${c.count}** עסקים`).join('\n'), tags: [top.name, DEMO] },
    ],
  },

  // הבנה: מנגנון, השוואה, ממה למה
  {
    id: 'gap', zone: 'הבנה', title: `פער של ${fmt(top.businesses - bottom.businesses)} עסקים בין רובעים`,
    sub: `${top.name} מובילה עם **${fmt(top.businesses)}** עסקים — פי **${Number((top.businesses / bottom.businesses).toFixed(1))}** מ${bottom.name}. ${DEMO}.`,
    creations: [
      { id: 'i', style: 'insight', title: 'הפער מראה את הריכוזיות', text: `==רובע חלש הוא הזדמנות לתכנון==.` },
      { id: 'f', style: 'fromto', title: 'מהגדול לקטן', fromLabel: `${fmt(top.businesses)} עסקים ב${top.name}`, from: `**${top.income}** מלש״ח הכנסות`, toLabel: `${fmt(bottom.businesses)} עסקים ב${bottom.name}`, to: `**${bottom.income}** מלש״ח הכנסות`, text: GUIDE.neighborhoods.split('. ')[0] + '.' },
      { id: 'p', style: 'post', title: 'הרובעים לפי מספר עסקים', text: byBiz.map((n) => `${n.name}: **${fmt(n.businesses)}** עסקים`).join('\n'), tags: ['רובעים', DEMO] },
      { id: 'q', style: 'quote', quote: QUESTION.neighborhoods, who: 'שאלה לתכנון · השוואת רובעים', cite: SRC },
    ],
  },
  {
    id: 'vacancy', zone: 'הבנה', title: 'ריקנות: איפה הביקוש נחלש',
    sub: `${lowVac.map((n) => n.name).join(' ו')} מציגות ריקנות נמוכה. ${highVac.map((n) => n.name).join(' ו')} מציגות ריקנות מוגברת. ${DEMO}.`,
    creations: [
      { id: 'i', style: 'insight', title: 'עיגול קטן עם ריקנות גבוהה', text: `==${GUIDE.map.split('. ')[1].replace(/\.$/, '')}==.` },
      { id: 'f', style: 'fromto', title: 'מהנמוכה לגבוהה', fromLabel: `${pct(byVac[0].vacancy)} אחוז ב${byVac[0].name}`, from: vacancyRule(byVac[0].vacancy), toLabel: `${pct(byVac[byVac.length - 1].vacancy)} אחוז ב${byVac[byVac.length - 1].name}`, to: vacancyRule(byVac[byVac.length - 1].vacancy), text: `ממוצע העיר: **${pct(S.avg_vacancy, 1)}%**.` },
      { id: 'q', style: 'quote', quote: QUESTION.map, who: 'שאלה לתכנון · תפוסה גיאוגרפית', cite: SRC },
      { id: 'e', style: 'essay', title: 'איך קוראים ריקנות', text: 'הכלל של כרטיס הריקנות בדשבורד.', body: ['עד **12%**: ריקנות נמוכה — ביקוש גבוה לשטחי מסחר.', 'עד **16%**: ריקנות בטווח סביר — שוק מאוזן בין היצע לביקוש.', 'עד **20%**: ריקנות מעל הממוצע — ייתכנו שכונות עם ירידה בביקוש.', 'מעל **20%**: ריקנות גבוהה — ירידה בביקוש באזורים מסוימים.'] },
      { id: 'p', style: 'post', title: 'ריקנות לפי רובע', text: byVac.map((n) => `${n.name}: **${pct(n.vacancy)}%**`).join('\n'), tags: ['ריקנות', DEMO] },
    ],
  },
  {
    id: 'per-resident', zone: 'הבנה', title: 'עסקים מול תושבים בכל רובע',
    sub: `מספר העסקים ברובע לכל אלף תושבים, לפי הערכת האוכלוסייה בקובץ השכונות. ${DEMO}.`,
    creations: [
      { id: 'i', style: 'insight', title: `${per1000(ind).toFixed(0)} עסקים לכל אלף ב${ind.name}`, text: `==**${fmt(ind.businesses)}** עסקים ו-**${fmt(GEO[ind.id].population_estimate)}** תושבים== (הערכה).` },
      { id: 'f', style: 'fromto', title: 'ברובעי המגורים', fromLabel: `${per1000(resid[0]).toFixed(0)} לאלף ב${resid[0].name}`, from: `**${fmt(resid[0].businesses)}** עסקים, **${fmt(GEO[resid[0].id].population_estimate)}** תושבים`, toLabel: `${per1000(resid[resid.length - 1]).toFixed(0)} לאלף ב${resid[resid.length - 1].name}`, to: `**${fmt(resid[resid.length - 1].businesses)}** עסקים, **${fmt(GEO[resid[resid.length - 1].id].population_estimate)}** תושבים`, text: 'האוכלוסייה היא הערכה.' },
      { id: 'p', style: 'post', title: 'עסקים לכל אלף תושבים', text: [...NB].sort((a, b) => per1000(b) - per1000(a)).map((n) => `${n.name}: **${per1000(n).toFixed(0)}**`).join('\n'), tags: ['תושבים', DEMO] },
      { id: 'q', style: 'quote', quote: QUESTION.map, who: 'שאלה לתכנון', cite: SRC },
    ],
  },

  // יישום: מה עושים מחר
  {
    id: 'weak-quarter', zone: 'יישום', title: 'רובע חלש הוא הזדמנות לתכנון',
    sub: `${weak.name}: **${fmt(weak.businesses)}** עסקים וריקנות של **${pct(weak.vacancy)}%**, הגבוהה ברובעי המגורים. ${DEMO}.`,
    creations: [
      { id: 'q', style: 'quote', quote: QUESTION.neighborhoods, who: 'שאלה לתכנון · השוואת רובעים', cite: SRC },
      { id: 'i', style: 'insight', title: 'קודם שואלים למה', text: '==תשתית, נגישות, סוג דיור, או חוסר שטחי מסחר?==' },
      { id: 'f', style: 'fromto', title: 'ריקנות מול ממוצע העיר', fromLabel: `${pct(weak.vacancy)} אחוז ב${weak.name}`, from: vacancyRule(weak.vacancy), toLabel: `${pct(S.avg_vacancy, 1)} אחוז בממוצע העיר`, to: vacancyRule(S.avg_vacancy), text: GUIDE.map.split('. ')[1] },
      { id: 'e', style: 'essay', title: `${weak.name} במספרים`, text: 'מה בודקים מחר בבוקר.', body: [`**${fmt(weak.businesses)}** עסקים, **${pct(weak.businesses / S.total_businesses)}%** מהעסקים בעיר.`, `**${weak.income}** מלש״ח הכנסות.`, `הענף המוביל: ${lead(weak).name}, **${lead(weak).count}** עסקים.`, `**${per1000(weak).toFixed(0)}** עסקים לכל **1,000** תושבים (הערכה).`] },
    ],
  },
  {
    id: 'diversify', zone: 'יישום', title: 'גיוון ענפי מגן על הרובע',
    sub: `${GUIDE.categories.split('. ')[1]} ${DEMO}.`,
    creations: [
      { id: 'i', style: 'insight', title: `${pct(share(mono))} אחוז ${lead(mono).name} ב${mono.name}`, text: '==כשענף אחד שולט — הרובע פגיע==.' },
      { id: 'q', style: 'quote', quote: QUESTION.categories, who: 'שאלה לתכנון · הרכב ענפי', cite: SRC },
      { id: 'f', style: 'fromto', title: 'הענף המוביל משתנה', fromLabel: `${pct(share(ind))} אחוז ${lead(ind).name} ב${ind.name}`, from: `**${lead(ind).count}** מתוך **${ind.businesses}** עסקים`, toLabel: 'כלי התכנון', to: 'הקלות או ייעוד שטחים לענפים חסרים', text: GUIDE.categories.split('. ')[1] },
      { id: 'p', style: 'post', title: 'הענף המוביל בכל רובע', text: NB.map((n) => `${n.name}: ${lead(n).name}, **${pct(share(n))}%**`).join('\n'), tags: ['גיוון', DEMO] },
    ],
  },
]

// ---------- המאגר: כל רובע, כל ענף, כל שלב בדשבורד ----------
const pool = []
for (const n of NB) {
  const g = GEO[n.id]
  const cats = [...n.categories].sort((a, b) => b.count - a.count)
  pool.push({
    id: 'nb-' + n.id, zone: 'ידע', title: n.name,
    sub: `**${fmt(n.businesses)}** עסקים, **${n.income}** מלש״ח הכנסות וריקנות של **${pct(n.vacancy)}%**. ${DEMO}.`,
    creations: [
      { id: 'g', style: 'gradient', title: `${fmt(n.businesses)} עסקים`, text: `**${pct(n.businesses / S.total_businesses)}%** מהעסקים בעיר.` },
      { id: 'i', style: 'insight', title: `ריקנות ${pct(n.vacancy)}%`, text: `==${vacancyRule(n.vacancy)}==.` },
      { id: 'p', style: 'post', title: `${n.name} לפי ענף`, text: cats.map((c) => `${c.name}: **${c.count}**`).join('\n'), tags: [n.name, DEMO] },
      { id: 'f', style: 'fromto', title: 'עסקים מול תושבים', from: `הערכת אוכלוסייה: **${fmt(g.population_estimate)}**`, to: `**${per1000(n).toFixed(0)}** עסקים לכל **1,000** תושבים`, fromLabel: 'תושבים', toLabel: 'עסקים', text: 'האוכלוסייה היא הערכה.' },
    ],
  })
}
for (const c of CATS) {
  const nbs = Object.entries(c.by_neighborhood).sort((a, b) => b[1] - a[1])
  const nm = (id) => NB.find((n) => n.id === id)?.name || id
  pool.push({
    id: 'cat-' + c.id, zone: 'הבנה', title: c.name,
    sub: `${CAT[c.id]?.description || ''}. **${fmt(c.total_count)}** עסקים בעיר. ${DEMO}.`,
    creations: [
      { id: 'g', style: 'gradient', title: `${fmt(c.total_count)} עסקים`, text: `**${pct(c.total_count / catTotal)}%** מכלל העסקים.` },
      { id: 'i', style: 'insight', title: `הכי הרבה ב${nm(nbs[0][0])}`, text: `==**${nbs[0][1]}** עסקים==, ובמקום האחרון ${nm(nbs[nbs.length - 1][0])} עם **${nbs[nbs.length - 1][1]}**.` },
      { id: 'p', style: 'post', title: `${c.name} לפי רובע`, text: nbs.map(([id, v]) => `${nm(id)}: **${v}**`).join('\n'), tags: [c.name, DEMO] },
      { id: 'q', style: 'quote', quote: QUESTION.categories, who: 'שאלה לתכנון', cite: SRC },
    ],
  })
}
const STEP_KEY = { 'step-overview': 'overview', 'step-neighborhoods': 'neighborhoods', 'step-categories': 'categories', 'step-map': 'map' }
for (const s of STEPS) {
  const k = STEP_KEY[s.id]
  const [g1, g2] = GUIDE[k].split('. ')
  pool.push({
    id: s.id, zone: 'יישום', title: s.title, sub: s.desc,
    creations: [
      { id: 'g', style: 'gradient', title: s.title, text: g1.replace(/\.$/, '') + '.' },
      { id: 'i', style: 'insight', title: 'איך קוראים', text: `==${g2.replace(/\.$/, '')}==.` },
      { id: 'q', style: 'quote', quote: QUESTION[k], who: 'שאלה לתכנון · ' + s.title, cite: SRC },
      { id: 'e', style: 'essay', title: 'מה תמצאו בדשבורד', text: s.desc.split(' — ')[0], body: [s.desc, GUIDE[k]] },
    ],
  })
}

const byInc = [...NB].sort((a, b) => b.income - a.income)
pool.push({
  id: 'income', zone: 'ידע', title: 'ההכנסות לפי רובע',
  sub: `**${S.total_income}** מלש״ח הכנסות בעיר. ${byInc[0].name} מרכזת **${pct(byInc[0].income / S.total_income)}%** מהן. ${DEMO}.`,
  creations: [
    { id: 'g', style: 'gradient', title: `${S.total_income} מלש״ח`, text: `ממוצע **${Math.round(S.total_income / S.neighborhoods_count)}** מלש״ח לשכונה.` },
    { id: 'p', style: 'post', title: 'הכנסות לפי רובע', text: byInc.map((n) => `${n.name}: **${n.income}** מלש״ח`).join('\n'), tags: ['הכנסות', DEMO] },
    { id: 'f', style: 'fromto', title: 'מהגבוה לנמוך', from: `${byInc[0].name}: **${byInc[0].income}**`, to: `${byInc[byInc.length - 1].name}: **${byInc[byInc.length - 1].income}**`, fromLabel: 'הכי הרבה', toLabel: 'הכי מעט', text: 'במלש״ח.' },
    { id: 'q', style: 'quote', quote: QUESTION.overview, who: 'שאלה לתכנון', cite: SRC },
  ],
})
const Q_DATA = {
  overview: { title: 'הכנסות לפי רובע', text: byInc.map((n) => `${n.name}: **${n.income}** מלש״ח`).join('\n') },
  neighborhoods: { title: 'עסקים לפי רובע', text: byBiz.map((n) => `${n.name}: **${fmt(n.businesses)}**`).join('\n') },
  categories: { title: 'הענף המוביל בכל רובע', text: NB.map((n) => `${n.name}: ${lead(n).name}`).join('\n') },
  map: { title: 'ריקנות לפי רובע', text: byVac.map((n) => `${n.name}: **${pct(n.vacancy)}%**`).join('\n') },
}
for (const s of STEPS) {
  const k = STEP_KEY[s.id]
  pool.push({
    id: 'q-' + k, zone: 'יישום', title: 'שאלה לתכנון: ' + s.title, sub: QUESTION[k] + ` ${DEMO}.`,
    creations: [
      { id: 'q', style: 'quote', quote: QUESTION[k], who: 'שאלה לתכנון · ' + s.title, cite: SRC },
      { id: 'i', style: 'insight', title: s.title, text: `==${GUIDE[k].split('. ')[1].replace(/\.$/, '')}==.` },
      { id: 'p', style: 'post', title: Q_DATA[k].title, text: Q_DATA[k].text, tags: [s.title, DEMO] },
      { id: 'g', style: 'gradient', title: s.title, text: s.desc },
    ],
  })
}

// ---------- בדיקות ----------
const ZONES = ['ידע', 'הבנה', 'יישום']
for (const t of [...topics, ...pool]) {
  if (!ZONES.includes(t.zone)) warn.push(`${t.id}: שלב לא מוכר`)
  if (words(t.title) > 8) warn.push(`${t.id}: כותרת ארוכה`)
  if (!/נתוני דוגמה|דוגמה/.test(JSON.stringify(t))) warn.push(`${t.id}: חסר "נתוני דוגמה"`)
  const st = t.creations.map((c) => c.style)
  if (new Set(st).size !== st.length) warn.push(`${t.id}: עיצוב חוזר`)
  if (st.length < 4 || st.length > 6) warn.push(`${t.id}: ${st.length} יצירות`)
  if (/undefined|NaN|null/.test(JSON.stringify(t))) warn.push(`${t.id}: ערך חסר`)
}
if (topics.length < 6 || new Set(topics.map((t) => t.zone)).size < 3) warn.push('פחות מ-6 נושאים או שלב חסר')

const out = {
  app: {
    id: 'deshbord',
    name: 'דשבורד עסקים — אשדוד',
    url: 'https://deshbord-gh.vercel.app',
    repo: 'Anat1969/DESHBORD-GH',
    description: 'תכנון מסחר עירוני: עסקים, הכנסות וריקנות בכל רובע של אשדוד, והשאלות לתכנון שעולות מהם. כל המספרים הם נתוני דוגמה.',
    palette: { a: '#1a3a6f', b: '#a23b2a', c: '#d4af37', s: '#3f7a58', accent: '#d4af37', marker: '#f1e3a6', paper: '#f8f6f1', paper2: '#ffffff', ink: '#14213a', 'b-wash': '#f4e4e0', 's-wash': '#e3efe7' },
    article: {
      layout: 'report',
      // הרכיב עוטף את ה-CSS ב-[data-ar-app="deshbord"]{...} (קינון), ולכן & הוא הגיליון עצמו. בלי תמונות, הלוח מתמלא במספרים ובטקסט: מספרים גדולים יותר, גוף והערות בגודל קריא, והגושים מתפזרים לגובה הדף
      css: '&.noimg .ar-rp-main{align-content:space-between;padding-top:6cqw;padding-bottom:5cqw} .ar-rp-fig{padding:2.8cqw 2.6cqw} .ar-rp-fig b{font-size:calc(7*var(--u))} .ar-rp-fig span{font-size:calc(1.6*var(--u))} .ar-rp-body{font-size:calc(2*var(--u))} .ar-quote blockquote{font-size:calc(2.2*var(--u))} .ar-ft-s p{font-size:calc(1.6*var(--u))}',
    },
  },
  topics,
  pool,
}
fs.mkdirSync(path.join(ROOT, 'public'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'public/creations.json'), JSON.stringify(out, null, 1) + '\n')
console.log(`creations.json: ${topics.length} נושאים, ${topics.reduce((a, t) => a + t.creations.length, 0)} יצירות, ${pool.length} מקורות במאגר`)
if (warn.length) { console.log('אזהרות:\n- ' + warn.join('\n- ')); process.exitCode = 1 }
