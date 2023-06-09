#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Copyright (c) 2023-2023 Huawei Device Co., Ltd.
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import os
import stat
import zipfile

import requests
from tqdm import tqdm
import yaml


def get_tool(url):
    print(f"Get RKDevTool from {url}")
    r = requests.get(url, stream=True)
    total = int(r.headers.get('content-length'), 0)
    flags = os.O_WRONLY | os.O_CREAT 
    modes = stat.S_IWUSR | stat.S_IRUSR
    
    with os.fdopen(os.open(".\\RKDevTool.zip", flags, modes), "wb") as f, tqdm(
        desc="RKDevTool.zip",
        total=total,
        unit='iB',
        unit_scale=True,
        unit_divisor=1024,
    ) as bar:
        for byte in r.iter_content(chunk_size=1024):
            size = f.write(byte)
            bar.update(size)
            
    with zipfile.ZipFile(".\\RKDevTool.zip", 'r') as zfile:
        zfile.extractall(path=".\\RKDevTool")


if __name__ == "__main__":
    yl = open(r".\getResource\config.yaml", 'r')
    data = yaml.save_load(yl.read(), Loader=yaml.FullLoader)
    get_tool(data['url_3'])
    yl.close()