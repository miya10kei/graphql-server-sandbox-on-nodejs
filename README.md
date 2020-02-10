## graphql-sandbox-on-nodejs

Setup MongoDB

```bash
$ mongo
$ use graphql-sandbox
$ db.createUser({ user: "graphql", pwd: "graphql-pass", roles: [ { role: "userAdmin", db: "graphql-sandbox" },{ role: "readWrite", db: "graphql-sandbox" } ] })
```
