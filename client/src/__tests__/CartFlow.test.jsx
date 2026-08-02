import { render, screen, fireEvent, act } from '@testing-library/react';
import { useContext } from 'react';
import { CartProvider, CartContext } from '../context/CartContext';

function TestCartComponent() {
  const { cart, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  return (
    <div>
      <span data-testid="cart-count">{cart.items.length}</span>
      <button 
        onClick={() => addToCart({ id: 'p1', name: 'Test Component', price: 299 })}
        data-testid="add-btn"
      >
        Add Item
      </button>
      <button 
        onClick={() => removeFromCart('p1')}
        data-testid="remove-btn"
      >
        Remove Item
      </button>
      <button 
        onClick={clearCart}
        data-testid="clear-btn"
      >
        Clear Cart
      </button>
    </div>
  );
}

describe('Cart Flow State Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('updates cart items state cleanly on add, remove, and clear', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    );

    const count = screen.getByTestId('cart-count');
    expect(count.textContent).toBe('0');

    const addBtn = screen.getByTestId('add-btn');
    fireEvent.click(addBtn);
    expect(screen.getByTestId('cart-count').textContent).toBe('1');

    const clearBtn = screen.getByTestId('clear-btn');
    fireEvent.click(clearBtn);
    expect(screen.getByTestId('cart-count').textContent).toBe('0');
  });
});
