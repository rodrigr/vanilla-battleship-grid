/*creates the ships with the ability of been placed in the grid. 
It requires a shipType, that is, the id by wich the ship will be recongnized;
the amount of cells the ship is going to occupy in the grid;
a parent where the ship will be appended to;
and a boolean that specifies whether the ship can be moved or not.
*/
const createShips = function(shipType, length, orientation, parent, isStatic){

    let ship = document.createElement('DIV')
    let grip = document.createElement('DIV')
    let content = document.createElement('DIV')

    ship.classList.add('grid-item')
    ship.dataset.length = length
    ship.dataset.orientation = orientation
    ship.id = shipType

    if(orientation == 'vertical'){
        ship.style.transform = 'rotate(90deg)'
    }

    if(window.innerWidth >= 768){
        ship.style.width = `${length * 45}px` 
        ship.style.height = '45px'
    }else if(window.innerWidth >= 576){
        ship.style.width = `${length * 35}px` 
        ship.style.height = '35px'
    }else{
        ship.style.width = `${length * 30}px` 
        ship.style.height = '30px'
    }

    window.addEventListener('resize', () => {
        if(window.innerWidth >= 768){
            ship.style.width = `${length * 45}px` 
            ship.style.height = '45px'
        }else if(window.innerWidth >= 576){
            ship.style.width = `${length * 35}px` 
            ship.style.height = '35px'
        }else{
            ship.style.width = `${length * 30}px` 
            ship.style.height = '30px'
        }
    })
    
    if(!isStatic){
        grip.classList.add('grip')
        grip.draggable = 'true'
        grip.addEventListener('dragstart', dragShip)
        ship.addEventListener('touchmove', touchShip)
        ship.addEventListener('touchend', touchShipEnd)
        ship.appendChild(grip)
    }
    

    content.classList.add('grid-item-content')
    ship.appendChild(content)

    parent.appendChild(ship)

    if(!isStatic){
        rotateShips(shipType)
    }else{
        checkBusyCells(ship,parent)
    }
    


    //event to allow the ship beeing dragged
    function dragShip(ev){
        ev.dataTransfer.setData("ship", ev.target.parentNode.id)

    }

    //event to allow the ship beeing dragged on touch devices
    function touchShip(ev){
        // make the element draggable by giving it an absolute position and modifying the x and y coordinates
        ship.classList.add("absolute");
        
        var touch = ev.targetTouches[0];
        // Place element where the finger is
        ship.style.left = touch.pageX - 25 + 'px';
        ship.style.top = touch.pageY - 25 + 'px';
        event.preventDefault();
    }

    function touchShipEnd(ev){
        // hide the draggable element, or the elementFromPoint won't find what's underneath
        ship.style.left = '-1000px';
        ship.style.top = '-1000px';
        // find the element on the last draggable position
        var endTarget = document.elementFromPoint(
            event.changedTouches[0].pageX,
            event.changedTouches[0].pageY
            );

            
        // position it relative again and remove the inline styles that aren't needed anymore
        ship.classList.remove('absolute')
        ship.style.left = '';
        ship.style.top = '';
        // put the draggable into it's new home
        if (endTarget.classList.contains('grid-cell')) {
            let y = endTarget.dataset.y.charCodeAt() - 64
            let x = parseInt(endTarget.dataset.x)
            if(ship.dataset.orientation == 'horizontal'){
                if(parseInt(ship.dataset.length) + x > 11){
                    document.querySelector("#display p").innerText = 'movement not allowed'
                    return
                }
                for(let i = 1; i < ship.dataset.length;i++){
                    let id = (endTarget.id).match(new RegExp(`[^${endTarget.dataset.y}|^${endTarget.dataset.x}]`, 'g')).join('')
                    let cellId = `${id}${endTarget.dataset.y}${x + i}`
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
                    let id = (endTarget.id).match(new RegExp(`[^${endTarget.dataset.y}|^${endTarget.dataset.x}]`, 'g')).join('')
                    let cellId = `${id}${String.fromCharCode(endTarget.dataset.y.charCodeAt() + i)}${x}`
                    if(document.getElementById(cellId).className.search(/busy-cell/) != -1){
                        document.querySelector("#display p").innerText = 'careful'
                        return
                    }
                }
              }
            endTarget.appendChild(ship);
            ship.dataset.x = x
            ship.dataset.y = String.fromCharCode(y + 64)

            checkBusyCells(ship, endTarget)
        }else{
            document.querySelector("#display p").innerText = 'movement not allowed'
            return
        }
    }

    //event to allow the ship rotation
    function rotateShips(shipType){

        document.querySelector(`#${shipType}`).addEventListener('click', function(ev){

            document.querySelector("#display p").innerText = ''

            let ship = ev.target.parentNode
            let orientation = ship.dataset.orientation
            let cell = ship.parentElement.classList.contains('grid-cell') ? ship.parentElement : null

            if(cell != null){
                if(orientation == 'horizontal'){
                    if(parseInt(ship.dataset.length) + (cell.dataset.y.charCodeAt() - 64) > 11){
                        document.querySelector("#display p").innerText = 'careful'
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

                } else{
                    if(parseInt(ship.dataset.length) + parseInt(cell.dataset.x) > 11){
                        document.querySelector("#display p").innerText = 'careful'
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
                }
            }

            if(orientation == 'horizontal'){
                ship.dataset.orientation = 'vertical'
                ship.style.transform = 'rotate(90deg)'
                
            } else{
                ship.dataset.orientation = 'horizontal'
                ship.style.transform = 'rotate(360deg)'

            }
            if(cell != null){
                checkBusyCells(ship,cell)
            }
            
        })
    }

    
}

createShips('carrier', 5, 'horizontal', document.getElementById('dock'),false)
createShips('battleship', 4, 'horizontal', document.getElementById('dock'),false)
createShips('submarine', 3, 'horizontal', document.getElementById('dock'),false)
createShips('destroyer', 3, 'horizontal', document.getElementById('dock'),false)
createShips('patrol_boat', 2, 'horizontal', document.getElementById('dock'),false)

