import {expect} from "chai";
import "mocha";

import {any, map, oneOrMore, range, seq, zeroOrOne} from "./jspeg";

const Digits = noIgnore(oneOrMore(range("0", "9")));
const Num = map(seq(any("+", "-", ""), Digits), (match) => Number(match[0] + match[1]));
const Mult = any(map(seq(Num, any(map("*", BinOp.MUL), map("/", BinOp.DIV)), Num),
(data) => new BinOp(match[0], match[2], match[1])), Num);

const Plus = any(map(seq(Mult, any(map("+", BinOp.ADD), map("-", BinOp.SUB)), Mult),
(data) => new BinOp(match[0], match[2], match[1])), Mult);

// 1 + 2 + 3

describe("jspeg", () => {
    it("must parse", () => {
        // any("a", "b", "c");
        seq("b", range("a", "z"), "c");
        // 1 + 2 * (3 - 4) * 9
        expect.fail(null, null, "OK");
    });
});