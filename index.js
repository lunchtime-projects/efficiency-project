/*
NOTE:
NOT ALL RULES ARE BASED ON CONCRETE FACT, BUT ARE UNIVERSAL TRUTHS FOR THESE SIMULATIONS (I.E PRIVATE SECTOR IS MORE PRODUCTIVE THAN PUBLIC SECTOR)
*/

function setPopulation(){
	let population = [];
	// needs to be a bell curve
	for(let i = 0; i < 100; i++){
		population.push({
			age: i,
			amount: Math.random
		})
	}
}
const population = [
	{
		age: 0,
		amount: 100
	},
];

const data = {
	"average_wage": 	15.40,		// average wage per hour 
	"minimum_wage": 	6.50,		// minimum wage per hour
	"working_hours": 	9,			// working hours per day
	"public_sector": 	5000000,  	// total public sector employment
	"private_sector": 	32000000,	// total private sector employment
	"birth_rate": 		1000, 		// births per day
	"death_rate": 		850, 		// deaths per day
	"productivity":  	3.4			// productivity (random low level float -> 2.dp)
	"happiness": 		0.7,		// happiness (random low level float -> 2.dp)
	"healh":  			0.8,		// health 0 to 1
	"education": 		0.7,		// education 0 to 1
	"poverty":  		0.1, 		// poverty 0 to 1 (0 being no poverty, 1 being maximum)

	//stats
	"population_needing_welfare": 	2000000,		// this is determined by health and (un)employment
	"tax_burden": 					0.9 			// 0 to 1, 1 being absolute burden, 0 being no tax burden

	// spending
	"total_income": 				800000000000 	// Total income per year (800 bn per year default) (made up of all incomes)

	// expenditure
	"total_expenditure": 			0				// sum of all other expenditures
	"health_expenditure": 			0,
	"education_expenditure": 		0,
	"military_expenditure": 		0,
	"welfare_expenditure": 			0,
	"pension_expenditure": 			0, 				// pension expenditure is equal to welfare_pp * (population_needing_welfare * welfare_ease)

	//indivudal expenditure
	"welfare_pp": 					12000, 			// amount per year
	"welfare_ease":   				0.8, 			// percent of eligble welfare receiptens who are recieving (1 is all, 0 is none)
	"pension_pp": 					9000,			// pension per year
	"pension_age": 					67,
}

class Overall{

	constructor(data){
		this.data = data;
	}

	private setValue(location, value){
		this.data[location] = value;
	}

	private getValue(location){
		return this.data[location];
	}

	private setPopulation(){
		const population = getValue('population');
	}

	private popDecay(age){
		return (age ** 3 / 2000000);
	}

	private agePopulation(){
		let population = getValue('population');
		for(let age = 0; age < population.length; age++){
			if(age !== 0){
				population[age].amount = population[age - 1].amount * popDecay(age); // popDecay(age) -> will determine how many die from this age group ...
			}
		}
		populaltion[0].amount = genBirths(); // genbirths can get all people between 16 and 40 and have a percent of those give birth (i.e x% of that range) x can be dependant upon health, employment, happiness, income blah blah (i.e higher income less likely to have children (counter intuative))
	}

	private getPopAbove(age){
		const population = getValue('population');
		let sum = 0;

		population.forEach(pop => {
			if(pop.age > age){
				sum += pop.amount;
			}
		});

		return sum;
	}

	private getPopBetween(minAge, maxAge){
		const population = getValue('population');
		let sum = 0;

		population.forEach(pop => {
			if(pop.age > minAge && pop.age < maxAge ){
				sum += pop.amount;
			}
		});

		return sum;
	}

	private calculateWelfareSpending(){
		const { welfare_pp, welfare_ease, population_needing_welfare } = this.data;

		setValue('welfare_expenditure', welfare_pp * welfare_ease * population_needing_welfare);

		return getValue('welfare_expenditure');
	}



	private calculatePensionsSpending(){

		const { pension_pp, pension_age } = this.data;

		const pop = getPopAbove(pension_age);

		const amount = pop * pension_pp;

		setValue('pension_expenditure', amount);

		return getValue('pension_expenditure');
	}

	private getSectorRatios(){

		const { public_sector, private_sector } = this.data;

		private_sector_percent = ((private_sector - public_sector) / private_sector).toFixed(2);
		public_sector_percent = 1 - private_sector_percent;

		return{
			public_sector,
			private_sector,
			public_sector_percent,
			private_sector_percent,
		}
	}

	private getWageValues(){

		const { average_wage, minimum_wage } = this.data;

		const wage_ratio = (average_wage - minimum_wage) / average_wage;

		return{
			average_wage,
			minimum_wage,
			wage_ratio
		}
	}

	private calculateHappiness(){

		const {
			working_hours,
			health,
			education,
			poverty
		} = this.data

		let happiness = 1;

		// wage affecting happiness (max multiply by 2, min 0.5)
		happiness *= (1.5 * getWageValues().wage_ratio + 0.5);
	}

	private calculateProductivity(){

		const { 
			happiness,
			working_hours,
			birth_rate,
			death_rate
		} = this.data;

		// give productivity base rating of 1
		let productivity = 1;

		// happiness factor
		productivity *= (1.5 * happiness + 0.5);

		// wage ratio max min = 1, 5
		productivity *= getWageValues().wage_ratio / 2;

		// working hours 9 (being base rate)
		productivity *= (working_hours / 9);

		// employment rate (base rate 0.75)
		productivity *= (employment + 0.25);

		// ideal ratio is 0.8, anything less is negative, anything above is positive
		productivity *= (getSectorRatios().private_sector_percent + 0.2);

		const birth_to_death_ratio = birth_rate / death_rate;
		productivity *= birth_to_death_ratio;

		this.setValue('productivity', productivity);
	}

	private update(){
		calculateHappiness();
		calculateProductivity();
	}

}