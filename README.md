# gandalf.web

[![Deployment status from DeployBot](https://nebo15.deploybot.com/badge/66802254055260/64890.svg)](http://deploybot.com) [![Build Status](https://travis-ci.org/Nebo15/gandalf.web.svg?branch=master)](https://travis-ci.org/Nebo15/gandalf.web)

This is a Front-End project for our Open-Source Decision Engine for Big-Data. You can find Back-End here: [Nebo15/gandalf.api](https://github.com/Nebo15/gandalf.api).

API docs is [here](http://docs.gandalf4.apiary.io/#).

## Usage

Developement

```
gulp ## build and open Gandalf on http://localhost:8080 and watch file changes
```

Build

```
gulp build [--production]
```

Production build

```
gulp production # or gulp build --production
```

# Installation Guide

Basic configuration. Copy `settings/settings.sample.json` file to `settings/settings.json`.

```
cp settings/settings.sample.json settings/settings.json
```

Configure API access parameters and providers keys.

### Vagrant

You can use [Vagrant](https://www.vagrantup.com/) to intialize a development environment. Simply install it, ```cd``` into your project directory and run:

```
vagrant up
```

Also you can notice that we use [Puppet](https://puppetlabs.com/puppet/puppet-open-source) as our configuration tool. Scripts located in [/puppet](https://github.com/Nebo15/gandalf.api/tree/master/puppet) directory of this repo. You can deploy code to your server and simply run:

```
set -o nounset -o errexit -o pipefail -o errtrace
trap 'error "${BASH_SOURCE}" "${LINENO}"' ERR
echo 127.0.0.1 gandalf.yourdomain.com | sudo tee -a /etc/hosts
sudo /bin/bash puppet/initial/init.sh -u "www-data"
```

And your server will be ready for production use!
