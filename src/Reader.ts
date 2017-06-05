import {Matcher} from "./Matcher";

export interface IReader {
    read(n: number): ReadResult;
    ignore(p: Matcher): IReader;
}

export class ReadResult {
    public static empty(r: IReader) {
        return new ReadResult("", r);
    }

    public static of(value: string, r: IReader) {
        return new ReadResult(value, r);
    }

    public value: string;
    public next: IReader;

    constructor(value: string, next: IReader) {
        this.value = value;
        this.next = next;
    }

}

