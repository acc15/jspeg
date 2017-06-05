
import {Matcher} from "../Matcher";
import {IReader, ReadResult} from "../Reader";

export default class StringReader implements IReader {

    public pos: number;
    public str: string;

    constructor(str: string, pos: number = 0) {
        this.pos = pos;
        this.str = str;
    }

    public read(n: number): ReadResult {
        return n === 0 || this.pos >= this.str.length
            ? ReadResult.empty(this)
            : ReadResult.of(this.str.substring(this.pos, this.pos + n), new StringReader(this.str, this.pos + n));
    }

    public ignore(p: Matcher): IReader {
        return this;
    }

    public toString() {
        return "at " + this.pos + " near ..." + this.str.substring(this.pos - 10, this.pos + 10) + "...";
    }
}