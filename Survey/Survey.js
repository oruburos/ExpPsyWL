console.log("recibiendo condicion Survey " + c)



var initialWeight = 80
var unitslabel= ""
var targetLose = 10
var altura = "183 cm"

var htmlCond12 = "Please imagine you are a 35-year-old man who weighs <b>"+initialWeight+" "+unitslabel+ "</b> and is 183 cm tall. That gives you a BMI of approx. 23.9, which is considered to be within the top end of the healthy range. " +
                                "<br>Imagine you want to lose <b>"+targetLose+" "+unitslabel+ "</b> within the next 3 months by controlling your diet and " +
                                "your exercise regime on daily basis." +
                                "<br>We will present you with a weight simulator which takes into " +
                                "account your hypothetical diet and exercise every day.<br> The simulator tells you your current weight on day 1 (80kg) and then asks you to input the number of calories you would consume " +
                                "on day 1 as well as how much exercise you would do on that day." +
                                "<br>To indicate the calories simply move the slider on the scale. Based on your inputs, the simulator will tell you how much you would weigh on day 2. Then, on day 2, you will be asked to decide how many calories you want to consume on day 2 as well as how much exercise you want to do on that day. Again, the simulator will use your inputs to give you a projected weight for day 3. This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen to help you keep track of your goal." +
                                "<br><br>Here below you can see the sliders you will use to indicate your answers.<br><img src='img/slidebar.png' class='centerQMUL' width='700' /><br>" +
                                "  Your primary goal is to weigh 70kg by the end of the 90 days of weight loss simulation. Your secondary goal is to achieve this weight loss as gradually and consistently as possible throughout the 90 days. This means that you will need to figure out the optimal calories to take in every day and how much exercise to do every day. You should be able to learn this on a trial and error basis using the simulator. Importantly, you should consider both diet and exercise and work out the balance between them. This means that you should not just control your diet and ignore exercise, or just focus on exercise and ignore diet."  +
                                "<br><br>Here below you can see the results of the day.<br><img src='img/graph.png' class='centerQMUL' width='700' /> "


var htmlCond12 = "Please imagine you are a researcher investigating ways to ensure that people lose weight in " +
    "<br>a healthy manner: gradually and consistently over time. To do so you will be presented with a " +
    "<br>weight-loss simulator." +
    "<br>This simulator mimics a person’s physiological response to diet and exercise on daily basis." +
    "<br> The simulator simulates the weight of Sam, an average 35-year old<br> man who weighs <b>"+initialWeight+ ""+unitslabel+ "</b> and is 183 cm tall. " +
    "<br>As a researcher, your goal is to determine the best way for somebody like<br> Sam to lose <b>"+ targetLose+" "+unitslabel + "</b> within the 3 months" +
    "<br> by controlling the balance between daily diet and exercise. The simulator tells you Sam’s weight on day 1 <b>"+initialWeight+ ""+unitslabel+ "</b> and" +
    "<br>then asks you to input the number of calories Sam could consume on day 1 as well as how much exercise Sam could do on that day." +
    "<br>To indicate the calories simply move the slider on the scale. " +
    "<br>Based on your inputs, the simulator will tell you how much Sam would weigh on day 2 if he ate and exercised according to your inputs on day 1." +
    "<br>Then, on day 2, you will be asked to decide how many calories you want Sam to consume on day 2 as well" +
    "<br>as how much exercise you want Sam to do on that day. Again, the simulator will use your inputs to give you Sam’s projected weight for day 3." +
    "<br>This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen " +
    "<br>to help you keep track of your goal." +
    "<br><br>Here below you can see the sliders you will use to indicate your answers."+
    "<br><img src='img/graph.png' class='centerQMUL' width='700' />"

htmlIntro =""

if (c == 1 ||c==2) {
    htmlIntro =htmlCond12
}else {
    htmlIntro = htmlCond12 +"<br>Every so often you will be asked a series of 3 questions throughout the study trials. Please answer them using the slider scale that will be provided."


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
                                type: "radiogroup",
                                name: "units",
                                isRequired: true,
                                title: "Select your units",
                                choices: ["Pounds", "Kilos"]
                            },
                        {

                            type: "html",
                            name:"description",
                            title: "Instructions",
                            html: htmlIntro,
                            visibleIf: "{units}=Pounds || {units}=Kilos"


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



survey.onPropertyChanged.add(function(survey, options) {

    console.log(	"onPanelVisibleChanged ");
})

survey.onValueChanged.add(function(survey, options) {
var question1 = survey.getValue("units");

   // console.log(" valor unidad viejo  " + unitslabel + " valor nuevo unidad " + question1);


if ( unitslabel != question1){


    unitslabel= question1;
    console.log(question1);

 if(question1 == "Kilos" )
 {
     console.log( "80 kilos " )
     initialWeight = 80
     targetLose = 10
     altura = "183 cm"
 }
    else {
     initialWeight = 176//176.21

     targetLose = 22//22.04
     console.log("peso en libras " + initialWeight)
     altura = "6\""
 }
console.log( "actualizando con " + unitslabel)
 htmlCond12 = "Please imagine you are a researcher investigating ways to ensure that people lose weight in " +
    "a healthy manner: gradually and consistently over time. To do so you will be presented with a " +
    "weight-loss simulator." +
    "<br>This simulator mimics a person's physiological response to diet and exercise on daily basis." +
    " The simulator simulates the weight of Sam, an average 35-year old man who weighs <b>"+initialWeight+ " "+unitslabel+ "</b> and is "+ altura+" tall. " +
    "<br>As a researcher, your goal is to determine the best way for somebody like Sam to lose <b>"+targetLose+" "+unitslabel+ "</b> within the 3 months " +
    "by controlling the balance between daily diet and exercise.<br> The simulator tells you Sam's weight on the first day: <b>"+initialWeight+ " "+unitslabel+ "</b>. " +
    "It then asks you to input the number of calories Sam could consume on day 1 as well as how much exercise Sam could do on that day." +
    "<br>To indicate the calories simply move the slider on the scale. " +
    "Based on your inputs, the simulator will tell you how much Sam would weigh on day 2 if he ate and exercised according to your inputs on day 1." +
    "<br>Then, on day 2, you will be asked to decide how many calories you want Sam to consume on day 2 as well "  +
    "as how much exercise you want Sam to do on that day. <br>Again, the simulator will use your inputs to give you Sam's projected weight for day 3." +
    " This process will continue for the full 90 days. You will be shown a progress chart at the bottom of the screen " +
    "<br>to help you keep track of your goal." +
    "<br><br>Here below you can see the sliders you will use to indicate your answers."+
    "<br><br><img src='img/slidebar.png' class='centerQMUL' width='700' />" +
     "<br><br>Your primary goal is to ensure Sam reaches a weight of <b>"+(initialWeight-targetLose)+ " "+unitslabel+ "</b> by the end of the 90 days of weight loss simulation. Your secondary goal is to make sure he achieves this weight loss as gradually and consistently " +
     "as possible throughout the 90 days. This means that you will need to figure out the optimal calories for sam to take in every day and how much exercise Sam should do every day. <br>You should be able " +
     "to learn this on a trial and error basis using the simulator. Importantly, you should consider both diet and exercise and work out the balance between them. This means that you should not just control the diet and ignore" +
     " exercise, or just focus on exercise and ignore diet."+
    "<br><br>Here below you can see the results of the day.<br><img src='img/graph"+unitslabel+".png' class='centerQMUL' width='700' /> "


if (c == 1 ||c==2) {
    htmlIntro =htmlCond12
}else {
    console.log(" Poniendo extra info")
    htmlCond12 = htmlCond12+"<br>Every so often you will be asked a series of 3 questions throughout the study trials. Please answer them using the slider scale that will be provided."

}
    var pregunta = survey.pages[0].getQuestionByName("description");
  //  console.log(" asas " + htmlCond12 )
    pregunta.html = htmlCond12
    survey.render()

    }else{

    //console.log("Nada que hacer, el cambio fue de texto")
}
});
survey.onComplete.add(function (result) {
    $('.sv_body.sv_completed_page').hide();
   // $("body").css("overflow-y", "hidden");
     $(function () {
         //console.log("cargando survey")
         fillData("middleman")

         //console.log(" llenando " + JSON.stringify(result.data["units"]) )
         console.log(" llenando " + result.data["units"])
         if (result.data["units"] =="Kilos") {
             mode = 1
         }
         else {
             mode = 2 //pounds
         }
         createChart();
          $("#slidecontainer").show("fast", function () {

        });

    });
});

survey.render("surveyElement");
