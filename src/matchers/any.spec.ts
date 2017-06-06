import "mocha";
import {expect} from "chai";

import {match} from "../Matcher";
import any from "./any";

describe("any", () => {
    it("matches abc | def", () => {
        const m = any("abc", "def");

        const res = match(m, "abcdef");
        expect(res.matches).eq(true);
        expect(res.consumed).eq(3);
        expect(res.data).eql("abc");
        expect(res.next.read(3).value).eq("def");

        const resNext = match(m, res.next);
        expect(resNext.matches).is.true;
        expect(resNext.consumed).eq(3);
        expect(resNext.data).eq("def");
    });
});
