# Mirrod.in

> Or Ravni.ca, whatever

A Planechase *thingy* for people playing over the internet (or not).

**This is POC level stuff**


## Install & Dev

### The yarn way

Install dependencies:
```sh
yarn install
```

Start dev server:
```sh
yarn dev
```

### The docker-compose way

*There's a docker-compose file if you are that kind of person... ( ͡° ͜ʖ ͡°)*  
*You might also want to use some alias like `fig` and `run`.*

Install dependencies:
```sh
docker-compose run yarn install
```

Start dev server
```sh
docker-compose up [-d]
```


## Credits and Attribution

Portions of this project are unofficial Fan Content permitted under the Wizards of the Coast Fan Content Policy.  
The literal and graphical information presented on this site about Magic: The Gathering, including card images, the mana symbols, and Oracle text, is copyright Wizards of the Coast, LLC, a subsidiary of Hasbro, Inc.  
This project is not produced by, endorsed by, supported by, or affiliated with Wizards of the Coast.



Board:
    navigation: Back/Close/(Save?)
    map: slot? display the correct component depending on online or not
        - all the shit in board right now
    status/whatever on the bottom


On close game: Save? => Save state to localstorage

