//------------------------------------global--------------------------------------------
let listwrapper = document.querySelector("#listwrapper")


let selectMenu = document.getElementById("lists")
let newListInput = document.getElementById("newList")
let newListBtn = document.getElementById("newListBtn")

let addItemDiv = document.getElementById("addItemDiv");
let listDiv = document.getElementById("listDiv");


let errorP = document.querySelector(".error");
progressList = document.getElementById("progressList");





//------------------------------------fetch all lists from api -------------------------

async function getAllListsFromAPI() {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015`);
    const data = await res.json();

    console.log(data)
    return data;
}


//calls function that gets the list-id list
getAllListsFromAPI()
    .then((data) => {
        // console.log("data from api, id-list objectet", data)
        // console.log("listArray, listan med id + namn", listArray)
        createtheaccordions(data)

    })


function createtheaccordions(data) {
    let listArray = data.itemList
    listArray.forEach(element => {
        //calls function that creates option in select menu
        // createOption(element.title, element.id)

        listwrapper.innerHTML = ""
        getSpecificListFromAPI(element.id)
            .then((data) => {
                // console.log("rad 40", data)
                let wrapper = createAccordion(data)
                displayItemsInAccordion(wrapper, data)
                addNewItem(wrapper)
            })
    });
}




//------------------------------------fetch lists and append accordion in browser -----------


function createAccordion(list) {
    // console.log("element in accordion function", list);
    let accordionWrapper = document.createElement("div");
    accordionWrapper.setAttribute("id", list._id)
    accordionWrapper.classList.add("accordionWrapper")
    accordionWrapper.innerHTML = `
    <div class="accordionHead">
        <div class="textwrapper"><h2>${list.listname}</h2></div>
        <div class="btnWrapper">
            <button class="trashBtn hiddenBtn"><i class="fa-regular fa-trash-can fa-lg"></i></button>
            <button class="toggleBtn hiddenBtn"><i class="fa-solid fa-chevron-down fa-lg"></i></button>
        </div>
    </div>

    <div class="accordionBody">
        <div class="addItemWrapper">
            <input type="text" class="listInput">
            <button class="btn addItemBtn" id="${list._id}">Lägg till</button>
        </div>
        <div class="solidListWrapper">
            <h3 class="inProgresstitle inListTitle">Kvar</h3>
            <ul class="inProgressUl">
            </ul>
            <h3 class="doneTitle inListTitle">Klart</h3>
            <ul class="doneUl"></ul>
        </div>
        <div class="testScroll"></div>
    </div>`

    listwrapper.append(accordionWrapper);

    let trashBtn = accordionWrapper.querySelector(".trashBtn")
    trashBtn.addEventListener("click", (e) => {
        console.log("ta bort listan i api, sen i DOM")
        let list = e.target.closest("div.accordionWrapper");
        console.log(list)
        console.log(list.id)
        // removeListFromAPI(list.id)
        // removeListFromIdList(list.id)
        // findList(list.id)

        // list.remove();
    })


    let toggleBtn = accordionWrapper.querySelector(".toggleBtn")
    let accordionBody = accordionWrapper.querySelector(".accordionBody")

    toggleBtn.addEventListener("click", (event) => {
        event.target.classList.toggle("turn")
        if (accordionBody.style.maxHeight) {
            accordionBody.style.maxHeight = null;
        } else {
            accordionBody.style.maxHeight = accordionBody.scrollHeight + "px";
            accordionBody.scrollIntoView({ behavior: "smooth"})


        }
    })

    return accordionWrapper;
}


//------------------------------------remove list-----------------------------------------------------

async function removeListFromAPI(listId) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/${listId}`,
        {
            method: "DELETE",
        }
    );
    const { list } = await res.json();
}




//------------------------------------remove list-id from id-list----------------------------------------

async function removeListFromIdList(listId) {
    console.log("tar bort item i lista")
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015/items/${listId}`,
        {
            method: "DELETE",
        }
    );
    const { list } = await res.json();
    console.log(list)
}


// -------------testa------------------------------------------------------------------------------------

/* hur raderar jag ett listitem ur en lista om jag inte har dess id? 
Kan jag få tillgång till dess id på något sätt? Utifrån namn eller ett annat id, 
vet jag vilket index listan har? */

async function findList(listId) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com//listsearch?listname=test`
    );
    const data = await res.json();
    console.log("rad 155", data)
}


//------------------------------------press button to add new list----------------------------------------


//kollar om användaren skrivit in ett listnamn när hen trycker på skapa-lista-knappen  
//anropar isåfall funktion som skapar lista i API 
newListBtn.addEventListener("click", () => {
    let newListInput = document.getElementById("newList")
    if (newListInput.value) {
        errorP.classList.add("hidden")
        createNewList(newListInput.value);
        newListInput.value = ""
    } else {
        errorP.classList.remove("hidden")
    }

})


//id på min list-id lista i API (kom ihåg)
const id = "640077fe373f792f6370c015"



//create new list in API from userInput
async function createNewList(newListInput) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            listname: newListInput,
        }),
    });
    const { list } = await res.json();


    //anropar funktion som sparar den nya listans ID i id-listan på API
    saveNewList(list.listname, list._id)

    //renderar ut ny lista i browser
    let wrapper = createAccordion(list)
    displayItemsInAccordion(wrapper, list)
    addNewItem(wrapper)

}




//saves all new lists in my list-id list in API
async function saveNewList(listName, listId) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: listName,
                id: listId,
            }),
        }
    );
    const { list } = await res.json();
}






//--------------------------------------display saved lists in browser as accordions-----------------------


function displayItemsInAccordion(wrapper, data) {
    let inProgressUl = wrapper.querySelector(".inProgressUl")
    let doneUl = wrapper.querySelector(".doneUl")
    inProgressUl.innerHTML = ""
    doneUl.innerHTML = ""
    // console.log(inProgressUl)
    // let inProgresstitle = wrapper.querySelector(".inProgressUl")
    // let doneTitle = wrapper.querySelector(".inProgressUl")

    // console.log("data rad 72", data.itemList)
    let itemList = data.itemList

    itemList.forEach(element => {
        eachItem(element, inProgressUl, doneUl)
    });

}



function eachItem(element, list, doneList) {
    // console.log("rad 197", element)
    let li = document.createElement("li")
    li.classList.add("liHtmlElement")
    li.setAttribute("id", element._id)
    li.innerHTML = `<div class="item">${element.title}</div> 
    <input type="checkbox" class="checkbox" ${element.checked ? "checked" : ""}>
    <button class="listDeleteBtn"><i class="fa-solid fa-xmark"></i></button>`;

    let checked = 0
    let notchecked = 0

    if (!element.checked) {
        list.append(li)
        notchecked++
    } else {
        doneList.append(li)
        checked++

    }

    let listDeleteBtn = li.querySelector(".listDeleteBtn");
    listDeleteBtn.addEventListener("click", (e) => {
        let wrapper = e.target.closest("div.accordionWrapper")
        let listId = wrapper.id
        let itemId = e.target.parentElement.id;

        deleteItem(listId, itemId)
            .then((data) => {
                console.log("deletad lista ny", data)
                displayItemsInAccordion(wrapper, data)
            })
    })

    let checkbox = li.querySelector(".checkbox");
    checkbox.addEventListener("change", (e) => {
        // console.log("e target", e.target);


        let wrapper = e.target.closest("div.accordionWrapper")
        let listId = wrapper.id;
        let itemId = e.target.parentElement.id;
        // console.log(listId, itemId)

        if (e.target.checked) {
            let trueorfalse = true;
            checkItemInAPI(listId, itemId, e.target.checked)
                .then((data) => {
                    console.log("deletad lista ny", data)
                    displayItemsInAccordion(wrapper, data)
                })
        } else {
            let trueorfalse = false;
            checkItemInAPI(listId, itemId, trueorfalse)
                .then((data) => {
                    console.log("deletad lista ny", data)
                    displayItemsInAccordion(wrapper, data)
                })

        }
    })

}



//fetch specific list from API by ID
async function getSpecificListFromAPI(id) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/${id}`);
    const data = await res.json();

    return data;
}



//-----------------------------------check item in list-------------------------------------------

async function checkItemInAPI(listId, itemId, trueorfalse) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/${listId}/items/${itemId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            checked: trueorfalse,
        }),
    });
    const { list } = await res.json();
    return list

}



//-----------------------------------delete item from list-------------------------------------------
async function deleteItem(listId, itemId) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/${listId}/items/${itemId}`,
        {
            method: "DELETE",
        }
    );
    const { list } = await res.json();
    return list
}




//------------------------------------add new item to list-------------------------------------------

function addNewItem(wrapper) {
    let addItemBtn = wrapper.querySelector(".addItemBtn");
    let inProgressUl = wrapper.querySelector(".inProgressUl");
    // console.log(addItemBtn, inProgressUl)

    addItemBtn.addEventListener("click", () => {
        // console.log("du klickade på knappen");
        let listInput = wrapper.querySelector(".listInput");

        if (listInput.value) {
            let listId = addItemBtn.id;
            let title = listInput.value
            addItemInAPI(listId, title)
                .then((data) => {
                    console.log(data)
                    displayItemsInAccordion(wrapper, data)

                })
            listInput.value = ""
        } else {
            console.log("false")
        }


    })

}


//add an item in API list
async function addItemInAPI(currentListId, title) {
    const res = await fetch(
        `https://nackademin-item-tracker.herokuapp.com/lists/${currentListId}/items`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: title,
                qty: 1,
                checked: false
            }),
        }
    );
    const { list } = await res.json();
    return list;
}




//------------------------------------add new item prototype------------------------------------------

class listItem {
    constructor(name, qty) {
        this.name = name;
        this.qty = qty;
    }
}





// let itemListArray = []
// const addItemBtn = document.querySelector(".addItemBtn")

// addItemBtn.addEventListener("click", () => {
//     let name = document.getElementById("itemName")
//     let qty = document.getElementById("itemQty")

//     let item = new listItem(name.value, qty.value)

//     itemListArray.push(item)
//     console.log(itemListArray)

//     name.value = ""
//     qty.value = ""
// })
