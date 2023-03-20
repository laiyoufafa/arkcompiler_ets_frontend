/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Test scenario: modify lexenv, es2abc can specify and throw error

function a() {
    var c = 9;
    for (let i = 1; i < 10; i++){
        function b() {
            return i + c;
        }
    }

    for (let j = 1; j < 10; j++){   // add a for loop that use 'j' as lexenv, function a's lexenv changed
        function d() {
            return j + c;
        }
    }
}