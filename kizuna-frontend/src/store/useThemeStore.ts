//theme in ls
import { create } from "zustand";

interface ThemeInterface {
    theme: string,
    setTheme: (theme: string) => void
}

export const useThemeStore = create<ThemeInterface>((set) => ({
    theme: localStorage.getItem('theme') || 'cupcake',
    setTheme: (theme) => {
    localStorage.setItem('theme', theme);
    set({theme})
    }
}))