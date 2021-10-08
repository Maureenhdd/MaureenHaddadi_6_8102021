const cardList = document.querySelector('.card_list_section')
const openList = document.querySelectorAll('.open_list')
const listIngredients = document.querySelector('.list--ingredients')
const listAppliance = document.querySelector('.list--appliances')
const listUstensils = document.querySelector('.list--ustensils')
const userSearch = document.querySelector('.search_bar_section__input')
const tagSection = document.querySelector('.refined_search_tag')


function searchFilter(userQuery, recipes) {

    const result = recipes.filter(recipe => {
        if (userQuery.includes(' ')) {
            userQuerySplit = userQuery.split(' ')
            resultSplit = recipe.name.split(' ')
            for (let i = 0; i < userQuerySplit.length; i++) {
                if (userQuerySplit[i].length < 3) {
                    continue
                }
                for (let j = 0; j < resultSplit.length; j++) {

                    if (userQuerySplit[i].toLowerCase() === resultSplit[j].toLowerCase()) {
                        return true;
                    }
                }
            }
        } else {
            return recipe.name.toLowerCase().includes(userQuery.toLowerCase()) || recipe.description.toLowerCase().includes(userQuery.toLowerCase()) || recipe.ingredients.some((ingredient) => ingredient.ingredient.toLowerCase().includes(userQuery.toLowerCase()))
        }


        cardList.innerHTML = ''

    })
    if (!result.length) {
        return cardList.innerHTML = `
        <div class="card_list_section--no_result">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</div>
        `
    }

    displayRecipes(result)

}

function filterByTags(recipes, arraySelectedTag, arrayAppliances, arrayUstensils) {
    const result = recipes.filter(recipe => {
        const tagSelected = arraySelectedTag.map(i => i)
        const result = arrayAppliances.includes(recipe.appliance)
        // || recipe.ustensils.some((ust) => ust.toLowerCase().includes(tagSelected))


        console.log(result, arrayAppliances)
        return result
    })
    console.log(arraySelectedTag)
    displayRecipes(result)
}

function displayTags(arrayItem) {
    const li = document.querySelectorAll('.refined_search__li')

    tagSection.innerHTML = ''
    arrayItem.map(item => tagSection.innerHTML += createTag(item))
    const removeTag = document.querySelectorAll('.remove-tag')
    removeTag.forEach(i => {
        i.addEventListener('click', () => {
            const index = arrayItem.indexOf(i);
            arrayItem.splice(index, 1);
            displayTags(arrayItem)
            // filterByTags(arrayItem)
            console.log(arrayItem)

            // li.forEach(e => {
            //     arrayItem.includes(e) ? e.style.pointerEvents = "none" : null
            // })
        })
    })

}


function pushItem(recipes) {
    const li = document.querySelectorAll('.refined_search__li')
    const tag = document.querySelectorAll('.refined_search_tag__content')

    let arrayItem = []
    li.forEach(i => {
        i.addEventListener('click', function () {
            let valueLi = i.innerHTML
            arrayItem.push(valueLi)
            // i.parentNode.classList.contains('list--appliances') ? console.log(tag.forEach(t => t)) : tag.forEach(t => {
            //     t.style.backgroundColor = "#47597e"
            // })

            i.style.pointerEvents = "none"
            i.parentNode.classList.contains('list--appliances') ? console.log(i) : null
            displayTags(arrayItem)
            // filterByTags(recipes, arrayItem)
        })

    })
    return arrayItem
}



function extractIngredients(recipes) {
    let arrayIngredients = []
    recipes.map(recipe => {
        recipe.ingredients.map(ingredient => {
            arrayIngredients.push(ingredient.ingredient)

        })
    })
    return arrayIngredients
}



function extractAppliances(recipes) {
    let arrayAppliances = []
    recipes.map(appliance => {
        arrayAppliances.push(appliance.appliance)
    })

    return arrayAppliances
}



function extractUstensils(recipes) {
    let arrayUstensils = []
    recipes.map(recipe => {

        recipe.ustensils.map(ustensil => {
            arrayUstensils.push(ustensil)
        })
    })

    return arrayUstensils

}

function normalizeArray(array) {
    array = [...new Set(array)].sort()
    let arrayNormal = []
    array = array.map(i => {
        let normalI = i.endsWith('s') ? i.substring(0, i.length - 1) : i
        normalI = normalI.toLowerCase()
        normalI = normalI.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        if (arrayNormal.includes(normalI)) {
            return null
        } else {
            arrayNormal.push(normalI)
        }
        return i
    }).filter(el => el !== null)
    return array
}

openList.forEach(item => {
    const listSection = item.parentNode.parentNode.querySelector('.refined_search__list')
    const openListI = item.parentNode.parentNode.querySelector('.open_list__i')

    item.addEventListener('click', () => {
        listSection.classList.toggle('active_list')
        openListI.classList.toggle('opened_list')
    })
})

function displayRecipes(recipes) {
    cardList.innerHTML = ' '
    recipes.map(e => cardList.innerHTML += createCardRecipe(e))
}


function getData() {

    return new Promise((resolve, reject) => {
        fetch('/assets/script/recipe.json')
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                resolve(data)
            })
            .catch((err) => {
                reject(err)
            })
    })
}


getData().then(({ recipes }) => {
    let isSearch = false
    filterByTags(recipes, [], ['Saladier'], [])
    displayRecipes(recipes)
    const arrayIngredients = extractIngredients(recipes)
    const arrayAppliances = extractAppliances(recipes)
    const arrayUstensils = extractUstensils(recipes)
    normalizeArray(arrayIngredients).map(i => listIngredients.innerHTML += createList(i))
    normalizeArray(arrayAppliances).map(i => listAppliance.innerHTML += createList(i)
    )
    normalizeArray(arrayUstensils).map(i => listUstensils.innerHTML += createList(i)
    )
    pushItem(recipes)
    userSearch.addEventListener('input', function (e) {
        if (e.target.value.length < 3) {
            if (isSearch) {

                displayRecipes(recipes)
                isSearch = false
            }
        } else {
            searchFilter(e.target.value, recipes)
            isSearch = true
        }
    })
})

