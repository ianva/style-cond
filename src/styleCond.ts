import {always, cond, toPairs} from "ramda";
import is from "@sindresorhus/is";
import {stringToNumber} from "./util";
import type {
  CondRule,
  CssContent,
  PropRuleConf,
  PropsType,
  ValueMatchingCollection,
  ValueMatchingList,
  ValueMatchingObject,
  ValueMatchingTuple,
  ValueMatchingType
} from "./types";

const getValueMatchingType = (
  data: ValueMatchingCollection,
): ValueMatchingType => {
  if (is.plainObject(data)) {
    return "ValueMatchingObject";
  } else if (is.array(data)) {
    const firstItem = data[0];
    if (is.function_(firstItem)) {
      return "ValueMatchingTuple";
    } else if (is.string(firstItem)) {
      return "CssContent";
    } else {
      return "ValueMatchingList";
    }
  } else {
    throw new Error("Type error");
  }
};

const generateCssContent = (rule: CssContent): CondRule => [
  (value) => value,
  always(rule),
];

const generateMatchingTuple = (rule: ValueMatchingTuple): CondRule => {
  const [valuePredicate, cssText] = rule;
  return [(value) => valuePredicate(value), always(cssText)];
};

const generateMatchingTupleFromObject = (rule: ValueMatchingObject): CondRule[] => {
  return toPairs<CssContent>(rule).map<CondRule>(([propValue, cssText]) => [
    (value) => {
      if (is.number(value)) {
        return value === stringToNumber(propValue);
      } else if (is.boolean(value)) {
        return value.toString() === propValue;
      } else {
        return value === propValue;
      }
    },
    always(cssText),
  ]);
};

const generateMatchingList = (
  rules: ValueMatchingList,
): CondRule[] => {
  return rules
    .map((rule) => {
      if (getValueMatchingType(rule) === "ValueMatchingTuple") {
        return [generateMatchingTuple(rule as ValueMatchingTuple)];
      } else {
        return generateMatchingTupleFromObject(rule as ValueMatchingObject);
      }
    })
    .flat();
};

const generatePropRules = (
  valueMatching: ValueMatchingCollection,
): CondRule[] => {
  switch (getValueMatchingType(valueMatching)) {
    case "CssContent":
      return [generateCssContent(valueMatching as CssContent)];
    case "ValueMatchingTuple":
      return [generateMatchingTuple(valueMatching as ValueMatchingTuple)];
    case "ValueMatchingObject":
      return generateMatchingTupleFromObject(valueMatching as ValueMatchingObject);
    case "ValueMatchingList":
      return generateMatchingList(valueMatching as ValueMatchingList);
  }
};

export const styleCond = <T extends PropsType>(propConf: PropRuleConf<T>) => {
  return (props: T) => {
    const confList = toPairs(
      is.function_(propConf) ? propConf(props) : propConf,
    );
    return confList
      .filter(([key]) => !is.undefined(props[key]))
      .flatMap(([key, conf]) => {
        const rules = generatePropRules(conf);
        const propValue = props[key];
        return cond(rules)(propValue);
      })
      .filter((value) => !is.undefined(value));
  };
};
