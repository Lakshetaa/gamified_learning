// Interactive content configurations for each lesson section
// Each section can have an `interactive` property that maps to a component in InteractiveModule

export const INTERACTIVE_LESSONS = {
  1: { // Lesson 1: What Are Living Things?
    sections: [
      {
        type: 'intro',
        title: 'Welcome, Explorer! 🌟',
        text: 'Look around you — there are amazing living things everywhere! Birds fly in the sky, trees grow tall, and worms dig in the soil. But what makes something "living"? Let\'s find out together!',
        emoji: '🔭'
      },
      {
        type: 'concept',
        title: '5 Signs of a Living Thing',
        text: 'All living things share 5 special abilities. These are what make them "alive"! Tap each card to learn more.',
        emoji: '✨',
        interactive: {
          type: 'flip',
          cards: [
            { emoji: '📈', front: 'They GROW', back: 'All living things get bigger over time. A tiny seed grows into a tall tree. A baby grows into an adult!', frontBg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
            { emoji: '💨', front: 'They BREATHE', back: 'Living things take in air (oxygen) to stay alive. Plants breathe through tiny holes in their leaves!', frontBg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)' },
            { emoji: '🍎', front: 'They EAT', back: 'Animals eat food for energy. Plants make their own food using sunlight — so clever!', frontBg: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
            { emoji: '🌞', front: 'They MOVE', back: 'Animals walk and run. Even plants slowly move — they turn their leaves toward sunlight!', frontBg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
            { emoji: '🐣', front: 'They REPRODUCE', back: 'All living things make babies! Dogs have puppies, birds lay eggs, and plants make seeds.', frontBg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)' },
          ]
        }
      },
      {
        type: 'activity',
        title: 'Sort It Out! 🎯',
        text: 'Drag each thing into the correct box — LIVING or NON-LIVING. Remember: living things grow, breathe, eat, move, and reproduce!',
        emoji: '🎮',
        interactive: {
          type: 'sort',
          items: [
            { id: 'tree', label: 'Mango Tree', emoji: '🌳', category: 'living' },
            { id: 'rock', label: 'Stone', emoji: '🪨', category: 'nonliving' },
            { id: 'bird', label: 'Sparrow', emoji: '🐦', category: 'living' },
            { id: 'chair', label: 'Wooden Chair', emoji: '🪑', category: 'nonliving' },
            { id: 'worm', label: 'Earthworm', emoji: '🪱', category: 'living' },
            { id: 'water', label: 'River Water', emoji: '💧', category: 'nonliving' },
            { id: 'flower', label: 'Sunflower', emoji: '🌻', category: 'living' },
            { id: 'car', label: 'Toy Car', emoji: '🚗', category: 'nonliving' },
          ],
          categories: [
            { id: 'living', label: 'Living Things', emoji: '🌿', bg: '#f0fdf4', highlightBg: '#dcfce7', border: '#86efac', borderActive: '#16a34a' },
            { id: 'nonliving', label: 'Non-Living Things', emoji: '🪨', bg: '#f9fafb', highlightBg: '#f1f5f9', border: '#cbd5e1', borderActive: '#64748b' },
          ]
        }
      },
      {
        type: 'fact',
        title: 'True or False? Quick Fire Round! ⚡',
        text: 'Let\'s test what you just learned! Answer TRUE or FALSE for each statement.',
        emoji: '🤔',
        interactive: {
          type: 'truefalse',
          statements: [
            { emoji: '🦋', statement: 'A butterfly is a living thing because it can fly and lay eggs.', answer: true, explanation: 'TRUE — butterflies grow, breathe, eat, move and reproduce!' },
            { emoji: '💧', statement: 'Water is a living thing because all animals need it to survive.', answer: false, explanation: 'FALSE — water cannot grow or reproduce. It helps living things but is not alive itself.' },
            { emoji: '🌵', statement: 'A cactus is living even though it lives in a dry desert.', answer: true, explanation: 'TRUE — a cactus grows, breathes, and makes seeds. It adapted to survive in dry places!' },
            { emoji: '🤖', statement: 'A robot can think and move, so it is a living thing.', answer: false, explanation: 'FALSE — robots are made by humans and cannot grow, breathe, or reproduce on their own.' },
          ]
        }
      },
      {
        type: 'summary',
        title: 'What You Learned Today! 🌟',
        text: 'You are now an Explorer of Life! Fill in the blanks to complete your lesson summary.',
        emoji: '🏆',
        interactive: {
          type: 'fillblank',
          sentences: [
            { before: 'Living things can', after: ',  breathe, eat, move and reproduce.', answers: ['grow', 'GROW', 'Grow'], hint: 'Living things get bigger over time!' },
            { before: 'A stone is a', after: 'thing because it cannot grow or breathe.', answers: ['non-living', 'nonliving', 'non living'], hint: 'It is the opposite of living!' },
            { before: 'Plants make their own', after: 'using sunlight — this is called photosynthesis.', answers: ['food', 'Food', 'FOOD'], hint: 'What do we all need to survive?' },
          ]
        }
      }
    ]
  },

  2: { // Lesson 2: Parts of a Plant
    sections: [
      {
        type: 'intro',
        title: 'Meet the Plant Team! 🌻',
        text: 'Every plant has different parts, and each part does a very important job — just like players in a cricket team! Let\'s meet each player and discover their superpower.',
        emoji: '🦸'
      },
      {
        type: 'concept',
        title: 'Click to Explore Plant Parts! 🌿',
        text: 'This is a plant diagram. Click on each part to discover its job. Can you find all 4 parts?',
        emoji: '🔍',
        interactive: {
          type: 'diagram',
          title: 'Parts of a Plant',
          parts: [
            { emoji: '🌸', label: 'Flower', size: '36px', color: '#ec4899', description: 'The flower attracts bees and butterflies with its bright colours and sweet smell. Bees help transfer pollen, which leads to seeds being made!', funFact: 'Some flowers only open at night to attract moths!' },
            { emoji: '🍃', label: 'Leaf', size: '32px', color: '#16a34a', description: 'Leaves are the food factory of the plant! They use sunlight, water, and carbon dioxide to make food. This amazing process is called PHOTOSYNTHESIS.', funFact: 'One large tree makes enough oxygen for 4 people to breathe every day!' },
            { emoji: '🪵', label: 'Stem', size: '28px', color: '#92400e', description: 'The stem is like a highway — it carries water and minerals from the roots up to the leaves. It also holds the plant upright so it can reach sunlight.', funFact: 'A tree trunk is actually a very thick, woody stem!' },
            { emoji: '🌱', label: 'Root', size: '28px', color: '#854d0e', description: 'Roots grow underground and do two important jobs: they anchor the plant firmly in soil so it doesn\'t fall, and they absorb water and minerals like a straw!', funFact: 'Carrots and radishes are roots that we eat!' },
          ]
        }
      },
      {
        type: 'activity',
        title: 'Match the Part to Its Job! 🎯',
        text: 'Can you match each plant part on the left with what it does on the right? Click a part, then click its job!',
        emoji: '🧩',
        interactive: {
          type: 'match',
          pairs: [
            { id: 'root', left: 'Root', leftEmoji: '🌱', right: 'Absorbs water from soil', rightEmoji: '💧' },
            { id: 'stem', left: 'Stem', leftEmoji: '🪵', right: 'Carries water to leaves', rightEmoji: '🚰' },
            { id: 'leaf', left: 'Leaf', leftEmoji: '🍃', right: 'Makes food using sunlight', rightEmoji: '☀️' },
            { id: 'flower', left: 'Flower', leftEmoji: '🌸', right: 'Attracts bees & makes seeds', rightEmoji: '🐝' },
          ]
        }
      },
      {
        type: 'concept',
        title: 'Plants We Can Eat! 🥗',
        text: 'Different parts of plants become the food on our plate! Can you sort these foods into which plant part they come from?',
        emoji: '🍽️',
        interactive: {
          type: 'sort',
          items: [
            { id: 'carrot', label: 'Carrot', emoji: '🥕', category: 'root' },
            { id: 'mango', label: 'Mango', emoji: '🥭', category: 'fruit' },
            { id: 'spinach', label: 'Spinach', emoji: '🥬', category: 'leaf' },
            { id: 'cauliflower', label: 'Cauliflower', emoji: '🥦', category: 'flower' },
            { id: 'radish', label: 'Radish', emoji: '🔴', category: 'root' },
            { id: 'banana', label: 'Banana', emoji: '🍌', category: 'fruit' },
            { id: 'tulsi', label: 'Tulsi leaf', emoji: '🌿', category: 'leaf' },
          ],
          categories: [
            { id: 'root', label: 'Root', emoji: '🌱', bg: '#fff7ed', highlightBg: '#ffedd5', border: '#fed7aa', borderActive: '#ea580c' },
            { id: 'leaf', label: 'Leaf', emoji: '🍃', bg: '#f0fdf4', highlightBg: '#dcfce7', border: '#86efac', borderActive: '#16a34a' },
            { id: 'flower', label: 'Flower', emoji: '🌸', bg: '#fdf2f8', highlightBg: '#fce7f3', border: '#f9a8d4', borderActive: '#ec4899' },
            { id: 'fruit', label: 'Fruit', emoji: '🍎', bg: '#fef2f2', highlightBg: '#fee2e2', border: '#fca5a5', borderActive: '#dc2626' },
          ]
        }
      },
      {
        type: 'summary',
        title: 'Plant Parts Recap! ✍️',
        text: 'Complete these sentences to show what you\'ve learned about plant parts.',
        emoji: '📝',
        interactive: {
          type: 'fillblank',
          sentences: [
            { before: 'The', after: 'holds the plant in soil and drinks water.', answers: ['root', 'Root'], hint: 'It grows underground!' },
            { before: 'The', after: 'carries water from roots to leaves.', answers: ['stem', 'Stem'], hint: 'Like a highway inside the plant!' },
            { before: 'Leaves make food using sunlight through a process called', after: '.', answers: ['photosynthesis', 'Photosynthesis'], hint: 'Photo = light, synthesis = making' },
            { before: 'Flowers attract', after: 'which help create new seeds.', answers: ['bees', 'Bees', 'insects'], hint: 'These small flying insects love nectar!' },
          ]
        }
      }
    ]
  },

  3: { // Lesson 3: How Seeds Grow
    sections: [
      {
        type: 'intro',
        title: 'A Tiny Seed, A Giant Dream! 🌱',
        text: 'A seed smaller than your fingernail can grow into a tall tree. How? It\'s one of nature\'s greatest magic tricks! Let\'s follow the incredible journey from seed to plant.',
        emoji: '🌟'
      },
      {
        type: 'concept',
        title: 'What\'s Inside a Seed? 🔬',
        text: 'A seed looks simple on the outside, but it holds a beautiful secret! Tap each card to unpack what\'s inside.',
        emoji: '🌰',
        interactive: {
          type: 'flip',
          cards: [
            { emoji: '🛡️', front: 'Seed Coat', back: 'The tough outer shell that protects the baby plant inside. It keeps the plant safe until conditions are just right to grow!', frontBg: 'linear-gradient(135deg,#fef3c7,#fde68a)' },
            { emoji: '🌱', front: 'Baby Plant (Embryo)', back: 'The tiny plant sleeping inside the seed, waiting for water and warmth to wake it up and start growing!', frontBg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' },
            { emoji: '🍱', front: 'Stored Food (Cotyledon)', back: 'Food packed inside the seed to feed the baby plant until it grows leaves and can make its own food through photosynthesis!', frontBg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
          ]
        }
      },
      {
        type: 'activity',
        title: 'Watch a Seed Sprout! 🚀',
        text: 'Click "Next Step" to walk through germination — the journey of a seed waking up and growing into a plant!',
        emoji: '📽️',
        interactive: {
          type: 'sequence',
          steps: [
            { emoji: '💧', title: 'Step 1: Seed Absorbs Water', description: 'When it rains or someone waters the soil, the seed soaks up water. This makes it swell up and wake from its deep sleep!' },
            { emoji: '🔓', title: 'Step 2: Seed Coat Cracks Open', description: 'The outer shell softens and splits open. The baby plant inside can now start its journey outward!' },
            { emoji: '⬇️', title: 'Step 3: Root Pushes Downward', description: 'The first tiny root pushes down into the soil. It anchors the plant and starts drinking more water and minerals!' },
            { emoji: '⬆️', title: 'Step 4: Shoot Pushes Upward', description: 'A tiny green shoot pushes up through the soil toward light. It follows the sunlight like a tiny explorer!' },
            { emoji: '🌿', title: 'Step 5: First Leaves Appear!', description: 'The seedling opens its first two leaves. Now it can make its own food using sunlight — the photosynthesis factory is open!' },
            { emoji: '🌳', title: 'Step 6: Full Plant Grows!', description: 'With enough water, sunlight, and nutrients, the seedling grows into a full plant — ready to make flowers and seeds of its own!' },
          ]
        }
      },
      {
        type: 'concept',
        title: 'Seeds Are Clever Travellers! ✈️',
        text: 'Seeds need to travel away from their parent plant to find space and sunlight. They\'ve invented amazing ways to travel! Match each seed to how it travels.',
        emoji: '🗺️',
        interactive: {
          type: 'match',
          pairs: [
            { id: 'wind', left: 'Dandelion', leftEmoji: '🌼', right: 'Floats through the air by wind', rightEmoji: '🌬️' },
            { id: 'water', left: 'Coconut', leftEmoji: '🥥', right: 'Floats across water to new shores', rightEmoji: '🌊' },
            { id: 'animal', left: 'Mango', leftEmoji: '🥭', right: 'Eaten by animals, seeds dropped far away', rightEmoji: '🐒' },
            { id: 'human', left: 'Wheat', leftEmoji: '🌾', right: 'Planted by farmers in fields', rightEmoji: '👨‍🌾' },
          ]
        }
      },
      {
        type: 'fact',
        title: 'True or False: Seed Secrets! ⚡',
        text: 'How well do you know seeds? Answer each statement!',
        emoji: '🤔',
        interactive: {
          type: 'truefalse',
          statements: [
            { emoji: '💧', statement: 'Seeds need water, warmth and air to germinate (start growing).', answer: true, explanation: 'TRUE — all three are needed to wake a seed from its sleep!' },
            { emoji: '☀️', statement: 'Seeds need sunlight to germinate.', answer: false, explanation: 'FALSE — seeds germinate underground without sunlight. Only after sprouting do they need light!' },
            { emoji: '🥕', statement: 'A carrot is actually the root of the carrot plant.', answer: true, explanation: 'TRUE — we eat the root of a carrot plant, which stores food underground!' },
            { emoji: '🌰', statement: 'All seeds are the same size.', answer: false, explanation: 'FALSE — seeds range from tiny orchid seeds (like dust!) to huge coconuts!' },
          ]
        }
      }
    ]
  },

  4: { // Lesson 4: Plants We Use
    sections: [
      {
        type: 'intro',
        title: 'Plants Are Our Best Friends! 💚',
        text: 'Can you imagine life without plants? No food, no fresh air, no wood, no medicines! Plants give us everything we need to survive. Let\'s discover all the incredible ways plants help us!',
        emoji: '🌍'
      },
      {
        type: 'concept',
        title: 'Plants Give Us Food 🍽️',
        text: 'Most of our food comes from plants! Let\'s sort these foods by which plant part we eat. Drag each food to the right box!',
        emoji: '🥗',
        interactive: {
          type: 'sort',
          items: [
            { id: 'rice', label: 'Rice', emoji: '🍚', category: 'seeds' },
            { id: 'potato', label: 'Potato', emoji: '🥔', category: 'underground' },
            { id: 'apple', label: 'Apple', emoji: '🍎', category: 'fruits' },
            { id: 'mint', label: 'Mint', emoji: '🌿', category: 'leaves' },
            { id: 'wheat', label: 'Wheat', emoji: '🌾', category: 'seeds' },
            { id: 'onion', label: 'Onion', emoji: '🧅', category: 'underground' },
            { id: 'tomato', label: 'Tomato', emoji: '🍅', category: 'fruits' },
            { id: 'coriander', label: 'Coriander', emoji: '🫚', category: 'leaves' },
          ],
          categories: [
            { id: 'fruits', label: 'Fruits & Berries', emoji: '🍎', bg: '#fef2f2', highlightBg: '#fee2e2', border: '#fca5a5', borderActive: '#dc2626' },
            { id: 'seeds', label: 'Seeds & Grains', emoji: '🌾', bg: '#fef3c7', highlightBg: '#fde68a', border: '#fcd34d', borderActive: '#d97706' },
            { id: 'leaves', label: 'Leaves & Herbs', emoji: '🌿', bg: '#f0fdf4', highlightBg: '#dcfce7', border: '#86efac', borderActive: '#16a34a' },
            { id: 'underground', label: 'Underground Parts', emoji: '🥔', bg: '#fff7ed', highlightBg: '#ffedd5', border: '#fdba74', borderActive: '#ea580c' },
          ]
        }
      },
      {
        type: 'concept',
        title: 'Plants Give Us Medicine 💊',
        text: 'In India, plants have been used as medicine for thousands of years. Click on each plant to learn its healing power!',
        emoji: '🌿',
        interactive: {
          type: 'flip',
          cards: [
            { emoji: '🌿', front: 'Neem', back: 'Neem leaves kill germs! Used for skin problems, toothache, and as a natural insect repellent. Villages use neem sticks as toothbrushes!', frontBg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', backBg: 'linear-gradient(135deg,#166534,#15803d)' },
            { emoji: '🍵', front: 'Tulsi', back: 'Tulsi (Holy Basil) is called the "Queen of Herbs"! It helps with colds, coughs, and sore throats. Many Indian homes grow tulsi in their garden.', frontBg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)', backBg: 'linear-gradient(135deg,#065f46,#047857)' },
            { emoji: '🟡', front: 'Turmeric', back: 'Turmeric (haldi) fights germs and reduces pain. It\'s used in cooking AND medicine! "Haldi doodh" (turmeric milk) is given for injuries.', frontBg: 'linear-gradient(135deg,#fef3c7,#fde68a)', backBg: 'linear-gradient(135deg,#78350f,#92400e)' },
            { emoji: '🌵', front: 'Aloe Vera', back: 'The gel inside aloe vera leaves soothes burns, skin rashes, and sunburn. It\'s also good for hair! Many people grow it at home for first aid.', frontBg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', backBg: 'linear-gradient(135deg,#064e3b,#065f46)' },
            { emoji: '🫚', front: 'Ginger', back: 'Ginger helps with stomach aches, nausea, and colds! "Adrak chai" (ginger tea) is a popular home remedy. It also adds great flavour to cooking!', frontBg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', backBg: 'linear-gradient(135deg,#7c2d12,#9a3412)' },
          ]
        }
      },
      {
        type: 'activity',
        title: 'Match the Plant to Its Use! 🧩',
        text: 'Can you match each plant to what it gives us?',
        emoji: '🎯',
        interactive: {
          type: 'match',
          pairs: [
            { id: 'cotton', left: 'Cotton Plant', leftEmoji: '🌸', right: 'Makes cloth for our clothes', rightEmoji: '👕' },
            { id: 'neem', left: 'Neem Tree', leftEmoji: '🌿', right: 'Kills germs, used as medicine', rightEmoji: '💊' },
            { id: 'bamboo', left: 'Bamboo', leftEmoji: '🎋', right: 'Used to build houses & baskets', rightEmoji: '🏚️' },
            { id: 'sugarcane', left: 'Sugarcane', leftEmoji: '🎍', right: 'Gives us sugar and jaggery', rightEmoji: '🍬' },
          ]
        }
      },
      {
        type: 'fact',
        title: 'Quick Check: Plants & Us! ⚡',
        text: 'Test what you\'ve learned about how plants help us!',
        emoji: '🤔',
        interactive: {
          type: 'truefalse',
          statements: [
            { emoji: '🌬️', statement: 'Plants give us fresh oxygen to breathe through photosynthesis.', answer: true, explanation: 'TRUE — plants take in CO₂ and release oxygen. One big tree can supply 4 people with oxygen daily!' },
            { emoji: '🪵', statement: 'Wood for building homes comes from animals, not plants.', answer: false, explanation: 'FALSE — wood comes from trees! We use wood to build homes, furniture, and make paper.' },
            { emoji: '🌾', statement: 'Rice, wheat and corn are all seeds that we eat.', answer: true, explanation: 'TRUE — these are the seeds (grains) of grass plants. They are the most important food crops in the world!' },
            { emoji: '🌳', statement: 'Cutting down forests (deforestation) is helpful because it creates space.', answer: false, explanation: 'FALSE — deforestation is harmful! It destroys animal homes, reduces oxygen, and causes floods and droughts.' },
          ]
        }
      },
      {
        type: 'summary',
        title: 'Plants Are Superheroes! ✍️',
        text: 'Complete the summary to remember all the amazing things plants do for us!',
        emoji: '🌟',
        interactive: {
          type: 'fillblank',
          sentences: [
            { before: 'Plants release', after: 'through photosynthesis, which we breathe.', answers: ['oxygen', 'Oxygen'], hint: 'The gas we all need to breathe!' },
            { before: 'Cotton is used to make', after: 'for us to wear.', answers: ['clothes', 'cloth', 'Clothes', 'Cloth'], hint: 'We wear this every day!' },
            { before: 'Neem and tulsi are examples of plants used as', after: '.', answers: ['medicine', 'Medicine', 'medicines'], hint: 'They heal us when we are sick!' },
            { before: 'Cutting down forests is called', after: 'and it harms the environment.', answers: ['deforestation', 'Deforestation'], hint: 'De + forest + ation' },
          ]
        }
      }
    ]
  }
};

export default INTERACTIVE_LESSONS;
