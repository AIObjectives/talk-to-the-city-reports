<script>
	import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
	import { getAuth } from 'firebase/auth';

	let fileInput;
	const storage = getStorage();
	const auth = getAuth();
	let uploadProgress = 0;

	async function handleFileUpload() {
		const file = fileInput.files[0];
		if (!file) return;
		const userId = auth.currentUser.uid;
		const storageRef = ref(storage, `uploads/${userId}/${file.name}`);
		const uploadTask = uploadBytesResumable(storageRef, file);
		uploadTask.on(
			'state_changed',
			(snapshot) => {
				const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				uploadProgress = progress;
			},
			(error) => {
				console.error('Upload failed', error);
			},
			() => {
				console.log('Upload successful');
			}
		);
	}
</script>

<input type="file" bind:this={fileInput} />
<button on:click={handleFileUpload}>Upload</button>
<p>Upload Progress: {uploadProgress}%</p>
