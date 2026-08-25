import Hero from '@/components/Hero/Hero'
import FeaturedRecipes from '@/components/FeaturedRecipes/FeaturedRecipes'
import VideoSection from '@/components/VideoSection/VideoSection'
import CategorySection from '@/components/CategorySection/CategorySection'
import ArticlesSection from '@/components/ArticlesSection/ArticlesSection'
import Newsletter from '@/components/Newsletter/Newsletter'

export const metadata = {
  title: 'Recipe Master - Authentic Recipes, Video Tutorials & Cooking Tips',
  description:
    'Explore delicious chef-crafted recipes, step-by-step masterclasses, and cooking guides for Indian and global culinary classics.',
  openGraph: {
    title: 'Recipe Master - Authentic Recipes, Video Tutorials & Cooking Tips',
    description:
      'Explore delicious chef-crafted recipes, step-by-step masterclasses, and cooking guides.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Recipe Master Home',
      },
    ],
  },
}

export default function HomePage() {
  return (
    <main className="home">
      <Hero />
      <FeaturedRecipes />
      <VideoSection />
      <CategorySection />
      <ArticlesSection />
      <Newsletter />
    </main>
  )
}
