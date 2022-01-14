/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as ts from "typescript";
import { CmdOptions } from "./cmdOptions";
import { CompilerDriver } from "./compilerDriver";
import * as diag from "./diagnostic";
import { LOGD, LOGE } from "./log";
import { Pass } from "./pass";
import { CacheExpander } from "./pass/cacheExpander";
import { ICPass } from "./pass/ICPass";
import { RegAlloc } from "./regAllocator";
import { setGlobalStrict, setGlobalDeclare, isGlobalDeclare } from "./strictMode";
import { TypeChecker } from "./typeChecker";
import { TypeRecorder } from "./typeRecorder";
import jshelpers = require("./jshelpers");
import path = require("path");

function checkIsGlobalDeclaration(sourceFile: ts.SourceFile) {
    for (let statement of sourceFile.statements) {
        if (statement.modifiers) {
            for (let modifier of statement.modifiers) {
                if (modifier.kind === ts.SyntaxKind.ExportKeyword) {
                    return false;
                }
            }
        } else if (statement.kind === ts.SyntaxKind.ExportAssignment) {
            return false;
        } else if (statement.kind === ts.SyntaxKind.ImportKeyword || statement.kind === ts.SyntaxKind.ImportDeclaration) {
            return false;
        }
    }
    return true;
}

function generateDTs(node: ts.SourceFile, options: ts.CompilerOptions) {
    let outputBinName = getOutputBinName(node);
    let compilerDriver = new CompilerDriver(outputBinName);
    setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, options));
    if (CmdOptions.isVariantBytecode()) {
        LOGD("variant bytecode dump");
        let passes: Pass[] = [
            new CacheExpander(),
            new ICPass(),
            new RegAlloc()
        ];
        compilerDriver.setCustomPasses(passes);
    }
    compilerDriver.compile(node);
    compilerDriver.showStatistics();
}

function main(fileNames: string[], options: ts.CompilerOptions) {
    let program = ts.createProgram(fileNames, options);
    let typeChecker = TypeChecker.getInstance();
    typeChecker.setTypeChecker(program.getTypeChecker());

    if (CmdOptions.needRecordDtsType()) {
        for (let sourceFile of program.getSourceFiles()) {
            if (sourceFile.isDeclarationFile && !program.isSourceFileDefaultLibrary(sourceFile)) {
                setGlobalDeclare(checkIsGlobalDeclaration(sourceFile));
                generateDTs(sourceFile, options);
            }
        }
    }

    let emitResult = program.emit(
        undefined,
        undefined,
        undefined,
        undefined,
        {
            before: [
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName);
                        compilerDriver.compileForSyntaxCheck(node);
                        return node;
                    }
                }
            ],
            after: [
                (ctx: ts.TransformationContext) => {
                    return (node: ts.SourceFile) => {
                        if (ts.getEmitHelpers(node)) {
                            const printer: ts.Printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
                            const text: string = printer.printNode(ts.EmitHint.Unspecified, node, node);
                            let newNode = ts.createSourceFile(node.fileName, text, options.target!);
                            node = newNode;
                        }
                        let outputBinName = getOutputBinName(node);
                        let compilerDriver = new CompilerDriver(outputBinName);
                        setGlobalStrict(jshelpers.isEffectiveStrictModeSourceFile(node, options));
                        if (CmdOptions.isVariantBytecode()) {
                            LOGD("variant bytecode dump");
                            let passes: Pass[] = [
                                new CacheExpander(),
                                new ICPass(),
                                new RegAlloc()
                            ];
                            compilerDriver.setCustomPasses(passes);
                        }
                        compilerDriver.compile(node);
                        compilerDriver.showStatistics();
                        return node;
                    }
                }
            ]
        }
    );

    let allDiagnostics = ts
        .getPreEmitDiagnostics(program)
        .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
        diag.printDiagnostic(diagnostic);
    });
}

function getOutputBinName(node: ts.SourceFile) {
    let outputBinName = CmdOptions.getOutputBinName();
    let fileName = node.fileName.substring(0, node.fileName.lastIndexOf('.'));
    let inputFileName = CmdOptions.getInputFileName();
    if (/^win/.test(require('os').platform())) {
        var inputFileTmps = inputFileName.split(path.sep);
        inputFileName = path.posix.join(...inputFileTmps);
    }

    if (fileName != inputFileName) {
        outputBinName = fileName + ".abc";
    }
    return outputBinName;
}

namespace Compiler {
    export namespace Options {
        export let Default: ts.CompilerOptions = {
            outDir: "../tmp/build",
            allowJs: true,
            noEmitOnError: true,
            noImplicitAny: true,
            target: ts.ScriptTarget.ES2015,
            module: ts.ModuleKind.ES2015,
            strictNullChecks: true,
            skipLibCheck: true,
            alwaysStrict: true
        };
    }
}

function run(args: string[], options?: ts.CompilerOptions): void {
    let parsed = CmdOptions.parseUserCmd(args);
    if (!parsed) {
        return;
    }

    if (options) {
        if (!((parsed.options.project) || (parsed.options.build))) {
            parsed.options = options;
        }
    }
    try {
        let files: string[] = parsed.fileNames;
        main(files.concat(CmdOptions.getIncludedFiles()), parsed.options);
    } catch (err) {
        if (err instanceof diag.DiagnosticError) {
            let diagnostic = diag.getDiagnostic(err.code);
            if (diagnostic != undefined) {
                let diagnosticLog = diag.createDiagnostic(err.file, err.irnode, diagnostic, ...err.args);
                diag.printDiagnostic(diagnosticLog);
            }
        } else if (err instanceof SyntaxError) {
            LOGE(err.name, err.message);
        } else {
            throw err;
        }
    }
}

run(process.argv.slice(2), Compiler.Options.Default);
global.gc();
