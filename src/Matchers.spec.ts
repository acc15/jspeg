import "mocha";
import {expect} from "chai";

import {noMatch, range, value} from "./Matchers";
import StringReader from "./readers/StringReader";

describe("Matchers", () => {

    const r = new StringReader("abcdefgh");

    describe("noMatch", () => {
        it("must return result with error", () => {
            expect(noMatch()(r).matches).eq(false);
        });
    });

    describe("value", () => {
        it("must match if readed string eq value", () => {
            const res = value("a")(r);
            expect(res.matches).eq(true);
            expect(res.consumed).eq(1);
            expect(res.next.read(1).value).eq("b");
        });

        it("must not match if value not eq", () => {
            const res = value("b")(r);
            expect(res.matches).eq(false);
            expect(res.consumed).eq(0);
        });
    });

    describe("range", () => {
        const rangeMatcher = range("A", "Z");
        it("must match if value in range", () => {
            for (let i = 0; i < 26; i++) {
                const bigLetter = new StringReader(String.fromCharCode(65 + i));
                expect(rangeMatcher(bigLetter).matches).eq(true, bigLetter.toString());
            }
        });
        it("must not match if value out of range", () => {
            expect(rangeMatcher(r).matches).eq(false);
        });
    });

});