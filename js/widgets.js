import * as bootstrap from "../bootstrap/bootstrap.min.js";

export function dangerModal(title, confirmCallBack){
            
    document.getElementById("danger-modal-title").innerText = title;
    document.getElementById("danger-confirm-button").onclick = confirmCallBack;    

}

export function ruleModal(title, confirmCallBack){
            
    document.getElementById("rule-modal-title").innerText = title;
    document.getElementById("rule-confirm-button").onclick = confirmCallBack;    

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

