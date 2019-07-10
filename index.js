const vacc = require('./app/vacancies');
const term = require( 'terminal-kit' ).terminal

let isOnVac = false

const vaccList = (req) => {
	
	vacc.getVacancies(req)
		.then((vac) => {
			isOnVac = false
			term.cyan('Вакансии по запросу ' + req)
			term.singleColumnMenu( vac.map(v => v.name) , function( error , response ) {
				isOnVac = true
				term.reset()
				
				const currVac = vac[response.selectedIndex]

				term.underline(currVac.alternate_url + '\n\n')
				term.bold(currVac.name + '\n\n')
				let salary = currVac.salary.from ? 'от ' + currVac.salary.from + ' ': ''
				salary = currVac.salary.to ? salary + 'до ' + currVac.salary.to : ''
				term.italic(salary + '\n\n')
				term.italic('Город ' + currVac.area.name + '\n\n')
				term.dim(
						currVac.snippet.requirement ? currVac.snippet.requirement + '\n\n' : ''
						+ currVac.snippet.responsibility ? currVac.snippet.responsibility + '\n\n' : ''
					)
			})
		})
}

const vaccShow = (req) => {
	vaccList(req)
	term.on('key', function(name, matches, data) {
		if (name === 'LEFT' && isOnVac) {
			term.reset()
			vaccList(req)
		}
		if (name === 'CTRL_C') {
			process.exit()
		}
		if (name === 'UP' && isOnVac) {
			start()
		}
	})
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
	
	
	`)
	term('Введите город, желаемую должность и желаемую зарплату: ')
	term.inputField(
		function( error , input ) {
			term.reset()
			vaccShow(input)
		}
	)
}

start()