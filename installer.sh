#!/bin/bash

#!!NOT TESTED!!

#Installs py modules
pip install -r requirements.txt

#Creates the user and set its home directory
sudo useradd -r -s /bin/false upc-user
sudo chown upc-user:upc-user /var/www/user-password-changer

#Gives read access to everyone
sudo chmod -R 755 /var/www/user-password-changer


#makes the systemd service file
cat <<EOL | sudo tee /etc/systemd/system/user-password-changer.service > /dev/null
[Unit]
Description=User Password Changer Service

[Service]
Type=simple
ExecStart=/usr/bin/python3 /var/www/user-password-changer/app.py
User=upc-user
Group=upc-user
Restart=always

[Install]
WantedBy=multi-user.target
EOL

#Grants access to the directory
sudo chown -R upc-user:upc-user /var/www/user-password-changer

#enables the service to start on boot
sudo systemctl daemon-reload
sudo systemctl enable user-password-changer
sudo systemctl start user-password-changer

echo("Thank you for using this project!")