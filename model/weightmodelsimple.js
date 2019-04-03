    (function($) {
        $.fn.calculator = function(options) {
            var opts = $.extend($.fn.calculator.defaults, options);
            return calculate();

        };

        $.fn.calculator.defaults = {
            age: 29,
            currentWeight: 250,
            height: 72,
            activity: 0.375,
            sex: "M",
            endweight: 180,
            calories: 1500,
            losstype: "calories",
            timeStamp: new Date(),
            bmrFormula: "HB",
            noise:false
           // flagMonthSetted: false,
           // flagYearSetted: false

        };

        function JSONOutput(
            date, lbs, newWeight, bmr,
            activityCalories, total,
            weekTotal, weekCalorieIntake, diff,
            week, startWeight , dailyLost,
            perdMes
        )
        {

            var d = new Date(date);

          //  console.log( "JSONOUTput week " + week +  " one month loss " + perdMes + " one year losss "+ this.oneYearLoss)
            var calcJSON= new CalculatorJSON(week,
                                             d,
                                             lbs,
                                             newWeight.toFixed(2),
                                             bmr.toFixed(2),
                                             activityCalories.toFixed(2),
                                             total.toFixed(2),
                                             (weekCalorieIntake / 7).toFixed(2),
                                              weekTotal.toFixed(2),
                                              diff.toFixed(2),
                                              (startWeight - newWeight).toFixed(2),
                                            dailyLost, perdMes

            )
         //   console.log(calcJSON);
            return calcJSON;
        }


        function CalculatorJSON(
            week,date,weightLost, currentWeight, bmr,
            activityCalories, dailyTotalExpenditure, dailyCalorieIntake,
            weeksTDEE, weekCalorieIntake, difference, dailyLost
            ,perdidames, perdidaano
        )
        {
            this.week=week;
            this.date=date;
            this.weightLost=weightLost;
            this.currentWeight=currentWeight;
            this.bmr=bmr;
            this.activityCalories=activityCalories;
            this.dailyTotalExpenditure=dailyTotalExpenditure;
            this.dailyCalorieIntake=dailyCalorieIntake;
            this.weeksTDEE= weeksTDEE;
            this.weekCalorieIntake=weekCalorieIntake;
            this.difference=difference;

        //    console.log( "calc Antes json week " + week + " dif " + difference  +  " one month loss " + perdidames + " one year losss "+ perdidaano)
           // console.log(" week setteando daily difference" + dailyLost +  " " + week)
            this.dailyDifference=dailyLost;


            }



        function calculate()
        {
            var weightLossDay = -1;

            var jsonOutputArray= new Array();
            var week = 0;
            var day = 0;
            var output = "";
            var startWeight = $.fn.calculator.defaults.currentWeight;

        //    console.log(" test current weight " + $.fn.calculator.defaults.currentWeight )

           while (($.fn.calculator.defaults.currentWeight > $.fn.calculator.defaults.endweight ) )
            {
                week++;

                 if (week == 200 ){
                     $.fn.calculator.defaults.currentWeight = $.fn.calculator.defaults.endweight -1
                     break;
                //     console.log(" No more calculations")
                 }

          //      console.log("Inicio semana "+ week)
                var BMR;
                var weekCalorieIntake;
                var dailyDifference;//new thing
                var diff;
                var lbs;
                $.fn.calculator.defaults.timeStamp.setDate($.fn.calculator.defaults.timeStamp.getDate() + 7);

                if ($.fn.calculator.defaults.sex == "M")
                {
                    if ($.fn.calculator.defaults.bmrFormula == "HB")
                    {
                        BMR = maleBMR($.fn.calculator.defaults.currentWeight, $.fn.calculator.defaults.height, $.fn.calculator.defaults.age);
                    }
                    else
                    {
                        BMR = maleMSJBMR($.fn.calculator.defaults.currentWeight, $.fn.calculator.defaults.height, $.fn.calculator.defaults.age);
                    }
                }
                else
                {
                    if ($.fn.calculator.defaults.bmrFormula == "HB")
                    {
                        BMR = femaleBMR($.fn.calculator.defaults.currentWeight, $.fn.calculator.defaults.height, $.fn.calculator.defaults.age);
                    }
                    else
                    {
                        BMR = femaleMSJBMR($.fn.calculator.defaults.currentWeight, $.fn.calculator.defaults.height, $.fn.calculator.defaults.age);
                    }
                }



                //Model 1 without noide
                //var activityCalories = BMR * $.fn.calculator.defaults.activity;

                //Model 2 with homeostasis //refine this , must be upwards when trend is gaining weight and downwards otherwose
                //Noise input 1
                if ( $.fn.calculator.defaults. noise )

                    var activityNoise = $.fn.calculator.defaults.activity * (1+ getRandomArbitrary(-.2,.05))
             else
                    var activityNoise = $.fn.calculator.defaults.activity
             //
                //         console.log(" activityNoise " + activityNoise)
                var activityCalories = BMR * activityNoise;

                  //Noise input 2
                //console.log(" BMR" +  BMR)

                if ( $.fn.calculator.defaults.noise)

                    var BMRNoise = BMR *  (1+ getRandomArbitrary(-.2,.05))
                else
                    var BMRNoise = BMR
                //   console.log(" BMRNoise" +  BMRNoise)
                //var total = BMR + activityCalories;
                var total = BMRNoise + activityCalories;

                var weekTotal = total * 7;
                if ($.fn.calculator.defaults.losstype == "calories")
                {//calorias * 7 l
                    weekCalorieIntake = $.fn.calculator.defaults.calories * 7;
                    diff = weekTotal - weekCalorieIntake;
                    lbs = (diff / 3500).toFixed(2);//3500 calorias es una libra
                }
                else
                {
                    lbs = $.fn.calculator.defaults.calories;
                    diff = lbs * 3500;
                    weekCalorieIntake = weekTotal - diff;
                }

                //agregar daily difference
                dailyDifference =  ((total - $.fn.calculator.defaults.calories) / 3500).toFixed(2);
                 weightLossDay =  ((total - $.fn.calculator.defaults.calories) / 3500).toFixed(2);//Valor 1


                if (week == 1 ){

                    this.dailyDifference2 = weightLossDay;
               //     console.log(" w daily differe" + dailyDifference2 +  " " + week)
                }



               // console.log( "ciclo calculate week " + week + " dif " + diff +  " one month loss " + this.oneMonthLoss + " one year losss "+ this.oneYearLoss)
                 $.fn.calculator.defaults.currentWeight = $.fn.calculator.defaults.currentWeight - lbs;

                  if ( week == 4 ){

                // console.log("*++++mes " + (startWeight-$.fn.calculator.defaults.currentWeight ));
                    this.perdidaMes = startWeight-$.fn.calculator.defaults.currentWeight.toFixed(2);

                 }


             //    console.log(" peso inicial "  +startWeight + " peso final semana " + $.fn.calculator.defaults.currentWeight)
         /*        if( startWeight < $.fn.calculator.defaults.currentWeight){
               //     console.log("puto gordo")
                     return { jsonoutput: JSON.stringify([]), daywl: -1 , oml : -1 , oyl : -1}  ;
                 }
*/
                  jsonOutputArray.push(
                      JSONOutput(
                      $.fn.calculator.defaults.timeStamp, lbs,
                      $.fn.calculator.defaults.currentWeight, BMR, activityCalories,
                      total, weekTotal, weekCalorieIntake, diff,
                      week, startWeight , this.dailyDifference2 , this.perdidaMes , this.perdidaAno
                  ));

               //   console.log("Fin semana "+ week)
            }


            return { jsonoutput: JSON.stringify(jsonOutputArray), daywl: lbsToKg(this.dailyDifference2) , oml : lbsToKg( this.perdidaMes ), oyl : lbsToKg(this.perdidaAno)}  ;
        }


function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

        function lbsToKg(lbs)
        {
            return lbs * .45;
        }

        function kgToLbs(kg)
        {
            return kg * 2.2;
        }

        function inchesToCm(inches)
        {
            return inches * 2.54;
        }
        function cmToInches(cm)
        {
            return cm * .39;
        }



        function maleBMR(weight, height, age)
        {
            return 66 + (6.3 * weight) + (12.9 * height) - (6.8 * age);
        }

        function femaleBMR(weight, height, age)
        {
            return 655 + (4.3 * weight) + (4.7 * height) - (4.7 * age);
        }

        function maleMSJBMR(weight, height, age)
        {

            return (10.0 * lbsToKg(weight)) + (6.25 * inchesToCm(height)) - (5.0 * age) + 5;
        }

        function femaleMSJBMR(weight, height, age)
        {
            return (10.0 * lbsToKg(weight)) + (6.25 * inchesToCm(height)) - (5.0 * age) - 161;
        }


    }(jQuery));