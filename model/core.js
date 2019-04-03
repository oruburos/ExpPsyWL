
var name, description, weight, gender;

function sliderFunc( ) {

    var slider = document.getElementById("myRange");
    var output = document.getElementById("calories");
    output.innerHTML = slider.value;
console.log("agregando funcion");
    $('.closebtn').on('click', function () {
        $("#avatarselection").show("slow", function () {

        });
        $("#slidecontainer").hide("slow", function () {

        });
    });

    slider.oninput = function () {
        output.innerHTML = this.value;
    }
}

function hideSlider(){
       console.log( 'document loaded' );
        console.log("body factory cargado")
         $( "#slidecontainer" ).hide( "fast", function() {

      });
    }


function calculateWeightLoss() {
  document.getElementById("demo").innerHTML = "Hello World";

  var calories = document.getElementById("myRange").value
   // alert("hola" + calories + Model.msgmodel)
    //int1 = Model.BodyChange(90, calories , 50, 0, 4000);

    //int2 =  BodyModel.createFromBaseline(int1)

    //console.log( int2.dtherm)

}

    function fillData( name){

        switch(name) {
        case "skinnyman":
            name ="Skinny man";
            description="Description random sa";
            weight = "60";
            gender = 'male';
            break;
        case "skinnywoman":
            name ="Skinny woman";
            description="Descripti sa";
            weight = "40";
            gender = 'female';
            break;
        case "fatman":
            name ="fatman man";
            description="Description random sa";
            weight = "110";
            gender = 'male';
            break;
        case "fatwoman":
            name ="fat woman";
            description="Descripti sa";
            weight = "80";
            gender = 'female';
            break;
        case "middlewoman":
            name ="Middle woman";
            description="Description random sa";
            weight = "60";
            gender = 'female';
            break;
        case "middleman":
            name ="Middle man";
            description="escripti sa";
            weight = "80";
            gender = 'male';
            break;
        default:
            console.log("no se supoen")
        }
        console.log(" values " + weight)
        div = document.getElementById("imgtext")
        div.innerHTML = "Weight:"+ weight+"<br>Gender:" + gender;
    }

    function myFunction(imgs) {
          console.log(imgs.id)
         fillData(imgs.id )
         $( "#avatarselection" ).hide( "slow", function() {

        });
         $( "#slidecontainer" ).show( "slow", function() {

      });
    }


