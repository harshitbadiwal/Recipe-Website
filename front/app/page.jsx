import Hero from '@/components/Hero/Hero'
import FeaturedRecipes from '@/components/FeaturedRecipes/FeaturedRecipes'
import VideoSection from '@/components/VideoSection/VideoSection'
import CategorySection from '@/components/CategorySection/CategorySection'
import ArticlesSection from '@/components/ArticlesSection/ArticlesSection'
import Newsletter from '@/components/Newsletter/Newsletter'
import { getHomepageData } from '@/services/api'

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
        url: '/Gemini_Generated_Image_3xpagu3xpagu3xpa_compressed.webp',
        width: 1200,
        height: 630,
        alt: 'Recipe Master Home',
      },
    ],
  },
}

export default async function HomePage() {
  const homeData = await getHomepageData().catch(() => null)

  return (
    <main className="home">
      <Hero initialSlides={homeData?.heroSlides || []} />
      <FeaturedRecipes />
      {/* <VideoSection /> */}
      <CategorySection />
      <ArticlesSection />
      <Newsletter />
    </main>
  )
}
