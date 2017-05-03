# gandalf.web

[![Build Status](https://travis-ci.org/Nebo15/gandalf.web.svg?branch=master)](https://travis-ci.org/Nebo15/gandalf.web)

[![Gandalf Logo](https://raw.githubusercontent.com/Nebo15/gandalf.web/develop/src/images/logo.png)](https://gndf.io)

This is a Front-End project for our Open-Source Decision Engine for Big-Data. You can find Back-End here: [Nebo15/gandalf.api](https://github.com/Nebo15/gandalf.api).

API docs is [here](http://docs.gandalf4.apiary.io/#).

## Installation Guide

### Docker

#### Deployment

UI can be deployed as a single container from [nebo15/gandalf.web](https://hub.docker.com/r/nebo15/gandalf.web/) Docker Hub.

#### Configurations

Application supports these environment variables:

| Environment Variable  | Default Value           | Description |
| --------------------- | ----------------------- | ----------- |
| `PORT`                | `8080`                  | Node.js server port.        |
| `API_ENDPOINT`        | -                       | Gandalf API endpoint.       |
| `API_CLIENTID`        | -                       | Gandalf API Client ID       |
| `PROVIDERS_BUGSNAG_APIKEY`    | -               | Bugsnag API KEY   |
| `PROVIDERS_BUGSNAG_STAGE`     | -               | Bugsnag stage name, eg. `development`   |

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


## Contribution

### Technologies

- Angular JS
- GulpJS
- Compass, Sass
- Protractor JS

### Requirements

- Bower
- Node JS
- Compass
- Gulp

### Installation

```
npm i -g bower gulp
gem install compass
```

### Usage

```
gulp ## build and open Gandalf on http://localhost:8080 and watch file changes

gulp build [--production] ## build project
gulp production # or gulp build --production
```

### Workflow

#### Git flow

Every task should start a new branch. Branch should be named as task number what its corresponding.
After finish work on a task, you need to create PR.

#### Testing

To contribute to the repository be ready to write some tests.

- Unit tests for business logic (we use Mocha)
- Integration tests for UI components (we use Enzyme)
- Acceptance tests for user stories (we use Nightwatch)

#### Pull Requests

Every task finishes with PR. Eslint, Stylelint, and tests are blocking PRs. To simplify PR review, we deploy every PR's branch automatically on Heroku.

## License

See [LICENSE.md](LICENSE).
