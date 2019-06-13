var JSONData;
var labels = [];
var trialCurrWeight= [];//just the wieght for the plot
var trialWeight = [];//complete record
var trial = 1;


var mode= -1; // 1 kilo 2 pounds


var JSONData;
var labels = [];
var dataw = [];
var questions = [];

var conditionExp = 1;
var experimentFinished = false;
var timeToAsk = true;

var url = new URL(window.location);
var c = url.searchParams.get("c");

console.log("parameter condition " + c);

var maxTrial = 90;
var stepQuestion = 15; //cada cuanto pregunta


if ( c == 3 || c==4 ){


    /*Conditions with extra line*/
    //“Every so often you will be asked a series of 3 questions throughout the study trails. Please answer them using the slider scale that will be provided."
    stepQuestion = 15;

}else{
    stepQuestion = 90;
}

var currentWeight = 300;


//function constructor to store the data regarding each trial
function RecordTrial(trial, calories, steps, initialWeight, finalWeight) {

    this.trial = trial;
    this.calories = calories;
    this.steps = steps;
    this.initialWeight = initialWeight;
    this.finalWeight = finalWeight;

}


//function constructor to store the data regarding each trial
function RecordQuestions(trial,data) {

    this.trial = trial;
    this.data = data;

}

function kgToLbs(kg) {
    return kg * 2.2;
}

function lbsToKgIndex(lbs) {
    return lbs * .454;
}

function transformActivityLevel(steps) {
    return .000075 * steps;
}

function calculateWeightLoss() {

    var calories = document.getElementById("myRange").value
    var steps = document.getElementById("myRange2").value
    activityFromSteps = transformActivityLevel(steps)


    //console.log("trial " + trial + "calories " + calories + "activity " + activityFromSteps)
   // trialRecord[trial] = calories;

    var config;
    JSONData = $().calculator({
        sex: gender,
        age: age,
        currentWeight: currentWeight,
        calories: calories,
        endweight: endweightprofile,
        activity: activityFromSteps,
        noise: true,
    });
  //  console.log(" current weigh pounds" + currentWeight + " kgs " + JSONData.daywl)

    var info = "";


    //  trialWeight[trial ] = lbsToKgIndex(currentWeight);
    prevWeight = currentWeight;
    currentWeight = currentWeight - kgToLbs(JSONData.daywl);


    //peso
    if (JSONData.daywl < 0) {

        if ( mode == 1) {///modo kilos
        info = "You <b>GAIN: " + (-1 * JSONData.daywl.toFixed(2)) + " kg.</b> since yesterday.<br>" +
            "Your current weight is: <b>" + lbsToKgIndex(currentWeight).toFixed(1) + "kg.</b><br>";
        if (typeof JSONData.oml !== 'undefined' && (c == 2 || c == 4) ){
//console.log(" currentweigh : " + currentWeight + " kgToLb " + kgToLbs(JSONData.oml) + " diferencia " + (currentWeight - kgToLbs(JSONData.oml)).toFixed(2) )

            info += "If you keep going at this rate then your projected weight after a month will be:<b> " + (lbsToKgIndex(currentWeight) - (JSONData.oml)).toFixed(2) + "kg</b>.<br>";
        }
        }
        if ( mode == 2) {//moodo pounds
        info = "You <b>GAIN: " + (-1 * kgToLbs(JSONData.daywl).toFixed(1)) + " pounds.</b> since yesterday.<br>" +
            "Your current weight is: <b>" + currentWeight.toFixed(1) + " pounds.</b><br>";
        if (typeof JSONData.oml !== 'undefined' && (c == 2 || c == 4) ){

            valueHTML = (currentWeight - kgToLbs(JSONData.oml)).toFixed(1)
    //    console.log(" mode2 gain weight currentweigh : " + currentWeight + " kgToLb " + kgToLbs(JSONData.oml) + " diferencia " +  valueHTML)

            info += "If you keep going at this rate then your projected weight after a month will be:<b> " + valueHTML + " pounds</b>.<br>";
        }
        }
    } else {

 if ( mode == 1) {//modo kilos
     info = "You <b>LOST: " + JSONData.daywl.toFixed(1) + " kg.</b> since yesterday.<br>" +
         "Your current weight is: <b>" + lbsToKgIndex(currentWeight).toFixed(1) + "kg.</b><br>";
     if (typeof JSONData.oml !== 'undefined' && (c == 2 || c == 4)) {

         info += "If you keep going at this rate then your projected weight after a month will be:<b> " + (lbsToKgIndex(currentWeight) - JSONData.oml).toFixed(1) + "kg</b>.<br>";
     }
 }
 if ( mode == 2) {//modo pounds
     info = "You <b>LOST: " + kgToLbs(JSONData.daywl).toFixed(1) + " pounds.</b> since yesterday.<br>" +
         "Your current weight is: <b>" + currentWeight.toFixed(1) + " pounds.</b><br>";
     if (typeof JSONData.oml !== 'undefined' && (c == 2 || c == 4)) {
         valueHTML = (currentWeight - kgToLbs(JSONData.oml)).toFixed(1)
  //console.log("mode 2 lose weight currentweigh : " + currentWeight + " kgToLb " + valueHTML )


         info += "If you keep going at this rate then your projected weight after a month will be:<b> " +valueHTML + " pounds</b>.<br>";
     }
 }
    }

    document.getElementById("demo").innerHTML = info

    BG.responsive(Math.ceil(trial / maxTrial * 100), 20)

if ( mode ==1 ) {
    currentTrial = new RecordTrial(trial, calories, steps, lbsToKgIndex(prevWeight), lbsToKgIndex(currentWeight));
}if( mode ==2 ){
    currentTrial = new RecordTrial(trial, calories, steps, prevWeight, currentWeight);
    }
    trialWeight[trial] = currentTrial;
    trialCurrWeight[trial]= currentTrial.initialWeight;
    chart.update();



   // console.log(" trial , stepQuestion " , trial, stepQuestion, (trial%stepQuestion)  ,  (trial%stepQuestion) ==0 )
    timeToAsk =  ((trial%stepQuestion) ==0);
/*
    if ( timeToAsk)
    {
        console.log(" voy a preguntar")
    }else{
        console.log(" no tooca")
    }*/
    trial++;


    if (trial <= maxTrial) {
        if(timeToAsk){
              div = document.getElementById("day")
        //div.innerHTML = " Participation completed";
//        document.getElementById("task").disabled = true;

        $("#debrief").hide();
        $("#slidecontainer").hide();
        $("#demo").hide();

        console.log("Ocultando canvas")
        $("#canvasdiv").hide();
        $("#canvasExp").hide()




             div = document.getElementById("day")
            div.innerHTML = "Day " + trial + " of " + maxTrial;
            resultDiv = document.getElementById("summary")

        $.getScript("Survey/SurveyCausal.js");


        }else {
            //  console.log("ready")
            div = document.getElementById("day")
            div.innerHTML = "Day " + trial + " of " + maxTrial;
            resultDiv = document.getElementById("summary")
        }

    } else {
        div = document.getElementById("day")
        div.innerHTML = " Participation completed";
        document.getElementById("task").disabled = true;

        $("#debrief").hide();
        $("#slidecontainer").hide();
        $("#demo").hide();

        console.log("Ocultando canvas")
        $("#canvasdiv").hide();
        $("#canvasExp").hide();
        experimentFinished = true;




        $.getScript("Survey/SurveyCausal.js");

        console.table(trialWeight)
        console.log("ultimo peso " + lbsToKgIndex(currentWeight).toFixed(1))

    }
}




function createDataset(){



    var config;
    JSONData = $().calculator({age: 35, currentWeight: 176.37, calories: 2323, endweight: 154, noise: false});
    //console.log(" dia " + JSONData.daywl + " mes  " + JSONData.oml + " ano " + JSONData.oyl);


    resultDiv = document.getElementById("result")
    // resultDiv.innerHTML = JSONData
    var result2 = JSON.parse(JSONData.jsonoutput);

    labels.push("start");
    if (mode ==1){
        dataw.push(80)
    }
    else if ( mode  == 2 ) {
        dataw.push(176.21)
    }else{

        console.log(" error MODE + "+ mode )
    }

    $.each(result2, function (k, val) {
           //      console.log(" " + k + " : " + result2[k].currentWeight)

        labels.push(parseInt(result2[k].week));

        if (mode ==1){
        dataw.push(lbsToKgIndex(parseFloat(result2[k].currentWeight)));
    }
    else if ( mode  == 2 ) {
         dataw.push(parseFloat(result2[k].currentWeight));
    }



    });



}

function fillData(name) {

    switch (name) {

        case "middleman":
            name = "Middle man";
            description = "";
            weight = "176.212";//80 kilos
            gender = 'M';
            endweightprofile = 130;
            age = 20;
            break;
        default:
            console.log("")
    }
    console.log(" Starting current weigh pounds" + weight + " kgs " + lbsToKgIndex(weight))
    currentWeight = weight;

    //  trialWeight[0 ] = 80;
    div = document.getElementById("day")
    div.innerHTML = "Day " + trial + " of " + maxTrial;

}




$(document).ready(function () {

    //        console.log("document loaded");
    $("#avatarselection").hide("fast", function () {
    });
    $("#slidecontainer").hide("fast", function () {
    });
    $("#surveyElement").Survey({model: survey});

   // createDataset()

    var slider = document.getElementById("myRange");
    var output = document.getElementById("calories");
    output.innerHTML = slider.value;

    var slider2 = document.getElementById("myRange2");
    var output2 = document.getElementById("steps");
    output2.innerHTML = slider2.value;

    slider.oninput = function () {
        output.innerHTML = this.value;
    }

    slider2.oninput = function () {
        output2.innerHTML = this.value;
    }
});


var BG = {}; // BAR GRAPH window object
var oldPct = 0;


// RESPONSIVE
BG.responsive = function (percentage, duration) {
    // Animate bar graph
    var count1 = oldPct,


        bar = $('.progress-responsive__bar'),
        interval1 = (Math.floor(duration / percentage) / 2),
        oldpct = percentage;
    incrementer1 = setInterval(function () {
        (count1 <= percentage) ? (bar.width(count1 + "%"), count1 += 0.5) : clearInterval(incrementer1);
    }, interval1);
    // Animate percent number
    var count2 = oldPct;
    percent = $('.progress-responsive__percent'),
        interval2 = Math.floor(duration / percentage),
        oldPct = percentage;
    incrementer2 = setInterval(function () {
        (count2 <= percentage) ? (percent.text(count2 + "%"), count2++) : clearInterval(incrementer2);
    }, interval2);
};




var chart;

function createChart() {
    var ctx = document.getElementById('canvasExp').getContext('2d');



    createDataset()
    config = {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Current Weight',
                backgroundColor: window.chartColors.red,
                borderColor: window.chartColors.red,
                data: trialCurrWeight,
                fill: false,
            },
            {
                label: 'Expected Weight',
                fill: false,
                backgroundColor: "#5bc8fa",
                borderColor: "#5bc8fa",
                data: dataw,
            }
        ]
    },
    options: {
        responsive: true,
        title: {
            display: true,
            text: 'Weight Loss Task'
        },
        tooltips: {
            mode: 'index',
            intersect: false,
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Day'
                }
            }],
            yAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: 'Weight'
                }
            }]
        }
    }
};

    chart = new Chart(ctx, config);


}


$('.closebtn').on('click', function () {
    $("#avatarselection").show("slow", function () {

    });
    $("#slidecontainer").hide("slow", function () {

    });
});

