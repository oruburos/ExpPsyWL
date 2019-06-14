
var json = {
    title: "Weight loss task",
    showProgressBar: "top",
    pages:

        [

            {
                title: "Questions",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "",

                        "elements": [
                            {
                                type: "nouislider",
                                name: "steps_impact",
                                isRequired: true,
                                title: "To what extent does the amount of steps taken impact changes in weight? [0 not at all to 100 definitely]",
                            }     ,         {
                                type: "nouislider",
                                name: "calories_impact",
                                title: "To what extent does the amount of calories consumed impact changes in weight? [0 not at all to 100 definitely]",
                                 isRequired: true,
                            },
                            {
                                type: "nouislider",
                                name: "confidence",
                                isRequired: true,
                                title: "To what extent do you believe that what you are choosing to do (i.e. choosing number of steps, choosing number of calories consumed, or both) can change weight in the way you expect? [0 not at all to 100 definitely]",
                            }

                            /*,
                            {
                                type: "rating",
                                name: "control_score",
                                title: "Please indicate to what extent you felt you had control over your weight on daily basis.",
                              //  isRequired: true,
                                rateMin: 0,
                                "rateMax": 10,
                        "minRateDescription": "No Control",
                    "maxRateDescription": "Complete Control"

                            },
*/


                                ]
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
    $('.sv_body.sv_completed_page').hide();
    //$("body").css("overflow-y", "hidden");

    console.log("Result " + JSON.stringify(result.data))
    console.log("condition: " + conditionExp + " trial " + trial  )

    if( experimentFinished){
     $(function () {

          Game.updateCausals(JSON.stringify(result.data) )
      //   $.getScript("Survey/SurveyDemo.js");
    });
     }
     else{
     document.getElementById("task").disabled = false;
         $("#debrief").show();
        $("#slidecontainer").show();
        $("#demo").show();

        console.log("Regresando a canvas")
        $("#canvasdiv").show();
        $("#canvasExp").show();


        }


        recordQuestion = new RecordQuestions( parseInt( trial/stepQuestion)-1 , JSON.stringify(result.data ))
        questions[ parseInt( trial/stepQuestion)-1 ] = recordQuestion;

});

survey.render("surveyElement");

