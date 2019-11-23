var antlr4 = require('../antlr4/index');
var ExprLexer = require('../parser/ExprLexer');
var ExprParser = require('../parser/ExprParser');
var ExprListener = require('../parser/ExprListener').ExprListener;

HtmlExprListener = function () {
    ExprListener.call(this);
    this.values = [];
    return this;
}

HtmlExprListener.prototype = Object.create(ExprListener.prototype);

HtmlExprListener.prototype.constructor = HtmlExprListener;

HtmlExprListener.prototype.enterProg = function (ctx) {
    console.debug('enterProg:', ctx.getText());
    ctx.values = [];
};

HtmlExprListener.prototype.exitProg = function (ctx) {
    console.debug('exitProg:', ctx.getText());
    console.debug('values:', ctx.values);
    this.values = ctx.values;
};

HtmlExprListener.prototype.enterExpr = function (ctx) {
    console.debug('enterExpr:', ctx.getText());
    if (!ctx.value && ctx.INT() != null) {
        console.debug('INT:', ctx.INT().getText());
        ctx.value = parseInt(ctx.INT().getText());
    }
};

HtmlExprListener.prototype.exitExpr = function (ctx) {
    console.debug('exitExpr:', ctx.getText());
    if (!ctx.value) {
        if (ctx.children && ctx.children.length == 3) {
            var left = ctx.children[0];
            var right = ctx.children[2];
            var valor;
            var op = ctx.children[1].getText();
            var operando1 = left.value;
            var operando2 = right.value;
            switch (op) {
                case '*':
                    valor = operando1 * operando2;
                    break;
                case '/':
                    valor = operando1 / operando2;
                    break;
                case '+':
                    valor = operando1 + operando2;
                    break;
                case '-':
                    valor = operando1 - operando2;
                    break;
            }
            ctx.value = valor;
        }
    }
    if (ctx.value && ctx.parentCtx instanceof ExprParser.ExprParser.ProgContext) {
        ctx.parentCtx.values.push({
            'expr': ctx.getText(),
            'value': ctx.value
        });
    }
};

exports.HtmlExprListener = HtmlExprListener;