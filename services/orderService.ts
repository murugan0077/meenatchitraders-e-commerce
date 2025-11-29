import { db } from '../firebase';
import { collection, addDoc, getDoc, doc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { Order, OrderStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export const orderService = {
    createOrder: async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
        const newOrder = {
            ...order,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'pending' as OrderStatus
        };
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), newOrder);
        return { id: docRef.id, ...newOrder } as Order;
    },
    getOrder: async (id: string): Promise<Order | null> => {
        const docRef = doc(db, ORDERS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Order;
        }
        return null;
    },
    updateOrderStatus: async (id: string, status: OrderStatus, trackingNumber?: string): Promise<void> => {
        const docRef = doc(db, ORDERS_COLLECTION, id);
        const updates: any = { status, updatedAt: new Date() };
        if (trackingNumber) updates.trackingNumber = trackingNumber;
        await updateDoc(docRef, updates);
    },
    getOrdersByPhone: async (phone: string): Promise<Order[]> => {
        const q = query(collection(db, ORDERS_COLLECTION), where("customerPhone", "==", phone));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    },
    getAllOrders: async (): Promise<Order[]> => {
        const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }
};
