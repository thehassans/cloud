import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      login: (user, token, refreshToken) => {
        set({ user, token, refreshToken, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },

      setToken: (token) => {
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (i) => i.type === item.type && i.product_id === item.product_id && i.billing_cycle === item.billing_cycle
        );

        if (existingIndex > -1) {
          const newItems = [...items];
          newItems[existingIndex].quantity += 1;
          set({ items: newItems });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (index) => {
        const items = get().items.filter((_, i) => i !== index);
        set({ items });
      },

      updateQuantity: (index, quantity) => {
        const items = [...get().items];
        if (quantity <= 0) {
          items.splice(index, 1);
        } else {
          items[index].quantity = quantity;
        }
        set({ items });
      },

      clearCart: () => {
        set({ items: [], couponCode: null, couponDiscount: 0 });
      },

      applyCoupon: (code, discount) => {
        set({ couponCode: code, couponDiscount: discount });
      },

      removeCoupon: () => {
        set({ couponCode: null, couponDiscount: 0 });
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.price * (item.quantity || 1));
        }, 0);
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        return subtotal - get().couponDiscount;
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + (item.quantity || 1), 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Settings Store
export const useSettingsStore = create(
  persist(
    (set) => ({
      theme: 'light', // 'light' or 'dark'
      language: 'en',
      currency: 'USD',
      siteSettings: {},

      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setLanguage: (language) => set({ language }),
      setCurrency: (currency) => set({ currency }),
      setSiteSettings: (settings) => set({ siteSettings: settings }),
    }),
    {
      name: 'settings-storage',
    }
  )
);

// UI Store (non-persistent)
export const useUIStore = create((set) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isLoading: false,
  modal: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setLoading: (isLoading) => set({ isLoading }),
  openModal: (modal) => set({ modal }),
  closeModal: () => set({ modal: null }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
