---
layout: blog-post
title:  "Spicy Set"
date:   2024-07-29 15:00:00 -0500
categories: knowledge
description: Object based Set for JS
---

TLDR - JS Set with Objects by value, [see source code on github.](https://github.com/timothyholmes/spicy-set)

A few years ago, as I was first dipping my toes into the world of JavaScript, I tried my hand at creating a Node library for using Sets with objects by value. In JavaScript variables are referenced one of two ways, by value or reference, depending on their type. Simple values, such as string, numbers, and booleans, are passed by value. This means when you pass a variable of these types to other functions, the value itself is what's being passed.

```
const message = 'Hello world';

function print(someString) {
    console.log(someString)
}

print(message); # the value of message is passed here
```

In the case of Objects the variable is instead passed as a memory reference, rather than passing the value down to the function. The two important implications here are that:

1. Modifying an object is actually a modification to the Object's reference. These will affect anywhere the object is used.
2. When evaulating objects against each other with the `===` operator, the values being compared are the memory references.

```
// Modifying an object

const x = { message: 'some message' }

function modifyMessage(y, message) {
    y.message = message;
}

modifyMessage(x, 'different message')

x.message // 'difference message'
```

```
// Modifying an object

const x = { message: 'some message' }

x === { message: 'some message' } // false

const y = x;
x === y // true
```

This way of handling memory facilitates garbage collection and reduces overall memory usage. However, this keeps us from being able to use the build in type Set with Objects based on their value. The evaluation will occur on the memory references and not the value of the objects, so different objects with the same content can be added to a single set.

```
const x = { type: 'object' }
const y = { type: 'object' }
const z = { type: 'object' }

const set = new Set()

set.add(x)
set.add(y)

set.has(x) // true
set.has(y) // true
set.has(z) // false

set.size // 2
```

SpicySet was my somewhat insipid response to this problem. I published the first version 7 years ago, with very limited functionality. Basically the only thing it did was expose addObject and hasObject methods to interact specifically with objects by value. As my programming experience grew, I realized this was a clunky interface at best. There were also plenty of Set methods that it did not correctly implement, such as intersection, union, and iterator protocol. 

```
const x = { type: 'object' }
const y = { type: 'object' }
const z = { type: 'object' }

const set = new SpicySet()

set.addObject(x)
set.addObject(y)

set.hasObject(x) // true
set.hasObject(y) // true
set.hasObject(z) // true

set.size // 1
```

 A year or two ago I noticed that there was a small but healthy number of downloads on the package, so I decided to reimplement the [standard Set type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) with full support for Objects by reference. The `hasObject` and `addObject` methods are now just deprecated wrappers for `has` and `add` respectively, which work with objects by values by default. It works by using a Map internally to store the data. When an object is stored in the SpicySet, it is stringified and the string is used as the key value, with the value of the pair being the Object itself.

```
const x = { type: 'object' }
const y = { type: 'object' }
const z = { type: 'object' }

const set = new SpicySet()

set.add(x)
set.add(y)

set.has(x) // true
set.has(y) // true
set.has(z) // true

set.size // 1
```

To use the package, [install with npm.](https://www.npmjs.com/package/spicy-set)

```
npm install spicy-set
```

