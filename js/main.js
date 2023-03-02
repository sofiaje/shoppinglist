//------------------------------------global--------------------------------------------

let selectMenu = document.getElementById("lists")
let newListInput = document.getElementById("newList")
let newListBtn = document.getElementById("newListBtn")

progressList = document.getElementById("progressList");




//------------------------------------fetch lists and append in select menu -----------

async function getAllListsFromAPI() {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/640077fe373f792f6370c015`);
    const data = await res.json();

    return data;
}


getAllListsFromAPI()
    .then((data) => {

        let listArray = data.itemList
        console.log(listArray)

        listArray.forEach(element => {
            createOption(element.title, element.id)
        });
    })



function createOption(name, id) {
    let option = document.createElement("option")
    option.innerText = name
    option.value = id
    selectMenu.append(option)
}




//------------------------------------add new list----------------------------------------

newListBtn.addEventListener("click", () => {
    let newListInput = document.getElementById("newList")
    createNewList(newListInput.value);
    newListInput.value = ""
})


//id på min list-id lista i API (kom ihåg)
const id = "640077fe373f792f6370c015"



//skapar ny lista som användaren bestämmer namn på
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

    saveNewList(list.listname, list._id)
    createOption(list.listname, list._id)
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






//------------------------------------choose list in select menu and display in browser--------------

selectMenu.addEventListener("change", (e) => {
    progressList.innerText = ""
    // console.log(e.target.value)
    let userSelect = e.target.value;
    getSpecificListFromAPI(userSelect)
        .then((data) => {
            displayItems(data)
        })
})



async function getSpecificListFromAPI(id) {
    const res = await fetch(`https://nackademin-item-tracker.herokuapp.com/lists/${id}`);
    const data = await res.json();

    return data;
}


function displayItems(data) {
    console.log(data)
    let listTitle = document.getElementById("listTitle");
    listTitle.innerHTML = `${data.listname}`;

    let itemList = data.itemList;
    console.log(itemList)

    itemList.forEach(element => {
        console.log(element.title)
        let li = document.createElement("li")
        li.innerText = element.title;
        progressList.append(li)
    });
}


function createLiElement() {

}






//------------------------------------add new item------------------------------------------

class listItem {
    constructor(name, qty) {
        this.name = name;
        this.qty = qty;
    }
}





let itemListArray = []
const addItemBtn = document.querySelector(".addItemBtn")

addItemBtn.addEventListener("click", () => {
    let name = document.getElementById("itemName")
    let qty = document.getElementById("itemQty")

    let item = new listItem(name.value, qty.value)

    itemListArray.push(item)
    console.log(itemListArray)

    name.value = ""
    qty.value = ""
})
