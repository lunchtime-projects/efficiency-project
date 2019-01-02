/*

NOTE:
NOT ALL RULES ARE BASED ON CONCRETE FACT, BUT ARE UNIVERSAL TRUTHS FOR THESE SIMULATIONS (I.E PRIVATE SECTOR IS MORE PRODUCTIVE THAN PUBLIC SECTOR)
*/

const data = {
	"average_wage": 	15.40,		// average wage per hour 
	"minimum_wage": 	6.50,		// minimum wage per hour
	"working_hours": 	9,			// working hours per day
	"public_sector": 	5000000,  	// total public sector employment
	"private_sector": 	32000000,	// total private sector employment
	"birth_rate": 		1000, 		// births per day
	"death_rate": 		850, 		// deaths per day
	"happiness": 		0.7,		// happiness 0 to 1
}

class Overall{

	constructor(data){
		this.data = data;
	}

	/*
		Productivity is affected by:
		- happiness
		- ratio of average earnings to minimum wage
		- working week
		- employment
		- public to private sector (private sector is more productive)
		- birth to death rate
	*/
	private setValue(location, value){
		this.data[location] = value;
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

	private calculateProductivity(){

		const { 
			happiness,
			average_wage,
			minimum_wage,
			working_hours,
			birth_rate,
			death_rate
		} = this.data;

		// give productivity base rating of 1
		let productivity = 1;

		// happiness factor
		// min, max = 0.5, 2
		productivity *= (1.5 * happiness + 0.5);

		// wage ratio max min = 1, 5
		const wage_ratio = (average_wage/minium_wage);
		productivity *= wage_ratio / 2;

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

}