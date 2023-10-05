import parse = require('json-to-ast');
import fs = require("fs")
export const getSingleMetaJSON = (metadataPath: string, caseName: string) => {
    const metadataText = fs.readFileSync(metadataPath).toString()
    const metadataObj = JSON.parse(metadataText)
    const ast = parse(metadataText) as any
    
    const signleMeta = ast.children
                            .find((child: any) => child.key.value === "suite")  
                            .value.children
                            .find((child: any) => child.key.value.includes(caseName))
    metadataObj.suite = { [signleMeta.key.value]: ast2Json(signleMeta)}
    const metaJSON = JSON.stringify(metadataObj)
    return metaJSON
}

function ast2Json(ast: any): any {
    if (ast.type === "Object") {
        const obj: any = {}
        ast.children.forEach((child: any) => {
            obj[child.key.value] = ast2Json(child.value)
        })
        return obj
    } else if (ast.type === "Array") {
        return ast.children.map((child: any) => ast2Json(child))
    } else if (ast.type === "Literal") {
        return ast.value
    } else if (ast.type === "Identifier") {
        return ast.value
    } else if (ast.type === "Property") {
        return ast2Json(ast.value)
    }
}