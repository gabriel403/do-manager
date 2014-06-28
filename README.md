Digital Ocean Manager
==========

Originally written to interact with the v1 of the Digital Ocean API (failure due to CORS!) rewritten for the newly awesomeised API v2!

This is a simple front end that uses AJAX requests to communicate with the Digital Ocean API (v2).

All it needs is a simple webserver to run and contains no backend.

No information is stored by the host.

Add an access token to your [Digital Ocean](https://cloud.digitalocean.com/settings/applications)
account and enter the token in the input box at the top of the [DO Manager webpage](https://dom.prowl.io) and select your starting point from the dropdown.

Actions will become available as context changes.

Feel free to fork and send in PRs, help appreciated!

To run your own simply add a vhost for it, no dependencies required. In dev I simply use the python server.

```
gabriel at dixie-flatline in ~/Dropbox/code/do-manager on master
$ python -m SimpleHTTPServer
```
