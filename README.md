# SLII

SQL Like Interface for IndexedDB (and JSON)

- - -

## Install

npm install slii

## Sample

```javascript
var slii = new SLII("test_database");

slii.open()
.then(function() {
  slii.upgrade(function() {
    slii.createTable("table1");
    slii.insertInto("table1", ["key1", "key2", "key3"])
        .values("a", 100, 200);
  })
  .then(function() {
    var query = slii.select().from("table1");

    query.run(function(rows) {
      console.log(rows); // [{ "key1": "a", "key2": 100, "key3": 200 }]
    });
  });
});
```

- - -

[TOC]

- - -

## Main Class

### SLII(String[, Object])

- arguments[0]: database_name
- arguments[1]: (optional) initialize option
- arguments[1].mode: see SLII#setMode (default is same to 'idb')

- - -

## Methods

#### SLII#useIndexedDB(): void

Set the related indexedDB object

#### SLII#setMode(String): void

- arguments[0]: 'idb' or 'no_idb' (can use Constants)

Setting 'idb' is using indexecDB mode.
Setting 'no_idb' is not using indexedDB mode. can use only 'select' syntax.

#### SLII.createDatabaseDefinition(): DatabaseDefinition

Create DatabaseDefinition instance.
see DatabaseDefinition

#### SLII#deleteDatabase(String[, Function]): Promise

- arguments[0]: database_name
- arguments[1]: (optional) blocking function (function())

#### SLII#open([DatabaseDefinition]): Promise

- arguments[0]: (optional) DatabaseDefiniton instance.

Open indexedDB object.

#### SLII#close(): Promise

Close indexedDB object.

#### SLII#destroy(): Promise

Clear indexedDB object.

#### SLII#getCurrentVersion(): Number

Get database version.

#### SLII#begin_transaction(String|String[], String, Function): Promise

- arguments[0]: table_name
- arguments[1]: open mode 'readwrite' or 'readonly' (can use Constants)
- arguments[2]: transacting process

To sustain the transaction into the third argument function.
Auto commit where completing the all process,
and auto rollback when error occurs.
Can use only DML method. (can not use DDL)

#### SLII#upgrade(Function[, Function]): Promise

- arguments[0]: upgrade process (function({IDBDatabase}db, {IDBTransaction} tra))
- arguments[1]: end process (function())

Generate the transaction, can use DDL.
Useing DatabaseDefinition when database is opened, this method can not use.
Each callback function(first and second argument) will be executing synchronously.

#### SLII#addTask(Object, Function): void

- arguments[0]: object with the 'exec' metod. (or null)
- arguments[1]: called by 'exec' method of first argument. (function({any}object, {Function}after_process))

DML and DDL will be run with a delay synchronously.
Define the task to be performed along the specified order.
The second argument has three arguments. The first argument is result of 'exec' method. The second argument is the function to be called when the process was completed successfully. The third argument is the function to be called when the process was not successfully. By properly execute the second and third argument, to control the continuation and iterruption of the transaction.

```javascript
slii.addTask(obj, function(result, ok, ng) {
  if(result === true) {
    ok();
  } else {
    ng();
  }
});
```

#### SLII#create_table(String, Object): DDL

Return DDL#create_table.
This can also be described as 'createTable'.

#### SLII#drop_table(String): DDL

Return DDL#drop_table.
This can also be described as 'dropTable'.

#### SLII#create_index(String, String, Object): DDL

Return DDL#create_index.
This can also be described as 'createIndex'.

#### SLII#drop_index(String, String): DDL

Return DDL#drop_index.
This can also be described as 'dropIndex'.

#### SLII#select(Function|undefined): DML

Return DML#select.

#### SLII#insert_into(String[, String[]]): DML

Return DML#insert_into.
This can also be described as 'insertInto'.

#### SLII#delete_from(String): DML

Return DML#delete_from.
This can also be described as 'deleteFrom'.

#### SLII#update(String): DML

Return DML#update.

#### SLII#rollback(): void

Rollback the transaction.

<!--
#### SLII#isUpgrading(): Boolean
#### SLII#isTransacting(): Boolean
#### SLII#getNewVersion(): Number
#### SLII#runQueue(): void
-->

- - -

### Querable

#### Querable#run(Function): Promise

- arguments[0]: callback function (function({any}result, {Function}ok, {Function}ng))

Add specified task.
Querable is inherited DML and DDL, each DML and DDL is executed being call the 'run'.

```javascript
slii.select().from("table").run();
slii.insertInto("table1", ["key1", "key2"]).values(100, 200).run();
```

The first argument will be called asynchronously after 'run' execution.
The first argument function has three arguments. The first argument is result of DML or DDL. The second argument is the function to be called when the process was completed successfully. The third argument is the function to be called when the process was not successfully.

```javascript
slii.select().from("table").run(function(num, ok, ng) {
  if(num > 0) {
    ok();
  } else {
    ng();
  }
});
```

---

### DML

Inheirt Querable.

#### DML#select([Funciton]): DML

- argument[0]: (optional) callback function (function({Function}output, {Object}input))

To specify the items to select.
The first argument has two arguments. The first argument is output function. By the literal to the argument, the result select them. Also, it has aggregate function to reference, do the aggregation by executing in the same way. The second argument is each record that is provided in the Object type.

```javascript
slii.select(function(out, in) {
  out(in.key1).as('alias1'); // when no set the alias, column name is '0'
  out.max(in.key2).as('alias2'); // when no set the alias, column name is '1'
});
```

#### DML#from(String|DML|Object[]|Object): DML

- argument[0]: table name or sub-query or data set or table name and alias pair

When specify String, getting the data from the same name of the table name.
When specify DML, executing as the subquery.
When specify Array of Object, to handle it itself as a table.
When specify Object, key the name of the table name, value as alias, to inner join.

#### DML#as(String): DML

set alias to table or input object.

#### DML#insert_into(String[, String[]]): DML

- argument[0]: table name
- argument[1]: insert target columns

This can also be described as 'insertInto'.

#### DML#values(...any|any[]): DML

- argument[0]: insert value

#### DML#delete_from(String): DML

- argument[0]: table name

This can also be described as 'deleteFrom'.

#### DML#update(String): DML

- argument[0]: table name

#### DML#set(Object): DML

- argument[0]: column name and value pair

#### DML#join(String|DML|Object[], Kriteria|Function[, String]): DML

- argument[0]: table name or sub-query or data set
- argument[1]: data join condition.
- argument[2]: (optional) join type, 'inner' or 'left' or 'right' (default: inner)

The second argument is instance of Kriteria. When specify function, function's first argument is instance of Kriteria.
see. [Kriteria](https://github.com/a7a/Kriteria)

```javascript
var kri = new Kriteria();
slii.select().from("table1").join("table2", kri);

// same
slii.select().from("table").join("table2", function($) {
  // $ is instance of Kriteria
});
```

#### DML#inner_join(DML|String|Object[], Kriteria|Function):DML

Return DML#join(argument[0], argument[1], 'inner');
This can also be described as 'innserJoin'.

#### DML#left_join(DML|String|Object[], Kriteria|Function):DML

Return DML#join(argument[0], argument[1], 'left');
This can also be described as 'leftJoin'.

#### DML#right_join(DML|String|Object[], Kriteria|Function):DML

Return DML#join(argument[0], argument[1], 'right');
This can also be described as 'rightJoin'.

#### DML#where(Kriteria|Function): DML

- argument[0]: data extract condition.

The first argument is instance of Kriteria. When specify function, function's first argument is instance of Kriteria.
see. [Kriteria](https://github.com/a7a/Kriteria)

```javascript
var kri = new Kriteria();
slii.select().from("table").where(kri);

// same
slii.select().from("table").where(function($) {
  // $ is instance of Kriteria
});
```

#### DML#group_by(...String|String[]): DML

set to grouping target.

This can also be described as 'groupBy'.

#### DML#having(Kriteria|Function): DML

- argument[0]: data extract conditoin after grouping.

The first argument is instance of Kriteria. When specify function, function's first argument is instance of Kriteria.
see [Kriteria](https://github.com/a7a/Kriteria)

```javascript
var kri = new Kriteria();
slii.select().from("table").groupBy("key1", "key2").having(kri);

// same
slii.select().from("table").groupBy("key1", "key2").having(function($) {
  // $ is instance of Kriteria
});
```

Note: Can not use aggregate function

#### DML#union(): DML

Conbining a plurality of data set by select.
Summarize the duplicate data.

#### DML#union_all():DML

Conbining a plurality of data set by select.
Not sumamrize the duplicate data.

This can also be described as 'unionAll'.

#### DML#order_by(...&lt;String|Object&gt;|Array&lt;String|Object&gt;): DML

The specify stirng as a column name, sort the results.
When specify Object, key is column name, value is 'asc' or 'desc'.

```javascript
.orderBy("key1", "key2");
.orderBy({ "key1": "asc" }, { "key2": "desc" });
.orderBy(["key1", "key2"]);
.orderBy([{ "key1": "asc" }, { "key2": "desc" }]);
```

This can also be described as 'orderBy'.

#### DML#limit(Number[, Number]): DML

- argument[0]: max count or offset number of getting.
- argument[1]: (optional) offset number of getting.

When not specify the second argument, the first argument is max count of getting.
When specify the second argument, the first argument is offset number, the second argument is max count of getting.

#### DML#offset(Number): DML

- argument[0]: offset number of getting.

Offset number of gettign.

<!--
#### DML#isSelectQuery
#### DML#isInsertQuery
#### DML#isDeleteQuery
#### DML#isUpdateQuery
#### DML#forceSelectQuery
#### DML#addUnions
#### DML#getUnions
#### DML#clearUnions
#### DML#getTableName
#### DML#getTableNames
-->

- - -

### DDL

#### DDL#create_table(String[, Object]): DDL

- argument[0]: table name.
- argument[1]: (optional) create table option.

The second argument is create table option of IndexedDB.

This can also be described as 'createTable'.

#### DDL#drop_table(String): DDL

- argument[0]: table name.

This can also be described as 'dropTable'.

#### DDL#create_index(String, String[, Object]): DDL

- argument[0]: table name.
- argument[1]: index name.
- argument[2]: (optional) create index option.

The third argument is create index option of IndexedDB.

This can also be described as 'createIndex'.

#### DDL#drop_index(String, String): DDL

- argument[0]: table name.
- argument[1]: index name.

This can also be described as 'dropIndex'.

- - -

## Manage Class

### DatabaseDefinition()

## Method of DatabaseDefinition

### DatabaseDefinition#setVersion(Number, Function)

- argument[0]: version number for positive integer
- argument[1]: update process (function({SLII}slii))

### DatabaseDefinition#defineVersionMap(any)

To define the order of the version you want to run.

```javascript
var def = SLII.createDatabaseDefinition();
def.setVersion(1, function(slii) { /* Something */ });
// and set the some version

def.defineVersionMap([ 1, 2, 3 ]);
// run version 1 -> 2 -> 3

// But version 3 was wrong version
def.setVersion(4, function(slii) { /* fix setting */ });
def.setVersion(5, function(slii) { /* correct setting */ })
def.defineVersionMap([
  [ 1, 2, 5],
  [ 3, 4, 5]
]);
// New user is run version 1(ok) -> 2(ok) -> 5(ok)
// Wrong version's user is run version 3(ng) -> 4(fix) -> 5(ok)
```

<!--
### DatabaseDefinition#isLatestVersion(Number)
### DatabaseDefinition#getVersionMapStartWithVersion(Number)
### DatabaseDefinition#getLatestVersionOfDefinition
### DatabaseDefinition#getLatestVersionForVersion(Number)
### DatabaseDefinition#existVersionInDefinition(Number)
-->

## Constants

- SLII.USE_IDB: 'idb'
- SLII.NO_IDB: 'no_idb'
- SLII.READ_WRITE: 'readwrite'
- SLII.READ_ONLY: 'readonly'

- - -

## TODO

- TableSchemaを定義できるようにする
- aliasを設定しないselectで、column名を取得できるようにする
- limit-orderでintro_selectを行う
- Kriteriaの定義方法を変える

- - -

## Licence

MIT
