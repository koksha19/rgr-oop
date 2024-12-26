import Cell from "./cell.js";

class Row {
    constructor(data) {
        this.cells = data.map(value => new Cell(value));
    }

    getCell(index) {
        return this.cells[index];
    }

    getRowValues() {
        return this.cells.map(cell => cell.getValue());
    }
}

export default Row;
