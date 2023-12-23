// jqjs - jq JSON query language in JavaScript
// Copyright (C) 2018-2023 Michael Homer
/*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

function compile(prog) {
    let filter = parse(tokenise(prog).tokens)
    const ret = input => filter.node.apply(input, {
        userFuncs: {},
        userFuncArgs: {},
        variables: {}
    })
    ret.filter = filter
    ret.trace = (input) => {
        let dest = []
        filter.node.trace(input, {
            userFuncs: {},
            userFuncArgs: {},
            variables: {}
        }, dest)
        return {
            node: null,
            output: input,
            next: dest,
        }
    }
    return ret
}

function compileNode(prog) {
    return parse(tokenise(prog).tokens).node
}

function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
}

function isDigit(c) {
    return (c >= '0' && c <= '9')
}

function prettyPrint(val, indent='', step='    ', LF='\n') {
    let SP = step ? ' ' : ''
    if (typeof val == 'undefined')
        return val
    if (val === null) {
        return 'null'
    } else if (val instanceof Array) {
        let ret = '['
        let first = true
        for (let v of Object.values(val)) {
            ret += (first ? '' : ',') + LF + indent + step +
                prettyPrint(v, indent + step, step, LF)
            first = false
        }
        ret += LF + indent + ']'
        return ret
    } else if (typeof val == 'object') {
        let ret = '{'
        let first = true
        for (let k of Object.keys(val)) {
            ret += (first ? '' : ',') + LF + indent + step +
                '"' + k + '":' +SP+ prettyPrint(val[k], indent + step, step, LF)
            first = false
        }
        ret += LF + indent + '}'
        return ret
    } else if (typeof val == 'string') {
        return '"' + escapeString(val) + '"'
    } else if (typeof val == 'number') {
        return '' + val
    } else if (typeof val == 'boolean') {
        return val ? 'true' : 'false'
    }
}

function escapeString(s) {
    s = s.replace(/\\/g, '\\\\')
    s = s.replace(/"/g, '\\"')
    s = s.replace(/\n/g, '\\n')
    s = s.replace(/[\x00-\x1f]/g,
        x => '\\u00' + x.charCodeAt(0).toString(16).padStart(2, '0'))
    return s
}

function* zip(a, b) {
    let aa = a[Symbol.iterator]()
    let bb = b[Symbol.iterator]()
    let v1 = aa.next()
    let v2 = bb.next()
    while (!v1.done && !v2.done) {
        yield [v1.value, v2.value]
        v1 = aa.next()
        v2 = bb.next()
    }
}

// Implements the jq ordering algorithm, which is terrible.
function compareValues(a, b) {
    let at = nameType(a)
    let bt = nameType(b)
    if (at != bt) {
        return compareValues.typeOrder.indexOf(at) -
            compareValues.typeOrder.indexOf(bt)
    }
    if (at == 'boolean') {
        if (a && !b) return 1
        if (!a && b) return -1
    } else if (at == 'number') {
        return a - b
    } else if (at == 'string') {
        if (a < b) return -1
        if (b < a) return 1
    } else if (at == 'array') {
        for (let i = 0; i < a.length; i++) {
            let v1 = a[i]
            let v2 = b[i]
            if (typeof v1 == 'undefined' && typeof v2 != 'undefined')
                return -1
            else if (typeof v1 != 'undefined' && typeof v2 == 'undefined')
                return 1
            else if (typeof v1 == 'undefined') return 0
            let c = compareValues(v1, v2)
            if (c != 0) return c
        }
        return 0
    } else if (at == 'object') {
        let ka = Object.keys(a).sort()
        let kb = Object.keys(b).sort()
        let c = compareValues(ka, kb)
        if (c) return c
        for (let k of ka) {
            c = compareValues(a[k], b[k])
            if (c) return c
        }
    }
    return 0
}
compareValues.typeOrder = ['null', 'boolean', 'number', 'string',
                           'array', 'object']

// Create a function from a program string.
//
// params is an array of parameter names
// body is a jq program as a string, which may use the parameters
//
// For example:
//     makeFunc(['f'], '[.[] | f]')
// defines the map function.
function makeFunc(params, body, pathFunc=false) {
    let c = compileNode(body)
    let f = (x, conf) => c.apply(x, conf)
    if (pathFunc)
        f = (x, conf) => c.paths(x, conf)
    return function*(input, conf, args) {
        let origArgs = conf.userFuncArgs
        conf.userFuncArgs = Object.create(origArgs)
        for (let i = 0; i < params.length; i++) {
            let pn = params[i]
            let pv = args[i]
            conf.userFuncArgs[pn + '/0'] = pv
        }
        yield* f(input, conf)
        conf.userFuncArgs = origArgs
    }
}

// Define and save a function that is shorthand for a longer expression
//
// name is the name of the function
// params is an array of parameters, or a string of one-character names
// body is a jq program as a string
function defineShorthandFunction(name, params, body) {
    let fname = name + '/' + params.length
    functions[fname] = makeFunc(params, body)
    functions[fname].params = Array.prototype.map.call(params, label => ({label, mode: 'defer'}))
    functions[fname + '-paths'] = makeFunc(params, body, true)
}

// Recursive-descent parser for JQ query language

// Split input program into tokens. Tokens are:
// quote, number, identifier-index, dot-square, dot, left-square,
// right-square, left-paren, right-paren, pipe, comma,
// identifier, colon, left-brace, right-brace, semicolon, at,
// variable, as, reduce, foreach, def, import, include, question
// if, then, else, end, elif
function tokenise(str, startAt=0, parenDepth) {
    let ret = []
    function error(msg) {
        throw msg;
    }
    let i
    toplevel: for (i = startAt; i < str.length; i++) {
        let location = i
        let c = str[i]
        if (c == ' ')
            continue;
        if (c == '"' || c == "'") {
            let st = c
            let tok = ""
            let escaped = false
            let uniEsc
            let cu = 0
            for (i++; i < str.length; i++) {
                if (uniEsc) {
                    uniEsc--
                    cu *= 16
                    cu += Number.parseInt(str[i], 16)
                    if (uniEsc == 0) {
                        tok += String.fromCharCode(cu)
                        cu = 0
                    }
                } else if (escaped) {
                    let q = str[i]
                    if (q == '"' || q == "'") tok += q
                    else if (q == 'n') tok += '\n'
                    else if (q == 't') tok += '\t'
                    else if (q == 'r') tok += '\r'
                    else if (q == 'b') tok += '\b'
                    else if (q == 'f') tok += '\f'
                    else if (q == '/') tok += '/'
                    else if (q == '\\')tok += '\\'
                    else if (q == 'u') uniEsc = 4
                    else if (q == '(') {
                        // Interpolation
                        let r = tokenise(str, i + 1, 0)
                        ret.push({type: 'quote-interp', value: tok, location})
                        tok = ''
                        ret = ret.concat(r.tokens)
                        i = r.i
                    }
                    else throw "invalid escape " + q
                    escaped = false
                } else if (str[i] == '\\') {
                    escaped = true
                } else if (str[i] == st) {
                    ret.push({type: 'quote', value: tok, location})
                    continue toplevel
                } else {
                    escaped = false
                    tok += str[i]
                }
            }
            error("unterminated string literal")
        } else if (isDigit(c)) {
            let tok = ''
            while (isDigit(str[i]) || str[i] == '.')
                tok += str[i++]
            ret.push({type: 'number', value: Number.parseFloat(tok), location})
                i--
        } else if (c == '.') {
            let d = str[i+1]
            if (isAlpha(d)) {
                i++
                let tok = ''
                while (isAlpha(str[i]) || isDigit(str[i]))
                    tok += str[i++]
                ret.push({type: 'identifier-index', value: tok, location})
                i--
            } else if (d == '[') {
                i++
                ret.push({type: 'dot-square', location})
            } else if (d == '.') {
                i++
                ret.push({type: 'dot-dot', location})
            } else {
                ret.push({type: 'dot', location})
            }
        } else if (c == '$') {
            let d = str[i+1]
            i++
            let tok = ''
            while (isAlpha(str[i]) || isDigit(str[i])) {
                tok += str[i]
                i++
            }
            ret.push({type: 'variable', name: tok, location})
            i--
        } else if (c == '[') {
            ret.push({type: 'left-square', location})
        } else if (c == ']') {
            ret.push({type: 'right-square', location})
        } else if (c == '(') {
            ret.push({type: 'left-paren', location})
            parenDepth++
        } else if (c == ')') {
            ret.push({type: 'right-paren', location})
            parenDepth--
            if (parenDepth < 0)
                return {tokens: ret, i}
        } else if (c == '{') {
            ret.push({type: 'left-brace', location})
        } else if (c == '}') {
            ret.push({type: 'right-brace', location})
        } else if (c == ',') {
            ret.push({type: 'comma', location})
        } else if (c == ';') {
            ret.push({type: 'semicolon', location})
        } else if (c == '@') {
            ret.push({type: 'at', location})
        } else if (c == '?') {
            ret.push({type: 'question', location})
        } else if (c == '|') {
            let d = str[i+1]
            if (d == '=') {
                ret.push({type: 'pipe-equals', location})
                i++
            } else
                ret.push({type: 'pipe', location})
        // Infix operators
        } else if (c == '+' || c == '*' || c == '-' || c == '/' || c == '%'
                || c == '<' || c == '>') {
            if (c == '/' && str[i+1] == '/') {
                c = '//'
                i++
            }
            if (str[i+1] == '=') {
                if (c == '<' || c == '>')
                    ret.push({type: 'op', op: c + '=', location})
                else
                    ret.push({type: 'op-equals', op: c, location})
                i++
            } else
                ret.push({type: 'op', op: c})
        } else if (c == '=') {
            if (str[i + 1] != '=')
                throw 'plain assignment = is not supported'
            i++
            ret.push({type: 'op', op: '==', location})
        } else if (c == '!') {
            if (str[i + 1] != '=')
                throw 'unexpected ! at ' + location
            i++
            ret.push({type: 'op', op: '!=', location})
        } else if (isAlpha(c)) {
            let tok = ''
            while (isAlpha(str[i]) || isDigit(str[i]) || str[i] == '_')
                tok += str[i++]
            if (tok == 'as' || tok == 'reduce' || tok == 'foreach'
                    || tok == 'import' || tok == 'include' || tok == 'def'
                    || tok == 'if' || tok == 'then' || tok == 'else'
                    || tok == 'end' || tok == 'elif') {
                ret.push({type: tok, location})
            } else {
                ret.push({type: 'identifier', value: tok, location})
            }
            i--
        } else if (c == ':') {
            ret.push({type: 'colon', location})
        }
    }
    ret.push({type: '<end-of-program>', location: i})
    return {tokens: ret, i}
}

function describeLocation(token) {
    if (token) {
        return token.location
    }
    return '<end>'
}

// Parse a token stream by recursive descent.
//
// Returns {node: {*apply(input, conf)}, i}, where i is the position in the
// token stream and node is one of the filtering nodes defined below.
// Returns at end of stream or when a token of type until is found.
function parse(tokens, startAt=0, until='none') {
    let i = startAt
    let t = tokens[i]
    let ret = []
    let commaAccum = []
    while (t && (until.indexOf(t.type) == -1)) {
        // Simple cases
        if (t.type == 'identifier-index') {
            ret.push(new IdentifierIndex(t.value))
        } else if (t.type == 'number') {
            ret.push(new NumberNode(t.value))
        } else if (t.type == 'quote') {
            ret.push(new StringNode(t.value))
        } else if (t.type == 'dot') {
            ret.push(new IdentityNode())
        } else if (t.type == 'dot-dot') {
            ret.push(new RecursiveDescent())
        } else if (t.type == 'identifier') {
            if (t.value == 'true' || t.value == 'false')
                ret.push(new BooleanNode(t.value == 'true'))
            else if (t.value == 'null')
                ret.push(new BooleanNode(null))
            else {
                // Named function
                let fname = t.value
                let args = []
                if (tokens[i+1] && tokens[i+1].type == 'left-paren') {
                    i++
                    while (tokens[i].type != 'right-paren') {
                        let arg = parse(tokens, i + 1,
                            ['semicolon', 'right-paren'])
                        args.push(arg.node)
                        i = arg.i
                    }
                }
                ret.push(new FunctionCall(fname + '/' + args.length, args))
            }
        // Recursive square bracket cases
        } else if (t.type == 'dot-square') {
            let r = parseDotSquare(tokens, i)
            ret.push(r.node)
            i = r.i
        } else if (t.type == 'left-square') {
            // Find the body of the brackets first
            let r = parse(tokens, i + 1, ['right-square', 'colon'])
            if (ret.length) {
                let lhs = makeFilterNode(ret)
                ret = []
                if (tokens[r.i].type == 'colon') {
                    // Slice
                    if (r.node.length === 0)
                        r.node = new NumberNode(0)
                    let e = parse(tokens, r.i + 1, ['right-square'])
                    if (e.node.length === 0)
                        e.node = new NumberNode(-1)
                    ret.push(new SliceNode(lhs, r.node, e.node))
                    r = e
                } else if (r.node.length === 0)
                    ret.push(new SpecificValueIterator(lhs))
                else
                    ret.push(new IndexNode(lhs, r.node))
            } else {
                ret.push(new ArrayNode(r.node))
            }
            i = r.i
        // Recursive parenthesis case
        } else if (t.type == 'left-paren') {
            // Find the body of the brackets first
            let r = parse(tokens, i + 1, 'right-paren')
            ret.push(r.node)
            i = r.i
        // Object literal
        } else if (t.type == 'left-brace') {
            let r = parseObject(tokens, i + 1)
            ret.push(r.node)
            i = r.i
        // Format @x
        } else if (t.type == 'at') {
            let n = tokens[++i]
            if (!n || n.type != 'identifier')
                throw 'expected identifier after @ at ' +
                    describeLocation(n)
            let fmt = n.value
            if (!formats[fmt])
                throw 'not a valid format: ' + fmt
            let q
            if (tokens[i+1] && tokens[i+1].type == 'quote-interp') {
                ({q, i} = parseStringInterpolation(tokens, i + 1))
                i = i
            }
            ret.push(new FormatNode(fmt, q))
        // Comma consumes everything previous and splits in-place
        // (parsing carries on in this method)
        } else if (t.type == 'comma') {
            commaAccum.push(makeFilterNode(ret))
            ret = []
        // Pipe consumes everything previous *including* commas
        // and splits by recursing for the right-hand side.
        // "as" indicates a variable binding.
        } else if (t.type == 'pipe' || t.type == 'as') {
            if (commaAccum.length) {
                // .x,.y | .[1] is the same as (.x,.y) | .[1]
                commaAccum.push(makeFilterNode(ret))
                ret = [new CommaNode(commaAccum)]
                commaAccum = []
            }
            let lhs = makeFilterNode(ret)
            if (t.type == 'as') {
                let nameTok = tokens[i+1]
                lhs = new VariableBinding(lhs, nameTok.name)
                i += 2
            }
            let r = parse(tokens, i + 1, until)
            let rhs = r.node
            i = r.i
            if (tokens[i] && until.indexOf(tokens[i].type) != -1)
                i--
            ret = [new PipeNode(lhs, rhs)]
        // Question mark suppresses errors on the preceding filter
        } else if (t.type == 'question') {
            let p = ret.pop()
            if (!p)
                throw 'unexpected ? without preceding filter at ' +
                    describeLocation(t)
            ret.push(new ErrorSuppression(p))
        // Infix operators
        } else if (t.type == 'op') {
            if (ret.length == 0 && t.op == '-' && tokens[i+1].type == 'number') {
                tokens[i+1].value = -tokens[i+1].value
                t = tokens[++i]
                continue
            }
            let lhs = makeFilterNode(ret)
            let op = t.op
            let stream = [lhs, t]
            let r = parse(tokens, i + 1, ['op', 'comma', 'pipe', 'right-paren',
                'right-brace', 'right-square', '<end-of-program>'].concat(until))
            i = r.i
            stream.push(r.node)
            while (i < tokens.length && tokens[i].type == 'op') {
                stream.push(tokens[i])
                let r = parse(tokens, i + 1, ['op', 'comma', 'pipe',
                    'right-paren', 'right-brace', 'right-square', '<end-of-program>'].concat(until))
                i = r.i
                stream.push(r.node)
            }
            ret = [shuntingYard(stream)]
            if (tokens[i]) i--
        // Update-assignment
        } else if (t.type == 'pipe-equals') {
            let lhs = makeFilterNode(ret)
            let r = parse(tokens, i + 1, ['comma', 'pipe', 'right-paren',
                'right-brace', 'right-square', '<end-of-program>'].concat(until))
            i = r.i
            let rhs = r.node
            ret = [new UpdateAssignment(lhs, rhs)]
        // Arithmetic update-assignment
        } else if (t.type == 'op-equals') {
            let lhs = makeFilterNode(ret)
            let r = parse(tokens, i + 1, ['comma', 'pipe', 'right-paren',
                'right-brace', 'right-square', '<end-of-program>'].concat(until))
            i = r.i
            let rhs = r.node
            rhs = shuntingYard([new IdentityNode(), {type: 'op', op: t.op},
                rhs])
            ret = [new UpdateAssignment(lhs, rhs)]
        // reduce .[] as $item (0, . + $item)
        } else if (t.type == 'reduce') {
            let r = parse(tokens, i + 1, ['as'])
            i = r.i
            let generator = r.node
            i++ // 'as'
            let name = tokens[i].name
            i++
            if (tokens[i].type != 'left-paren')
                throw 'expected left-paren in reduce at ' +
                    describeLocation(tokens[i])
            r = parse(tokens, i + 1, ['semicolon'])
            i = r.i
            let init = r.node
            r = parse(tokens, i + 1, ['right-paren'])
            i = r.i
            let expr = r.node
            ret.push(new ReduceNode(generator, name, init, expr))
        // Interpolated string literal
        } else if (t.type == 'quote-interp') {
            let q
            ({q, i} = parseStringInterpolation(tokens, i))
            ret.push(q)
        // Variable reference
        } else if (t.type == 'variable') {
            ret.push(new VariableReference(t.name))
        // Conditional if-then-(elif-then)*-else?-end
        } else if (t.type == 'if') {
            let conds = []
            let trueExprs = []
            let falseExpr = null
            while (tokens[i] && (tokens[i].type == 'if' || tokens[i].type == 'elif')) {
                let cond = parse(tokens, i + 1, ['then'])
                if (!tokens[cond.i] || tokens[cond.i].type != 'then')
                    throw 'expected then at ' +
                        describeLocation(tokens[cond.i]) +
                        ', from ' + tokens[i].type + ' at ' + tokens[i].location
                let trueExpr = parse(tokens, cond.i + 1, ['else', 'elif', 'end'])
                if (trueExpr.i == cond.i + 1)
                    throw 'expected expression after then at ' +
                        describeLocation(tokens[cond.i + 1]) + ', not ' +
                        tokens[cond.i + 1].type
                i = trueExpr.i
                conds.push(cond.node)
                trueExprs.push(trueExpr.node)
            }
            if (tokens[i] && tokens[i].type == 'else') {
                let elseCase = parse(tokens, i + 1, ['end'])
                i = elseCase.i
                falseExpr = elseCase.node
            }
            if (!tokens[i] || tokens[i].type != 'end')
                throw 'expected end at ' + describeLocation(tokens[i]) + ' from if at ' + t.location
            ret.push(new IfNode(conds, trueExprs, falseExpr))
        } else if (t.type == '<end-of-program>' && until == 'none') {
            break
        } else {
            throw 'could not handle token ' + t.type + ' at ' + describeLocation(t) + (until != 'none' ? ', expected ' + until.join('/') : '')
        }
        t = tokens[++i]
    }
    // If a comma appeared this array is non-empty and contains all
    // previous branches.
    if (commaAccum.length) {
        commaAccum.push(makeFilterNode(ret))
        return {node: new CommaNode(commaAccum), i}
    }
    return {node: makeFilterNode(ret), i}
}

function makeFilterNode(ret) {
    if (ret.length == 1)
        return ret[0]
    return new FilterNode(ret)
}

// Consumes pairs (quote-interp, expression up to rparen)* followed by
// a bare string and returns a StringLiteral node with the interleaving
// lists.
function parseStringInterpolation(tokens, i) {
    let t = tokens[i]
    let strings = []
    let interps = []
    strings.push(t.value)
    // Always followed by a paren expression afterwards
    let inner = parse(tokens, i + 1, ['right-paren'])
    i = inner.i + 1
    interps.push(inner.node)
    while (tokens[i].type == 'quote-interp') {
        strings.push(tokens[i].value)
        inner = parse(tokens, i + 1, ['right-paren'])
        i = inner.i + 1
        interps.push(inner.node)
    }
    // Must be the ending quote now
    strings.push(tokens[i].value)
    return {q:new StringLiteral(strings, interps), i}
}

function parseDotSquare(tokens, startAt=0) {
    let i = startAt
    let ds = tokens[i]
    i++
    if (tokens[i].type == 'right-square')
        return {node: new GenericValueIterator(), i}
    let r = parse(tokens, i, ['right-square', 'colon'])
    if (tokens[r.i].type == 'colon') {
        // Slice
        let fr = r
        if (fr.length === 0)
            fr.node = new NumberNode(0)
        r = parse(tokens, r.i + 1, ['right-square'])
        if (r.length === 0)
            r.node = new NumberNode(-1)
        return {node: new GenericSlice(fr.node, r.node), i: r.i}
    }
    return {node: new GenericIndex(r.node), i: r.i}
}

// Parse an object literal, expecting to start immediately inside the
// left brace and to consume up to and including the right brace.
function parseObject(tokens, startAt=0) {
    let i = startAt
    let fields = []
    while (tokens[i].type != 'right-brace') {
        if (tokens[i].type == 'identifier') {
            // bare name x
            let ident = tokens[i++]
            if (tokens[i].type == 'colon') {
                // with value x: val
                let r = parse(tokens, i + 1, ['comma', 'right-brace'])
                i = r.i
                fields.push({
                    key: new StringNode(ident.value),
                    value: r.node,
                })
                i--
            } else if (tokens[i].type == 'comma') {
                // no value: equivalent to x : .x
                fields.push({
                    key: new StringNode(ident.value),
                    value: new IdentifierIndex(ident.value),
                })
            } else if (tokens[i].type == 'right-brace') {
                // ditto, last field: equivalent to x : .x
                fields.push({
                    key: new StringNode(ident.value),
                    value: new IdentifierIndex(ident.value),
                })
                i--
            }
        } else if (tokens[i].type == 'quote') {
            // quoted-string key: "x" : val
            let ident = tokens[i++]
            if (tokens[i].type == 'colon') {
                let r = parse(tokens, i + 1, ['comma', 'right-brace'])
                i = r.i
                fields.push({
                    key: new StringNode(ident.value),
                    value: r.node,
                })
                i--
            } else {
                throw 'unexpected ' + tokens[i].type + ', expected colon at ' +
                    describeLocation(tokens[i])
            }
        } else if (tokens[i].type == 'left-paren') {
            // computed key: (.x | .y) : val
            let kr = parse(tokens, i + 1, 'right-paren')
            i = kr.i + 1
            if (tokens[i].type == 'colon') {
                let r = parse(tokens, i + 1, ['comma', 'right-brace'])
                i = r.i
                fields.push({
                    key: kr.node,
                    value: r.node,
                })
                i--
            } else {
                throw 'unexpected ' + tokens[i].type + ', expected colon at ' +
                    describeLocation(tokens[i])
            }
        } else {
            throw 'unexpected ' + tokens[i].type + ' at ' +
                describeLocation(tokens[i]) + ' in object at ' +
                describeLocation(tokens[startAt - 1])
        }
        i++
        // Consume a comma after a field
        if (tokens[i].type == 'comma')
            i++
    }
    return {
        node: new ObjectNode(fields),
        i
    }
}

function shuntingYard(stream) {
    const prec = { '+' : 5, '-' : 5, '*' : 10, '/' : 10, '%' : 10,
        '//' : 2, '==': 3, '!=': 3, '>': 3, '<': 3, '>=': 3, '<=': 3 }
    let output = []
    let operators = []
    for (let x of stream) {
        if (x.type == 'op') {
            while (operators.length && prec[operators[0].op] >= prec[x.op])
                output.push(operators.shift())
            operators.unshift(x)
        } else {
            output.push(x)
        }
    }
    for (let o of operators)
        output.push(o)
    let constructors = {
        '+': AdditionOperator,
        '*': MultiplicationOperator,
        '-': SubtractionOperator,
        '/': DivisionOperator,
        '%': ModuloOperator,
        '//': AlternativeOperator,
        '==': EqualsOperator,
        '!=': NotEqualsOperator,
        '<': LessThanOperator,
        '>': GreaterThanOperator,
        '<=': LessEqualsOperator,
        '>=': GreaterEqualsOperator,
    }
    let stack = []
    for (let o of output) {
        if (o.type == 'op') {
            let r = stack.pop()
            let l = stack.pop()
            stack.push(new constructors[o.op](l, r))
        } else {
            stack.push(o)
        }
    }
    return stack[0]
}

function trace_helper(input, conf, dest, rest) {
    let filter = rest[0]
    for (let v of filter.apply(input, conf)) {
        let next = []
        dest.push({
            node: filter,
            output: v,
            next,
            variables: JSON.parse(JSON.stringify(conf.variables)),
        })
        if (rest.length > 1) {
            trace_helper(v, conf, next, rest.slice(1))
        }
    }
}

function sourced_trace_helper(input, conf, dest, rest) {
    let forward = []
    let src = this
    while (src.source) {
        if (src.filter) {
            forward.unshift(src.filter)
            src = src.source
        } else {
            src = src.source
        }
    }
    forward.unshift(src)
    trace_helper(input, conf, dest, forward)
}

// Convert a value to a consistent type name, addressing the issue
// that arrays are objects.
function nameType(o) {
    if (o === null) return 'null'
    if (typeof o == 'number') return 'number'
    if (typeof o == 'string') return 'string'
    if (typeof o == 'boolean') return 'boolean'
    if (o instanceof Array) return 'array'
    if (typeof o == 'object') return 'object'
}

// Parse node classes follow. Parse nodes are:
//   FilterNode, generic juxtaposition combination
//   IndexNode, lhs[rhs]
//   SliceNode, lhs[from:to]
//   GenericIndex, .[index]
//   IdentifierIndex .index (delegates to GenericIndex("index"))
//   GenericSlice, .[from:to]
//   IdentityNode, .
//   ValueNode, parent of string/number/boolean
//   StringNode, "abc"
//   NumberNode, 123.45
//   BooleanNode, true/false
//   SpecificValueIterator, lhs[] (yields values from lhs)
//   GenericValueIterator, .[] (yields values from input)
//   CommaNode, .x, .y, .z
//   ArrayNode, [...]
//   PipeNode, a | b | c
//   ObjectNode { x : y, z, "a b" : 12, (.x.y) : .z }
//   RecursiveDescent, ..
//   OperatorNode, a binary infix operator
//   AdditionOperator, a + b
//   MultiplicationOperator, a * b
//   SubtractionOperator, a - b
//   DivisionOperator, a / b
//   ModuloOperator, a % b
//   EqualsOperator, a == b
//   NotEqualsOperator, a != b
//   AlternativeOperator, a // b
//   UpdateAssignment, .x.y |= .z
//   FunctionCall, fname(arg1; arg2)
//   FormatNode, @format, @format "a\(...)"
//   ErrorSuppression, foo?
//   VariableBinding, ... as $x (not the pipe)
//   VariableReference, $x
//   ReduceNode, reduce .[] as $x (0; . + $x)
//   IfNode, if a then b elif c then d else e end
class ParseNode {
    trace(input, conf, dest) {
        for (let v of this.apply(input, conf)) {
            dest.push({
                node: this,
                output: v,
                next: [],
            })
        }
    }
    toString() {
        return '<' + this.constructor.name + '>'
    }
}
class FilterNode extends ParseNode {
    constructor(nodes) {
        super()
        this.length = nodes.length
        let p = nodes.pop()
        if (p) {
            this.filter = p
            this.source = nodes.length == 1 ? nodes[0] : new FilterNode(nodes)
        }
    }
    * apply(input, conf) {
        if (!this.filter)
            return
        for (let v of this.source.apply(input, conf)) {
            yield* this.filter.apply(v, conf)
        }
    }
    * paths(input, conf) {
        if (!this.filter) {
            return []
        }
        for (let v of this.source.paths(input, conf)) {
            for (let w of this.filter.paths(input, conf)) {
                yield v.concat(w)
            }
        }
    }
    trace = sourced_trace_helper
    toString() {
        return (this.source ? this.source.toString() : '') + (this.filter ? this.filter.toString() : '')
    }
}
class IndexNode extends ParseNode {
    constructor(lhs, index) {
        super()
        this.lhs = lhs
        this.index = index
    }
    * apply(input, conf) {
        for (let l of this.lhs.apply(input, conf)) {
            let t = nameType(l)
            for (let i of this.index.apply(input, conf)) {
                if (t == 'array' && nameType(i) != 'number')
                    throw 'Cannot index array with ' + nameType(i) + ' ' +
                        JSON.stringify(i)
                else if (t == 'object' && nameType(i) != 'string')
                    throw 'Cannot index object with ' + nameType(i) + ' ' +
                        JSON.stringify(i)
                if (typeof i == 'number' && i < 0 && nameType(l) == 'array')
                    yield l[l.length + i]
                else
                    yield typeof l[i] == 'undefined' ? null : l[i]
            }
        }
    }
    * paths(input, conf) {
        for (let l of this.lhs.paths(input, conf))
            for (let a of this.index.apply(input, conf))
                yield l.concat([a])
    }
    toString() {
        return this.lhs.toString() + '[' + this.index.toString() + ']'
    }
}
class SliceNode extends ParseNode {
    constructor(lhs, from, to) {
        super()
        this.lhs = lhs
        this.from = from
        this.to = to
    }
    * apply(input, conf) {
        for (let l of this.lhs.apply(input, conf))
            for (let s of this.from.apply(input, conf)) {
                if (s < 0) s += l.length
                for (let e of this.to.apply(input, conf)) {
                    if (e < 0) e += l.length
                    yield l.slice(s, e)
                }
            }
    }
    * paths(input, conf) {
        for (let l of this.lhs.paths(input, conf))
            for (let a of this.from.apply(input, conf))
                for (let b of this.to.apply(input, conf))
                    yield l.concat([{start:a, end:b}])
    }
    toString() {
        return this.lhs.toString() + '[' + this.from.toString() + ':' + this.to.toString() + ']'
    }
}
class GenericIndex extends ParseNode {
    constructor(innerNode) {
        super()
        this.index = innerNode
    }
    * apply(input, conf) {
        let t = nameType(input)
        for (let i of this.index.apply(input, conf)) {
            if (t == 'array' && nameType(i) != 'number')
                throw 'Cannot index array with ' + nameType(i) + ' ' +
                    JSON.stringify(i)
            else if (t == 'object' && nameType(i) != 'string')
                throw 'Cannot index object with ' + nameType(i) + ' ' +
                    JSON.stringify(i)
            if (typeof i == 'number' && i < 0 && nameType(input) == 'array')
                yield input[input.length + i]
            else
                yield typeof input[i] == 'undefined' ? null : input[i]
        }
    }
    * paths(input, conf) {
        for (let a of this.index.apply(input, conf))
            yield [a]
    }
}
class IdentifierIndex extends GenericIndex {
    constructor(v) {
        super(new StringNode(v))
    }
    toString() {
        return '.' + this.index.value
    }
}
class GenericSlice extends ParseNode {
    constructor(fr, to) {
        super()
        this.from = fr
        this.to = to
    }
    * apply(input, conf) {
        for (let l of this.from.apply(input, conf)) {
            if (l < 0) l += input.length
            for (let r of this.to.apply(input, conf)) {
                if (r < 0)
                    r += input.length
                yield input.slice(l, r)
            }
        }
    }
    * paths(input, conf) {
        for (let l of this.from.apply(input, conf))
            for (let r of this.to.apply(input, conf))
                yield [{start: l, end: r}]
    }
    toString() {
        return '.[' + this.from.toString() + ':' + this.to.toString() + ']'
    }
}
class IdentityNode extends ParseNode {
    constructor() {
        super()
    }
    * apply(input, conf) {
        yield input
    }
    * paths(input, conf) {
        yield []
    }
    toString() {
        return '.'
    }
}
class ValueNode extends ParseNode {
    constructor(v) {
        super()
        this.value = v
    }
    * apply() {
        yield this.value
    }
    * paths(input, conf) {
        yield this.value
    }
    toString() {
        return JSON.stringify(this.value)
    }
}
class StringNode extends ValueNode {
    constructor(v) {
        super(v)
    }
}
class StringLiteral extends ParseNode {
    constructor(strings, interpolations) {
        super()
        this.strings = strings
        this.interpolations = interpolations
    }
    * apply(input, conf) {
        yield* this.applyEscape(input, formats.text, conf)
    }
    * applyEscape(input, esc, conf, startAt=0) {
        let s = this.strings[startAt]
        let i = this.interpolations[startAt]
        if (!i) return yield s
        for (let v of this.interpolations[startAt].apply(input, conf)) {
            for (let r of this.applyEscape(input, esc, conf, startAt + 1)) {
                yield s + esc(v) + r
            }
        }
    }
    toString() {
        let s = ''
        for (let i = 0; i < this.strings.length; i++) {
            s += this.strings[i].replace('\\', '\\\\').replace('"', '\\"')
            if (this.interpolations[i])
                s += '\\(' + this.interpolations[i].toString() + ')'
        }
        return '"' + s + '"'
    }
}
class NumberNode extends ValueNode {
    constructor(v) {
        super(v)
    }
    toString() {
        return this.value.toString()
    }
}
class BooleanNode extends ValueNode {
    constructor(v) {
        super(v)
    }
    toString() {
        return this.value ? 'true' : 'false'
    }
}
class SpecificValueIterator extends ParseNode {
    constructor(source) {
        super()
        this.source = source
        this.filter = new GenericValueIterator()
    }
    * apply(input, conf) {
        for (let o of this.source.apply(input, conf))
            yield* Object.values(o)
    }
    * paths(input, conf) {
        for (let [p, v] of this.zip(this.source.paths(input, conf),
                this.source.apply(input, conf))) {
                if (nameType(v) == 'array')
                    for (let i = 0; i < v.length; i++)
                        yield p.concat([i])
                else
                    for (let i of Object.keys(v)) {
                        yield p.concat([i])
                    }
        }
    }
    * zip(a, b) {
        let aa = a[Symbol.iterator]()
        let bb = b[Symbol.iterator]()
        let v1 = aa.next()
        let v2 = bb.next()
        while (!v1.done && !v2.done) {
            yield [v1.value, v2.value]
            v1 = aa.next()
            v2 = bb.next()
        }
    }
    toString() {
        return this.source.toString() + '[]'
    }
    trace = sourced_trace_helper
}
class GenericValueIterator extends ParseNode {
    constructor() {
        super()
    }
    * apply(input, conf) {
        if (nameType(input) == 'array')
            yield* input
        else
            yield* Object.values(input)
    }
    * paths(input, conf) {
        if (nameType(input) == 'array')
            for (let i = 0; i < input.length; i++)
                yield [i]
        else
            for (let o of Object.keys(input))
                yield [o]
    }
    toString() {
        return '.[]'
    }
}
class CommaNode extends ParseNode {
    constructor(branches) {
        super()
        this.branches = branches
    }
    * apply(input, conf) {
        for (let b of this.branches)
            yield* b.apply(input, conf)
    }
    * paths(input, conf) {
        for (let b of this.branches)
            yield* b.paths(input, conf)
    }
    toString() {
        return this.branches.join(', ')
    }
}
class ArrayNode extends ParseNode {
    constructor(body) {
        super()
        this.body = body
    }
    * apply(input, conf) {
        yield Array.from(this.body.apply(input, conf))
    }
    toString() {
        return '[' + this.body + ']'
    }
}
class PipeNode extends ParseNode {
    constructor(lhs, rhs) {
        super()
        this.lhs = lhs
        this.rhs = rhs
        this.isPipe = true
    }
    toString() {
        return `${this.lhs} | ${this.rhs}`
    }
    * apply(input, conf) {
        for (let v of this.lhs.apply(input, conf))
            for (let q of this.rhs.apply(v, conf))
                yield q
    }
    * paths(input, conf) {
        for (let [p, v] of this.zip(this.lhs.paths(input, conf),
                this.lhs.apply(input, conf))) {
            for (let p2 of this.rhs.paths(v, conf)) {
                yield p.concat(p2)
            }
        }
    }
    * zip(a, b) {
        let aa = a[Symbol.iterator]()
        let bb = b[Symbol.iterator]()
        let v1 = aa.next()
        let v2 = bb.next()
        while (!v1.done && !v2.done) {
            yield [v1.value, v2.value]
            v1 = aa.next()
            v2 = bb.next()
        }
    }
    trace(input, conf, dest) {
        for (let v of this.lhs.apply(input, conf)) {
            let next = []
            let more = {}
            if (this.lhs instanceof VariableBinding)
                more.variableValue = conf.variables[this.lhs.name]
            dest.push({
                node: this.lhs,
                output: v,
                next,
                variables: JSON.parse(JSON.stringify(conf.variables)),
                ...more
            })
            this.rhs.trace(v, conf, next)
        }
    }
}
class ObjectNode extends ParseNode {
    constructor(fields) {
        super()
        this.fields = fields
    }
    * apply(input, conf) {
        let obj = {}
        let values = {}
        let keys = []
        for (let {key, value} of this.fields) {
            for (let k of key.apply(input, conf)) {
                keys.push(k)
                values[k] = []
                for (let v of value.apply(input, conf))
                    values[k].push(v)
            }
        }
        yield* this.helper(keys, values, 0, {})
    }
    * helper(keys, values, startAt, obj) {
        if (startAt >= keys.length) {
            yield Object.assign({}, obj)
            return
        }
        let k = keys[startAt]
        for (let v of values[k]) {
            obj[k] = v
            yield* this.helper(keys, values, startAt + 1, obj)
        }
    }
    toString() {
        return '{' + this.fields.map(({key, value}) => key.toString() + ': ' + value.toString()).join(', ') + '}'
    }
}
class RecursiveDescent extends ParseNode {
    constructor() {
        super()
    }
    * apply(input, conf) {
        yield* this.recurse(input)
    }
    * recurse(s) {
        yield s
        let t = nameType(s)
        if (t == 'array' || t == 'object')
            for (let v of Object.values(s))
                yield* this.recurse(v)
    }
    * paths(input, conf) {
        yield* this.recursePaths(input, [])
    }
    * recursePaths(s, prefix) {
        yield prefix
        let t = nameType(s)
        if (t == 'array')
            for (let i = 0; i < s.length; i++)
                yield* this.recursePaths(s[i], prefix.concat([i]))
        else if (t == 'object')
            for (let [k,v] of Object.entries(s))
                yield* this.recursePaths(v, prefix.concat([k]))
    }
    toString() {
        return '..'
    }
}
class OperatorNode extends ParseNode {
    constructor(l, r) {
        super()
        this.l = l
        this.r = r
    }
    * apply(input, conf) {
        for (let rr of this.r.apply(input, conf))
            for (let ll of this.l.apply(input, conf))
                yield this.combine(ll, rr, nameType(ll), nameType(rr))
    }
    trace(input, conf, dest) {
        for (let v of this.l.apply(input, conf)) {
            let next = []
            dest.push({
                node: this.l,
                output: v,
                next,
                subsidiary: 'left'
            })
            for (let v2 of this.r.apply(input, conf)) {
                let next2 = []
                next.push({
                    node: this.r,
                    output: v2,
                    next: next2,
                    subsidiary: 'right',
                })
                let result = this.combine(v, v2, nameType(v), nameType(v2))
                let next3 = []
                next2.push({
                    node: this,
                    output: result,
                    next: next3,
                })
            }
        }
    }
}
class AdditionOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt == 'number' && rt == 'number')
            return l + r
        if (l === null)
            return r
        if (r === null)
            return l
        if (lt == 'string' && rt == 'string')
            return l + r
        if (lt == 'array' && rt == 'array')
            return l.concat(r)
        if (lt == 'object' && rt == 'object')
            return Object.assign(Object.assign({}, l), r)
        throw 'type mismatch in +:' + lt + ' and ' + rt + ' cannot be added'
    }
    toString() {
        return this.l + ' + ' + this.r
    }
}
class MultiplicationOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt == 'number' && rt == 'number')
            return l * r
        if (lt == 'number' && rt == 'string')
            return this.repeat(r, l)
        if (lt == 'string' && rt == 'number')
            return this.repeat(l, r)
        if (lt == 'object' && rt == 'object')
            return this.merge(Object.assign({}, l), r)
        throw 'type mismatch in *:' + lt + ' and ' + rt + ' cannot be multiplied'
    }
    repeat(s, n) {
        if (n == 0)
            return null;
        let r = []
        for (let i = 0; i < n; i++)
            r.push(s)
        return r.join('')
    }
    merge(l, r) {
        for (let k of Object.keys(r)) {
            if (!l.hasOwnProperty(k))
                l[k] = r[k]
            else if (nameType(l[k]) != 'object' || nameType(r[k]) != 'object')
                l[k] = r[k]
            else
                this.merge(l[k], r[k])
        }
        return l
    }
    toString() {
        return this.l + ' * ' + this.r
    }
}
class SubtractionOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt == 'number' && rt == 'number')
            return l - r
        if (l == null || r == null)
            throw 'type mismatch in -'
        if (lt == 'array' && rt == 'array')
            return l.filter(x => r.indexOf(x) == -1)
        throw 'type mismatch in -:' + lt + ' and ' + rt + ' cannot be subtracted'
    }
    toString() {
        return this.l + ' - ' + this.r
    }
}
class DivisionOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt == 'number' && rt == 'number')
            return l / r
        if (lt == 'string' && rt == 'string')
            return l.split(r)
        throw 'type mismatch in -:' + lt + ' and ' + rt + ' cannot be divided'
    }
    toString() {
        return this.l + ' / ' + this.r
    }
}
class ModuloOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt == 'number' && rt == 'number')
            return l % r
        throw 'type mismatch in -:' + lt + ' and ' + rt + ' cannot be divided (remainder)'
    }
    toString() {
        return this.l + ' % ' + this.r
    }
}
class LessThanOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        return compareValues(l, r) < 0
    }
    toString() {
        return this.l + ' < ' + this.r
    }
}
class GreaterThanOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        return compareValues(l, r) > 0
    }
    toString() {
        return this.l + ' > ' + this.r
    }
}
class LessEqualsOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        return compareValues(l, r) <= 0
    }
    toString() {
        return this.l + ' <= ' + this.r
    }
}
class GreaterEqualsOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        return compareValues(l, r) >= 0
    }
    toString() {
        return this.l + ' >= ' + this.r
    }
}
class EqualsOperator extends OperatorNode {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        if (lt != rt)
            return false
        if (lt == 'number' || lt == 'string' || lt == 'boolean' || lt == 'null')
            return l == r
        if (lt == 'array') {
            if (l.length != r.length)
                return false
            for (let i = 0; i < l.length; i++)
                if (!this.combine(l[i], r[i], nameType(l[i]), nameType(r[i])))
                    return false
            return true
        }
        let lk = Object.keys(l)
        let rk = Object.keys(r)
        if (lk.length != rk.length)
            return false
        for (let k of lk) {
            if (!r.hasOwnProperty(k))
                return false
            if (!this.combine(l[k], r[k], nameType(l[k]), nameType(r[k])))
                return false
        }
        return true
    }
    toString() {
        return this.l + ' == ' + this.r
    }
}
class NotEqualsOperator extends EqualsOperator {
    constructor(l, r) {
        super(l, r)
    }
    combine(l, r, lt, rt) {
        return !super.combine(l, r, lt, rt)
    }
    toString() {
        return this.l + ' != ' + this.r
    }
}
class AlternativeOperator extends ParseNode {
    constructor(l, r) {
        super()
        this.lhs = l
        this.rhs = r
    }
    * apply(input, conf) {
        let found = false
        for (let v of this.lhs.apply(input, conf)) {
            if (v !== null) found = true
            yield v
        }
        if (!found)
            yield* this.rhs.apply(input, conf)
    }
    toString() {
        return this.l + ' // ' + this.r
    }
}
class UpdateAssignment extends ParseNode {
    constructor(l, r) {
        super()
        this.l = l
        this.r = r
    }
    * apply(input, conf) {
        input = JSON.parse(JSON.stringify(input))
        for (let p of this.l.paths(input, conf)) {
            let it = this.r.apply(this.get(input, p), conf).next()
            if (it.done)
                input = this.update(input, p, null, true)
            else
                input = this.update(input, p, it.value)
        }
        yield input
    }
    // Pluck the value at a path out of an object
    get(obj, p) {
        let o = obj
        for (let i of p)
            o = o[i]
        return o
    }
    // Set the value at path p to v in obj,
    // or delete the key if del is true.
    update(obj, p, v, del=false) {
        let o = obj
        let last = p.pop()
        for (let i of p)
            o = o[i]
        if (typeof last == 'undefined')
            return v
        o[last] = v
        if (del)
            delete o[last]
        return obj
    }
    toString() {
        return this.l + ' |= ' + this.r
    }
}
class FunctionCall extends ParseNode {
    constructor(fname, args) {
        super()
        this.name = fname
        this.args = args
    }
    apply(input, conf) {
        let func
        let ufa = conf.userFuncArgs[this.name]
        if (ufa)
            func = function(input, conf, args) {
                return ufa.apply(input, conf)
            }
        else if (!func)
            func = functions[this.name]
        if (!func)
            throw 'no such function ' + this.name
        let argStack = []
        return func(input, conf, this.args)
    }
    paths(input, conf) {
        let ufa = conf.userFuncArgs[this.name]
        if (ufa)
            return ufa.paths(input, conf)
        let func = functions[this.name + '-paths']
        if (!func)
            throw 'no paths for ' + this.name
        return func(input, conf, this.args)
    }
    trace(input, conf, dest) {
        if (this.args.length == 1 && !conf.userFuncArgs[this.name] && this.ordinary) {
            let func = functions[this.name];
            if (func.params && func.params.length > 0) {
                if (func.params[0].mode == 'defer') {
                    return super.trace(input, conf, dest)
                }
            }
            for (let a1 of this.args[0].apply(input, conf)) {
                let next = []
                let paramLabel = 'arg1'
                if (func.params && func.params.length > 0 && func.params[0].label)
                    paramLabel = func.params[0].label;
                dest.push({
                    node: this.args[0],
                    output: a1,
                    next,
                    subsidiary: paramLabel
                })
                for (let result of func(input, conf, [new ValueYielder(a1)])) {
                    let next2 = []
                    next.push({
                        node: this,
                        output: result,
                        next: next2,
                    })
                }
            }    
        } else {
            return super.trace(input, conf, dest)
        }
    }
    get ordinary() {
        let func = functions[this.name];
        if (!func) return true;
        if (func.params && func.params.length > 0) {
            if (func.params[0].mode == 'defer') {
                return false;
            }
        }
        return true;
    }
    toString() {
        if (this.args.length == 0)
            return this.name.replace(/\/.*$/, '')
        else
            return this.name.replace(/\/.*$/, '') + '(' + this.args.join('; ') + ')'
    }
}
class FormatNode extends ParseNode {
    constructor(fname, quote) {
        super()
        this.name = fname
        this.string = quote
    }
    * apply(input, conf) {
        if (typeof this.string === 'undefined')
            return yield formats[this.name](input)
        yield* this.string.applyEscape(input, formats[this.name], conf)
    }
    toString() {
        if (this.string)
            return '@' + this.name + ' ' + this.string
        else
            return '@' + this.name
    }
}
class ErrorSuppression extends ParseNode {
    constructor(inner) {
        super()
        this.inner = inner
    }
    * apply(input, conf) {
        try {
            for (let o of this.inner.apply(input, conf))
                if (o !== null)
                    yield o
        } catch {
        }
    }
    * paths(input, conf) {
        try {
            for (let [o,p] of zip(this.inner.apply(input, conf),
                    this.inner.paths(input, conf)))
                if (o !== null)
                    yield p
        } catch {
        }
    }
    toString() {
        return this.inner + '?'
    }
}
class VariableBinding extends ParseNode {
    constructor(lhs, name) {
        super()
        this.value = lhs
        this.name = name
    }
    * apply(input, conf) {
        for (let v of this.value.apply(input, conf)) {
            conf.variables[this.name] = v
            yield input
        }
        delete conf.variables[this.name]
    }
    toString() {
        return this.value + ' as $' + this.name
    }
}
class VariableReference extends ParseNode {
    constructor(name) {
        super()
        this.name = name
    }
    * apply(input, conf) {
        yield conf.variables[this.name]
    }
    toString() {
        return '$' + this.name
    }
}
class ReduceNode extends ParseNode {
    constructor(generator, name, init, expr) {
        super()
        this.generator = generator
        this.name = name
        this.init = init
        this.expr = expr
    }
    * apply(input, conf) {
        // This uses all values of the initialiser, but only the
        // last value of the reduction expression is retained. This
        // seems to match jq proper's behaviour, but jq has odd
        // errors in mixed cases that seem unnecessary.
        for (let accum of this.init.apply(input, conf)) {
            for (let v of this.generator.apply(input, conf)) {
                conf.variables[this.name] = v
                for (let a of this.expr.apply(accum, conf))
                    accum = a
            }
            delete conf.variables[this.name]
            yield accum
        }
    }
    toString() {
        return 'reduce ' + this.generator + ' as $' + this.name + '(' + this.init + '; ' + this.expr + ')'
    }
}
class IfNode extends ParseNode {
    constructor(conditions, thens, elseBranch) {
        super()
        this.conditions = conditions
        this.thens = thens
        this.elseBranch = elseBranch
    }
    * apply(input, conf) {
        for (let [c,t] of zip(this.conditions, this.thens)) {
            for (let cond of c.apply(input, conf)) {
                if (cond) {
                    for (let o of t.apply(input, conf))
                        yield o
                    return
                }
            }
        }
        if (this.elseBranch) {
            yield* this.elseBranch.apply(input, conf)
            return
        }
        yield input
    }
    toString() {
        let s = ''
        for (let [c,t] of zip(this.conditions, this.thens))
            s += 'if ' + c + ' then ' + t + ' el'
        if (this.elseBranch) {
            return s + 'se ' + this.elseBranch + ' end'
        }
        return s.slice(0, -2) + 'end'
    }
}

class ValueYielder {
    /* This is used internally for evaluating functions at specific values. */
    constructor(v) {
        this.value = v
    }
    * apply(input, conf) {
        yield this.value
    }
    toString() {
        return this.value.toString()
    }
}

const formats = {
    text(v) {
        if (typeof v == 'string')
            return v
        return prettyPrint(v, '', '', '')
    },
    json(v) {
        return prettyPrint(v, '', '', '')
    },
    html(v) {
        if (typeof v != 'string')
            v = prettyPrint(v, '', '', '')
        return v.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(
            /&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;')
    },
    uri(v) {
        if (typeof v != 'string')
            v = prettyPrint(v, '', '', '')
        return escape(v)
    },
    csv(v) {
        if (nameType(v) != 'array')
            throw 'cannot csv-format ' + nameType(v) + ', only array'
        return v.map(x => {
            if (typeof x == 'string')
                return '"' + x.replace(/"/g, '""') + '"'
            else if (typeof x == 'number')
                return '' + x
            else if (x === null)
                return ''
            else
                throw 'type ' + nameType(x) + ' not valid in a csv row'
        }).join(',')
    },
    tsv(v) {
        if (nameType(v) != 'array')
            throw 'cannot tsv-format ' + nameType(v) + ', only array'
        return v.map(x => {
            if (typeof x == 'string')
                return escapeString(x)
            else if (typeof x == 'number')
                return '' + x
            else if (x === null)
                return ''
            else
                throw 'type ' + nameType(x) + ' not valid in a tsv row'
        }).join('\t')
    },
    base64(v) {
        if (typeof v != 'string')
            v = prettyPrint(v, '', '', '')
        return btoa(v)
    },
    base64d(v) {
        if (typeof v != 'string')
            throw 'can only base64-decode strings'
        return atob(v)
    },
    sh(v) {
        let t = nameType(v)
        if (t == 'string')
            return "'" + t.replace(/'/g, "'\\''") + "'"
        else if (t == 'number')
            return '' + v
        else if (t == 'boolean')
            return '' + v
        else if (v === null)
            return 'null'
        else if (t === 'array') {
            return v.map(v => {
                let t = nameType(v)
                if (t == 'string')
                    return "'" + v.replace(/'/g, "'\\''") + "'"
                else if (t == 'number')
                    return '' + v
                else if (t == 'boolean')
                    return '' + v
                else if (v === null)
                    return 'null'
                else
                    throw t + ' cannot be escaped for shell'
            }).join(' ')
        } else
            throw t + ' cannot be escaped for shell'
    },
}

const functions = {
    'tostring/0': function*(input) {
        yield formats.text(input)
    },
    'empty/0': function*(input) {
    },
    'path/1': Object.assign(function*(input, conf, args) {
        let f = args[0]
        yield* f.paths(input, conf)
    }, {params: [{mode: 'defer'}]}),
    'select/1': Object.assign(function*(input, conf, args) {
        let selector = args[0]
        for (let b of selector.apply(input, conf))
            if (b !== false && b !== null)
                yield input
    }, {
        params: [{label: 'predicate', mode: 'eval'}]
    }),
    'select/1-paths': function*(input, conf, args) {
        let selector = args[0]
        for (let b of selector.apply(input, conf))
            if (b !== false && b !== null)
                yield []
    },
    'length/0': function*(input) {
        let t = nameType(input)
        if (t == 'string' || t == 'array')
            return yield input.length
        if (t == 'null') return yield 0
        if (t == 'object') return yield Object.keys(input).length
        throw 'cannot compute length of ' + t
    },
    'keys/0': function*(input) {
        yield* Object.keys(input).sort()
    },
    'has/1': Object.assign(function*(input, conf, args) {
        let f = args[0]
        for (let k of f.apply(input, conf))
            yield input.hasOwnProperty(k)
    }, {params: [{label: 'key'}]}),
    'has/1-paths': function*(input, conf, args) {
        let f = args[0]
        for (let k of f.apply(input, conf))
            if (input.hasOwnProperty(k)) yield []
    },
    'in/1': Object.assign(function*(input, conf, args) {
        let f = args[0]
        for (let o of f.apply(input, conf))
            yield o.hasOwnProperty(input)
    }, {params: [{label: 'object'}]}),
    'in/1-paths': function*(input, conf, args) {
        let f = args[0]
        for (let o of f.apply(input, conf))
            if (o.hasOwnProperty(input)) yield []
    },
    'contains/1': Object.assign(function*(input, conf, args) {
        let f = args[0]
        let t = nameType(input)
        for (let o of f.apply(input, conf)) {
            let ot = nameType(o)
            if (t != ot) {
                throw t + ' and ' + ot + ' cannot have their containment checked'
            } else
                yield containsHelper(input, o)
        }
    }, {params: [{label: 'element'}]}),
    'inside/1': Object.assign(function*(input, conf, args) {
        let f = args[0]
        let t = nameType(input)
        for (let o of f.apply(input, conf)) {
            let ot = nameType(o)
            if (t != ot) {
                throw t + ' and ' + ot + ' cannot have their containment checked'
            } else
                yield containsHelper(o, input)
        }
    }, {params: [{label: 'container'}]}),
    'to_entries/0': function*(input, conf) {
        let t = nameType(input)
        if (t == 'array') {
            let ret = []
            for (let i = 0; i < input.length; i++)
                ret.push({key: i, value: input[i]})
            yield ret
        } else if (t == 'object')
            yield Object.entries(input).map(a => ({key: a[0], value: a[1]}))
        else
            throw 'cannot make entries from ' + t
    },
    'from_entries/0': function*(input, conf) {
        let t = nameType(input)
        if (t == 'array') {
            let obj = {}
            for (let {key, value} of input)
                obj[key] = value
            yield obj
        } else
            throw 'cannot use entries from ' + t
    },
    'type/0': function*(input) {
        yield nameType(input)
    },
    'range/1': Object.assign(function*(input, conf, args) {
        for (let m of args[0].apply(input, conf))
            for (let i = 0; i < m; i++)
                yield i
    }, {params: [{mode: 'defer'}]}),
    'range/2': function*(input, conf, args) {
        for (let min of args[0].apply(input, conf))
            for (let max of args[1].apply(input, conf))
                for (let i = min; i < max; i++)
                    yield i
    },
    'range/3': function*(input, conf, args) {
        for (let min of args[0].apply(input, conf))
            for (let max of args[1].apply(input, conf))
                for (let step of args[2].apply(input, conf))
                    for (let i = min; i < max; i+=step)
                        yield i
    },
    'any/0': function*(input, conf) {
        if (nameType(input) != 'array')
            throw 'any/0 requires array as input, not ' + nameType(input)
        for (let b of input)
            if (b) return yield true
        yield false
    },
    'any/1': Object.assign(function*(input, conf, args) {
        if (nameType(input) != 'array')
            throw 'any/1 requires array as input, not ' + nameType(input)
        for (let v of input)
            for (let b of args[0].apply(v, conf))
                if (b) return yield true
        yield false
    }, {params: [{mode: 'defer'}]}),
    'any/2': function*(input, conf, args) {
        let gen = args[0]
        let cond = args[1]
        for (let v of gen.apply(input, conf))
            for (let b of cond.apply(v, conf))
                if (b) return yield true
        yield false
    },
    'all/0': function*(input, conf) {
        if (nameType(input) != 'array')
            throw 'all/0 requires array as input, not ' + nameType(input)
        for (let b of input)
            if (!b) return yield false
        yield true
    },
    'all/1': Object.assign(function*(input, conf, args) {
        if (nameType(input) != 'array')
            throw 'all/1 requires array as input, not ' + nameType(input)
        for (let v of input)
            for (let b of args[0].apply(v, conf))
                if (!b) return yield false
        yield true
    }, {params: [{mode: 'defer'}]}),
    'all/2': function*(input, conf, args) {
        let gen = args[0]
        let cond = args[1]
        for (let v of gen.apply(input, conf))
            for (let b of cond.apply(v, conf))
                if (!b) return yield false
        yield true
    },
    'add/0': function*(input, conf) {
        if (nameType(input) != 'array')
            throw 'can only add up arrays'
        if (input.length == 0) return yield null
        if (input.length == 1) return yield input[0]
        let ret = AdditionOperator.prototype.combine(input[0], input[1],
            nameType(input[0]), nameType(input[1]))
        for (let i = 2; i < input.length; i++)
            ret = AdditionOperator.prototype.combine(ret, input[i],
                nameType(ret), nameType(input[i]))
        yield ret
    },
    'tonumber/0': function*(input) {
        yield Number.parseFloat(input)
    },
    'sort/0': function*(input, conf) {
        if (nameType(input) != 'array')
            throw 'can only sort arrays, not ' + nameType(input)
        let r = Array.from(input)
        yield r.sort(compareValues)
    },
    'sort_by/1': Object.assign(function*(input, conf, args) {
        if (nameType(input) != 'array')
            throw 'can only sort arrays, not ' + nameType(input)
        let key = args[0]
        let r = input.map(v => ({
            key: key.apply(v, conf).next().value,
            value: v
        }))
        r.sort((a, b) => compareValues(a.key, b.key))
        yield r.map(a => a.value)
    }, {params: [{mode: 'defer'}]}),
    'explode/0': function*(input, conf) {
        if (nameType(input) != 'string')
            throw 'can only explode string, not ' + nameType(input)
        let ret = []
        for (let i = 0; i < input.length; i++) {
            let c = input.charCodeAt(i)
            ret.push(c)
            if (c > 0xffff)
                i++
        }
        yield ret
    },
    'implode/0': function*(input, conf) {
        if (nameType(input) != 'array')
            throw 'can only implode array, not ' + nameType(input)
        yield input.map(x => String.fromCodePoint(x)).join('')
    },
    'split/1': Object.assign(function*(input, conf, args) {
        if (nameType(input) != 'string')
            throw 'can only split string, not ' + nameType(input)
        for (let s of args[0].apply(input, conf)) {
            yield input.split(s)
        }
    }, {params: [{label: 'separator'}]}),
    'join/1': Object.assign(function*(input, conf, args) {
        if (nameType(input) != 'array')
            throw 'can only join array, not ' + nameType(input)
        let a = input.map(x => {
            if (typeof x == 'number') return '' + x
            if (typeof x == 'string') return x
            if (typeof x == 'boolean') return '' + x
            if (x === null) return ''
            throw 'cannot join ' + nameType(x)
        })
        for (let s of args[0].apply(input, conf))
            yield a.join(s)
    }, {params: [{label: 'delimiter'}]}),
}

// Implements the containment algorithm, returning whether haystack
// contains needle:
// * Strings are contained if they are substrings
// * Arrays if each element is contained in some element of other
// * Object if values contained by values in matching key
// * All others, if they are equal.
// This helper function is necessary because the recursive case
// has different error behaviour to the user-exposed function.
function containsHelper(haystack, needle) {
    let haystackType = nameType(haystack)
    let needleType = nameType(needle)
    if (haystackType != needleType) {
        return false
    } else if (haystackType == 'string') {
        return (haystack.indexOf(needle) != -1)
    } else if (haystackType == 'array') {
        for (let b of needle) {
            let found = false
            for (let a of haystack) {
                if (containsHelper(a, b)) {
                    found = true
                    break
                }
            }
            if (!found)
                return false
        }
        return true
    } else if (haystackType == 'object') {
        for (let k of Object.keys(needle)) {
            if (!haystack.hasOwnProperty(k))
                return false
            if (!containsHelper(haystack[k], needle[k]))
                return false
        }
        return true
    } else {
        return haystack === needle
    }
}

defineShorthandFunction('map', 'f', '[.[] | f]')
defineShorthandFunction('map_values', 'f', '.[] |= f')
defineShorthandFunction('del', 'p', 'p |= empty')
defineShorthandFunction('with_entries', 'w', 'to_entries | map(w) | from_entries')
defineShorthandFunction('arrays', '', 'select(type == "array")')
defineShorthandFunction('objects', '', 'select(type == "object")')
defineShorthandFunction('booleans', '', 'select(type == "boolean")')
defineShorthandFunction('strings', '', 'select(type == "string")')
defineShorthandFunction('numbers', '', 'select(type == "number")')
defineShorthandFunction('nulls', '', 'select(type == "null")')

const jq = {compile, prettyPrint}
// Delete these two lines for a non-module version (CORS-safe)
export { compile, prettyPrint, compileNode, formats }
export default jq
