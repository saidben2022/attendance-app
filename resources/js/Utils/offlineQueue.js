/**
 * Offline Queue for Check-ins
 * Uses IndexedDB to store pending check-ins when offline
 */

const DB_NAME = 'attendease-offline';
const DB_VERSION = 1;
const STORE_NAME = 'pending-checkins';

let db = null;

// Initialize IndexedDB
export async function initOfflineQueue() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            db = request.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const database = event.target.result;
            if (!database.objectStoreNames.contains(STORE_NAME)) {
                database.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };
    });
}

// Add a check-in to the queue
export async function queueCheckIn(checkInData) {
    if (!db) await initOfflineQueue();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record = {
            ...checkInData,
            queuedAt: new Date().toISOString(),
            status: 'pending'
        };

        const request = store.add(record);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get all pending check-ins
export async function getPendingCheckIns() {
    if (!db) await initOfflineQueue();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Remove a check-in from the queue
export async function removeCheckIn(id) {
    if (!db) await initOfflineQueue();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

// Sync all pending check-ins
export async function syncPendingCheckIns(onSuccess, onError) {
    const pending = await getPendingCheckIns();

    for (const checkIn of pending) {
        try {
            const response = await fetch('/check-in/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
                },
                body: JSON.stringify({
                    token: checkIn.token,
                    pin: checkIn.pin,
                }),
            });

            if (response.ok) {
                await removeCheckIn(checkIn.id);
                if (onSuccess) onSuccess(checkIn);
            } else {
                if (onError) onError(checkIn, 'Server rejected check-in');
            }
        } catch (error) {
            // Still offline, keep in queue
            console.log('Still offline, keeping check-in in queue:', checkIn.id);
        }
    }
}

// Check if online and sync
export function setupAutoSync() {
    window.addEventListener('online', () => {
        console.log('Back online, syncing pending check-ins...');
        syncPendingCheckIns(
            (checkIn) => console.log('Synced check-in:', checkIn.id),
            (checkIn, error) => console.error('Failed to sync:', checkIn.id, error)
        );
    });
}

// Get pending count
export async function getPendingCount() {
    const pending = await getPendingCheckIns();
    return pending.length;
}
