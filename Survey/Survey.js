
var json = {
    title: "Weight loss task",
    showProgressBar: "top",
    pages:

        [
/*
            {
                title: "Consent Form",
                questions:
                    [
                        {

                            type: "html",
                            name: "Information sheet",
                            html: "<div id='consentForm' align='left'><img src='img/qmulHeader.png' class='centerQMUL' width='500' /><br/><h3 align='left'>Research study <b>Weight Loss Task</b> information for participants</h3>"
                                + "We would like to invite you to be part of this research project, if you would like to.  You should only agree to take part if you want to, it is entirely up to you.<br/>If you choose not to take part there won't be any disadvantages for you and you will hear no more about it.  [If appropriate: Choosing not to take part will not affect your access to treatment or services in any way]"
                                + "<br/>Please read the following information carefully before you decide to take part; this will tell you why the research is being done and what you will be asked to do if you take part. <br/>Please ask if there is anything that is not clear or if you would like more information.  "
                                + "In this study you will be presented with a few questions, and then you will be playing a game that will be presented to you online.<br/>"
                                + "The whole study should take no more than between 10 minutes in total.  "

                                + "<br/><br/>This study has been approved by Queen Mary University of London Research Ethics Committee QMRECxxxx. "
                                + "All information given in the study will be completely confidential and anonymous, in accordance to the Data Protection Act 1998. To ensure full anonymity, you will not be asked your name. You have the right to request your data be destroyed after the completion of the study. "
                                + "<br/>If you have any queries about the study or any concerns regarding the ethical conduct of this study, please email M.N at qmul.ac.uk "
                                + "If you have any questions or concerns about the manner in which the study was conducted please, in the first instance, contact the researcher responsible for the study. <br/> If this is unsuccessful, or not appropriate, please contact the Secretary at the Queen Mary Ethics of Research Committee, Room W104, Queen's Building, Mile End Campus, Mile End Road, London or research-ethics@qmul.ac.uk"
                                + "</div>"
                        }, {
                            "type": "boolean",
                            "name": "bool",
                            "title": "Do you want to take part?",
                            "label": "Are you 18 or older?",
                            "isRequired": true
                        }
                    ]
            }

            
            ,

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
,*/

            {
                title: "",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "Instructions",

                        "elements": [
                        {
                            type: "html",
                            html:
                                "Please imagine you are a 35-year-old man who weighs <b>80kg</b> and is 183 cm tall. That gives you a BMI of approx. 23.9, which is considered to be within the top end of the healthy range. " +
                                "<br>Imagine you want to lose 10kg within the next 3 months by controlling your diet and " +
                                "your exercise regime on daily basis.We will present you with a weight simulator which takes into " +
                                "<br> account your hypothetical diet and exercise every day. The simulator tells you your current weight on day 1 (80kg) and then asks you to input the number of calories you would consume " +
                                "<br>on day 1 as well as how much exercise you would do on that day."

                        }
                        ]
                    }


                ]
            }
            ,

            {
                title: "",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "Instructions",

                        "elements": [
                        {
                            type: "html",
                            html:
                                "To indicate the calories simply move the slider on the scale. Based on your inputs, the simulator will tell you how much you would weigh on day 2. Then, on day 2, you will be asked to decide how many calories you want to consume on day 2 as well as how much exercise you want to do on that day. Again, the simulator will use your inputs to give you a projected weight for day 3. This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen to help you keep track of your goal." +
                                "<img src='img/slidebar.png' class='centerQMUL' width='500' />"

                        }
                        ]
                    }


                ]
            }

            ,

            {
                title: "",
                questions: [
                    {
                        "type": "panel",
                        "innerIndent": 1,
                        "name": "panel1",
                        "title": "Instructions",

                        "elements": [
                        {
                            type: "html",
                            html:
                                "Your primary goal is to weigh 70kg by the end of the 90 days of weight loss simulation. Your secondary goal is to achieve this weight loss as gradually and consistently as possible throughout the 90 days. This means that you will need to figure out the optimal calories to take in every day and how much exercise to do every day. You should be able to learn this on a trial and error basis using the simulator. Importantly, you should consider both diet and exercise and work out the balance between them. This means that you should not just control your diet and ignore exercise, or just focus on exercise and ignore diet." +
                                "<img src='img/graph.png' class='centerQMUL' width='500' />"

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
         //console.log("cargando survey")
         fillData("middleman")
         createChart();
          $("#slidecontainer").show("fast", function () {


        });

    });
});

survey.render("surveyElement");
