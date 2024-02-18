import serviceAccount from '$lib/service-account-pk.json' assert { type: 'json' };
import jwt from 'jsonwebtoken';
import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export const checkJWT = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, import.meta.env.VITE_APP_API_KEY, (err, decoded) => {
      if (err) {
        reject('Token verification failed: ' + err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const checkFirebaseToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export function authenticated(handler) {
  return async function ({ url, request }) {
    const token = request.headers.get('Authorization')?.split('Bearer ')[1];
    if (!token) {
      return new Response('Unauthorized', { status: 401 });
    }
    const user = await checkJWT(token);
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    return handler({ url, request, user });
  };
}
