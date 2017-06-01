export interface IExpression {
    apply(c: any): any;
}

export function zeroOrMore(e: IExpression): IExpression {
    return e;
}

export function oneOrMore(e: IExpression): IExpression {
    return e;
}
