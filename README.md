# barnard59

Build better Linked Data pipelines in less time with barnard59 to have more time to look at the [sky](https://en.wikipedia.org/wiki/Pipe_Nebula).
barnard59 bundles a lot of tools with an easy to use API.
To allow processing of big amounts of data, it's based on [streams](https://nodejs.org/api/stream.html).  

## Features

- stream processing
- SPARQL
- file system
- CSV
- JSON-LD
- N-Triples
- list functions (filter, map)

## Usage

Check the [examples](https://github.com/zazuko/barnard59/tree/master/example) for some ideas. More documentation on the usage of barnard59 will be added later.


## API

barnard59 Linked Data pipelines

**Example**  
```js
var p = require('barnard59')
```

* [barnard59](#module_barnard59)
    * [.shell](#module_barnard59.shell)
    * [.limit(limit)](#module_barnard59.limit)
    * [.run(something)](#module_barnard59.run) ⇒ <code>Promise</code>
    * [.stdout()](#module_barnard59.stdout)

<a name="module_barnard59.shell"></a>

### p.shell
Execute a shell command.

**Kind**: static property of [<code>barnard59</code>](#module_barnard59)  
<a name="module_barnard59.limit"></a>

### p.limit(limit)
Limit the amount of chunks in a pipe.

**Kind**: static method of [<code>barnard59</code>](#module_barnard59)  

| Param | Type | Description |
| --- | --- | --- |
| limit | <code>number</code> | Limit the amount of chunks passed through the pipe. |

<a name="module_barnard59.run"></a>

### p.run(something) ⇒ <code>Promise</code>
Run a pipe.

**Kind**: static method of [<code>barnard59</code>](#module_barnard59)  
**Returns**: <code>Promise</code> - something  

| Param | Type |
| --- | --- |
| something | <code>Stream</code> | 

**Example**  
```js
p.run(source.pipe(p.limit).pipe(p.stdout())).then(() => {console.log('done')})
```
<a name="module_barnard59.stdout"></a>

### p.stdout()
Provides a pipe which writes on the stdout of the current operating system process.

**Kind**: static method of [<code>barnard59</code>](#module_barnard59)  

