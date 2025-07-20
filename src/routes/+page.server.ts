export async function load({ fetch }) {
	const data = await fetch('https://api.example.com/user').then((response) => response.json());

	return {
		user: data
	};
}
