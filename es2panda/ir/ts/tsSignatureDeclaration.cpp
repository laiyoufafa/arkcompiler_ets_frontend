/**
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "tsSignatureDeclaration.h"

#include <binder/scope.h>
#include <ir/astDump.h>
#include <ir/ts/tsTypeParameter.h>
#include <ir/ts/tsTypeParameterDeclaration.h>

namespace panda::es2panda::ir {

void TSSignatureDeclaration::Iterate(const NodeTraverser &cb) const
{
    if (typeParams_) {
        cb(typeParams_);
    }

    for (auto *it : params_) {
        cb(it);
    }

    if (returnTypeAnnotation_) {
        cb(returnTypeAnnotation_);
    }
}

void TSSignatureDeclaration::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", (kind_ == TSSignatureDeclaration::TSSignatureDeclarationKind::CALL_SIGNATURE)
                              ? "TSCallSignatureDeclaration"
                              : "TSConstructSignatureDeclaration"},
                 {"params", params_},
                 {"typeParameters", AstDumper::Optional(typeParams_)},
                 {"returnType", AstDumper::Optional(returnTypeAnnotation_)}});
}

void TSSignatureDeclaration::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSSignatureDeclaration::Check([[maybe_unused]] checker::Checker *checker) const
{
    return nullptr;
}

}  // namespace panda::es2panda::ir