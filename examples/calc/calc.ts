/// <reference types="node" />

import {any, ignore, map, noMatch, oneOrMore, range, recursive, seq, zeroOrOne} from "jspeg/lib/Matchers";
import SkipReader from "jspeg/lib/readers/SkipReader";
import StringReader from "jspeg/lib/readers/StringReader";
import * as readline from "readline";

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

function str(data: any): string {
    return Array.isArray(data) ? data.map(str).join("") : String(data);
}

const digits = oneOrMore(range("0", "9"));
const num = ignore(noMatch, seq(digits, zeroOrOne(seq(".", digits))));
const unary = map(seq(zeroOrOne(any("+", "-")), num), d => {
    console.log("unary: " + d);
    return new NumOp(Number(str(d)));
});

const low = recursive(l => any(map(seq(high, any("+", "-"), l), d => {
    console.log("low: " + d);
    return new BinOp(d[0], d[2], d[1]);
}), high));
const high = recursive(h => any(map(seq(braced, any("*", "/"), h), d => new BinOp(d[0], d[2], d[1])), braced));
const braced = any(map(seq("(", low, ")"), d => d[1]), unary);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function loop() {
    rl.question("Enter expression: ", expr => {
        const reader = new SkipReader(new StringReader(expr), any(" ", "\t", "\r", "\n"));
        const data = low(reader).data;
        console.log("result: " + data.eval());
        loop();
    });
}

loop();
