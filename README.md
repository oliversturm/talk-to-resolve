# talk-to-resolve - TTR

[![npm version](https://badge.fury.io/js/talk-to-resolve.svg)](https://badge.fury.io/js/talk-to-resolve) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/oliversturm/talk-to-resolve/blob/master/LICENSE)

An interactive debugging environment that talks to your running [reSolve](https://github.com/reimagined/resolve/) application.

## Getting Started

### Installation

Add the talk-to-resolve package to your reSolve project:

```shell
cd <YOUR RESOLVE PROJECT FOLDER>
yarn add talk-to-resolve

- OR -

npm install talk-to-resolve
```

Add an API handler to your application. For example, use the file `common/api-handlers/ttr.js`.

```js
import jsonwebtoken from 'jsonwebtoken';
import jwtSecret from '../../auth/jwt_secret';
import { handleTtr } from 'talk-to-resolve/api-handler/ttr';

export default async (req, res) => {
  await handleTtr(req, res, jwtToken => {
    // Make sure the web token is valid for TTR - the details of
    // the validation are just an example, you can change this.
    const jwt = jsonwebtoken.verify(jwtToken, jwtSecret);
    if (!jwt || !jwt.id) throw new Error('Invalid authentication token');
    if (!jwt || !jwt.roles || jwt.roles.indexOf('$ttr') < 0)
      throw new Error('Missing role');
  });
};
```

Add the API handler to `config.app.js`. This assumes the controller name of the example above. The path `$ttr` is currently fixed, so you shouldn't change it.

```js
...
apiHandlers: [
  ...
  {
    path: '$ttr',
    controller: 'common/api-handlers/ttr.js',
    method: 'POST'
  }
]
```

You can now run your application using `yarn dev`, or build and run any other reSolve configuration.

## Using The TTR Client

Include `ttr` as a script in your `package.json`:

```js
"scripts": {
  ...
  "ttr": "ttr"
}
```

This enables you to run the client using `yarn ttr` or `npm run ttr`. Run `ttr -h` for information on the supported command line arguments.

### Configuring The Client

Run `ttr` without any arguments to bring up the interactive environment. Use the `config` command to see the current configuration:

```shell
TTR [JWT Secret not set] [Service URL not set] > config

  TTR Config

  JWT Secret = 'null'
  Service URL = null
  Token template = {"id":"talk-to-resolve","roles":["$ttr"]}

TTR [JWT Secret not set] [Service URL not set] >
```

Configure the _JWT Secret_ and _Service URL_ values depending on your setup:

```shell
TTR [JWT Secret not set] [Service URL not set] > config set jwt secret 'the secret my running app uses'
JWT Secret set to 'the secret my running app uses'
TTR [Service URL not set] > config set service url http://localhost:3000
Service URL set to http://localhost:3000
TTR > config

  TTR Config

  JWT Secret = 'the secret my running app uses'
  Service URL = http://localhost:3000
  Token template = {"id":"talk-to-resolve","roles":["$ttr"]}

TTR >
```

Configure the token template according to the token structure your application uses, as well as the token validation logic you included in your API handler. For instance, assuming you use a `roles` field like the sample code does, you could include additional roles:

```shell
TTR > config set token template id: talk-to-resolve, roles: [$ttr, admin, accountant]
Token template set to {"id":"talk-to-resolve","roles":["$ttr","admin","accountant"]}
TTR >
```

Note that JSON arguments are parsed with [relaxed syntax](https://github.com/rjrodger/jsonic) - that makes them easier to type.

Once your configuration is complete, you can save it using `config save [name]`. The name is optional, `default` is assumed if you leave it out. Configurations are saved to the file `.ttr.config.json` in your home folder.

```shell
TTR > config save testconfig
Saved config 'testconfig' to /<YOUR HOME FOLDER>/.ttr.config.json
TTR >
```

`ttr` will attempt to load the `default` configuration automatically on startup. You can use the command line option `-l <name>` to load a different configuration, or execute `config load <name>` in the interactive environment.

### Commands

`ttr` commands can be executed either in the interactive environment or from the command line. The interactive environment supports tab-completion and commands are longer, while on the command line abbreviated command names are used to keep them shorter and easier to type.

#### Configuration Commands

Configuration commands are only supported in the interactive environment.

| Command                                       | Arguments                                                                                 | Comments |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- | -------- |
| `config`                                      | Show current configuration                                                                |
| `config load [name]`                          | Load a named configuration from the file `~/.ttr.config.json` (default name `default`).   |
| `config save [name]`                          | Save the current configuration to the file `~/.ttr.config.json` (default name `default`). |
| `config set jwt secret <secret...>`           | Configure the JWT Secret used to sign the token for access to the reSolve application.    |
| `config set service url <url>`                | Configure the base URL used to access the reSolve application.                            |
| `config set token template <templateJson...>` | Configure the template used for the security token.                                       |

#### Aggregate Commands

| Interactive                                                                          | Command Line                                                        | Comments                                                                                                              |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `aggregate show`                                                                     | `agg`                                                               | Show all aggregates                                                                                                   |
| `aggregate show commands <name>`                                                     | `agg-show <name>`                                                   | List commands implemented for the aggregate                                                                           |
| `aggregate execute command <aggregateName> <aggregateId> <command> <payloadJson...>` | `agg-exec <aggregateName> <aggregateId> <command> <payloadJson...>` | Execute a for the specified aggregate. Use [relaxed JSON syntax](https://github.com/rjrodger/jsonic) for the payload. |

#### Read Model Commands

| Interactive                                              | Command Line                                     | Comments                                                                                                                                                                                                                                                        |
| -------------------------------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `read-model status [id]`                                 | `rm-status [id]`                                 | Show status of one or all read models                                                                                                                                                                                                                           |
| `read-model show properties <id>`                        | `rm-props <id>`                                  | Show read model properties                                                                                                                                                                                                                                      |
| `read-model show resolvers <id>`                         | `rm-res <id>`                                    | Show read model resolvers                                                                                                                                                                                                                                       |
| `read-model query <id> <resolver> [resolverArgsJson...]` | `rm-query <id> <resolver> [resolverArgsJson...]` | Query a read model using its id and the name of a resolver. Pass resolver arguments using [relaxed JSON syntax](https://github.com/rjrodger/jsonic).<br>Options are supported:<br>`--json` outputs JSON to the screen<br>`--file <file>` outputs JSON to a file |

#### Event Commands

| Interactive   | Command Line | Comments                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `events show` | `ev`         | Show events.<br>Options are supported:<br>`--json` outputs JSON to the screen<br>`--file <file>` outputs JSON to a file<br>`--humanReadable` converts event timestamps<br>`--aggregateIds <aggregateIdsJson>` filters for a list of aggregate ids<br>`--eventTypes <eventTypesJson>` filters for a list of event types<br>`--startTime <startTime>` filters for events after the given time. Use numeric timestamp or string understood by Date.parse().<br>`--endTime <endTime>` filters for events before the given time. Use numeric timestamp or string understood by Date.parse(). |
