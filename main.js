
class MasonryList {
	children = [];

    constructor(elementId, maxColumns, margin){
        // attach variables to object
        this.element = document.getElementById(elementId);
        this.maxColumns = maxColumns;
		this.margin = margin;

        // get all the children elements associated and add to children array
        this.getChildren();

        // loop to check for changes
        this.checkChildChanges();

		// add resize listener
		window.addEventListener("resize", this.resizeEvent.bind(this));
    }

    getChildren(){
        let children = this.element.children;

        // reset the list and add the new children
        this.children = [];
        let index = 0;
        let tallest = 0;

        // loop through all the children
        for(let child of children){
            // make child and set position and width
            let childObject = new MasonryItem(child);
			this.resizeElement(childObject, children, index);

            // calculate the new height of the ul to stop overflow
			tallest = this.newHeight(tallest, childObject.element.offsetHeight);

            // add child to the array and increase the index
            this.children.push(childObject);
            index++;
        }
    }

	newHeight(tallest, currentElementHeight){
		if(currentElementHeight > tallest){
			this.element.style.height = currentElementHeight + "px";
			return currentElementHeight;
		}else{
			return tallest;
		}
	}

	resizeElement(childObject, children, index){
	    let startingY = 0;
	    if(index > this.maxColumns - 1){
	        // get the postion of y of above and height
	        startingY = this.children[index - this.maxColumns].getTotalY() + this.margin;
	    }

		let elementWidth = (this.element.offsetWidth / Math.min(children.length, this.maxColumns)) - (this.margin * 2);
		let colIndex = index % this.maxColumns;
		let startingX = (colIndex * elementWidth) + (this.margin * (colIndex + 1));
		childObject.setWidthAndPosition(elementWidth, colIndex, startingY, startingX);
	}

	resizeEvent(){
		// resize all the elements in the list
		let index = 0;
		let tallest = 0;

		// loop through all children
		for(let child of this.children){
			// get the child and resize
			this.resizeElement(child, this.children, index);

			// calculate the new height of the ul to stop overflow
			tallest = this.newHeight(tallest, child.element.offsetHeight);

			index++;
		}
	}

    checkChildChanges(){
        if(this.element.children.length != this.children.length){
            // an element has been added or removed
            this.getChildren();
        }
        setTimeout(() => { this.checkChildChanges(); }, 20);
    }
}

class MasonryItem {

	constructor(element, parent){
		this.element = element;
		this.parent = parent;
	}

    setWidthAndPosition(width_px, index, changeInY, changeInX){
        // change the width
        this.element.style.width = width_px + "px";
        this.posY = changeInY;
		this.posX = changeInX;

        // calculate the positon (x and y)
        this.element.style.transform = "translateX(" + changeInX + "px) translateY(" + changeInY + "px)";
    }

	// return the height cobmined with the elemetn
	getTotalY(){
		return this.posY + this.element.offsetHeight;
	}
}
