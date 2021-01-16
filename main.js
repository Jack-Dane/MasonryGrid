
class MasonryList {
	children = [];
	heights = [];

    constructor(elementId, maxColumns, margin, minColWidth){
        this.element = document.getElementById(elementId);
        this.maxColumns = maxColumns;
		this.cols = maxColumns;
		this.margin = margin;
		this.minColWidth = minColWidth;

        this.getChildren();

        this.checkChildChanges();

		window.addEventListener("resize", this.resizeEvent.bind(this));
    }

	/*
		Gets all children which belongs to
		the Masonry Grid ul element. Creating
		them as Masontry Grid items and adding
		to this.children
	*/
    getChildren(){
        let children = this.element.children;

        this.children = [];
		this.heights = [];
        let index = 0;

        for(let child of children){
            let childObject = new MasonryItem(child, this.margin);

			this.resizeElement(childObject, children, index);

			this.newHeight(childObject.getHeight(), index);

            this.children.push(childObject);
            index++;
        }
    }

	/*
	 	Event triggered when the Masonry Grid is
		resized, going through each element and changing
		size and columns
	*/
	resizeEvent(){
		let index = 0;
		let tallest = 0;
		this.heights = [];

		if(this.children.length > 0){
			if(this.children[0].getWidth() < this.minColWidth && this.cols > 1){
				this.cols -= 1;
			}else if((this.minColWidth + this.margin) * (this.cols + 1) < this.element.offsetWidth  && this.cols < this.maxColumns){
				this.cols += 1;
			}
			console.log(this.children[0].getWidth());
		}

		for(let child of this.children){
			this.resizeElement(child, this.children, index);

			this.newHeight(child.getHeight(), index);

			index++;
		}
	}

	/*
		gets the height of each column
		the heighest column is then the
		new height of the Masonry Grid
	*/
	newHeight(currentElementHeight, index){
		this.heights[index % this.cols] = (isNaN(this.heights[index % this.cols])) ? currentElementHeight : this.heights[index % this.cols] += currentElementHeight;
		this.element.style.height = Math.max.apply(Math, this.heights) + "px";
	}

	/*
		Calculation which determins the size
		and position of each element
	*/
	resizeElement(childObject, children, index){
	    let startingY = 0;
	    if(index > this.cols - 1){
	        startingY = this.children[index - this.cols].getTotalY() + this.margin;
	    }

		let elementWidth = (this.element.offsetWidth / Math.min(children.length, this.cols)) - (this.margin * 2);
		let colIndex = index % this.cols;
		let startingX = (colIndex * elementWidth) + (this.margin * (colIndex + 1));
		childObject.setWidthAndPosition(elementWidth, colIndex, startingY, startingX);
	}

	/*
		Loop to constantly check for elemnt
		changes inside the Masonry Grid
	*/
    checkChildChanges(){
        if(this.element.children.length != this.children.length){
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

	/*
		Set width and 
	*/
    setWidthAndPosition(width_px, index, changeInY, changeInX){
        this.element.style.width = width_px + "px";
        this.posY = changeInY;
		this.posX = changeInX;

        this.element.style.transform = "translateX(" + changeInX + "px) translateY(" + changeInY + "px)";
    }

	getHeight(){
		return this.element.offsetHeight + this.margin;
	}

	getWidth(){
		return this.element.offsetWidth + this.margin;
	}

	getTotalY(){
		return this.posY + this.element.offsetHeight + this.margin;
	}
}
