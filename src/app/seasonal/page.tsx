import Link from 'next/link'
import { Calendar, MapPin, Clock, Star } from 'lucide-react'

export const metadata = {
  title: 'Seasonal Guide | Farm Companion',
  description: 'Discover what&apos;s in season right now. Find fresh, local produce and seasonal farm shop offerings across the UK.',
  keywords: 'seasonal food, what&apos;s in season, fresh produce, UK farms, seasonal guide',
}

const seasonalItems = [
  {
    name: 'Spring Vegetables',
    description: 'Fresh asparagus, rhubarb, and early greens',
    season: 'Spring',
    months: 'March - May',
    icon: '🌱',
    color: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-200'
  },
  {
    name: 'Summer Fruits',
    description: 'Strawberries, raspberries, and stone fruits',
    season: 'Summer',
    months: 'June - August',
    icon: '🍓',
    color: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-200'
  },
  {
    name: 'Autumn Harvest',
    description: 'Pumpkins, apples, and root vegetables',
    season: 'Autumn',
    months: 'September - November',
    icon: '🍎',
    color: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-200'
  },
  {
    name: 'Winter Storage',
    description: 'Potatoes, onions, and preserved goods',
    season: 'Winter',
    months: 'December - February',
    icon: '🥔',
    color: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-800 dark:text-blue-200'
  }
]

const currentSeason = () => {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Autumn'
  return 'Winter'
}

export default function SeasonalPage() {
  const season = currentSeason()

  return (
    <div className="min-h-screen bg-background-canvas">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-text-heading mb-4">
            Seasonal Guide
          </h1>
          <p className="text-xl text-text-muted max-w-3xl mx-auto">
            Discover what&apos;s fresh and in season right now. 
            Find local farm shops offering the best seasonal produce across the UK.
          </p>
        </div>

        {/* Current Season Highlight */}
        <div className="mb-12">
          <div className="bg-background-surface border border-border-default rounded-lg p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">
                {seasonalItems.find(item => item.season === season)?.icon}
              </div>
              <h2 className="text-2xl font-bold text-text-heading mb-2">
                Currently in Season: {season}
              </h2>
              <p className="text-text-muted mb-6">
                {seasonalItems.find(item => item.season === season)?.description}
              </p>
              <Link
                href="/map"
                className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Seasonal Produce Near You
              </Link>
            </div>
          </div>
        </div>

        {/* Seasonal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {seasonalItems.map((item) => (
            <div
              key={item.season}
              className={`${item.color} rounded-lg p-6 text-center`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className={`text-lg font-semibold ${item.textColor} mb-2`}>
                {item.name}
              </h3>
              <p className="text-sm text-text-muted mb-3">
                {item.description}
              </p>
              <div className="flex items-center justify-center text-xs text-text-muted">
                <Calendar className="w-4 h-4 mr-1" />
                {item.months}
              </div>
            </div>
          ))}
        </div>

        {/* Seasonal Tips */}
        <div className="bg-background-surface border border-border-default rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-text-heading mb-6 text-center">
            Seasonal Shopping Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-text-heading">Best Quality</h3>
                <p className="text-sm text-text-muted">
                  Seasonal produce is often fresher and more flavorful
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-text-heading">Better Value</h3>
                <p className="text-sm text-text-muted">
                  Seasonal items are usually more affordable
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-text-heading">Local Support</h3>
                <p className="text-sm text-text-muted">
                  Support local farmers and reduce food miles
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-heading mb-4">
            Ready to Find Seasonal Produce?
          </h2>
          <p className="text-text-muted mb-6">
            Explore our map to find farm shops near you with the freshest seasonal offerings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/map"
              className="inline-flex items-center px-6 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Explore Farm Shops
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border border-border-default text-text-body rounded-lg hover:bg-background-surface transition-colors"
            >
              Browse All Farms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
