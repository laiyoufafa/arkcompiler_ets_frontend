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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_PARAMETER_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_PARAMETER_H

#include "type.h"

namespace panda::es2panda::checker {

class TypeParameter : public Type {
public:
    TypeParameter(Type *constraint, Type *defaultType);

    void ToString(std::stringstream &ss) const override;
    void Identical(TypeRelation *relation, const Type *other) const override;
    void AssignmentTarget(TypeRelation *relation, const Type *source) const override;
    TypeFacts GetTypeFacts() const override;
    Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) override;

    const Type *ConstraintType() const;
    Type *DefaultType();
    Type **DefaultTypeRef();
    void SetDefaultType(Type *type);

private:
    Type *constraint_;
    Type *default_;
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_UNDEFINED_TYPE_H */
