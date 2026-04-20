import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/api";

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
  loading: false,
  error: null,

  setUsers: (users) => set({ users }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  
}));
