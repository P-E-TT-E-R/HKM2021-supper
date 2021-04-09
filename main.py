# Imports modules
from flask import Flask, render_template, session, jsonify, request
from datetime import datetime
import uuid, json

# Declares app variable
app = Flask(__name__)
app.secret_key = '7fbb7490f9d2571fc3ef5ac265220d167812157ff520ba29ca47f3a5c8e0332d'


@app.route('/')
def index():
    # Loads restaurant.json
    with open("restaurants.json") as file:
        restaurants = json.load(file)

    # Tries 5 times to generate valid UUID
    for x in range(0, 5):
        key = uuid.uuid4().hex

        # Proceeds with lobby creation if the UUID is unique
        if key not in orders:
            # Creates new lobby
            orders[key] = {
                "created": str(datetime.now()),
                "users": [],
                "restaurants": restaurants,
                "stage": 1,
                "voted": [],
                "votes": {
                    "stage2": {},
                    "stage3": {},
                    "stage4": {}
                },
                "results": {
                    "stage2": "",
                    "stage3": "",
                    "stage4": ""
                }
            }

            # Adds new session var
            session['key'] = key

            # Creates join URL
            joinUrl = f"{config['host']}/join/{key}"

            # Returns rendered template with generated variables
            return render_template("main/index.html", key=key, joinUrl=joinUrl)


@app.route('/order')
def order():
    # Returns rendered template with generated variables
    return render_template("main/order.html", key=session['key'])


@app.route('/result')
def result():
    # Returns rendered template with generated variables
    return render_template("main/result.html", key=session['key'])


@app.route('/api/info/<id>')
def apiInfo(id):
    # Returns data in JSON format
    return jsonify(orders[id])


@app.route('/join/<id>')
def join(id, name=''):
    # Returns rendered template with generated variables
    return render_template("main/join.html", key=id)


@app.route('/api/action/<id>', methods=['GET'])
def apiSubmit(id):
    # retrieves type and creates order variable
    type = request.args.get('type')
    order = orders[id]
    if type == "join":
        # Adds user to created lobby, assigns name and key (UUID) to his session
        name = request.args.get('name')
        session['name'] = name
        session['key'] = id
        order['users'].append(name)

    if type == "start":
        # Changes state of lobby to 2 / starting the lobby
        order['stage'] = 2

    if type == "vote":
        # Registers a vote
        stage = request.args.get('stage')
        votes = order['votes']['stage' + str(stage)]
        value = request.args.get('value')

        if session['name'] not in order['voted'] and order['stage'] != 4:
            if value in votes:
                order['votes']['stage' + str(stage)][value] = votes[value] + 1
            else:
                order['votes']['stage' + str(stage)][value] = 1

            order['voted'].append(session['name'])
        elif order['stage'] == 4:
            if value == "ready" and session['name'] not in order['voted']:
                if value in votes:
                    order['votes']['stage' + str(stage)][value] = votes[value] + 1
                else:
                    order['votes']['stage' + str(stage)][value] = 1

                order['voted'].append(session['name'])

            elif value != "ready":
                if value in votes:
                    order['votes']['stage' + str(stage)][value] = votes[value] + 1
                else:
                    order['votes']['stage' + str(stage)][value] = 1


    # Checks if all users in lobby voted and if so, changes the stage of the lobby and saves result
    stage = 'stage' + str(order['stage'])
    if stage in order['votes']:

        votesCombined = 0
        for vote in order['votes'][stage]:
            votesCombined += order['votes'][stage][vote]

        if len(order['users']) <= votesCombined:
            votes = order['votes'][stage]

            if order['stage'] == 4:
                if 'ready' in votes:
                    if votes['ready'] == len(order['users']):
                        votes.pop('ready')
                        order['results'][stage] = votes
                        order['stage'] += 1
                        order['voted'] = []

            else:
                result = ("",0)
                for vote in votes:
                    if votes[vote] > result[1]:
                        result = (vote, votes[vote])
                order['results'][stage] = result[0]
                order['stage'] += 1
                order['voted'] = []

    # If everything wnt correctly, returns "Delivered Successfully"
    return "Delivered Successfully"

if __name__ == '__main__':
    # Declares global variable orders where all orders (lobbies) are stored
    orders = {}

    # Loads config
    with open("config.json") as file:
        config = json.load(file)

    # Starts the app
    app.run(config['ip'], config['port'])
