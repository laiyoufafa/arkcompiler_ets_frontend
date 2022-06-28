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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_INDEX_INFO_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_INDEX_INFO_H

#include "type.h"

namespace panda::es2panda::checker {

class IndexInfo {
public:
    IndexInfo(Type *type, util::StringView paramName, bool readonly = false);
    ~IndexInfo() = default;
    NO_COPY_SEMANTIC(IndexInfo);
    NO_MOVE_SEMANTIC(IndexInfo);

    Type *InfoType();
    const Type *InfoType() const;
    bool Readonly() const;
    void SetInfoType(Type *type);
    const util::StringView &ParamName();

    void ToString(std::stringstream &ss, bool numIndex = true) const;
    void Identical(TypeRelation *relation, const IndexInfo *other) const;
    void AssignmentTarget(TypeRelation *relation, const IndexInfo *source) const;
    IndexInfo *Copy(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes);

private:
    Type *type_;
    util::StringView paramName_;
    bool readonly_;
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_INDEX_INFO_H */
