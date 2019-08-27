/*creates the grid structure.It requires a size, an element 
where the grid will be attached to and an id to recognized it. 
*/
const createGrid = function(size, element, id){

    let wrapper = document.createElement('DIV')
    wrapper.classList.add('grid-wrapper')
    
    for(let i = 0; i < size; i++){
        let row = document.createElement('DIV')
        row.classList.add('grid-row')
        row.id =`${id}-grid-row${i}`
        wrapper.appendChild(row)

        for(let j = 0; j < size; j++){
            let cell = document.createElement('DIV')
            cell.classList.add('grid-cell')
            if(i > 0 && j > 0){
                cell.id = `${id}${String.fromCharCode(i - 1 + 65)}${ j }`
                cell.dataset.y = String.fromCharCode(i - 1 + 65)
                cell.dataset.x = j
                cell.addEventListener('drop', function(event) {dropShip(event)})
                cell.addEventListener('dragover',function(event) {allowDrop(event)})      
            }
            if(j===0 && i > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = String.fromCharCode(i+64)
                cell.appendChild(textNode)
            }
            if(i === 0 && j > 0){
                let textNode = document.createElement('SPAN')
                textNode.innerText = j
                cell.appendChild(textNode)
            }
            row.appendChild(cell)
        }
    }

    element.appendChild(wrapper)

    //Events
    function allowDrop(ev) {
      ev.preventDefault();
    }


    function dropShip(ev) {
      ev.preventDefault();
      let data = ev.dataTransfer.getData("ship");
      let ship = document.getElementById(data);
      let y = ev.target.dataset.y.charCodeAt() - 64
      let x = parseInt(ev.target.dataset.x)

      if(ship.dataset.orientation == 'horizontal'){
        if(parseInt(ship.dataset.length) + x > 11){
            return
        }
      } else{
        if(parseInt(ship.dataset.length) + y > 11){
            return
        }
      }
      

      ship.dataset.y = String.fromCharCode(y + 64)
      ship.dataset.x = x
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




