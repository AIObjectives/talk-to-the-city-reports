import { ref, listAll, getMetadata } from 'firebase/storage';
import { storage } from '$lib/firebase';

const storageRef = ref(storage);

async function getList(folder) {
	const metaView = [];
	const folderObj = {};
	const result = await listAll(ref(storageRef, folder));
	for (let itemRef of result.items) {
		folderObj[itemRef.name] = itemRef;
		metaView.push(await getMetadata(itemRef));
	}
	return [folderObj, metaView];
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url, request }) {
	const data = await getList('tttc-turbo');
	console.log(data);
	return new Response(JSON.stringify(data), {});
}
