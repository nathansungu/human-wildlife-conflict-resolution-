import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginattempts: 0,

      login: (userData) => set({ user: userData, isAuthenticated: true }),

      logout: async () => set({ user: null, isAuthenticated: false }),

      setUser: (userData) =>
        set({ user: userData, isAuthenticated: !!userData }),

      checkAuth: async () => {
        try {
          const response = await authService.getMe();
          set({ user: response.data, isAuthenticated: true, isLoading: false });
        } catch {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
      setLoginAttempts: () => set((state) => ({ loginAttempts: state.loginAttempts + 1 })),
    }),

    {
      name: "auth-storage",
    },
  ),
);

// App Store
export const useAppStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  selectedCamera: null,
  setSelectedCamera: (camera) => set({ selectedCamera: camera }),

  dateRange: { start: null, end: null },
  setDateRange: (range) => set({ dateRange: range }),
}));

// User Store
export const useUserStore = create((set) => ({
  users: [],
  subscribers: [],
  loading: false,
  error: null,

  setUsers: (users) => set({ users }),
  setSubscribers: (subscribers) => set({ subscribers }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  
}));

//organization Store
export const useOrganizationStore = create((set) => ({
  organizations: [],
  isLoading: false, 
  error: null,

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setOrganizations: (organizations) => set({ organizations }),
}));
