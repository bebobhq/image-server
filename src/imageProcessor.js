const sharp = require('sharp')

let gravityMap = {
  n: 'north',
  ne: 'northeast',
  nw: 'northwest',
  e: 'east',
  w: 'west',
  s: 'south',
  se: 'southeast',
  sw: 'southwest',
  c: 'center'
}

module.exports = (buffer, r = false) => {
  let transformer = sharp(buffer)

  // Auto orient images
  transformer.rotate()

  // Don't enlarge images
  transformer.withoutEnlargement()

  if (r) {
    // Set quality
    if (r.quality && r.quality > 0 && r.quality < 100)
      transformer.quality(r.quality)

    // Set width and height
    if (r.width || r.height)
      transformer.resize(r.width || null, r.height || null)

    // If not crop, then don't crop the value we created
    if (!r.crop) {
      transformer.max()
    } else {
      transformer.crop(gravityMap[r.crop] || 'north')
    }

    // Set blur
    if (r.blur && r.blur > 0 && r.blur < 101)
      transformer.blur(r.blur)

    // Set sharpen
    if (r.sharpen && r.sharpen > 0 && r.sharpen < 101)
      transformer.sharpen(r.sharpen)

    // Set greyscale
    if (r.greyscale)
      transformer.gamma().greyscale()
  }

  return transformer.toBuffer()
}