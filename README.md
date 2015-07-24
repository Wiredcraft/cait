# cait

A simple prototype for the CAIT Business project.

## Dev setup:

1. Clone repo: ```git clone git@github.com:wiredcraft/cait``` & ```cd cait```
2. Setup virtualenv: ```virtualenv -p python3 venv``` & ```source venv/bin/activate```
3. Install python requirements: ```pip install -r requirements.txt```
4. Seed database: ```python init_db.py```
5. Run test server: ```python run.py``` and navigate to localhost:5000/api

And the front-end:

1. Install deps: ```npm install```
2. Start webpack-dev-server: ```npm start``` for auto-reloading bundles (make sure Flask is running in debug mode)

## Deploy:

1. Make sure Flask is not running in debug mode
2. Run ```npm run build``` to build a minified bundle of the static files
