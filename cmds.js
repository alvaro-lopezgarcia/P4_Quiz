const {log, biglog, errorlog, colorize} = require('./out');

const model = require('./model');


exports.helpCmd = rl => {
		 log("Commandos:");
    	 log("	h | help - Muestra esta ayuda.");
    	 log("	List - Listar los quizzes existentes.");
    	 log("	show <id> - Muestra la pregunta y la respuesta del quiz indicado");
    	 log("	add - Añadir un nuevo quiz interactivamente");
    	 log("	delete <id> - Borrar el quiz indicado.");
    	 log("	edit <id> - Editar el quiz indicado");
    	 log("	test <id> - Probar el quiz indicado");
    	 log("	p | play - Jugar a preguntar aleatoriamente todos los quizzes");
    	 log("	credits - Créditos.");
    	 log("	q | quit - Salir del programa.");
    	 rl.prompt();


};

exports.listCmd = rl => {
	model.getAll().forEach((quiz, id) => {
		log(`  [${colorize(id, 'magenta')}]: ${quiz.question} `);
	});

     	rl.prompt();
};

exports.showCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try  {
			const quiz = model.getByIndex(id);
			log(`[${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
		} catch(error) {
			errorlog(error.message);
		}
	}

    	 rl.prompt();
};

exports.addCmd = rl => {
	 rl.question(colorize(' Introduzca una pregunta: ','red'), question => {
	 	rl.question(colorize(' Introduzca la respuesta: ','red'), answer => {
	 		model.add(question, answer);
	 		log(`${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
	    	 rl.prompt();
		});
	 });
};

exports.deleteCmd = (rl, id) => {
	if (typeof id === "undefined"){
		errorlog(`Falta el parámetro id.`);
	} else {
		try  {
			model.deleteByIndex(id);
		} catch(error) {
			errorlog(error.message);
		
		}
	}

    	 rl.prompt();
}; 

exports.editCmd = (rl, id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {

			   const quiz = model.getByIndex(id);
			   process.stdout.isTTy && setTimeout(() => { rl.write(quiz.question)},0);
				rl.question(colorize('Introduzca una pregunta: ', 'red'), question => {
			  		 process.stdout.isTTy && setTimeout(() => { rl.write(quiz.answer)},0);
					rl.question(colorize('Introduzca la respuesta: ', 'red'), answer => {
					model.update(id,question,answer);
					log(`Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>','magenta')} ${answer}`);
						rl.prompt();
				
				
				});
			});
		} catch (error) {
			errorlog(error.message);
			rl.prompt();
		}
	}
	};

exports.testCmd = (rl, id) => {
	if (typeof id === "undefined") {
		errorlog(`Falta el parámetro id.`);
		rl.prompt();
	} else {
		try {
			const quiz = model.getByIndex(id);
			rl.question(quiz.question, answer => {
				if (answer.trim().toLowerCase() === quiz.answer.trim().toLowerCase()) {
					log('Su respuesta es correcta.', 'green');
					biglog('Correcto', 'green');

				}	else {

					log('Su respuesta es incorrecta.', 'green');
					biglog('Incorrecto', 'red');
				} rl.prompt();
				});
			} catch(error) {
				errorlog(error.message);
				rl.prompt();
			}
		}

};


exports.playCmd = rl => {
     	 let score = 0;

     	// let toBeResolved = [];
     	 let preguntas = [];
     	 //toBeResolved = model.getAll();
		 for (var i = 0; i < model.getAll().length; i++) {
		 	 preguntas[i] = i;
		 	}
     	 
     	 const random = (min,max) => {
     	 	return Math.random() * (max-min) + min;
     	 };

     	

		
 		
     	 const playOne = () => {
     	 
     	 	//log('Tu puntuación es' );
     	 if (preguntas.length==0) {
     	 	log(`No hay nada más que preguntar.`);
     	 	log(`Fin del juego. Aciertos: ${score}`);
     	 	log('Tu puntuación es' );
     	 	biglog(score, 'green');
     	 	rl.prompt();
     	 } else 
     	 {
     	 	let id = Math.floor(random(0, preguntas.length));

     	 	
     	 	let posicion = preguntas[id];
     	 	preguntas.splice(id,1);
     	 	const quiz = model.getByIndex(posicion);
     	 	rl.question(quiz.question, answer => {

     	 		
     	 		if(answer.trim().toLowerCase() == quiz.answer.trim().toLowerCase()) {
     	 			score = score+1;
     	 			log(`CORRECTO - Lleva ${score} aciertos.`);
     	 			
     	 			
     	 			//biglog(score, 'green');
     	 			playOne();
     	 		} else {
     	 			log('INCORRECTO.', 'red');
     	 			log(`Final del juego. Aciertos: ${score}`);

     	 			biglog(score, 'green');
     	 			rl.prompt();
     	 		}
     	 	});
     	 }
     	 };
     	 
     	 playOne();
     	
};
 

exports.creditsCmd = rl => {
     	log('Autores de la práctica:');
     	log('Alvaro', 'green');
     	rl.prompt();

};

exports.quitCmd = rl => {
	rl.close();
};