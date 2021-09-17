class Board {
	constructor(letters) { // when called, make sure letters.length == 16
		this.letters = [
			letters.substr(0, 4).split("").map(n => [n, true]), // true = valid false = invalid
			letters.substr(4, 4).split("").map(n => [n, true]),
			letters.substr(8, 4).split("").map(n => [n, true]),
			letters.substr(12, 4).split("").map(n => [n, true])
		]
	}
	
	size() { return this.letters.length }
	
	get(coords) { 
        this.letters[coords[1]][coords[0]][1] = false
        return this.letters[coords[1]][coords[0]][0]
    }
	
	setValid(coords) { this.letters[coords[1]][coords[0]][1] = true } // switch the 1 & 0 to make it work
	
	isValid(coords) {
		return (this.letters[coords[1]][coords[0]][1] != false)
	}
}

class TrieNode {
    constructor(letter) {
        this.letter = letter
        this.nexts = []
    }

    addNext(newLetter) {
        this.nexts.push(new TrieNode(newLetter))
    }
}

const head = new TrieNode('head')
const hash = new Set()
const output = document.getElementById('output')
const loader = document.getElementById('loader')

fetch('/misc/dictionary.txt')
    .then(response => response.text())
    .then(value => value.split('\r\n'))
    .then(words => words.forEach(w => addWord(head, w)))

function addWord(previous, word) { // making Trie takes < 1s
	if (word.length == 0) {
		previous.end = true // marks the last node as the end of the word
		return
	}
	var letters = previous.nexts.map(node => node.letter)
	const index = letters.indexOf(word.charAt(0))
	if (index >= 0) { //already contains the letter
		addWord(previous.nexts[index], word.slice(1))
	}
	else { // doesn't contain the letter
		previous.addNext(word.charAt(0))
		addWord(previous.nexts[previous.nexts.length-1], word.slice(1))
	}
}

const submit = document.getElementById('submit')
submit.addEventListener('click', () => {
	console.log("'clicked!'");
    let sequence = document.getElementsByName('test')[0].value
    if (sequence.search(/[^a-zA-z]+/) === -1) {
		if (sequence.length === 16) {
			loader.style.display = 'block' // TODO loader does not show up. This happens after the everything below?
			const board = new Board(sequence.toLowerCase())
			// var t0 = performance.now()
            findSequence(board)
			// var t1 = performance.now()
			
			const arr = []
			hash.forEach (s => { // sorting takes < 1s
				arr.push(s)
			})
			arr.sort((a,b) => b.length - a.length) 

			let s = ('' + arr).replaceAll(',', ', ')
			loader.style.display = 'none'
			output.innerText = 'Output: ' + s

			// console.log('took ' + (t1-t0) + ' milliseconds');
        }
        else alert('Please ensure you entered all 16 letters on the board')
    }
    else alert('Please only enter characters')
})

function findSequence(board) {
	for(let i = 0; i < board.size(); i++) {
		for(let j = 0; j < board.size(); j++) {
			recurse(board, [i, j], board.get([i,j]))
			board.setValid([i,j])
		}
	}
	// recurse(board, [2, 2], board.get([2,2]))
}

function recurse(board, location, sequence) {
	var xConstraintBottom = -1
	var yConstraintBottom = -1
	var xConstraintTop = 1
	var yConstraintTop = 1

	if (location[0] == 0) xConstraintBottom = 0
	else if (location[0] == 3) xConstraintTop = 0
	if (location[1] == 0) yConstraintBottom = 0
	else if (location[1] == 3) yConstraintTop = 0

	// console.log(sequence);
	// console.log('' + xConstraintBottom + ' ' + xConstraintTop + ' ' + yConstraintBottom + ' ' + yConstraintTop);

	for(let i = xConstraintBottom; i <= xConstraintTop; i++) {
		for(let j = yConstraintBottom; j <= yConstraintTop; j++) {
			if (i != 0 || j != 0) {
				let path = [location[0] + i, location[1] + j]
				if (board.isValid(path)) {
					sequence += board.get(path) // auto makes spot invalid

					recurse(board, path, sequence)

					sequence = sequence.slice(0, -1) // remove
                    board.setValid(path)
				}
				else {
					if(sequence.length > 2 && !hash.has(sequence) && findWord(sequence)) { //first checks if in hash O(1), then finds if word
						hash.add(sequence)
					}
					// console.log(JSON.parse(JSON.stringify(board)));
					// console.log(sequence);
				}
			}	
		}
	}
}

function findWord(newWord) {
    var pointer = head
    var letters
    for (let i = 0; i < newWord.length; i++) {
        if (pointer.nexts.length <= 0) return false

        letters = pointer.nexts.map(node => node.letter)
        const index = letters.indexOf(newWord.charAt(i))
        if (index >= 0) {
            pointer = pointer.nexts[index]
            if (i == newWord.length-1 && pointer.end) return true // reports true if the last letter is an end node
        }
        else return false
    }
    return false
}