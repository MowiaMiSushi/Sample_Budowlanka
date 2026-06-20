// seed demo: localStorage

const daysAgo = (days, hours = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, Math.floor(Math.random() * 60), 0, 0);
  return date.toISOString();
};

export const SAMPLE_PROJECTS = [
  {
    id: 'sample-proj-001',
    title: 'Nowoczesny salon w Samplowie',
    description: 'Kompleksowe wykończenie salonu z otwartą kuchnią, drewnianymi panelami i oświetleniem LED na wymiar.',
    category: 'interior',
    techniques: ['Gładzie premium', 'Panele drewniane', 'Oświetlenie LED', 'Podłoga dębowa'],
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800',
    ],
    created_at: daysAgo(14),
    updated_at: daysAgo(14),
  },
  {
    id: 'sample-proj-002',
    title: 'Renowacja kamienicy przy Rynku',
    description: 'Odnowienie elewacji, wymiana stolarki okiennej oraz modernizacja klatki schodowej w zabytkowej kamienicy.',
    category: 'renovation',
    techniques: ['Elewacja', 'Stolarka PCV', 'Tynki mineralne', 'Izolacja termiczna'],
    images: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800',
    ],
    created_at: daysAgo(21),
    updated_at: daysAgo(21),
  },
  {
    id: 'sample-proj-003',
    title: 'Apartament premium — wykończenie pod klucz',
    description: 'Ekskluzywne wykończenie 85 m² z marmurową łazienką, zabudową meblową i inteligentnym systemem rolet.',
    category: 'finishing',
    techniques: ['Marmur Carrara', 'Zabudowa meblowa', 'Smart home', 'Mikrocement'],
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
    ],
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
  },
  {
    id: 'sample-proj-004',
    title: 'Kuchnia na wymiar — projekt WaCraft',
    description: 'Funkcjonalna kuchnia w układzie L z wyspą, blatem kwarcowym i sprzętem AGD w zabudowie.',
    category: 'interior',
    techniques: ['Meble na wymiar', 'Blat kwarcowy', 'Płytki metro', 'Oświetlenie sufitowe'],
    images: [
      'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800',
    ],
    created_at: daysAgo(10),
    updated_at: daysAgo(10),
  },
  {
    id: 'sample-proj-005',
    title: 'Łazienka z prysznicem walk-in',
    description: 'Przebudowa łazienki z odpływem liniowym, szarymi płytkami w formacie XXL i podgrzewaną podłogą.',
    category: 'renovation',
    techniques: ['Prysznic walk-in', 'Odpływ liniowy', 'Ogrzewanie podłogowe', 'Płytki XXL'],
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    ],
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
  },
  {
    id: 'sample-proj-006',
    title: 'Biuro firmowe — strefa open space',
    description: 'Adaptacja lokalu na nowoczesne biuro z strefami focus, salą konferencyjną i akustycznymi panelami.',
    category: 'finishing',
    techniques: ['Sufit podwieszany', 'Panele akustyczne', 'Wykładzina biurowa', 'Szklane przegrody'],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
    ],
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
  },
];

export const SAMPLE_MESSAGES = [
  {
    id: 'sample-msg-001',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@example.com',
    phone: '+48 600 111 222',
    message: 'Dzień dobry, interesuje mnie remont mieszkania 62 m² w Samplowie. Proszę o wycenę i termin realizacji.',
    status: 'new',
    is_read: false,
    created_at: daysAgo(0, 9),
  },
  {
    id: 'sample-msg-002',
    name: 'Anna Nowak',
    email: 'anna.nowak@example.com',
    phone: '+48 601 333 444',
    message: 'Szukam wykonawcy wykończenia wnętrz — salon, kuchnia i łazienka. Czy macie wolne terminy w maju?',
    status: 'new',
    is_read: false,
    created_at: daysAgo(1, 14),
  },
  {
    id: 'sample-msg-003',
    name: 'Firma ABC Sp. z o.o.',
    email: 'biuro@abc-sample.pl',
    phone: '+48 22 555 666',
    message: 'Potrzebujemy wyceny na adaptację biura ok. 120 m². Prosimy o kontakt w sprawie wizji lokalna.',
    status: 'replied',
    is_read: true,
    created_at: daysAgo(3, 11),
  },
];

const PAGES = ['/', '/projects', '/contact', '/login'];
const REFERRERS = ['Direct', 'https://google.com', 'https://facebook.com', 'https://instagram.com'];
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Firefox/121.0',
  'Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile',
];

export const generateSampleAnalytics = () => {
  const entries = [];

  for (let day = 0; day < 7; day += 1) {
    const visitsPerDay = 8 + Math.floor(Math.random() * 6);

    for (let i = 0; i < visitsPerDay; i += 1) {
      entries.push({
        id: `sample-analytics-${day}-${i}`,
        page: PAGES[Math.floor(Math.random() * PAGES.length)],
        referrer: REFERRERS[Math.floor(Math.random() * REFERRERS.length)],
        user_agent: USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        visited_at: daysAgo(day, 8 + i),
      });
    }
  }

  return entries.sort(
    (a, b) => new Date(b.visited_at).getTime() - new Date(a.visited_at).getTime()
  );
};

export const SAMPLE_ANALYTICS = generateSampleAnalytics();
