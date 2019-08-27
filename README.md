# talk-to-resolve - TTR

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

Include the `ttr` call in your `package.json`:

```json
"scripts": {
  //...
  "ttr": "ttr"
}
```

This enables you to run the client using `yarn ttr` or `npm run ttr`.

### Configuring The Client

Use the `config` command to see the current configuration:

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

Note that JSON arguments are generally understood with "sloppy" syntax - that makes them easier to type.

Once your configuration is complete, you can save it using `config save [name]`. The name is optional, `default` is assumed if you leave it out. Configurations are saved to the file `.ttr.config.json` in your home folder.

```shell
TTR > config save testconfig
Saved config 'testconfig' to /<YOUR HOME FOLDER>/.ttr.config.json
TTR >
```
