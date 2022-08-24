/*
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

#ifndef ES2PANDA_PARSER_CORE_MODULERECORD_H
#define ES2PANDA_PARSER_CORE_MODULERECORD_H

#include <util/ustring.h>

namespace panda::es2panda::parser {
class SourceTextModuleRecord {
public:
    explicit SourceTextModuleRecord(ArenaAllocator *allocator)
        : allocator_(allocator),
          moduleRequestsMap_(allocator_->Adapter()),
          moduleRequests_(allocator_->Adapter()),
          localExportEntries_(allocator_->Adapter()),
          regularImportEntries_(allocator_->Adapter()),
          namespaceImportEntries_(allocator_->Adapter()),
          starExportEntries_(allocator_->Adapter()),
          indirectExportEntries_(allocator_->Adapter())
    {
    }

    ~SourceTextModuleRecord() = default;
    NO_COPY_SEMANTIC(SourceTextModuleRecord);
    NO_MOVE_SEMANTIC(SourceTextModuleRecord);

    struct ImportEntry {
        int moduleRequestIdx_;
        util::StringView localName_;
        util::StringView importName_;

        ImportEntry(const util::StringView localName, const util::StringView importName, int moduleRequestIdx)
            : moduleRequestIdx_(moduleRequestIdx), localName_(localName), importName_(importName) {}
        ImportEntry(const util::StringView localName, int moduleRequestIdx)
            : moduleRequestIdx_(moduleRequestIdx), localName_(localName) {}
    };

    struct ExportEntry {
        int moduleRequestIdx_;
        util::StringView exportName_;
        util::StringView localName_;
        util::StringView importName_;

        explicit ExportEntry(int moduleRequest) : moduleRequestIdx_(moduleRequest) {}
        ExportEntry(const util::StringView exportName, const util::StringView localName)
            : moduleRequestIdx_(-1), exportName_(exportName), localName_(localName) {}
        ExportEntry(const util::StringView exportName, const util::StringView importName, int moduleRequest)
            : moduleRequestIdx_(moduleRequest), exportName_(exportName)
        {
            importName_ = importName;
        }
    };

    template <typename T, typename... Args>
    T *NewEntry(Args &&... args)
    {
        return allocator_->New<T>(std::forward<Args>(args)...);
    }

    int AddModuleRequest(const util::StringView source);
    void AddImportEntry(ImportEntry *entry);
    void AddStarImportEntry(ImportEntry *entry);
    bool AddLocalExportEntry(ExportEntry *entry);
    bool AddIndirectExportEntry(ExportEntry *entry);
    void AddStarExportEntry(ExportEntry *entry);

    bool CheckImplicitIndirectExport(ExportEntry *exportEntry);
    void CheckImplicitIndirectExport(ImportEntry *importEntry);

    using ModuleRequestList = ArenaVector<util::StringView>;
    using ModuleRequestMap = ArenaMap<const util::StringView, uint32_t>;
    using LocalExportEntryMap = ArenaMultiMap<const util::StringView, ExportEntry *>;
    using RegularImportEntryMap = ArenaMap<const util::StringView, ImportEntry *>;
    using NamespaceImportEntryList = ArenaVector<ImportEntry *>;
    using SpecialExportEntryList = ArenaVector<ExportEntry *>;

    const ArenaVector<util::StringView> &GetModuleRequests() const
    {
        return moduleRequests_;
    }

    const LocalExportEntryMap &GetLocalExportEntries() const
    {
        return localExportEntries_;
    }

    const RegularImportEntryMap &GetRegularImportEntries() const
    {
        return regularImportEntries_;
    }

    const NamespaceImportEntryList &GetNamespaceImportEntries() const
    {
        return namespaceImportEntries_;
    }

    const SpecialExportEntryList &GetStarExportEntries() const
    {
        return starExportEntries_;
    }

    const SpecialExportEntryList &GetIndirectExportEntries() const
    {
        return indirectExportEntries_;
    }

    static constexpr std::string_view DEFAULT_LOCAL_NAME = "*default*";
    static constexpr std::string_view DEFAULT_EXTERNAL_NAME = "default";
    static constexpr std::string_view ANONY_NAMESPACE_NAME = "=ens";

private:
    bool HasDuplicateExport(util::StringView exportName);
    void ConvertLocalExportToIndirect(ImportEntry *importEntry, ExportEntry *exportEntry);

    ArenaAllocator *allocator_;
    ModuleRequestMap moduleRequestsMap_;
    ModuleRequestList moduleRequests_;
    LocalExportEntryMap localExportEntries_;
    RegularImportEntryMap regularImportEntries_;
    NamespaceImportEntryList namespaceImportEntries_;
    SpecialExportEntryList starExportEntries_;
    SpecialExportEntryList indirectExportEntries_;
};
} // namespace panda::es2panda::parser

#endif