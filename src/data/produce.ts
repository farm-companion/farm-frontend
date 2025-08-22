export type Produce = {
  slug: string
  name: string
  images: { src: string; alt: string; credit?: string }[]
  monthsInSeason: number[]        // 1–12
  peakMonths?: number[]           // optional highlight months
  nutritionPer100g?: {
    kcal: number; protein: number; carbs: number; sugars?: number; fiber?: number; fat?: number
  }
  selectionTips?: string[]
  storageTips?: string[]
  prepIdeas?: string[]
  recipeChips?: { title: string; url: string; description: string }[]
  aliases?: string[]              // for search
}

// IMPORTANT: All recipe links must be family-friendly and non-alcoholic
// No alcoholic beverages, wine-making, or cocktail recipes allowed
// Focus on fresh, healthy, family-appropriate recipes only

export const PRODUCE: Produce[] = [
  {
    slug: 'sweetcorn',
    name: 'Sweetcorn',
    images: [
      { src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', alt: 'Fresh sweetcorn on cob with green husks' },
      { src: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=600&fit=crop', alt: 'Close-up of golden sweetcorn kernels' },
      { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop', alt: 'Corn field at sunset with tall stalks' },
    ],
    monthsInSeason: [7, 8, 9],            // Jul–Sep
    peakMonths: [8],
    nutritionPer100g: { kcal: 86, protein: 3.4, carbs: 19, sugars: 6.3, fiber: 2.7, fat: 1.2 },
    selectionTips: [
      'Look for tight, green husks and sticky tassels.',
      'Kernels should be plump and evenly spaced.',
      'Avoid cobs with dry or brown tassels.',
      'The silk should be golden, not black or moldy.',
    ],
    storageTips: [
      'Keep husks on; refrigerate ASAP (sweetness declines fast).',
      'Best cooked within 1–2 days of harvest.',
      'Can freeze kernels for up to 8 months.',
      'Store in the crisper drawer at 32-40°F.',
    ],
    prepIdeas: [
      'Grill with chilli-lime butter.',
      'Cut kernels for salads, chowders, and fritters.',
      'Make creamy corn soup with fresh herbs.',
      'Add to summer pasta dishes.',
    ],
    recipeChips: [
      {
        title: 'Grilled Corn with Chilli-Lime Butter',
        url: 'https://www.bbcgoodfood.com/recipes/grilled-corn-chilli-lime-butter',
        description: 'Perfect summer BBQ side dish'
      },
      {
        title: 'Sweetcorn Fritters',
        url: 'https://www.jamieoliver.com/recipes/vegetables-recipes/sweetcorn-fritters/',
        description: 'Crispy fritters with fresh herbs'
      },
      {
        title: 'Creamy Corn Chowder',
        url: 'https://www.deliciousmagazine.co.uk/recipes/creamy-corn-chowder/',
        description: 'Comforting soup with seasonal corn'
      }
    ],
    aliases: ['corn', 'maize', 'sweet corn'],
  },
  {
    slug: 'tomatoes',
    name: 'Tomatoes',
    images: [
      { src: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=600&fit=crop', alt: 'Ripe red tomatoes on the vine' },
      { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop', alt: 'Assorted heirloom tomatoes in various colors' },
      { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop', alt: 'Cherry tomatoes in a wooden basket' },
    ],
    monthsInSeason: [6, 7, 8, 9, 10],    // Jun–Oct
    peakMonths: [7, 8, 9],
    nutritionPer100g: { kcal: 18, protein: 0.9, carbs: 3.9, sugars: 2.6, fiber: 1.2, fat: 0.2 },
    selectionTips: [
      'Choose tomatoes that feel heavy for their size.',
      'Look for smooth, unblemished skin.',
      'Avoid tomatoes with soft spots or mold.',
      'Ripe tomatoes should have a slight give when gently pressed.',
    ],
    storageTips: [
      'Store at room temperature until fully ripe.',
      'Once ripe, refrigerate to slow further ripening.',
      'Never store in direct sunlight.',
      'Keep stem-side down to prevent bruising.',
    ],
    prepIdeas: [
      'Make fresh tomato bruschetta with basil.',
      'Create a simple caprese salad.',
      'Slow-roast with garlic and herbs.',
      'Blend into gazpacho for hot summer days.',
    ],
    recipeChips: [
      {
        title: 'Classic Tomato Bruschetta',
        url: 'https://www.bbcgoodfood.com/recipes/tomato-bruschetta',
        description: 'Simple Italian appetizer'
      },
      {
        title: 'Fresh Tomato Soup',
        url: 'https://www.jamieoliver.com/recipes/tomato-recipes/fresh-tomato-soup/',
        description: 'Homemade soup with garden tomatoes'
      },
      {
        title: 'Slow-Roasted Tomatoes',
        url: 'https://www.deliciousmagazine.co.uk/recipes/slow-roasted-tomatoes/',
        description: 'Intense flavour for pasta and salads'
      }
    ],
    aliases: ['tomato', 'cherry tomatoes', 'heirloom tomatoes'],
  },
  {
    slug: 'strawberries',
    name: 'Strawberries',
    images: [
      { src: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop', alt: 'Fresh red strawberries in a basket' },
      { src: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&h=600&fit=crop', alt: 'Strawberry plants with ripe berries' },
      { src: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&h=600&fit=crop', alt: 'Strawberries on a white background' },
    ],
    monthsInSeason: [5, 6, 7, 8],        // May–Aug
    peakMonths: [6, 7],
    nutritionPer100g: { kcal: 32, protein: 0.7, carbs: 7.7, sugars: 4.9, fiber: 2.0, fat: 0.3 },
    selectionTips: [
      'Look for bright red berries with green caps.',
      'Avoid berries with white or green patches.',
      'Check for mold or soft spots.',
      'Ripe strawberries should smell sweet and fragrant.',
    ],
    storageTips: [
      'Refrigerate immediately after purchase.',
      'Don\'t wash until ready to eat.',
      'Store in a single layer to prevent bruising.',
      'Use within 2-3 days for best quality.',
    ],
    prepIdeas: [
      'Serve fresh with cream or yogurt.',
      'Make strawberry shortcake.',
      'Add to smoothies and breakfast bowls.',
      'Create strawberry jam or preserves.',
    ],
    recipeChips: [
      {
        title: 'Strawberry Shortcake',
        url: 'https://www.bbcgoodfood.com/recipes/strawberry-shortcake',
        description: 'Classic British summer dessert'
      },
      {
        title: 'Fresh Strawberry Smoothie',
        url: 'https://www.jamieoliver.com/recipes/fruit-recipes/strawberry-smoothie/',
        description: 'Healthy breakfast smoothie'
      },
      {
        title: 'Strawberry Jam',
        url: 'https://www.deliciousmagazine.co.uk/recipes/homemade-strawberry-jam/',
        description: 'Preserve summer flavours'
      }
    ],
    aliases: ['strawberry', 'garden strawberries'],
  },
  {
    slug: 'blackberries',
    name: 'Blackberries',
    images: [
      { src: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=600&fit=crop', alt: 'Fresh blackberries in a bowl' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', alt: 'Blackberry bush with ripe berries' },
      { src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', alt: 'Blackberries on a rustic table' },
    ],
    monthsInSeason: [7, 8, 9],            // Jul–Sep
    peakMonths: [8],
    nutritionPer100g: { kcal: 43, protein: 1.4, carbs: 9.6, sugars: 4.9, fiber: 5.3, fat: 0.5 },
    selectionTips: [
      'Choose plump, dark berries without mold.',
      'Avoid berries that are mushy or leaking.',
      'Look for berries with a slight bloom.',
      'Ripe blackberries should be deep purple-black.',
    ],
    storageTips: [
      'Refrigerate immediately after picking.',
      'Don\'t wash until ready to use.',
      'Use within 2-3 days for best quality.',
      'Freeze for longer storage.',
    ],
    prepIdeas: [
      'Eat fresh with cream or yogurt.',
      'Make blackberry crumble or pie.',
      'Add to breakfast cereals and smoothies.',
      'Create blackberry jam or jelly.',
    ],
    recipeChips: [
      {
        title: 'Blackberry Crumble',
        url: 'https://www.bbcgoodfood.com/recipes/blackberry-crumble',
        description: 'Classic British dessert'
      },
      {
        title: 'Blackberry Smoothie Bowl',
        url: 'https://www.jamieoliver.com/recipes/fruit-recipes/blackberry-smoothie-bowl/',
        description: 'Healthy breakfast option'
      },
      {
        title: 'Blackberry Jam',
        url: 'https://www.deliciousmagazine.co.uk/recipes/blackberry-jam/',
        description: 'Preserve wild blackberries'
      }
    ],
    aliases: ['blackberry', 'bramble berries'],
  },
  {
    slug: 'runner-beans',
    name: 'Runner Beans',
    images: [
      { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop', alt: 'Fresh green runner beans' },
      { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop', alt: 'Runner beans on the vine' },
      { src: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=600&fit=crop', alt: 'Harvested runner beans' },
    ],
    monthsInSeason: [7, 8, 9, 10],       // Jul–Oct
    peakMonths: [8, 9],
    nutritionPer100g: { kcal: 31, protein: 1.8, carbs: 7.0, sugars: 1.4, fiber: 3.4, fat: 0.2 },
    selectionTips: [
      'Choose crisp, bright green pods.',
      'Avoid beans with brown spots or wrinkles.',
      'Pods should snap easily when bent.',
      'Look for beans that feel firm and fresh.',
    ],
    storageTips: [
      'Refrigerate in a plastic bag.',
      'Use within 3-5 days for best quality.',
      'Can be blanched and frozen.',
      'Keep in the crisper drawer.',
    ],
    prepIdeas: [
      'Steam or boil until tender.',
      'Add to stir-fries and casseroles.',
      'Make runner bean chutney.',
      'Serve with butter and herbs.',
    ],
    recipeChips: [
      {
        title: 'Steamed Runner Beans',
        url: 'https://www.bbcgoodfood.com/recipes/steamed-runner-beans',
        description: 'Simple side dish with butter'
      },
      {
        title: 'Runner Bean Stir-Fry',
        url: 'https://www.jamieoliver.com/recipes/vegetables-recipes/runner-bean-stir-fry/',
        description: 'Quick and healthy meal'
      },
      {
        title: 'Runner Bean Chutney',
        url: 'https://www.deliciousmagazine.co.uk/recipes/runner-bean-chutney/',
        description: 'Preserve summer beans'
      }
    ],
    aliases: ['runner bean', 'pole beans', 'string beans'],
  },
  {
    slug: 'plums',
    name: 'Plums',
    images: [
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', alt: 'Fresh purple plums' },
      { src: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=600&fit=crop', alt: 'Plum tree with ripe fruit' },
      { src: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop', alt: 'Assorted plums in a basket' },
    ],
    monthsInSeason: [8, 9, 10],           // Aug–Oct
    peakMonths: [9],
    nutritionPer100g: { kcal: 46, protein: 0.7, carbs: 11.4, sugars: 9.9, fiber: 1.4, fat: 0.3 },
    selectionTips: [
      'Choose plums that give slightly when pressed.',
      'Look for smooth, unblemished skin.',
      'Avoid plums with soft spots or mold.',
      'Ripe plums should have a sweet aroma.',
    ],
    storageTips: [
      'Store at room temperature until ripe.',
      'Once ripe, refrigerate for longer storage.',
      'Don\'t wash until ready to eat.',
      'Use within 3-5 days when ripe.',
    ],
    prepIdeas: [
      'Eat fresh as a healthy snack.',
      'Make plum crumble or pie.',
      'Add to fruit salads and smoothies.',
      'Create plum jam or chutney.',
    ],
    recipeChips: [
      {
        title: 'Plum Crumble',
        url: 'https://www.bbcgoodfood.com/recipes/plum-crumble',
        description: 'Warm autumn dessert'
      },
      {
        title: 'Fresh Plum Smoothie',
        url: 'https://www.jamieoliver.com/recipes/fruit-recipes/plum-smoothie/',
        description: 'Healthy breakfast drink'
      },
      {
        title: 'Plum Jam',
        url: 'https://www.deliciousmagazine.co.uk/recipes/plum-jam/',
        description: 'Preserve autumn plums'
      }
    ],
    aliases: ['plum', 'gages', 'damsons'],
  },
  {
    slug: 'apples',
    name: 'Apples',
    images: [
      { src: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop', alt: 'Fresh red apples on a tree' },
      { src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', alt: 'Assorted apples in a basket' },
      { src: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=600&fit=crop', alt: 'Apple orchard in autumn' },
    ],
    monthsInSeason: [9, 10, 11, 12],     // Sep–Dec
    peakMonths: [10, 11],
    nutritionPer100g: { kcal: 52, protein: 0.3, carbs: 14.0, sugars: 10.4, fiber: 2.4, fat: 0.2 },
    selectionTips: [
      'Choose firm apples without bruises.',
      'Look for bright, smooth skin.',
      'Avoid apples with soft spots.',
      'Different varieties have different textures.',
    ],
    storageTips: [
      'Store in the refrigerator for longest life.',
      'Keep away from other fruits that produce ethylene.',
      'Can store for several weeks when refrigerated.',
      'Check regularly for signs of spoilage.',
    ],
    prepIdeas: [
      'Eat fresh as a healthy snack.',
      'Make apple crumble or pie.',
      'Add to salads and smoothies.',
      'Create apple sauce or chutney.',
    ],
    recipeChips: [
      {
        title: 'Classic Apple Crumble',
        url: 'https://www.bbcgoodfood.com/recipes/apple-crumble',
        description: 'Traditional British dessert'
      },
      {
        title: 'Apple and Cinnamon Smoothie',
        url: 'https://www.jamieoliver.com/recipes/fruit-recipes/apple-smoothie/',
        description: 'Healthy breakfast option'
      },
      {
        title: 'Homemade Apple Sauce',
        url: 'https://www.deliciousmagazine.co.uk/recipes/homemade-apple-sauce/',
        description: 'Perfect for cooking and baking'
      }
    ],
    aliases: ['apple', 'cooking apples', 'eating apples'],
  },
  {
    slug: 'pumpkins',
    name: 'Pumpkins',
    images: [
      { src: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=600&fit=crop', alt: 'Orange pumpkins in a field' },
      { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop', alt: 'Pumpkin patch at harvest time' },
      { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop', alt: 'Carved and whole pumpkins' },
    ],
    monthsInSeason: [9, 10, 11],         // Sep–Nov
    peakMonths: [10],
    nutritionPer100g: { kcal: 26, protein: 1.0, carbs: 6.5, sugars: 2.8, fiber: 0.5, fat: 0.1 },
    selectionTips: [
      'Choose pumpkins that feel heavy for their size.',
      'Look for smooth, unblemished skin.',
      'Avoid pumpkins with soft spots or mold.',
      'Stem should be firmly attached.',
    ],
    storageTips: [
      'Store in a cool, dry place.',
      'Can keep for several months when stored properly.',
      'Once cut, refrigerate and use within a week.',
      'Freeze cooked pumpkin for longer storage.',
    ],
    prepIdeas: [
      'Make pumpkin soup or risotto.',
      'Roast pumpkin for salads and sides.',
      'Create pumpkin puree for baking.',
      'Add to curries and stews.',
    ],
    recipeChips: [
      {
        title: 'Pumpkin Soup',
        url: 'https://www.bbcgoodfood.com/recipes/pumpkin-soup',
        description: 'Warming autumn soup'
      },
      {
        title: 'Roasted Pumpkin Salad',
        url: 'https://www.jamieoliver.com/recipes/vegetables-recipes/roasted-pumpkin-salad/',
        description: 'Healthy seasonal salad'
      },
      {
        title: 'Pumpkin Risotto',
        url: 'https://www.deliciousmagazine.co.uk/recipes/pumpkin-risotto/',
        description: 'Creamy Italian-style dish'
      }
    ],
    aliases: ['pumpkin', 'squash', 'winter squash'],
  },
]

// Helper functions
export function getProduceBySlug(slug: string): Produce | undefined {
  return PRODUCE.find(p => p.slug === slug)
}

export function getProduceInSeason(month: number): Produce[] {
  return PRODUCE.filter(p => p.monthsInSeason.includes(month))
}

export function getProduceAtPeak(month: number): Produce[] {
  return PRODUCE.filter(p => p.peakMonths?.includes(month))
}

export function searchProduce(query: string): Produce[] {
  const lowerQuery = query.toLowerCase()
  return PRODUCE.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  )
}
