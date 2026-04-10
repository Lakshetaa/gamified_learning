const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Lesson = require('./models/Lesson');
const Badge = require('./models/Badge');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gamified_learning';

const badges = [
  { name: 'first_lesson', title: 'First Step!', description: 'Completed your very first lesson', emoji: '🌱', color: '#4ade80', type: 'lesson', condition: 'Complete Lesson 1', pointsBonus: 20 },
  { name: 'plant_explorer', title: 'Plant Explorer', description: 'Learned all about plants', emoji: '🌿', color: '#22c55e', type: 'lesson', condition: 'Complete all plant lessons', pointsBonus: 50 },
  { name: 'quiz_star', title: 'Quiz Star', description: 'Scored 100% on a quiz', emoji: '⭐', color: '#f59e0b', type: 'quiz', condition: 'Score 100% on any quiz', pointsBonus: 30 },
  { name: 'nature_detective', title: 'Nature Detective', description: 'Discovered facts about living things', emoji: '🔍', color: '#3b82f6', type: 'lesson', condition: 'Complete lesson about living vs non-living', pointsBonus: 25 },
  { name: 'seed_master', title: 'Seed Master', description: 'Mastered how seeds grow', emoji: '🌾', color: '#a78bfa', type: 'lesson', condition: 'Complete seed lesson with 3 stars', pointsBonus: 40 },
  { name: 'streak_3', title: '3-Day Streak!', description: 'Learned for 3 days in a row', emoji: '🔥', color: '#ef4444', type: 'streak', condition: 'Login and learn for 3 consecutive days', pointsBonus: 50 },
  { name: 'chapter_champion', title: 'Chapter Champion', description: 'Completed all lessons in Chapter 1!', emoji: '🏆', color: '#f59e0b', type: 'special', condition: 'Complete all Chapter 1 lessons', pointsBonus: 100 }
];

const lessons = [
  {
    subject: 'Science',
    grade: 3,
    chapter: 1,
    chapterTitle: 'Plants & Living Things',
    lessonNumber: 1,
    title: 'What Are Living Things?',
    subtitle: 'Discover the magic of life around us!',
    emoji: '🌍',
    color: '#4ade80',
    difficulty: 'easy',
    starsReward: 3,
    pointsReward: 50,
    order: 1,
    badgeUnlock: ['first_lesson', 'nature_detective'],
    content: [
      {
        type: 'intro',
        title: 'Welcome, Explorer! 🌟',
        text: 'Look around you — there are amazing living things everywhere! Birds fly in the sky, trees grow tall, and worms dig in the soil. But what makes something "living"? Let\'s find out!',
        emoji: '🔭'
      },
      {
        type: 'concept',
        title: 'Living Things Are Special',
        text: 'Living things have amazing abilities that non-living things do not have. They can grow, breathe, eat food, move, feel, and make babies (reproduce)!',
        emoji: '✨',
        items: [
          { label: 'Grow', description: 'They get bigger over time — just like you!', emoji: '📈' },
          { label: 'Breathe', description: 'They take in air to stay alive', emoji: '💨' },
          { label: 'Eat', description: 'They need food or sunlight for energy', emoji: '🍎' },
          { label: 'Move', description: 'Even plants move slowly toward sunlight!', emoji: '🌞' },
          { label: 'Reproduce', description: 'They make babies or seeds to create more like them', emoji: '🐣' }
        ]
      },
      {
        type: 'concept',
        title: 'Non-Living Things',
        text: 'A stone, water, or a toy car cannot grow or breathe. They are non-living! But remember — water and sunlight help living things survive.',
        emoji: '🪨',
        items: [
          { label: 'Rocks & Stones', description: 'Cannot grow or move on their own', emoji: '🪨' },
          { label: 'Water', description: 'Not alive, but all living things need it!', emoji: '💧' },
          { label: 'Cars & Toys', description: 'Made by people, cannot reproduce', emoji: '🚗' },
          { label: 'Sunlight', description: 'Not alive, but gives energy to plants', emoji: '☀️' }
        ]
      },
      {
        type: 'fact',
        title: 'Fun Fact! 🤩',
        text: 'There are over 8.7 million different kinds of living things on Earth! Scientists discover new ones every single year.',
        emoji: '🌏',
        funFact: 'There are more living things in one spoonful of soil than there are people on Earth!'
      },
      {
        type: 'activity',
        title: 'Let\'s Play: Sort It Out! 🎮',
        text: 'Drag and drop each item into the correct bin — LIVING or NON-LIVING. Can you get all 8 correct?',
        emoji: '🎯',
        gameType: 'sort',
        items: [
          { label: 'Mango Tree', description: 'Living ✅ — it grows and makes fruits', emoji: '🥭' },
          { label: 'Bicycle', description: 'Non-Living ❌ — it cannot breathe or grow', emoji: '🚲' },
          { label: 'Sparrow', description: 'Living ✅ — it flies, eats, and lays eggs', emoji: '🐦' },
          { label: 'Chair', description: 'Non-Living ❌ — it was made by a carpenter', emoji: '🪑' }
        ]
      },
      {
        type: 'summary',
        title: 'What You Learned Today 🌟',
        text: 'Amazing work, Explorer! Today you learned about the difference between living and non-living things. Living things grow, breathe, eat, move, and reproduce. Non-living things cannot do these things on their own.',
        emoji: '🎉'
      }
    ],
    quiz: [
      { question: 'Which of these is a LIVING thing?', options: ['A rock', 'A mango tree', 'A toy car', 'A plastic bottle'], correctIndex: 1, explanation: 'A mango tree is living because it grows, breathes, and makes fruits!', emoji: '🌳' },
      { question: 'What do ALL living things do?', options: ['Fly in the sky', 'Swim in water', 'Breathe and grow', 'Live in houses'], correctIndex: 2, explanation: 'All living things breathe and grow — from tiny ants to giant elephants!', emoji: '💨' },
      { question: 'A sparrow lays eggs. This shows that living things can...', options: ['Play games', 'Reproduce', 'Read books', 'Build houses'], correctIndex: 1, explanation: 'Laying eggs is how a sparrow reproduces — it makes more sparrows!', emoji: '🥚' },
      { question: 'Which is NON-LIVING?', options: ['Butterfly', 'Sunflower', 'River water', 'Earthworm'], correctIndex: 2, explanation: 'River water is non-living. It helps living things but cannot grow or breathe itself.', emoji: '💧' },
      { question: 'Plants are living things because they...', options: ['Can talk to us', 'Grow and make seeds', 'Can run fast', 'Play with children'], correctIndex: 1, explanation: 'Plants grow toward sunlight and make seeds to create new plants — just like living things do!', emoji: '🌱' }
    ]
  },
  {
    subject: 'Science',
    grade: 3,
    chapter: 1,
    chapterTitle: 'Plants & Living Things',
    lessonNumber: 2,
    title: 'Parts of a Plant',
    subtitle: 'Explore every part of an amazing plant!',
    emoji: '🌿',
    color: '#22c55e',
    difficulty: 'easy',
    starsReward: 3,
    pointsReward: 50,
    order: 2,
    badgeUnlock: ['plant_explorer'],
    content: [
      {
        type: 'intro',
        title: 'Plants Are Like Superheroes! 🦸',
        text: 'Plants have special parts that work together, just like the parts of our body! Each part has a very important job. Let\'s meet the team!',
        emoji: '🌻'
      },
      {
        type: 'concept',
        title: 'The Root — Underground Hero! 🦸‍♂️',
        text: 'Roots grow underground. They hold the plant firmly in the soil so it doesn\'t fall. They also drink up water and minerals from the soil — just like a straw!',
        emoji: '🌱',
        items: [
          { label: 'Holds the plant', description: 'Like an anchor that keeps the plant steady', emoji: '⚓' },
          { label: 'Absorbs water', description: 'Sucks up water from the soil like a straw', emoji: '💧' },
          { label: 'Stores food', description: 'Carrots and radishes are actually roots we eat!', emoji: '🥕' }
        ]
      },
      {
        type: 'concept',
        title: 'The Stem — The Plant\'s Backbone! 💪',
        text: 'The stem is like the highway of the plant! It carries water from the roots up to the leaves. It also holds the plant up straight and tall.',
        emoji: '🪵',
        items: [
          { label: 'Supports the plant', description: 'Keeps the plant standing upright', emoji: '🏗️' },
          { label: 'Transports water', description: 'Like tiny pipes inside carrying water and food', emoji: '🚰' },
          { label: 'Holds leaves & flowers', description: 'Branches off to hold all parts of the plant', emoji: '🌸' }
        ]
      },
      {
        type: 'concept',
        title: 'The Leaf — The Food Factory! 🏭',
        text: 'Leaves are the most amazing part! They use sunlight, water, and air to make food for the whole plant. This process is called PHOTOSYNTHESIS. Leaves are also green because of a special substance called chlorophyll.',
        emoji: '🍃',
        items: [
          { label: 'Makes food', description: 'Uses sunlight to make food for the plant', emoji: '☀️' },
          { label: 'Breathes air', description: 'Has tiny holes to take in air (CO₂)', emoji: '🌬️' },
          { label: 'Releases oxygen', description: 'Gives us fresh air to breathe — thank you, plants!', emoji: '🌿' }
        ]
      },
      {
        type: 'concept',
        title: 'The Flower — The Colorful Messenger! 🌸',
        text: 'Flowers are not just pretty — they are very important! They attract bees and butterflies who help make seeds. Seeds grow into new plants!',
        emoji: '🌺',
        items: [
          { label: 'Attracts insects', description: 'Bees visit flowers to collect nectar', emoji: '🐝' },
          { label: 'Makes seeds', description: 'Seeds form inside flowers after pollination', emoji: '🌰' },
          { label: 'Becomes fruits', description: 'Many flowers turn into fruits we eat!', emoji: '🍎' }
        ]
      },
      {
        type: 'fact',
        title: 'Wow, Did You Know? 🤯',
        text: 'The world\'s tallest tree is a Coastal Redwood in California — it is taller than a 35-floor building! And the smallest flowering plant, Wolffia, is smaller than a grain of rice.',
        emoji: '🌲',
        funFact: 'Bamboo is the fastest-growing plant — it can grow 91 cm in just ONE day!'
      },
      {
        type: 'activity',
        title: 'Tap the Plant Parts! 🌿',
        text: 'Click each glowing dot on the plant to discover what that part does. Find all 4 parts!',
        emoji: '🎨',
        gameType: 'label'
      },
      {
        type: 'summary',
        title: 'Plant Parts Recap! 🌟',
        text: 'You are now a Plant Expert! You know that roots absorb water, stems carry water, leaves make food using sunlight, and flowers make seeds. Every part works together to keep the plant alive!',
        emoji: '🏆'
      }
    ],
    quiz: [
      { question: 'Which part of the plant absorbs water from the soil?', options: ['Leaf', 'Flower', 'Root', 'Stem'], correctIndex: 2, explanation: 'Roots are underground and absorb water and minerals from the soil like a straw!', emoji: '🌱' },
      { question: 'The stem of a plant helps to...', options: ['Make food', 'Attract bees', 'Carry water upward', 'Absorb sunlight'], correctIndex: 2, explanation: 'The stem acts like a highway — it carries water from roots to leaves!', emoji: '🪵' },
      { question: 'Leaves make food for the plant using...', options: ['Rain water only', 'Sunlight, water and air', 'Soil and roots', 'Flowers and seeds'], correctIndex: 1, explanation: 'Leaves use sunlight + water + air (CO₂) to make food. This is called photosynthesis!', emoji: '🍃' },
      { question: 'Flowers help plants to...', options: ['Drink water', 'Make new plants through seeds', 'Stand upright', 'Store food underground'], correctIndex: 1, explanation: 'Flowers attract insects that help in pollination, which leads to seeds and new plants!', emoji: '🌸' },
      { question: 'Which vegetable is actually the ROOT of a plant?', options: ['Tomato', 'Spinach', 'Carrot', 'Cauliflower'], correctIndex: 2, explanation: 'A carrot is the root of the carrot plant — that\'s why it grows underground!', emoji: '🥕' }
    ]
  },
  {
    subject: 'Science',
    grade: 3,
    chapter: 1,
    chapterTitle: 'Plants & Living Things',
    lessonNumber: 3,
    title: 'How Seeds Grow',
    subtitle: 'The incredible journey from seed to plant!',
    emoji: '🌾',
    color: '#a78bfa',
    difficulty: 'medium',
    starsReward: 3,
    pointsReward: 60,
    order: 3,
    badgeUnlock: ['seed_master'],
    content: [
      {
        type: 'intro',
        title: 'A Tiny Seed, A Big Dream! 🌱',
        text: 'Imagine — a tiny seed smaller than your fingernail can grow into a huge mango tree! How does that happen? It\'s one of nature\'s greatest wonders. Let\'s follow the journey!',
        emoji: '🌟'
      },
      {
        type: 'concept',
        title: 'What\'s Inside a Seed?',
        text: 'A seed is like a tiny package with everything a new plant needs to start life! Inside every seed there is a baby plant (embryo) and stored food to help it grow.',
        emoji: '🌰',
        items: [
          { label: 'Seed coat', description: 'The hard outer shell that protects the baby plant', emoji: '🛡️' },
          { label: 'Baby plant (Embryo)', description: 'The tiny plant waiting to sprout', emoji: '🌱' },
          { label: 'Stored food (Cotyledon)', description: 'Food reserves for the baby plant to eat until it can make its own', emoji: '🍱' }
        ]
      },
      {
        type: 'concept',
        title: 'The Journey: Germination! 🚀',
        text: 'When a seed gets water, warmth, and air — it wakes up and starts growing! This waking up is called GERMINATION. Here are the stages:',
        emoji: '📅',
        items: [
          { label: 'Stage 1: Seed absorbs water', description: 'The seed drinks water and swells up (gets bigger)', emoji: '💧' },
          { label: 'Stage 2: Seed coat cracks', description: 'The outer shell breaks open as the plant grows inside', emoji: '🔓' },
          { label: 'Stage 3: Root grows down', description: 'A tiny root pushes down into the soil to drink more water', emoji: '⬇️' },
          { label: 'Stage 4: Shoot grows up', description: 'A tiny green shoot pushes up toward the sunlight', emoji: '⬆️' },
          { label: 'Stage 5: First leaves appear', description: 'The seedling opens its first leaves and starts making food!', emoji: '🌿' }
        ]
      },
      {
        type: 'concept',
        title: 'What Seeds Need to Grow',
        text: 'Seeds are patient but picky! They need 3 important things to germinate. Without these, a seed will just sleep and wait.',
        emoji: '🔑',
        items: [
          { label: 'Water 💧', description: 'Water softens the seed coat and wakes the baby plant', emoji: '🌧️' },
          { label: 'Warmth 🌡️', description: 'Seeds need the right temperature — not too hot, not too cold', emoji: '☀️' },
          { label: 'Air 🌬️', description: 'Seeds need oxygen from the air to start growing', emoji: '💨' }
        ]
      },
      {
        type: 'fact',
        title: 'Amazing Seed Facts! 🤩',
        text: 'Seeds can travel amazing distances before finding a place to grow! Wind, water, animals, and even humans help seeds travel.',
        emoji: '✈️',
        funFact: 'A 2000-year-old date palm seed found in Israel was successfully grown! Seeds can sleep for thousands of years!'
      },
      {
        type: 'concept',
        title: 'How Seeds Travel 🗺️',
        text: 'Seeds need to move away from the parent plant so they have space and sunlight to grow. They travel in clever ways!',
        emoji: '🌍',
        items: [
          { label: 'By Wind 🌬️', description: 'Dandelion and coconut seeds float through the air', emoji: '🌼' },
          { label: 'By Water 🌊', description: 'Coconuts float on water to reach new shores', emoji: '🥥' },
          { label: 'By Animals 🐿️', description: 'Animals eat fruits and drop seeds in new places', emoji: '🦊' },
          { label: 'By Humans 👨‍🌾', description: 'Farmers plant seeds in fields on purpose!', emoji: '🌾' }
        ]
      },
      {
        type: 'activity',
        title: 'Watch a Seed Grow! 🌱',
        text: 'Step through each stage of germination — from dry seed to seedling. Press the arrows to watch the plant grow!',
        emoji: '🧪',
        gameType: 'sequence'
      },
      {
        type: 'summary',
        title: 'Seed Journey Complete! 🏆',
        text: 'You are now a Seed Master! You know that seeds have a baby plant inside, germination is when a seed starts to grow, and seeds need water + warmth + air. Seeds travel by wind, water, animals, and humans!',
        emoji: '🌟'
      }
    ],
    quiz: [
      { question: 'What is GERMINATION?', options: ['When a plant makes seeds', 'When a seed starts to grow into a plant', 'When leaves fall off', 'When a plant drinks water'], correctIndex: 1, explanation: 'Germination is the process when a seed wakes up and starts growing into a new plant!', emoji: '🌱' },
      { question: 'What do seeds need to germinate? Choose the best answer:', options: ['Sunlight, soil and wind', 'Water, warmth and air', 'Flowers, fruit and food', 'Roots, stem and leaves'], correctIndex: 1, explanation: 'Seeds need water to soften, warmth to activate, and air (oxygen) to grow!', emoji: '💧' },
      { question: 'In which order does a seed germinate?', options: ['Leaves → Root → Shoot', 'Water absorbed → Root grows → Shoot grows up', 'Flower → Seed → Fruit', 'Stem → Leaf → Root'], correctIndex: 1, explanation: 'First water is absorbed, then the root pushes down, then the shoot pushes up toward light!', emoji: '📈' },
      { question: 'A dandelion seed floats in the air. How does it travel?', options: ['By water', 'By animals', 'By wind', 'By humans'], correctIndex: 2, explanation: 'Dandelion seeds have fluffy parts that catch the wind and float to new places!', emoji: '🌼' },
      { question: 'What protects the baby plant inside a seed?', options: ['The leaf', 'The flower', 'The stem', 'The seed coat'], correctIndex: 3, explanation: 'The hard seed coat (outer shell) protects the baby plant until conditions are right to grow!', emoji: '🛡️' }
    ]
  },
  {
    subject: 'Science',
    grade: 3,
    chapter: 1,
    chapterTitle: 'Plants & Living Things',
    lessonNumber: 4,
    title: 'Plants We Use',
    subtitle: 'Discover how plants help us every day!',
    emoji: '🍎',
    color: '#f59e0b',
    difficulty: 'easy',
    starsReward: 3,
    pointsReward: 50,
    order: 4,
    badgeUnlock: ['plant_explorer'],
    content: [
      {
        type: 'intro',
        title: 'Plants Are Our Best Friends! 🌟',
        text: 'Can you imagine life without plants? No food, no fresh air, no wood, no medicines! Plants give us so much. Let\'s discover all the ways plants help us in our daily life.',
        emoji: '🌿'
      },
      {
        type: 'concept',
        title: 'Plants Give Us Food 🍽️',
        text: 'Most of the food we eat comes from plants! Different parts of plants give us different foods.',
        emoji: '🥗',
        items: [
          { label: 'Fruits 🍎', description: 'Mango, apple, banana — sweet fruits we love!', emoji: '🍊' },
          { label: 'Vegetables 🥦', description: 'Spinach, tomato, carrot — keep us healthy!', emoji: '🥕' },
          { label: 'Grains 🌾', description: 'Rice, wheat, and corn give us energy', emoji: '🍚' },
          { label: 'Nuts & Seeds 🥜', description: 'Groundnuts, almonds — full of protein!', emoji: '🌰' },
          { label: 'Spices 🌶️', description: 'Pepper, turmeric, ginger make food tasty and healthy', emoji: '🧄' }
        ]
      },
      {
        type: 'concept',
        title: 'Plants Give Us Fresh Air 🌬️',
        text: 'Every time you breathe, thank a plant! Plants take in carbon dioxide (the air we breathe out) and release oxygen (the air we need to live). One large tree can provide oxygen for 4 people for a whole day!',
        emoji: '🌳',
        items: [
          { label: 'We breathe OUT CO₂', description: 'Plants absorb this and use it to make food', emoji: '😤' },
          { label: 'Plants release O₂', description: 'We breathe this oxygen to stay alive', emoji: '🌿' }
        ]
      },
      {
        type: 'concept',
        title: 'Plants Give Us Shelter & Materials 🏠',
        text: 'Wood from trees is used to build houses, make furniture, and create paper. Bamboo is used to build huts in villages. Cotton plants give us soft cloth to wear!',
        emoji: '🪵',
        items: [
          { label: 'Wood 🪵', description: 'Trees give wood for houses, doors, and furniture', emoji: '🏚️' },
          { label: 'Cotton 👕', description: 'Cotton plant fibers are spun into cloth and clothes', emoji: '🧵' },
          { label: 'Bamboo 🎋', description: 'Used to make baskets, homes, and furniture', emoji: '🧺' },
          { label: 'Paper 📄', description: 'Books and notebooks are made from tree pulp', emoji: '📚' }
        ]
      },
      {
        type: 'concept',
        title: 'Plants Give Us Medicine 💊',
        text: 'Many medicines come from plants! In villages, people use plants to treat illnesses — this is called herbal medicine. It has been used for thousands of years!',
        emoji: '🌿',
        items: [
          { label: 'Neem 🌿', description: 'Neem leaves kill germs and are used for skin problems', emoji: '🌱' },
          { label: 'Tulsi (Holy Basil)', description: 'Used for colds and coughs — very common in India!', emoji: '🍵' },
          { label: 'Turmeric 💛', description: 'Has healing properties — used in cooking and medicine', emoji: '🟡' },
          { label: 'Aloe Vera', description: 'Soothes burns and skin problems', emoji: '🌵' }
        ]
      },
      {
        type: 'fact',
        title: 'Save Our Plant Friends! 🌍',
        text: 'Every year, many forests are cut down. This is called deforestation. When trees disappear, animals lose their homes and we get less fresh air. We must protect our plants!',
        emoji: '⚠️',
        funFact: 'India has over 45,000 species of plants! Our country is one of the richest in plant life in the whole world.'
      },
      {
        type: 'activity',
        title: 'Plant Treasure Hunt! 🔍',
        text: 'Look around your kitchen and home. Write down 10 things that come from plants. Check your food, clothes, furniture, and medicines. How many can you find?',
        emoji: '🏠'
      },
      {
        type: 'summary',
        title: 'Plant Heroes! 🌟',
        text: 'Plants are truly amazing! They give us food, oxygen to breathe, wood and cotton for shelter and clothes, and medicines to heal us. Without plants, life on Earth would be impossible. Let\'s always respect and protect our green friends!',
        emoji: '💚'
      }
    ],
    quiz: [
      { question: 'Which part of the plant do we eat when we eat a carrot?', options: ['Leaf', 'Flower', 'Root', 'Stem'], correctIndex: 2, explanation: 'A carrot is the root of the carrot plant! Roots can store food which we eat.', emoji: '🥕' },
      { question: 'Plants help us breathe by releasing...', options: ['Carbon dioxide', 'Oxygen', 'Water vapor', 'Smoke'], correctIndex: 1, explanation: 'Plants absorb CO₂ and release oxygen through photosynthesis — giving us fresh air!', emoji: '🌬️' },
      { question: 'Which plant is used to make our clothes?', options: ['Neem', 'Tulsi', 'Cotton', 'Bamboo'], correctIndex: 2, explanation: 'Cotton fibers from the cotton plant are used to make cloth for our clothes!', emoji: '👕' },
      { question: 'Neem leaves are known for...', options: ['Sweet taste', 'Killing germs and healing skin', 'Making paper', 'Giving us fruits'], correctIndex: 1, explanation: 'Neem has antibacterial properties — it kills germs and is used for skin problems and toothaches!', emoji: '🌿' },
      { question: 'What is DEFORESTATION?', options: ['Planting more trees', 'Watering plants', 'Cutting down forests', 'Making medicines from plants'], correctIndex: 2, explanation: 'Deforestation means cutting down forests. This is harmful because trees give us oxygen and shelter to animals!', emoji: '🌳' }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Lesson.deleteMany({});
    await Badge.deleteMany({});

    await Badge.insertMany(badges);
    console.log(`✅ ${badges.length} badges seeded`);

    await Lesson.insertMany(lessons);
    console.log(`✅ ${lessons.length} lessons seeded`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('📚 Lessons: What Are Living Things?, Parts of a Plant, How Seeds Grow, Plants We Use');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
