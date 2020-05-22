import { FlattenSimpleInterpolation } from "styled-components";

export type PropsType = {
  [K in string | number | symbol]: any;
};
export type CssContent = FlattenSimpleInterpolation;
type Predicate = (value: any, props: any) => boolean;
export type CondRule = [Predicate, any];
export type ValueMatchingTuple = CondRule;
export type ValueMatchingObject = {
  [K in string | number]: CssContent;
};
export type ValueMatchingList = (ValueMatchingTuple | ValueMatchingObject)[];
export type ValueMatchingType =
  | "ValueMatchingList"
  | "ValueMatchingTuple"
  | "ValueMatchingObject"
  | "CssContent";
export type ValueMatchingCollection =
  | ValueMatchingList
  | ValueMatchingTuple
  | ValueMatchingObject
  | CssContent;
type PropRule = {
  [key: string]: ValueMatchingCollection;
};
export type PropRuleConf<T> = ((props: T) => PropRule) | PropRule;
export declare const styleCond: <T extends PropsType>(propConf: PropRuleConf<T>) => (props: T) => any[];
