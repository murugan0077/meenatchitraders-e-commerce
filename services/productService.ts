import { db } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

import { Product } from '../types';

const PRODUCTS_COLLECTION = 'products';
const CACHE_KEY = 'products_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = 15000): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

export const productService = {
    getProducts: async (): Promise<Product[]> => {
        // Check cache first
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { timestamp, data } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_DURATION) {
                console.log("Returning cached products");
                return data;
            }
        }

        console.log("Fetching products from Firestore");
        const snapshot = await withTimeout(getDocs(collection(db, PRODUCTS_COLLECTION)));
        // Filter out soft-deleted products
        const products = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Product))
            .filter(p => !p.isDeleted);

        // Update cache
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            data: products
        }));

        return products;
    },
    getProductById: async (id: string): Promise<Product | null> => {
        // Try to find in cache first
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data } = JSON.parse(cached);
            const found = data.find((p: Product) => p.id === id);
            if (found) return found;
        }

        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        const docSnap = await withTimeout(getDoc(docRef));
        if (docSnap.exists()) {
            const product = { id: docSnap.id, ...docSnap.data() } as Product;
            if (product.isDeleted) return null; // Treat soft-deleted as not found
            return product;
        }
        return null;
    },
    addProduct: async (product: Omit<Product, 'id'>): Promise<Product> => {
        console.log("productService: Adding product to Firestore...", product);
        const docRef = await withTimeout(addDoc(collection(db, PRODUCTS_COLLECTION), { ...product, isDeleted: false }));
        console.log("productService: Product added with ID:", docRef.id);

        sessionStorage.removeItem(CACHE_KEY); // Invalidate cache
        return { id: docRef.id, ...product };
    },
    updateProduct: async (product: Product): Promise<void> => {
        const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
        const { id, ...data } = product;
        await withTimeout(updateDoc(docRef, data));
        sessionStorage.removeItem(CACHE_KEY); // Invalidate cache
    },
    deleteProduct: async (id: string): Promise<void> => {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        // Soft delete: update isDeleted to true
        await withTimeout(updateDoc(docRef, { isDeleted: true }));
        sessionStorage.removeItem(CACHE_KEY); // Invalidate cache
    }
};
