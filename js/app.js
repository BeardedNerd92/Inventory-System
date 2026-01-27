import {listItems, createItem, removeItem} from "./inventoryRepo.js" 

const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");
const inventoryList = document.getElementById("inventory-list")
const LOW_STOCK_THRESHOLD = 3;

form.addEventListener("submit", handleFormData);
let inventory = listItems() ?? [];

function setInventory(updater) {
    inventory = typeof updater === "function" ? updater(inventory) : updater;
    renderListItems();
}

function handleFormData(e) {
    e.preventDefault();
    const name = productName.value.trim();
    const qty = Number(quantity.value); 

    if (name === "") {
        return;
    }
    if (!Number.isInteger(qty) || qty < 0) {
        return;
    }

    const created = createItem({name, qty});
    setInventory(prev => [...prev, created]);

    productName.value = "";
    quantity.value = "";
    productName.focus();
}


function applyLowStockThreshold(item, text, li) {
    if (item.qty <= LOW_STOCK_THRESHOLD) {
        text.textContent += " - ⚠️ Low stock warning!";
        li.classList.add("low-stock");
    }
}

function renderListItems() {
    inventoryList.innerHTML = "";
    if (!inventory.length) {
        inventoryList.textContent = "No Inventory";
        return;
    }
    inventory.forEach((item) => {
        const li = document.createElement("li");
        const text = document.createElement("span");
        const deleteBtn = document.createElement("button");
        
        text.textContent = `${item.name} - ${item.qty}`

        applyLowStockThreshold(item, text, li);

        deleteBtn.textContent = "Delete Item";

        deleteBtn.addEventListener("click", () => {
            removeItem(item.id);
            setInventory(prev => prev.filter(x => x.id !== item.id));
        });

        li.appendChild(text);
        li.appendChild(deleteBtn);
        inventoryList.appendChild(li);
    })
}


renderListItems();