/// <reference types="node" />

import {any, ignore, map, noMatch, oneOrMore, range, recursive, seq, str, zeroOrOne} from "jspeg/lib/Matchers";
import SkipReader from "jspeg/lib/readers/SkipReader";
import StringReader from "jspeg/lib/readers/StringReader";

interface Op {
    eval(): number;
}

class NumOp implements Op {
    private n: number;

    constructor(n: number) {
        this.n = n;
    }

    public eval(): number {
        return this.n;
    }
}

class BinOp implements Op {
    private l: Op;
    private r: Op;
    private s: string;

    constructor(l: Op, r: Op, s: string) {
        this.l = l;
        this.r = r;
        this.s = s;
    }

    public eval(): number {
        const l = this.l.eval();
        const r = this.r.eval();
        switch (this.s) {
            case "+": return l + r;
            case "-": return l - r;
            case "*": return l * r;
            case "/": return l / r;
        }
        throw new Error("unknown operator " + this.s);
    }
}


const expr = recursive(m => {
    console.log("M is " + m);
    return any(map(seq("(", m, ")"), d => d[1]), low);
});
const digits = str(oneOrMore(range("0", "9")));
const num = ignore(noMatch, str(seq(digits, zeroOrOne(str(seq(".", digits))))));
const unary = map(str(seq(str(zeroOrOne(any("+", "-"))), num)), d => new NumOp(Number(d)));
const high = any(map(seq(expr, any("*", "/"), expr), d => new BinOp(d[0], d[2], d[1])), unary);
const low = any(map(seq(expr, any("+", "-"), expr), d => new BinOp(d[0], d[2], d[1])), high);

const cmdExpr = process.argv.slice(2).join(" ");
const reader = new SkipReader(new StringReader(cmdExpr), any(" ", "\t", "\r", "\n"));
console.log("input expression is " + cmdExpr);

const data = high(reader).data;
console.log("data: " + data);
console.log("eval number is " + data.eval());