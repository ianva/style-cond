'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var ramda = require('ramda');
var is = _interopDefault(require('@sindresorhus/is'));

var stringToNumber = function (str) {
    return str - 0;
};

var getValueMatchingType = function (data) {
    if (is.plainObject(data)) {
        return "ValueMatchingObject";
    }
    else if (is.array(data)) {
        var firstItem = data[0];
        if (is.function_(firstItem)) {
            return "ValueMatchingTuple";
        }
        else if (is.string(firstItem)) {
            return "CssContent";
        }
        else {
            return "ValueMatchingList";
        }
    }
    else {
        throw new Error("Type error");
    }
};
var generateCssContent = function (rule) { return [
    function (value) { return value; },
    ramda.always(rule),
]; };
var generateMatchingTuple = function (rule) {
    var valuePredicate = rule[0], cssText = rule[1];
    return [function (value) { return valuePredicate(value); }, ramda.always(cssText)];
};
var generateMatchingTupleFromObject = function (rule) {
    return ramda.toPairs(rule).map(function (_a) {
        var propValue = _a[0], cssText = _a[1];
        return [
            function (value) {
                if (is.number(value)) {
                    return value === stringToNumber(propValue);
                }
                else if (is.boolean(value)) {
                    return value.toString() === propValue;
                }
                else {
                    return value === propValue;
                }
            },
            ramda.always(cssText),
        ];
    });
};
var generateMatchingList = function (rules) {
    return rules
        .map(function (rule) {
        if (getValueMatchingType(rule) === "ValueMatchingTuple") {
            return [generateMatchingTuple(rule)];
        }
        else {
            return generateMatchingTupleFromObject(rule);
        }
    })
        .flat();
};
var generatePropRules = function (valueMatching) {
    switch (getValueMatchingType(valueMatching)) {
        case "CssContent":
            return [generateCssContent(valueMatching)];
        case "ValueMatchingTuple":
            return [generateMatchingTuple(valueMatching)];
        case "ValueMatchingObject":
            return generateMatchingTupleFromObject(valueMatching);
        case "ValueMatchingList":
            return generateMatchingList(valueMatching);
    }
};
var styleCond = function (propConf) {
    return function (props) {
        var confList = ramda.toPairs(is.function_(propConf) ? propConf(props) : propConf);
        return confList
            .filter(function (_a) {
            var key = _a[0];
            return !is.undefined(props[key]);
        })
            .flatMap(function (_a) {
            var key = _a[0], conf = _a[1];
            var rules = generatePropRules(conf);
            var propValue = props[key];
            return ramda.cond(rules)(propValue);
        })
            .filter(function (value) { return !is.undefined(value); });
    };
};

exports.styleCond = styleCond;
