
import { Reader } from "./Reader";
import {ReadResult} from "./ReadResult";

export type DataMap = (data: any) => any;
export type ReaderMap = (reader: Reader) => Reader;

export class MatchResult {

    public static of(reader: Reader, res: ReadResult, test: (val: string) => boolean): MatchResult {
        const isOk = test(res.value);
        return isOk ? MatchResult.withMatch(res.value.length, res.next, res.value) : MatchResult.withoutMatch(reader);
    }

    public static withMatch(consumed: number, next: Reader, data: any): MatchResult {
        const res = new MatchResult();
        res.matches = true;
        res.consumed = consumed;
        res.next = next;
        res.data = data;
        return res;
    }

    public static withoutMatch(reader: Reader): MatchResult {
        const res = new MatchResult();
        res.matches = false;
        res.consumed = 0;
        res.next = reader;
        res.data = undefined;
        return res;
    }

    public static copyOf(res: MatchResult): MatchResult {
        const cp = new MatchResult();
        cp.matches = res.matches;
        cp.consumed = res.consumed;
        cp.next = res.next;
        cp.data = res.data;
        return cp;
    }

    public matches: boolean;
    public consumed: number;
    public next: Reader;
    public data: any;

    public apply(child: MatchResult): MatchResult {
        this.consumed += child.consumed;
        this.next = child.next;
        this.data.push(child.data);
        return this;
    }

    public mapReader(mapper: ReaderMap): MatchResult {
        this.next = mapper(this.next);
        return this;
    }

    public map(mapper: DataMap): MatchResult {
        this.data = mapper(this.data);
        return this;
    }
}
