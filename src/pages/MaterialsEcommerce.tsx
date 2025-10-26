import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CartDrawer } from "@/components/CartDrawer";
import { useCart } from "@/contexts/CartContext";
import { productsAPI } from "@/services/api";
import {
  Search,
  SlidersHorizontal,
  ShoppingCart,
  Camera,
  TrendingUp,
  Package,
  Truck,
  ShieldCheck,
  Star,
  MapPin,
  Loader2,
} from "lucide-react";

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  images: string[];
  supplier: {
    _id: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  inventory: {
    quantity: number;
    isInStock: boolean;
  };
  location: {
    city: string;
    state: string;
  };
  ratings: {
    average: number;
    count: number;
  };
}

export default function MaterialsEcommerce() {
  const { addItem, totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = [
    { value: "", label: "All Materials" },
    { value: "cement_concrete", label: "Cement & Concrete" },
    { value: "steel_metals", label: "Steel & Metals" },
    { value: "bricks_blocks", label: "Bricks & Blocks" },
    { value: "sand_aggregates", label: "Sand & Aggregates" },
    { value: "tiles_flooring", label: "Tiles & Flooring" },
    { value: "paints_chemicals", label: "Paints & Chemicals" },
  ];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProducts({
          search: searchTerm || undefined,
          category: selectedCategory || undefined,
          limit: 20,
        });
        setProducts(response.data.products);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        // Fallback to mock data for development
        setProducts(getMockProducts());
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedCategory]);

  // Mock data fallback
  const getMockProducts = (): Product[] => [
    {
      _id: "1",
      name: "UltraTech Cement",
      description: "High-quality Portland cement for construction",
      category: "cement_concrete",
      price: 385,
      unit: "per bag (50kg)",
      images: ["https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=400&h=300&fit=crop"],
      supplier: {
        _id: "supplier1",
        firstName: "BuildMart",
        lastName: "Supplies",
        companyName: "BuildMart Supplies",
      },
      inventory: { quantity: 100, isInStock: true },
      location: { city: "Mumbai", state: "Maharashtra" },
      ratings: { average: 4.8, count: 2847 },
    },
    {
      _id: "2",
      name: "TMT Steel Bars - 12mm",
      description: "Thermo-mechanically treated steel bars",
      category: "steel_metals",
      price: 52000,
      unit: "per ton",
      images: ["https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=300&fit=crop"],
      supplier: {
        _id: "supplier2",
        firstName: "Steel Valley",
        lastName: "Industries",
        companyName: "Steel Valley Industries",
      },
      inventory: { quantity: 50, isInStock: true },
      location: { city: "Pune", state: "Maharashtra" },
      ratings: { average: 4.7, count: 1523 },
    },
    {
      _id: "3",
      name: "Red Clay Bricks",
      description: "High-quality red clay bricks",
      category: "bricks_blocks",
      price: 6.50,
      unit: "per piece",
      images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop"],
      supplier: {
        _id: "supplier3",
        firstName: "BrickWorks",
        lastName: "Co.",
        companyName: "BrickWorks Co.",
      },
      inventory: { quantity: 10000, isInStock: true },
      location: { city: "Delhi", state: "NCR" },
      ratings: { average: 4.6, count: 892 },
    },
  ];

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.images[0],
      supplier: {
        name: product.supplier.companyName || `${product.supplier.firstName} ${product.supplier.lastName}`,
        id: product.supplier._id,
      },
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 border-b border-border/50">
        <div className="container px-4 py-12">
          <div className="max-w-4xl">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              Material Supply E-commerce
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Complete Construction
              <span className="block text-primary">Material Marketplace</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Access 10,000+ verified suppliers | AI-powered search | Integrated logistics | GST-compliant invoicing
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search materials by name, category, or specification..."
                  className="pl-10 h-12 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button size="lg" className="bg-accent hover:bg-accent-glow gap-2">
                <Camera className="w-5 h-5" />
                AI Scan
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </Button>
            </form>

            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <Card className="p-4 border-border/50">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs text-muted-foreground">Suppliers</div>
              </Card>
              <Card className="p-4 border-border/50">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Materials</span>
                </div>
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-xs text-muted-foreground">Products</div>
              </Card>
              <Card className="p-4 border-border/50">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Truck className="w-4 h-4" />
                  <span className="text-sm font-medium">Logistics</span>
                </div>
                <div className="text-2xl font-bold">24hr</div>
                <div className="text-xs text-muted-foreground">Delivery</div>
              </Card>
              <Card className="p-4 border-border/50">
                <div className="flex items-center gap-2 text-accent mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">Orders</span>
                </div>
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-xs text-muted-foreground">This Month</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-8">
        <div className="container px-4">
          <div className="flex gap-6">
            {/* Sidebar Filters */}
            <aside className="hidden lg:block w-64 space-y-6">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                      <input 
                        type="radio" 
                        name="category"
                        value={cat.value}
                        checked={selectedCategory === cat.value}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="rounded border-border" 
                      />
                      <span className="text-sm">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-3">
                  <Input placeholder="Min Price" type="number" />
                  <Input placeholder="Max Price" type="number" />
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Supplier Type</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Verified Suppliers</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Premium Partners</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-border" />
                    <span className="text-sm">Local Suppliers</span>
                  </label>
                </div>
              </Card>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Construction Materials</h2>
                  <p className="text-sm text-muted-foreground">
                    {loading ? 'Loading...' : `${products.length} products found`}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Sort by: Relevance</Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="relative"
                    onClick={() => setIsCartOpen(true)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-accent text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="ml-2">Loading products...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{error}</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card key={product._id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-glow">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <Badge className="absolute top-3 right-3 bg-primary/90 text-white">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                        {product.inventory.isInStock && (
                          <Badge className="absolute top-3 left-3 bg-accent/90 text-white">
                            In Stock
                          </Badge>
                        )}
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-accent">
                            <Star className="w-4 h-4 fill-accent" />
                            <span className="font-medium text-sm">{product.ratings.average}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">({product.ratings.count} reviews)</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{product.location.city}, {product.location.state}</span>
                        </div>

                        <div className="pt-3 border-t border-border/50">
                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-2xl font-bold text-primary">
                                ₹{product.price.toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-muted-foreground">{product.unit}</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              className="flex-1 bg-primary hover:bg-primary-glow"
                              onClick={() => handleAddToCart(product)}
                            >
                              Add to Cart
                            </Button>
                            <Button variant="outline" size="icon">
                              <Package className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="text-xs text-muted-foreground">
                          by {product.supplier.companyName || `${product.supplier.firstName} ${product.supplier.lastName}`}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}