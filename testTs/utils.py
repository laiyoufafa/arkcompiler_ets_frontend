#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Copyright (c) 2022 Huawei Device Co., Ltd.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Description: Use ark to execute test 262 test suite
"""

import os
import datetime
import shutil
import difflib
from config import *
import subprocess
import json


def command_os(order):
    subprocess.run(order,shell=True)

def mk_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
    
def git_checkout(git_brash):
    command_os(f'git checkout {git_brash}')

def remove_dir(path):
    if os.path.exists(path):
        shutil.rmtree(path)

def remove_file(path):
    if os.path.exists(path):
        os.remove(path)

def clean_file(path):
    with open(path,'w') as f:
        f.write('')

def read_file(path):
    content = []
    with open(path,'r') as f:
        content = f.readlines()
    
    return content

def write_file(path,content):
    with open(path,'w') as f:
        f.write(content)

def write_append(path,content):
    with open(path,'a+') as f:
        f.write(content)

def move_file(srcfile, dstfile):
    subprocess.getstatusoutput("mv %s %s" % (srcfile, dstfile))

def git_clone(git_url, code_dir):
    cmd = ['git', 'clone', git_url, code_dir]
    ret = run_cmd_cwd(cmd)
    assert not ret, f"\n error: Cloning '{git_url}' failed."

def git_checkout(git_bash, cwd):
    cmd = ['git', 'checkout', git_bash]
    ret = run_cmd_cwd(cmd, cwd)
    assert not ret, f"\n error: git checkout '{git_bash}' failed."


def git_apply(patch_file, cwd):
    cmd = ['git', 'apply', patch_file]
    ret = run_cmd_cwd(cmd, cwd)
    assert not ret, f"\n error: Failed to apply '{patch_file}'"


def git_clean(cwd):
    cmd = ['git', 'checkout', '--', '.']
    run_cmd_cwd(cmd, cwd)

def current_time():
    return datetime.datetime.now()

class Command():
    def __init__(self, cmd):
        self.cmd = cmd

    def run(self):
        LOGGING.debug("command: " + self.cmd)
        out = os.popen(self.cmd).read()
        LOGGING.info(out)
        return out

def run_cmd(command):
    cmd = Command(command)
    return cmd.run()

def excuting_npm_install(args):
    ark_frontend_tool = os.path.join(DEFAULT_ARK_FRONTEND_TOOL)
    if args.ark_frontend_tool:
        ark_frontend_tool = os.path.join(args.ark_frontend_tool)

    ts2abc_build_dir = os.path.join(os.path.dirname(
        os.path.realpath(ark_frontend_tool)), "..")
    if os.path.exists(os.path.join(ts2abc_build_dir, "package.json")):
        npm_install(ts2abc_build_dir)
    elif os.path.exists(os.path.join(ts2abc_build_dir, "..", "package.json")):
        npm_install(os.path.join(ts2abc_build_dir, ".."))
        
def npm_install(cwd):
    try:
        os.chdir(cwd)
        command_os('npm install')
        os.chdir(WORK_PATH)
    except Exception as e:
        print(e)
