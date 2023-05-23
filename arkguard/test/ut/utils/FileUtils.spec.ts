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

import {describe, it} from 'mocha';
import {FileUtils} from '../../../src/utils/FileUtils';
import {assert} from 'chai';

describe('Tester Cases for <FileUtils>.', function () {
  /** test for readFile */
  it('Tester: <file not found> case for FileUtils#readFile', function () {
    let path = '/user/local/tester';
    assert.strictEqual(FileUtils.readFile(path), undefined);
  });

  it('Tester: <read file content.> case for FileUtils#readFile', function () {
    let path = 'test/ut/utils/demo.txt';
    assert.strictEqual(FileUtils.readFile(path), 'hello world!');
  });

  /** test for readFileAsJson */
  it('Tester: <read file as json.> case for FileUtils#readFileAsJson', function () {
    let path = 'test/ut/utils/demo.json';
    let obj = FileUtils.readFileAsJson(path);
    assert.strictEqual(obj?.mCompact, true);
  });

  it('Tester: <file not found.> case for FileUtils#readFileAsJson', function () {
    let path = 'test/utils/demo_not_found.json';
    let obj = FileUtils.readFileAsJson(path);
    assert.strictEqual(obj, undefined);
  });

  it('Tester: <error json format.> case for FileUtils#readFileAsJson', function () {
    let path = 'test/utils/error_json.txt';
    let obj = FileUtils.readFileAsJson(path);
    assert.strictEqual(obj, undefined);
  });

  /** test for getFileName */
  it('Tester: <get file name with undefined input.> case for FileUtils#getFileName', function () {
    let path = null;
    assert.strictEqual(FileUtils.getFileName(path), undefined);

    path = undefined;
    assert.strictEqual(FileUtils.getFileName(path), undefined);
  });

  it('Tester: <get relative file fullname.> case for FileUtils#getFileName', function () {
    let path = 'resources/configs/user_profile.json';
    assert.strictEqual(FileUtils.getFileName(path), 'user_profile.json');
  });

  it('Tester: <get windows file fullname.> case for FileUtils#getFileName', function () {
    let path = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5\\user_profile.json';
    assert.strictEqual(FileUtils.getFileName(path), 'user_profile.json');
  });

  it('Tester: <get single file fullname.> case for FileUtils#getFileName', function () {
    let path = 'user_profile.json';
    assert.strictEqual(FileUtils.getFileName(path), 'user_profile.json');
  });

  /** test for getFileExtension */
  it('Tester: <get file extension with undefined input.> case for FileUtils#getFileExtension', function () {
    let path = null;
    assert.strictEqual(FileUtils.getFileExtension(path), undefined);

    path = undefined;
    assert.strictEqual(FileUtils.getFileExtension(path), undefined);
  });

  it('Tester: <get file extension with input not contain point.> case for FileUtils#getFileExtension', function () {
    let path = 'resources/configs/user_profile';
    assert.strictEqual(FileUtils.getFileExtension(path), undefined);
  });

  it('Tester: <get file extension with dir contain point.> case for FileUtils#getFileExtension', function () {
    let path = 'resources/configs.dir/user_profile.conf';
    assert.strictEqual(FileUtils.getFileExtension(path), 'conf');
  });

  it('Tester: <get file extension.> case for FileUtils#getFileExtension', function () {
    let path = 'resources/configs/user_profile.json';
    assert.strictEqual(FileUtils.getFileExtension(path), 'json');
  });

  it('Tester: <get file extension with point end.> case for FileUtils#getFileExtension', function () {
    let path = 'resources/configs/user_profile.';
    assert.strictEqual(FileUtils.getFileExtension(path), '');
  });

  /** test for writeFile */
  it('Tester: <write file test.> case for FileUtils#writeFile', function () {
    let path = 'test/ut/utils/write_demo.txt';
    let content = 'hello';
    FileUtils.writeFile(path, content);

    const fileContent = FileUtils.readFile(path);
    assert.strictEqual(fileContent, content);
  });

  /** test for getPrefix */
  it('Tester: <get prefix test.> case for FileUtils#getPrefix', function () {
    let path = 'test/utils/write_demo.txt';
    let prefix = 'test/utils/';

    assert.strictEqual(FileUtils.getPrefix(path), prefix);
  });

  it('Tester: <get windows prefix test.> case for FileUtils#getPrefix', function () {
    let path = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5\\us';
    let prefix = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5\\';

    assert.strictEqual(FileUtils.getPrefix(path), prefix);
  });

  it('Tester: <get no prefix test.> case for FileUtils#getPrefix', function () {
    let path = 'D:';
    let prefix = undefined;

    assert.strictEqual(FileUtils.getPrefix(path), prefix);
  });

  /** test for getPathWithoutPrefix */
  it('Tester: <get path without prefix no prefix test.> case for FileUtils#getPathWithoutPrefix', function () {
    let path = 'D:';
    let prefix = 'D:\\HuaweiApp';

    assert.strictEqual(FileUtils.getPathWithoutPrefix(path, prefix), path);
  });

  it('Tester: <get path without prefix contain prefix test.> case for FileUtils#getPathWithoutPrefix', function () {
    let path = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5';
    let prefix = 'D:\\HuaweiApp';

    assert.strictEqual(FileUtils.getPathWithoutPrefix(path, prefix), '\\ohsdk\\ets\\3.2.7.5');
  });

  it('Tester: <get path without prefix path and prefix equal test.> case for FileUtils#getPathWithoutPrefix', function () {
    let path = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5';
    let prefix = 'D:\\HuaweiApp\\ohsdk\\ets\\3.2.7.5';

    assert.strictEqual(FileUtils.getPathWithoutPrefix(path, prefix), '');
  });
});
