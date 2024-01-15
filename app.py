from flask import Flask, render_template, request, flash, session
from ldap3 import Server, Connection, SUBTREE, SIMPLE
from ldap3 import SIMPLE, SUBTREE
import json

Author = "Robin Kleppe"
Version = "2.2"

#Loads config file
with open('config.json', 'r') as file:
    config = json.load(file)

app = Flask(__name__)
app.secret_key = config["secretKey"]  # Replace with a secure and random secret key

def change_password(username, old_password, new_password):

    try:
        #Specify your AD server details
        server = Server(config["serverAdress"], use_ssl=True)
        #Connect to the AD server
        with Connection(server, user=username + config["domain"], password=old_password, authentication=SIMPLE) as conn:
            connect = conn.search(f'{config["searchGroup"]}',f'(&(sAMAccountName={username})'+str(config["searchUser"]), SUBTREE)
            print(f"connection status: {connect}")

            if len(conn.entries) == 1:
                user_dn = conn.entries[0].entry_dn
                #Change user password
                response = conn.extend.microsoft.modify_password(user_dn, new_password, old_password=None)
                print(f"Change status: {response}")
                if response == True:
                    return True
            else:
                return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        username = request.form.get('username')
        old_password = request.form.get('old_password')
        new_password = request.form.get('new_password')
        repeat_password = request.form.get('repeat_password')

        if not username or not old_password or not new_password:
            flash('All fields are required!', 'error')
        elif new_password != repeat_password:
            flash('Both password feelds must be the same', 'error')
        elif change_password(username, old_password, new_password):
            flash('Password changed successfully!', 'info')
        else:
            flash('Incorrect password or user is not available to change password. Contact the server admin if you believe this is an error!', 'error')

    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port="7234")  #Do not use in production, only for debugging


    # For use in production
    # from waitress import serve
    # serve(app, host="0.0.0.0", port=7234)