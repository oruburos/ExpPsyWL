var Game = {

	idParticipant: -1,
	conditionExperiment: -1,
	unitsExperiment:-1,
	sessionID:-1,
	prolificID:-1,


	recordSnapshot: function () {

			Multiplayer.cmds.push(
				JSON.stringify(
					{

						type: 'snapshot',
				uids: { name: selectedOne.name , id : selectedOne.id,life : selectedOne.life , foraging:selectedOne.foraging, carryingResources : selectedOne.carryingResources , resources:selectedOne.resources  },

				pos: pos	}
			));

		Game.historialResources[Game.mainTick] = {
			"participant": Game.resources,
		}

	},

	saveReplayIntoDB: function () {


			console.log("update participant performance session")

			$.ajax({
				type: "POST",
				url: 'php/updateParticipant.php',
				data: {
					commandsPerformance: JSON.stringify(Game.replay),
					participantId: Game.idParticipant,
					occupancy: JSON.stringify(HeatMap.historial),
					historialPredator: JSON.stringify(HeatMap.historialPredator),
					ideal: Game.totalResources,
					historialResources: JSON.stringify(Game.historialResources),
					survey: Game.surveyData
				},
				success: function (data) {
					console.log(" termino performance")

				}
			});


	},

	getCondition: function () {

			Game.conditionExperiment =1; //
			console.log( "Condition" + Game.conditionExperiment )//hay 5 condiciones
			Game.createParticipant();

	},

	createParticipant: function (condition, mode) {
		Game.conditionExperiment = condition;
		Game.unitsExperiment = mode;
		console.log("se usara la condicion " + Game.conditionExperiment +" unidades " + Game.unitsExperiment+ " prolid" + Game.prolificID + " sessid "+ Game.sessionID );
		$.ajax({
			type: "POST",
			url: 'php/createparticipant.php',
			data: {
				conditionExp: Game.conditionExperiment,
				prolific_id : Game.prolificID,
				session_id : Game.sessionID,
				units : Game.unitsExperiment,
			},
			success: function (data) {

				console.log(" create id Participant : " + data )
				var obj = jQuery.parseJSON(data);

				Game.idParticipant = parseInt(obj);

				console.log("se usara la condicion " + Game.conditionExperiment + " id " +  Game.idParticipant  );
			}
		});


	},




	saveTrialsDB: function ( trials) {


			console.log("update participant trials ")

			$.ajax({
				type: "POST",
				url: 'php/updateParticipant.php',
				data: {
					trials: JSON.stringify(trials),
					participantId: Game.idParticipant,
					//survey: Game.surveyData
				},
				success: function (data) {
					console.log(" update trials id Participant : " + data )


				}
			});


	},



	finish: function ( demographicData ) {

		console.log("Entrando a finish, llamnado ajax ph experimentCompleted")
		$.ajax({
			type: "POST",
			url: 'php/experimentCompleted.php',
			data: { id_participant: Game.idParticipant, surveyDemo: demographicData },
			success: function (data2) {

				//alert("algodon" + data2)
				var obj = jQuery.parseJSON(data2);
				// window.location.reload()//aqui va regreso a Prolific
				console.log("returning to prolific " + Game.idParticipant + " " + Game.conditionExperiment)
				//alert("aqui mando a completar el estudio, sello la bd y ya" + Game.idParticipant + " " + Game.conditionExperiment );
				alert("Experiment completed. Going back to prolific")
				//window.location.href ='https://app.prolific.ac/submissions/complete?cc=sss';//experimento 2



			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
			}
		});


	},




	updateCausals: function ( causals ) {

		console.log("Entrando a updatecausals, llamnado ajax ph update causal" + causals );
		$.ajax({
			type: "POST",
			url: 'php/updateCausal.php',
			data: { id_participant: Game.idParticipant, causal: causals },
			success: function (data2) {

				console.log("algodon" + data2)
				var obj = jQuery.parseJSON(data2);
				// window.location.reload()//aqui va regreso a Prolific
				console.log("causals actualizado" + Game.idParticipant + " " + Game.conditionExperiment)
				//alert("aqui mando a completar el estudio, sello la bd y ya" + Game.idParticipant + " " + Game.conditionExperiment );
			//	alert("Experiment completed. Going back to prolific")
				//window.location.href ='https://app.prolific.ac/submissions/complete?cc=sss';//experimento 2

$.getScript("Survey/SurveyDemo.js");

			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
			}
		});


	},


};
