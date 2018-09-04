// Parse rules from a string
// Possible rules
// w{num} - Width
// h{num} - Height
// s{num} - Square
// c{fit|fill|cut|scale|pad} - Height
// x{num} - Left
// y{num} - Top
// g{n|ne|nw|e|w|s|se|sw} - Gravity
// f{} - Filter
// q{num[1-100]} - Quality
// b{num[1-100]} - Blur
// s{num[1-100]} - Sharpen
// r - Retina optimized

let ruleMapping = {
	width: 'w',
	height: 'h',
	crop: 'c',
	top: 'y',
	left: 'x',
	gravity: 'g',
	quality: 'q',
	retina: 'r',
	blur: 'b',
	sharpen: 's',
	greyscale: 'gs'
}

let strMapping = {
	w: 'width',
	h: 'height',
	c: 'crop',
	y: 'top',
	x: 'left',
	g: 'gravity',
	q: 'quality',
	r: 'retina',
	b: 'blur',
	s: 'sharpen',
	gs: 'greyscale'
}

module.exports = str => {
	if (typeof str !== 'string' || str.indexOf('.') !== -1)
		return false

	let rules = {}
	for (let rule of str.split('-')) {
		let initial = rule.substring(0,1)
		let config = rule.substring(1)
		if (rule === 'gs') {
			rules[strMapping[rule]] = true
			continue
		}

		if (strMapping[initial] != null) {
			
			if (initial === 'w' || initial === 'h' || initial === 'y' || initial === 'x' || initial === 'q' || initial === 'b' || initial === 's')
				config = parseInt(config)
			
			if (initial === 'r')
				config = true

			if (initial === 'c')
				config = config || 'c'

			rules[strMapping[initial]] = config
		}
	}

	if (Object.keys(rules).length)
		return rules
	
	return false
}
