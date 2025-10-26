import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, totalAmount, removeItem, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      // Show login modal or redirect to login
      return;
    }

    setIsCheckingOut(true);
    try {
      // TODO: Implement checkout process
      console.log('Proceeding to checkout...');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Shopping Cart</h2>
              <Badge variant="secondary">{totalItems}</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">
                  Add some construction materials to get started
                </p>
                <Button onClick={onClose}>
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.productId} className="p-4">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          by {item.supplier.name}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">
                            ₹{item.price.toLocaleString('en-IN')} / {item.unit}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.productId)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="font-medium">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Authentication Alert */}
              {!isAuthenticated && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please sign in to proceed with checkout
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={!isAuthenticated || isCheckingOut}
                  className="flex-1"
                >
                  {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
