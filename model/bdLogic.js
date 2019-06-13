var Game = {

	idParticipant: -1,
	conditionExperiment: -1,
	sessionID:-1,
	prolificID:-1,

	win: function () {
			Game.saveReplayIntoDB();
	},
	lose: function () {
	    Game.saveReplayIntoDB();
	}
    ,

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

	}

	saveReplayIntoDB: function () {

	if (Game.modoTutorial) {

			Game.modoTutorial = false;

			$.ajax({
				type: "POST",
				url: 'php/submissionParticipantStarted.php',
				data: {
					replay2: JSON.stringify(Game.replay),
					participantId: Game.idParticipant,
					historial: JSON.stringify(HeatMap.historial),
					historialPredator: JSON.stringify(HeatMap.historialPredator),
					idealTutorial: Game.totalResources,

					historialResources: JSON.stringify(Game.historialResources),
					survey: Game.surveyData
				},
				success: function (data) {
					console.log(" Success. saveReplayIntoDB grabado termno tutorial" + data);

				$('#textoBye').innerHTML = 'Dear participant, thank you very much for your participation in this online study If after completion of this study you have any questions or concerns regarding this experiment,<br/>	you might contact at all times the test leader by email to:<br/><br/><br/>d.o.verdugapalencia@qmul.ac.uk<br/><button type="button" onclick="Game.finish()">	Click here to complete your participation!</button><br/>';
					Game.layerSwitchTo("GameStart");


					/**Hack puerco *
					 */
					var json = {
						title: "Online Mini Gaming Tasks",
						showProgressBar: "top",

						pages:

							[

								{
									title: "Tutorial Finished",
									questions:
										[
											{



												type: "html",
												name: "finishTutorial",
												html: " <h3>You finished the tutorial!!!</h3>After the previous practice session, now you are ready to take part in the main session.<br/><br>The main task will last 5 minutes</br>. The game controls are identical to the previous controls in the practice session."
											}
										]
								}


							]
					};


					Survey
						.StylesManager
						.applyTheme("winterstone");
					var survey = new Survey.Model(json);

					survey.onComplete.add(function (result) {
						console.log(" enviando a session real");
						$('.sv_body.sv_completed_page').hide();
						//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
						$(function () {






							Game.teams = {};
							Game.mainTick = 0;
							Game.commands = {};

							Game._frameInterval = 100;
							Game.replay = {};
							Game.resources = 0;
							Game.selectedUnit = {};
							Game.totalResources = 0;
							Game.competitorResources = 0;
							Game.historialResources = {};

							Game.leaveEarly = false;

							Burst.allEffects = [];
							clearInterval(Game.refreshIntervalId);
							console.log("***********************valores reseteados")


							Game.play();

						});
					});

					survey.render("surveyElement");

				}
			});

		} else {


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
					//alert("grabado");
					console.log("grabado " + data);


					$('#textoBye').innerHTML = 'Dear participant, thank you very much for your participation in this online study If after completion of this study you have any questions or concerns regarding this experiment,<br/>	you might contact at all times the test leader by email to:<br/><br/><br/>d.o.verdugapalencia@qmul.ac.uk<br/><button type="button" onclick="Game.finish()">	Click here to complete your participation!</button><br/>';


					console.log(" termino performance")
					Game.layerSwitchTo("GameStart");


					/**Hack puerco *
					 */
					var json = {
						title: "Online Mini Gaming Tasks",
						showProgressBar: "top",

						pages:

							[

								{
									title: "Main Session Finished",
									questions:
										[
											{



												type: "html",
												name: "Summary",
												html: " <h2>Summary of Objectives of the Study.</h2>" +
													"You have just participated in a study that is designed to examine the way in which people approach a situation that is unfamiliar to them. Some people like to spend a lot of time gathering information and scouting things out before making a decision as to what to do, where others spend less time doing that the scouting, and more time on making decisions and taking action. The former is referred as explorative behaviour and the later is referred to as exploitative behaviour. This information could not be given to you before starting the study, as this could have severely altered your answers.								"
											}
										]
								}


							]
					};


					Survey
						.StylesManager
						.applyTheme("winterstone");
					var survey = new Survey.Model(json);

					survey.onComplete.add(function (result) {
						console.log("OnCompleteSegundo survey");
						$('.sv_body.sv_completed_page').hide();
						//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
						$(function () {
							Game.finish();//fake, esto no jala
							console.log("END")
							//	window.location.reload();//conexion a prolific
						});
					});

					survey.render("surveyElement");

				}
			});






			Game.layerSwitchTo("Farewell");
			/**Hack puerco *
		 */



			Survey
				.StylesManager
				.applyTheme("winterstone");
			var survey = new Survey.Model(json);

			survey.onComplete.add(function (result) {
				console.log("initSreal");
				$('.sv_body.sv_completed_page').hide();
				//   document.querySelector('#surveyResult').innerHTML = "result: " + JSON.stringify(result.data);
				$(function () {
					//	Game.finish();//fake, esto no jala
				});
			});

			survey.render("surveyElement");



		}



	},

	getCondition: function () {


			Game.conditionExperiment =1; //
			console.log( "Condition" + Game.conditionExperiment )//hay 5 condiciones
			Game.createParticipant();

	},

	createParticipant: function () {
		console.log("se usara la condicion " + Game.conditionExperiment +" prolid" + Game.prolificID + " sessid "+ Game.sessionID );
		$.ajax({
			type: "POST",
			url: 'php/createparticipant.php',
			data: {
				conditionExp: Game.conditionExperiment,
				prolific_id : Game.prolificID,
				session_id : Game.sessionID
			},
			success: function (data) {

				console.log(" id Participant : " + data )
				var obj = jQuery.parseJSON(data);

				Game.idParticipant = parseInt(obj);

				//	console.log("se usara la condicion " + Game.conditionExperiment + " id " +  Game.idParticipant  );
			}
		});


	},

	finish: function () {

		console.log("Entrando a finish, llamnado ajax ph experimentCompleted")
		$.ajax({
			type: "POST",
			url: 'php/experimentCompleted.php',
			data: { id_participant: Game.idParticipant, conditionexp: Game.conditionExperiment },
			success: function (data2) {
				//alert("algodon" + data2)
				var obj = jQuery.parseJSON(data2);
				// window.location.reload()//aqui va regreso a Prolific
				console.log("returning to prolific " + Game.idParticipant + " " + Game.conditionExperiment)
				//alert("aqui mando a completar el estudio, sello la bd y ya" + Game.idParticipant + " " + Game.conditionExperiment );
				alert("Experiment completed. Going back to prolific")
				window.location.href ='https://app.prolific.ac/submissions/complete?cc=sss';//experimento 2



			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert(xhr.status);
				alert(thrownError);
			}
		});

		//window.location.href = "/caller/complete.php?cc=12345";

		//location.reload();
	},

};
