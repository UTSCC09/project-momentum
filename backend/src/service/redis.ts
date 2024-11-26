import { createClient } from 'redis';


const Redisclient = createClient();

async function initializeRedis() {
    try {
        await Redisclient.connect();
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


// export async function nodeRedisDemo() {
//   try {
//     const client = createClient();
//     await client.connect();

//     await client.set('mykey', 'Hello from node redis');
//     const myKeyValue = await client.get('mykey');
//     console.log(myKeyValue);

//     // const numAdded = await client.zAdd('vehicles', [
//     //   {
//     //     score: 4,
//     //     value: 'car',
//     //   },
//     //   {
//     //     score: 2,
//     //     value: 'bike',
//     //   },
//     // ]);
//     // console.log(`Added ${numAdded} items.`);

//     // for await (const { score, value } of client.zScanIterator('vehicles')) {
//     //   console.log(`${value} -> ${score}`);
//     // }

//     await client.quit();
//   } catch (e) {
//     console.error(e);
//   }
// }