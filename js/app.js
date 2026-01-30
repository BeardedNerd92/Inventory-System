import {listItems, createItem, removeItem} from "./inventoryRepo.js" 

const productName = document.getElementById("product-name");
const quantity = document.getElementById("quantity");
const form = document.getElementById("inventory-form");
const inventoryList = document.getElementById("inventory-list")
const errorEl = document.getElementById("inventory-error")
const submitBtn = form.querySelector("button[type='submit']");
const LOW_STOCK_THRESHOLD = 3;

form.addEventListener("submit", handleFormData);

const uiState = {
    isSaving: false,
    isDeleting: false,
    error: null
}

function setUiState(patch) {
    Object.assign(uiState, patch);
    renderUiStatus();
}

function renderUiStatus() {
    if (errorEl) {
        errorEl.textContent = uiState.error ?? "";
        errorEl.style.display = uiState.error ? "block" : "none";
    }
    
    if (submitBtn) {
        submitBtn.disabled = uiState.isSaving || uiState.isDeleting;
    }
    
    const deleteBtns = inventoryList.querySelectorAll("[data-action='delete']");
    deleteBtns.forEach(btn => {
        btn.disabled = uiState.isSaving || uiState.isDeleting;
    })
}





async function handleDeleteItem(id) {
    if (uiState.isSaving || uiState.isDeleting) return;

    setUiState({isDeleting: true, error: null});

    try {

        await removeItem(id);

        setInventory(prev => {

            const { [id]: _removed, ...restById } = prev.byId;
    
            return {
                byId: restById,
                allIds: prev.allIds.filter(exsitingId => exsitingId !== id),
            }
            

        })
        
    } catch (err) {
        setUiState({error: "Could not delete item. Please try again."});
        console.error(err);
    } finally {
        setUiState({isDeleting: false});
    }
}

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

    if (name === "") return;
    
    if (!Number.isInteger(qty) || qty < 0)  return;
    
    setUiState({isSaving: true, error: null});

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
        setUiState({error: "Could not add item. Please try again."});
        console.error(err);
    } finally {
        setUiState({isSaving: false});
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
        deleteBtn.dataset.action = "delete";
        deleteBtn.addEventListener("click", () => handleDeleteItem(item.id))

        li.appendChild(text);
        li.appendChild(deleteBtn);
        inventoryList.appendChild(li);
    })

    renderUiStatus();
}


renderListItems(selectInventoryList(inventory));
renderUiStatus();