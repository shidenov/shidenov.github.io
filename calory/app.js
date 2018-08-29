// Storage Controller
const StorageCtrl = (function() {
  // Public methods
  return {
    storeItem: function(item) {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
        // Push new item
        items.push(item);
        // Set localStorage
        localStorage.setItem('items', JSON.stringify(items));
      } else{
        items = JSON.parse(localStorage.getItem('items'));
        // Push new item
        items.push(item);
        // Reset localStorage
        localStorage.setItem('items', JSON.stringify(items));
      }
    },
    getItemsFromStorage: function() {
      let items;
      if(localStorage.getItem('items') === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateItemStorage: function(updatedItem) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if(updatedItem.id === item.id) {
          items.splice(index, 1, updatedItem);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteItemFromStorage: function(id) {
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function (item, index) {
        if(id === item.id) {
          items.splice(index, 1);
        }
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    clearItemsFromStorage: function() {
      localStorage.removeItem('items');
    }
  };
})();

// Item Controller
const ItemCtrl = (function() {
  // Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  // Data Structure / State
  const data = {
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  };

  // Public methods
  return {
    addItem: function(name, calories) {
      let ID;
      // Create ID
      if(data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Calories to number
      calories = parseInt(calories);

      // Create new item
      let newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },
    getItems: function() {
      return data.items;
    },
    getItemById: function(id) {
      let found = null;
      data.items.forEach(function(item) {
        if(item.id === id) {
          found = item;
        }
      });
      return found;
    },
    setCurrentItem: function(item) {
      data.currentItem = item;
    },
    getCurrentItem: function() {
      return data.currentItem;
    },
    updateItem: function(name, calories) {
      calories = parseInt(calories);
      let found = null;
      data.items.forEach(function(item) {
        if(item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function(id) {
      // Get ids
      let ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },
    clearAllItems: function() {
      data.items = [];
    },
    getTotalCalories: function(){
      let total = 0;

      // Loop through items and add cals
      data.items.forEach(function(item){
        total += item.calories;
      });

      // Set total cal in data structure
      data.totalCalories = total;

      // Return total
      return data.totalCalories;
    }
  };
})();



// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    ITEM_LIST: '#item-list',
    LIST_ITEMS: '#item-list li',
    ADD_BTN: '.add-btn',
    UPDATE_BTN: '.update-btn',
    DELETE_BTN: '.delete-btn',
    BACK_BTN: '.back-btn',
    CLEAR_BTN: '.clear-btn',
    ITEM_NAME_INPUT: '#item-name',
    ITEM_CALORIES_INPUT: '#item-calories',
    TOTAL_CALORIES: '.total-calories'
  };
  // Public methods
  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item){
        html += `<li id="item-${item.id}" class="collection-item">
          <strong>${item.name}:</strong>
          <em> ${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>
        </li>`;
      });

      // Insert list items
      document.querySelector(UISelectors.ITEM_LIST).innerHTML = html;
    },
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.ITEM_NAME_INPUT).value,
        calories: document.querySelector(UISelectors.ITEM_CALORIES_INPUT).value
      }
    },
    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.ITEM_LIST).style.display = 'block';
      // Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}:</strong>
          <em> ${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>`;
      document.querySelector(UISelectors.ITEM_LIST).insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.LIST_ITEMS);

      // Turn Node List into Array
      listItems = Array.from(listItems);

      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute('id');
        if(itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}:</strong>
          <em> ${item.calories}</em>
          <a href="#" class="secondary-content">
            <i class="fa fa-pencil edit-item"></i>
          </a>`;
        }
      });
    },
    clearInput: function() {
      document.querySelector(UISelectors.ITEM_NAME_INPUT).value = '';
      document.querySelector(UISelectors.ITEM_CALORIES_INPUT).value = '';
    },
    addItemToForm: function() {
      document.querySelector(UISelectors.ITEM_NAME_INPUT).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.ITEM_CALORIES_INPUT).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    hideList: function() {
      document.querySelector(UISelectors.ITEM_LIST).style.display = 'none';
    },
    showTotalCalories: function(total){
      document.querySelector(UISelectors.TOTAL_CALORIES).textContent = total;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.UPDATE_BTN).style.display = 'none';
      document.querySelector(UISelectors.DELETE_BTN).style.display = 'none';
      document.querySelector(UISelectors.BACK_BTN).style.display = 'none';
      document.querySelector(UISelectors.ADD_BTN).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.UPDATE_BTN).style.display = 'inline';
      document.querySelector(UISelectors.DELETE_BTN).style.display = 'inline';
      document.querySelector(UISelectors.BACK_BTN).style.display = 'inline';
      document.querySelector(UISelectors.ADD_BTN).style.display = 'none';
    },
    deleteListItem: function(id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    removeItems: function() {
      let listItems = document.querySelectorAll(UISelectors.LIST_ITEMS);
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();



// App Controller
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    // Get UI selectors
    const UISelectors = UICtrl.getSelectors();

    // Add item event
    document.querySelector(UISelectors.ADD_BTN).addEventListener('click', itemAddSubmit);
    // Disable submit on enter
    document.addEventListener('keypress', function (e) {
      if(e.keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });
    // Edit icon click event
    document.querySelector(UISelectors.ITEM_LIST).addEventListener('click', itemEditClick);
    // Update item event
    document.querySelector(UISelectors.UPDATE_BTN).addEventListener('click', itemUpdateSubmit);
    // Back button event
    document.querySelector(UISelectors.BACK_BTN).addEventListener('click', UICtrl.clearEditState);
    // Delete item event
    document.querySelector(UISelectors.DELETE_BTN).addEventListener('click', itemDeleteSubmit);
    // Clear button event
    document.querySelector(UISelectors.CLEAR_BTN).addEventListener('click', clearAllItemsClick);
  };

  // Add item submit
  const itemAddSubmit = function(e) {
    e.preventDefault();

    // Get form input from UI Controller
    const input = UICtrl.getItemInput();

    // Check for name and calorie input
    if(input.name !== '' && input.calories !== '') {
      // Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      // Add item to UI list
      UICtrl.addListItem(newItem);
      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);
      // Store in localStorage
      StorageCtrl.storeItem(newItem);
      // Clear fields
      UICtrl.clearInput();
    }
  };

  // Click edit item
  const itemEditClick = function(e) {
    if(e.target.classList.contains('edit-item')) {
      // Get list item id
      const listId = e.target.parentNode.parentNode.id;
      // Break into an array
      const listIdArr = listId.split('-');
      // Get the actual id
      const id = parseInt(listIdArr[1]);
      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);
      // Set current item
      ItemCtrl.setCurrentItem(itemToEdit);
      // Add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  // Item update submit
  const itemUpdateSubmit = function(e) {
    const input = UICtrl.getItemInput();
    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Update localStorage
    StorageCtrl.updateItemStorage(updatedItem);
    UICtrl.clearEditState();
    e.preventDefault();
  };

  // Item delete submit
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);
    // Delete from UI
    UICtrl.deleteListItem(currentItem.id);
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Delete from localStorage
    StorageCtrl.deleteItemFromStorage(currentItem.id);
    UICtrl.clearEditState();
    e.preventDefault();
  };

  // Clear items event
  const clearAllItemsClick = function() {
    // Delete all items from data structure
    ItemCtrl.clearAllItems();
    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();
    // Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);
    // Remove from UI
    UICtrl.removeItems();
    // Remove from localStorage
    StorageCtrl.clearItemsFromStorage();
    // Hide ul
    UICtrl.hideList();
  };
  // Public methods
  return {
    init: function() {
      // Set initial state
      UICtrl.clearEditState();
      // Fetch items from data structure
      const items = ItemCtrl.getItems();

      // Check if any items
      if(items.length === 0) {
        UICtrl.hideList();
      }else {
        UICtrl.populateItemList(items);
      }

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();
      // Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      // Load event listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();