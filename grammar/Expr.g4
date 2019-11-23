grammar Expr;

prog: (expr NEWLINE?)* EOF;
expr:
	expr ('*' | '/') expr
	| expr ('+' | '-') expr
	| INT
	| '(' expr ')';

NEWLINE: [\r\n]+;
INT: [0-9]+;
