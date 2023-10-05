import parse = require('json-to-ast');
import jp = require("jsonpath")
import fs = require("fs")
export const getSingleCaseJSON = (specPath: string, line: number) => {
    const specText = fs.readFileSync(specPath).toString()
    const ast = parse(specText)
    const testCasesAst = jp.query(ast, '$..children[?(@.key.value=="tests")]')[0]
    const index = testCasesAst.value.children.findIndex((child: any) => {
        const testCaseItem = child.children.find((testCaseProperty: any) => testCaseProperty.key.value === "testCase")
        return testCaseItem.key.loc.start.line === line
    })
    const specObj = JSON.parse(specText)
    specObj.tests = [specObj.tests[index]]
    return JSON.stringify(specObj)
}

