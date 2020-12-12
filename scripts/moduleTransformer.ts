import * as ts from "typescript";
import * as tstl from "typescript-to-lua";
import { transformSourceFileNode } from "typescript-to-lua/dist/transformation/visitors/sourceFile";

/**
 * This transformer replaces non-relative imports with absolute paths.
 * E.g., "w3ts" => "home/verit/duels/node_modules/w3ts/index"
 */

function transformSourceFile(
	expression: ts.SourceFile,
	context: tstl.TransformationContext,
): tstl.VisitorResult<ts.SourceFile> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const exp: any = expression;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	exp.imports.forEach((i: any) => {
		if (i.text.startsWith(".")) return;
		i.text = exp.resolvedModules
			.get(i.text)
			.resolvedFileName.replace(/\.ts$/, "");
	});
	return transformSourceFileNode(expression, context);
}

export const ModuleTransformer: tstl.Plugin = {
	visitors: {
		[ts.SyntaxKind.SourceFile]: transformSourceFile,
	},
};
