# repomine

### Basic usage
```
repomine.update({
    path: './destination_directory',
    repos: [{
        dir: 'repository-dir-name',
        git: 'https://github.com/link/to/repository'
    }]
})
```

### Info

Repomine `update()` method verifies target path and then clones or fast forwards repositories returning [ES6 promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

 decorating settings object passed as a parameter.

Promise should always resolve with settings object, passed as a parameter, decorated with `fullPath` propery and additionally each repo object will get couple of properies: `ready` and `error`.

If error occurs during clonning or updating it will be attached to individual repo object on `repos` property.


### Example

Executing below code from local folder

```
var repomine = require('repomine')

repomine.update({
    path: './tmp',
    repos: [{
        dir: "jewelines",
        git: "https://github.com/indieforger/ifms-page-jewelines"
    },{
        dir: "xenoempires",
        git: "https://github.com/indieforger/ifms-page-xenoempires",
        ignore: true
    }]
}).then((obj) => {
    console.log(obj)
}, (err) => {
    console.log(err)
})
```

Should output something like
```
{ path: './tmp',
  repos:
   [ { dir: 'jewelines',
       git: 'https://github.com/indieforger/ifms-page-jewelines',
       ready: true,
       error: null },
     { dir: 'xenoempires',
       git: 'https://github.com/indieforger/ifms-page-xenoempires',
       ignore: true,
       ready: false,
       error: [Error: Repository was ignored] } ],
  fullPath: '/Users/Indieforger/repomine/node_modules/verify-path/tmp' }
```






