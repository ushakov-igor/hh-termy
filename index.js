const vacc = require('./app/vacancies');
const term = require( 'terminal-kit' ).terminal
const _ = require( 'lodash' )

let isOnVac = false
let req = ''

const vaccList = () => {
	
	vacc.getVacancies(req)
		.then((vac) => {
			isOnVac = false
			if (_.isEmpty(vac)) {
				term.cyan('No vacancies found, press the "Right" key to continue')

			} else {
				term.cyan('Jobs on request ' + req)
				term.singleColumnMenu( vac.map(v => v.name) , function( error , response ) {
					isOnVac = true
					term.reset()
					
					const currVac = vac[response.selectedIndex]

					term.underline(currVac.alternate_url + '\n\n')
					term.bold(currVac.name + '\n\n')
					term.bold("Employer: " + currVac.employer.name + '\n\n')
					let salary = _.get(currVac.salary, 'from', false) ? 'from ' + currVac.salary.from + ' ': ''
					salary = _.get(currVac.salary, 'to', false) ? salary + 'to ' + currVac.salary.to : ''
					term.italic(salary + '\n\n')
					term.italic(currVac.area.name + '\n\n')
					term.dim(
							currVac.snippet.requirement ? currVac.snippet.requirement + '\n\n' : ''
							+ currVac.snippet.responsibility ? currVac.snippet.responsibility + '\n\n' : ''
						)
				})
			}
		})
}

const vaccShow = (reqs) => {
	req = reqs
	vaccList()
}

const help = () => {
	term.cyan(`
	The "Left" key will return you to the job list
	The "Right" key will return you to the main screen.
	The CTRL + C shortcut ends
	
	Press the "Right" key to continue.
	`)
}


const start = () => {
	term.reset()
	term.cyan(`

	##     ## ##     ##     ########  ##     ## 
	##     ## ##     ##     ##     ## ##     ## 
	##     ## ##     ##     ##     ## ##     ## 
	######### #########     ########  ##     ## 
	##     ## ##     ##     ##   ##   ##     ## 
	##     ## ##     ## ### ##    ##  ##     ## 
	##     ## ##     ## ### ##     ##  #######  	
	
	
	Enter /help for the list of available commands.
	
	`)
	term('Enter the city, the desired position and the desired salary: ')
	term.inputField(
		function( error , input ) {
			term.reset()
			if (_.trim(input) ==='/help') {
				help()
			} else {
				vaccShow(input)
			}
		}
	)
}

const run = () => {
	start()
}

run()
term.on('key', function(name, matches, data) {
	if (name === 'LEFT' && isOnVac) {
		term.reset()
		vaccList()
	}
	if (name === 'CTRL_C') {
		process.exit()
	}
	if (name === 'RIGHT') {
		start()
	}
})