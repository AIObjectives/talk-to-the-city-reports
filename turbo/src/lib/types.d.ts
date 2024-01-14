declare global {
	interface User {
		id: string;
	}
	interface Claim {
		id: string;
		topicName: string;
		subtopicName: string;
		interview: string;
		quote: string;
		claim: string;
		commentId: string;
	}
}
