// # sync vs async execution

// sync / async 🕮 <ltc> 8a377c7c-b722-4917-9230-8ddfbfa1005b.md

/* Synchronous - executed with regard to other code.
In practice this means that instructions in code are executed in sequence,
i.e. code should wait for the previous operation to complete until a new one can begin (this is called blocking)

Asynchronous - executed with no regard to other code (independently)
In practice this means that it is executed in parallel
This allows to speed up the execution by splitting it in several simultaneous threads
*/

function syncCode() {
	// sync code - console.logs are executed in order, one after the other
	console.log(1);
	console.log(2);
}
// syncCode();

function asyncCode() {
	// async code - console log 2 is executed without waiting for console.log 1
	console.log(1); // 1

	setTimeout(() => {
		console.log('Async');
	}, 3000);

	console.log(2); // 2
}
// asyncCode();

// adv event loop 🕮 <ltc> 44172afd-ccfe-44af-a2a1-96d09a2eeca5.md

// Browser event queues priority
// MicrotasksQueue[promises] > RenderQueue[animations > rendering] > MacrotasksQueue[timeouts, event listeneres etc]

// A pseudo-code that shows how eventLoop works in browser:

while (true) {
	//1  <- setTimeout(fn)   setTimeout method can be used to add the task to macrotasks queue
	queue = getNextQueue();
	task = queue.pop();
	execute(task);

	// Immediately after every macrotask, the engine executes all tasks from microtask queue, prior to running any other macrotasks or rendering or anything else.
	//2 <-queueMicrotask(fn)  queueMicrotask method can be used to add the task to microtasks queue.
	// new microtasks can be added on the fly during this phase and will be also executed on this cycle
	while (microtasksQueue.hasTasks()) doMicrotask();

	if (isRepaintTime()) {
		// browser schedules repaint calls each ~16ms
		//3 <- requestAnimationFrame(fn)   requestAnimationFrame method can be used to add the task to animations queue
		//  new animations added during this phase will be also executed on the next cycle
		animationTasks = animationQueue.copyTasks();
		for (task of animationTasks) doAnimationTask(task);

		repaint();
	}
}

// # callbacks

function asyncCode2() {
	// async code - console log 2 is executed without waiting for console.log 1
	console.log(1); // 1

	setTimeout(() => {
		let result = 5 * 5; // this result will be calculated only after 3 seconds
		// so if we need further calculations, we have no choice but to place the code that needs it into the same callback;
		console.log(result); // this line should be in the callback too

		setTimeout(() => {
			const result2 = (result += 5);
			console.log(result2);

			setTimeout(() => {
				const result3 = (result += 10);
				console.log(result3);
			});
		});

		// 🕮 <ltc> 32fae623-c4d3-4c7a-9052-4aeba204f4ab.md
	}, 3000);
	console.log(2); // 2
}
// asyncCode2();

// adv callback hell 🕮 <ltc> 60c8d5a6-3b1a-40c4-b0dc-75e05a945c60.md
// cb error 🕮 <cyberbiont> cd5eb9f5-bd0d-4f90-8be3-4c4ac85d3f75.md
// cb can be executed multiple times 🕮 <cyberbiont> 0454dfe9-e491-46d7-8692-aed634f61660.md
// analogy 🕮 <cyberbiont> 9031e863-da72-45d6-9eed-fe026580650a.md

// -> promises 🕮 <ltc> a569c3df-1518-468d-b694-5c26ade367f6.md

// # Promises
// How Promise works internally (internal object structure)
/* promise1 = {
  status: "Pending".
  result: undefined,
  resolve(resultValue) {
    this.status = "fullfiled"; // executed correctly
    this.result = resultValue;
  },
  reject(errMessage) {
    this.status = "rejected"; // executed with error
    this.result = errMessage;
  }
}; */

function basicExample() {
	const promise = new Promise((resolve, reject) => {
		// into Promise constructor we pass the executor function
		// its arguments resolve and reject are callbacks provided by JavaScript itself.  //

		// something async happens inside, e.g. setTimeout
		setTimeout(() => {
			resolve('done!');
		}, 1000);
		// When we obtain the result, we should call one of these callbacks
	});

	// if promise is resolved successfully, the first .then callback will be triggered with the result value
	// if promise is rejected with error, the second .then callback (error handler) will be triggered with the error value
	promise.then(
		(result) => console.log(result), // will log "done!" after 1 second
		(error) => console.log(error) // won't be triggered
	);

	// 'then' calls can be chained, because returning value is automatically wrapped in promise
	promise
		.then((result) => result + '-> then') // thess callbacks are sync but usually tou want to do some async stuff inside
		.then((result) => result + '-> then 2')
		.then((result) => console.log(result));
}
// basicExample();

// Once a promise settles, or if it has already settled, it queues a microtask for its reactionary callbacks

// (mid) vacation visa example 🕮 <ltc> e9315428-11b8-4a3f-9b11-283cba606096.md

// # visa example
function visaExample() {
	function getVisa(passport) {
		return new Promise((resolve, reject) => {
			const forbiddenNames = ['Rick', 'Morty'];

			setTimeout(function checkDocuments() {
				/* awaiting until our documents are checked */
				// when we finish the execution, we should call either resolve or reject
				if (!passport.isExpired && !forbiddenNames.includes(passport.name))
					resolve({
						type: 'visa',
						name: passport.name,
					});
				else
					reject(
						new Error(
							'Visa request rejected, your passport is not valid or your name is on the blacklist'
						)
					);
			}, 3000);
		});
	}

	getVisa({
		name: 'Joe',
		isExpired: false,
	})
		.then((visa) => {
			/* show the visa to friends */
			console.log(visa);
			return visa;
		})
		/* calling then() also (implicitly) returns a promise (see Intellisense hint)
    successfully resolved with some result, returned by callback using 'return',
    or rejected with generated error value, if error happened */
		.then((visa) => {
			const money = 2000;
			/* show the visa to our boss, take vacation and get the money */
			if (!visa)
				throw new Error('You vacation request was rejected by your manager!');
			else return money;
		})
		.then((money) => {
			if (!money) throw new Error('Not enough money to buy the tickets!');
			/* buy the tickets */
			const ticket = {
				type: 'ticket',
				timeToFlight: 2000,
			};
			return ticket;
		})
		// ... book a hostel...
		.then((ticket) => {
			/* await the flight */
			// 'then' handler also can explicitly return another new promise, if something happen asyncronously inside it

			// setTimeout is callback-based (takes a callback), so it does not return a promise by itself, and we do it manually (we are "promisifying" setTimeout)
			return new Promise((resolve, reject) =>
				setTimeout(() => {
					// confirm
					resolve(ticket);
				}, ticket.timeToFlight)
			);
		})
		.then((ticket) => {
			if (!ticket) throw new Error('You forgot to take your ticket with you!');
			else console.log('Congratulations, you are on board!');
			/* you fly! */
		})
		.catch((error) => {
			// handle the error, if something went wrong
			// errors from the whole chain are passed here, whenever error occured
			console.log(error);
		})
		.finally(() => {
			// in any case
			console.log('The story of getting a visa');
			// write a blog story about your all of this
		});

	/* getVisa({
    name: 'Joe',
    isValid: true,
  })
    .then(getMoney)
    .then(buyTicket)
    .then(fly);

  function getMoney(visa) {
    if (visa) return 1000;
    else throw new Error('You vacation request was rejected by your manager!');
  }

  function buyTicket(money) {
    if (money >= 1000) return 'ticket';
    else throw new Error('Not enough money to buy the tickets!');
  }

  function fly(ticket) {
    if (ticket) console.log('Congratulations, you are on board!');
    else throw new Error('You forgot to take your ticket with you!');
  } */
}

// visaExample();

// # Promise API
/* Promise.all, Promise.allSettled, Promise.race, Promise.resolve, Promise.reject */

/* Promise.all / Promise.race */
// We have a data array and want to execute an operation with each of the elements in parallel

function promiseAllExample() {
	const arr = [
		{ name: 'a', time: 2000 },
		{ name: 'b', time: 1000 },
		{ name: 'c', time: 3000 },
	];

	const jobs = arr.map((elem) => getPromiseOfResult(elem));

	function getPromiseOfResult(value) {
		return new Promise((res) => setTimeout(() => res(value.name), value.time));
	}

	const results = Promise.all(jobs).then((result) => console.log(result));

	// ~ Promise.race will return only 'b', because it will be resolved first
	// console.log(results); // pending
}

// mid Promise.resolve 🕮 <ltc> e6149e90-7c77-4002-bb90-30c59975b941.md

// # Promise.resolve
// makes sense to use we want to 'wrap' a result in promise, to unify interface if we have both sync and async functions
{
	// this function should return Promise in any case,
	// cause we want to be sure that we can call then on the value that it returns
	function loadCached(url) {
		// but there's a possible scenario where we get result directly (not as promise)
		// in this case we wrap the result in promise manually
		if (cache.has(url)) {
			return Promise.resolve(cache.get(url));
		}

		return fetch(url)
			.then((response) => response.text())
			.then((text) => {
				cache.set(url, text);
				return text;
			});
	}

	// loadCached().then((result) => console.log(result));
}
