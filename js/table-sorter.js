// Query the table
const table = document.getElementById('table');

const mouseDownHandler = function(e) {
    

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

const mouseMoveHandler = function(e) {
    
};

const mouseUpHandler = function() {
    
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
};

// Query all rows
table.querySelectorAll('tr').forEach(function(row, index) {
    // Ignore the header
    // We don't want user to change the order of header
    if (index === 0) {
        return;
    }

    // Get the first cell of row
    const firstCell = row.firstElementChild;
    firstCell.classList.add('draggable');

    // Attach event handler
    firstCell.addEventListener('mousedown', mouseDownHandler);
});