import { FlattenSimpleInterpolation } from "styled-components";
type PropsType = {
    [K in string | number | symbol]: any;
};
type CssContent = FlattenSimpleInterpolation;
type Predicate = (value: any) => boolean;
type CondRule = [Predicate, any];
type ValueMatchingTuple = CondRule;
type ValueMatchingObject = {
    [K in string | number]: CssContent;
};
type ValueMatchingList = (ValueMatchingTuple | ValueMatchingObject)[];
type ValueMatchingCollection = ValueMatchingList | ValueMatchingTuple | ValueMatchingObject | CssContent;
type PropRule = {
    [key: string]: ValueMatchingCollection;
};
type PropRuleConf<T> = ((props: T) => PropRule) | PropRule;
declare const styleCond: <T extends PropsType>(propConf: PropRuleConf<T>) => (props: T) => any[];
export { styleCond };
