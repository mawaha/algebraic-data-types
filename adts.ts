// const daggy = require('daggy')

/**
 * @type typeClass
 */
interface typeClass {
	_value: any
}

/**
 * @constructor
 * @type TypeClass
 */
interface TypeClass {
	new (a: any): typeClass
}

/**
 * @type setoid
 */
interface setoid extends typeClass {
	// equals :: setoid a => a ~> a -> Boolean
	equals(setoid): boolean
}

/**
 * @type ord
 */
interface ord extends typeClass {
	lte(ord): boolean
}

/**
 * @type semigroup
 */
interface semigroup extends typeClass {
	// concat :: semigroup a => a ~> a -> a
	concat(semigroup): semigroup
}

/**
 * @type Monoid
 * @constructor
 */
interface Monoid extends TypeClass {
	empty(): monoid
}

/**
 * @type monoid
 */
interface monoid extends semigroup {}

/**
 * @type functor
 */
interface functor extends typeClass {
	map(f: any): functor
}

/**
 * @type Monad
 * @constructor
 */
interface Monad extends TypeClass {
	of(any): Monad
}

/**
 * @type Monad
 */
interface monad extends functor {
	chain(f: () => Monad): Monad
}

/**
 * @type Apply
 */
interface apply extends functor {
	// ap :: Apply f => f a ~> f (a -> b) -> f b
	ap(that: functor): apply
}

/**
 * @type Applicative
 */
interface Applicative extends TypeClass {
	of(a: any): Applicative
}

/**
 * @type contravariant
 */
interface contravariant extends typeClass {
	contramap(f: any): contravariant
}

/*****************
 * IMPLEMENTATIONS
 *****************/

/**
 * @type Sum
 */
class Sum implements monoid {
	public _value
	constructor(num: number) {
		this._value = num
	}
	concat(that: semigroup) {
		return new Sum(that._value + this._value)
	}
	static empty() {
		return new Sum(0)
	}
}

/**
 * @type Product
 */
class Product implements monoid {
	public _value
	constructor(num: number) {
		this._value = num
	}
	concat(that: semigroup) {
		return new Product(that._value * this._value)
	}
	static empty() {
		return new Product(1)
	}
}

/**
 * @type Max
 */
class Max implements monoid {
	public _value
	constructor(num: number) {
		if (!this) return new Max(num)
		this._value = num
	}
	concat(that: semigroup) {
		const max = Math.max(that._value, this._value)
		return new Max(max)
	}
	static empty() {
		return new Max(-Infinity)
	}
}

/**
 * @type TrafficLights
 */
class TrafficLights implements setoid {
	public _value

	static of(red: boolean, amber: boolean, green: boolean) {
		return new TrafficLights({ red, amber, green })
	}

	constructor(lights: any) {
		this._value = lights
	}

	equals(lights: TrafficLights): boolean {
		const { red, amber, green } = lights._value;
		return red === this._value.red
			&& amber === this._value.amber
			&& green === this._value.green
	}
}

class Predicate implements contravariant {
	public _value: (a) => {}

	constructor(x) {
		this._value = x
	}

	contramap(f) {
		return new Predicate(x => this._value(f(x)))
	}
}

class Num implements ord {
	public _value: any

	constructor(x) {
		this._value = x
	}

	lte(that: ord) {
		return this._value <= that._value
	}
}

Array.prototype.ap = function (fs) {
  return [].concat(... fs.map(
    f => this.map(f)
  ))
}

// 3 x 0 elements
// []
const foo = [2, 3, 4].ap([])
console.log(foo);

// 3 x 1 elements
// [ '2!', '3!', '4!' ]
const woo = [2, 3, 4].ap([x => x + '!'])
console.log(woo);

// 3 x 2 elements
// [ '2!', '3!', '4!'
// , '2?', '3?', '4?' ]
const wah = [2, 3, 4].ap([ x => x + '!', x => x + '?' ])
console.log(wah);


/**
 * UTILS
 */
// const map = f => x => x instanceof 'functor'
// 						? x.map(f)
// 						: f(x)

const fold = (M: Monoid) => (xs: any) => xs.reduce(
	(acc, x) => acc.concat(new M(x)),
	M.empty())

const lift2 = f => a => b => b.ap(a.map(f))

const Stop = TrafficLights.of(true, false, false)
const Go = TrafficLights.of(false, false, true)
const five = new Product(5)
const six = new Sum(6)
const four = new Max(4)

const total = five.concat(four).concat(six)
const isEven = new Predicate(x => x % 2 === 0)
const lengthIsEven = isEven.contramap((x: string) => x.length)

console.log(total);

const isEqual = Go.equals(Go)

console.log(isEqual)

const folded = fold(Sum)([2, 3, 4, 29, 12, 32, 14])
console.log(folded)

console.log('lengthiseven', lengthIsEven._value('strings'))

const seven = new Num(7)
const eight = new Num(8)
console.log('Num lte:', seven.lte(eight))

const loop2d = lift2(x => y => x * y)([1,2,3])([4,5,6])
console.log('loop', loop2d);

