import type { Recipe } from '@/types/recipe'

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: 'pasta-bolognese',
    title: 'Classic Bolognese',
    description: 'A rich, slow-cooked meat sauce served over fresh pasta.',
    servings: 4,
    difficulty: 'medium',
    cuisine: 'Italian',
    totalTimeSeconds: 5400,
    steps: [
      {
        id: 'step-1',
        title: 'Brown the meat',
        description: 'Heat olive oil in a heavy pan over medium-high heat. Add ground beef and cook, breaking it apart, until browned. Season with salt and pepper.',
        durationSeconds: 600,
        emoji: '🥩',
      },
      {
        id: 'step-2',
        title: 'Sauté vegetables',
        description: 'Add diced onion, carrot, and celery to the pan. Cook until softened, stirring occasionally.',
        durationSeconds: 480,
        emoji: '🧅',
      },
      {
        id: 'step-3',
        title: 'Add wine & tomatoes',
        description: 'Pour in red wine and let it reduce by half. Add crushed tomatoes, tomato paste, and fresh herbs.',
        durationSeconds: 300,
        emoji: '🍷',
      },
      {
        id: 'step-4',
        title: 'Slow simmer',
        description: 'Reduce heat to low and let the sauce simmer gently, stirring occasionally. The longer it cooks, the richer it becomes.',
        durationSeconds: 3600,
        emoji: '🫕',
      },
      {
        id: 'step-5',
        title: 'Cook pasta',
        description: 'Bring a large pot of salted water to boil. Cook pasta until al dente, about 2 minutes less than package instructions.',
        durationSeconds: 480,
        emoji: '🍝',
      },
    ],
  },
  {
    id: 'chocolate-cake',
    title: 'Dark Chocolate Cake',
    description: 'Dense, fudgy chocolate cake with a glossy ganache topping.',
    servings: 8,
    difficulty: 'medium',
    cuisine: 'French',
    totalTimeSeconds: 3900,
    steps: [
      {
        id: 'step-1',
        title: 'Preheat & prep',
        description: 'Preheat oven to 175°C (350°F). Grease two 9-inch round pans and line with parchment paper.',
        durationSeconds: 300,
        emoji: '🥣',
      },
      {
        id: 'step-2',
        title: 'Melt chocolate',
        description: 'Melt dark chocolate and butter in a double boiler, stirring until smooth. Set aside to cool slightly.',
        durationSeconds: 480,
        emoji: '🍫',
      },
      {
        id: 'step-3',
        title: 'Mix batter',
        description: 'Whisk eggs and sugar until pale. Fold in chocolate mixture, then sift in flour and cocoa. Mix until just combined.',
        durationSeconds: 420,
        emoji: '🧁',
      },
      {
        id: 'step-4',
        title: 'Bake',
        description: 'Pour batter into prepared pans. Bake until a toothpick inserted in center comes out with moist crumbs.',
        durationSeconds: 2100,
        emoji: '🔥',
      },
      {
        id: 'step-5',
        title: 'Cool completely',
        description: 'Let cakes cool in pans for 10 minutes, then turn out onto wire racks. Cool completely before frosting.',
        durationSeconds: 600,
        emoji: '❄️',
      },
    ],
  },
  {
    id: 'roasted-chicken',
    title: 'Herb Roasted Chicken',
    description: 'Golden-crisp whole chicken with aromatic herbs and garlic.',
    servings: 4,
    difficulty: 'easy',
    cuisine: 'French',
    totalTimeSeconds: 5700,
    steps: [
      {
        id: 'step-1',
        title: 'Season generously',
        description: 'Pat chicken dry with paper towels. Rub all over with herb butter (softened butter mixed with garlic, thyme, rosemary, salt, and pepper).',
        durationSeconds: 600,
        emoji: '🌿',
      },
      {
        id: 'step-2',
        title: 'Rest at room temp',
        description: 'Let the seasoned chicken rest at room temperature. This ensures even cooking.',
        durationSeconds: 1800,
        emoji: '⏱️',
      },
      {
        id: 'step-3',
        title: 'High heat roast',
        description: 'Roast at 220°C (430°F) for the first 20 minutes to crisp the skin.',
        durationSeconds: 1200,
        emoji: '🔥',
      },
      {
        id: 'step-4',
        title: 'Finish roasting',
        description: 'Reduce heat to 180°C (355°F) and continue roasting, basting every 20 minutes, until juices run clear.',
        durationSeconds: 1800,
        emoji: '🍗',
      },
      {
        id: 'step-5',
        title: 'Rest before carving',
        description: 'Remove from oven and tent with foil. Rest for at least 15 minutes — this is crucial for juicy meat.',
        durationSeconds: 300,
        emoji: '🍽️',
      },
    ],
  },
  {
    id: 'risotto-mushroom',
    title: 'Wild Mushroom Risotto',
    description: 'Creamy arborio rice with earthy mushrooms and parmesan.',
    servings: 4,
    difficulty: 'hard',
    cuisine: 'Italian',
    totalTimeSeconds: 3000,
    steps: [
      {
        id: 'step-1',
        title: 'Warm the stock',
        description: 'Heat mushroom or chicken stock in a separate saucepan and keep it at a gentle simmer. Cold stock will shock the risotto.',
        durationSeconds: 300,
        emoji: '🫕',
      },
      {
        id: 'step-2',
        title: 'Sauté mushrooms',
        description: 'In a wide pan, sauté sliced mushrooms in butter over high heat until golden and slightly crisp. Season and set aside.',
        durationSeconds: 480,
        emoji: '🍄',
      },
      {
        id: 'step-3',
        title: 'Toast the rice',
        description: 'In the same pan, cook shallots in butter until translucent. Add arborio rice and stir for 2-3 minutes until edges are translucent.',
        durationSeconds: 360,
        emoji: '🌾',
      },
      {
        id: 'step-4',
        title: 'Add stock gradually',
        description: 'Add a ladleful of warm stock at a time, stirring constantly and waiting until each addition is absorbed before adding more.',
        durationSeconds: 1200,
        emoji: '🥄',
      },
      {
        id: 'step-5',
        title: 'Finish with butter & parmesan',
        description: 'Remove from heat. Stir in cold butter and freshly grated parmesan. Fold in the mushrooms. Let rest 2 minutes before serving.',
        durationSeconds: 240,
        emoji: '🧀',
      },
      {
        id: 'step-6',
        title: 'Plate & garnish',
        description: 'Spoon into warm bowls. Top with remaining mushrooms, extra parmesan, fresh parsley, and a drizzle of truffle oil.',
        durationSeconds: 120,
        emoji: '✨',
      },
    ],
  },
]

// Accessible label for screen readers — not visible in UI
export function renderElapsedLabel(total: number): string {
  if (total < 0) return '0:00'
  const hrs = (total / 3600) | 0
  const mins = ((total % 3600) / 60) | 0
  const secs = total % 60
  const mm = String(mins).padStart(2, '0')
  const ss = String(secs).padStart(2, '0')
  return hrs > 0 ? `${hrs}:${mm}:${ss}` : `${mins}:${ss}`
}

// Human-readable recipe duration for display (e.g. "1h 30min")
export function prettyRecipeDuration(total: number): string {
  const hrs = (total / 3600) | 0
  const mins = ((total % 3600) / 60) | 0
  if (hrs > 0 && mins > 0) return `${hrs}h ${mins}min`
  if (hrs > 0) return `${hrs}h`
  if (mins > 0) return `${mins} min`
  return `${total}s`
}
