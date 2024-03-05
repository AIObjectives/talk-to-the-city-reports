import { query, where, getDocs, doc, setDoc, collection, Timestamp } from 'firebase/firestore/lite';
import { db } from '$lib/firebase';

const rateLimiterCollection = collection(db, 'rateLimiter');

const getRateLimitData = async (ip) => {
  const q = query(rateLimiterCollection, where('ip', '==', ip));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  return null;
};

const updateRateLimitData = async (ip, data) => {
  const docRef = doc(rateLimiterCollection, ip);
  await setDoc(docRef, data);
};

const checkRateLimit = async (ip) => {
  let data = await getRateLimitData(ip);
  const now = Timestamp.now();
  if (!data) {
    data = {
      ip,
      minute: { count: 1, timestamp: now },
      hour: { count: 1, timestamp: now },
      day: { count: 1, timestamp: now }
    };
  } else {
    const minuteDiff = now.seconds - data.minute.timestamp.seconds;
    const hourDiff = now.seconds - data.hour.timestamp.seconds;
    const dayDiff = now.seconds - data.day.timestamp.seconds;
    console.log(data.minute.count);
    if (minuteDiff < 60 && data.minute.count >= 5) {
      throw new Error('Rate limit exceeded: Max 5 calls per minute');
    }
    if (hourDiff < 3600 && data.hour.count >= 100) {
      throw new Error('Rate limit exceeded: Max 100 calls per hour');
    }
    if (dayDiff < 86400 && data.day.count >= 1000) {
      throw new Error('Rate limit exceeded: Max 1000 calls per day');
    }
    data.minute.count = minuteDiff < 60 ? data.minute.count + 1 : 1;
    data.hour.count = hourDiff < 3600 ? data.hour.count + 1 : 1;
    data.day.count = dayDiff < 86400 ? data.day.count + 1 : 1;
    data.minute.timestamp = minuteDiff < 60 ? data.minute.timestamp : now;
    data.hour.timestamp = hourDiff < 3600 ? data.hour.timestamp : now;
    data.day.timestamp = dayDiff < 86400 ? data.day.timestamp : now;
  }
  await updateRateLimitData(ip, data);
  return true;
};

export { checkRateLimit };
