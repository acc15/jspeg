import "mocha";
import {expect} from "chai";

import {match} from "../Matcher";
import seq from "./seq";

describe("seq", () => {
    it("must match if string eq value", () => {
        const res = match(seq("a", "b", "c"), "abcdef");
        expect(res.matches).eq(true);
        expect(res.consumed).eq(3);
        expect(res.data).eql(["a", "b", "c"]);
        expect(res.next.read(3).value).eq("def");
    });
});
