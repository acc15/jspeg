
import "mocha";
import {expect} from "chai";
import IgnoreReader from "./SkipReader";
import StringReader from "./StringReader";
import {value} from "../Matchers";

describe("SkipReader", () => {
    const r = new IgnoreReader(new StringReader("aabacdaaeaa"), value("a"));

    it("must skip a letters", () => {
        expect(r.read(4).value).eq("bcde");
    });

    it("must return skipping reader", () => {
        expect(r.read(3).next.read(2).value).eq("e");
    });
});
