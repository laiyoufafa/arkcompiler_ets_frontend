/**
 * Copyright (c) 2022 Huawei Device Co., Ltd.
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

#include "assemblyLabelProto.h"

namespace panda::proto {
void Label::Serialize(const panda::pandasm::Label &label, proto_panda::Label &protoLabel)
{
    protoLabel.set_name(label.name);
    const auto &fileLocation = label.file_location;
    if (fileLocation.has_value()) {
        auto *protoLocation = protoLabel.mutable_file_location();
        FileLocation::Serialize(fileLocation.value(), *protoLocation);
    }
}

void Label::Deserialize(const proto_panda::Label &protoLabel, panda::pandasm::Label &label)
{
    label.name = protoLabel.name();
    if (protoLabel.has_file_location()) {
        proto_panda::FileLocation protoLocation = protoLabel.file_location();
        FileLocation::Deserialize(protoLocation, label.file_location.value());
    }
}
} // panda::proto
