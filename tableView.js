import Row from "./row.js";

class TableViewClass {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.tableData = [];
        this.originalData = [];
        this.columnHeaders = [];
        this.sortState = {};
    }

    loadTable(data) {
        this.columnHeaders = data[0];
        this.tableData = data.slice(1).map((row, index) => new Row([index + 1, ...row]));
        this.originalData = this.deepCopyData(this.tableData);
        this.renderTable();
    }

    deepCopyData(data) {
        return data.map(row => row);
    }

    renderTable() {
        this.container.innerHTML = '';
        const table = document.createElement('table');
        table.classList.add('data-table');

        const headerRow = document.createElement('tr');
        const number = this.createHeaderCell('№', 0, true);
        headerRow.appendChild(number);
        this.columnHeaders.forEach((header, index) => {
            const cell = this.createHeaderCell(header, index + 1, false);
            headerRow.appendChild(cell);
        });
        table.appendChild(headerRow);

        this.tableData.forEach(row => {
            const rowElement = document.createElement('tr');
            row.getRowValues().forEach(cell => {
                const cellElement = document.createElement('td');
                cellElement.textContent = cell;
                rowElement.appendChild(cellElement);
            });
            table.appendChild(rowElement);
        });
        this.container.appendChild(table);
    }

    createHeaderCell(headerText, columnIndex, isFirstColumn) {
        const th = document.createElement('th');
        const text = document.createElement('div');
        text.textContent = headerText;
        text.classList.add('sortable-header');
        th.appendChild(text);

        const tooltip = document.createElement('div');
        tooltip.textContent = 'Натисніть для сортування';
        tooltip.classList.add('tooltip');
        tooltip.style.display = 'none';

        document.body.appendChild(tooltip);

        text.addEventListener('mouseover', (event) => {
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.style.display = 'block';
        });

        text.addEventListener('mouseout', () => {
            tooltip.style.display = 'none';
        });

        text.addEventListener('click', () => {
            tooltip.remove();
            if (isFirstColumn) {
                this.sortByFirstColumn();
            } else {
                this.sortByColumn(columnIndex);
            }
        });

        return th;
    }

    sortByColumn(columnIndex) {
        const currentState = this.sortState[columnIndex];
        let direction;

        if (currentState === 'asc') {
            direction = 'desc';
        } else if (currentState === 'desc') {
            direction = null;
        } else {
            direction = 'asc';
        }

        this.sortState[columnIndex] = direction;

        if (!direction) {
            this.tableData = this.deepCopyData(this.originalData);
        } else {
            const comparator = (a, b) => {
                /*const cell1 = a.getCell(columnIndex);
                const cell2 = b.getCell(columnIndex);*/

                const valA = a.getCell(columnIndex).getValue();
                const valB = b.getCell(columnIndex).getValue();

                return direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
            };
            this.tableData.sort(comparator);
        }
        this.renderTable();
    }

    sortByFirstColumn() {
        this.tableData.reverse();
        this.renderTable();
    }
}

export default TableViewClass;