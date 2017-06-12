import {Reader} from "../Reader";
import {Expression, Matcher, toMatcher} from "../Matcher";
import {ReadResult} from "../ReadResult";
import {noMatch} from "../Matchers";

export default class SkipReader implements Reader {

    private reader: Reader;
    private skip: Matcher;

    constructor(reader: Reader, skip: Matcher = noMatch) {
        this.reader = reader;
        this.skip = skip;
    }

    public read(n: number): ReadResult {
        let r = this.reader;
        let val = "";
        while (val.length < n) {
            r = this.consume(r);
            const rd = r.read(1);
            if (rd.value.length === 0) {
                break;
            }
            val += rd.value;
            r = rd.next;
        }
        r = this.consume(r);
        return ReadResult.of(val, new SkipReader(r, this.skip));
    }

    public ignore(p: Expression): Reader {
        return new SkipReader(this.reader, toMatcher(p));
    }

    public ignoreMatcher(): Matcher {
        return this.skip;
    }

    public toString(): string {
        return this.reader.toString();
    }

    private consume(r: Reader): Reader {
        let res = this.skip(r);
        while (res.matches && res.consumed > 0) {
            r = res.next;
            res = this.skip(r);
        }
        return r;
    }
}
