export class ParseResult {

    public static success(consumed: number, data?: any): ParseResult {
        return new ParseResult(true, consumed, data);
    }

    public static error(): ParseResult {
        return new ParseResult(false, 0);
    }

    public success: boolean;
    public offset: number;
    public data: any;

    constructor(success: boolean, offset: number, data?: any) {
        this.offset = offset;
        this.success = success;
        this.data = data;
    }

}

export interface IReader {
    position: number;
    advance(chars?: number): IReader;
    read(chars?: number): string;

    ignore(what: Expression): IReader;
}

export type IParser = (reader: IReader) => ParseResult;
export type Expression = IParser | string;

export function parser(e: Expression): IParser {
    return typeof e === "function" ? e : (r) => {
        return r.read(e.length) === e ? ParseResult.success(e.length, e) : ParseResult.error();
    };
}

export function zeroOrOne(e: Expression): Expression {
    return (reader) => {
        const result = parser(e)(reader);
        return ParseResult.success(result.offset, result.success ? [ result.data ] : []);
    };
}

export function zeroOrMore(e: Expression): Expression {
    return (reader) => {
        const p = parser(e);
        const result = ParseResult.success(0, []);
        do {
            const r = p(reader.advance(result.offset));
            result.offset += r.offset;
            result.data.push(r.data);
        } while (result.success);
        return result;
    };
}

export function oneOrMore(e: Expression): Expression {
    return e;
}

export function any(...e: Expression[]): Expression {
    return e[0];
}

export function seq(...e: Expression[]): Expression {
    return e[0];
}

export function range(low: string, high: string): Expression {
    return (reader) => {
        const v = reader.read();
        return v >= low && v <= high ? ParseResult.success(1, v) : ParseResult.error();
    };
}

export function map(e: Expression, fn: (data: any) => any | any): Expression {
    return (reader) => {
        const result = parser(e)(reader);
        return result.success
            ? ParseResult.success(result.offset, typeof fn === "function" ? fn(result.data) : fn)
            : ParseResult.error();
    };
}
