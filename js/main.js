//------------------------------------global--------------------------------------------

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

    return data;
}




//calls function that gets the list-id list
getAllListsFromAPI()
    .then((data) => {

        let listArray = data.itemList
        console.log("data from api, id-list objectet", data)
        console.log("listArray, listan med id + namn", listArray)

        listArray.forEach(element => {
            //calls function that creates option in select menu
            // createOption(element.title, element.id)

            getSpecificListFromAPI(element.id)
                .then((data) => {
                    console.log("rad 40", data)
                    let wrapper = createAccordion(data)
                    displayItemsInAccordion(wrapper, data)
                    addNewItem(wrapper)
                })
        });
    })






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

    //skapar ett option i selectmeny så att man kan välja den nya listan
    // createOption(list.listname, list._id)
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
    console.log(inProgressUl)
    // let doneUl = wrapper.querySelector(".doneUl")
    // let inProgresstitle = wrapper.querySelector(".inProgressUl")
    // let doneTitle = wrapper.querySelector(".inProgressUl")

    console.log("data rad 72", data.itemList)
    let itemList = data.itemList

    itemList.forEach(element => {
        eachItem(element, inProgressUl)
    });

}


function eachItem(element, list) {
    let li = document.createElement("li")
    li.classList.add("liHtmlElement")
    li.innerHTML = `<div class="item">${element.title}</div> <input type="checkbox"><button>delete</button>`;
    list.append(li)
}



//fetch specific list from API by ID
async function getSpecificListFromAPI(id) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/${id}`);
    const data = await res.json();

    return data;
}





//------------------------------------fetch lists and append accordion in browser -----------


function createAccordion(list) {
    // console.log("element in accordion function", list);

    let accordionWrapper = document.createElement("div");
    accordionWrapper.classList.add("accordionWrapper")
    accordionWrapper.innerHTML = `
    <div class="accordionHead">
        <h2>${list.listname}</h2>
        <i class="fa-solid fa-chevron-down"></i>
    </div>

    <div class="accordionBody hidden">
        <input type="text" class="listInput">
        <button class="btn addItemBtn" id="${list._id}">add item</button>

        <h3 class="inProgresstitle">In progress</h3>
        <ul class="inProgressUl">
        </ul>
        <h3 class="doneTitle">done</h3>
        <ul class="doneUl"></ul>
    </div>`

    document.body.append(accordionWrapper);

    let accordionHead = accordionWrapper.querySelector(".accordionHead")
    let accordionBody = accordionWrapper.querySelector(".accordionBody")

    accordionHead.addEventListener("click", () => {
        accordionBody.classList.toggle("hidden")
    })

    return accordionWrapper;
}





//------------------------------------add new item to list-------------------------------------------

function addNewItem(wrapper) {
    let addItemBtn = wrapper.querySelector(".addItemBtn");
    let inProgressUl = wrapper.querySelector(".inProgressUl");
    console.log(addItemBtn, inProgressUl)

    addItemBtn.addEventListener("click", () => {
        console.log("du klickade på knappen", addItemBtn);
        let listInput = wrapper.querySelector(".listInput");
        let listId = addItemBtn.id;
        let title = listInput.value
        addItemInAPI(listId, title)

        listInput.value = ""

    })

}

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
            }),
        }
    );
    const { list } = await res.json();
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
