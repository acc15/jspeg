import "mocha";
import {expect} from "chai";

import noMatch from "./noMatch";
import {match} from "../Matcher";

describe("noMatch", () => {
    it("must return result without match", () => {
        const res = match(noMatch(), "abcdefgh");
        expect(res.matches).eq(false);
        expect(res.consumed).eq(0);
        expect(res.next.read(1).value).eq("a");
        expect(res.data).eq(undefined);
    });
});
