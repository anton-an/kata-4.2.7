const inputField = document.querySelector('.repositories__search-field')
let allRepositories

function addSuggestion (name) {
    const suggestionsList = document.querySelector('.suggestions-list')
    const suggestion = document.createElement('li')
    suggestion.classList.add('suggestion')
    const suggestionText = document.createElement('span')
    suggestionText.textContent = name
    suggestionText.classList.add('suggestion__text')
    suggestion.appendChild(suggestionText)
    suggestionsList.appendChild(suggestion)
    suggestion.addEventListener('click', function (e) {
        const suggestionText = this.querySelector('.suggestion__text')
        console.log(suggestionText.textContent)
        const repo = allRepositories.find(item => item.name === suggestionText.textContent)
        addRepo(repo.name, repo.owner.login, repo.stargazers_count)
        inputField.value = ''
    })
}

function destroyAllSuggestions () {
    const suggestions = document.querySelectorAll('.suggestion')
    suggestions.forEach(item => item.remove())
}

function searchError () {
    const suggestionsList = document.querySelector('.suggestions-list')
    const suggestion = document.createElement('li')
    suggestion.classList.add('suggestion')
    const suggestionText = document.createElement('span')
    suggestionText.textContent = 'No repositories found'
    suggestionText.style.setProperty('color', '#B9D7EA')
    suggestionText.classList.add('suggestion__text')
    suggestion.appendChild(suggestionText)
    suggestionsList.appendChild(suggestion)
    suggestion.addEventListener('click', function (e) {
        inputField.value = ''
        destroyAllSuggestions()
    })
}

function addRepo (name, owner, stars) {
    const closeIcon = '\u{00d7}'
    const repoList = document.querySelector('.repositories-list')
    const repo = document.createElement('li')
    const repoName = document.createElement('span')
    const repoOwner = document.createElement('span')
    const repoStars = document.createElement('span')
    const repoDeleteButton = document.createElement('button')
    repo.classList.add('repository')
    repoName.textContent = `Name: ${name}`
    repoName.classList.add('repository__name')
    repoName.classList.add('repository__text')
    repoOwner.textContent = `Owner: ${owner}`
    repoOwner.classList.add('repository__owner')
    repoOwner.classList.add('repository__text')
    repoStars.textContent = `Stars: ${stars}`
    repoStars.classList.add('repository__stars')
    repoStars.classList.add('repository__text')
    repoDeleteButton.textContent = closeIcon
    repoDeleteButton.classList.add('repository__delete-button')
    repoDeleteButton.addEventListener('click', function(e) {
        this.parentElement.remove()
    })
    repo.appendChild(repoName)
    repo.appendChild(repoOwner)
    repo.appendChild(repoStars)
    repo.appendChild(repoDeleteButton)
    repoList.appendChild(repo)
}

async function getData (str) {
    const url = `https://api.github.com/search/repositories?q=${str}+in:name&per_page=5&sort=stars`
    let response
    try {
        response = await fetch(url)
    } catch (e) {
        throw e
    }
    const data = await response.json()
    allRepositories = await data.items
}

async function inputHandler () {
    const val = this.value
    await getData(val)
    destroyAllSuggestions()
    if (allRepositories.length === 0) {
        searchError()
    }
    for (let repo of allRepositories) {
        addSuggestion(repo.name)
    }
}

function debounce (fn, debounceTime) {
    let timer
    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime)
    }
};

const inputDebounced = debounce(inputHandler, 500)

inputField.addEventListener('input', inputDebounced)
document.body.addEventListener('click', (e) => {
    destroyAllSuggestions()
    inputField.value = ''
})




