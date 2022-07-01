/**
 * Copyright (c) 2021-2022 Huawei Device Co., Ltd.
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

#include "tsUnionType.h"

#include <typescript/checker.h>
#include <ir/astDump.h>

namespace panda::es2panda::ir {

void TSUnionType::Iterate(const NodeTraverser &cb) const
{
    for (auto *it : types_) {
        cb(it);
    }
}

void TSUnionType::Dump(ir::AstDumper *dumper) const
{
    dumper->Add({{"type", "TSUnionType"}, {"types", types_}});
}

void TSUnionType::Compile([[maybe_unused]] compiler::PandaGen *pg) const {}

checker::Type *TSUnionType::Check([[maybe_unused]] checker::Checker *checker) const
{
    std::vector<checker::Type *> types;

    for (auto *it : types_) {
        types.push_back(it->Check(checker));
    }

    return checker->CreateUnionType(std::move(types));
}

}  // namespace panda::es2panda::ir
