
import { Reader } from "./Reader";
import {ReadResult} from "./ReadResult";

export type DataMap<S, R> = (data: S) => R;
export type ReaderMap = DataMap<Reader, Reader>;

export class MatchResult<T> {

    public static of(reader: Reader, res: ReadResult, test: (val: string) => boolean): MatchResult<string | undefined> {
        const isOk = test(res.value);
        return isOk ? MatchResult.withMatch<string>(res.value.length, res.next, res.value) : MatchResult.withoutMatch<string>(reader);
    }

    public static withMatch<T>(consumed: number, next: Reader, data: T): MatchResult<T> {
        const res = new MatchResult<T>();
        res.matches = true;
        res.consumed = consumed;
        res.next = next;
        res.data = data;
        return res;
    }

    public static withoutMatch<T>(reader: Reader): MatchResult<T | undefined> {
        const res = new MatchResult<T | undefined>();
        res.matches = false;
        res.consumed = 0;
        res.next = reader;
        res.data = undefined;
        return res;
    }

    public static copyOf<T>(res: MatchResult<T>): MatchResult<T> {
        const cp = new MatchResult<T>();
        cp.matches = res.matches;
        cp.consumed = res.consumed;
        cp.next = res.next;
        cp.data = res.data;
        return cp;
    }

    public static apply<E>(res: MatchResult<Array<E | undefined>>, ch: MatchResult<E | undefined>): MatchResult<Array<E | undefined>> {
        res.consumed += ch.consumed;
        res.next = ch.next;
        if (res.data) {
            res.data.push(ch.data);
        }
        return res;
    }

    public matches: boolean;
    public consumed: number;
    public next: Reader;
    public data: T;

    public mapReader(mapper: ReaderMap): MatchResult<T> {
        const res = new MatchResult<T>();
        res.matches = this.matches;
        res.consumed = this.consumed;
        res.next = mapper(this.next);
        res.data = this.data;
        return res;
    }

    public map<R>(mapper: DataMap<T, R>): MatchResult<R> {
        const res = new MatchResult<R>();
        res.matches = this.matches;
        res.consumed = this.consumed;
        res.next = this.next;
        res.data = mapper(this.data);
        return res;
    }
}
