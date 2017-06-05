import "mocha";
import {expect} from "chai";

import StringReader from "./StringReader";

describe("StringReader", () => {
    it("must read strings", () => {
        const r = new StringReader("abcd", 0);
        expect(r.read(3).value).eq("abc");
        expect(r.read(5).value).eq("abcd");
        expect(r.read(2).next.read(1).value).eq("c");
        expect(r.read(2).next.read(1).next.read(2).value).eq("d");
    });
});