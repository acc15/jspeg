/// <reference types="node" />

import {any, skip, map, noMatch, oneOrMore, range, recursive, seq, zeroOrOne, str} from "jspeg/lib/Matchers";
import * as readline from "readline";
import {toReader} from "jspeg/lib/Reader";

type Op = () => number;

function numOp(data: any): Op {
    const num = Number(data);
    return () => num;
}

function binOp(data: any): Op {
    return () => {
        const sign = data[1];
        const l = data[0]();
        const r = data[2]();
        switch (sign) {
            case "+":
                return l + r;
            case "-":
                return l - r;
            case "*":
                return l * r;
            case "/":
                return l / r;
        }
        throw new Error("unknown operator " + sign);
    };
}

const digits = oneOrMore(range("0", "9"));
const num = skip(noMatch, seq(digits, zeroOrOne(seq(".", digits))));
const unary = map(str(seq(zeroOrOne(any("+", "-")), num)), numOp);
const high = recursive(self => any(map(seq(braced, any("*", "/"), self), binOp), braced));
const low = recursive(self => any(map(seq(high, any("+", "-"), self), binOp), high));
const braced = any(map(seq("(", low, ")"), d => d[1]), unary);

const root = skip(any(" ", "\t", "\r", "\n"), low);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function loop() {
    rl.question("Enter expression: ", expr => {
        const result = root(toReader(expr));
        console.log(`matches: ${result.matches}; consumed: ${result.consumed}; data: ${result.data()}`);
        loop();
    });
}

loop();
