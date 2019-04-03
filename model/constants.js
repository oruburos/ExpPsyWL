'use strict'
var constants = {'LeisureActivityLevel' :{
		VeryLight: {
			name: 'Very Light',
			description: 'Almost no activity at all.',
			sortOrder: 1
		},
		Light: {
			name: 'Light',
			description: 'Walking, non-strenuous cycling or gardening approximately once a week.',
			sortOrder: 2
		},
		Moderate: {
			name: 'Moderate',
			description: 'Regular activity at least once a week, e.g., walking, bicycling (including to work) or gardening.',
			sortOrder: 3
		},
		Active: {
			name: 'Active',
			description: 'Regular activities more than once a week, e.g., intense walking, bicycling or sports.',
			sortOrder: 4
		},
		VeryActive: {
			name: 'Very Active',
			description: 'Strenuous activities several times a week.',
			sortOrder: 5
		}
	},

	'WorkActivityLevel': {
		VeryLight: {
			name: 'Very Light',
			description: 'Sitting at the computer most of the day, or sitting at a desk.',
            sortOrder: 1
		},
		Light: {
			name: 'Light',
			description: 'Light industrial work, sales or office work that comprises light activities.',
			sortOrder: 2
		},
		Moderate: {
			name: 'Moderate',
			description: 'Cleaning,  kitchen staff, or delivering mail on foot or by bicycle.',
			sortOrder: 3
		},
		Heavy: {
			name: 'Heavy',
			description: 'Heavy industrial work, construction work or farming.',
			sortOrder: 4
		}
	}
};
//body change
(function () {

    var bodyChangeFactory = function () {
        var BodyChange = function (df, dl, dg, dDecw, dtherm) {
            this.df = df || 0;
            this.dl = dl || 0;
            this.dg = dg || 0;
            this.dDecw = dDecw || 0;
            this.dtherm = dtherm || 0;
        };

        return BodyChange;
    };


}());


(function () {

    var bodyModelFactory = function (BodyChange, DailyParams) {
        var BodyModel = function (fat, lean, glycogen, decw, therm) {
            this.RK4wt = [1, 2, 2, 1];
            this.fat = fat || 0;
            this.lean = lean || 0;
            this.glycogen = glycogen || 0;
            this.decw = decw || 0;
            this.therm = therm || 0;
        };

        BodyModel.createFromBaseline = function (baseline) {
            return new BodyModel(
				baseline.getFatWeight(),
				baseline.getLeanWeight(),
				baseline.glycogen,
				baseline.dECW,
				baseline.getTherm()
			);
        };

        BodyModel.projectFromBaseline = function (baseline, dailyParams, simlength) {
            //Creates a BodyModel projected from the given baseline, using the input DailyParameters for simlength days
            var loop = BodyModel.createFromBaseline(baseline);
            //console.log("loop: " + JSON.stringify(loop));
            for (var i = 0; i < simlength ; i++) {
                loop = BodyModel.RungeKatta(loop, baseline, dailyParams);
                //console.log("loop: " + JSON.stringify(loop));
            }
             return loop;
        };

        BodyModel.projectFromBaselineViaIntervention = function (baseline, intervention, simlength) {
            ////intervention.sodium = 4000;
            //console.log("baseline: " + JSON.stringify(baseline));
            //console.log("intervention: " + JSON.stringify(intervention));
            //console.log("simlength: " + JSON.stringify(simlength));



            var dailyParams = new DailyParams.createFromIntervention(intervention, baseline);
            //console.log("dailyParams: " + JSON.stringify(dailyParams));
            return BodyModel.projectFromBaseline(baseline, dailyParams, simlength);
        };

        BodyModel.prototype.getWeight = function (baseline) {
            var weight = this.fat + this.lean + baseline.getGlycogenH2O(this.glycogen) + this.decw;
            //console.log(weight + " = " + this.fat + " " + this.lean + " " + baseline.getGlycogenH2O(this.glycogen) + " " + this.decw);
            //console.log(weight);
            return weight
        };

        BodyModel.prototype.getapproxWeight = function () {
            return this.fat + this.lean + this.dECW;
        };

        BodyModel.prototype.getFatFree = function (baseline) {
            return this.getWeight(baseline) - this.fat;
        };

        BodyModel.prototype.getFatPercent = function (baseline) {
            return this.fat / this.getWeight(baseline) * 100.0;
        };

        BodyModel.prototype.getBMI = function (baseline) {
            return baseline.getNewBMI(this.getWeight(baseline));
        };

        BodyModel.prototype.dt = function (baseline, dailyParams) {
            var df = this.dfdt(baseline, dailyParams),
				dl = this.dldt(baseline, dailyParams),
				dg = this.dgdt(baseline, dailyParams),
				dDecw = this.dDecwdt(baseline, dailyParams),
				dtherm = this.dthermdt(baseline, dailyParams);

            return new BodyChange(df, dl, dg, dDecw, dtherm);
        };

        BodyModel.RungeKattaAveraged = function (bodyModel, baseline, dailyParams1, dailyParams2) {
            var midailyParams = dailyParams2.isramped() ? dailyParams2 : DailyParams.avg(dailyParams1, dailyParams2),
				dt1 = bodyModel.dt(baseline, dailyParams1),
				b2 = bodyModel.addchange(dt1, 0.5),
				dt2 = b2.dt(baseline, midailyParams),
				b3 = bodyModel.addchange(dt2, 0.5),
				dt3 = b3.dt(baseline, midailyParams),
				b4 = bodyModel.addchange(dt3, 1.0),
				dt4 = b4.dt(baseline, dailyParams2),
				finaldt = bodyModel.avgdt_weighted(this.RK4wt, [dt1, dt2, dt3, dt4]),
				finalstate = bodyModel.addchange(finaldt, 1.0);

            return finalstate;
        };

        BodyModel.RungeKatta = function (bodyModel, baseline, dailyParams) {

            var dt1 = bodyModel.dt(baseline, dailyParams),
				b2 = bodyModel.addchange(dt1, 0.5),
				dt2 = b2.dt(baseline, dailyParams),
				b3 = bodyModel.addchange(dt2, 0.5),
				dt3 = b3.dt(baseline, dailyParams),
				b4 = bodyModel.addchange(dt3, 1.0),
				dt4 = b4.dt(baseline, dailyParams),
				finaldt = bodyModel.avgdt_weighted(this.RK4wt, [dt1, dt2, dt3, dt4]),
				finalstate = bodyModel.addchange(finaldt, 1.0);
            //console.log(dt1 + " " + b2 + " " + dt2 + " " + b3 + " " + dt3 + " " + b4 + " " + dt4 + " " + finaldt + " " + finalstate);
            //console.log(JSON.stringify(dt1));
            return finalstate;
        };

        BodyModel.Euler = function (bodyModel, baseline, dailyParams) {
            var dt1 = bodyModel.dt(baseline, dailyParams);
            return bodyModel.addchange(dt1, 1.0);
        };

        BodyModel.prototype.getTEE = function (baseline, dailyParams) {
            var p = this.getp(),
				calin = dailyParams.calories,
				carbflux = this.carbflux(baseline, dailyParams),
				Expend = this.getExpend(baseline, dailyParams);
            //console.log(p + ", " + calin + ", " + carbflux + ", " + Expend);
            return (Expend + (calin - carbflux) * ((1.0 - p) * 180.0 / 9440.0 + p * 230.0 / 1807.0)) / (1.0 + p * 230.0 / 1807.0 + (1.0 - p) * 180.0 / 9440.0);

        };

        BodyModel.prototype.getExpend = function (baseline, dailyParams) {
            var TEF = 0.1 * dailyParams.calories,
				weight = baseline.getNewWeightFromBodyModel(this);
            //console.log(JSON.stringify(TEF) + ", " + JSON.stringify(weight));
            return baseline.getK() + 22.0 * this.lean + 3.2 * this.fat + dailyParams.actparam * weight + this.therm + TEF;
        };

        BodyModel.prototype.getp = function () {
            return 1.990762711864407 / (1.990762711864407 + this.fat);
        };

        BodyModel.prototype.carbflux = function (baseline, dailyParams) {
            var k_carb = baseline.getCarbsIn() / Math.pow(baseline.glycogen, 2.0);
            return dailyParams.getCarbIntake() - k_carb * Math.pow(this.glycogen, 2.0);
        };

        BodyModel.prototype.Na_imbal = function (baseline, dailyParams) {
            return dailyParams.sodium - baseline.sodium - 3000.0 * this.decw - 4000.0 * (1.0 - dailyParams.getCarbIntake() / baseline.getCarbsIn());
        };

        BodyModel.prototype.dfdt = function (baseline, dailyParams) {
            //console.log("dp: "+JSON.stringify(dailyParams));
            var dfdt = (1.0 - this.getp()) * (dailyParams.calories - this.getTEE(baseline, dailyParams) - this.carbflux(baseline, dailyParams)) / 9440.0;
            //console.log(this.carbflux(baseline, dailyParams));
            return dfdt;
        };

        BodyModel.prototype.dldt = function (baseline, dailyParams) {
            var dldt = this.getp() * (dailyParams.calories - this.getTEE(baseline, dailyParams) - this.carbflux(baseline, dailyParams)) / 1807.0;
            return dldt;
        };

        BodyModel.prototype.dgdt = function (baseline, dailyParams) {
            return this.carbflux(baseline, dailyParams) / 4180.0;
        };

        BodyModel.prototype.dDecwdt = function (baseline, dailyParams) {
            return this.Na_imbal(baseline, dailyParams) / 3220.0;
        };

        BodyModel.prototype.dthermdt = function (baseline, dailyParams) {
            return (0.14 * dailyParams.calories - this.therm) / 14.0;
        };

        BodyModel.prototype.addchange = function (bchange, tstep) {
            return new BodyModel(
				this.fat + tstep * bchange.df,
				this.lean + tstep * bchange.dl,
				this.glycogen + tstep * bchange.dg,
				this.decw + tstep * bchange.dDecw,
				this.therm + tstep * bchange.dtherm
			);
        };

        BodyModel.prototype.cals4balance = function (baseline, act) {
            var weight = this.getWeight(baseline),
				Expend_no_food = baseline.getK() + 22.0 * this.lean + 3.2 * this.fat + act * weight,
				p = this.getp(),
				p_d = 1.0 + p * 230.0 / 1807.0 + (1.0 - p) * 180.0 / 9440.0,
				p_n = (1.0 - p) * 180.0 / 9440.0 + p * 230.0 / 1807.0,
				maint_nocflux = Expend_no_food / (p_d - p_n - 0.24);

            return maint_nocflux;
        };

        BodyModel.Bodytraj = function (baseline, paramtraj) {
            var simlength = paramtraj.length,
				bodytraj = [];

            bodytraj.push(new BodyModel(baseline));

            for (var i = 1; i < simlength; i++)
                bodytraj.push(BodyModel.RungeKatta(bodytraj[(i - 1)], baseline, paramtraj[(i - 1)], paramtraj[i]));

            return bodytraj;
        };

        BodyModel.prototype.avgdt = function (bchange) {
            var sumf = 0.0,
				suml = 0.0,
				sumg = 0.0,
				sumdecw = 0.0,
				sumtherm = 0.0;

            for (var i = 0; i < bchange.length; i++) {
                sumf += bchange[i].df;
                suml += bchange[i].dl;
                sumg += bchange[i].dg;
                sumdecw += bchange[i].dDecw;
                sumtherm += bchange[i].dtherm;
            }

            var nf = sumf / bchange.length,
				nl = suml / bchange.length,
				ng = sumg / bchange.length,
				ndecw = sumdecw / bchange.length,
				ntherm = sumtherm / bchange.length;

            return new BodyChange(nf, nl, ng, ndecw, ntherm);
        };

        BodyModel.prototype.avgdt_weighted = function (wt, bchange) {
            var sumf = 0.0,
				suml = 0.0,
				sumg = 0.0,
				sumdecw = 0.0,
				sumtherm = 0.0,
				wti = 0,
				wtsum = 0;

            for (var i = 0; i < bchange.length; i++) {
                try {
                    wti = wt[i];
                }
                catch (e) {
                    wti = 1;
                }

                wti = (wti < 0) ? 1 : wti;
                wtsum += wti;
                sumf += wti * bchange[i].df;
                suml += wti * bchange[i].dl;
                sumg += wti * bchange[i].dg;
                sumdecw += wti * bchange[i].dDecw;
                sumtherm += wti * bchange[i].dtherm;
            }

            var nf = sumf / wtsum,
				nl = suml / wtsum,
				ng = sumg / wtsum,
				ndecw = sumdecw / wtsum,
				ntherm = sumtherm / wtsum;

            return new BodyChange(nf, nl, ng, ndecw, ntherm);
        };

        return BodyModel;
    };

}()


/*Baseline*/
(function () {

    var baselineFactory = function () {
        var MAX_AGE = 250.0,
            INITIAL_AGE = 23.0,
            MIN_HEIGHT = 0.1,
            MAX_HEIGHT = 400.0,
            INITIAL_HEIGHT = 180.0,
            MIN_WEIGHT = 0.1,
            INITIAL_WEIGHT = 70.0,
            MIN_BFP = 0.0,
            MAX_BFP = 100.0,
            INITIAL_BFP = 18.0,
            INITIAL_RMR = 1708.0,
            MIN_PAL = 1.0,
            INITIAL_PAL = 1.6,
            INITIAL_CARB_INTAKE_PCT = 50.0,
            INITIAL_SODIUM = 4000.0,
            INITIAL_GLYCOGEN = 0.5,
            INITIAL_DELTA_E = 0,
            INITIAL_DECW = 0;

        var Baseline = function (isMale, age, height, weight, bfp, rmr, pal) {
            this.isMale = isMale ? isMale : true;
            this.bfpCalc = this.bfpCalc || true;
            this.rmrCalc = this.rmrCalc || false;

            this.age = age || INITIAL_AGE;
            this.maximumage = MAX_AGE;

            this.height = height || INITIAL_HEIGHT;
            this.height = (this.height < 0.0) ? MIN_HEIGHT : this.height;
            this.height = (this.height > MAX_HEIGHT) ? MAX_HEIGHT : this.height;

            this.weight = weight || INITIAL_WEIGHT;
            this.weight = (this.weight < 0.0) ? MIN_WEIGHT : this.weight;

            this.bfp = bfp || INITIAL_BFP;
            this.bfp = (this.bfp < MIN_BFP) ? MIN_BFP : this.bfp;
            this.bfp = (this.bfp > MAX_BFP) ? MAX_BFP : this.bfp;

            this.rmr = rmr || INITIAL_RMR;

            this.pal = pal || INITIAL_PAL;
            this.pal = (this.pal < MIN_PAL) ? MIN_PAL : this.pal;

            this.carbIntakePct = INITIAL_CARB_INTAKE_PCT;
            this.sodium = INITIAL_SODIUM;
            this.delta_E = INITIAL_DELTA_E;
            this.dECW = INITIAL_DECW;
            this.glycogen = INITIAL_GLYCOGEN;
        };

        Baseline.prototype.getNewAct = function (intervention) {
            return intervention && intervention.getAct(this);
        };

        Baseline.prototype.getBFP = function () {
            if (this.bfpCalc) {
                if (this.isMale)
                    this.bfp = (0.14 * this.age + 37.310000000000002 * Math.log(this.getBMI()) - 103.94);
                else
                    this.bfp = (0.14 * this.age + 39.960000000000001 * Math.log(this.getBMI()) - 102.01000000000001);

                this.bfp = (this.bfp < 0.0) ? 0.0 : this.bfp;
                this.bfp = (this.bfp > 60.0) ? 60.0 : this.bfp;
            }

            return this.bfp;
        };

        Baseline.prototype.getHealthyWeightRange = function () {
            var healthyWeightRange = {};
            healthyWeightRange.low = Math.round(18.5 * Math.pow((this.height / 100), 2));
            healthyWeightRange.high = Math.round(25 * Math.pow((this.height / 100), 2))
            return healthyWeightRange;
        };

        Baseline.prototype.getRMR = function () {
            if (!this.rmrCalc) {
                if (this.isMale)
                    this.rmr = (9.99 * this.weight + 625.0 * this.height / 100.0 - 4.92 * this.age + 5.0);
                else
                    this.rmr = (9.99 * this.weight + 625.0 * this.height / 100.0 - 4.92 * this.age - 161.0);
            }

            return this.rmr;
        };

        Baseline.prototype.getNewRMR = function (newWeight, day) {
            var rmr;

            if (this.isMale)
                rmr = 9.99 * newWeight + 625.0 * this.height / 100.0 - 4.92 * (this.age + day / 365.0) + 5.0;
            else
                rmr = 9.99 * newWeight + 625.0 * this.height / 100.0 - 4.92 * (this.age + day / 365.0) - 161.0;

            return rmr;
        };

        Baseline.prototype.getMaintCals = function () {
            return this.pal * this.getRMR();
        };

        Baseline.prototype.getActivityParam = function () {
            return (0.9 * this.getRMR() * this.pal - this.getRMR()) / this.weight;
        };

        Baseline.prototype.getTEE = function () {
            return this.pal * this.getRMR();
        };

        Baseline.prototype.getActivityExpenditure = function () {
            return this.getTEE() - this.getRMR();
        };

        Baseline.prototype.getFatWeight = function () {
            //console.log(this.weight+" * "+this.getBFP())
            return this.weight * this.getBFP() / 100.0;
        };

        Baseline.prototype.getLeanWeight = function () {
            return this.weight - this.getFatWeight();
        };

        Baseline.prototype.getK = function () {
            return 0.76 * this.getMaintCals() - this.delta_E - 22.0 * this.getLeanWeight() - 3.2 * this.getFatWeight() - this.getActivityParam() * this.weight;
        };

        Baseline.prototype.getBMI = function () {
            return this.weight / Math.pow(this.height / 100.0, 2.0);
        };

        Baseline.prototype.getNewBMI = function (newWeight) {
            return newWeight / Math.pow(this.height / 100.0, 2.0);
        };

        Baseline.prototype.getECW = function () {
            var ECW;

            if (this.isMale)
                ECW = 0.025 * this.age + 9.57 * this.height + 0.191 * this.weight - 12.4;
            else
                ECW = -4.0 + 5.98 * this.height + 0.167 * this.weight;

            return ECW;
        };

        Baseline.prototype.getNewECW = function (days, newWeight) {
            var ECW;

            if (this.isMale)
                ECW = 0.025 * (this.age + days / 365.0) + 9.57 * this.height + 0.191 * newWeight - 12.4;
            else
                ECW = -4.0 + 5.98 * this.height + 0.167 * newWeight;

            return ECW;
        };

        Baseline.prototype.proportionalSodium = function (newCals) {
            return this.sodium * newCals / this.getMaintCals();
        };

        Baseline.prototype.getCarbsIn = function () {
            return this.carbIntakePct / 100.0 * this.getMaintCals();
        };

        Baseline.prototype.setCalculatedBFP = function (bfpcalc) {
            this.bfp = this.getBFP();
            this.bfpCalc = bfpcalc;
        };

        Baseline.prototype.setCalculatedRMR = function (rmrcalc) {
            this.rmr = this.getRMR();
            this.rmrCalc = rmrcalc;
        };

        Baseline.prototype.getGlycogenH2O = function (newGlycogen) {
            return 3.7 * (newGlycogen - this.glycogen);
        };

        Baseline.prototype.getTherm = function () {
            return 0.14 * this.getTEE();
        };

        Baseline.prototype.getBodyComposition = function () {
            return [
                this.weight * this.bfp / 100.0,
                this.weight * (100.0 - this.bfp) / 100.0,
                this.dECW
            ];
        };

        Baseline.prototype.getNewWeight = function (fat, lean, glycogen, deltaECW) {
            return fat + lean + this.getGlycogenH2O(glycogen) + deltaECW;
        };

        Baseline.prototype.getNewWeightFromBodyModel = function (bodyModel) {
            return bodyModel.fat + bodyModel.lean + this.getGlycogenH2O(bodyModel.glycogen) + bodyModel.decw;
        };

        Baseline.prototype.glycogenEquation = function (caloricIntake) {
            return this.glycogen * Math.sqrt(this.carbIntakePct / 100.0 * caloricIntake / this.getCarbsIn());
        };

        Baseline.prototype.deltaECWEquation = function (caloricIntake) {
            return ((this.sodium / this.getMaintCals() + 4000.0 * this.carbIntakePct / (100.0 * this.getCarbsIn())) * caloricIntake - (this.sodium + 4000.0)) / 3000.0;
        };

        Baseline.prototype.getStableWeight = function (fat, lean, caloricIntake) {
            var newGlycogen = this.glycogenEquation(caloricIntake),
                glycogenH2O = this.getGlycogenH2O(newGlycogen),
            	deltaECW = this.deltaECWEquation(caloricIntake);

            return fat + lean + glycogenH2O + deltaECW;
        };

        Baseline.prototype.getBodyState = function () {
            return new BodyModel(this);
        };

        Baseline.prototype.getNewTEE = function (bodyModel, dailyParams) {
            return bodyModel.getTEE(this, dailyParams);
        };

        //Baseline.prototype.makeBaseIntervention = function (day) {
        //    return new Intervention($window.parseInt(day, 10), this.getTEE(), this.CarbInPercent, this.pal, this.Sodium);
        //};

        return Baseline;
    };

}())


/* daily param**/
(function () {
    var dailyParamsFactory = function () {
        var DailyParams = function (calories, carbpercent, sodium, actparam) {
            this.calories = calories || 0;
            this.calories = (this.calories < 0) ? 0 : this.calories;
            this.carbpercent = carbpercent || 0;
            this.carbpercent = (this.carbpercent < 0) ? 0 : this.carbpercent;
            this.carbpercent = (this.carbpercent > 100.0) ? 100.0 : this.carbpercent;
            this.sodium = sodium || 0;
            this.sodium = (this.sodium < 0) ? 0 : this.sodium;
            this.actparam = actparam || 0;
            this.actparam = (this.actparam < 0) ? 0 : this.actparam;
            this.flag = this.flag || false;
            this.ramped = this.ramped || false;
        };

        DailyParams.createFromBaseline = function (baseline) {
            return new DailyParams(
        		baseline.getMaintCals(),
        		baseline.carbIntakePct,
        		baseline.sodium,
        		baseline.getActivityParam()
        	);
        };

        DailyParams.createFromIntervention = function (intervention, baseline) {
            return new DailyParams(
        		intervention.calories,
        		intervention.carbinpercent,
        		intervention.sodium,
        		intervention.getAct(baseline)
        	);
        };

        DailyParams.prototype.getCarbIntake = function () {
            return this.carbpercent / 100.0 * this.calories;
        };

        DailyParams.prototype.makeCaloricCopy = function (calorie) {
            var ncals = this.calories + calorie;
            ncals = (ncals < 0.0) ? 0.0 : ncals;
            return new DailyParams(ncals, this.carbpercent, this.sodium, this.actparam);
        };

        DailyParams.avg = function (dailyParams1, dailyParams2) {
            var calories = (dailyParams1.calories + dailyParams2.calories) / 2.0,
        		sodium = (dailyParams1.sodium + dailyParams2.sodium) / 2.0,
        		carbpercent = (dailyParams1.carbpercent + dailyParams2.carbpercent) / 2.0,
        		actparam = (dailyParams1.actparam + dailyParams2.actparam) / 2.0;

            return new DailyParams(calories, carbpercent, sodium, actparam);
        };

        DailyParams.makeparamtrajectory = function (baseline, intervention1, intervention2, simlength) {
            //console.log("int1: "+ JSON.stringify(intervention1));
            //console.log("int2: " + JSON.stringify(intervention2));

            var maintcals = baseline.getMaintCals(),
        		carbinp = baseline.carbIntakePct,
        		act = baseline.getActivityParam(),
        		Na = baseline.sodium,
        		paramtraj = [],
        		noeffect1 = (!intervention1.on) || ((intervention1.on) && (intervention1.day > simlength) && (!intervention1.rampon)),
        		noeffect2 = (!intervention2.on) || ((intervention2.on) && (intervention2.day > simlength) && (!intervention2.rampon)),
        		noeffect = noeffect1 && noeffect2,
        		sameday = intervention1.day === intervention2.day,
        		oneon = ((intervention1.on) && (!intervention2.on)) || ((!intervention1.on) && (intervention2.on)),
        		bothon = (intervention1.on) && (intervention2.on),
        		i = 0,
        		dcal = 0.0,
        		dact = 0.0,
        		dcarb = 0.0,
        		dsodium = 0.0,
        		dailyParams = null;

            paramtraj.push(DailyParams.createFromBaseline(baseline));

            //console.log( (intervention1.day > parseInt(simlength)) + " = " + intervention1.day + ">" + parseInt(simlength) )

            if (noeffect) {
                for (i = 1; i < simlength; i++)
                    paramtraj[i] = DailyParams.createFromBaseline(baseline);
            } else if ((oneon) || ((bothon) && (sameday) && (intervention2.rampon))) {
                var intervention;

                if (oneon)
                    intervention = intervention1.on ? intervention1 : intervention2;
                else
                    intervention = intervention2;

                if (intervention.rampon) {
                    for (i = 1; i < intervention.day ; i++) {
                        dcal = maintcals + i / intervention.day * (intervention.calories - maintcals);
                        dact = act + i / intervention.day * (intervention.getAct(baseline) - act);
                        dcarb = carbinp + i / intervention.carbinpercent * (intervention.carbinpercent - carbinp);
                        dsodium = Na + i / intervention.day * (intervention.sodium - Na);
                        dailyParams = new DailyParams(dcal, dcarb, dsodium, dact);
                        dailyParams.ramped = true;

                        paramtraj.push(dailyParams);
                    }

                    for (i = intervention.day ; i < simlength; i++)
                        paramtraj.push(DailyParams.createFromIntervention(intervention, baseline));
                } else {
                    for (i = 1; i < intervention.day ; i++)
                        paramtraj.push(DailyParams.createFromBaseline(baseline));

                    for (i = intervention.day ; i < simlength; i++)
                        paramtraj.push(DailyParams.createFromIntervention(intervention, baseline));
                }
            } else {
                var firstIntervention = intervention1.day < intervention2.day ? intervention1 : intervention2,
        			secondIntervention = intervention1.day < intervention2.day ? intervention2 : intervention1;

                if (firstIntervention.rampon) {
                    for (i = 1; i < firstIntervention.day ; i++) {
                        dcal = maintcals + i / firstIntervention.day * (firstIntervention.calories - maintcals);
                        dact = act + i / firstIntervention.day * (firstIntervention.getAct(baseline) - act);
                        dcarb = carbinp + i / firstIntervention.carbinpercent * (firstIntervention.carbinpercent - carbinp);
                        dsodium = Na + i / firstIntervention.day * (firstIntervention.sodium - Na);
                        dailyParams = new DailyParams(dcal, dcarb, dsodium, dact);
                        dailyParams.ramped = true;

                        paramtraj.push(dailyParams);
                    }
                } else {
                    for (i = 1; i < firstIntervention.day ; i++)
                        paramtraj.push(DailyParams.createFromBaseline(baseline));
                }

                if (secondIntervention.rampon) {
                    for (i = firstIntervention.day ; i < secondIntervention.day ; i++) {
                        var firstCalories = firstIntervention.calories,
        					firstDay = firstIntervention.day,
        					firstSodium = firstIntervention.sodium,
        					firstAct = firstIntervention.getAct(baseline),
        					firstCarbIn = firstIntervention.carbinpercent,
        					secondCalories = secondIntervention.calories,
        					secondDay = secondIntervention.day,
        					secondSodium = secondIntervention.sodium,
        					secondAct = secondIntervention.getAct(baseline),
        					secondCarbIn = secondIntervention.carbinpercent;

                        dcal = firstCalories + (i - firstDay) / (secondDay - firstDay) * (secondCalories - firstCalories);
                        dact = firstAct + (i - firstDay) / (secondDay - firstDay) * (secondAct - firstAct);
                        dcarb = firstCarbIn + (i - firstDay) / (secondDay - firstDay) * (secondCarbIn - firstCarbIn);
                        dsodium = firstSodium + (i - firstDay) / (secondDay - firstDay) * (secondSodium - firstSodium);
                        dailyParams = new DailyParams(dcal, dcarb, dsodium, dact);
                        dailyParams.ramped = true;

                        paramtraj.push(dailyParams);
                    }
                } else {
                    var endfirst = Math.min(secondIntervention.day, parseInt(simlength, 10));

                    for (i = firstIntervention.day ; i < endfirst; i++)
                        paramtraj.push(DailyParams.createFromIntervention(firstIntervention, baseline));
                }

                if (simlength > secondIntervention.day)
                    for (i = secondIntervention.day ; i < simlength; i++)
                        paramtraj.push(DailyParams.createFromIntervention(secondIntervention, baseline));
            }

            return paramtraj;
        };

        return DailyParams;
    };


}())



//Intervention
(function () {

    var interventionFactory = function (BodyModel) {
        var MIN_CALORIES = 0.0,
            INITIAL_CALORIES = 2200.0,
            MIN_CARB_INTAKE_PCT = 0.0,
            MAX_CARB_INTAKE_PCT = 100.0,
            INITIAL_CARB_INTAKE_PCT = 50.0,
            INITIAL_PAL = 1.6,
            MIN_SODIUM = 0.0,
            MAX_SODIUM = 50000.0,
            INITIAL_SODIUM = 4000.0,
            MIN_ACTIVITY_CHG_PCT = -100.0,
            INITIAL_ACTIVITY_CHG_PCT = 0.0;

        var Intervention = function (day, calories, carbinpercent, actchangepercent, sodium) {
            this.calories = (calories && calories >= MIN_CALORIES) ? calories : INITIAL_CALORIES;
            this.carbinpercent = (carbinpercent && (carbinpercent >= MIN_CARB_INTAKE_PCT) && (carbinpercent <= MAX_CARB_INTAKE_PCT)) ? carbinpercent : INITIAL_CARB_INTAKE_PCT;
            this.PAL = INITIAL_PAL;
            this.sodium = (sodium && (sodium >= MIN_SODIUM) && (sodium <= MAX_SODIUM)) ? sodium : INITIAL_SODIUM;
            this.on = this.on || true;
            this.rampon = this.rampon || false;
            this.actchangepercent = (actchangepercent && actchangepercent >= MIN_ACTIVITY_CHG_PCT) ? actchangepercent : INITIAL_ACTIVITY_CHG_PCT;
            this.day = day || 100;
            this.title = "";
            this.isdetailed = this.isdetailed || false;
        };

        Intervention.forgoal = function (baseline, goalwt, goaltime, actchangepercent, mincals, eps) {
            var logMessage = '',
                holdcals = 0.0;
            //We create the Intervention
            var goalinter = new Intervention();

            //We then set it's title and to start immediately
            goalinter.title = "Goal Intervention";
            goalinter.day = 1;

            //We set the calories to their minimum
            goalinter.calories= mincals;

            //Enter in the activity change level
            goalinter.actchangepercent = actchangepercent;

            //We use the baseline values for carbs and sodium)
            goalinter.carbinpercent = baseline.carbIntakePct;
            goalinter.setproportionalsodium(baseline);

            //console.log("goalinter: " + JSON.stringify(goalinter));
            if ((baseline.weight == goalwt) && (actchangepercent == 0)) {
                goalinter.calories = baseline.getMaintCals();
                goalinter.setproportionalsodium(baseline);
            } else {
                var starvtest = BodyModel.projectFromBaselineViaIntervention(baseline, goalinter, goaltime);
                //console.log("starvtest: " + JSON.stringify(starvtest));


                var starvwt = starvtest.getWeight(baseline);
                starvwt = (starvwt < 0) ? 0 : starvwt;

                var error = Math.abs(starvwt - goalwt);

                if ((error < eps) || (goalwt <= starvwt)) {
                    logMessage = 'PROBLEM in calsforgoal'
                        + '    error is ' + error
                        + '    starvwt is' + starvwt
                        + '    starv[0] is' + starvtest.fat
                        + '    starv[1] is' + starvtest.lean
                        + '    starv[2] is' + starvtest.decw
                        + '    goalwt is' + goalwt
                        + '    mincals is ' + mincals
                        + '    goalwt is ' + goalwt
                        + '    goaltime is ' + goaltime
                        + '    eps is ' + eps;
                    //$log.error(logMessage);

                    goalinter.calories = 0.0;

                    throw "Unachievable Goal";
                }

                var checkcals = mincals;
                var calstep = 200.0;

                //$log.info('Entering loop...');
                //$log.info('First calstep in cals for goal = ' + calstep);

                var i = 0;

                var PCXerror = 0;
                do {
                    i++;
                    holdcals = checkcals;
                    checkcals += calstep;

                    goalinter.calories = checkcals;
                    goalinter.setproportionalsodium(baseline);

                    var testbc = BodyModel.projectFromBaselineViaIntervention(baseline, goalinter, goaltime);
                    var testwt = testbc.getWeight(baseline);

                    //console.log(JSON.stringify(testbc) + ", " + JSON.stringify(testwt));

                    if (testwt < 0.0) {
                        PCXerror++;
                        console.log("NEGATIVE testwt " + PCXerror);
                        if (PCXerror>10){
                            throw "Unachievable Goal";
                        }
                     }
                    error = Math.abs(goalwt - testwt);

                    if (i == 0) {
                        logMessage = 'Loop report ' + i
                            + '    error=' + error
                            + '    bc=' + testbc.fat + ',' + testbc.lean
                            + '    testwt=' + testwt
                            + '    calstep=' + calstep
                            + '    holdcals=' + holdcals;
                        $log.error(logMessage);
                    }

                    if ((error > eps) && (testwt > goalwt)) {
                        calstep /= 2.0;
                        checkcals = holdcals;
                    }
                } while (error > eps);

                //logMessage = 'Exiting loop after ' + i + ' iterations, result is ' + holdcals + ', error = ' + error + ', calstep = ' + calstep;
                //$log.info(logMessage);
            }

            return goalinter;
        };

        //Intervention.prototype.getPAL_Act = function (baseline) {
        //    return baseline.getActivityParam() * (this.PAL - 1.0) / (baseline.getPAL() - 1.0);
        //};

        Intervention.prototype.getAct = function (baseline) {
            return baseline.getActivityParam() * (1.0 + this.actchangepercent / 100.0);
        };

        Intervention.prototype.setproportionalsodium = function (baseline) {
            this.sodium = (baseline.sodium * this.calories / baseline.getMaintCals());
        };

        return Intervention;
    };




    var getPalValue = function (leisureActivityLevel, workActivityLevel) {
            var activityLevelValue = 0
            console.log(leisureActivityLevel + "|" + workActivityLevel);
            switch (leisureActivityLevel + "|" + workActivityLevel) {
                case "Very Light|Very Light":
                    activityLevelValue = 1.4;
                    break;
                case "Very Light|Light":
                    activityLevelValue = 1.5;
                    break;
                case "Very Light|Moderate":
                    activityLevelValue = 1.6;
                    break;
                case "Very Light|Heavy":
                    activityLevelValue = 1.7;
                    break;
                case "Light|Very Light":
                    activityLevelValue = 1.5;
                    break;
                case "Light|Light":
                    activityLevelValue = 1.6;
                    break;
                case "Light|Moderate":
                    activityLevelValue = 1.7;
                    break;
                case "Light|Heavy":
                    activityLevelValue = 1.8;
                    break;
                case "Moderate|Very Light":
                    activityLevelValue = 1.6;
                    break;
                case "Moderate|Light":
                    activityLevelValue = 1.7;
                    break;
                case "Moderate|Moderate":
                    activityLevelValue = 1.8;
                    break;
                case "Moderate|Heavy":
                    activityLevelValue = 1.9;
                    break;
                case "Active|Very Light":
                    activityLevelValue = 1.7;
                    break;
                case "Active|Light":
                    activityLevelValue = 1.8;
                    break;
                case "Active|Moderate":
                    activityLevelValue = 1.9;
                    break;
                case "Active|Heavy":
                    activityLevelValue = 2.1;
                    break;
                case "Very Active|Very Light":
                    activityLevelValue = 1.9;
                    break;
                case "Very Active|Light":
                    activityLevelValue = 2.0;
                    break;
                case "Very Active|Moderate":
                    activityLevelValue = 2.2;
                    break;
                case "Very Active|Heavy":
                    activityLevelValue = 2.3;
                    break;
            }
            return activityLevelValue;
        }







}())
)