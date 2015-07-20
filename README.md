# cait

A simple prototype for the CAIT Business project.

## Setup:

1. Clone repo: ```git clone git@github.com:wiredcraft/cait``` & ```cd cait```
2. Setup virtualenv: ```virtualenv -p python3 venv``` & ```source venv/bin/active```
3. Install python requirements: ```pip install -r requirements.txt```
4. Seed database: ```python init_db.py```
5. Run test server: ```python run.py``` and navigate to localhost:5000/api

And the front-end:

1. Install deps: ```npm install```
2. Start webpack-dev-server: ```npm start``` (listens for changes & auto-reloads)
