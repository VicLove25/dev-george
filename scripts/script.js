
$(document).ready(function() {

    const loginModal = new bootstrap.Modal($('#loginModal'));
    const loginBtn = $('#loginBtn');
    const navbarText = $('.navbar-brand');

    loginBtn.on('click', function() {
        loginModal.show();
    });

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const username = $('#username').val();
        navbarText.text(`Welcome, ${username}!`);
        loginBtn.text('Logout');
        loginModal.hide();

        loginBtn.off('click').on('click', function() {
            navbarText.text('🦭My Projects');
            loginBtn.text('Login');
            loginBtn.off('click').on('click', function() {
                loginModal.show();
            });
        });
    });

    
    
// doc ready f/n
        $("#saveStat").on("click", function(){
        let statusText = underConstruction("not ready");
        $("#saveStat").text(statusText).prop("disabled", true);
        });
    
        function underConstruction(status) {
    // get input
        return 'not ready'
    }

 let playerData = []; // To store the loaded player data

 function loadPlayerData() {
     fetch('data.json')
         .then(response => response.json())
         .then(jsonData => {
             playerData = jsonData;
             displayPlayerData(playerData);
         })
         .catch(error => console.error('Error loading player data:', error));
 }

 function displayPlayerData(players) {
     dataContainer.empty(); // Clear previous data
     players.forEach(player => {
         const playerDiv = $(`<div class="player-item" data-id="${player.id}">
                             <h3>${player.name}</h3>
                             <p>Position: ${player.position}</p>
                             <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                             <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                           </div>`);
         dataContainer.append(playerDiv);
     });
     $('.edit-btn').on('click', function() {
        // ... (your existing edit button logic) ...
    });

    $('.delete-btn').on('click', function() {
        const itemIdToDelete = parseInt($(this).closest('.player-item').data('id'));
        playerIdToDelete = itemIdToDelete; // Store the ID of the player to delete
        deleteConfirmationModal.show(); // Show the confirmation modal
    });
    loadPlayerData();
}

$('#confirmDeleteBtn').on('click', function() {
    if (playerIdToDelete !== null) {
        playerData = playerData.filter(player => player.id !== playerIdToDelete);
        displayPlayerData(playerData); // Re-render the data
        playerIdToDelete = null; // Reset the ID
        deleteConfirmationModal.hide();
    }
});

    const newItemForm = $('#newItemForm');
    const saveNewItemBtn = $('#saveNewItem');
    const loadSampleBtn = $('#loadSample');
    let nextId = playerData.length > 0 ? Math.max(...playerData.map(player => player.id)) + 1 : 1; // Determine the next unique ID

    saveNewItemBtn.on('click', function() {
        const newName = $('#newName').val();
        const newPosition = $('#newPosition').val();

        if (newName && newPosition) {
            const newItem = {
                id: nextId++,
                name: newName,
                position: newPosition
            };
            playerData.push(newItem);
            displayPlayerData(playerData);
            newItemForm[0].reset(); // Clear the form
        } else {
            alert('Please fill in both name and position.');
        }
    });

    loadSampleBtn.on('click', function() {
        $('#newName').val('Potential New Player');
        $('#newPosition').val('Guard/Forward');
    });

    function displayPlayerData(players) {
        dataContainer.empty();
        players.forEach(player => {
            const playerDiv = $(`<div class="player-item" data-id="${player.id}">
                                <h3>${player.name}</h3>
                                <p>Position: ${player.position}</p>
                                <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                                <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                              </div>`);
            dataContainer.append(playerDiv);
        });
    
        // Event listener for edit buttons (needs to be inside displayPlayerData after they are created)
        $('.edit-btn').on('click', function() {
            const itemDiv = $(this).closest('.player-item');
            const itemId = parseInt(itemDiv.data('id'));
            const player = playerData.find(p => p.id === itemId);
    
            if (player) {
                itemDiv.html(`
                    <input type="text" class="form-control mb-2 edit-name" value="${player.name}">
                    <input type="text" class="form-control mb-2 edit-position" value="${player.position}">
                    <button class="btn btn-sm btn-success save-edit-btn">Save</button>
                    <button class="btn btn-sm btn-secondary cancel-edit-btn">Cancel</button>
                `);
    
                itemDiv.find('.save-edit-btn').on('click', function() {
                    const newName = itemDiv.find('.edit-name').val();
                    const newPosition = itemDiv.find('.edit-position').val();
                    const playerIndex = playerData.findIndex(p => p.id === itemId);
    
                    if (playerIndex !== -1) {
                        playerData[playerIndex] = { id: itemId, name: newName, position: newPosition };
                        displayPlayerData(playerData); // Re-render the data
                    }
                });
    
                itemDiv.find('.cancel-edit-btn').on('click', function() {
                    displayPlayerData(playerData); // Re-render to show original data
                });
            }
        });
    
        // We'll add the delete button listener in the next step
    }
    const exportDataBtn = $('#exportData');

    exportDataBtn.on('click', function() {
        console.log(JSON.stringify(playerData, null, 2));
    });
});

