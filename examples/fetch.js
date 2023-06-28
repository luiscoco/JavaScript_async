// Fetch - integrated in Javacript method for making requests to server, that returns the results as a promise

/* with fetch you can load and output pieces of the information only when you need it
(page sections  depending on user's device, new portion of products in a long catalogue)
 */

async function getExampleAwait() {
	const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');

	if (!response.ok) throw new Error('Page not found');

	const result = await response.json();
	console.log(result);
}
// getExampleAwait();

function getExampleThen() {
	// check network activity (requests) in devTools on Network - XHR tab
	const request = fetch('https://jsonplaceholder.typicode.com/todos/1');

	// 🕮 <ltc> afe65337-ccf4-4442-ace7-614b30b89a67.md

	// Promise is returned in 'Pending' state
	console.log(request);

	request
		.then((response) => {
			// promise fulfilled (server sent the response headers). We can check the status:
			// console.log(response);
			console.log(response);
			if (!response.ok) throw new Error('Page not found');
			// the content itself is contained in 'body' property
			// to get it in a form we want it, we can use one of the provided methods, most often, .json()
			return response.json(); // read body as json (works like JSON.parse)
		})
		.then((result) => {
			console.log(result);
		});
}
// getExampleAwait();

// POST-request
// if we want to send some information to server, and get the response, whether it was successfully received
function postExample() {
	fetch('https://jsonplaceholder.typicode.com/posts', {
		method: 'POST',
		headers: {
			'Content-type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify({
			title: 'foo',
			description: 'bar',
		}),
	})
		.then((response) => {
			if (!response.ok) throw new Error(response.statusText);
			return response.json();
		})
		.then((data) => console.log(data))
		.catch((error) => console.log(error));
}
postExample();
