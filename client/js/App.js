'use strict'

import '../sass/app.scss'

//-- Autocomplete component
const endpoint = 'http://localhost:3000/api/states?term='
const searchInput = document.querySelector('#search-input')
const stateResultList = document.querySelector('.state-list')
const listItems = document.querySelector('.state-list').getElementsByTagName('li')
const clearIcon = document.querySelector('#clear')

const clearList = () => {
	clearIcon.classList.add('hidden')
	stateResultList.innerHTML = ''
}

let stateListItem = (state, index) =>
	`<li id=${index} value=${state.abbreviation}>
		${state.name}
	</li>`

let stateList = (list) =>
	`<ul>
		${list.map(stateListItem).join('')}
	</ul>`

const renderList = (item) => {
	stateResultList.innerHTML = stateList(item)
}

searchInput.addEventListener('input', async ({ target }) => {
	let searchTerm = target.value
	let textLength = target.textLength
	let res = await axios
		.get(endpoint + `${searchTerm}`)
		.catch((error) => console.error(error))

	// Start showing result after 2 characters
	if (textLength >= 2) {
		renderList(res.data.data)
		clearIcon.classList.remove('hidden')
	} else if (textLength < 2) {
		stateResultList.innerHTML = ''
		clearIcon.classList.add('hidden')
	}

	// Add clear button with no matching results
	if (res.data.data.length > 0) {
		clearIcon.classList.remove('hidden')
	}

	// Scroll overflow list
	if (textLength >= 2 && res.data.data.length > 5) {
		stateResultList.firstChild.classList.add('overflow')
	}
})

// Clear search box
clearIcon.addEventListener('click', () => {
	clearList()
	searchInput.value = ''
})

// Click to select result
stateResultList.addEventListener('click', ({ target }) => {
	if (target && target.nodeName == 'LI') {
		searchInput.value = document.getElementById(target.id).innerText
		stateResultList.style.display = 'none'
	}
})

// Add and remove selected class to list items
stateResultList.addEventListener('mouseover', ({ target }) => {
	target.classList.add('selected')
})

stateResultList.addEventListener('mouseout', ({ target }) => {
	target.classList.remove('selected')
})

// Select with keyboard
let index

const findSelectedLi = () => {
	let selected
	let selectedIndex = -1
	for (const [k] of Object.entries(listItems)) {
		const li = listItems.item(parseInt(k))
		if (li.classList.contains('selected')) {
			selected = li
			selectedIndex = parseInt(k)
		}
	}
	return [selected, selectedIndex]
}

document.addEventListener('keydown', (e) => {
	let selected
	// find selected list item
	[selected, index] = findSelectedLi()
	if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
		if (selected && index !== -1) {
			selected && selected.classList.remove('selected')
		}

		// on arrow up decrement index and increment on arrow down to select in the list
		e.key === 'ArrowUp' ? index-- : index++
		if (index < 0) {
			index = 0
		}
		if (index > listItems.length - 1) {
			index = listItems.length - 1
		}

		const li = listItems.item(index)

		li.classList.add('selected')
		if (listItems.length > 5) {
			if (index > 4) searchBox.scrollTop = li.offsetTop - 32
			else {
				searchBox.scrollTop = 0
			}
		}
	}
	if (e.key === 'Enter') {
		searchInput.value = selected.innerText
		stateResultList.innerHTML = ''
	}
})
