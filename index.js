const vacc = require('./app/vacancies');
const term = require( 'terminal-kit' ).terminal
const _ = require( 'lodash' )

let isOnVac = false

const vaccList = (req) => {
	
	vacc.getVacancies(req)
		.then((vac) => {
			isOnVac = false
			if (_.isEmpty(vac)) {
				term.cyan('Вакансии не найдены, нажмите клавишу "Вправо" для продолжения')
				term.on('key', function(name, matches, data) {
					if (name === 'CTRL_C') {
						process.exit()
					}
					if (name === 'RIGHT') {
						run()
					}
				})
			} else {
				term.cyan('Вакансии по запросу ' + req)
				term.singleColumnMenu( vac.map(v => v.name) , function( error , response ) {
					isOnVac = true
					term.reset()
					
					const currVac = vac[response.selectedIndex]

					term.underline(currVac.alternate_url + '\n\n')
					term.bold(currVac.name + '\n\n')
					let salary = _.get(currVac.salary, 'from', false) ? 'от ' + currVac.salary.from + ' ': ''
					salary = _.get(currVac.salary, 'to', false) ? salary + 'до ' + currVac.salary.to : ''
					term.italic(salary + '\n\n')
					term.italic('Город ' + currVac.area.name + '\n\n')
					term.dim(
							currVac.snippet.requirement ? currVac.snippet.requirement + '\n\n' : ''
							+ currVac.snippet.responsibility ? currVac.snippet.responsibility + '\n\n' : ''
						)
				})
			}
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
		if (name === 'RIGHT' && isOnVac) {
			run()
		}
	})
}

const help = () => {
	term.cyan(`
	Клавиша "Влево" вернет Вас в список вакансий
	Клавиша "Вправо" вернет Вас на главный экран
	Сочетание клавиш CTRL + C завершит работу

	Нажмите клавишу "Вправо" для продолжения
	`)
	term.on('key', function(name, matches, data) {
		if (name === 'CTRL_C') {
			process.exit()
		}
		if (name === 'RIGHT') {
			run()
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
	
	Введите /help для списка доступных команд
	
	`)
	term('Введите город, желаемую должность и желаемую зарплату: ')
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
	term.on('key', function(name, matches, data) {
		if (name === 'CTRL_C') {
			process.exit()
		}
	})
}

run()