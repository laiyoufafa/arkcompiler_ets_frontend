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

#ifndef ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_H
#define ES2PANDA_COMPILER_TYPESCRIPT_TYPES_TYPE_H

#include <typescript/types/typeFacts.h>
#include <typescript/types/typeMapping.h>
#include <typescript/types/typeRelation.h>

#include <macros.h>
#include <sstream>
#include <variant>

namespace panda::es2panda::binder {
class Variable;
}  // namespace panda::es2panda::binder

namespace panda::es2panda::checker {

class ObjectDescriptor;
class GlobalTypesHolder;

#define DECLARE_TYPENAMES(typeFlag, typeName) class typeName;
TYPE_MAPPING(DECLARE_TYPENAMES)
#undef DECLARE_TYPENAMES

class Type {
public:
    explicit Type(TypeFlag flag);
    NO_COPY_SEMANTIC(Type);
    NO_MOVE_SEMANTIC(Type);

    virtual ~Type() = default;

#define TYPE_IS_CHECKS(typeFlag, typeName) \
    bool Is##typeName() const               \
    {                                        \
        return HasTypeFlag(typeFlag);       \
    }
    TYPE_MAPPING(TYPE_IS_CHECKS)
#undef DECLARE_IS_CHECKS

#define TYPE_AS_CASTS(typeFlag, typeName)               \
    typeName *As##typeName()                            \
    {                                                     \
        ASSERT(Is##typeName());                          \
        return reinterpret_cast<typeName *>(this);       \
    }                                                     \
    const typeName *As##typeName() const                \
    {                                                     \
        ASSERT(Is##typeName());                          \
        return reinterpret_cast<const typeName *>(this); \
    }
    TYPE_MAPPING(TYPE_AS_CASTS)
#undef TYPE_AS_CASTS

    TypeFlag TypeFlags() const;
    bool HasTypeFlag(TypeFlag typeFlag) const;
    void AddTypeFlag(TypeFlag typeFlag);
    void RemoveTypeFlag(TypeFlag typeFlag);
    uint64_t Id() const;
    void SetVariable(binder::Variable *variable);
    binder::Variable *Variable();
    const binder::Variable *Variable() const;

    virtual void ToString(std::stringstream &ss) const = 0;
    virtual void ToStringAsSrc(std::stringstream &ss) const;
    virtual TypeFacts GetTypeFacts() const = 0;

    virtual void Identical(TypeRelation *relation, const Type *other) const;
    virtual void AssignmentTarget(TypeRelation *relation, const Type *source) const = 0;
    virtual bool AssignmentSource(TypeRelation *relation, const Type *target) const;
    virtual void Compare(TypeRelation *relation, const Type *other) const;

    virtual Type *Instantiate(ArenaAllocator *allocator, TypeRelation *relation, GlobalTypesHolder *globalTypes) = 0;

protected:
    TypeFlag typeFlags_;
    binder::Variable *variable_;  // Variable associated with the type if any
    uint64_t id_;
};

}  // namespace panda::es2panda::checker

#endif /* TYPESCRIPT_TYPES_TYPE_H */
