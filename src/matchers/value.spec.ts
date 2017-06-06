import "mocha";
import {expect} from "chai";

import value from "./value";
import StringReader from "../readers/StringReader";

const r = new StringReader("abcdefgh");
describe("value", () => {
    it("must match if string eq value", () => {
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
