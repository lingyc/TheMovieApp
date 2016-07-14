#Food Buddy Style Guide#
Content used from Hack Reactor and Airbnb style guides

<!-- Variable names: -->
<!-- Give descriptive words -->

<!-- // good: -->
var animals = ['cat', 'dog', 'fish'];

<!-- // bad: -->
var targetInputs = ['cat', 'dog', 'fish'];

<!-- Collections such as arrays and maps should have plural noun variable names: -->
<!-- // good: -->
var animals = ['cat', 'dog', 'fish'];

<!-- // bad: -->
var animalList = ['cat', 'dog', 'fish'];

<!-- // bad: -->
var animal = ['cat', 'dog', 'fish'];

<!-- Name your variables after their purpose, not their structure: -->
<!-- // good: -->
var animals = ['cat', 'dog', 'fish'];

<!-- // bad: -->
var array = ['cat', 'dog', 'fish'];

<!-- Language construct: -->
<!-- Never omit braces for statement blocks: -->
<!-- // good: -->
for (key in object) {
  alert(key);
}

<!-- // bad: -->
for (key in object)
  alert(key);

<!-- Always use strictly equal: -->
<!-- // good: -->

<!-- // this comparison evaluates to false, because the number zero is not the same as the empty string. -->
if (0 === '') {
  alert('looks like they\'re equal');
}

<!-- // bad: -->

<!-- // This comparison evaluates to true, because after type coercion, zero and the empty string are equal. -->
if (0 == '') {
  alert('looks like they\'re equal');
}

<!-- Curly Braces -->
<!-- Put else and else if statements on the same line as the ending curly brace for the preceding if block -->

<!-- // good: -->
if (condition) {
  response();
} else {
  otherResponse();
}

<!-- // bad: -->
if (condition) {
  response();
}
else {
  otherResponse();
}

<!-- Readability -->
<!-- Avoid opening too many blocks on the same line -->

<!-- // avoid: -->
_.ajax(url, { success: function () {
  // ...
}});

<!-- // prefer: -->
_.ajax(url, {
  success: function () {
    // ...
  }
});

<!-- Variable declaration -->
<!-- Use a new var statement for each line you declare a variable on -->

<!-- // good: -->
var ape;
var bat;

<!-- // bad: -->
var cat,
    dog

<!-- // use sparingly: -->
var eel, fly;

<!-- References -->
<!-- Use const for all references; avoid using var -->

<!-- // bad -->
var a = 1;
var b = 2;

<!-- // good -->
const a = 1;
const b = 2;

<!-- If you must reassing references, use let instead of var -->
<!-- // bad -->
var count = 1;
if (true) {
  count += 1;
}

<!-- // good, use the let. -->
let count = 1;
if (true) {
  count += 1;
}

<!-- Note that both let and const are block-scoped -->
<!-- // const and let only exist in the blocks they are defined in. -->
{
  let a = 1;
  const b = 1;
}
console.log(a); // ReferenceError
console.log(b); // ReferenceError

<!-- Arrays -->
<!-- Use array push instead of direct assignment to add items to array -->
const someStack = [];

<!-- // bad -->
someStack[someStack.length] = 'abracadabra';

<!-- // good -->
someStack.push('abracadabra');

<!-- Use array spreads ... to copy arrays -->
<!-- // bad -->
const len = items.length;
const itemsCopy = [];
let i;

for (i = 0; i < len; i++) {
  itemsCopy[i] = items[i];
}

<!-- // good -->
const itemsCopy = [...items];

<!-- Destructing  -->
<!-- Use object destructing when accessing and using multiple properties of an object -->
<!-- Why? Destructing saves you from creating temporary references for those properties -->

<!-- // bad -->
function getFullName(user) {
  const firstName = user.firstName;
  const lastName = user.lastName;

  return `${firstName} ${lastName}`;
}

<!-- // good -->
function getFullName(user) {
  const { firstName, lastName } = user;
  return `${firstName} ${lastName}`;
}

<!-- // best -->
function getFullName({ firstName, lastName }) {
  return `${firstName} ${lastName}`;
}

Strings
Use single quotes for strings
<!-- // bad -->
const name = "Capt. Janeway";

<!-- // good -->
const name = 'Capt. Janeway';

<!-- Strings over multiple lines should be written across multiple lines using concat -->
<!-- Note: If overused, long strings with concat could impact performance -->
<!-- // bad -->
const errorMessage = 'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

<!-- // bad -->
const errorMessage = 'This is a super long error that was thrown because \
of Batman. When you stop to think about how Batman had anything to do \
with this, you would get nowhere \
fast.';

<!-- // good -->
const errorMessage = 'This is a super long error that was thrown because ' +
  'of Batman. When you stop to think about how Batman had anything to do ' +
  'with this, you would get nowhere fast.';

<!-- When programmatically building up strings, use template strings instead of concatenation -->
  <!-- // bad -->
function sayHi(name) {
  return 'How are you, ' + name + '?';
}

<!-- // bad -->
function sayHi(name) {
  return ['How are you, ', name, '?'].join();
}

<!-- // bad -->
function sayHi(name) {
  return `How are you, ${ name }?`;
}

<!-- // good -->
function sayHi(name) {
  return `How are you, ${name}?`;
}

<!-- Arguments -->
<!-- Wrap immediately invoked function expressions in parenthesis -->
<!-- // immediately-invoked function expression (IIFE) -->
(function () {
  console.log('Welcome to the Internet. Please follow me.');
}());

<!-- Never use arguments, opt to use rest syntax ... instead -->
<!-- // bad -->
function concatenateAll() {
  const args = Array.prototype.slice.call(arguments);
  return args.join('');
}

<!-- // good -->
function concatenateAll(...args) {
  return args.join('');
}

<!-- when using function expression, use arrow function notation -->
<!-- Why? It creates a version of the function that executes in the context of this, which is usually what you want, and is a more concise syntax. -->

<!-- Why not? If you have a fairly complicated function, you might move that logic out into its own function declaration. -->

<!-- // bad -->
[1, 2, 3].map(function (x) {
  const y = x + 1;
  return x * y;
});

<!-- // good -->
[1, 2, 3].map((x) => {
  const y = x + 1;
  return x * y;
});

<!-- If the function body consists of a single expression, omit the braces and use the implicit return. Otherwise, keep the braces and use a return statement. -->
<!-- // bad -->
[1, 2, 3].map(number => {
  const nextNumber = number + 1;
  `A string containing the ${nextNumber}.`;
});

<!-- // good -->
[1, 2, 3].map(number => `A string containing the ${number}.`);

<!-- // good -->
[1, 2, 3].map((number) => {
  const nextNumber = number + 1;
  return `A string containing the ${nextNumber}.`;
});

<!-- // good -->
[1, 2, 3].map((number, index) => ({
  index: number
}));
