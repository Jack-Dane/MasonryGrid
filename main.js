
class MasonryList {
	children = [];
	heights = [];

    constructor(elementId, maxColumns, margin, minColWidth){
        // attach variables to object
        this.element = document.getElementById(elementId);
        this.maxColumns = maxColumns;
		this.cols = maxColumns;
		this.margin = margin;
		this.minColWidth = minColWidth;

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
		this.heights = [];
        let index = 0;

        // loop through all the children
        for(let child of children){
            // make child and set position and width
            let childObject = new MasonryItem(child, this.margin);
			this.resizeElement(childObject, children, index);

            // calculate the new height of the ul to stop overflow
			this.newHeight(childObject.getHeight(), index);

            // add child to the array and increase the index
            this.children.push(childObject);
            index++;
        }
    }

	newHeight(currentElementHeight, index){
		this.heights[index % this.cols] = (isNaN(this.heights[index % this.cols])) ? currentElementHeight : this.heights[index % this.cols] += currentElementHeight;
		this.element.style.height = Math.max.apply(Math, this.heights) + "px";
	}

	resizeElement(childObject, children, index){
	    let startingY = 0;
	    if(index > this.cols - 1){
	        // get the postion of y of above and height
	        startingY = this.children[index - this.cols].getTotalY() + this.margin;
	    }

		let elementWidth = (this.element.offsetWidth / Math.min(children.length, this.cols)) - (this.margin * 2);
		let colIndex = index % this.cols;
		let startingX = (colIndex * elementWidth) + (this.margin * (colIndex + 1));
		childObject.setWidthAndPosition(elementWidth, colIndex, startingY, startingX);
	}

	resizeEvent(){
		// resize all the elements in the list
		let index = 0;
		let tallest = 0;
		this.heights = [];

		// check to see if the number of columns needs to be increased or reduced
		if(this.children.length > 0){
			if(this.children[0].getWidth() < this.minColWidth && this.cols > 1){
				this.cols -= 1;
			}else if((this.minColWidth + this.margin) * (this.cols + 1) < this.element.offsetWidth  && this.cols < this.maxColumns){
				this.cols += 1;
			}
			console.log(this.children[0].getWidth());
		}

		// loop through all children
		for(let child of this.children){
			// get the child and resize
			this.resizeElement(child, this.children, index);

			// calculate the new height of the ul to stop overflow
			this.newHeight(child.getHeight(), index);

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

	constructor(element, margin){
		this.element = element;
		this.margin = margin;
	}

    setWidthAndPosition(width_px, index, changeInY, changeInX){
        // change the width
        this.element.style.width = width_px + "px";
        this.posY = changeInY;
		this.posX = changeInX;

        // calculate the positon (x and y)
        this.element.style.transform = "translateX(" + changeInX + "px) translateY(" + changeInY + "px)";
    }

	getHeight(){
		return this.element.offsetHeight + this.margin;
	}

	getWidth(){
		return this.element.offsetWidth + this.margin;
	}

	// return the height cobmined with the elemetn
	getTotalY(){
		return this.posY + this.element.offsetHeight;
	}
}
