# ets_frontend <a name="EN-US_TOPIC_0000001137330686"></a>

- [ets_frontend <a name="EN-US_TOPIC_0000001137330686"></a>](#ets_frontend-)
  - [Introduction<a name="section11660541593"></a>](#introduction)
  - [Directory Structure<a name="section161941989596"></a>](#directory-structure)
  - [Build<a name="section0446154755015"></a>](#Build)
    - [Usage Guidelines<a name="section33105542504"></a>](#usage-guidelines)
  - [Repositories Involved<a name="section1371113476307"></a>](#repositories-involved)

## Introduction<a name="section11660541593"></a>

ets_frontend is a front-end tool in the ARK Runtime Subsystem. It converts JavaScript(JS) files into ARK bytecode files.

For more information, see: [ARK Runtime Subsystem](https://gitee.com/openharmony/docs/blob/master/en/readme/ARK-Runtime-Subsystem.md).

## Directory Structure<a name="section161941989596"></a>

```
/arkcompiler/ets_frontend/
├── test262            # scripts for configuration and running Test262
├── testTs             # system test cases
├── es2panda
    ├── aot            # logical entry
    ├── binder         # info binding
    ├── compiler       # compiling logic
    ├── ir             # Bytecode generation
    ├── lexer          # lexical analysis
    ├── parser         # syntax parsing, AST generation
    ├── scripts        # script directory
    ├── test           # test directory
    ├── typescript     # typescript support
    └── util           # tool directory
├── ts2panda
    ├── scripts        # dependency scripts
    ├── src            # source code directory
    ├── templates      # ruby templates
    ├── tests          # unit test cases
    ├── tools          # tools provided by ts2abc
    └── ts2abc         # ts2abc source code

```

## Build<a name="section0446154755015"></a>

ets_frontend uses the command line interaction mode and converts JS code into ARK bytecode files that can be run on an ARK runtime system. ets_frontend supports Windows, Linux, and macOS. Front-end tools, converting JS source code into ARK bytecode, can be built by specifying the `--build-target` with `ets_frontend_build` on Linux.

```
$ ./build.sh --product-name hispark_taurus_standard --build-target ets_frontend_build
```

### Usage Guidelines<a name="section33105542504"></a>

#### Usage For Es2panda ####

convert JS to ARK bytecode via es2abc

```
$ cd out/hispark_taurus/clang_x64/ark/ark/
$ ./es2abc [options] file.js
```

If no parameter is specified for  **\[options\]**, an ARK binary file is generated by default.

<a name="table2035444615599"></a>

<table><thead align="left"><tr id="row535415467591"><th class="cellrowborder" valign="top" width="12.898710128987101%" id="mcps1.1.6.1.1"><p id="p13354134619595"><a name="p13354134619595"></a><a name="p13354134619595"></a>Option</p>
</th>
<th class="cellrowborder" valign="top" width="19.33806619338066%" id="mcps1.1.6.1.3"><p id="p157281281906"><a name="p157281281906"></a><a name="p157281281906"></a>Description</p>
</th>
<th class="cellrowborder" valign="top" width="25.82741725827417%" id="mcps1.1.6.1.4"><p id="p103276335016"><a name="p103276335016"></a><a name="p103276335016"></a>Value Range</p>
</th>
<th class="cellrowborder" valign="top" width="35.066493350664935%" id="mcps1.1.6.1.5"><p id="p1835494695915"><a name="p1835494695915"></a><a name="p1835494695915"></a>Default Value</p>
</th>
</tr>
</thead>
<tbody><tr id="row1435412465598"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p881325510017"><a name="p881325510017"></a><a name="p881325510017"></a>--debug-info</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p072882813015"><a name="p072882813015"></a><a name="p072882813015"></a>Provides debug information.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p10327833305"><a name="p10327833305"></a><a name="p10327833305"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p076075115014"><a name="p076075115014"></a><a name="p076075115014"></a>-</p>
</td>
</tr>
<tr id="row1435412465598"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p881325510017"><a name="p881325510017"></a><a name="p881325510017"></a>--debugger-evaluate-expression</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p072882813015"><a name="p072882813015"></a><a name="p072882813015"></a>Evaluates base64 style expression in debugger</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p10327833305"><a name="p10327833305"></a><a name="p10327833305"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p076075115014"><a name="p076075115014"></a><a name="p076075115014"></a>-</p>
</td>
</tr>
<tr id="row3355346105920"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p163552462595"><a name="p163552462595"></a><a name="p163552462595"></a>--dump-assembly</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p127284281905"><a name="p127284281905"></a><a name="p127284281905"></a>Outputs an assembly file.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p93278335012"><a name="p93278335012"></a><a name="p93278335012"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1976019511306"><a name="p1976019511306"></a><a name="p1976019511306"></a>-</p>
</td>
</tr>
<tr id="row9355174675912"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p6355104616592"><a name="p6355104616592"></a><a name="p6355104616592"></a>--dump-ast</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p187287280015"><a name="p187287280015"></a><a name="p187287280015"></a>Prints the parsed AST(Abstract Syntax Tree)</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p932819331104"><a name="p932819331104"></a><a name="p932819331104"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1475975114013"><a name="p1475975114013"></a><a name="p1475975114013"></a>-</p>
</td>
</tr>
<tr id="row53551046175917"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p13575501218"><a name="p13575501218"></a><a name="p13575501218"></a>--dump-debug-info</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p1372811281608"><a name="p1372811281608"></a><a name="p1372811281608"></a>Prints debug Info</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p133287335020"><a name="p133287335020"></a><a name="p133287335020"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p37585513019"><a name="p37585513019"></a><a name="p37585513019"></a>-</p>
</td>
</tr>
<tr id="row8355204635911"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p657125010117"><a name="p657125010117"></a><a name="p657125010117"></a>--dump-literal-buffer</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p77281528704"><a name="p77281528704"></a><a name="p77281528704"></a>Prints the content of literal buffer</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p83281633208"><a name="p83281633208"></a><a name="p83281633208"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p17580511404"><a name="p17580511404"></a><a name="p17580511404"></a>-</p>
</td>
</tr>
<tr id="row6355124665910"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p105611505114"><a name="p105611505114"></a><a name="p105611505114"></a>--dump-size-stat</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20728192819015"><a name="p20728192819015"></a><a name="p20728192819015"></a>Displays statistics about bytecodes.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p1332810331508"><a name="p1332810331508"></a><a name="p1332810331508"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p157577519014"><a name="p157577519014"></a><a name="p157577519014"></a>-</p>
</td>
</tr>
<tr id="row235584610599"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p95515501012"><a name="p95515501012"></a><a name="p95515501012"></a>--extension</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p37282028600"><a name="p37282028600"></a><a name="p37282028600"></a>Specifies input file type</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p133281033804"><a name="p133281033804"></a><a name="p133281033804"></a>['js', 'ts', 'as']</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p675665112019"><a name="p675665112019"></a><a name="p675665112019"></a>-</p>
</td>
</tr>
<tr id="row135584635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p4551501217"><a name="p4551501217"></a><a name="p4551501217"></a>--help</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p157285282020"><a name="p157285282020"></a><a name="p157285282020"></a>Displays help information.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p1532819334016"><a name="p1532819334016"></a><a name="p1532819334016"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p475510516018"><a name="p475510516018"></a><a name="p475510516018"></a>-</p>
</td>
</tr>
<tr id="row133555461596"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p3541550416"><a name="p3541550416"></a><a name="p3541550416"></a>--module</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p27281728502"><a name="p27281728502"></a><a name="p27281728502"></a>Compiles the code based on the ecmascript standard module.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p832833312018"><a name="p832833312018"></a><a name="p832833312018"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1975514517020"><a name="p1975514517020"></a><a name="p1975514517020"></a>-</p>
</td>
</tr>
<tr id="row23556463595"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p135313506120"><a name="p135313506120"></a><a name="p135313506120"></a>--opt-level</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p97284281607"><a name="p97284281607"></a><a name="p97284281607"></a>Specifies the level for compilation optimization.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p43281335010"><a name="p43281335010"></a><a name="p43281335010"></a>['0', '1', '2']</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p57545511102"><a name="p57545511102"></a><a name="p57545511102"></a>0</p>
</td>
</tr>
<tr id="row5356124655916"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p185311501910"><a name="p185311501910"></a><a name="p185311501910"></a>--output</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p1872818281006"><a name="p1872818281006"></a><a name="p1872818281006"></a>
Specifies the path of the output file.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p73281733408"><a name="p73281733408"></a><a name="p73281733408"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p77537511606"><a name="p77537511606"></a><a name="p77537511606"></a>-</p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--parse-only</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Parse the input file only</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014"></a>-</p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--thread</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Specifies the number of threads used to generate bytecode</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>0-Number of threads supported by your machine</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014"></a>0</p>
</td>
</tr>
</tbody>
</table>

#### Usage For Ts2panda ####

Install `node` and `npm`

convert JS to ARK bytecode

```
$ cd out/hispark_taurus/clang_x64/ark/ark/build
$ npm install
$ node --expose-gc src/index.js [options] file.js
```

If no parameter is specified for  **\[options\]**, an ARK binary file is generated by default.

<a name="table2035444615598"></a>
<table><thead align="left"><tr id="row535415467591"><th class="cellrowborder" valign="top" width="12.898710128987101%" id="mcps1.1.6.1.1"><p id="p13354134619595"><a name="p13354134619595"></a><a name="p13354134619595"></a>Option</p>
</th>
<th class="cellrowborder" valign="top" width="6.869313068693131%" id="mcps1.1.6.1.2"><p id="p1584312189018"><a name="p1584312189018"></a><a name="p1584312189018"></a>Abbreviation</p>
</th>
<th class="cellrowborder" valign="top" width="19.33806619338066%" id="mcps1.1.6.1.3"><p id="p157281281906"><a name="p157281281906"></a><a name="p157281281906"></a>Description</p>
</th>
<th class="cellrowborder" valign="top" width="25.82741725827417%" id="mcps1.1.6.1.4"><p id="p103276335016"><a name="p103276335016"></a><a name="p103276335016"></a>Value Range</p>
</th>
<th class="cellrowborder" valign="top" width="35.066493350664935%" id="mcps1.1.6.1.5"><p id="p1835494695915"><a name="p1835494695915"></a><a name="p1835494695915"></a>Default Value</p>
</th>
</tr>
</thead>
<tbody><tr id="row1435412465598"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p881325510017"><a name="p881325510017"></a><a name="p881325510017"></a>--commonjs</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p148431189013"><a name="p148431189013"></a><a name="p148431189013"></a>-c</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p072882813015"><a name="p072882813015"></a><a name="p072882813015"></a>Compiles the code based on the commonjs.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p10327833305"><a name="p10327833305"></a><a name="p10327833305"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p076075115014"><a name="p076075115014"></a><a name="p076075115014"></a>-</p>
</td>
</tr>
<tr id="row1435412465598"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p881325510017"><a name="p881325510017"></a><a name="p881325510017"></a>--modules</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p148431189013"><a name="p148431189013"></a><a name="p148431189013"></a>-m</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p072882813015"><a name="p072882813015"></a><a name="p072882813015"></a>Compiles the code based on the ecmascript standard module.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p10327833305"><a name="p10327833305"></a><a name="p10327833305"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p076075115014"><a name="p076075115014"></a><a name="p076075115014"></a>-</p>
</td>
</tr>
<tr id="row3355346105920"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p163552462595"><a name="p163552462595"></a><a name="p163552462595"></a>--debug-log</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p48431918607"><a name="p48431918607"></a><a name="p48431918607"></a>-l</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p127284281905"><a name="p127284281905"></a><a name="p127284281905"></a>Enables the log function.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p93278335012"><a name="p93278335012"></a><a name="p93278335012"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1976019511306"><a name="p1976019511306"></a><a name="p1976019511306"></a>-</p>
</td>
</tr>
<tr id="row9355174675912"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p6355104616592"><a name="p6355104616592"></a><a name="p6355104616592"></a>--dump-assembly</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p20843161819020"><a name="p20843161819020"></a><a name="p20843161819020"></a>-a</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p187287280015"><a name="p187287280015"></a><a name="p187287280015"></a>Outputs an assembly file.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p932819331104"><a name="p932819331104"></a><a name="p932819331104"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1475975114013"><a name="p1475975114013"></a><a name="p1475975114013"></a>-</p>
</td>
</tr>
<tr id="row53551046175917"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p13575501218"><a name="p13575501218"></a><a name="p13575501218"></a>--debug</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p48431818104"><a name="p48431818104"></a><a name="p48431818104"></a>-d</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p1372811281608"><a name="p1372811281608"></a><a name="p1372811281608"></a>Provides debug information.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p133287335020"><a name="p133287335020"></a><a name="p133287335020"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p37585513019"><a name="p37585513019"></a><a name="p37585513019"></a>-</p>
</td>
</tr>
<tr id="row8355204635911"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p657125010117"><a name="p657125010117"></a><a name="p657125010117"></a>--show-statistics</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p98433181905"><a name="p98433181905"></a><a name="p98433181905"></a>-s</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p77281528704"><a name="p77281528704"></a><a name="p77281528704"></a>Displays statistics about bytecodes.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p83281633208"><a name="p83281633208"></a><a name="p83281633208"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p17580511404"><a name="p17580511404"></a><a name="p17580511404"></a>-</p>
</td>
</tr>
<tr id="row6355124665910"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p105611505114"><a name="p105611505114"></a><a name="p105611505114"></a>--output</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p1884310183014"><a name="p1884310183014"></a><a name="p1884310183014"></a>-o</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20728192819015"><a name="p20728192819015"></a><a name="p20728192819015"></a>Specifies the path of the output file.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p1332810331508"><a name="p1332810331508"></a><a name="p1332810331508"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p157577519014"><a name="p157577519014"></a><a name="p157577519014"></a>-</p>
</td>
</tr>
<tr id="row235584610599"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p95515501012"><a name="p95515501012"></a><a name="p95515501012"></a>--timeout</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p1684312184012"><a name="p1684312184012"></a><a name="p1684312184012"></a>-t</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p37282028600"><a name="p37282028600"></a><a name="p37282028600"></a>Specifies the timeout threshold.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p133281033804"><a name="p133281033804"></a><a name="p133281033804"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p675665112019"><a name="p675665112019"></a><a name="p675665112019"></a>-</p>
</td>
</tr>
<tr id="row135584635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p4551501217"><a name="p4551501217"></a><a name="p4551501217"></a>--opt-log-level</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p1843181819011"><a name="p1843181819011"></a><a name="p1843181819011"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p157285282020"><a name="p157285282020"></a><a name="p157285282020"></a>Specifies the log level for compilation optimization.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p1532819334016"><a name="p1532819334016"></a><a name="p1532819334016"></a>['debug', 'info', 'error', 'fatal']</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p475510516018"><a name="p475510516018"></a><a name="p475510516018"></a>error</p>
</td>
</tr>
<tr id="row133555461596"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p3541550416"><a name="p3541550416"></a><a name="p3541550416"></a>--opt-level</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p148441518404"><a name="p148441518404"></a><a name="p148441518404"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p27281728502"><a name="p27281728502"></a><a name="p27281728502"></a>Specifies the level for compilation optimization.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p832833312018"><a name="p832833312018"></a><a name="p832833312018"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p1975514517020"><a name="p1975514517020"></a><a name="p1975514517020"></a>1</p>
</td>
</tr>
<tr id="row23556463595"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p135313506120"><a name="p135313506120"></a><a name="p135313506120"></a>--help</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p168448187012"><a name="p168448187012"></a><a name="p168448187012"></a>-h</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p97284281607"><a name="p97284281607"></a><a name="p97284281607"></a>Displays help information.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p43281335010"><a name="p43281335010"></a><a name="p43281335010"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p57545511102"><a name="p57545511102"></a><a name="p57545511102"></a>-</p>
</td>
</tr>
<tr id="row5356124655916"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p185311501910"><a name="p185311501910"></a><a name="p185311501910"></a>--bc-version</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p6844141810019"><a name="p6844141810019"></a><a name="p6844141810019"></a>-v</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p1872818281006"><a name="p1872818281006"></a><a name="p1872818281006"></a>Outputs the current bytecode version.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p73281733408"><a name="p73281733408"></a><a name="p73281733408"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p77537511606"><a name="p77537511606"></a><a name="p77537511606"></a>-</p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--bc-min-version</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Outputs the lowest bytecode version supported.</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014"></a>-</p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--included-files</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-i</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>The list of dependent files</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014"></a>-</p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--record-type</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-p</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Record type info</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014">true</a></p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--dts-type-record</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-q</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Record type info for .d.ts files</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014">false</a></p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--debug-type</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-g</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Print type-related log</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014">false</a></p>
</td>
</tr>
<tr id="row1335654635915"><td class="cellrowborder" valign="top" width="12.898710128987101%" headers="mcps1.1.6.1.1 "><p id="p175213504115"><a name="p175213504115"></a><a name="p175213504115"></a>--output-type</p>
</td>
<td class="cellrowborder" valign="top" width="6.869313068693131%" headers="mcps1.1.6.1.2 "><p id="p384481811016"><a name="p384481811016"></a><a name="p384481811016"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="19.33806619338066%" headers="mcps1.1.6.1.3 "><p id="p20729728003"><a name="p20729728003"></a><a name="p20729728003"></a>Set output type</p>
</td>
<td class="cellrowborder" valign="top" width="25.82741725827417%" headers="mcps1.1.6.1.4 "><p id="p4328533205"><a name="p4328533205"></a><a name="p4328533205"></a>-</p>
</td>
<td class="cellrowborder" valign="top" width="35.066493350664935%" headers="mcps1.1.6.1.5 "><p id="p175385118014"><a name="p175385118014"></a><a name="p175385118014">false</a></p>
</td>
</tr>
</tbody>
</table>


For more information, please see: [ARK-Runtime-Usage-Guide](https://gitee.com/openharmony/ark_js_runtime/blob/master/docs/ARK-Runtime-Usage-Guide.md).

## Repositories Involved<a name="section1371113476307"></a>

[arkcompiler\_runtime\_core](https://gitee.com/openharmony/arkcompiler_runtime_core)

[arkcompiler\_ets\_runtime](https://gitee.com/openharmony/arkcompiler_ets_runtime)

**[arkcompiler\_ets\_frontend](https://gitee.com/openharmony/arkcompiler_ets_frontend)**
