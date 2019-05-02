console.log("recibiendo condicion Survey " + c)

var htmlCond12 = "Please imagine you are a 35-year-old man who weighs <b>80kg</b> and is 183 cm tall. That gives you a BMI of approx. 23.9, which is considered to be within the top end of the healthy range. " +
                                "<br>Imagine you want to lose 10kg within the next 3 months by controlling your diet and " +
                                "your exercise regime on daily basis." +
                                "<br>We will present you with a weight simulator which takes into " +
                                "account your hypothetical diet and exercise every day.<br> The simulator tells you your current weight on day 1 (80kg) and then asks you to input the number of calories you would consume " +
                                "on day 1 as well as how much exercise you would do on that day." +
                                "<br>To indicate the calories simply move the slider on the scale. Based on your inputs, the simulator will tell you how much you would weigh on day 2. Then, on day 2, you will be asked to decide how many calories you want to consume on day 2 as well as how much exercise you want to do on that day. Again, the simulator will use your inputs to give you a projected weight for day 3. This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen to help you keep track of your goal." +
                                "<br><br>Here below you can see the sliders you will use to indicate your answers.<br><img src='img/slidebar.png' class='centerQMUL' width='700' /><br>" +
                                "  Your primary goal is to weigh 70kg by the end of the 90 days of weight loss simulation. Your secondary goal is to achieve this weight loss as gradually and consistently as possible throughout the 90 days. This means that you will need to figure out the optimal calories to take in every day and how much exercise to do every day. You should be able to learn this on a trial and error basis using the simulator. Importantly, you should consider both diet and exercise and work out the balance between them. This means that you should not just control your diet and ignore exercise, or just focus on exercise and ignore diet."  +
                                "<br><br>Here below you can see the results of the day.<br><img src='img/graph.png' class='centerQMUL' width='700' /> "


var htmlCond34 = "Please imagine you are a 35-year-old man who weighs <b>80kg</b> and is 183 cm tall. That gives you a BMI of approx. 23.9, which is considered to be within the top end of the healthy range. " +
                                "<br>Imagine you want to lose 10kg within the next 3 months by controlling your diet and " +
                                "your exercise regime on daily basis." +
                                "<br>We will present you with a weight simulator which takes into " +
                                "account your hypothetical diet and exercise every day.<br> The simulator tells you your current weight on day 1 (80kg) and then asks you to input the number of calories you would consume " +
                                "on day 1 as well as how much exercise you would do on that day." +
                                "<br>To indicate the calories simply move the slider on the scale. Based on your inputs, the simulator will tell you how much you would weigh on day 2. Then, on day 2, you will be asked to decide how many calories you want to consume on day 2 as well as how much exercise you want to do on that day. Again, the simulator will use your inputs to give you a projected weight for day 3. This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen to help you keep track of your goal." +
                                "<br><br>Here below you can see the sliders you will use to indicate your answers.<br><img src='img/slidebar.png' class='centerQMUL' width='700' /><br>" +
                                "  Your primary goal is to weigh 70kg by the end of the 90 days of weight loss simulation. Your secondary goal is to achieve this weight loss as gradually and consistently as possible throughout the 90 days. This means that you will need to figure out the optimal calories to take in every day and how much exercise to do every day. You should be able to learn this on a trial and error basis using the simulator. Importantly, you should consider both diet and exercise and work out the balance between them. This means that you should not just control your diet and ignore exercise, or just focus on exercise and ignore diet."  +
                                "<br><br>Here below you can see the results of the day.<br><img src='img/graph.png' class='centerQMUL' width='700' /> " +
    "<br>Every so often you will be asked a series of 3 questions throughout the study trails. Please answer them using the slider scale that will be provided."

htmlIntro =""

if (c == 1 ||c==2) {
    htmlIntro =htmlCond12
}else {
    htmlIntro = htmlCond34
}

var json = {
    title: "Weight loss task",
    showProgressBar: "top",
    pages:

        [

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
                            html: htmlIntro,


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
   // $("body").css("overflow-y", "hidden");
     $(function () {
         //console.log("cargando survey")
         fillData("middleman")
         createChart();
          $("#slidecontainer").show("fast", function () {

        });

    });
});

survey.render("surveyElement");
