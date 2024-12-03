import { createClient } from 'redis';


const Redisclient = createClient({
    url: `redis://redis:6379`, // Use the Docker service name as the host
});

async function initializeRedis() {
    try {
        await Redisclient.connect();
        await Redisclient.flushAll();
        console.log("Redis client connected successfully.");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}

initializeRedis();
export { Redisclient };

export async function clearUserCalendarCache(uid: string) {
    const keys = await Redisclient.keys(`${uid}*`);
    if (keys.length > 0) {
        console.log("Deleting keys:", keys);
        await Redisclient.del(keys);
    }
}

export async function updateUserEvents(uid: string, newEvent: any) {
    try {
        const eventKey = `[Events]${uid}`;
        // Fetch existing events
        const existingEventsString = await Redisclient.get(eventKey);
        const existingEvents = existingEventsString ? JSON.parse(existingEventsString) : [];

        // Add the new event at the start of the list
        existingEvents.unshift(newEvent);
        const latestEvents = existingEvents.slice(0, 50);
        await Redisclient.set(eventKey, JSON.stringify(latestEvents));
    } catch (error) {
        console.error(`Failed to update events for user ${uid}:`, error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}
