/// <reference types="node" />

import {any, skip, map, noMatch, oneOrMore, range, recursive, seq, zeroOrOne, str, zeroOrMore} from "jspeg/lib/Matchers";
import * as readline from "readline";
import {toReader} from "jspeg/lib/Reader";

type Op = () => number;

function numOp(data: any): Op {
    return () => Number(data);
}

function fnOp(data: any): Op {
    return () => {
        console.log("fn: " + data);
        const fn = data[0];
        const args = (data[2] as Op[]).map(v => v());
        console.log("invoking " + fn + " with " + args);
        return args[0];
    };
}

function varOp(data: any): Op {
    return () => {
        console.log("using variable: " + data[0]);
        return 0;
    };
}

function unOp(data: any): Op {
    return () => {
        const sign = data[0];
        const val = data[1]();
        switch (sign) {
            case "+":
                return val;
            case "-":
                return -val;
            default:
                throw new Error("unknown operator " + sign);
        }
    };
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
            default:
                throw new Error("unknown operator " + sign);
        }
    };
}

const unary = recursive(self => any(map(seq(any("+", "-"), self), unOp), fn));
const factor = recursive(self => any(map(seq(unary, any("*", "/"), self), binOp), unary));
const expr = recursive(self => any(map(seq(factor, any("+", "-"), self), binOp), factor));

const list = map(seq(expr, zeroOrMore(map(seq(",", expr), k => k[1]))), d => [].concat(d[0], d[1]));
const optionalList = map(zeroOrOne(list), d => d.length ? d[0] : d);

const digit = range("0", "9");
const letter = any(range("a", "z"), range("A", "Z"));
const identifier = str(skip(noMatch, seq(letter, zeroOrMore(any("_", digit, letter)))));
const digits = oneOrMore(digit);
const num = map(str(skip(noMatch, seq(digits, zeroOrOne(seq(".", digits))))), numOp);
const variable = any(map(identifier, varOp), num);
const braced = any(map(seq("(", expr, ")"), d => d[1]), variable);
const fn = any(map(seq(identifier, "(", optionalList, ")"), fnOp), braced);

const root = skip(any(" ", "\t", "\r", "\n"), expr);

const rl = readline.createInterface({input: process.stdin, output: process.stdout});
function loop() {
    rl.question("Enter expression: ", e => {
        const result = root(toReader(e));
        console.log(`matches: ${result.matches}; consumed: ${result.consumed}; data: ${result.data()}`);
        loop();
    });
}

loop();
