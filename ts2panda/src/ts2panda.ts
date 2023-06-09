/*
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

import { CmdOptions } from "./cmdOptions";
import { SourceTextModuleRecord } from "./ecmaModule";
import {
    Imm,
    IRNode,
    IRNodeKind,
    Label,
    OperandType,
    VReg
} from "./irnodes";
import { LOGD } from "./log";
import { PandaGen } from "./pandagen";
import {
    CatchTable,
    DeclaredSymbol2Type,
    ExportedSymbol2Type,
    Function,
    Ins,
    IndirectExportEntry,
    LocalExportEntry,
    ModuleRecord,
    NamespaceImportEntry,
    RegularImportEntry,
    Signature
} from "./pandasm";
import { generateCatchTables } from "./statement/tryStatement";
import {
    escapeUnicode,
    isRangeInst,
    getRangeStartVregPos
} from "./base/util";
import { LiteralBuffer } from "./base/literal";
import { CompilerDriver } from "./compilerDriver";
import { ModuleScope } from "./scope";
import { getRecordTypeFlag } from "./base/util";
import { TypeSummary } from "./base/typeSystem";
import { TypeRecorder } from "./typeRecorder";

const dollarSign: RegExp = /\$/g;

const JsonType = {
    "function": 0,
    "record": 1,
    "string": 2,
    "literal_arr": 3,
    "module": 4,
    "options": 5,
    'type_info': 6
};
export class Ts2Panda {
    static strings: Set<string> = new Set();
    static labelPrefix = "L_";
    static jsonString: string = "";
    static moduleRecordlist: Array<ModuleRecord> = [];

    constructor() {
    }

    static getFuncSignature(pg: PandaGen): Signature {
        return new Signature(pg.getParametersCount());
    }

    static getFuncInsnsAndRegsNum(pg: PandaGen) {
        let insns: Array<Ins> = [];
        let labels: Array<string> = [];

        pg.getInsns().forEach((insn: IRNode) => {
            let insOpcode = insn.kind >= IRNodeKind.VREG ? undefined : insn.kind;
            let insRegs: Array<number> = [];
            let insIds: Array<string> = [];
            let insImms: Array<number> = [];
            let insLabel: string = "";

            if (insn instanceof Label) {
                insLabel = Ts2Panda.labelPrefix + insn.id;
                labels.push(insLabel);
            } else if (isRangeInst(insn)) {
                // For DynRange insn we only pass the first vreg of continuous vreg array
                let operands = insn.operands;
                insImms.push((<Imm>operands[0]).value);
                insRegs.push((<VReg>operands[1]).num);
                if (getRangeStartVregPos(insn) == 2) {
                    insRegs.push((<VReg>operands[2]).num);
                }
            } else {
                insn.operands.forEach((operand: OperandType) => {
                    if (operand instanceof VReg) {
                        let v = <VReg>operand;
                        insRegs.push(v.num);
                    } else if (operand instanceof Imm) {
                        let imm = <Imm>operand;
                        insImms.push(imm.value);
                    } else if (typeof (operand) === "string") {
                        insIds.push(operand);
                        Ts2Panda.strings.add(operand);
                    } else if (operand instanceof Label) {
                        let labelName = Ts2Panda.labelPrefix + operand.id;
                        insIds.push(labelName);
                    }
                });
            }

            insn.debugPosInfo.ClearNodeKind();

            insns.push(new Ins(
                insOpcode,
                insRegs.length == 0 ? undefined : insRegs,
                insIds.length == 0 ? undefined : insIds,
                insImms.length == 0 ? undefined : insImms,
                insLabel === "" ? undefined : insLabel,
                insn.debugPosInfo,
            ));
        });

        return {
            insns: insns,
            regsNum: (pg.getTotalRegsNum() - pg.getParametersCount()),
            labels: labels.length == 0 ? undefined : labels
        };
    }

    static dumpStringsArray(ts2abc: any) {
        let strings_arr = Array.from(Ts2Panda.strings);

        let strObject = {
            "t": JsonType.string,
            "s": strings_arr
        }

        let jsonStrUnicode = escapeUnicode(JSON.stringify(strObject, null, 2));
        jsonStrUnicode = "$" + jsonStrUnicode.replace(dollarSign, '#$') + "$";
        if (CmdOptions.isEnableDebugLog()) {
            Ts2Panda.jsonString += jsonStrUnicode;
        }
        ts2abc.stdio[3].write(jsonStrUnicode + '\n');
    }

    static dumpTypeLiteralArrayBuffer() {
        let literalArrays = PandaGen.getLiteralArrayBuffer();
        let countType: LiteralBuffer = literalArrays[0];
        let jsonTypeString: string = ""
        let typeCount = countType.getLiteral(1)?.getValue();
        if (typeCount) {
            for (let i = 0; i < typeCount; i++) {
                jsonTypeString += escapeUnicode(JSON.stringify(literalArrays[1+i], null, 2));
            }
        }
        return jsonTypeString;
    }

    static dumpConstantPool(ts2abc: any): void {
        let literalArrays = PandaGen.getLiteralArrayBuffer();
        if (CmdOptions.enableTypeLog()) {
            console.log("-------- LiteralArrayBuffer --------");
            for (let e of PandaGen.getLiteralArrayBuffer()) {
                console.log(JSON.parse(JSON.stringify(e)));
            }
        }

        literalArrays.forEach(function(literalArray) {
            let literalArrayObject = {
                "t": JsonType.literal_arr,
                "lit_arr": literalArray
            }
            let jsonLiteralArrUnicode = escapeUnicode(JSON.stringify(literalArrayObject, null, 2));
            jsonLiteralArrUnicode = "$" + jsonLiteralArrUnicode.replace(dollarSign, '#$') + "$";
            if (CmdOptions.isEnableDebugLog()) {
                Ts2Panda.jsonString += jsonLiteralArrUnicode;
            }
            ts2abc.stdio[3].write(jsonLiteralArrUnicode + '\n');
        });
    }

    static dumpCmdOptions(ts2abc: any): void {
        let options = {
            "t": JsonType.options,
            "module_mode": CmdOptions.isModules(),
            "debug_mode": CmdOptions.isDebugMode(),
            "log_enabled": CmdOptions.isEnableDebugLog(),
            "opt_level": CmdOptions.getOptLevel(),
            "opt_log_level": CmdOptions.getOptLogLevel()
        };
        let jsonOpt = JSON.stringify(options, null, 2);
        jsonOpt = "$" + jsonOpt.replace(dollarSign, '#$') + "$";
        if (CmdOptions.isEnableDebugLog()) {
            Ts2Panda.jsonString += jsonOpt;
        }
        ts2abc.stdio[3].write(jsonOpt + '\n');
    }

    // @ts-ignore
    static dumpPandaGen(pg: PandaGen, ts2abc: any, recordType?: boolean): void {
        let funcName = pg.internalName;
        let funcSignature = Ts2Panda.getFuncSignature(pg);
        let funcInsnsAndRegsNum = Ts2Panda.getFuncInsnsAndRegsNum(pg);
        let sourceFile = pg.getSourceFileDebugInfo();
        let callType = pg.getCallType();
        let typeRecord = pg.getLocals();
        let typeInfo = undefined;
        let exportedSymbol2Types: undefined | Array<ExportedSymbol2Type> = undefined;
        let declaredSymbol2Types: undefined | Array<DeclaredSymbol2Type> = undefined;
        if (CmdOptions.needRecordType() && CompilerDriver.isTsFile) {
            typeInfo = new Array<number>();
            typeRecord.forEach((vreg) => {
                typeInfo.push(vreg.getTypeIndex());
                if (CmdOptions.enableTypeLog()) {
                    console.log("---------------------------------------");
                    console.log("- vreg name:", vreg.getVariableName());
                    console.log("- vreg local num:", vreg.num);
                    console.log("- vreg type:", vreg.getTypeIndex());
                }
            });

            if (funcName == "func_main_0") {
                let exportedTypes = PandaGen.getExportedTypes();
                let declareddTypes = PandaGen.getDeclaredTypes();
                if (exportedTypes.size != 0) {
                    exportedSymbol2Types = new Array<ExportedSymbol2Type>();
                    exportedTypes.forEach((type: number, symbol: string) => {
                        let exportedSymbol2Type = new ExportedSymbol2Type(symbol, type);
                        exportedSymbol2Types.push(exportedSymbol2Type);
                    });
                }
                if (declareddTypes.size != 0) {
                    declaredSymbol2Types = new Array<DeclaredSymbol2Type>();
                    declareddTypes.forEach((type: number, symbol: string) => {
                        let declaredSymbol2Type = new DeclaredSymbol2Type(symbol, type);
                        declaredSymbol2Types.push(declaredSymbol2Type);
                    });
                }
            }
        }

        if (pg.getScope() instanceof ModuleScope) {
            Ts2Panda.moduleRecordlist.push(
                makeModuleRecord((<ModuleScope>pg.getScope()).module())
            );
        }

        let variables, sourceCode;
        if (CmdOptions.isDebugMode()) {
            variables = pg.getVariableDebugInfoArray();
            sourceCode = pg.getSourceCodeDebugInfo();
        } else {
            variables = undefined;
            sourceCode = undefined;
        }

        let catchTableArr;
        let catchTables = generateCatchTables(pg.getCatchMap());
        if (!catchTables) {
            catchTableArr = undefined;
        } else {
            catchTableArr = [];
            catchTables.forEach((catchTable) => {
                let catchBeginLabel = catchTable.getCatchBeginLabel();
                let labelPairs = catchTable.getLabelPairs();
                labelPairs.forEach((labelPair) => {
                    catchTableArr.push(new CatchTable(
                        Ts2Panda.labelPrefix + labelPair.getBeginLabel().id,
                        Ts2Panda.labelPrefix + labelPair.getEndLabel().id,
                        Ts2Panda.labelPrefix + catchBeginLabel.id
                    ));
                });
            });
        }

        let func = new Function(
            funcName,
            funcSignature,
            funcInsnsAndRegsNum.regsNum,
            funcInsnsAndRegsNum.insns,
            funcInsnsAndRegsNum.labels,
            variables,
            catchTableArr,
            sourceFile,
            sourceCode,
            callType,
            typeInfo,
            exportedSymbol2Types,
            declaredSymbol2Types
        );

        LOGD(func);

        let funcObject = {
            "t": JsonType.function,
            "fb": func
        }
        let jsonFuncUnicode = escapeUnicode(JSON.stringify(funcObject, null, 2));
        jsonFuncUnicode = "$" + jsonFuncUnicode.replace(dollarSign, '#$') + "$";
        if (CmdOptions.isEnableDebugLog()) {
            Ts2Panda.jsonString += jsonFuncUnicode;
        }
        ts2abc.stdio[3].write(jsonFuncUnicode + '\n');
    }

    static dumpModuleRecords(ts2abc: any): void {
        Ts2Panda.moduleRecordlist.forEach(function(module){
            let moduleObject = {
                "t": JsonType.module,
                "mod": module
            };
            let jsonModuleUnicode = escapeUnicode(JSON.stringify(moduleObject, null, 2));
            jsonModuleUnicode = "$" + jsonModuleUnicode.replace(dollarSign, '#$') + "$";
            if (CmdOptions.isEnableDebugLog()) {
                Ts2Panda.jsonString += jsonModuleUnicode;
            }
            ts2abc.stdio[3].write(jsonModuleUnicode + '\n');
        });
    }

    static dumpTypeInfoRecord(ts2abc: any, recordType: boolean): void {
        let enableTypeRecord = getRecordTypeFlag(recordType);
        let typeSummaryIndex = 0;
        if (enableTypeRecord) {
            typeSummaryIndex = TypeRecorder.getInstance().getTypeSummaryIndex();
        }
        let typeInfo = {
            'tf': enableTypeRecord,
            'tsi': typeSummaryIndex
        }
        let typeInfoObject = {
            't': JsonType.type_info,
            'ti': typeInfo
        };
        let jsonModuleUnicode = escapeUnicode(JSON.stringify(typeInfoObject, null, 2));
        jsonModuleUnicode = "$" + jsonModuleUnicode.replace(dollarSign, '#$') + "$";
        if (CmdOptions.isEnableDebugLog()) {
            Ts2Panda.jsonString += jsonModuleUnicode;
        }
        ts2abc.stdio[3].write(jsonModuleUnicode + '\n');
    }

    static clearDumpData() {
        Ts2Panda.strings.clear();
        Ts2Panda.jsonString = "";
        Ts2Panda.moduleRecordlist = [];
    }
}

function makeModuleRecord(sourceTextModule: SourceTextModuleRecord): ModuleRecord {
    let moduleRecord = new ModuleRecord();
    moduleRecord.moduleName = sourceTextModule.getModuleName();

    moduleRecord.moduleRequests = [...sourceTextModule.getModuleRequests()];

    sourceTextModule.getRegularImportEntries().forEach(e => {
        moduleRecord.regularImportEntries.push(new RegularImportEntry(e.localName!, e.importName!, e.moduleRequest!));
    });

    sourceTextModule.getNamespaceImportEntries().forEach(e => {
        moduleRecord.namespaceImportEntries.push(new NamespaceImportEntry(e.localName!, e.moduleRequest!));
    });

    sourceTextModule.getLocalExportEntries().forEach(entries => {
        entries.forEach(e => {
            moduleRecord.localExportEntries.push(new LocalExportEntry(e.localName!, e.exportName!));
        });
    });

    sourceTextModule.getIndirectExportEntries().forEach(e => {
        moduleRecord.indirectExportEntries.push(new IndirectExportEntry(e.exportName!, e.importName!, e.moduleRequest!));
    });

    sourceTextModule.getStarExportEntries().forEach(e => {
        moduleRecord.starExportEntries.push(e.moduleRequest!);
    });

    return moduleRecord;
}
