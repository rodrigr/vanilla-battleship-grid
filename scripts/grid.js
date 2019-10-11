/*creates the grid structure. It requires a size, an element 
where the grid will be attached to and an id to recognized it. 
*/
const createGrid = function(size, element, id){

    let wrapper = document.createElement('DIV')//container of the grid
    wrapper.classList.add('grid-wrapper')
    
    //the first loop creates the rows of the grid 
    for(let i = 0; i < size; i++){
        let row = document.createElement('DIV')
        row.classList.add('grid-row')
        row.id =`${id}-grid-row${i}`
        wrapper.appendChild(row)// appends the row created in each itaration to the container

        //the second loop creates the amount of cells needed given the size of the grid for every row
        for(let j = 0; j < size; j++){
            let cell = document.createElement('DIV')
            cell.classList.add('grid-cell')
            //if j and i are greater than 0, the drop event is activated
            if(i > 0 && j > 0){
                cell.id = `${id}${String.fromCharCode(i - 1 + 65)}${ j }`
                cell.dataset.y = String.fromCharCode(i - 1 + 65)
                cell.dataset.x = j
                cell.addEventListener('drop', function(event) {dropShip(event)})
                cell.addEventListener('dragover',function(event) {allowDrop(event)})      
            }
            //if j is equal to 0, the cells belongs to the first colummn, so the letter is added as text node
            if(j===0 && i > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = String.fromCharCode(i+64)
                cell.appendChild(textNode)
            }
            //if i is equal to 0, the cells belongs to the first row, so the number is added as text node
            if(i === 0 && j > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = j
                cell.appendChild(textNode)
            }
            row.appendChild(cell)
        }
    }

    element.appendChild(wrapper)

    //Event to allow the drop event.
    function allowDrop(ev) {
      ev.preventDefault();
    }

    //Event to manage what happen when a ship is dropped
    function dropShip(ev) {
      ev.preventDefault();
      document.querySelector("#display p").innerText = ''
      //checks if the targeted element is a cell
      if(!ev.target.classList.contains('grid-cell')){
        document.querySelector("#display p").innerText = 'movement not allowed'
        return
      }
      //variables where the data of the ship beeing dragged is stored
      let data = ev.dataTransfer.getData("ship");
      let ship = document.getElementById(data);
      //variables where the data of the targeted cell is stored
      let cell = ev.target
      let y = cell.dataset.y.charCodeAt() - 64
      let x = parseInt(cell.dataset.x)

      //Before the ship is dropped to a cell, checks if the length of the ship exceed the grid width, 
      //If true, the drop event is aborted.
      if(ship.dataset.orientation == 'horizontal'){
        if(parseInt(ship.dataset.length) + x > 11){
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }
        for(let i = 1; i < ship.dataset.length;i++){
            let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
            let cellId = `${id}${cell.dataset.y}${parseInt(cell.dataset.x) + i}`
            if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                document.querySelector("#display p").innerText = 'careful'
                return
            }
        }
      } else{
        if(parseInt(ship.dataset.length) + y > 11){
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }

        for(let i = 1; i < ship.dataset.length;i++){
            let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
            let cellId = `${id}${String.fromCharCode(cell.dataset.y.charCodeAt() + i)}${cell.dataset.x}`
            if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                document.querySelector("#display p").innerText = 'careful'
                return
            }
        }
      }
      //Else:
      //the ship takes the position data of the targeted cell 
      ship.dataset.y = String.fromCharCode(y + 64)
      ship.dataset.x = x
      //the ship is added to the cell
      ev.target.appendChild(ship);

      checkBusyCells(ship, ev.target)
      
    }



}

createGrid(11, document.getElementById('grid'), 'ships')


function checkBusyCells(ship, cell){

    let id = (cell.id).match(new RegExp(`[^${cell.dataset.y}|^${cell.dataset.x}]`, 'g')).join('')
    let y = cell.dataset.y.charCodeAt() - 64
    let x = parseInt(cell.dataset.x)

    document.querySelectorAll(`.${ship.id}-busy-cell`).forEach(cell => {
        cell.classList.remove(`${ship.id}-busy-cell`)
    })
      
      

    for(let i = 0; i < ship.dataset.length; i++){
        if(ship.dataset.orientation == 'horizontal'){
            document.querySelector(`#${id}${String.fromCharCode(y + 64)}${x + i}`).classList.add(`${ship.id}-busy-cell`)
        }else{
            document.querySelector(`#${id}${String.fromCharCode(y + 64 + i)}${x}`).classList.add(`${ship.id}-busy-cell`)
        }
    }
}







