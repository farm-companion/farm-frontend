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
        title: 'Caprese Salad',
        url: 'https://www.jamieoliver.com/recipes/tomato-recipes/caprese-salad/',
        description: 'Fresh mozzarella and basil'
      },
      {
        title: 'Slow-Roasted Tomatoes',
        url: 'https://www.deliciousmagazine.co.uk/recipes/slow-roasted-tomatoes/',
        description: 'Intense flavor, perfect for pasta'
      }
    ],
    aliases: ['tomato', 'cherry tomatoes', 'heirloom tomatoes'],
  },
  {
    slug: 'strawberries',
    name: 'Strawberries',
    images: [
      { src: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop', alt: 'Fresh red strawberries with green leaves' },
      { src: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&h=600&fit=crop', alt: 'Strawberries in a rustic wooden bowl' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=800&h=600&fit=crop', alt: 'Strawberry field with ripe berries' },
    ],
    monthsInSeason: [5, 6, 7],           // May–Jul
    peakMonths: [6],
    nutritionPer100g: { kcal: 32, protein: 0.7, carbs: 7.7, sugars: 4.9, fiber: 2.0, fat: 0.3 },
    selectionTips: [
      'Look for bright red color with no white or green patches.',
      'Choose berries that are plump and firm.',
      'Check for fresh green leaves (calyx).',
      'Avoid berries with mold or soft spots.',
    ],
    storageTips: [
      'Refrigerate immediately after purchase.',
      'Don\'t wash until ready to eat.',
      'Store in a single layer to prevent bruising.',
      'Best consumed within 2-3 days.',
    ],
    prepIdeas: [
      'Serve with fresh cream and shortbread.',
      'Make strawberry and rhubarb crumble.',
      'Blend into smoothies or milkshakes.',
      'Create strawberry jam or preserves.',
    ],
    aliases: ['strawberry', 'strawbs', 'garden strawberries'],
  },
  {
    slug: 'blackberries',
    name: 'Blackberries',
    images: [
      { src: 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=800&h=600&fit=crop', alt: 'Ripe blackberries on the bush' },
      { src: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=600&fit=crop', alt: 'Fresh blackberries in a basket' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=800&h=600&fit=crop', alt: 'Blackberry picking in the countryside' },
    ],
    monthsInSeason: [7, 8, 9],           // Jul–Sep
    peakMonths: [8],
    nutritionPer100g: { kcal: 43, protein: 1.4, carbs: 9.6, sugars: 4.9, fiber: 5.3, fat: 0.5 },
    selectionTips: [
      'Choose berries that are deep purple-black in color.',
      'Look for plump, firm berries without wrinkles.',
      'Avoid berries with mold or soft spots.',
      'Check that berries come off the plant easily when ripe.',
    ],
    storageTips: [
      'Refrigerate immediately after picking or purchase.',
      'Don\'t wash until ready to eat.',
      'Store in a shallow container to prevent crushing.',
      'Best consumed within 2-3 days.',
    ],
    prepIdeas: [
      'Make blackberry and apple crumble.',
      'Create blackberry jam or jelly.',
      'Add to breakfast porridge or yogurt.',
      'Make blackberry gin or cordial.',
    ],
    aliases: ['blackberry', 'bramble', 'wild blackberries'],
  },
  {
    slug: 'runner-beans',
    name: 'Runner Beans',
    images: [
      { src: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?w=800&h=600&fit=crop', alt: 'Fresh green runner beans on the plant' },
      { src: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&h=600&fit=crop', alt: 'Runner beans in a market basket' },
      { src: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800&h=600&fit=crop', alt: 'Runner bean flowers and pods' },
    ],
    monthsInSeason: [7, 8, 9, 10],      // Jul–Oct
    peakMonths: [8, 9],
    nutritionPer100g: { kcal: 31, protein: 1.8, carbs: 7.0, sugars: 1.4, fiber: 3.4, fat: 0.2 },
    selectionTips: [
      'Choose beans that are bright green and firm.',
      'Look for pods that snap easily when bent.',
      'Avoid beans with brown spots or wrinkles.',
      'Smaller beans are often more tender.',
    ],
    storageTips: [
      'Refrigerate in a plastic bag for up to 5 days.',
      'Don\'t wash until ready to use.',
      'Can be blanched and frozen for longer storage.',
      'Store in the crisper drawer.',
    ],
    prepIdeas: [
      'Steam and serve with butter and black pepper.',
      'Add to summer vegetable soups.',
      'Make runner bean and potato salad.',
      'Stir-fry with garlic and ginger.',
    ],
    aliases: ['runner beans', 'pole beans', 'scarlet runner beans'],
  },
  {
    slug: 'plums',
    name: 'Plums',
    images: [
      { src: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=800&h=600&fit=crop', alt: 'Ripe purple plums on the tree' },
      { src: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&h=600&fit=crop', alt: 'Assorted plums in a wooden bowl' },
      { src: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&h=600&fit=crop', alt: 'Plum orchard in late summer' },
    ],
    monthsInSeason: [8, 9, 10],         // Aug–Oct
    peakMonths: [9],
    nutritionPer100g: { kcal: 46, protein: 0.7, carbs: 11.4, sugars: 9.9, fiber: 1.4, fat: 0.3 },
    selectionTips: [
      'Choose plums that give slightly when gently pressed.',
      'Look for smooth skin with a slight bloom.',
      'Avoid plums with bruises or soft spots.',
      'Color should be rich and even.',
    ],
    storageTips: [
      'Store at room temperature until ripe.',
      'Once ripe, refrigerate to slow ripening.',
      'Don\'t wash until ready to eat.',
      'Can be frozen for baking later.',
    ],
    prepIdeas: [
      'Make plum crumble or pie.',
      'Create plum jam or chutney.',
      'Add to fruit salads.',
      'Make plum wine or liqueur.',
    ],
    aliases: ['plum', 'gages', 'damsons'],
  },
  {
    slug: 'apples',
    name: 'Apples',
    images: [
      { src: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&h=600&fit=crop', alt: 'Red apples on the tree' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=800&h=600&fit=crop', alt: 'Assorted apples in a basket' },
      { src: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&h=600&fit=crop', alt: 'Apple orchard in autumn' },
    ],
    monthsInSeason: [8, 9, 10, 11],     // Aug–Nov
    peakMonths: [9, 10],
    nutritionPer100g: { kcal: 52, protein: 0.3, carbs: 14.0, sugars: 10.4, fiber: 2.4, fat: 0.2 },
    selectionTips: [
      'Choose apples that are firm and heavy for their size.',
      'Look for smooth skin without bruises.',
      'Avoid apples with soft spots or mold.',
      'Different varieties have different peak ripeness indicators.',
    ],
    storageTips: [
      'Store in a cool, dark place or refrigerator.',
      'Keep away from other fruits that produce ethylene.',
      'Can be stored for several months in proper conditions.',
      'Check regularly for signs of spoilage.',
    ],
    prepIdeas: [
      'Make traditional apple pie or crumble.',
      'Create apple sauce or chutney.',
      'Add to salads or cheese boards.',
      'Make apple cider or juice.',
    ],
    aliases: ['apple', 'cooking apples', 'eating apples'],
  },
  {
    slug: 'pumpkins',
    name: 'Pumpkins',
    images: [
      { src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', alt: 'Orange pumpkins in a field' },
      { src: 'https://images.unsplash.com/photo-1518635017498-87f514b751ba?w=800&h=600&fit=crop', alt: 'Assorted pumpkins and squashes' },
      { src: 'https://images.unsplash.com/photo-1550258987-190a62d4fa70?w=800&h=600&fit=crop', alt: 'Pumpkin patch in autumn' },
    ],
    monthsInSeason: [9, 10, 11],        // Sep–Nov
    peakMonths: [10],
    nutritionPer100g: { kcal: 26, protein: 1.0, carbs: 6.5, sugars: 2.8, fiber: 0.5, fat: 0.1 },
    selectionTips: [
      'Choose pumpkins that feel heavy for their size.',
      'Look for firm, unblemished skin.',
      'Avoid pumpkins with soft spots or mold.',
      'Stem should be firmly attached.',
    ],
    storageTips: [
      'Store in a cool, dry place for several months.',
      'Don\'t refrigerate whole pumpkins.',
      'Once cut, refrigerate and use within 5 days.',
      'Can be frozen as puree for later use.',
    ],
    prepIdeas: [
      'Make pumpkin soup or risotto.',
      'Create pumpkin pie or bread.',
      'Roast pumpkin seeds for snacks.',
      'Make pumpkin curry or stew.',
    ],
    aliases: ['pumpkin', 'squash', 'winter squash'],
  }
]

// Helper function to get produce by slug
export function getProduceBySlug(slug: string): Produce | undefined {
  return PRODUCE.find(produce => produce.slug === slug)
}

// Helper function to get produce in season for a given month
export function getProduceInSeason(month: number): Produce[] {
  return PRODUCE.filter(produce => produce.monthsInSeason.includes(month))
}

// Helper function to get produce at peak season for a given month
export function getProduceAtPeak(month: number): Produce[] {
  return PRODUCE.filter(produce => produce.peakMonths?.includes(month))
}

// Helper function to search produce by name or aliases
export function searchProduce(query: string): Produce[] {
  const lowerQuery = query.toLowerCase()
  return PRODUCE.filter(produce => 
    produce.name.toLowerCase().includes(lowerQuery) ||
    produce.aliases?.some(alias => alias.toLowerCase().includes(lowerQuery))
  )
}
