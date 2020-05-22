import {always, cond, toPairs} from "ramda";
import is from "@sindresorhus/is";
import {stringToNumber} from "./util";
import {
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

const genCssContent = (rule: CssContent): CondRule => [
  (value) => value,
  always(rule),
];

const genMatchingTuple = (rule: ValueMatchingTuple): CondRule => {
  const [valuePredicate, cssText] = rule;
  return [(value) => valuePredicate(value), always(cssText)];
};

const genMatchingTupleFromObject = (rule: ValueMatchingObject): CondRule[] => {
  return toPairs<CssContent>(rule).map<CondRule>(([propValue, cssText]) => [
    (value) => {
      if (is.number(value)) {
        return value === stringToNumber(propValue);
      } else if (value === true) {
        return true;
      } else if (value === false) {
        return false;
      } else {
        return value === propValue;
      }
    },
    always(cssText),
  ]);
};

const genMatchingList = (
  rules: ValueMatchingList,
): CondRule[] => {
  return rules
    .map((rule) => {
      if (getValueMatchingType(rule) === "ValueMatchingTuple") {
        return [genMatchingTuple(rule as ValueMatchingTuple)];
      } else {
        return genMatchingTupleFromObject(rule as ValueMatchingObject);
      }
    })
    .flat();
};

const genPropRules = (
  valueMatching: ValueMatchingCollection,
): CondRule[] => {
  switch (getValueMatchingType(valueMatching)) {
    case "CssContent":
      return [genCssContent(valueMatching as CssContent)];
    case "ValueMatchingTuple":
      return [genMatchingTuple(valueMatching as ValueMatchingTuple)];
    case "ValueMatchingObject":
      return genMatchingTupleFromObject(valueMatching as ValueMatchingObject);
    case "ValueMatchingList":
      return genMatchingList(valueMatching as ValueMatchingList);
  }
};

export const styleCond = <T extends PropsType>(propConf: PropRuleConf<T>) => {
  return (props: T) => {
    const confList = toPairs(
      is.function_(propConf) ? propConf(props) : propConf,
    );
    return confList.flatMap(([key, conf]) => {
      const rules = genPropRules(conf);
      const propValue = props[key];
      return cond(rules)(propValue);
    });
  };
};
