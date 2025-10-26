// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const token = getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Authentication API
export const authAPI = {
  // Register new user
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    role: 'contractor' | 'engineer' | 'supplier' | 'project_manager';
    companyName?: string;
    gstNumber?: string;
    panNumber?: string;
    address: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country?: string;
    };
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    
    return response;
  },

  // Get current user profile
  getMe: async () => {
    return apiRequest('/auth/me');
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Change password
  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // Logout (remove token)
  logout: () => {
    localStorage.removeItem('authToken');
  },
};

// Products API
export const productsAPI = {
  // Get all products with filters
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    supplier?: string;
    city?: string;
    state?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return apiRequest(endpoint);
  },

  // Get single product
  getProduct: async (id: string) => {
    return apiRequest(`/products/${id}`);
  },

  // Create new product (suppliers only)
  createProduct: async (productData: {
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    brand?: string;
    model?: string;
    specifications: Record<string, any>;
    price: number;
    unit: string;
    images: string[];
    inventory: {
      quantity: number;
      minQuantity: number;
      maxQuantity: number;
    };
    location: {
      city: string;
      state: string;
      pincode: string;
    };
    tags?: string[];
  }) => {
    return apiRequest('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  // Update product
  updateProduct: async (id: string, productData: any) => {
    return apiRequest(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  // Delete product
  deleteProduct: async (id: string) => {
    return apiRequest(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Get product categories
  getCategories: async () => {
    return apiRequest('/products/categories');
  },

  // Get products by supplier
  getProductsBySupplier: async (supplierId: string, params: {
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `/products/supplier/${supplierId}?${queryString}` 
      : `/products/supplier/${supplierId}`;
    
    return apiRequest(endpoint);
  },
};

// Orders API
export const ordersAPI = {
  // Create new order
  createOrder: async (orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingAddress: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country?: string;
      contactName: string;
      contactPhone: string;
    };
    billingAddress?: {
      street: string;
      city: string;
      state: string;
      pincode: string;
      country?: string;
    };
    notes?: string;
  }) => {
    return apiRequest('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get user orders
  getUserOrders: async (params: {
    page?: number;
    limit?: number;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders?${queryString}` : '/orders';
    
    return apiRequest(endpoint);
  },

  // Get single order
  getOrder: async (id: string) => {
    return apiRequest(`/orders/${id}`);
  },

  // Update order status (admin/supplier)
  updateOrderStatus: async (id: string, statusData: {
    status: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    notes?: string;
  }) => {
    return apiRequest(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // Cancel order
  cancelOrder: async (id: string) => {
    return apiRequest(`/orders/${id}/cancel`, {
      method: 'PUT',
    });
  },

  // Get all orders (admin only)
  getAllOrders: async (params: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
  } = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders/all?${queryString}` : '/orders/all';
    
    return apiRequest(endpoint);
  },
};

// Health check API
export const healthAPI = {
  check: async () => {
    return fetch(`${API_BASE_URL.replace('/api', '')}/health`).then(res => res.json());
  },
};

export default {
  authAPI,
  productsAPI,
  ordersAPI,
  healthAPI,
};
