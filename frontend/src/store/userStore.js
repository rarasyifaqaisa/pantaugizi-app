import { create } from "zustand";

const useUserStore = create((set) => ({
  user:       null,
  token:      localStorage.getItem("token") || null,
  todayLogs:  null,

  setUser:  (user)  => set({ user }),
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setTodayLogs: (logs) => set({ todayLogs: logs }),
  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, todayLogs: null });
  },
}));

export default useUserStore;