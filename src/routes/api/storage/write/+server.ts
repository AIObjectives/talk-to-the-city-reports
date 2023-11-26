import { ref, listAll, getMetadata } from 'firebase/storage';
import { storage } from '$lib/firebase';
const storageRef = ref(storage);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const filename = url.searchParams.get('filename');
	if (!filename) {
		return new Response(JSON.stringify({ error: 'Filename is required' }), {
			status: 400,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}

	const storageRef = ref(storage, `uploads/${filename}`);

	// Generate the signed URL for direct file upload
	// Adjust the options as needed for your use case
	const options = {
		// Options...
	};

	try {
		// Logic to generate a signed URL
		// Note: Firebase Storage in the client SDK does not directly support generating signed URLs
		// You might need to use Firebase Admin SDK or handle this in a different way
		// Depending on your Firebase setup and security requirements

		return new Response(JSON.stringify({ url: 'signed-url-generated-here' }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	} catch (error) {
		return new Response(JSON.stringify({ error: error.message }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json'
			}
		});
	}
}
