export const POSTS = [
  { id: 'p1', title: 'A slow morning in Oaxaca',           category: 'Travel',   date: 'Apr 18, 2026', status: 'Published', cover: 'linear-gradient(135deg, #F4C4A0, #E89880)', views: 1240, excerpt: 'On the smell of corn smoke and the woman who taught me about mole negro.' },
  { id: 'p2', title: 'Three ways with brown butter',        category: 'Food',     date: 'Apr 14, 2026', status: 'Published', cover: 'linear-gradient(135deg, #D4B07A, #A67F48)', views: 890,  excerpt: 'The alchemy of milk solids browning — a kitchen meditation.' },
  { id: 'p3', title: 'Vlog — kitchen residency, week two', category: 'Vlog',     date: 'Apr 11, 2026', status: 'Draft',     cover: 'linear-gradient(135deg, #B8A4CE, #8E75AA)', views: 0,    excerpt: '' },
  { id: 'p4', title: 'Letters from a rainy Kyoto',          category: 'Travel',   date: 'Apr 7, 2026',  status: 'Published', cover: 'linear-gradient(135deg, #A8B5A0, #7A8C6E)', views: 2100, excerpt: 'Temples, tempura, and the particular grey of an April afternoon.' },
  { id: 'p5', title: 'On cooking alone',                    category: 'Personal', date: 'Apr 3, 2026',  status: 'Published', cover: 'linear-gradient(135deg, #E8B4B8, #C8848A)', views: 3420, excerpt: 'A case for the quiet pleasure of making dinner only for yourself.' },
  { id: 'p6', title: 'Notes from Noma — service six',       category: 'Food',     date: 'Mar 29, 2026', status: 'Draft',     cover: 'linear-gradient(135deg, #9BB5AA, #6A8478)', views: 0,    excerpt: '' },
  { id: 'p7', title: 'Lisbon, pastéis, and the wrong bus',  category: 'Travel',   date: 'Mar 22, 2026', status: 'Published', cover: 'linear-gradient(135deg, #F0D4A8, #D4A870)', views: 1680, excerpt: 'How getting lost became the best part of the trip.' },
  { id: 'p8', title: 'The case for very small dinners',     category: 'Personal', date: 'Mar 15, 2026', status: 'Published', cover: 'linear-gradient(135deg, #D4C0D4, #A688A6)', views: 980,  excerpt: '' },
];

export const WORK = [
  { id: 'w1', title: 'Citrus & fennel tartare',        type: 'Dish',       location: 'Home kitchen', swatch: 'linear-gradient(135deg, #F4C4A0, #E89880)' },
  { id: 'w2', title: 'Bar Tartine, service notes',     type: 'Restaurant', location: 'San Francisco', swatch: 'linear-gradient(135deg, #D4B07A, #A67F48)' },
  { id: 'w3', title: 'Sakura mochi — iteration 3',     type: 'Dish',       location: 'Home kitchen', swatch: 'linear-gradient(135deg, #E8B4B8, #C8848A)' },
  { id: 'w4', title: 'Frenchie, Paris — review',       type: 'Review',     location: 'Paris', swatch: 'linear-gradient(135deg, #A8B5A0, #7A8C6E)' },
  { id: 'w5', title: 'Heirloom tomato plate',          type: 'Dish',       location: 'Home kitchen', swatch: 'linear-gradient(135deg, #F0A890, #C87864)' },
  { id: 'w6', title: 'Hija de Sanchez, a love letter', type: 'Review',     location: 'Copenhagen', swatch: 'linear-gradient(135deg, #B8A4CE, #8E75AA)' },
  { id: 'w7', title: 'Miso-cured yolks',               type: 'Dish',       location: 'Home kitchen', swatch: 'linear-gradient(135deg, #E8CE90, #C8A858)' },
  { id: 'w8', title: 'Le Servan, quiet Tuesday',       type: 'Restaurant', location: 'Paris', swatch: 'linear-gradient(135deg, #9BB5AA, #6A8478)' },
  { id: 'w9', title: 'Rhubarb & cardamom galette',     type: 'Dish',       location: 'Home kitchen', swatch: 'linear-gradient(135deg, #E8A4B0, #C87484)' },
];

export const MEDIA = [
  { id: 'm1',  kind: 'image', name: 'oaxaca-market-01.jpg',   size: '2.4 MB', date: 'Apr 18', swatch: 'linear-gradient(135deg, #F4C4A0, #E89880)' },
  { id: 'm2',  kind: 'image', name: 'mole-negro-process.jpg', size: '1.8 MB', date: 'Apr 18', swatch: 'linear-gradient(135deg, #8A6850, #5A4030)' },
  { id: 'm3',  kind: 'video', name: 'kitchen-residency.mp4',  size: '48 MB',  date: 'Apr 14', swatch: 'linear-gradient(135deg, #B8A4CE, #8E75AA)' },
  { id: 'm4',  kind: 'image', name: 'brown-butter-hero.jpg',  size: '3.1 MB', date: 'Apr 14', swatch: 'linear-gradient(135deg, #D4B07A, #A67F48)' },
  { id: 'm5',  kind: 'image', name: 'kyoto-rain.jpg',         size: '2.0 MB', date: 'Apr 7',  swatch: 'linear-gradient(135deg, #A8B5A0, #7A8C6E)' },
  { id: 'm6',  kind: 'image', name: 'kyoto-temple.jpg',       size: '2.9 MB', date: 'Apr 7',  swatch: 'linear-gradient(135deg, #7A8C9A, #50606E)' },
  { id: 'm7',  kind: 'image', name: 'cooking-alone-01.jpg',   size: '1.6 MB', date: 'Apr 3',  swatch: 'linear-gradient(135deg, #E8B4B8, #C8848A)' },
  { id: 'm8',  kind: 'image', name: 'cooking-alone-02.jpg',   size: '1.4 MB', date: 'Apr 3',  swatch: 'linear-gradient(135deg, #F0C4C8, #D08488)' },
  { id: 'm9',  kind: 'image', name: 'noma-plate-06.jpg',      size: '2.2 MB', date: 'Mar 29', swatch: 'linear-gradient(135deg, #9BB5AA, #6A8478)' },
  { id: 'm10', kind: 'video', name: 'lisbon-walking.mp4',     size: '62 MB',  date: 'Mar 22', swatch: 'linear-gradient(135deg, #F0D4A8, #D4A870)' },
  { id: 'm11', kind: 'image', name: 'pasteis-close.jpg',      size: '1.9 MB', date: 'Mar 22', swatch: 'linear-gradient(135deg, #F4D890, #D8B048)' },
  { id: 'm12', kind: 'image', name: 'small-dinners-01.jpg',   size: '2.1 MB', date: 'Mar 15', swatch: 'linear-gradient(135deg, #D4C0D4, #A688A6)' },
];

export const MESSAGES = [
  { id: 'msg1', name: 'Sofia Marques',  email: 'sofia@cn-press.com',   category: 'Press',         preview: 'Hi July, I write for Cereal magazine and I loved your Oaxaca piece…', read: false, date: '2h ago',  full: "Hi July,\n\nI write for Cereal magazine and I absolutely loved your Oaxaca piece — especially the bit about the woman who taught you mole negro. We're putting together a spring issue on 'the slow kitchen' and I wondered if you'd be open to a feature interview. Happy to send more details.\n\nWarmly,\nSofia" },
  { id: 'msg2', name: 'Noah Patel',     email: 'noah@kinfolk.co',       category: 'Collaboration', preview: "We're producing a short film series about home cooks and I'd love to chat.", read: false, date: '5h ago',  full: "We're producing a short film series about home cooks and we'd love to include you. The series is called 'Made Slowly' and we're documenting people who approach cooking as a practice rather than a performance. Would love to set up a call." },
  { id: 'msg3', name: 'Elena Voss',     email: 'elena.voss@gmail.com',  category: 'Reader',        preview: 'Your essay on cooking alone made me cry on the train. Thank you.',        read: true,  date: '1d ago',  full: "Your essay on cooking alone made me cry on the train. Thank you for writing it. I've been living alone for two years after a long relationship and I've been dreading cooking. Somehow reading your words made me want to make dinner tonight." },
  { id: 'msg4', name: 'Jun Takahashi',  email: 'jun@baum-supply.jp',    category: 'Sponsorship',   preview: "We'd love to send you our new ceramics line — no strings, just because.",  read: true,  date: '2d ago',  full: "We'd love to send you our new ceramics line — no strings attached, just because we've been following your work and think you'd appreciate them. Our studio is in Kyoto and we make functional pieces for everyday kitchen use." },
  { id: 'msg5', name: 'Margot Lefèvre', email: 'margot@serredor.fr',    category: 'Collaboration', preview: "I'm opening a small restaurant in Arles and your photography is exactly…",   read: true,  date: '3d ago',  full: "I'm opening a small restaurant in Arles and your photography is exactly the mood I want to capture. Would you be open to collaborating on the visual identity? Nothing huge — just a conversation to start." },
  { id: 'msg6', name: 'David Chen',     email: 'david@saveur.com',      category: 'Press',         preview: "Editor at Saveur. Would love to commission a piece on your Kyoto trip.",  read: true,  date: '5d ago',  full: "I'm an editor at Saveur and I loved your Kyoto letters on the journal. We'd love to commission a longer piece — something in the range of 2,500 words with your photography. Would you be open to discussing terms?" },
];

export const ACTIVITY = [
  { icon: 'edit',    text: 'Published "A slow morning in Oaxaca"',     textBold: 'A slow morning in Oaxaca',      time: '2h ago' },
  { icon: 'upload',  text: 'Uploaded 3 images to Media Library',        textBold: '3 images',                     time: '5h ago' },
  { icon: 'message', text: 'New message from Sofia Marques',            textBold: 'Sofia Marques',                time: '8h ago' },
  { icon: 'edit',    text: 'Drafted "Notes from Noma — service six"',   textBold: 'Notes from Noma — service six', time: '1d ago' },
  { icon: 'eye',     text: '"Kyoto letters" reached 2,000 views',       textBold: 'Kyoto letters',                time: '2d ago' },
];
