let modal = $('#defaultModal');
let modalTitle = $('.modal-title');
let modalBody = $('.modal-body');
let modalFooter = $('.modal-footer');
let primaryButton = $('<button type="button" class="btn btn-primary"></button>');
let dismissButton = $('<button type="button" class="btn btn-secondary" data-dismiss="modal"></button>');
let dangerButton = $('<button type="button" class="btn btn-danger"></button>');



$(function () {
    const url = window.location.href;
    if (url.includes('/user/')) {
        $('#v-pills-tab a[href="#v-pills-profile"]').tab('show');
        document.title = 'User Page';
    }
});

$(document).ready(function () {
    viewAllUsers();
    defaultModal();
    addUser();
})


$(function () {
    $('#v-pills-tabContent a[href="#nav-profile"]').on("click", function (e) {
        e.preventDefault();

    })
});

 onInputChange('#userCreateForm');



function defaultModal() {
    modal.modal({
        keyboard: true,
        backdrop: "static",
        show: false,
    }).on("show.bs.modal", function (event) {
        let button = $(event.relatedTarget);
        let id = button.data('id');
        let action = button.data('action');
        switch (action) {

            case 'deleteUser':
                deleteUser($(this), id);
                break;
            case 'editUser':
                editUser($(this), id);
                break;
        }
    }).on('hidden.bs.modal', function (event) {
        $(this).find('.modal-title').html('');
        $(this).find('.modal-body').html('');
        $(this).find('.modal-footer').html('');
    });
}

async function viewAllUsers() {
    $('#usersTable tbody').empty();
    const usersResponse = await userService.findAll();
    const usersJson = usersResponse.json();
    usersJson.then(users => {
        users.forEach(user => {
            let newRow = `$(<tr>
                        <th >${user.id}</th>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>                             
                        <td>${user.roles.map((item) => item.role).join(" ")}</td>                      
                            
                        <td><button class="btn btn-info " data-id="${user.id}" data-action="editUser" data-toggle="modal" data-target="#defaultModal">Edit</button></td>       
                        <td> <button class="btn btn-danger" data-id="${user.id}" data-action="deleteUser" data-toggle="modal" data-target="#defaultModal">Delete</button></td>      
                        
                    </tr>)`;
            $('#usersTable tbody').append(newRow);
        });
    });
}




async function addUser() {

    let userCreateForm = $("#userCreateForm");
    userCreateForm.find('#multiSelect')
        .find('option')
        .remove()
        .end()

    const rolesResponse = await rolesService.findAll();
    const rolesJson = rolesResponse.json();

    rolesJson.then(roles => {
        roles.forEach(role => {
            userCreateForm.find('#multiSelect').append(new Option(role.authority, role.id));
        });
    });


    $('#create_user').click(async function (e) {
        e.preventDefault()

        let {firstName, lastName, age, email, password, rolesId} = getFormValues(userCreateForm);

        if ([firstName, lastName, age, email, password, rolesId].some(field => field === '' || field.length === 0)) {
            showValidationInfo(userCreateForm);
        } else {
            const roles = rolesId.map((role) => ({id: role.value}));
            let data = {
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: password,
                roles: roles,

            };

            const userResponse = await userService.add(data);

            if (userResponse.status === 201) {
                viewAllUsers();
                $('#v-pills-tabContent a[href="#nav-home"]').trigger('click');

                $('#userCreateForm').find('input:text, input:password, select')
                    .each(function () {
                        $(this).val('');
                    });
            }
        }
    });
}


async function editUser(modal, id) {
    const userResponse = await userService.findById(id);
    const userJson = userResponse.json();
    const rolesResponse = await rolesService.findAll();
    const rolesJson = rolesResponse.json();


    let passwordField = `<label for="password">Password</label>
                <input required class="form-control" id="password" placeholder="Password" type="password"
                       />`

    modifyModal(modal, 'Edit');
  onInputChange(modal);

    modal.find('#email').after(passwordField);

    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName).prop('disabled', false);
        modal.find('#lastName').val(user.lastName).prop('disabled', false);
        modal.find('#age').val(user.age).prop('disabled', false);
        modal.find('#email').val(user.email).prop('disabled', false);
        modal.find('#password').val(user.password).prop('disabled', false);

        rolesJson.then(roles => {
            roles.forEach(role => {
                modal.find('#multiSelect').append(new Option(role.authority, role.id)).prop('disabled', false);
            });
        });
    });


    $('#updateUserButton').click(async function (e) {
        let id = modal.find('#id').val().trim();
        let {firstName, lastName, age, email, password, rolesId} = getFormValues(modal);

        if ([firstName, lastName, age, email, password, rolesId].some(field => field === '' || field.length === 0)) {
            showValidationInfo(modal);
        }else {

            const roles = rolesId.map((role) => ({id: role.value, role: role.text, authority: role.text}));

            let data = {
                id: id,
                firstName: firstName,
                lastName: lastName,
                age: age,
                email: email,
                password: password,
                roles: roles,

            };

            const updateUserResponse = await userService.update(id, data);
            if (updateUserResponse.status === 200) {
                viewAllUsers();
                $('#defaultModal').modal('hide');
                $("#top-nav").load(" #top-nav > *");
                $("#user_info_table").load(" #user_info_table > *");
            }
        }
    });
}


async function deleteUser(modal, id) {
    const userResponse = await userService.findById(id);
    const userJson = userResponse.json();

    modifyModal(modal, 'Delete');
    userJson.then(user => {
        modal.find('#id').val(user.id);
        modal.find('#firstName').val(user.firstName);
        modal.find('#lastName').val(user.lastName);
        modal.find('#age').val(user.age);
        modal.find('#email').val(user.email);
        modal.find('#multiSelect').append(user.roles.map((item) => new Option(item.role, item.id)));

    });

    $('#deleteUserButton').click(async function (e) {
        const bookResponse = await userService.delete(id);
        if (bookResponse.status === 204) {
            viewAllUsers();
            $('#defaultModal').modal('hide');
        }
    });
}


const http = {
    fetch: async function (url, options = {}) {
        return await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options,
        });
    }
};


const userService = {
    findAll: async () => {
        return await http.fetch('/api/admin/users');
    },
    add: async (data) => {
        return await http.fetch('/api/admin', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    findById: async (id) => {
        return await http.fetch('/api/admin/users/' + id);
    },
    delete: async (id) => {
        return await http.fetch('/api/admin/users/' + id, {
            method: 'DELETE'
        });
    },
    update: async (id, data) => {
        return await http.fetch('/api/admin/users/' + id, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    },

};

const rolesService = {
    findAll: async () => {
        return await http.fetch('/api/roles');
    },
};


function getFormValues(userCreateForm) {
    let firstName = userCreateForm.find('#firstName').val().trim();
    let lastName = userCreateForm.find('#lastName').val().trim();
    let age = userCreateForm.find('#age').val().trim();
    let email = userCreateForm.find('#email').val().trim();
    let password = userCreateForm.find('#password').val().trim();
    let rolesId = userCreateForm.find('#multiSelect option:selected').map(function () {
        return this;
    }).get();

    return {firstName, lastName, age, email, password, rolesId};
}

function modifyModal(modal, submitButtonName) {
    modal.find(modalTitle).html(submitButtonName + ' user');
    let userFormHidden = $('.userForm:hidden')[0];
    modal.find(modalBody).html($(userFormHidden).clone());
    let userForm = modal.find('.userForm');
    modal.find(userForm).show();
    dismissButton.html('Close');
    modal.find(modalFooter).append(dismissButton);
    if (submitButtonName === 'Delete') {
        modal.find(modalFooter).append(dangerButton);
        dangerButton.prop('id', 'deleteUserButton');
        dangerButton.html(submitButtonName);
    } else if (submitButtonName === 'Edit') {
        modal.find(modalFooter).append(primaryButton);
        primaryButton.prop('id', 'updateUserButton');
        primaryButton.html(submitButtonName);
    }
}

function showValidationInfo(form) {
    $(form).find('input,select')
        .each(function () {
            if ($(this).val() === '' || $(this).val().length === 0) {
                form.find('#' + $(this).attr('id')).addClass('is-invalid');
            }
        });
}

function onInputChange(form) {
    $(form).on('input', function () {
        $(form).find('input,select')
            .each(function () {
                $(form).find('#' + $(this).attr('id')).removeClass('is-invalid');
            });
    });
}