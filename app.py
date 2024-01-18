from flask import Flask, render_template, request, flash, redirect
from ldap3 import Server, Connection, SUBTREE, SIMPLE
from ldap3 import SIMPLE, SUBTREE
import json
from html import escape


Author = "Robin Kleppe"
Version = "2.3"

#Loads config file
with open('config.json', 'r') as file:
    config = json.load(file)

app = Flask(__name__)
app.secret_key = config["secretKey"]  # Replace with a secure and random secret key

def sanitize_input(input_string):
    return escape(input_string)

def change_password(username, old_password, new_password):

    try:
        #Specify your AD server details
        server = Server(config["serverAdress"], use_ssl=True)
        #Connect to the AD server
        with Connection(server, user=username + config["domain"], password=old_password, authentication=SIMPLE) as conn:
            connect = conn.search(config["searchGroup"], f'(&(sAMAccountName={username}){config["searchUser"]})', SUBTREE)
            print(f"connection status: {connect}")

            if len(conn.entries) == 1:
                user_dn = conn.entries[0].entry_dn
                #Change user password
                response = conn.extend.microsoft.modify_password(user_dn, new_password, old_password=None)
                print(f"Change status: {response}")
                if response == True:
                    return True
            else:
                # session.clear()
                return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = sanitize_input(request.form.get('username'))
        old_password = sanitize_input(request.form.get('old_password'))
        new_password = sanitize_input(request.form.get('new_password'))
        repeat_password = sanitize_input(request.form.get('repeat_password'))

        if not username or not old_password or not new_password:
            flash('All fields are required!', 'error')
            return redirect("/")
        elif new_password != repeat_password:
            flash('Both password feelds must be the same!', 'error')
            return redirect("/")
        elif change_password(username, old_password, new_password):
            flash('Password changed successfully!', 'info')
            return redirect("/")
        else:
            flash('Incorrect username or password, contact your administrator if you believe', 'error')
            return redirect("/")

    return render_template('index.html')
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="7234")  #Do not use in production, only for debugging

    # For use in production
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=7234)

