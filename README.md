# WirelessPrintingApp

Team Members:  
1.Aswin M Prabhu  
2.Joyal A Johney  
3.Vivek R  
4.Ashmi  
5.Srinidhi   


## To run the app on your local machine

1.Run "apt-get install nodejs" or install nodejs on windows

2.Goto the project folder and run "npm install"

3.Run "npm start"

##For database testing

1.Install Postgresql with username 'postgres' and password 'postgres' (use defualt port ie, 5432)

2.Run psql

3.Create 'database' mecprint and a table 'users' in it

4.Add the following columns to the table - id INT PRIMARY KEY NOT NULL UNIQUE AUTOINCREMENT,username VARCHAR UNIQUE NOT NULL,password VARCHAR NOT NULL,phone VARCHAR UNIQUE NOT NULL
