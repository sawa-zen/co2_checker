# co2_checker

This project is co2 checker for raspberry pi zero 2 w.

## Development

### Setup

You need to install node.js and npm on your raspberry pi.

```bash
sudo apt-get install nodejs npm
```

### Install dependencies

First, you need to sync the project to your raspberry pi.

```bash
rsync -e "ssh" -r ./* [host_name]:[directory]
```

Then, you can install dependencies.

```bash
npm install
```

### Run

You can run the project with the following command.

```bash
sudo node index.js
```

sudo is required to access the GPIO pins.