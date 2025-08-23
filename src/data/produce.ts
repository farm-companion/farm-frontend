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
      { src: '/images/produce/sweetcorn1.jpg', alt: 'Fresh sweetcorn on the cob with green husks, ready for cooking' },
      { src: '/images/produce/sweetcorn2.jpg', alt: 'Close-up of golden sweetcorn kernels, showing their juicy texture' },
      { src: '/images/produce/sweetcorn3.jpg', alt: 'Multiple sweetcorn cobs arranged in a rustic basket, freshly harvested' },
      { src: '/images/produce/sweetcorn4.jpg', alt: 'Sweetcorn field at sunset, with tall stalks and golden light' },
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
        title: 'Best Sweetcorn Recipes',
        url: 'https://www.olivemagazine.com/recipes/collection/best-sweetcorn-recipes/',
        description: '35 amazing sweetcorn recipes from Olive Magazine'
      },
      {
        title: 'Stir-Fried Corn with Chilli & Ginger',
        url: 'https://www.jamieoliver.com/recipes/vegetables/stir-fried-corn-with-chilli-ginger-garlic-and-parsley/',
        description: 'Quick and flavourful Asian-style corn'
      },
      {
        title: 'Creamy Corn Chowder',
        url: 'https://www.saltandlavender.com/corn-chowder/',
        description: 'Rich and comforting corn soup'
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
      { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop', alt: 'Fresh tomatoes in a wooden basket' },
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Fresh tomatoes arranged on rustic wooden surface' },
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
      { src: '/images/produce/strawberries-fresh1.jpg', alt: 'Fresh ripe strawberries with natural texture and seeds' },
      { src: '/images/produce/strawberries-fresh2.jpg', alt: 'Fresh ripe strawberry cut in half, showing its vibrant red exterior, visible seeds, and juicy, detailed interior' },
      { src: '/images/produce/strawberries-fresh3.jpg', alt: 'Hands cupping fresh ripe strawberries with rustic plaid background, showing abundance and freshness' },
      { src: '/images/produce/strawberries-fresh4.jpg', alt: 'Fresh ripe strawberries with rustic plaid background, showing abundance and freshness' },
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
        url: 'https://www.simplyrecipes.com/recipes/strawberry_shortcake/',
        description: 'Classic summer dessert'
      },
      {
        title: 'Fresh Strawberry Smoothie',
        url: 'https://www.thereciperebel.com/strawberry-smoothie-recipe/',
        description: 'Healthy breakfast smoothie'
      },
      {
        title: 'Strawberry Jam',
        url: 'https://boulderlocavore.com/simple-organic-strawberry-jam/',
        description: 'Organic strawberry jam recipe'
      }
    ],
    aliases: ['strawberry', 'garden strawberries'],
  },
  {
    slug: 'blackberries',
    name: 'Blackberries',
    images: [
      { src: '/images/produce/Blackberries1.jpg', alt: 'Close-up of fresh blackberries piled in a rustic wooden bowl with green leaves' },
      { src: '/images/produce/Blackberries2.jpg', alt: 'Dense pile of ripe blackberries in a dark bowl on wooden cutting board' },
      { src: '/images/produce/Blackberries3.jpg', alt: 'Fresh blackberries overflowing from a rustic wooden crate' },
      { src: '/images/produce/Blackberries4.jpg', alt: 'Fresh blackberries with lemon slice on rustic surface' },
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
        title: 'Easy Blackberry Compote',
        url: 'https://veggiedesserts.com/easy-blackberry-compote/',
        description: 'Simple 3-ingredient compote in 15 minutes'
      },
      {
        title: 'Blackberry Compote Video',
        url: 'https://www.youtube.com/watch?v=fK9CNdJK9lo',
        description: 'Step-by-step blackberry compote tutorial'
      },
      {
        title: 'Blackberry Recipe Collection',
        url: 'https://youtu.be/-DKcU7xWbgI?si=l8Ymj-kKJbPgTNaW',
        description: 'Creative blackberry recipe ideas'
      }
    ],
    aliases: ['blackberry', 'bramble berries'],
  },
  {
    slug: 'runner-beans',
    name: 'Runner Beans',
    images: [
      { src: '/images/produce/runner-beans1.jpg', alt: 'Fresh green runner beans piled in a rustic wooden bowl' },
      { src: '/images/produce/runner-beans2.jpg', alt: 'Single runner bean hanging from vine in golden sunlight' },
      { src: '/images/produce/runner-beans3.jpg', alt: 'Freshly chopped runner beans showing bright green segments' },
      { src: '/images/produce/runner-beans4.jpg', alt: 'Close-up of fresh runner beans with natural texture and detail' },
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
        title: 'Runner Bean Chutney',
        url: 'https://www.bbcgoodfood.com/recipes/runner-bean-chutney',
        description: 'Preserve allotment beans for winter'
      },
      {
        title: 'Middle Eastern Runner Beans',
        url: 'https://www.riverford.co.uk/recipes/middle-eastern-style-runner-beans?srsltid=AfmBOoorbptoOUwoGLQPEslUJmZHt4zyU58PQIqxFcHLSPsF77mkD6m5',
        description: 'Spiced runner beans with exotic flavours'
      },
      {
        title: 'Runner Bean Stir-Fry',
        url: 'https://www.quorumpark.com/walking/runner-bean-stir-fry',
        description: 'Fresh summer stir-fry from Quorum Park'
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
      { src: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop', alt: 'Fresh plums arranged on rustic wooden surface' },
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
      { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop', alt: 'Fresh apples arranged on rustic wooden surface' },
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
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Orange pumpkins in a field at harvest time' },
      { src: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop', alt: 'Pumpkin patch with ripe orange pumpkins' },
      { src: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&h=600&fit=crop', alt: 'Carved and whole pumpkins for Halloween' },
      { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&h=600&fit=crop', alt: 'Fresh pumpkins arranged on rustic wooden surface' },
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
