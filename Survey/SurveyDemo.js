
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
                                isRequired: false,
                                title: "What is your gender?",
                                choices: ["Male", "Female", "Other", "Prefer not to say"]
                            },
                            {
                                type: "text",
                                name: "age",
                                title: "What is your age?",
                                 isRequired: false,
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
                                isRequired: false,
                                title: "What is the highest level of education you have completed?",
                                choices: ["Other",
                                    "some high school",
                                    "high school graduate",
                                    "some college",
                                    "trade/technical/vocational training",
                                    "college graduate",
                                    "some posgraduate work",
                                    "post graduate degree"]
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
          $("#slidecontainer").show();
         div = document.getElementById("day")
         div.innerHTML = " Participation completed";
    $("#demo").show();
    $("#debrief").hide();

    $("#canvasExp").hide();



    });
});

survey.render("surveyElement");
