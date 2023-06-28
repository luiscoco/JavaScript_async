'use strict';

// # setTimeout
// setTimeout allows us to run a function once after the interval of time.
// (delay execution of the callback by a specified number of milliseconds)
{
	function sayHi() {
		console.log('Hello');
	}

	setTimeout(sayHi, 2000);

	// by default delay is 0, buy applying it you add callback to macrotasks queue, so it will be still executed async
	// setTimeout(sayHi);
	console.log('I am executed first');
}

// ~ preventing context loss
{
	const person = {
		name: 'John',
		sayHi() {
			console.log(`My name is ${this.name}`);
		},
	};

	// if we pass the method directly as a callback, this will lead to context loss
	setTimeout(person.sayHi);
	// these work:
	setTimeout(() => person.sayHi());
	setTimeout(person.sayHi.bind(person));
}

{
	function sayHi() {
		console.log('Hello');
	}
	// setTimeout returns timer id, that we can use to abort the execution, using clearTimeout method
	const timerId = setTimeout(sayHi, 1000);
	clearTimeout(timerId);
}

// # setInterval
// setInterval allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval.

// next planned execution time is counted from previous execution start time
{
	function sayHi() {
		console.log('Hello');
	}

	const timerId = setInterval(sayHi, 2000);

	setTimeout(() => {
		clearInterval(timerId);
	}, 5000);
}

// ~ recursive (nested) setTimeout
{
	// next planned execution time is counted from previous execution end time -
	// it allows to set the delay between the executions more precisely than setInterval.

	let timerId = setTimeout(function tick() {
		console.log('tick');

		timerId = setTimeout(tick, 2000); // schedules the next call right at the end of the current one (*).
	}, 2000);

	// The nested setTimeout is a more flexible method than setInterval. This way the next call may be scheduled differently, depending on the results of the current one.
}
