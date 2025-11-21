// Registering Service Worker
if ("serviceWorker" in navigator) {
    console.log("Attempting to register Service Worker..."); // <-- NEW: Check if the IF block is running
    navigator.serviceWorker
    .register("sw.js", { scope: './' })
    .then((registration) => {
        console.log("SUCCESS! Service Worker registered! 😎 Scope:", registration.scope); // <-- Modified message
    })
    .catch((error) => {
        console.log("FAILURE! Service Worker registration failed."); // <-- NEW: Error log
        console.error(error); 
    });
} else {
    console.warn("Service Workers are NOT supported in this browser."); // <-- NEW: Check for browser support
}


// Start of AHM-Grocery-App
const groceryForm = document.getElementById('grocery-form');
const groceryInput = document.getElementById('grocery-input');
const groceryList = document.getElementById('grocery-list');

// Event Listener for Form Submission
groceryForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const newItem = groceryInput.value.trim();

    if (newItem === '') {
        window.alert('Please enter Item/s!');
        return;
    }
    groceryInput.value = '';
    addItem(newItem);
});

// Core Function: Add Item ---
//     Accept the saved 'isCompleted' status on load.
function addItem(Item, isCompleted = false) {
    const listItem = document.createElement('li');
    const ItemText = document.createElement('span');
    ItemText.textContent = Item;
    listItem.appendChild(ItemText);

    const checkBox = document.createElement('input');
    checkBox.setAttribute('type', 'checkbox');
    listItem.appendChild(checkBox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    listItem.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    listItem.appendChild(editButton);

    groceryList.appendChild(listItem);
    
    //     Apply saved status and style immediately on load
    if (isCompleted) {
        checkBox.checked = true;
        listItem.classList.add('completed');
    }

    // Checkbox Listener
    checkBox.addEventListener('change', function() {
        if (this.checked) {
            listItem.classList.add('completed');
        } else {
            listItem.classList.remove('completed');
        }
        saveItemsToLocalStorage(); // Save changes
    });

    // -Delete Listener
    deleteButton.addEventListener('click', function() {
        groceryList.removeChild(listItem);
        saveItemsToLocalStorage(); // Save changes
    });

    // Edit/Save Logic ---
    editButton.addEventListener('click', function() {
        const isEditing = listItem.classList.contains('editing');

        if (isEditing) {
            const inputElement = listItem.querySelector('input[type="text"]');
            ItemText.textContent = inputElement.value;
            listItem.insertBefore(ItemText, inputElement);
            listItem.removeChild(inputElement);

            listItem.classList.remove('editing');
            editButton.textContent = 'Edit';
            saveItemsToLocalStorage();      // Save after editing
        } else {
            const input = document.createElement('input');
            input.type = 'text';
            input.value = ItemText.textContent;
            listItem.insertBefore(input, ItemText); 
            listItem.removeChild(ItemText);
            listItem.classList.add('editing');
            editButton.textContent = 'Save';
        }
    });

    saveItemsToLocalStorage();
}

// Function: Save to Local Storage
function saveItemsToLocalStorage() {
    const Items = [];
    document.querySelectorAll('#grocery-list li').forEach(Item => {
        const ItemText = Item.querySelector('span') 
            ? Item.querySelector('span').textContent 
            : Item.querySelector('input[type="text"]').value;       // Handle editing state
        
        //     Check for the 'completed' class on the list item
        const isCompleted = Item.classList.contains('completed'); 
        Items.push({ text: ItemText, completed: isCompleted });
    });
    localStorage.setItem('Items', JSON.stringify(Items));
}

//  On Load: Retrieve Items ---
document.addEventListener('DOMContentLoaded', function() {
    const savedItems = JSON.parse(localStorage.getItem('Items')) || [];
    savedItems.forEach(Item => {
        //     Pass BOTH the text AND the completed status
        addItem(Item.text, Item.completed); 
    });
});