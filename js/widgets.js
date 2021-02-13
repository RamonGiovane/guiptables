export function dangerModal(title, confirmCallBack){
            
    document.getElementById("danger-modal-title").innerText = title;
    document.getElementById("danger-confirm-button").onclick = confirmCallBack;    

}
