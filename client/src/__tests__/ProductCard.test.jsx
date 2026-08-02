import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

describe('ProductCard Component', () => {
  const sampleProduct = {
    _id: 'prod-1234567890abcdef123456',
    name: 'Cyberpunk Neon Button',
    category: 'Basic UI Components',
    price: 349,
    rating: 4.8,
    reviews: 12,
    framework: 'react',
    previewImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe'
  };

  it('renders product title, price, and category badge correctly', () => {
    render(
      <BrowserRouter>
        <ProductCard product={sampleProduct} />
      </BrowserRouter>
    );

    expect(screen.getByText('Cyberpunk Neon Button')).toBeTruthy();
    expect(screen.getByText('₹349')).toBeTruthy();
    expect(screen.getByText('Basic UI Components')).toBeTruthy();
  });
});
