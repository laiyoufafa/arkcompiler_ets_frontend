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

#include <ir/expressions/assignmentExpression.h>
#include <ir/expressions/binaryExpression.h>
#include <ir/expressions/memberExpression.h>
#include <ir/expressions/templateLiteral.h>

#include <typescript/checker.h>

namespace panda::es2panda::checker {

bool Checker::InAssignment(const ir::AstNode *node)
{
    const ir::AstNode *parent = node;

    while (parent->Parent()) {
        if (parent->Parent()->IsAssignmentExpression()) {
            return parent->Parent()->AsAssignmentExpression()->Left() == parent;
        }

        if (parent->Parent()->IsBinaryExpression()) {
            const ir::BinaryExpression *binaryExpr = parent->Parent()->AsBinaryExpression();
            return IsAssignmentOperator(binaryExpr->OperatorType()) && binaryExpr->Left() == parent;
        }

        if (parent->Parent()->IsUpdateExpression()) {
            return true;
        }

        parent = parent->Parent();
    }
    return false;
}

bool Checker::IsAssignmentOperator(lexer::TokenType op)
{
    switch (op) {
        case lexer::TokenType::PUNCTUATOR_LESS_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_GREATER_THAN_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MULTIPLY_EQUAL:
        case lexer::TokenType::PUNCTUATOR_EXPONENTIATION_EQUAL:
        case lexer::TokenType::PUNCTUATOR_DIVIDE_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MOD_EQUAL:
        case lexer::TokenType::PUNCTUATOR_MINUS_EQUAL:
        case lexer::TokenType::PUNCTUATOR_LEFT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_UNSIGNED_RIGHT_SHIFT_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_AND_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_OR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_BITWISE_XOR_EQUAL:
        case lexer::TokenType::PUNCTUATOR_PLUS_EQUAL:
        case lexer::TokenType::PUNCTUATOR_SUBSTITUTION:
            return true;
        default:
            return false;
    }
}

Type *Checker::GetBaseTypeOfLiteralType(Type *type)
{
    if (type->IsStringLiteralType()) {
        return GlobalStringType();
    }

    if (type->IsNumberLiteralType()) {
        return GlobalNumberType();
    }

    if (type->IsBooleanLiteralType()) {
        return GlobalBooleanType();
    }

    if (type->IsBigintLiteralType()) {
        return GlobalBigintType();
    }

    if (type->IsUnionType()) {
        std::vector<Type *> &constituentTypes = type->AsUnionType()->ConstituentTypes();
        std::vector<Type *> newConstituentTypes;

        newConstituentTypes.reserve(constituentTypes.size());
        for (auto *it : constituentTypes) {
            newConstituentTypes.push_back(GetBaseTypeOfLiteralType(it));
        }

        return CreateUnionType(std::move(newConstituentTypes));
    }

    return type;
}

bool Checker::IsLiteralType(const Type *type)
{
    if (type->IsBooleanType()) {
        return true;
    }

    if (type->IsUnionType()) {
        std::vector<Type *> constituentTypes = type->AsUnionType()->ConstituentTypes();
        bool result = true;
        for (auto *it : constituentTypes) {
            result &= it->HasTypeFlag(TypeFlag::UNIT);
        }
        return result;
    }

    return type->HasTypeFlag(TypeFlag::UNIT);
}

const ir::AstNode *Checker::FindAncestorGivenByType(const ir::AstNode *node, ir::AstNodeType type)
{
    node = node->Parent();

    while (node->Type() != type) {
        if (node->Parent()) {
            node = node->Parent();
            continue;
        }

        return nullptr;
    }

    return node;
}

void Checker::CheckNonNullType(Type *type, lexer::SourcePosition lineInfo)
{
    if (type->IsNullType()) {
        ThrowTypeError("Object is possibly 'null'.", lineInfo);
    }

    if (type->IsUndefinedType()) {
        ThrowTypeError("Object is possibly 'undefined'.", lineInfo);
    }
}

bool Checker::MaybeTypeOfKind(const Type *type, TypeFlag flags)
{
    if (type->HasTypeFlag(flags)) {
        return true;
    }

    if (type->HasTypeFlag(TypeFlag::UNION_OR_INTERSECTION)) {
        if (type->IsUnionType()) {
            const std::vector<Type *> &constituentTypes = type->AsUnionType()->ConstituentTypes();
            for (auto *it : constituentTypes) {
                if (MaybeTypeOfKind(it, flags)) {
                    return true;
                }
            }
        }
    }

    return false;
}

bool Checker::MaybeTypeOfKind(const Type *type, ObjectType::ObjectTypeKind kind)
{
    if (type->IsObjectType() && type->AsObjectType()->Kind() == kind) {
        return true;
    }

    if (type->HasTypeFlag(TypeFlag::UNION_OR_INTERSECTION)) {
        if (type->IsUnionType()) {
            const std::vector<Type *> &constituentTypes = type->AsUnionType()->ConstituentTypes();
            for (auto *it : constituentTypes) {
                if (MaybeTypeOfKind(it, kind)) {
                    return true;
                }
            }
        }
    }

    return false;
}

bool Checker::IsConstantMemberAccess(const ir::Expression *expr)
{
    switch (expr->Type()) {
        case ir::AstNodeType::IDENTIFIER: {
            return true;
        }
        case ir::AstNodeType::MEMBER_EXPRESSION: {
            bool res = IsConstantMemberAccess(expr->AsMemberExpression()->Object());
            return !expr->AsMemberExpression()->IsComputed()
                       ? res
                       : (res && IsStringLike(expr->AsMemberExpression()->Property()));
        }
        default:
            return false;
    }
}

bool Checker::IsStringLike(const ir::Expression *expr)
{
    if (expr->IsStringLiteral()) {
        return true;
    }

    if (expr->IsTemplateLiteral() && expr->AsTemplateLiteral()->Quasis().empty()) {
        return true;
    }

    return false;
}

void Checker::CheckTruthinessOfType(Type *type, lexer::SourcePosition lineInfo)
{
    if (type->IsVoidType()) {
        ThrowTypeError("An expression of type void cannot be tested for truthiness", lineInfo);
    }
}

}  // namespace panda::es2panda::checker
