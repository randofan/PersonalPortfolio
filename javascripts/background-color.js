const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"]
const length = hex.length

const button = document.getElementById('randomize')
const reset = document.getElementById('reset')
const r = document.querySelector(':root')
const rs = getComputedStyle(r)

button.addEventListener('click', () => {
    for (let i = 1; i < 6; i++) {
        r.style.setProperty(`--c${i}`, getRandomColor())
    }
    r.style.setProperty('--c1-secondary', incrementColor(rs.getPropertyValue('--c1'), 25))
})

reset.addEventListener('click', () => {
    for (let i = 1; i < 6; i++) {
        r.style.setProperty(`--c${i}`, rs.getPropertyValue('--original-c1'))
    }
    r.style.setProperty('--c1-secondary', rs.getPropertyValue('--original-c1-secondary'))
})

function getRandomColor () {
    let randomColor = '#'
    for (let i = 0; i < 6; i++) {
        randomColor += hex[Math.floor(Math.random() * length)]
    }
    return randomColor
}

function incrementColor (color, increment) {
    let colorToInt = parseInt(color.substr(1), 16)
    colorToInt += increment

    let intToColor = colorToInt.toString(16)
    intToColor = '#' + (new Array(7-intToColor.length).join(0)) + intToColor
    if(/^#[0-9a-f]{6}$/i.test(intToColor)) {
        return intToColor
    }
    else return 'red'
}