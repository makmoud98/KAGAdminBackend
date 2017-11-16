# KAGAdminBackend
This is a backend writting in javascript (with nodejs) that was meant to be used for King arthur's gold's official game servers. 
The backend is near complete but development was halted due to the development of the frontend stopping.
some of the features include:
*monitoring when admins join or leave the servers
*monitoring and documenting bans into the mysql server
*applying bans to all other servers (so if 1 player is banned on server 1 he will also be banned on server 2, 3, 4, etc.)
*allows players to request an admin to join a server
*logs all information to an irc chat and also uses the irc chat to notify admins

how does it work:
basically every kag server has a built in tcp server where tcp clients with the password can connect to send/recieve data. it reads the information and parses it so that various functions can be used.
the irc client is just a nodejs module
