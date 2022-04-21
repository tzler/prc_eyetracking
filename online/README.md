## scripts to collect behavioral data online

`concurrent_*` scripts display stimuli in a concurrent 3-way visual discrimination (i.e. an 'oddity') task

`mts_*` scripts display stimuli in a 2-way, sequential, match-to-sample visual discrimination task 


node packages for running experiment on server downloaded with; 

```  
$ npm init --yes # initialize and accept all defaults
$ npm install express mongodb assert https socket.io 
```

this will create a folder `node_modules` in this directory as well as `package.json` and `package-lock.json` files.

run the main node executable, (which we've named following the standard convention): : 

```
$ node app.js
```

which will open port 8889 that can be used to access files on the server
