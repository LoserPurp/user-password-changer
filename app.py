from flask import Flask, render_template, request, flash, redirect
from ldap3 import Server, Connection, SUBTREE, SIMPLE
from waitress import serve
import json
from html import escape


Author = "Robin Kleppe"
Version = "2.6"


#Loads config file
with open('config.json', 'r') as file:
    config = json.load(file)


app = Flask(__name__)
app.secret_key = config["secretKey"]

#Sanitizes user input
def sanitize_input(input_string):
    return escape(input_string)


#Changes password
def change_password(username, old_password, new_password):
    try:
        #Specifies server
        server = Server(config["serverAdress"], use_ssl=True)

        #Connects to the LDAP server
        with Connection(server, user=username + config["domain"], password=old_password, authentication=SIMPLE) as conn:
            conn.search(f'{config["searchGroup"]}',f'(&(sAMAccountName={username})'+str(config["searchUser"]), SUBTREE)
            if len(conn.entries) == 1:
                user_dn = conn.entries[0].entry_dn
                #Change user password
                response = conn.extend.microsoft.modify_password(user_dn, new_password, old_password=None)
                if response == True:
                    return True
            else:
                return False
    except Exception as e:
        return False

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        #Gets santized input from user
        username = sanitize_input(request.form.get('username'))
        old_password = sanitize_input(request.form.get('old_password'))
        new_password = sanitize_input(request.form.get('new_password'))
        repeat_password = sanitize_input(request.form.get('repeat_password'))

        #Checks if all fields are filled inn
        if not username or not old_password or not new_password or not repeat_password:
            flash('All fields are required!', 'error')
            return redirect("/")
        #Checks if passwords match
        elif new_password != repeat_password:
            flash('Both password fields must be the same!', 'error')
            return redirect("/")
        #Tries to change password
        elif change_password(username, old_password, new_password):
            flash('Password changed successfully!', 'info')
            return redirect("/")
        #If everything fails, return generic error message
        else:
            flash('Incorrect username or password, contact your administrator if you believe this is an error!', 'error')
            return redirect("/")

    return render_template('index.html')
    
if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=7234)