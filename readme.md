## 1. Prepare environnement
### 1.1. Server Requirements
- Ubuntu / Debian OS
- 4GB RAM
- at least HDD 10 GB

### 1.2. Docker
- Install from [here](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)

### 1.3. Git
- Install from [here](https://git-scm.com/)

### 1.4. Node
- Install nvm: following [here](https://github.com/creationix/nvm#installation)
- Install node 8:

```bash
    nvm install 8
    nvm use 8
    nvm alias default 8
```
- Install additional packages

```bash
    sudo apt-get install build-essential python-setuptools graphicsmagick graphicsmagick-imagemagick-compat libcairo2-dev libpango1.0-dev libgif-dev
 ```
- Install the npm dependency

```bash
    npm install -g mocha grunt-cli bower karma-cli
```
## 2. Install OpenPaaS
### 2.1. Download 
- Clone OpenPaaS project

```bash
    git clone https://ci.linagora.com/linagora/lgs/openpaas/esn.git
```
### 2.2. Create Docker services
- Create and run docker services (for the first time):

```bash
    docker run -d --name esn-elas -p 9200:9200 elasticsearch:2.3.2
    docker run -d --name esn-mongo -p 27017:27017 mongo:3.2.0
    docker run -d --name esn-redis -p 6379:6379 redis:latest
    docker run -d --name esn-rabbit -p 5672:5672 rabbitmq:3.6.5-management
    docker run --name esn-sabre -d -p 8001:80 -e "SABRE_MONGO_HOST=172.17.0.1" -e "ESN_MONGO_HOST=172.17.0.1" -e "ESN_HOST=172.17.0.1" -e "AMQP_HOST=172.17.0.1"  linagora/esn-sabre
```
- Stop services:

```bash
    docker stop esn-elas esn-mongo esn-redis esn-rabbit esn-sabre
```
- Start services: 

```bash
    docker start esn-elas esn-mongo esn-redis esn-rabbit esn-sabre
```
- In case docker container port already taken by other services

You need to find out and stop the services which are using the ports before running docker services

```bash
    sudo netstat -pna | grep [port]
    sudo service [service_name] stop
```
### 2.3. Install OpenPaaS
Go to the ESN project directory and install project dependencies
*Note*: You need to run the following commands as a normal user (No sudo and root permissions).

```bash
    cd rse
    npm install
    bower install
```

### 2.4. Configure OpenPaaS
- Connect Database

```bash
    $ node ./bin/cli db --host localhost --port 27017 --database esn
```
- Connect Elasticsearch

It will create the indexes on the elasticsearch instance defined from CLI options.

```bash
    $ node ./bin/cli elasticsearch -t users -i user.idx
```
- t (--type): Defines the type of index. When not set, it will create all the required indexes.
- i (--index): Defines the index to create. When not set, it will be built from type(Eg: if the type is __users__ then the index is __users.idx__.

- Populate database

It will populate the MongoDB database with initial required data to use OpenPaaS.

```bash
$ node ./bin/cli populate
```
Once populated, you should be able to log into the OpenPaaS instance using user `admin@open-paas.org` and password `secret`.

### 2.5. Start OpenPaas

- Start OpenPaaS in dev mode:

```bash
$ grunt dev
```

Open `http://localhost:8080` with your browser and login with `admin@open-paas.org/secret`
​
### 2.6. James (Optional)
- Run docker service

```bash
docker run -d --name elasticsearch elasticsearch:2.3.2
docker run -d --name cassandra cassandra:2.2.3
docker run -d --hostname localhost -p 80:80 -p 25:25 -p "143:143" --link cassandra:cassandra --link elasticsearch:elasticsearch --name james linagora/james-project:latest
```
## 3. Install Open Data module

- Download module 

``` bash
    Git clone https://ci.linagora.com/linagora/lgs/openpaas/linagora.esn.opendata` and install with `npm install` from the created folder
```
* Declare module by adding `linagora.esn.opendata` to `esn/config/default.json` in modules section

* Install module from /linagora.esn.opendata folder 

``` bash
    npm install
```

* Access to application at `/localhost:8080/#/opendata`

## 4. Troubleshooting

- Got __EACCESS__ error when running `npm install`

Try to remove ~/.npm and rerun npm install

```bash
    rm -r ~/.npm
    npm install
```

- Got error relating to node-canvas

Following this [documentation](https://github.com/Automattic/node-canvas)

Example with ubuntu, try to run the following command:

```bash
    sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++
```

- During further manipulations you encounter errors with node modules

Try to reinstall them

```bash
    rm -rf node_modules/
    npm install
```