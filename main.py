from flask import Flask, render_template, session, jsonify, request
from datetime import datetime
import uuid, json

app = Flask(__name__)
app.secret_key = '7fbb7490f9d2571fc3ef5ac265220d167812157ff520ba29ca47f3a5c8e0332d'

@app.route('/')
def index():
   with open("restaurants.json") as file:
      restaurants = json.load(file)
   for x in range(0,5):
      key = uuid.uuid4().hex
      if key not in orders:
         orders[key] = {
            "created": str(datetime.now()),
            "users": [],
            "restaurants": restaurants,
            "stage": 1,
            "votes": {
               "stage2": [],
               "stage3": [],
               "stage4": []
            }
         }
         session['key'] = key
         hostname = "127.0.0.1:8000"
         joinUrl = f"{hostname}/join/{key}"
         return render_template("main/index.html",key=key,joinUrl=joinUrl)

@app.route('/order')
def order():
   return render_template("main/order.html", key=session['key'])

@app.route('/result')
def result():
   return render_template("main/result.html", key=session['key'])

@app.route('/api/info/<id>')
def apiInfo(id):
   return jsonify(orders[id])

@app.route('/join/<id>')
def join(id,name = ''):
   return render_template("main/join.html", key=id)

@app.route('/api/action/<id>',methods=['GET'])
def apiSubmit(id):
   type = request.args.get('type')
   order = orders[id]

   if type == "join":
      name = request.args.get('name')
      session['name'] = name
      session['key'] = id
      order['users'].append(name)

   if type == "start":
      order['stage'] = 2

   if type == "vote":
      stage = request.args.get('stage')
      order['votes']['stage'+stage].append((session['name'], request.args.get('value')))

   if 'stage' + str(order['stage']) in order['votes']:
      if len(order['users']) == len(order['votes']['stage' + str(order['stage'])]):
         order['stage'] += 1

   return "Delivered Successfully"

if __name__ == '__main__':
   orders = {}
   app.run('0.0.0.0',8000)