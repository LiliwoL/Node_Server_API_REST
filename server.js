/*
	Server Node avec Express
*/

// Appeler le module express
// Il faut avoir fait npm install express avant!
const express = require('express');
var cors = require('cors');

// Dépendance pour gérer les fichiers
const fs = require("fs");

// On va exécuter la fonction express() qui va instancier un objet express
const app = express();

// On demande à express d'utiliser le middleware JSON
app.use(express.json());

// Gestion du CORS
app.use(cors());
app.use(function(req, res, next) {   res.header("Access-Control-Allow-Origin", "*");   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   next(); });

// Configurer une route
// Qui répond à la méthode HTTP GET
// et à l'url /
app.get(
	'/',
	function (req, res) 
	{
		res.send('Hello World');
	}
);

// Une route en GET avec un paramètre id
app.get(
	'/movies/:id',
	function (req, res)
	{
		console.log(`## Requête sur le movie: ${req.params.id}`);

		// Lecture du JSON
		var data = fs.readFileSync("movies.json", 'utf8');

		// Parsing JSON du contenu du fichier (qui était une string)
		var json = JSON.parse(data);

		// On veut le movie req.params.id
		var output = json[req.params.id];

		// Préparation de la réponse en JSON
		res.setHeader('Content-Type', 'application/json');
		res.send(output);
	}
);

// Une route en GET qui affiche TOUS les paramètres
app.get(
	'/movies',
	function (req, res, next)
	{
		console.log(`## Affichage de TOUS les films`);

		// Lecture du JSON
		var data = fs.readFileSync("movies.json", 'utf8');

		// Parsing JSON du contenu du fichier (qui était une string)
		var json = JSON.parse(data);

		// Préparation de la réponse en JSON
		res.setHeader('Content-Type', 'application/json');
		res.send(json);
	}
);

// Une route en POST avec l'url /movie/add
app.post(
	'/movie/add',
	function (req, res)
	{
		console.log(`## Requête pour ajouter un film`);

		console.log (req.body);

		// Appel de la fonction pour l'ajout au fichier
		var lastItem = addMovie( req.body );

		console.log("OK, film ajouté");

		// Redirection vers le film nouvellement ajouté
		res.redirect('/movies/' + lastItem);
	}
)

// On lance le serveur sur le port 3000
app.listen(3000);


// Fonction qui ajoute un film au fichier JSON du serveur
function addMovie( newMovie )
{
	//@TODO: vérification du contenu!

	// Lecture du JSON
	var data = fs.readFileSync("movies.json", 'utf8');

	// Parsing JSON du contenu du fichier (qui était une string)
	var content = JSON.parse(data);

	// Ajout du nouveau film au JSON
	content.push( newMovie );

	// Ecriture dans le fichier
	fs.writeFileSync("movies.json", JSON.stringify(content) , 'utf8');

	// On renvoie le dernier item du fichier (longueur -1)
	return Object.keys(content).length -1;
}
