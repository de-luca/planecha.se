# Mirrod.in

> Or Ravni.ca, whatever

A Planechase [Eternities Map](https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19) for people playing over the internet.

**This is POC level stuff**


## Install & Dev

### The yarn way

Install dependencies for all workspace:
```sh
yarn install
```

Execute `yarn` command in a single workspace
```sh
yarn workspace <front|back> <command> ...
```

Start front dev server
```sh
yarn workspace front dev
```

### The docker-compose way

*There's a docker-compose file if you are that kind of person... ( ͡° ͜ʖ ͡°)*  
*You might also want to use some alias like `fig` and `run`.*

Install dependencies for all workspace:
```sh
docker-compose run yarn install
```

Execute `yarn` command in a single workspace
```sh
docker-compose run yarn workspace <front|back> <command> ...
docker-compose run <front|back> <command> ...
```

Start front dev server
```sh
docker-compose up front
```


## Credits and Attribution

Portions of this project are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy.  
The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc.  
This project is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.
