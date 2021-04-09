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
               "who": [],
               "where": [],
               "what": []
            }
         }
         session['key'] = key
         hostname = "127.0.0.1:8000"
         joinUrl = f"{hostname}/api/join/{key}"
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

@app.route('/api/join/<id>')
def apiJoin(id,name = ''):
   return render_template("main/join.html", key=id)

@app.route('/api/action/<id>',methods=['GET'])
def apiSubmit(id):
   type = request.args.get('type')
   if type == "join":
      name = request.args.get('name')
      session['name'] = name
      orders[id]['users'].append(name)

   if type == "start":
      orders[id]['stage'] = 2

   if type == "vote":
      stage = request.args.get('stage')
      orders[id]['votes'][stage].append((session['name'], request.args.get('value')))

   return "Delivered Successfully"

if __name__ == '__main__':
   orders = {}
   app.run('0.0.0.0',8000)