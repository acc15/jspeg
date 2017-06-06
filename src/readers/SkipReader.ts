import {Reader, ReadResult} from "../Reader";
import {Matcher} from "../Matcher";

export default class SkipReader implements Reader {

    private reader: Reader;
    private skip: Matcher;

    constructor(reader: Reader, skip: Matcher) {
        this.reader = reader;
        this.skip = skip;
    }

    public read(n: number): ReadResult {
        let r = this.reader;
        let val = "";
        while (val.length < n) {

            let res = this.skip(r);
            while (res.matches && res.consumed > 0) {
                r = res.next;
                res = this.skip(r);
            }

            const rd = r.read(1);
            if (rd.value.length === 0) {
                break;
            }
            val += rd.value;
            r = rd.next;
        }
        return ReadResult.of(val, new SkipReader(r, this.skip));
    }

    public ignore(p: Matcher): Reader {
        return new SkipReader(this.reader, p);
    }

    public toString(): string {
        return this.reader.toString();
    }
}