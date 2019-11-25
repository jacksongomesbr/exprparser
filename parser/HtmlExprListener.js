var antlr4 = require('../antlr4/index');
var ExprLexer = require('../parser/ExprLexer');
var ExprParser = require('../parser/ExprParser');
var ExprListener = require('../parser/ExprListener').ExprListener;

/**
 * Esta função representa o construtor da classe HtmlExprListener
 */
HtmlExprListener = function () {
    ExprListener.call(this);
    this.values = [];
    return this;
}

HtmlExprListener.prototype = Object.create(ExprListener.prototype);

HtmlExprListener.prototype.constructor = HtmlExprListener;

/**
 * O método enterProg inicializa o valor de ctx.values como um
 * array vazio.
 */
HtmlExprListener.prototype.enterProg = function (ctx) {
    ctx.values = [];
};

/**
 * O método exitProg atribui o valor de ctx.values ao atributo
 * values da instância desta classe.
 */
HtmlExprListener.prototype.exitProg = function (ctx) {
    this.values = ctx.values;
};

/**
 * O método enterExpr verifica se o parser combina com a regra INT. 
 * Em caso positivo, usa a função parseInt() para converter seu texto
 * para um número inteiro e usa o resultado como valor do nó. Caso contrário,
 * o valor do nó é null.
 */
HtmlExprListener.prototype.enterExpr = function (ctx) {
    if (ctx.INT() != null) {
        ctx.value = parseInt(ctx.INT().getText());
    } else {
        ctx.value = null;
    }
};

/**
 * O método exitExpr verifica se o nó contém três filhos. Se isso for verdade, 
 * o código obtém o value do filho da esquerda, o value do filho da direita,
 * o texto do filho do meio (representando o operador) e os utiliza para
 * calcular o valor da expressão aritmética correspondente.
 * 
 * Por fim, se um valor tiver sido obtido e o nó pai for prog, então
 * adiciona um objeto {expr, value} ao array values.
 */
HtmlExprListener.prototype.exitExpr = function (ctx) {
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
    if (ctx.value && ctx.parentCtx instanceof ExprParser.ExprParser.ProgContext) {
        ctx.parentCtx.values.push({
            'expr': ctx.getText(),
            'value': ctx.value
        });
    }
};

exports.HtmlExprListener = HtmlExprListener;