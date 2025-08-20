'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import AdSlot from '@/components/AdSlot'
import { 
  Apple, 
  Carrot, 
  Leaf, 
  Wheat, 
  Grape, 
  Cherry, 
  Circle, 
  Beef,
  Nut,
  Sprout,
  Bean
} from 'lucide-react'

type SeasonItem = { month: number; inSeason: string[]; notes: string }
type SeasonItemWithProv = SeasonItem & { source?: string; sourceName?: string; updatedAt?: string }

// Function to get appropriate Lucide icon for each produce item
const getProduceIcon = (item: string) => {
  const itemLower = item.toLowerCase()
  
  // Fruits
  if (itemLower.includes('apple')) return Apple
  if (itemLower.includes('pear')) return Apple
  if (itemLower.includes('strawberr')) return Cherry
  if (itemLower.includes('cherr')) return Cherry
  if (itemLower.includes('plum') || itemLower.includes('damson')) return Circle
  if (itemLower.includes('blueberr')) return Circle
  if (itemLower.includes('raspberr')) return Cherry
  if (itemLower.includes('blackberr')) return Circle
  if (itemLower.includes('rhubarb')) return Leaf
  if (itemLower.includes('grape')) return Grape
  
  // Vegetables
  if (itemLower.includes('carrot')) return Carrot
  if (itemLower.includes('beetroot')) return Carrot
  if (itemLower.includes('parsnip')) return Carrot
  if (itemLower.includes('celeriac')) return Carrot
  if (itemLower.includes('swede')) return Carrot
  if (itemLower.includes('radish')) return Carrot
  if (itemLower.includes('lettuce')) return Leaf
  if (itemLower.includes('cabbage')) return Leaf
  if (itemLower.includes('kale')) return Leaf
  if (itemLower.includes('sprout')) return Sprout
  if (itemLower.includes('spring greens')) return Leaf
  if (itemLower.includes('broccoli')) return Leaf
  if (itemLower.includes('asparagus')) return Sprout
  if (itemLower.includes('pea')) return Bean
  if (itemLower.includes('bean')) return Bean
  if (itemLower.includes('broad bean')) return Bean
  if (itemLower.includes('runner bean')) return Bean
  if (itemLower.includes('sweetcorn') || itemLower.includes('corn')) return Wheat
  if (itemLower.includes('squash') || itemLower.includes('pumpkin')) return Circle
  if (itemLower.includes('mushroom')) return Circle
  if (itemLower.includes('chestnut')) return Nut
  
  // Meat/other
  if (itemLower.includes('lamb') || itemLower.includes('venison')) return Beef
  
  // Default fallback
  return Leaf
}

// Seasonal data for immersive experience
const seasonalData = {
  1: { name: 'Winter\'s Quiet Bounty', color: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/10', icon: '❄️', quote: 'In the depth of winter, I finally learned that within me there lay an invincible summer.' },
  2: { name: 'February\'s Promise', color: 'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/10', icon: '🌸', quote: 'The promise of spring is whispered in the wind.' },
  3: { name: 'Spring\'s Fresh Awakening', color: 'from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10', icon: '🌱', quote: 'Spring is nature\'s way of saying, Let\'s party!' },
  4: { name: 'April\'s Gentle Growth', color: 'from-green-50 to-teal-100 dark:from-green-900/20 dark:to-teal-900/10', icon: '🌿', quote: 'April hath put a spirit of youth in everything.' },
  5: { name: 'May\'s Abundant Bloom', color: 'from-yellow-50 to-green-100 dark:from-yellow-900/20 dark:to-green-900/10', icon: '🌺', quote: 'The world\'s favorite season is the spring. All things seem possible in May.' },
  6: { name: 'Summer\'s Golden Harvest', color: 'from-yellow-50 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/10', icon: '☀️', quote: 'Summer afternoon—summer afternoon; to me those have always been the two most beautiful words in the English language.' },
  7: { name: 'July\'s Peak Abundance', color: 'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/10', icon: '🍅', quote: 'July is the month when the year\'s best work is done.' },
  8: { name: 'August\'s Rich Harvest', color: 'from-orange-50 to-yellow-100 dark:from-orange-900/20 dark:to-yellow-900/10', icon: '🌾', quote: 'August is the month when the year\'s bounty reaches its peak.' },
  9: { name: 'Autumn\'s Golden Harvest', color: 'from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/10', icon: '🍂', quote: 'Autumn is a second spring when every leaf is a flower.' },
  10: { name: 'October\'s Earthy Bounty', color: 'from-amber-50 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/10', icon: '🎃', quote: 'October is the month of painted leaves and ripened fruit.' },
  11: { name: 'November\'s Quiet Wisdom', color: 'from-gray-50 to-slate-100 dark:from-gray-900/20 dark:to-slate-900/10', icon: '🍁', quote: 'November is the month of gratitude and reflection.' },
  12: { name: 'December\'s Cozy Comfort', color: 'from-blue-50 to-slate-100 dark:from-blue-900/20 dark:to-slate-900/10', icon: '🎄', quote: 'December is the month when the year\'s stories come to rest.' }
}

export default function SeasonalPage() {
  const [data, setData] = useState<SeasonItemWithProv[]>([])
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    fetch('/data/seasons.uk.json', { cache: 'no-store' })
      .then(r => r.json())
      .then((json: SeasonItemWithProv[]) => setData(json))
      .catch(() => setData([]))
  }, [])

  const current = useMemo(
    () => data.find(d => d.month === month),
    [data, month]
  )

  const currentSeason = seasonalData[month as keyof typeof seasonalData]
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  const handleMonthChange = (newMonth: number) => {
    setIsAnimating(true)
    setMonth(newMonth)
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300)
  }

  return (
    <main className="min-h-screen bg-background-canvas">
      {/* Hero Section with Seasonal Background */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${currentSeason.color} transition-all duration-500 ease-in-out`}>
        <div className="absolute inset-0 opacity-10">
          {/* Seasonal pattern overlay */}
          <div className="absolute inset-0 bg-dots-pattern"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-6">
            {/* Seasonal Icon */}
            <div className="text-6xl animate-bounce" style={{ animationDuration: '3s' }}>
              {currentSeason.icon}
            </div>
            
            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl font-bold text-text-heading animate-fade-in-up">
              {currentSeason.name}
            </h1>
            
            {/* Seasonal Quote */}
            <blockquote className="text-xl text-text-body italic max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              &ldquo;{currentSeason.quote}&rdquo;
            </blockquote>
            
            {/* Subtitle */}
            <p className="text-lg text-text-muted animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              Discover what&apos;s at its peak this month and find farm shops near you
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Month Selector */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-background-surface rounded-2xl shadow-lg border border-border-default p-6">
          <h2 className="text-2xl font-semibold text-text-heading mb-6 text-center">
            Explore the Seasons
          </h2>
          
          {/* Visual Calendar */}
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {months.map((monthName, index) => {
              const monthNumber = index + 1
              const isCurrent = monthNumber === month
              const monthSeason = seasonalData[monthNumber as keyof typeof seasonalData]
              
              return (
                <button
                  key={monthNumber}
                  onClick={() => handleMonthChange(monthNumber)}
                  className={`
                    relative group p-4 rounded-xl border-2 transition-all duration-300 ease-in-out
                    ${isCurrent 
                      ? 'border-brand-primary bg-brand-primary/10 shadow-lg scale-105' 
                      : 'border-border-default hover:border-brand-primary/50 hover:bg-brand-primary/5'
                    }
                    focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2
                  `}
                >
                  <div className="text-center space-y-2">
                    <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                      {monthSeason.icon}
                    </div>
                    <div className={`
                      text-sm font-medium transition-colors duration-200
                      ${isCurrent ? 'text-brand-primary' : 'text-text-body group-hover:text-brand-primary'}
                    `}>
                      {monthName}
                    </div>
                    {isCurrent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-primary rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Seasonal Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!current ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary mx-auto mb-4"></div>
            <p className="text-text-muted">Loading seasonal delights...</p>
          </div>
        ) : (
          <div className={`space-y-8 transition-opacity duration-300 ${isAnimating ? 'opacity-50' : 'opacity-100'}`}>
            {/* Seasonal Wisdom */}
            <div className="bg-background-surface rounded-2xl shadow-lg border border-border-default p-8">
              <h3 className="text-2xl font-semibold text-text-heading mb-4">
                This Month&apos;s Seasonal Wisdom
              </h3>
              <p className="text-text-body text-lg leading-relaxed">
                {current.notes}
              </p>
            </div>

            {/* Produce Gallery */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-text-heading">
                What&apos;s in Season Now
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {current.inSeason.map((item, index) => (
                  <div
                    key={item}
                    className="group bg-background-surface rounded-xl border border-border-default p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-text-heading group-hover:text-brand-primary transition-colors">
                        {item}
                      </h4>
                      <div className="opacity-60 group-hover:opacity-100 transition-opacity">
                        {(() => {
                          const IconComponent = getProduceIcon(item)
                          return <IconComponent className="w-6 h-6 text-brand-primary" />
                        })()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <p className="text-sm text-text-muted">
                        Peak season for flavor and nutrition
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <Link 
                          href={`/map?search=${encodeURIComponent(item)}`}
                          className="text-sm text-text-link hover:underline transition-colors"
                        >
                          Find at farm shops →
                        </Link>
                        
                        <span className="text-xs bg-brand-primary/10 text-brand-primary px-2 py-1 rounded-full">
                          In Season
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Tips */}
            <div className="bg-gradient-to-r from-brand-primary/5 to-brand-accent/5 rounded-2xl border border-brand-primary/20 p-8">
              <h3 className="text-2xl font-semibold text-text-heading mb-4">
                Seasonal Eating Tips
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-text-heading mb-2">🌱 Why Seasonal?</h4>
                  <p className="text-text-body text-sm">
                    Seasonal produce is fresher, more nutritious, and often more affordable. 
                    It supports local farmers and reduces environmental impact.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-text-heading mb-2">💡 Storage Tips</h4>
                  <p className="text-text-body text-sm">
                    Store seasonal produce properly to extend freshness. 
                    Most seasonal items keep best in cool, dark places or the refrigerator.
                  </p>
                </div>
              </div>
            </div>

            {/* Source Attribution */}
            {current.source && (
              <div className="text-center py-6 border-t border-border-default">
                <p className="text-sm text-text-muted">
                  Source: <a 
                    className="text-text-link hover:underline" 
                    href={current.source} 
                    target="_blank" 
                    rel="noreferrer"
                  >
                    {current.sourceName || current.source}
                  </a>
                  {current.updatedAt && (
                    <span> · Updated {new Date(current.updatedAt).toLocaleDateString('en-GB')}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-gradient-to-r from-brand-primary/10 to-brand-accent/10 rounded-2xl border border-brand-primary/20 p-8 text-center">
          <h3 className="text-2xl font-semibold text-text-heading mb-4">
            Ready to Taste the Season?
          </h3>
          <p className="text-text-body mb-6">
            Find farm shops near you that stock these seasonal delights
          </p>
          <Link 
            href="/map" 
            className="btn-primary inline-flex items-center gap-2"
          >
            Explore Farm Shops
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Respectful, consented ad slot */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AdSlot />
      </div>
    </main>
  )
}
