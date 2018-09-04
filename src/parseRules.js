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

let numConfig = [ 'w', 'h', 'y', 'x', 'q', 'b', 's' ]

module.exports = str => {
  if (typeof str !== 'string' || str.indexOf('.') !== -1)
    return false

  let rules = str.split('-').reduce((rules, rule, i) => {
    let initial = rule.substring(0,1)
    let config = rule.substring(1)
    
    if (rule === 'gs') {
      rules[strMapping[rule]] = true
    } else if (initial === 'r') {
      if(config === 'true' || !config.length)
        rules[strMapping[initial]] = true
    } else if (strMapping[initial] != null && config.length < 5) {
      if (numConfig.indexOf(initial) > -1) 
        config = parseInt(config)

      if (initial === 'c')
        config = config || 'c'

      rules[strMapping[initial]] = config
    }

    return rules
  }, {})

  if (Object.keys(rules).length)
    return rules

  return false
}