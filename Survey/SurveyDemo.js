
var json = {
    title: "Weight loss task",
    showProgressBar: "top",
    pages:

        [

            {
                title: "Demographics",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "Demographics",

                        "elements": [
                            {
                                type: "radiogroup",
                                name: "gender",
                                isRequired: true,
                                title: "What is your gender?",
                                choices: ["Male", "Female", "Other", "Prefer not to say"]
                            },
                            {
                                type: "text",
                                name: "age",
                                title: "What is your age?",
                                 isRequired: true,
                                validators: [
                                    {
                                        type: "numeric",
                                        minValue: 16,
                                        maxValue: 100
                                    }
                                ]
                            },
                            {
                                type: "dropdown",
                                name: "education",
                                isRequired: true,
                                title: "What is the highest level of education you have completed?",
                                choices: ["Other",
                                    "some high school",
                                    "high school graduate",
                                    "some college",
                                    "trade/technical/vocational training",
                                    "college graduate",
                                    "some posgraduate work",
                                    "post graduate degree"]
                            },
                            {
                                type: "rating",
                                name: "control_score",
                                title: "Please indicate to what extent you felt you had control over your weight on daily basis.",
                               isRequired: true,
                                rateMin: 0,
                                "rateMax": 10,
                        "minRateDescription": "No Control",
                    "maxRateDescription": "Complete Control"

                            }
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
    $("body").css("overflow-y", "hidden");
     $(function () {



         /* $("#slidecontainer").show();
         div = document.getElementById("day")
         div.innerHTML = " Participation completed";
    $("#demo").show();
    $("#debrief").hide();
    $("#canvasExp").hide();
*/


 $("#slidecontainer").show();
         div = document.getElementById("day")
         div.innerHTML = " <h2>Participation completed</h2>";
         $("#demo").hide();
         $("#debrief").hide();
         $("#canvasExp").hide();
         console.log("Preguntas")
         console.table(questions);
         console.log ( JSON.stringify(result.data))


    });
});

survey.render("surveyElement");
