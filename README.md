# Character Sheet
This is a prototype of a character creation web application meant to work for the game of Dungeons and Dragons. It integrates information that had been aggregated by the open-source project 5e Tools in order to have JSON structured rules information for the game. As well as allowing for access to several of the source books and information directly inside the application.

## Basic Structure
This application is built on React and Node. It is structured to run entirely client sided with the internal server only meant to serve up the necessary pages and data as the user requests for it. With file saving and loading being handled using browser local storage and the users' own computer with them being able to download character files as JSON files storing all of the information which the page can read and properly recreate the original sheet structure.
