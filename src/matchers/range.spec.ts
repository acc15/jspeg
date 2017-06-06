import "mocha";
import {expect} from "chai";

import range from "./range";
import StringReader from "../readers/StringReader";

describe("range", () => {
    it("must match if value in range", () => {
        for (let i = 0; i < 26; i++) {
            const letter = String.fromCharCode(65 + i);
            const r = new StringReader(letter + "ZZZ");
            const res = range("A", "Z")(r);
            expect(res.matches).eq(true, r.toString());
            expect(res.next.read(3).value).eq("ZZZ");
            expect(res.consumed).eq(1);
            expect(res.data).eq(letter);
        }
    });
    it("must not match if value out of range", () => {
        const r = new StringReader("A");
        const res = range("a", "z")(r);
        expect(res.matches).eq(false);
        expect(res.next).eq(r);
        expect(res.data).is.undefined;
        expect(res.consumed).eq(0);
    });
});
