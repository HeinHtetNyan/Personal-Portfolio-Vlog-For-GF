export const IMG = {
  heroPortrait: '/hero-portrait.jpg',
  heroCollage: '/hero-collage.jpg',
  about: '/hero-collage.jpg',
  work: [
    { id: 'w1', cat: 'Dishes',      title: 'Stone Fruit & Burrata',   place: 'Studio, Lisbon', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=80&auto=format&fit=crop', h: 520 },
    { id: 'w2', cat: 'Restaurants', title: 'Noma, Copenhagen',        place: 'Kitchen Pass',   img: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80&auto=format&fit=crop', h: 680 },
    { id: 'w3', cat: 'Dishes',      title: 'Saffron Risotto',         place: 'Home Kitchen',   img: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=900&q=80&auto=format&fit=crop', h: 600 },
    { id: 'w4', cat: 'Reviews',     title: 'A Night at Septime',      place: 'Paris · 11e',    img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80&auto=format&fit=crop', h: 460 },
    { id: 'w5', cat: 'Dishes',      title: 'Rose & Pistachio',        place: 'Pastry Series',  img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=900&q=80&auto=format&fit=crop', h: 720 },
    { id: 'w6', cat: 'Restaurants', title: 'Osteria Francescana',     place: 'Modena',         img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80&auto=format&fit=crop', h: 540 },
    { id: 'w7', cat: 'Dishes',      title: 'Citrus & Olive Oil Cake', place: 'Summer Series',  img: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80&auto=format&fit=crop', h: 620 },
    { id: 'w8', cat: 'Reviews',     title: 'Tasting at Disfrutar',    place: 'Barcelona',      img: 'https://images.unsplash.com/photo-1432139509613-5c4255815697?w=900&q=80&auto=format&fit=crop', h: 480 },
    { id: 'w9', cat: 'Dishes',      title: 'Tomato Confit Tart',      place: 'August Light',   img: 'https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?w=900&q=80&auto=format&fit=crop', h: 560 },
  ],
  journal: [
    { id: 'j1', cat: 'Travel',   slug: 'slow-mornings-in-kyoto',              title: 'Slow mornings in Kyoto',              date: 'April 18, 2026',    read: '8 min', img: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1000&q=80&auto=format&fit=crop', excerpt: 'A week of tea, temples, and the quiet art of breakfast.' },
    { id: 'j2', cat: 'Food',     slug: 'everything-i-learned-from-sourdough', title: 'Everything I learned from sourdough', date: 'April 04, 2026',    read: '6 min', img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80&auto=format&fit=crop', excerpt: 'Three years in, the starter is still teaching me patience.' },
    { id: 'j3', cat: 'Vlog',     slug: 'a-day-of-markets-in-marrakech',       title: 'A day of markets in Marrakech',       date: 'March 22, 2026',    read: '5 min', img: 'https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?w=1000&q=80&auto=format&fit=crop', excerpt: 'Saffron, preserved lemon, and the colour of 4pm light.' },
    { id: 'j4', cat: 'Personal', slug: 'on-cooking-alone',                    title: 'On cooking alone',                    date: 'March 08, 2026',    read: '4 min', img: 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=1000&q=80&auto=format&fit=crop', excerpt: 'What the kitchen gives you when no one is watching.' },
    { id: 'j5', cat: 'Travel',   slug: 'three-days-on-the-amalfi-coast',      title: 'Three days on the Amalfi coast',      date: 'February 27, 2026', read: '9 min', img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&q=80&auto=format&fit=crop', excerpt: 'Lemons the size of your hand and a host named Giulia.' },
    { id: 'j6', cat: 'Food',     slug: 'butter-again',                        title: 'Butter, again',                       date: 'February 10, 2026', read: '3 min', img: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1000&q=80&auto=format&fit=crop', excerpt: 'A love letter to the ingredient I cannot stop thinking about.' },
  ],
};

export const POST_DETAIL = {
  cat: 'Travel',
  title: 'Slow mornings in Kyoto',
  date: 'April 18, 2026',
  read: '8 min read',
  cover: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1800&q=80&auto=format&fit=crop',
  intro: 'There is a particular kind of light in Kyoto at 6am — thin, blue, and completely still. I spent a week chasing it, and came home with more questions than photographs.',
  body: [
    { type: 'p', text: 'The first morning I walked to a kissaten near the Kamo river. The owner, a woman in her seventies, made me a toast that was impossibly thick and impossibly simple. Butter, a little honey, two slices of white bread that had been proofed overnight. She watched me eat it like I was a cat she was considering adopting.' },
    { type: 'img', src: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1400&q=80&auto=format&fit=crop', caption: 'Breakfast at Iyemon Salon, Shijo' },
    { type: 'pull', text: '"The best meals teach you how to slow down before they teach you anything about food."' },
    { type: 'p', text: 'I think about this often back home — how much of cooking is really just learning to pay attention. A tomato in August does not need to be improved. A pot of rice left alone will do its work. The kitchen rewards the patient.' },
    { type: 'two', a: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd?w=900&q=80&auto=format&fit=crop', b: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=900&q=80&auto=format&fit=crop' },
    { type: 'p', text: "By the end of the week I had stopped photographing everything. I sat by the river with a paper cup of matcha and watched a heron fish. It was the best meal I ate all trip, and it wasn't a meal at all." },
  ],
};
