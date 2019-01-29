// const daggy = require('daggy')
/*****************
 * IMPLEMENTATIONS
 *****************/
/**
 * @type Sum
 */
var Sum = /** @class */ (function () {
    function Sum(num) {
        this._value = num;
    }
    Sum.prototype.concat = function (that) {
        return new Sum(that._value + this._value);
    };
    Sum.empty = function () {
        return new Sum(0);
    };
    return Sum;
}());
/**
 * @type Product
 */
var Product = /** @class */ (function () {
    function Product(num) {
        this._value = num;
    }
    Product.prototype.concat = function (that) {
        return new Product(that._value * this._value);
    };
    Product.empty = function () {
        return new Product(1);
    };
    return Product;
}());
/**
 * @type Max
 */
var Max = /** @class */ (function () {
    function Max(num) {
        if (!this)
            return new Max(num);
        this._value = num;
    }
    Max.prototype.concat = function (that) {
        var max = Math.max(that._value, this._value);
        return new Max(max);
    };
    Max.empty = function () {
        return new Max(-Infinity);
    };
    return Max;
}());
/**
 * @type TrafficLights
 */
var TrafficLights = /** @class */ (function () {
    function TrafficLights(lights) {
        this._value = lights;
    }
    TrafficLights.of = function (red, amber, green) {
        return new TrafficLights({ red: red, amber: amber, green: green });
    };
    TrafficLights.prototype.equals = function (lights) {
        var _a = lights._value, red = _a.red, amber = _a.amber, green = _a.green;
        return red === this._value.red
            && amber === this._value.amber
            && green === this._value.green;
    };
    return TrafficLights;
}());
var Predicate = /** @class */ (function () {
    function Predicate(x) {
        this._value = x;
    }
    Predicate.prototype.contramap = function (f) {
        var _this = this;
        return new Predicate(function (x) { return _this._value(f(x)); });
    };
    return Predicate;
}());
var Num = /** @class */ (function () {
    function Num(x) {
        this._value = x;
    }
    Num.prototype.lte = function (that) {
        return this._value <= that._value;
    };
    return Num;
}());
Array.prototype.ap = function (fs) {
    var _this = this;
    return [].concat.apply([], fs.map(function (f) { return _this.map(f); }));
};
// 3 x 0 elements
// []
var foo = [2, 3, 4].ap([]);
console.log(foo);
// 3 x 1 elements
// [ '2!', '3!', '4!' ]
var woo = [2, 3, 4].ap([function (x) { return x + '!'; }]);
console.log(woo);
// 3 x 2 elements
// [ '2!', '3!', '4!'
// , '2?', '3?', '4?' ]
var wah = [2, 3, 4].ap([function (x) { return x + '!'; }, function (x) { return x + '?'; }]);
console.log(wah);
/**
 * UTILS
 */
// const map = f => x => x instanceof 'functor'
// 						? x.map(f)
// 						: f(x)
var fold = function (M) { return function (xs) { return xs.reduce(function (acc, x) { return acc.concat(new M(x)); }, M.empty()); }; };
var lift2 = function (f) { return function (a) { return function (b) { return b.ap(a.map(f)); }; }; };
var Stop = TrafficLights.of(true, false, false);
var Go = TrafficLights.of(false, false, true);
var five = new Product(5);
var six = new Sum(6);
var four = new Max(4);
var total = five.concat(four).concat(six);
var isEven = new Predicate(function (x) { return x % 2 === 0; });
var lengthIsEven = isEven.contramap(function (x) { return x.length; });
console.log(total);
var isEqual = Go.equals(Go);
console.log(isEqual);
var folded = fold(Sum)([2, 3, 4, 29, 12, 32, 14]);
console.log(folded);
console.log('lengthiseven', lengthIsEven._value('strings'));
var seven = new Num(7);
var eight = new Num(8);
console.log('Num lte:', seven.lte(eight));
var loop2d = lift2(function (x) { return function (y) { return x * y; }; })([1, 2, 3])([4, 5, 6, null]);
console.log('loop', loop2d);
