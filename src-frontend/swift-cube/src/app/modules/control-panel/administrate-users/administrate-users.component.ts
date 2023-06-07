import { Component, AfterViewInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-administrate-users',
  templateUrl: './administrate-users.component.html',
  styleUrls: ['./administrate-users.component.scss']
})
export class AdministrateUsersComponent implements AfterViewInit {

  constructor(private renderer: Renderer2) { }

  ngAfterViewInit(): void {
    this.getAllUsers();

    const newCubeButton = document.getElementById("newCubeButton") as HTMLButtonElement;
    // newCubeButton.addEventListener("click", () => { this.generateNewRow() });
  }

  async getAllUsers() {
    const URL = "https://swiftcube-production.up.railway.app/users";

    const response = await fetch(URL
    ).then(response => {
      if (response.status === 200) {
        response.json().then(users => {
          users.forEach((user: any) => {
            this.createUserEditRow(user);
          });
        });
      }
    }).catch(error => {
      console.error("Error getting users data:", error);
    });
  }

  createUserEditRow(userData: any) {
    const username = userData.username;
    const isAdmin = userData.admin || false;

    const usersList = document.getElementById("usersList") as HTMLDivElement;

    const rowDiv = this.renderer.createElement("div");
    rowDiv.className = "row align-items-center";
    usersList.appendChild(rowDiv);

    /* Username input */
    let div = this.renderer.createElement("div") as HTMLDivElement;
    let label = this.renderer.createElement("label") as HTMLLabelElement;
    let input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "name";
    label.className = "dynamicLabel";
    label.textContent = "Username";
    input.type = "text";
    input.id = "username";
    input.name = "username";
    input.disabled = true;
    input.value = username;
    input.setAttribute("initial_value", username);

    /* Is Admin checkbox */
    div = this.renderer.createElement("div") as HTMLDivElement;
    label = this.renderer.createElement("label") as HTMLLabelElement;
    input = this.renderer.createElement("input") as HTMLInputElement;
    this.renderer.appendChild(rowDiv, div);
    this.renderer.appendChild(div, label);
    this.renderer.appendChild(div, input);

    div.className = "col-3";
    label.htmlFor = "movement_types";
    label.classList.add("dynamicLabel");
    label.textContent = "Admin";
    input.type = "checkbox";
    input.id = "isAdmin";
    input.name = "isAdmin";
    input.disabled = true;
    input.checked = isAdmin;

    /* Options buttons */

    //New reset password button + reorder columns

    let button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Edit";
    button.addEventListener("click", function (event) { AdministrateUsersComponent.enableEdition(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1 d-none";
    button.textContent = "Save";
    button.addEventListener("click", function (event) { AdministrateUsersComponent.updateUser(event); });

    button = this.renderer.createElement("button") as HTMLButtonElement;
    this.renderer.appendChild(rowDiv, button);
    button.className = "dynamicButton col-1";
    button.textContent = "Delete";
    button.addEventListener("click", function (event) {
      if (confirm(`Are you sure you want to delete the user ${username}?`)) AdministrateUsersComponent.deleteUser(event);
    });
  }

  static enableEdition(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const username = (rowElements[0].children[1] as HTMLInputElement);
    const isAdmin = (rowElements[1].children[1] as HTMLInputElement);

    username.disabled = false;
    isAdmin.disabled = false;

    const editButton = rowElements[2] as HTMLButtonElement;
    const saveButton = rowElements[3] as HTMLButtonElement;
    editButton.classList.add("d-none");
    saveButton.classList.remove("d-none");
  }

  static disableEdition(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const username = (rowElements[0].children[1] as HTMLInputElement);
    const isAdmin = (rowElements[1].children[1] as HTMLInputElement);

    username.disabled = true;
    isAdmin.disabled = true;

    const editButton = rowElements[2] as HTMLButtonElement;
    const saveButton = rowElements[3] as HTMLButtonElement;
    editButton.classList.remove("d-none");
    saveButton.classList.add("d-none");
  }

  static updateUser(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const oldUsername = (rowElements[0].children[1] as HTMLInputElement).getAttribute("initial_value");
    const newUsername = (rowElements[0].children[1] as HTMLInputElement).value;
    const isAdmin = (rowElements[1].children[1] as HTMLInputElement).checked;
    console.log(isAdmin);

    const encryptedPassword = 'gJKd"<M]z/;:T`vbWL]m:15t`.2cqJ';

    const URL = "https://swiftcube-production.up.railway.app/users?" + new URLSearchParams({
      oldUsername: oldUsername!,
      newUsername: newUsername
    });

    const response = fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ oldPassword: encryptedPassword, admin: isAdmin })
    }).catch(error => { console.log("Error while updating an user:", error); });

    this.disableEdition(event);
  }

  static deleteUser(event: Event) {
    const rowElements = (event.target as HTMLElement).parentNode!.children as HTMLCollection;

    const name = (rowElements[0].children[1] as HTMLInputElement).value;
    const encryptedPassword = 'NZZ"@#ks<0mk3<Q/@Q$FSoq{PVK;_a';

    const URL = `https://swiftcube-production.up.railway.app/users/${name}`;

    const response = fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "Application/json"
      },
      body: JSON.stringify({ password: encryptedPassword })
    }).then(response => {
      if (response.ok) {
        ((event.target as HTMLElement).parentNode as HTMLDivElement).remove();
        response.json().then(user => {
          if (user.username === localStorage.getItem("user.name")) AdministrateUsersComponent.toLoggedOutNavigation();
        });
      }
    }).catch(error => { console.log("Error while deleting an users:", error); });
  }

  static toLoggedOutNavigation() {
    localStorage.setItem("loggedUser", "n");
    localStorage.removeItem("user.data");
    localStorage.removeItem("user.name");
    localStorage.removeItem("room");
    window.location.href = "";
  }
}
