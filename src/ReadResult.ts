import {Reader} from "./Reader";
export class ReadResult {
    public static empty(r: Reader) {
        return new ReadResult("", r);
    }

    public static of(value: string, r: Reader) {
        return new ReadResult(value, r);
    }

    public value: string;
    public next: Reader;

    constructor(value: string, next: Reader) {
        this.value = value;
        this.next = next;
    }

}
