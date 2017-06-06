import "mocha";
import {expect} from "chai";

import {match} from "./Matcher";
import {any, noMatch, range, seq, value, zeroOrOne} from "./Matchers";

describe("Matchers", () => {
    describe("noMatch", () => {
        it("must return result without match", () => {
            const res = match(noMatch(), "abcdefgh");
            expect(res.matches).is.false;
            expect(res.consumed).eq(0);
            expect(res.next.read(1).value).eq("a");
            expect(res.data).eq(undefined);
        });
    });

    describe("range", () => {
        it("must match if value in range", () => {
            for (let i = 0; i < 26; i++) {
                const letter = String.fromCharCode(65 + i);
                const res = match(range("A", "Z"), letter + "ZZZ");
                expect(res.matches).is.true;
                expect(res.next.read(3).value).eq("ZZZ");
                expect(res.consumed).eq(1);
                expect(res.data).eq(letter);
            }
        });
        it("must not match if value out of range", () => {
            const res = match(range("a", "z"), "AB");
            expect(res.matches).is.false;
            expect(res.next.read(1).value).eq("A");
            expect(res.data).is.undefined;
            expect(res.consumed).eq(0);
        });
    });

    describe("value", () => {
        it("must match if string eq value", () => {
            const res = match(value("a"), "abcdef");
            expect(res.matches).eq(true);
            expect(res.consumed).eq(1);
            expect(res.next.read(1).value).eq("b");
        });

        it("must not match if value not eq", () => {
            const res = match(value("b"), "abc");
            expect(res.matches).eq(false);
            expect(res.consumed).eq(0);
        });
    });

    describe("any", () => {
        it("matches abc | def", () => {
            const m = any("abc", "def");

            const res = match(m, "abcdef");
            expect(res.matches).is.true;
            expect(res.consumed).eq(3);
            expect(res.data).eql("abc");
            expect(res.next.read(3).value).eq("def");

            const resNext = match(m, res.next);
            expect(resNext.matches).is.true;
            expect(resNext.consumed).eq(3);
            expect(resNext.data).eq("def");
        });
    });

    describe("seq", () => {
        it("must match if string eq value", () => {
            const res = match(seq("a", "b", "c"), "abcdef");
            expect(res.matches).is.true;
            expect(res.consumed).eq(3);
            expect(res.data).eql(["a", "b", "c"]);
            expect(res.next.read(3).value).eq("def");
        });
    });

    describe("zeroOrOne", () => {
        it("must match even if child not matches", () => {
            const res = match(zeroOrOne("X"), "abc");
            expect(res.matches).is.true;
            expect(res.consumed).eq(0);
            expect(res.data).eql([]);
            expect(res.next.read(3).value).eq("abc");
        });
    });

});
