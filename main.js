
class MasonryList {
	children = [];

    constructor(elementId, maxColumns){
        // get the element and attach to object
        this.element = document.getElementById(elementId);
        this.maxColumns = maxColumns;

        // get all the children elements associated and add to children array
        this.getChildren();

        // loop to check for changes
        this.checkChildChanges();
    }

    getChildren(){
        let children = this.element.children;

        // reset the list and add the new children
        this.children = [];
        let index = 0;
        let tallest = 0;

        // loop through all the children
        for(let child of children){
            // new row
            let startingY = 0;
            if(index > this.maxColumns - 1){
                // get the postion of y of above and height
                startingY = this.children[index - this.maxColumns].element.offsetHeight + this.children[index - this.maxColumns].posY;
            }

            // make child and set position and width
            let childObject = new MasonryItem(child);
            childObject.setWidthAndPosition(this.element.offsetWidth / Math.min(children.length, this.maxColumns), index % this.maxColumns, startingY);

            // calculate the new height of the ul to stop overflow
            if(child.offsetHeight > tallest){
                this.element.style.height = child.offsetHeight + "px";
                tallest = child.offsetHeight;
            }

            // add child to the array and increase the index
            this.children.push(childObject);
            index++;
        }
    }

    checkChildChanges(){
        if(this.element.children.length != this.children.length){
            // an element has been added or removed
            this.getChildren();
        }
        setTimeout(() => { this.checkChildChanges(); }, 10);
    }
}

class MasonryItem {

	constructor(element){
		this.element = element;
	}

    setWidthAndPosition(width_px, index, changeInY){
        // change the width
        this.element.style.width = width_px + "px";
        this.posY = changeInY;

        // calculate the positon (x and y)
        let changeInX = index * width_px;
        this.element.style.transform = "translateX(" + changeInX + "px) translateY(" + changeInY + "px)";
    }
}
