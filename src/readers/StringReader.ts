import {Expression, Matcher} from "../Matcher";
import {Reader} from "../Reader";
import {noMatch} from "../Matchers";
import {ReadResult} from "../ReadResult";

export default class StringReader implements Reader {

    private pos: number;
    private str: string;

    constructor(str: string, pos: number = 0) {
        this.pos = pos;
        this.str = str;
    }

    public read(n: number): ReadResult {
        return n === 0 || this.pos >= this.str.length
            ? ReadResult.empty(this)
            : ReadResult.of(this.str.substring(this.pos, this.pos + n), new StringReader(this.str, this.pos + n));
    }

    public ignore(p: Expression): Reader {
        return this;
    }

    public ignoreMatcher(): Matcher {
        return noMatch;
    }

    public toString() {
        return "at " + this.pos + " near ..." + this.str.substring(this.pos - 10, this.pos + 10) + "...";
    }
}
