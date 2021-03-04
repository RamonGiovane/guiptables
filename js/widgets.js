
export function dangerModal(title, confirmCallback){
            
    document.getElementById("danger-modal-title").innerText = title;
    document.getElementById("danger-confirm-button").onclick = confirmCallback;    

}


export function ruleModal(title, interfaces, applyCallback){

    let interfacesOptionsHTML = "";
    
    interfaces.forEach(i => {
        
        if(!i) return;

        interfacesOptionsHTML += 
        `
        <option value="${i}-item">${i}</option>
        `
    });

    document.getElementById("rule-modal-title").innerText = title;
    document.getElementById("rule-confirm-button").onclick = applyCallback; 
    document.getElementById("intput-interface-rule-menu").innerHTML = interfacesOptionsHTML;
    document.getElementById("output-interface-rule-menu").innerHTML = interfacesOptionsHTML;
    
}




export function errorMessage(operationTried, message){
 debugger
    let div = document.createElement("div");
    div.className = "alert alert-danger";
    div.innerHTML =
    `
    <span class="pficon pficon-error-circle-o"></span>
    <strong>Failed to ${operationTried}</strong>. ${message} 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">Close</button>
    `;

    let board = document.getElementById("message-board");

    board.appendChild(div);

}

