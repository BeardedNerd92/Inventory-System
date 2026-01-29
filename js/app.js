import {listItems, createItem, removeItem} from "./inventoryRepo.js" 

const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");
const inventoryList = document.getElementById("inventory-list")
const LOW_STOCK_THRESHOLD = 3;

form.addEventListener("submit", handleFormData);

function normalizeItems(items) {
    const byId = {};
    const allIds = [];

    for (const item of items) {
        byId[item.id] = item;
        allIds.push(item.id);
    }
    return {byId, allIds};
}

function selectInventoryList(state) {
    return state.allIds.map(id => state.byId[id]).filter(Boolean);
}


let inventory = normalizeItems(listItems() ?? []);

function setInventory(updater) {
    inventory = typeof updater === "function" ? updater(inventory) : updater;
    renderListItems(selectInventoryList(inventory));
}

async function handleFormData(e) {
    e.preventDefault();
    const name = productName.value.trim();
    const qty = Number(quantity.value); 

    if (name === "") {
        return;
    }
    if (!Number.isInteger(qty) || qty < 0) {
        return;
    }
    try {

        const created = await createItem({name, qty});
    
        setInventory(prev => ({
            byId: {...prev.byId, [created.id]: created},
            allIds: [...prev.allIds, created.id],
        }));
    
        productName.value = "";
        quantity.value = "";
        productName.focus();
    } catch (err) {
        console.error(err);
    }
}


function applyLowStockThreshold(item, text, li) {
    if (item.qty < LOW_STOCK_THRESHOLD) {
        text.textContent += " - ⚠️ Low stock warning!";
        li.classList.add("low-stock");
    }
}

function renderListItems(items) {
    inventoryList.innerHTML = "";
    if (!items.length) {
        inventoryList.textContent = "No Inventory";
        return;
    }
    items.forEach((item) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        const deleteBtn = document.createElement("button");
        
        text.textContent = `${item.name} - ${item.qty}`

        applyLowStockThreshold(item, text, li);

        deleteBtn.textContent = "Delete Item";

        deleteBtn.addEventListener("click", async () => {
            const id = item.id;
            try {
                await removeItem(id);

                setInventory(prev => {
                    const nextById = {...prev.byId};
                    delete nextById[id];
    
                    return {
                        byId: nextById,
                        allIds: prev.allIds.filter(x => x !== id),
                    };
                });

            } catch (err) {
                console.error(err);
            }


        });


        li.appendChild(text);
        li.appendChild(deleteBtn);
        inventoryList.appendChild(li);
    })
}


renderListItems(selectInventoryList(inventory));