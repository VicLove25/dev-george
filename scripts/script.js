$(document).ready(function() {
    const loginModal = new bootstrap.Modal($('#loginModal'));
    const loginBtn = $('#loginBtn');
    const navbarText = $('.navbar-brand');
    const dataContainer = $('#data-container');
    const deleteConfirmationModal = new bootstrap.Modal($('#deleteConfirmationModal'));
    const confirmDeleteBtn = $('#confirmDeleteBtn');
    const newItemForm = $('#newItemForm');
    const saveNewItemBtn = $('#saveNewItem');
    const loadSampleBtn = $('#loadSample'); 
    const exportDataBtn = $('#exportData');

   // Data
    let playerData = [];
    let playerIdToDelete = null;
    let nextId = 1; // Initialize nextId

    // old save input button that doesn't work
    function underConstruction(status) {
        return 'not ready';
    }

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
    

        // Edit and Delete Buttons
    $('.edit-btn').on('click', function() {
        console.log('edittt');
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
                    displayPlayerData(playerData); 
                }
            });

            itemDiv.find('.cancel-edit-btn').on('click', function() {
                displayPlayerData(playerData);
            });
        }
    });

    $('.delete-btn').on('click', function() {
        const itemIdToDelete = parseInt($(this).closest('.player-item').data('id'));
        playerIdToDelete = itemIdToDelete;
        deleteConfirmationModal.show();
    });
     
};

    function loadPlayerData() {
        fetch('data/pelicansPotentialData.json')
            .then(response => response.json())
            .then(jsonData => {
                playerData = jsonData;
                if (playerData.length > 0) {
                    nextId = Math.max(...playerData.map(player => player.id)) + 1;
                } else {
                    nextId = 1;
                }
                displayPlayerData(playerData);
            })
            .catch(error => console.error('Error loading player data:', error));
    }
    
    // Login Button/Form
    loginBtn.on('click', function() {
        loginModal.show();
    });

    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const username = $('#username').val();
        navbarText.text(`Welcome, ${username}`);
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

    $("#saveStat").on("click", function(){
        let statusText = underConstruction("not ready");
        $("#saveStat").text(statusText).prop("disabled", true);
    });
    // Confirmation Button
    confirmDeleteBtn.on('click', function() {
        if (playerIdToDelete !== null) {
            playerData = playerData.filter(player => player.id !== playerIdToDelete);
            displayPlayerData(playerData);
            playerIdToDelete = null;
            deleteConfirmationModal.hide();
        }
    });
    // New Player
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
            newItemForm[0].reset();
        } else {
            alert('Please fill in both name and position.');
        }
    });

    loadSampleBtn.on('click', function() {
        $('#newName').val('Potential New Player');
        $('#newPosition').val('Guard/Forward');
    }); 

    // Export Data
    exportDataBtn.on('click', function() {
        console.log('anythgion');
        console.log(JSON.stringify(playerData, null, 2));
    });
    // exportDataBtn.on('click', function() {
    //     console.log('Export button clicked!');
    // });

    loadPlayerData(); 

});
