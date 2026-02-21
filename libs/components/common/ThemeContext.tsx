import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
	isDark: boolean;
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isDark, setIsDark] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			setIsDark(savedTheme === 'dark');
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			setIsDark(prefersDark);
		}
		setIsMounted(true);
	}, []);

	useEffect(() => {
		if (!isMounted) return;

		if (isDark) {
			document.documentElement.classList.add('dark-mode');
		} else {
			document.documentElement.classList.remove('dark-mode');
		}
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
	}, [isDark, isMounted]);

	const toggleTheme = () => {
		setIsDark(!isDark);
	};

	return (
		<ThemeContext.Provider value={{ isDark, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		return { isDark: false, toggleTheme: () => {} };
	}
	return context;
};