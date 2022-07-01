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

#include "booleanType.h"

namespace panda::es2panda::checker {

BooleanType::BooleanType() : Type(TypeFlag::BOOLEAN) {}

void BooleanType::ToString(std::stringstream &ss) const
{
    ss << "boolean";
}

void BooleanType::Identical(TypeRelation *relation, const Type *other) const
{
    if (other->IsBooleanType()) {
        relation->Result(true);
    }
}

void BooleanType::AssignmentTarget(TypeRelation *relation, const Type *source) const
{
    if (source->IsBooleanLiteralType()) {
        relation->Result(true);
    }
}

TypeFacts BooleanType::GetTypeFacts() const
{
    return TypeFacts::BOOLEAN_FACTS;
}

Type *BooleanType::Instantiate([[maybe_unused]] ArenaAllocator *allocator, [[maybe_unused]] TypeRelation *relation,
                               [[maybe_unused]] GlobalTypesHolder *globalTypes)
{
    return this;
}

}  // namespace panda::es2panda::checker
