import {useEffect, useState} from "react";

export function useLocalStorage(key: string) {
    const [value, setValue] = useState(() => {
        // Get the initial value from localStorage or set it to null if not found
        const storedValue = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    });

    useEffect(() => {
        // Update localStorage whenever the value changes
        if (value !== null) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [value, key]);

    return [value, setValue];
}

export function setPageTitle(title: string) {
    document.title = title;
}

export interface Token {
    username: string;
    token: string;
    expire: number;
    roles: string[];
}

export interface RestBean<T> {
    code: number;
    message: string;
    data: T;
}