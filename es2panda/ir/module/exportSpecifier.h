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

#ifndef ES2PANDA_IR_MODULE_EXPORT_SPECIFIER_H
#define ES2PANDA_IR_MODULE_EXPORT_SPECIFIER_H

#include <ir/statement.h>

namespace panda::es2panda::compiler {
class PandaGen;
}  // namespace panda::es2panda::compiler

namespace panda::es2panda::checker {
class Checker;
class Type;
}  // namespace panda::es2panda::checker

namespace panda::es2panda::ir {

class Identifier;

class ExportSpecifier : public Statement {
public:
    explicit ExportSpecifier(Identifier *local, Identifier *exported)
        : Statement(AstNodeType::EXPORT_SPECIFIER), local_(local), exported_(exported)
    {
    }

    const Identifier *Local() const
    {
        return local_;
    }

    const Identifier *Exported() const
    {
        return exported_;
    }

    void Iterate(const NodeTraverser &cb) const override;
    void Dump(ir::AstDumper *dumper) const override;
    void Compile([[maybe_unused]] compiler::PandaGen *pg) const override;
    checker::Type *Check([[maybe_unused]] checker::Checker *checker) const override;

private:
    Identifier *local_;
    Identifier *exported_;
};

}  // namespace panda::es2panda::ir

#endif
