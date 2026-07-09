import Hero from '../../components/home/Hero';
import ComponentShowcase from '../../components/home/ComponentShowcase';
import FeatureTimeline from '../../components/home/FeatureTimeline';
import TrendingProducts from '../../components/home/TrendingProducts';
import Testimonials from '../../components/home/Testimonials';
import AIRecommended from '../../components/home/AIRecommended';

export default function HomePage() {
  return (
    <div className="bg-[#080712] min-h-screen">
      <Hero />
      <ComponentShowcase />
      <AIRecommended />
      <FeatureTimeline />
      <TrendingProducts />
      <Testimonials />
    </div>
  );
}
