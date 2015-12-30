# repomine

## Basic usage
```
repomine.update({
    path: './destination_directory',
    repos: [{
        dir: 'repository-dir-name',
        git: 'https://github.com/link/to/repository'
    }]
})
```

## Info

Repomine `update()` method verifies target path and then clones or fast forwards repositories returning [ES6 promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) object.

 decorating settings object passed as a parameter.

Promise should always resolve with settings object, passed as a parameter, decorated with `fullPath` propery and additionally each repo object will get couple of properies: `ready` and `error`.

If error occurs during clonning or updating it will be attached to individual repo object on `repos` property.


### Notes

Original `gitnode` package has been replaced with much slower, `simple-git`, 
due to issues with cloning private repositories.
Following [nodegit](http://radek.io/2015/10/27/nodegit/) blog post solves
cloning issues only, fetching authentication still fails, original commit 
is [here](https://github.com/indieforger/ifms-pages/blob/143574ae29de91ce7503e606490aef0dd770b549/service.js)

Currently used `simple-git` library is a wrapper executing shell commands.
That means git has to be configured on local box.

## Example

Executing below code from local folder

```
var repomine = require('repomine')

repomine.update({
    path: './tmp',
    repos: [{
        dir: "jewelines",
        git: "https://github.com/indieforger/page-jewelines"
    },{
        dir: "xenoempires",
        git: "https://github.com/indieforger/page-xenoempires",
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
       git: 'https://github.com/indieforger/page-jewelines',
       ready: true,
       error: null },
     { dir: 'xenoempires',
       git: 'https://github.com/indieforger/page-xenoempires',
       ignore: true,
       ready: false,
       error: [Error: Repository was ignored] } ],
  fullPath: '/Users/Indieforger/repomine/node_modules/verify-path/tmp' }
```






